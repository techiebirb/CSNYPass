/** Web Crypto helpers for the settings lock password (background + tests). */
import { base64ToBytes, bytesToBase64 } from "./bytes.js";

export const PBKDF2_ITERATIONS = 600_000;
/** Iteration count used by lock records written before `iter` was stored. */
export const LEGACY_PBKDF2_ITERATIONS = 100_000;
export const PBKDF2_SALT_BYTES = 16;

export function timingSafeEqualBytes(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}

export function timingSafeEqualString(a, b) {
  const enc = new TextEncoder();
  const ba = enc.encode(String(a));
  const bb = enc.encode(String(b));
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqualBytes(ba, bb);
}

export async function derivePbkdf2Sha256(
  password,
  saltBytes,
  iterations = PBKDF2_ITERATIONS
) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(String(password)),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

export async function hashCustomLockPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
  const hash = await derivePbkdf2Sha256(password, salt, PBKDF2_ITERATIONS);
  return {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    iter: PBKDF2_ITERATIONS,
  };
}

export async function verifyCustomLockPassword(
  password,
  saltB64,
  hashB64,
  iterations = LEGACY_PBKDF2_ITERATIONS
) {
  if (!saltB64 || !hashB64) return false;
  const salt = base64ToBytes(saltB64);
  const expected = base64ToBytes(hashB64);
  const derived = await derivePbkdf2Sha256(password, salt, iterations);
  return timingSafeEqualBytes(derived, expected);
}
