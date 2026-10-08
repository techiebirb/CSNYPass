import test from "node:test";
import assert from "node:assert/strict";
import { base64ToBytes, bytesToBase64 } from "../shared/lib/bytes.js";
import {
  decryptJson,
  deriveKekFromPrf,
  encryptJson,
  generateDek,
  importDekRaw,
  isValidEnvelope,
  unwrapRawDek,
  wrapDek,
} from "../shared/lib/vault.js";

const sample = { email: "a@b.co", password: "hunter2", enabled: true };

test("v2 envelope round-trips", async () => {
  const dek = await generateDek();
  const envelope = await encryptJson(dek, sample);
  assert.equal(envelope.v, 2);
  assert.deepEqual(await decryptJson(dek, envelope), sample);
});

test("fresh IV per encryption", async () => {
  const dek = await generateDek();
  const a = await encryptJson(dek, sample);
  const b = await encryptJson(dek, sample);
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ct, b.ct);
});

test("wrong key and tampering both fail", async () => {
  const dek = await generateDek();
  const other = await generateDek();
  const envelope = await encryptJson(dek, sample);
  await assert.rejects(decryptJson(other, envelope));

  const bytes = base64ToBytes(envelope.ct);
  bytes[0] ^= 1;
  await assert.rejects(decryptJson(dek, { ...envelope, ct: bytesToBase64(bytes) }));
});

test("v1 envelopes (no AAD) still decrypt", async () => {
  const dek = await generateDek();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    dek,
    new TextEncoder().encode(JSON.stringify(sample))
  );
  const v1 = { v: 1, iv: bytesToBase64(iv), ct: bytesToBase64(new Uint8Array(ct)) };
  assert.deepEqual(await decryptJson(dek, v1), sample);
});

test("a v2 envelope relabeled v1 is rejected (AAD binds the version)", async () => {
  const dek = await generateDek();
  const envelope = await encryptJson(dek, sample);
  await assert.rejects(decryptJson(dek, { ...envelope, v: 1 }));
});

test("envelope validation", () => {
  assert.equal(isValidEnvelope(null), false);
  assert.equal(isValidEnvelope({ v: 3, iv: "a", ct: "b" }), false);
  assert.equal(isValidEnvelope({ v: 2, iv: "", ct: "b" }), false);
  assert.equal(isValidEnvelope({ v: 2, iv: "a", ct: "b" }), true);
});

test("biometric wrap: right PRF unlocks, wrong PRF does not", async () => {
  const prf = crypto.getRandomValues(new Uint8Array(32));
  const dek = await generateDek({ extractable: true });
  const envelope = await encryptJson(dek, sample);
  const { raw, wrapped } = await wrapDek(await deriveKekFromPrf(prf), dek);

  const unwrapped = await unwrapRawDek(await deriveKekFromPrf(prf), wrapped);
  assert.deepEqual(unwrapped, raw);
  const restored = await importDekRaw(unwrapped);
  assert.deepEqual(await decryptJson(restored, envelope), sample);

  const wrongPrf = crypto.getRandomValues(new Uint8Array(32));
  await assert.rejects(unwrapRawDek(await deriveKekFromPrf(wrongPrf), wrapped));
});

test("restored DEK is non-extractable", async () => {
  const dek = await generateDek({ extractable: true });
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", dek));
  const restored = await importDekRaw(raw);
  await assert.rejects(crypto.subtle.exportKey("raw", restored));
});

test("default DEK cannot be exported", async () => {
  const dek = await generateDek();
  await assert.rejects(crypto.subtle.exportKey("raw", dek));
});
