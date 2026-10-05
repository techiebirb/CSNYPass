import browser from "webextension-polyfill";
import {
  LOCK_MODES,
  validateLockSetup,
} from "../../shared/settings-schema.js";
import {
  LEGACY_PBKDF2_ITERATIONS,
  PBKDF2_ITERATIONS,
  hashCustomLockPassword,
  timingSafeEqualString,
  verifyCustomLockPassword,
} from "../../shared/lib/crypto.js";
import {
  nextFailureState,
  remainingLockoutMs,
} from "../../shared/lib/throttle.js";
import {
  LOCK_STORAGE_KEY,
  loadLockMeta,
  saveLockMeta,
  isLockConfigured,
  getLockMode,
} from "./lock-meta.js";
import { loadDecryptedSettingsResult } from "./storage-crypto.js";
import { sessionGet, sessionRemove, sessionSet } from "./session-store.js";

export { LOCK_STORAGE_KEY, loadLockMeta, saveLockMeta, isLockConfigured, getLockMode };

const UNLOCK_FAILS_KEY = "csnyExtension.unlockFails.v1";

export async function clearLockStorageData() {
  await browser.storage.local.remove(LOCK_STORAGE_KEY);
  await sessionRemove(UNLOCK_FAILS_KEY);
}

/**
 * Lock meta for the two password modes. Biometric meta is built by biometric-vault.
 * @param {{ mode: string, settingsPassword?: string, confirmPassword?: string, loginPassword?: string }} lockInput
 * @param {{ password: string }} settingsForSameAsLogin
 */
export async function buildLockMetaFromSetup(lockInput, settingsForSameAsLogin) {
  if (lockInput?.mode === LOCK_MODES.BIOMETRIC) {
    return { ok: false, error: "Use biometric setup for this mode." };
  }

  const validation = validateLockSetup({
    mode: lockInput.mode,
    settingsPassword: lockInput.settingsPassword,
    confirmPassword: lockInput.confirmPassword,
    loginPassword:
      lockInput.mode === LOCK_MODES.SAME_AS_LOGIN
        ? settingsForSameAsLogin.password
        : lockInput.loginPassword,
  });
  if (!validation.ok) return validation;

  if (validation.mode === LOCK_MODES.SAME_AS_LOGIN) {
    return {
      ok: true,
      meta: {
        configured: true,
        mode: LOCK_MODES.SAME_AS_LOGIN,
      },
    };
  }

  const password = String(lockInput.settingsPassword ?? "");
  const { salt, hash, iter } = await hashCustomLockPassword(password);
  return {
    ok: true,
    meta: {
      configured: true,
      mode: LOCK_MODES.CUSTOM,
      salt,
      hash,
      iter,
    },
  };
}

function formatWait(ms) {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} s`;
  return `${Math.ceil(seconds / 60)} min`;
}

async function checkNotLockedOut() {
  const remaining = remainingLockoutMs(await sessionGet(UNLOCK_FAILS_KEY));
  if (remaining > 0) {
    return {
      ok: false,
      throttled: true,
      error: `Too many attempts. Try again in ${formatWait(remaining)}.`,
    };
  }
  return null;
}

async function recordFailure() {
  const state = nextFailureState(await sessionGet(UNLOCK_FAILS_KEY));
  await sessionSet(UNLOCK_FAILS_KEY, state);
}

async function comparePassword(meta, attempt) {
  if (meta.mode === LOCK_MODES.SAME_AS_LOGIN) {
    const loadResult = await loadDecryptedSettingsResult();
    if (!loadResult.ok) return false;
    const saved = loadResult.settings.password;
    if (!saved?.trim()) return false;
    return timingSafeEqualString(attempt, saved);
  }

  if (meta.mode === LOCK_MODES.CUSTOM) {
    const iterations = Number(meta.iter) || LEGACY_PBKDF2_ITERATIONS;
    const valid = await verifyCustomLockPassword(
      attempt,
      meta.salt,
      meta.hash,
      iterations
    );
    if (valid && iterations < PBKDF2_ITERATIONS) {
      // Upgrade weaker legacy hashes now that we have the plaintext.
      const { salt, hash, iter } = await hashCustomLockPassword(attempt);
      await saveLockMeta({ ...meta, salt, hash, iter });
    }
    return valid;
  }

  return false;
}

/** Password unlock for the two Full-auto lock modes (with backoff on failures). */
export async function verifyUnlockPassword(password) {
  const meta = await loadLockMeta();
  if (!meta?.configured) return { ok: true };

  const blocked = await checkNotLockedOut();
  if (blocked) return blocked;

  const attempt = String(password ?? "");
  if (!attempt) return { ok: false };

  const valid = await comparePassword(meta, attempt);
  if (!valid) {
    await recordFailure();
    return { ok: false };
  }
  await sessionRemove(UNLOCK_FAILS_KEY);
  return { ok: true };
}
