import browser from "webextension-polyfill";
import {
  LOCK_MODES,
  UNLOCK_POLICIES,
  normalizeSettings,
  validateSettingsForSave,
} from "../../shared/settings-schema.js";
import { base64ToBytes, bytesToBase64 } from "../../shared/lib/bytes.js";
import {
  decryptJson,
  encryptJson,
  generateDek,
  importDekJwk,
  importDekRaw,
  isValidEnvelope,
} from "../../shared/lib/vault.js";
import {
  idbDeleteDek,
  idbDeleteProfileKey,
  idbGetDek,
  idbGetProfileKey,
  idbPutDek,
  idbPutProfileKey,
} from "./idb-keystore.js";
import { getLockMode } from "./lock-meta.js";
import { sessionGet, sessionRemove, sessionSet } from "./session-store.js";

/** Pre-1.2 location of the plaintext data key; migrated into IndexedDB on first use. */
export const DEK_STORAGE_KEY = "csnyExtension.dek.v1";
export const SETTINGS_STORAGE_KEY = "csnyExtension.settings.v1";
export const PROFILE_STORAGE_KEY = "csnyExtension.profile.v1";
const DEK_CACHE_KEY = "csnyExtension.dekCache.v1";
export const RELOCK_ALARM = "csny-relock";
/** "Every sign-in" window: long enough for Blackbaud -> OneLogin, then dropped. */
export const ATTEMPT_WINDOW_MS = 3 * 60 * 1000;
/** A settings-screen-only unlock (never used for autofill) lasts as long as the editor session. */
export const SETTINGS_ONLY_WINDOW_MS = 30 * 60 * 1000;

export class SettingsCorruptError extends Error {
  constructor() {
    super("Saved settings could not be decrypted.");
    this.name = "SettingsCorruptError";
  }
}

// ---- Biometric-mode data key cache (memory only) -------------------------------

/**
 * @param {{ forSignIn?: boolean }} options `forSignIn: false` keeps the key available to
 *   the settings screen only; content scripts are refused until a real sign-in unlock.
 */
export async function cacheBiometricDek(
  rawBytes,
  policy,
  minutes,
  { forSignIn = true } = {}
) {
  let expiresAt = null;
  if (!forSignIn) {
    expiresAt = Date.now() + SETTINGS_ONLY_WINDOW_MS;
  } else if (policy === UNLOCK_POLICIES.ATTEMPT) {
    expiresAt = Date.now() + ATTEMPT_WINDOW_MS;
  } else if (policy === UNLOCK_POLICIES.MINUTES) {
    expiresAt = Date.now() + minutes * 60_000;
  }
  await sessionSet(DEK_CACHE_KEY, {
    raw: bytesToBase64(rawBytes),
    policy,
    forSignIn,
    expiresAt,
  });
  try {
    await browser.alarms?.clear(RELOCK_ALARM);
    if (expiresAt) await browser.alarms?.create(RELOCK_ALARM, { when: expiresAt });
  } catch {
    /* alarms are best effort; reads also check expiresAt */
  }
}

export async function clearDekCache() {
  await sessionRemove(DEK_CACHE_KEY);
  try {
    await browser.alarms?.clear(RELOCK_ALARM);
  } catch {
    /* ignore */
  }
}

/** @returns {Promise<{ raw: Uint8Array, policy: string, forSignIn: boolean } | null>} */
export async function readDekCache() {
  const record = await sessionGet(DEK_CACHE_KEY);
  if (!record?.raw) return null;
  if (record.expiresAt && Date.now() > record.expiresAt) {
    await clearDekCache();
    return null;
  }
  return {
    raw: base64ToBytes(record.raw),
    policy: record.policy,
    forSignIn: record.forSignIn !== false,
  };
}

// ---- Full-auto data key (non-extractable, in IndexedDB) ------------------------

let autoDekCreation = null;

async function getOrCreateAutoDek() {
  autoDekCreation ??= (async () => {
    const existing = await idbGetDek();
    if (existing) return existing;

    const stored = await browser.storage.local.get(DEK_STORAGE_KEY);
    const legacyJwk = stored[DEK_STORAGE_KEY];
    const key = legacyJwk ? await importDekJwk(legacyJwk) : await generateDek();
    await idbPutDek(key);
    if (legacyJwk) await browser.storage.local.remove(DEK_STORAGE_KEY);
    return key;
  })().finally(() => {
    autoDekCreation = null;
  });
  return autoDekCreation;
}

/** Only for decrypting: never mints a key, so a lost key can't silently be replaced. */
async function getExistingAutoDek() {
  const existing = await idbGetDek();
  if (existing) return existing;
  const stored = await browser.storage.local.get(DEK_STORAGE_KEY);
  if (stored[DEK_STORAGE_KEY]) return getOrCreateAutoDek();
  return null;
}

/**
 * @param {{ create: boolean }} options
 * @returns {Promise<{ key: CryptoKey } | { locked: true } | { key: null }>}
 */
async function resolveDek({ create }) {
  if ((await getLockMode()) === LOCK_MODES.BIOMETRIC) {
    const cached = await readDekCache();
    if (!cached) return { locked: true };
    return { key: await importDekRaw(cached.raw) };
  }
  const key = create ? await getOrCreateAutoDek() : await getExistingAutoDek();
  return { key };
}

// ---- Biometric-mode public profile ---------------------------------------------
//
// Everything a login page needs except the password (the email is common knowledge).
// Encrypted at rest with a separate non-extractable key, so reading it needs no Touch
// ID / Face ID. It is only ever a derived copy of the vault.

async function getOrCreateProfileKey() {
  const existing = await idbGetProfileKey();
  if (existing) return existing;
  const key = await generateDek();
  await idbPutProfileKey(key);
  return key;
}

/** Best effort: a failed mirror must never fail the save or unlock that triggered it. */
export async function writeProfileMirror(settings) {
  try {
    const profile = {
      enabled: settings.enabled !== false,
      email: String(settings.email || ""),
      autoClickNext: settings.autoClickNext !== false,
      clickDelayMs: settings.clickDelayMs,
      hasPassword: Boolean(settings.password?.trim()),
    };
    const envelope = await encryptJson(await getOrCreateProfileKey(), profile);
    await browser.storage.local.set({ [PROFILE_STORAGE_KEY]: envelope });
  } catch {
    /* next save or unlock retries */
  }
}

/** @returns {Promise<object | null>} the public profile, or null if absent/unreadable */
export async function loadProfile() {
  try {
    const stored = await browser.storage.local.get(PROFILE_STORAGE_KEY);
    const envelope = stored[PROFILE_STORAGE_KEY];
    if (!isValidEnvelope(envelope)) return null;
    const key = await idbGetProfileKey();
    if (!key) return null;
    const profile = await decryptJson(key, envelope);
    return profile?.email ? profile : null;
  } catch {
    return null;
  }
}

export async function clearProfile() {
  await browser.storage.local.remove(PROFILE_STORAGE_KEY);
  await idbDeleteProfileKey().catch(() => {});
}

// ---- Settings load/save --------------------------------------------------------

export async function hasStoredSettingsEnvelope() {
  const stored = await browser.storage.local.get(SETTINGS_STORAGE_KEY);
  const envelope = stored[SETTINGS_STORAGE_KEY];
  return Boolean(envelope && typeof envelope === "object");
}

/**
 * @returns {Promise<
 *   | { ok: true, settings: object }
 *   | { ok: false, reason: "corrupt" | "locked" }
 * >}
 */
export async function loadDecryptedSettingsResult() {
  const stored = await browser.storage.local.get(SETTINGS_STORAGE_KEY);
  const envelope = stored[SETTINGS_STORAGE_KEY];
  if (!envelope) {
    return { ok: true, settings: normalizeSettings({}) };
  }
  if (!isValidEnvelope(envelope)) return { ok: false, reason: "corrupt" };

  const dek = await resolveDek({ create: false });
  if (dek.locked) return { ok: false, reason: "locked" };
  if (!dek.key) return { ok: false, reason: "corrupt" };

  let json;
  try {
    json = await decryptJson(dek.key, envelope);
  } catch {
    return { ok: false, reason: "corrupt" };
  }

  if (envelope.v !== 2) {
    // Upgrade old v1 blobs to the AAD-bound v2 format; harmless if it fails.
    try {
      const upgraded = await encryptJson(dek.key, json);
      await browser.storage.local.set({ [SETTINGS_STORAGE_KEY]: upgraded });
    } catch {
      /* will retry on next load */
    }
  }
  return { ok: true, settings: normalizeSettings(json) };
}

export async function isSettingsReadable() {
  const result = await loadDecryptedSettingsResult();
  return result.ok;
}

export async function loadDecryptedSettings() {
  const result = await loadDecryptedSettingsResult();
  if (!result.ok) {
    throw new SettingsCorruptError();
  }
  return result.settings;
}

export async function saveEncryptedSettings(values) {
  const validation = validateSettingsForSave(values);
  if (!validation.ok) return validation;

  const dek = await resolveDek({ create: true });
  if (dek.locked) {
    return {
      ok: false,
      locked: true,
      error: "Unlock with Touch ID / Face ID first.",
    };
  }

  const payload = validation.settings;
  const envelope = await encryptJson(dek.key, payload);
  await browser.storage.local.set({ [SETTINGS_STORAGE_KEY]: envelope });
  if ((await getLockMode()) === LOCK_MODES.BIOMETRIC) await writeProfileMirror(payload);
  return { ok: true, settings: payload };
}

export async function clearExtensionStorageData() {
  await browser.storage.local.remove([DEK_STORAGE_KEY, SETTINGS_STORAGE_KEY]);
  await clearProfile();
  await idbDeleteDek().catch(() => {});
  await clearDekCache();
}
