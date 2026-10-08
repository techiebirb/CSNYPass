/**
 * Pure Web Crypto helpers for the settings vault: data key (DEK), the encrypted
 * settings envelope, and the biometric key-encryption key (KEK) that wraps the DEK.
 * No extension APIs in here so it can be unit-tested.
 */
import { base64ToBytes, bytesToBase64, toUint8Array } from "./bytes.js";

export const ENVELOPE_VERSION = 2;
export const SETTINGS_AAD = "csny.settings.v2";
const DEK_WRAP_AAD = "csny.dekwrap.v1";
const KEK_SALT = "csny.kek.salt.v1";
const KEK_INFO = "csny.kek.v1";
const IV_BYTES = 12;

const enc = new TextEncoder();

export function isValidEnvelope(envelope) {
  return Boolean(
    envelope &&
      typeof envelope === "object" &&
      (envelope.v === 1 || envelope.v === ENVELOPE_VERSION) &&
      typeof envelope.iv === "string" &&
      envelope.iv &&
      typeof envelope.ct === "string" &&
      envelope.ct
  );
}

/** Fresh AES-256-GCM key. Extractable only when it must be wrapped for biometrics. */
export function generateDek({ extractable = false } = {}) {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, extractable, [
    "encrypt",
    "decrypt",
  ]);
}

export function importDekRaw(rawBytes, { extractable = false } = {}) {
  return crypto.subtle.importKey(
    "raw",
    rawBytes,
    { name: "AES-GCM", length: 256 },
    extractable,
    ["encrypt", "decrypt"]
  );
}

/** Legacy (pre-1.2) storage kept the DEK as a plaintext JWK. */
export function importDekJwk(jwk, { extractable = false } = {}) {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM", length: 256 },
    extractable,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(key, value) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: enc.encode(SETTINGS_AAD) },
    key,
    enc.encode(JSON.stringify(value))
  );
  return {
    v: ENVELOPE_VERSION,
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(ct)),
  };
}

/** Throws on wrong key, tampering, or malformed JSON. Reads v1 and v2 envelopes. */
export async function decryptJson(key, envelope) {
  if (!isValidEnvelope(envelope)) throw new Error("invalid envelope");
  const params = { name: "AES-GCM", iv: base64ToBytes(envelope.iv) };
  if (envelope.v === ENVELOPE_VERSION) {
    params.additionalData = enc.encode(SETTINGS_AAD);
  }
  const plain = await crypto.subtle.decrypt(params, key, base64ToBytes(envelope.ct));
  return JSON.parse(new TextDecoder().decode(plain));
}

/** Turns the 32-byte WebAuthn PRF output into an AES-GCM key-encryption key. */
export async function deriveKekFromPrf(prfBytes) {
  const base = await crypto.subtle.importKey(
    "raw",
    toUint8Array(prfBytes),
    "HKDF",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc.encode(KEK_SALT),
      info: enc.encode(KEK_INFO),
    },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/** @param {CryptoKey} dek must have been created extractable */
export async function wrapDek(kek, dek) {
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", dek));
  const wrapped = await wrapRawDek(kek, raw);
  return { raw, wrapped };
}

export async function wrapRawDek(kek, rawBytes) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: enc.encode(DEK_WRAP_AAD) },
    kek,
    rawBytes
  );
  return { iv: bytesToBase64(iv), ct: bytesToBase64(new Uint8Array(ct)) };
}

/** Returns the raw DEK bytes; throws if the KEK is wrong (wrong finger/credential). */
export async function unwrapRawDek(kek, wrapped) {
  if (!wrapped?.iv || !wrapped?.ct) throw new Error("invalid wrapped key");
  const raw = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBytes(wrapped.iv),
      additionalData: enc.encode(DEK_WRAP_AAD),
    },
    kek,
    base64ToBytes(wrapped.ct)
  );
  return new Uint8Array(raw);
}
