import browser from "webextension-polyfill";
import {
  LOCK_MODES,
  UNLOCK_POLICIES,
  normalizeUnlockPolicy,
} from "../../shared/settings-schema.js";
import { base64ToBytes } from "../../shared/lib/bytes.js";
import {
  deriveKekFromPrf,
  encryptJson,
  generateDek,
  unwrapRawDek,
  wrapDek,
} from "../../shared/lib/vault.js";
import { idbDeleteDek, idbPutDek } from "./idb-keystore.js";
import { LOCK_STORAGE_KEY, loadLockMeta } from "./lock-meta.js";
import {
  DEK_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  cacheBiometricDek,
  clearDekCache,
  clearProfile,
  loadDecryptedSettingsResult,
  readDekCache,
  writeProfileMirror,
} from "./storage-crypto.js";

const PRF_BYTES = 32;

function isBiometricMeta(meta) {
  return meta?.configured === true && meta.mode === LOCK_MODES.BIOMETRIC;
}

/** Public (non-secret) bits the popup needs to run the biometric prompt. */
export function describeBiometric(meta) {
  if (!isBiometricMeta(meta)) return null;
  return {
    credentialId: meta.credentialId,
    prfSalt: meta.prfSalt,
    transports: Array.isArray(meta.transports) ? meta.transports : [],
    policy: meta.policy,
    minutes: meta.minutes,
  };
}

function decodePrf(prfOutputB64) {
  let bytes;
  try {
    bytes = base64ToBytes(String(prfOutputB64 ?? ""));
  } catch {
    return null;
  }
  return bytes.length === PRF_BYTES ? bytes : null;
}

/**
 * Moves the vault to biometric protection: a brand-new data key is generated,
 * settings are re-encrypted with it, and only a copy wrapped by the biometric
 * (PRF-derived) key is stored. The plaintext/IndexedDB key is then deleted.
 *
 * @param {{ settings: object, enrollment: { credentialId: string, prfSalt: string, prfOutput: string, transports?: string[] }, policy?: string, minutes?: number }} input
 */
export async function enrollBiometric({ settings, enrollment, policy, minutes }) {
  const prf = decodePrf(enrollment?.prfOutput);
  if (!prf || !enrollment?.credentialId || !enrollment?.prfSalt) {
    return { ok: false, error: "Touch ID / Face ID setup was incomplete. Try again." };
  }
  const unlock = normalizeUnlockPolicy(policy, minutes);

  const dek = await generateDek({ extractable: true });
  const kek = await deriveKekFromPrf(prf);
  const { raw, wrapped } = await wrapDek(kek, dek);
  const envelope = await encryptJson(dek, settings);

  const meta = {
    configured: true,
    mode: LOCK_MODES.BIOMETRIC,
    credentialId: enrollment.credentialId,
    prfSalt: enrollment.prfSalt,
    transports: Array.isArray(enrollment.transports) ? enrollment.transports : [],
    wrappedDek: wrapped,
    policy: unlock.policy,
    minutes: unlock.minutes,
  };

  await browser.storage.local.set({
    [SETTINGS_STORAGE_KEY]: envelope,
    [LOCK_STORAGE_KEY]: meta,
  });
  await idbDeleteDek().catch(() => {});
  await browser.storage.local.remove(DEK_STORAGE_KEY);
  await writeProfileMirror(settings);
  if (unlock.policy === UNLOCK_POLICIES.ATTEMPT) {
    // "Every sign-in" means the first autofill needs its own touch, not this setup one.
    await clearDekCache();
  } else {
    await cacheBiometricDek(raw, unlock.policy, unlock.minutes);
  }
  return { ok: true };
}

/**
 * Unwraps the data key with the PRF output and caches it per the unlock policy.
 * A wrong credential or finger can't produce the right PRF, so this just fails.
 */
export async function unlockWithPrf(prfOutputB64, { forSignIn = true } = {}) {
  const meta = await loadLockMeta();
  if (!isBiometricMeta(meta)) return { ok: false, error: "Biometric unlock is not set up." };

  const prf = decodePrf(prfOutputB64);
  if (!prf) return { ok: false, error: "Biometric check failed." };

  let raw;
  try {
    raw = await unwrapRawDek(await deriveKekFromPrf(prf), meta.wrappedDek);
  } catch {
    return { ok: false, error: "That biometric didn't unlock your saved data." };
  }
  // In "every sign-in" mode, opening settings must not unlock autofill, and must not
  // downgrade a sign-in unlock that is already live.
  const existing = await readDekCache();
  const signInReady =
    forSignIn || meta.policy !== UNLOCK_POLICIES.ATTEMPT || existing?.forSignIn === true;
  await cacheBiometricDek(raw, meta.policy, meta.minutes, { forSignIn: signInReady });
  // Covers vaults enrolled before the public profile existed.
  const loaded = await loadDecryptedSettingsResult();
  if (loaded.ok) await writeProfileMirror(loaded.settings);
  return { ok: true, forSignIn: signInReady };
}

/** Changes only how long an unlock lasts. */
export async function updateBiometricPolicy(policy, minutes) {
  const meta = await loadLockMeta();
  if (!isBiometricMeta(meta)) return { ok: false, error: "Biometric unlock is not set up." };
  const unlock = normalizeUnlockPolicy(policy, minutes);
  await browser.storage.local.set({
    [LOCK_STORAGE_KEY]: { ...meta, policy: unlock.policy, minutes: unlock.minutes },
  });
  const cached = await readDekCache();
  if (cached) {
    await cacheBiometricDek(cached.raw, unlock.policy, unlock.minutes, {
      forSignIn: unlock.policy === UNLOCK_POLICIES.ATTEMPT ? false : cached.forSignIn,
    });
  }
  return { ok: true };
}

/**
 * Leaves biometric mode: a new non-extractable key goes back into IndexedDB and the
 * wrapped copy is discarded along with the biometric lock meta.
 * @param {object} settings already-decrypted settings
 * @param {object} newLockMeta lock meta for the password mode being switched to
 */
export async function moveToAutoMode(settings, newLockMeta) {
  const dek = await generateDek();
  const envelope = await encryptJson(dek, settings);
  await idbPutDek(dek);
  await browser.storage.local.set({
    [SETTINGS_STORAGE_KEY]: envelope,
    [LOCK_STORAGE_KEY]: newLockMeta,
  });
  await clearDekCache();
  await clearProfile();
}
