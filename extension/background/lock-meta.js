import browser from "webextension-polyfill";
import { LOCK_MODES } from "../../shared/settings-schema.js";

export const LOCK_STORAGE_KEY = "csnyExtension.lock.v1";

export async function loadLockMeta() {
  const stored = await browser.storage.local.get(LOCK_STORAGE_KEY);
  const raw = stored[LOCK_STORAGE_KEY];
  if (!raw || typeof raw !== "object") return null;
  return raw;
}

export async function saveLockMeta(meta) {
  await browser.storage.local.set({ [LOCK_STORAGE_KEY]: meta });
}

export async function isLockConfigured() {
  const meta = await loadLockMeta();
  return meta?.configured === true;
}

/** @returns {"custom" | "same_as_login" | "biometric" | null} */
export async function getLockMode() {
  const meta = await loadLockMeta();
  if (!meta?.configured) return null;
  if (
    meta.mode === LOCK_MODES.SAME_AS_LOGIN ||
    meta.mode === LOCK_MODES.CUSTOM ||
    meta.mode === LOCK_MODES.BIOMETRIC
  ) {
    return meta.mode;
  }
  return null;
}
