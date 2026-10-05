import browser from "webextension-polyfill";
import {
  DEFAULTS,
  DEFAULT_UNLOCK_MINUTES,
  DEFAULT_UNLOCK_POLICY,
  LOCK_MODES,
  normalizeSettings,
  validateLockSetup,
  validateSettingsForSave,
} from "../../shared/settings-schema.js";
import { getPrfOutput, isBiometricSupported } from "../../shared/lib/webauthn.js";
import {
  applyBiometricAvailability as applyBiometricAvailabilityFor,
  attachBiometricEnrollment,
  biometricErrorMessage,
  readLockConfig,
  setDelayMs,
  setPrimaryBusy,
  setStatus,
  syncLockModeVisibility,
  wireDelayControls,
  wirePasswordToggles,
} from "./setup-form.js";

/** @type {string | null} */
let sessionNonce = null;
/** @type {boolean} */
let migrationPending = false;
/** @type {boolean} */
let settingsCorrupt = false;
/** @type {string | null} "custom" | "same_as_login" | "biometric" */
let currentLockMode = null;
/** @type {{ credentialId: string, prfSalt: string, transports: string[], policy: string, minutes: number } | null} */
let biometricInfo = null;
let biometricSupported = false;

const automationChip = document.querySelector("#automation-chip");

function applyBiometricAvailability(prefix) {
  applyBiometricAvailabilityFor(prefix, biometricSupported);
}

function openWelcomeTab() {
  browser.tabs.create({ url: browser.runtime.getURL("popup/welcome.html") }).catch(() => {});
  window.close();
}

const views = {
  unlock: document.querySelector("#view-unlock"),
  welcome: document.querySelector("#view-welcome"),
  editor: document.querySelector("#view-editor"),
};

/** Matches UNLOCK_SESSION_TTL_MS in the background: after this, saving would be refused. */
const EDITOR_SESSION_MS = 30 * 60 * 1000;
let editorTimer = null;
let editorExpiresAt = 0;

function stopEditorSession() {
  clearTimeout(editorTimer);
  editorTimer = null;
  editorExpiresAt = 0;
}

function startEditorSession() {
  stopEditorSession();
  editorExpiresAt = Date.now() + EDITOR_SESSION_MS;
  editorTimer = window.setTimeout(expireEditorSession, EDITOR_SESSION_MS);
}

function expireEditorSession() {
  if (views.editor?.hidden) return;
  for (const id of ["#edit-email", "#edit-password"]) {
    const el = document.querySelector(id);
    if (el) el.value = "";
  }
  sessionNonce = null;
  showUnlockWithMessage("Locked after 30 minutes. Unlock again to make changes.", false);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && editorExpiresAt && Date.now() >= editorExpiresAt) {
    expireEditorSession();
  }
});

function showView(name) {
  for (const [key, el] of Object.entries(views)) {
    if (!el) continue;
    el.hidden = key !== name;
  }
  if (name !== "editor") stopEditorSession();
  syncAutomationChipForView(name);
}

function showUnlockWithMessage(message, ok = true) {
  showView("unlock");
  applyCorruptUnlockUi();
  const passwordEl = document.querySelector("#unlock-password");
  if (passwordEl) passwordEl.value = "";
  setStatus(document.querySelector("#unlock-status"), message, ok);
  if (!settingsCorrupt && currentLockMode !== LOCK_MODES.BIOMETRIC) {
    passwordEl?.focus();
  }
  if (ok && message) {
    window.setTimeout(() => {
      const statusEl = document.querySelector("#unlock-status");
      if (statusEl?.textContent === message) {
        setStatus(statusEl, "", false);
      }
    }, 3000);
  }
}

function applyCorruptUnlockUi() {
  const corrupt = settingsCorrupt;
  const biometric = currentLockMode === LOCK_MODES.BIOMETRIC;
  const banner = document.querySelector("#unlock-corrupt-banner");
  const formSection = document.querySelector("#unlock-form-section");
  const bioSection = document.querySelector("#unlock-bio-section");
  const unlockBtn = document.querySelector("#btn-unlock");
  const intro = document.querySelector("#unlock-intro-hint");
  if (banner) banner.hidden = !corrupt;
  if (formSection) formSection.hidden = corrupt || biometric;
  if (bioSection) bioSection.hidden = corrupt || !biometric;
  if (unlockBtn) unlockBtn.hidden = corrupt || biometric;
  if (intro) {
    intro.hidden = corrupt;
    intro.textContent = biometric
      ? "Use Touch ID / Face ID to view or change your saved login details."
      : "Enter your settings password to view or change your saved login details.";
  }
}

function updateAutomationChip(enabled) {
  if (!automationChip) return;
  automationChip.hidden = false;
  automationChip.textContent = enabled ? "Automation on" : "Automation off";
  automationChip.className = "chip " + (enabled ? "chip-on" : "chip-off");
}

function hideAutomationChip() {
  if (!automationChip) return;
  automationChip.hidden = true;
  automationChip.textContent = "";
  automationChip.className = "chip";
}

function syncAutomationChipForView(viewName) {
  if (viewName === "editor") {
    const enabled = document.querySelector("#edit-enabled")?.checked !== false;
    updateAutomationChip(enabled);
    return;
  }
  hideAutomationChip();
}

function readLockConfigFromEditor() {
  return readLockConfig(
    "edit-lock",
    document.querySelector("#edit-password")?.value ?? ""
  );
}

function loadEditorLockForm(lockMode) {
  const biometric = lockMode === LOCK_MODES.BIOMETRIC;
  document.querySelector("#edit-lock-mode-bio").checked = biometric;
  document.querySelector("#edit-lock-mode-auto").checked = !biometric;
  const sameAsLoginEl = document.querySelector("#edit-lock-same-as-login");
  if (sameAsLoginEl) sameAsLoginEl.checked = lockMode === LOCK_MODES.SAME_AS_LOGIN;
  document.querySelector("#edit-lock-password").value = "";
  document.querySelector("#edit-lock-password-confirm").value = "";
  document.querySelector("#edit-lock-policy").value =
    biometricInfo?.policy ?? DEFAULT_UNLOCK_POLICY;
  document.querySelector("#edit-lock-minutes").value = String(
    biometricInfo?.minutes ?? DEFAULT_UNLOCK_MINUTES
  );
  applyBiometricAvailability("edit-lock");
  syncLockModeVisibility("edit-lock");
}

function loadEditorFormValues(settings, lockMode = null) {
  document.querySelector("#edit-enabled").checked = settings.enabled !== false;
  document.querySelector("#edit-email").value = settings.email || "";
  document.querySelector("#edit-password").value = settings.password || "";
  document.querySelector("#edit-autoClickNext").checked =
    settings.autoClickNext !== false;
  setDelayMs("edit", settings.clickDelayMs ?? DEFAULTS.clickDelayMs);
  if (lockMode) loadEditorLockForm(lockMode);
  syncAutomationChipForView("editor");
}

function readEditorPayload() {
  return {
    enabled: document.querySelector("#edit-enabled").checked,
    email: document.querySelector("#edit-email").value.trim(),
    password: document.querySelector("#edit-password").value,
    autoClickNext: document.querySelector("#edit-autoClickNext").checked,
    clickDelayMs: document.querySelector("#edit-clickDelayMs").value,
  };
}

/** Not set up yet (or half-migrated): the popup only points at the welcome tab. */
function showWelcome() {
  const text = document.querySelector("#welcome-text");
  const button = document.querySelector("#btn-open-welcome");
  const title = document.querySelector("#welcome-title");
  if (title) title.textContent = migrationPending ? "One more step" : "Welcome to CSNYPass";
  if (text) {
    text.textContent = migrationPending
      ? "Your login details are saved. Choose how to protect your settings to finish."
      : "Sign in to school in one click. Setup takes about a minute.";
  }
  if (button) button.textContent = migrationPending ? "Protect my settings" : "Set up CSNYPass";
  showView("welcome");
  button?.focus();
}

async function handleResetExtensionData() {
  const confirmed = window.confirm(
    "Clear all saved email, passwords, and protection settings on this device? This cannot be undone."
  );
  if (!confirmed) return false;

  let result;
  try {
    result = await browser.runtime.sendMessage({
      type: "RESET_EXTENSION_DATA",
      confirm: true,
    });
  } catch {
    return false;
  }

  if (!result?.ok) {
    window.alert(result?.error || "Could not clear extension data.");
    return false;
  }

  sessionNonce = null;
  migrationPending = false;
  settingsCorrupt = false;
  currentLockMode = null;
  biometricInfo = null;
  showWelcome();
  openWelcomeTab();
  return true;
}

async function refreshProtectionState() {
  try {
    const state = await browser.runtime.sendMessage({ type: "GET_POPUP_STATE" });
    currentLockMode = state?.lockMode ?? null;
    biometricInfo = state?.biometric ?? null;
  } catch {
    /* keep previous values */
  }
}

function enterEditor(settings) {
  loadEditorFormValues(normalizeSettings(settings), currentLockMode);
  setStatus(document.querySelector("#edit-lock-status"), "", false);
  showView("editor");
  startEditorSession();
  document.querySelector("#edit-email")?.focus();
}

async function handleUnlock() {
  const statusEl = document.querySelector("#unlock-status");
  const unlockBtn = document.querySelector("#btn-unlock");
  setStatus(statusEl, "", false);
  const password = document.querySelector("#unlock-password")?.value ?? "";

  setPrimaryBusy(unlockBtn, true);
  let result;
  try {
    result = await browser.runtime.sendMessage({
      type: "UNLOCK_SETTINGS",
      password,
    });
  } catch (err) {
    const message =
      err && typeof err.message === "string" ? err.message : "Could not unlock settings.";
    setStatus(statusEl, message, false);
    setPrimaryBusy(unlockBtn, false);
    return;
  }

  setPrimaryBusy(unlockBtn, false);

  if (!result?.ok) {
    setStatus(statusEl, result?.error || "Incorrect settings password.", false);
    if (result?.corrupt) {
      settingsCorrupt = true;
      showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
    }
    return;
  }

  sessionNonce = result.sessionNonce || null;
  await refreshProtectionState();
  document.querySelector("#unlock-password").value = "";
  enterEditor(result.settings);
}

async function handleBiometricUnlock() {
  const statusEl = document.querySelector("#unlock-status");
  const button = document.querySelector("#btn-unlock-bio");
  setStatus(statusEl, "", false);
  if (!biometricInfo) {
    setStatus(statusEl, "Touch ID / Face ID isn't set up.", false);
    return;
  }

  setPrimaryBusy(button, true);
  let result;
  try {
    const prfOutput = await getPrfOutput(biometricInfo);
    result = await browser.runtime.sendMessage({ type: "UNLOCK_BIOMETRIC", prfOutput });
  } catch (err) {
    setStatus(statusEl, biometricErrorMessage(err), false);
    setPrimaryBusy(button, false);
    return;
  }
  setPrimaryBusy(button, false);

  if (!result?.ok) {
    setStatus(statusEl, result?.error || "Could not unlock settings.", false);
    if (result?.corrupt) {
      settingsCorrupt = true;
      showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
    }
    return;
  }

  sessionNonce = result.sessionNonce || null;
  enterEditor(result.settings);
}

async function handleEditorSave(e) {
  e.preventDefault();
  const statusEl = document.querySelector("#editor-status");
  const saveBtn = document.querySelector("#btn-editor-save");
  setStatus(statusEl, "", false);

  const payload = readEditorPayload();
  const validation = validateSettingsForSave(payload);
  if (!validation.ok) {
    setStatus(statusEl, validation.error, false);
    document.querySelector("#edit-email")?.focus();
    return;
  }

  if (currentLockMode === LOCK_MODES.SAME_AS_LOGIN && !validation.settings.password.trim()) {
    setStatus(
      statusEl,
      "Your OneLogin password unlocks settings. Choose a separate settings password under protection before removing it.",
      false
    );
    document.querySelector("#edit-password")?.focus();
    return;
  }

  setPrimaryBusy(saveBtn, true);
  let result;
  try {
    result = await browser.runtime.sendMessage({
      type: "SAVE_SETTINGS",
      settings: validation.settings,
      sessionNonce,
    });
  } catch (err) {
    const message =
      err && typeof err.message === "string" ? err.message : "Could not save settings.";
    setStatus(statusEl, message, false);
    setPrimaryBusy(saveBtn, false);
    return;
  }

  setPrimaryBusy(saveBtn, false);

  if (!result?.ok) {
    setStatus(statusEl, result?.error || "Could not save settings.", false);
    if (result?.corrupt) {
      settingsCorrupt = true;
      sessionNonce = null;
      showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
      return;
    }
    if (result?.locked || result?.error?.includes("Unlock")) {
      sessionNonce = null;
      showUnlockWithMessage(result?.error || "Unlock the settings screen first.", false);
    }
    return;
  }

  setStatus(statusEl, "Settings saved.", true);
  updateAutomationChip(validation.settings.enabled !== false);
  window.setTimeout(() => setStatus(statusEl, "", false), 2000);
}

async function handleUpdateLock() {
  const statusEl = document.querySelector("#edit-lock-status");
  setStatus(statusEl, "", false);

  let lockConfig = readLockConfigFromEditor();
  const loginPassword = document.querySelector("#edit-password")?.value ?? "";
  const alreadyBiometric = currentLockMode === LOCK_MODES.BIOMETRIC;

  if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
    // nothing to validate: policy/minutes are normalized
  } else if (lockConfig.mode === LOCK_MODES.CUSTOM) {
    const lockValidation = validateLockSetup({
      mode: lockConfig.mode,
      settingsPassword: lockConfig.settingsPassword,
      confirmPassword: lockConfig.confirmPassword,
      loginPassword: "",
    });
    if (!lockValidation.ok) {
      setStatus(statusEl, lockValidation.error, false);
      return;
    }
  } else {
    const lockValidation = validateLockSetup({
      mode: lockConfig.mode,
      loginPassword,
    });
    if (!lockValidation.ok) {
      setStatus(statusEl, lockValidation.error, false);
      return;
    }
  }

  const btn = document.querySelector("#btn-update-lock");
  setPrimaryBusy(btn, true);

  if (lockConfig.mode === LOCK_MODES.BIOMETRIC && !alreadyBiometric) {
    setStatus(statusEl, "Waiting for Touch ID / Face ID…", true);
    try {
      lockConfig = await attachBiometricEnrollment(lockConfig);
    } catch (err) {
      setStatus(statusEl, biometricErrorMessage(err), false);
      setPrimaryBusy(btn, false);
      return;
    }
  }

  let result;
  try {
    result = await browser.runtime.sendMessage({
      type: "UPDATE_LOCK",
      lock: lockConfig,
      sessionNonce,
    });
  } catch (err) {
    const message =
      err && typeof err.message === "string" ? err.message : "Could not update protection.";
    setStatus(statusEl, message, false);
    setPrimaryBusy(btn, false);
    return;
  }
  setPrimaryBusy(btn, false);

  if (!result?.ok) {
    setStatus(statusEl, result?.error || "Could not update protection.", false);
    if (result?.error?.includes("Unlock") || result?.locked || result?.corrupt) {
      sessionNonce = null;
      if (result?.corrupt) settingsCorrupt = true;
      showUnlockWithMessage(result?.error || "Unlock the settings screen first.", false);
    }
    return;
  }

  sessionNonce = null;
  await refreshProtectionState();
  showUnlockWithMessage(
    lockConfig.mode === LOCK_MODES.BIOMETRIC
      ? "Protection updated. Use Touch ID / Face ID to open settings."
      : "Protection updated. Enter your settings password to open settings.",
    true
  );
}

function wireLockModeControls(prefix) {
  for (const id of [`${prefix}-mode-auto`, `${prefix}-mode-bio`, `${prefix}-same-as-login`, `${prefix}-policy`]) {
    document.querySelector(`#${id}`)?.addEventListener("change", () => {
      syncLockModeVisibility(prefix);
    });
  }
  applyBiometricAvailability(prefix);
  syncLockModeVisibility(prefix);
}

async function init() {
  wirePasswordToggles();
  wireDelayControls("edit");
  biometricSupported = await isBiometricSupported();

  document.querySelector("#edit-enabled")?.addEventListener("change", () => {
    syncAutomationChipForView("editor");
  });

  wireLockModeControls("edit-lock");

  document.querySelector("#btn-open-welcome")?.addEventListener("click", openWelcomeTab);
  document.querySelector("#view-editor")?.addEventListener("submit", handleEditorSave);
  document.querySelector("#btn-unlock")?.addEventListener("click", handleUnlock);
  document.querySelector("#btn-unlock-bio")?.addEventListener("click", handleBiometricUnlock);
  document.querySelector("#btn-update-lock")?.addEventListener("click", handleUpdateLock);
  document.querySelector("#unlock-password")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUnlock();
    }
  });

  document.querySelector("#btn-reset-from-unlock")?.addEventListener("click", () => {
    handleResetExtensionData();
  });

  let popupState;
  try {
    popupState = await browser.runtime.sendMessage({ type: "GET_POPUP_STATE" });
  } catch {
    popupState = { ok: false };
  }

  if (!popupState?.ok) {
    showWelcome();
    return;
  }

  migrationPending = popupState.migrationPending === true;
  settingsCorrupt = popupState.settingsCorrupt === true;
  currentLockMode = popupState.lockMode ?? null;
  biometricInfo = popupState.biometric ?? null;

  if (settingsCorrupt) {
    showUnlockWithMessage("", false);
    return;
  }

  if (!popupState.configured || migrationPending) {
    showWelcome();
    return;
  }

  showView("unlock");
  applyCorruptUnlockUi();
  if (currentLockMode !== LOCK_MODES.BIOMETRIC) {
    document.querySelector("#unlock-password")?.focus();
  }
}

init();
