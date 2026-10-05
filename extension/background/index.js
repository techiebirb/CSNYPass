import browser from "webextension-polyfill";
import {
  LOCK_MODES,
  normalizeSettings,
  validateSettingsForSave,
} from "../../shared/settings-schema.js";
import {
  RELOCK_ALARM,
  clearDekCache,
  clearExtensionStorageData,
  hasStoredSettingsEnvelope,
  loadDecryptedSettingsResult,
  loadProfile,
  readDekCache,
  saveEncryptedSettings,
} from "./storage-crypto.js";
import {
  buildLockMetaFromSetup,
  clearLockStorageData,
  getLockMode,
  isLockConfigured,
  loadLockMeta,
  saveLockMeta,
  verifyUnlockPassword,
} from "./settings-lock.js";
import {
  describeBiometric,
  enrollBiometric,
  moveToAutoMode,
  unlockWithPrf,
  updateBiometricPolicy,
} from "./biometric-vault.js";
import { sessionGet, sessionRemove, sessionSet } from "./session-store.js";

const HOST_PATTERNS = [
  "*://collegiateschool.myschoolapp.com/*",
  "*://csny.onelogin.com/*",
  "*://app.blackbaud.com/*",
];

const AUTOMATION_HOSTS = new Set([
  "collegiateschool.myschoolapp.com",
  "csny.onelogin.com",
  "app.blackbaud.com",
]);

/** The only host that ever receives the saved password (or may ask for the unlock). */
const PASSWORD_HOST = "csny.onelogin.com";

const UNLOCK_SESSION_TTL_MS = 30 * 60 * 1000;
const UNLOCK_SESSIONS_KEY = "csnyExtension.unlockSessions.v1";
const PROMPT_STATE_KEY = "csnyExtension.prompt.v1";
/** After the unlock window is dismissed, wait this long before auto-opening it again. */
const PROMPT_COOLDOWN_MS = 60 * 1000;
const SETTINGS_CORRUPT_MESSAGE =
  "Saved settings could not be read. Clear all saved data to start over.";
const SAME_AS_LOGIN_PASSWORD_MESSAGE =
  "Your OneLogin password unlocks settings. Choose a separate settings password under protection before removing it.";
const BIOMETRIC_LOCKED_MESSAGE = "Unlock with Touch ID / Face ID first.";
const CONTEXT_MENU_SETTINGS_ID = "collegiate-open-settings";
const CONTEXT_MENU_PAUSE_ID = "collegiate-pause";
const CONTEXT_MENU_RESUME_ID = "collegiate-resume";
const PAUSE_KEY = "csnyExtension.pausedUntil.v1";
const PAUSE_ALARM = "csny-resume";
const PAUSE_DURATION_MS = 60 * 60 * 1000;

function isExtensionPageSender(sender) {
  const url = sender?.url || "";
  return url.startsWith(browser.runtime.getURL(""));
}

function isContentScriptSender(sender) {
  if (!sender?.tab?.url) return false;
  try {
    const parsed = new URL(sender.tab.url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname;
    return AUTOMATION_HOSTS.has(host);
  } catch {
    return false;
  }
}

function senderHost(sender) {
  try {
    return new URL(sender?.tab?.url || "").hostname;
  } catch {
    return "";
  }
}

// ---- Settings-screen unlock sessions (survive service-worker restarts) ---------

async function createUnlockSession() {
  const sessions = (await sessionGet(UNLOCK_SESSIONS_KEY)) || {};
  const now = Date.now();
  for (const [nonce, expiresAt] of Object.entries(sessions)) {
    if (expiresAt < now) delete sessions[nonce];
  }
  const nonce = crypto.randomUUID();
  sessions[nonce] = now + UNLOCK_SESSION_TTL_MS;
  await sessionSet(UNLOCK_SESSIONS_KEY, sessions);
  return nonce;
}

async function isUnlockSessionValid(nonce) {
  if (!nonce || typeof nonce !== "string") return false;
  const sessions = (await sessionGet(UNLOCK_SESSIONS_KEY)) || {};
  const expiresAt = sessions[nonce];
  return typeof expiresAt === "number" && Date.now() <= expiresAt;
}

function clearUnlockSessions() {
  return sessionRemove(UNLOCK_SESSIONS_KEY);
}

// ---- Tabs and unlock window ----------------------------------------------------

async function broadcast(message) {
  const tabs = await browser.tabs.query({ url: HOST_PATTERNS });
  for (const tab of tabs) {
    if (tab.id == null) continue;
    try {
      await browser.tabs.sendMessage(tab.id, message);
    } catch {
      /* tab may not have content script yet */
    }
  }
}

const broadcastSettingsChanged = async () => {
  await updateBadge();
  await broadcast({ type: "SETTINGS_CHANGED" });
};
const broadcastSettingsLocked = async () => {
  await updateBadge();
  await broadcast({ type: "SETTINGS_LOCKED" });
};

// ---- Pause (session-only; a browser restart ends it) ---------------------------

async function isPaused() {
  const until = await sessionGet(PAUSE_KEY);
  return typeof until === "number" && Date.now() < until;
}

async function syncPauseMenu() {
  try {
    const paused = await isPaused();
    await browser.contextMenus.update(CONTEXT_MENU_PAUSE_ID, { visible: !paused });
    await browser.contextMenus.update(CONTEXT_MENU_RESUME_ID, { visible: paused });
  } catch {
    /* menus not registered yet */
  }
}

async function setPaused(paused) {
  if (paused) {
    const until = Date.now() + PAUSE_DURATION_MS;
    await sessionSet(PAUSE_KEY, until);
    await browser.alarms?.create(PAUSE_ALARM, { when: until });
  } else {
    await sessionRemove(PAUSE_KEY);
    await browser.alarms?.clear(PAUSE_ALARM);
  }
  await syncPauseMenu();
  await broadcastSettingsChanged();
}

// ---- Toolbar badge: LOCK = password still locked, OFF = automation not running ----

async function updateBadge() {
  try {
    let text = "";
    if (await isPaused()) {
      text = "OFF";
    } else if (await isBiometricLocked()) {
      const profile = await loadProfile();
      if (profile?.enabled === false) text = "OFF";
      else if (!profile || profile.hasPassword) text = "LOCK";
    } else {
      const result = await loadDecryptedSettingsResult();
      if (result.ok && result.settings.enabled === false) text = "OFF";
    }
    await browser.action?.setBadgeText?.({ text });
    await browser.action?.setBadgeBackgroundColor?.({
      color: text === "LOCK" ? "#b45309" : "#6b7280",
    });
  } catch {
    /* the badge is cosmetic */
  }
}

/** True when Touch ID / Face ID mode is on but autofill hasn't been unlocked. */
async function isBiometricLocked() {
  if ((await getLockMode()) !== LOCK_MODES.BIOMETRIC) return false;
  const cached = await readDekCache();
  return !cached?.forSignIn;
}

/**
 * Tell login tabs to re-fetch settings only when they can actually get them. Otherwise
 * (e.g. saving settings in "every sign-in" mode) they'd just pop an unlock window.
 */
async function broadcastSettingsChangedIfReady() {
  if (await isBiometricLocked()) {
    await updateBadge();
    return;
  }
  await broadcastSettingsChanged();
}

let promptInFlight = null;

function openUnlockWindow({ force = false } = {}) {
  promptInFlight ??= (async () => {
    const state = (await sessionGet(PROMPT_STATE_KEY)) || {};
    if (state.windowId != null) {
      try {
        await browser.windows.update(state.windowId, { focused: true });
        return;
      } catch {
        /* window is gone */
      }
    }
    if (!force && Date.now() - (state.lastAt || 0) < PROMPT_COOLDOWN_MS) return;

    await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now() });
    const width = 420;
    const height = 380;
    const position = {};
    try {
      const parent = await browser.windows.getLastFocused();
      if (parent.left != null && parent.width && parent.top != null && parent.height) {
        position.left = Math.max(0, Math.round(parent.left + (parent.width - width) / 2));
        position.top = Math.max(0, Math.round(parent.top + (parent.height - height) / 2));
      }
    } catch {
      /* no parent window; let the browser place it */
    }
    const win = await browser.windows.create({
      url: browser.runtime.getURL("popup/unlock.html"),
      type: "popup",
      width,
      height,
      ...position,
      focused: true,
    });
    await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now(), windowId: win.id });
  })()
    .catch(() => {})
    .finally(() => {
      promptInFlight = null;
    });
  return promptInFlight;
}

browser.windows?.onRemoved.addListener(async (windowId) => {
  const state = await sessionGet(PROMPT_STATE_KEY);
  if (state?.windowId === windowId) {
    await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now() });
  }
});

/** Cache is gone (expired, or "every sign-in" finished): scrub login tabs. */
async function handleRelocked() {
  await broadcastSettingsLocked();
}

browser.alarms?.onAlarm.addListener(async (alarm) => {
  if (alarm.name === PAUSE_ALARM) {
    await setPaused(false);
    return;
  }
  if (alarm.name !== RELOCK_ALARM) return;
  if ((await readDekCache())?.forSignIn) return;
  await handleRelocked();
});

// ---- Message handlers ----------------------------------------------------------

async function isSettingsCorrupt() {
  if (!(await hasStoredSettingsEnvelope())) return false;
  const result = await loadDecryptedSettingsResult();
  return !result.ok && result.reason === "corrupt";
}

async function handleGetPopupState() {
  const meta = await loadLockMeta();
  const configured = meta?.configured === true;
  const hasEnvelope = await hasStoredSettingsEnvelope();
  const loadResult = await loadDecryptedSettingsResult();
  const settingsCorrupt = hasEnvelope && !loadResult.ok && loadResult.reason === "corrupt";
  const migrationPending = !configured && hasEnvelope && !settingsCorrupt;
  const suggestSameAsLoginLock =
    migrationPending &&
    loadResult.ok &&
    Boolean(loadResult.settings.password?.trim());
  const lockMode = await getLockMode();

  return {
    ok: true,
    configured,
    locked: configured,
    migrationPending,
    settingsCorrupt,
    suggestSameAsLoginLock,
    lockMode,
    biometric: describeBiometric(meta),
  };
}

async function handleUnlockSettings(message) {
  if ((await getLockMode()) === LOCK_MODES.BIOMETRIC) {
    return { ok: false, error: "Use Touch ID / Face ID to unlock." };
  }

  const verification = await verifyUnlockPassword(message?.password);
  if (!verification.ok) {
    return {
      ok: false,
      error: verification.error || "Incorrect settings password.",
    };
  }

  const loadResult = await loadDecryptedSettingsResult();
  if (!loadResult.ok) {
    return {
      ok: false,
      error: SETTINGS_CORRUPT_MESSAGE,
      corrupt: true,
    };
  }

  const sessionNonce = await createUnlockSession();
  return { ok: true, settings: loadResult.settings, sessionNonce };
}

async function handleUnlockBiometric(message) {
  const unlocked = await unlockWithPrf(message?.prfOutput, {
    forSignIn: message?.forSignIn === true,
  });
  if (!unlocked.ok) return unlocked;

  // Only sign-in unlocks wake the login tabs; a settings-only unlock must not autofill.
  if (unlocked.forSignIn) await broadcastSettingsChanged();

  if (message?.forSignIn === true) return { ok: true };

  const loadResult = await loadDecryptedSettingsResult();
  if (!loadResult.ok) {
    return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
  }
  const sessionNonce = await createUnlockSession();
  return { ok: true, settings: loadResult.settings, sessionNonce };
}

async function handleSaveSettings(message) {
  const lockConfigured = await isLockConfigured();
  const lockConfig = message?.lock;
  const migration = message?.migration === true;

  if (await isSettingsCorrupt()) {
    return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
  }

  if (lockConfigured && !(await isUnlockSessionValid(message?.sessionNonce))) {
    return { ok: false, error: "Unlock the settings screen before saving." };
  }

  if (!lockConfigured && lockConfig) {
    let settingsForSave;
    if (migration) {
      const existingResult = await loadDecryptedSettingsResult();
      if (!existingResult.ok) {
        return {
          ok: false,
          error: SETTINGS_CORRUPT_MESSAGE,
          corrupt: true,
        };
      }
      const patch =
        message?.settings && typeof message.settings === "object"
          ? message.settings
          : {};
      const validation = validateSettingsForSave({ ...existingResult.settings, ...patch });
      if (!validation.ok) return validation;
      settingsForSave = validation.settings;
    } else {
      const validation = validateSettingsForSave(message?.settings);
      if (!validation.ok) return validation;
      settingsForSave = validation.settings;
    }

    if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
      const enrolled = await enrollBiometric({
        settings: settingsForSave,
        enrollment: lockConfig.enrollment,
        policy: lockConfig.policy,
        minutes: lockConfig.minutes,
      });
      if (!enrolled.ok) return enrolled;
      await broadcastSettingsChangedIfReady();
      return { ok: true, settings: settingsForSave };
    }

    const lockResult = await buildLockMetaFromSetup(lockConfig, settingsForSave);
    if (!lockResult.ok) return lockResult;

    const saveResult = await saveEncryptedSettings(settingsForSave);
    if (!saveResult.ok) return saveResult;

    await saveLockMeta(lockResult.meta);
    await broadcastSettingsChangedIfReady();
    return saveResult;
  }

  if (
    lockConfigured &&
    (await getLockMode()) === LOCK_MODES.SAME_AS_LOGIN &&
    !normalizeSettings(message?.settings).password.trim()
  ) {
    return { ok: false, error: SAME_AS_LOGIN_PASSWORD_MESSAGE };
  }

  const saveResult = await saveEncryptedSettings(message?.settings);
  if (!saveResult.ok) return saveResult;

  await broadcastSettingsChangedIfReady();
  return saveResult;
}

async function handleUpdateLock(message) {
  if (!(await isLockConfigured())) {
    return { ok: false, error: "Settings protection is not configured yet." };
  }
  if (!(await isUnlockSessionValid(message?.sessionNonce))) {
    return { ok: false, error: "Unlock the settings screen before changing protection." };
  }

  const currentMode = await getLockMode();
  const lock = message?.lock;
  const loadResult = await loadDecryptedSettingsResult();
  if (!loadResult.ok) {
    if (loadResult.reason === "locked") {
      return { ok: false, error: BIOMETRIC_LOCKED_MESSAGE, locked: true };
    }
    return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
  }

  if (lock?.mode === LOCK_MODES.BIOMETRIC) {
    const result =
      currentMode === LOCK_MODES.BIOMETRIC
        ? await updateBiometricPolicy(lock.policy, lock.minutes)
        : await enrollBiometric({
            settings: loadResult.settings,
            enrollment: lock.enrollment,
            policy: lock.policy,
            minutes: lock.minutes,
          });
    if (!result.ok) return result;
  } else {
    const lockResult = await buildLockMetaFromSetup(lock, loadResult.settings);
    if (!lockResult.ok) return lockResult;
    if (currentMode === LOCK_MODES.BIOMETRIC) {
      await moveToAutoMode(loadResult.settings, lockResult.meta);
    } else {
      await saveLockMeta(lockResult.meta);
    }
  }

  await clearUnlockSessions();
  await broadcastSettingsChangedIfReady();
  return { ok: true };
}

async function handleResetExtensionData(message) {
  if (message?.confirm !== true) {
    return { ok: false, error: "Confirmation required." };
  }
  await clearExtensionStorageData();
  await clearLockStorageData();
  await clearUnlockSessions();
  await sessionRemove(PROMPT_STATE_KEY);
  await setPaused(false);
  await handleRelocked();
  return { ok: true };
}

/**
 * Login pages get the public profile (email etc.) without any prompt. The password is
 * released only to OneLogin, and only once sign-in is unlocked. This never opens the
 * unlock window: that is requested explicitly, from a OneLogin password step.
 */
async function handleGetSettings(sender) {
  const response = await loadSettingsResponse(sender);
  if (response.ok && response.settings && (await isPaused())) {
    return { ...response, settings: { ...response.settings, enabled: false } };
  }
  return response;
}

async function loadSettingsResponse(sender) {
  if (await isBiometricLocked()) {
    const profile = await loadProfile();
    if (!profile) return { ok: false, locked: true, needsProfile: true };
    return {
      ok: true,
      settings: { ...profile, password: "" },
      passwordLocked: profile.hasPassword === true,
    };
  }
  const result = await loadDecryptedSettingsResult();
  if (!result.ok) {
    return result.reason === "locked"
      ? { ok: false, locked: true, needsProfile: true }
      : { ok: false, error: "Could not load settings." };
  }
  const settings =
    senderHost(sender) === PASSWORD_HOST
      ? result.settings
      : { ...result.settings, password: "" };
  return { ok: true, settings, passwordLocked: false };
}

async function handleRequestSignInUnlock(sender) {
  if (!(await isBiometricLocked())) return { ok: true, alreadyUnlocked: true };
  if (senderHost(sender) !== PASSWORD_HOST) return { ok: false, error: "Forbidden." };
  await openUnlockWindow();
  return { ok: true };
}

async function handleFlowDone() {
  const cached = await readDekCache();
  if (cached?.policy !== "attempt") return { ok: true };
  await clearDekCache();
  await handleRelocked();
  return { ok: true };
}

function extensionPageOnly(handler, errorMessage) {
  return (message, sender) => {
    if (!isExtensionPageSender(sender)) {
      return Promise.resolve({ ok: false, error: "Forbidden." });
    }
    return handler(message).catch(() => ({ ok: false, error: errorMessage }));
  };
}

const MESSAGE_HANDLERS = {
  GET_POPUP_STATE: extensionPageOnly(handleGetPopupState, "Could not load popup state."),
  UNLOCK_SETTINGS: extensionPageOnly(handleUnlockSettings, "Could not unlock settings."),
  UNLOCK_BIOMETRIC: extensionPageOnly(handleUnlockBiometric, "Could not unlock settings."),
  SAVE_SETTINGS: extensionPageOnly(handleSaveSettings, "Could not save settings."),
  UPDATE_LOCK: extensionPageOnly(handleUpdateLock, "Could not update settings protection."),
  RESET_EXTENSION_DATA: extensionPageOnly(
    handleResetExtensionData,
    "Could not reset extension data."
  ),
  GET_SETTINGS: (message, sender) => {
    if (!isContentScriptSender(sender)) {
      return Promise.resolve({ ok: false, error: "Forbidden." });
    }
    return handleGetSettings(sender).catch(() => ({
      ok: false,
      error: "Could not load settings.",
    }));
  },
  REQUEST_SIGN_IN_UNLOCK: (message, sender) => {
    if (!isContentScriptSender(sender)) {
      return Promise.resolve({ ok: false, error: "Forbidden." });
    }
    return handleRequestSignInUnlock(sender).catch(() => ({ ok: false }));
  },
  FLOW_DONE: (message, sender) => {
    if (!isContentScriptSender(sender)) {
      return Promise.resolve({ ok: false, error: "Forbidden." });
    }
    return handleFlowDone().catch(() => ({ ok: false }));
  },
};

browser.runtime.onMessage.addListener((message, sender) => {
  if (!message || typeof message.type !== "string") {
    return Promise.resolve({ ok: false, error: "Invalid message." });
  }
  const handler = Object.hasOwn(MESSAGE_HANDLERS, message.type)
    ? MESSAGE_HANDLERS[message.type]
    : null;
  if (!handler) return Promise.resolve({ ok: false, error: "Unknown message type." });
  return handler(message, sender);
});

// ---- Wiring --------------------------------------------------------------------

function isAutomationUrl(url) {
  try {
    return AUTOMATION_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

function registerSettingsContextMenu() {
  return browser.contextMenus
    .removeAll()
    .then(() =>
      browser.contextMenus.create({
        id: CONTEXT_MENU_SETTINGS_ID,
        title: "CSNYPass settings",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS,
      })
    )
    .then(() =>
      browser.contextMenus.create({
        id: CONTEXT_MENU_PAUSE_ID,
        title: "Pause auto sign-in for 1 hour",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS,
      })
    )
    .then(() =>
      browser.contextMenus.create({
        id: CONTEXT_MENU_RESUME_ID,
        title: "Resume auto sign-in",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS,
        visible: false,
      })
    )
    .then(syncPauseMenu)
    .catch(() => {});
}

// Menus persist across service-worker restarts, so register only on install/update.
// A second concurrent removeAll()+create() would race and hit "duplicate id".
browser.runtime.onInstalled.addListener(() => {
  registerSettingsContextMenu();
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === CONTEXT_MENU_SETTINGS_ID) {
    browser.runtime.openOptionsPage().catch(() => {});
  } else if (info.menuItemId === CONTEXT_MENU_PAUSE_ID) {
    setPaused(true).catch(() => {});
  } else if (info.menuItemId === CONTEXT_MENU_RESUME_ID) {
    setPaused(false).catch(() => {});
  }
});

// On a OneLogin page whose password is still locked, the toolbar button is the way back
// to the unlock window (e.g. after dismissing it); everywhere else it opens settings.
browser.action?.onClicked.addListener(async (tab) => {
  try {
    if (senderHost({ tab }) === PASSWORD_HOST && (await isBiometricLocked())) {
      await openUnlockWindow({ force: true });
      return;
    }
  } catch {
    /* fall through to settings */
  }
  browser.runtime.openOptionsPage().catch(() => {});
});

updateBadge();
syncPauseMenu();

browser.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return;
  if (!isAutomationUrl(details.url)) return;
  browser.tabs
    .sendMessage(details.tabId, {
      type: "NAVIGATION_COMPLETED",
      url: details.url,
    })
    .catch(() => {
      /* content script may not be ready yet */
    });
});
