import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetBrowser, local, session } from "./fakes/browser.js";
import {
  installFakeIndexedDb,
  peekFakeKeystore,
  resetFakeIndexedDb,
} from "./fakes/indexeddb.js";

installFakeIndexedDb();

const storage = await import("../extension/background/storage-crypto.js");
const lockMeta = await import("../extension/background/lock-meta.js");
const lock = await import("../extension/background/settings-lock.js");
const bio = await import("../extension/background/biometric-vault.js");
const { bytesToBase64 } = await import("../shared/lib/bytes.js");
const { encryptJson, generateDek } = await import("../shared/lib/vault.js");

const SETTINGS = { email: "student@school.org", password: "s3cret-pass", enabled: true };
const SECRET = "s3cret-pass";

function fakeEnrollment() {
  return {
    credentialId: bytesToBase64(crypto.getRandomValues(new Uint8Array(16))),
    prfSalt: bytesToBase64(crypto.getRandomValues(new Uint8Array(32))),
    prfOutput: bytesToBase64(crypto.getRandomValues(new Uint8Array(32))),
    transports: ["internal"],
  };
}

function everythingStored() {
  return JSON.stringify({ local: local._dump(), session: session._dump() });
}

beforeEach(() => {
  resetBrowser();
  resetFakeIndexedDb();
});

test("Full auto: first save encrypts with a non-extractable key held outside storage.local", async () => {
  const saved = await storage.saveEncryptedSettings(SETTINGS);
  assert.equal(saved.ok, true);

  const dump = local._dump();
  assert.equal(dump[storage.SETTINGS_STORAGE_KEY].v, 2);
  assert.equal(storage.DEK_STORAGE_KEY in dump, false, "no plaintext key in storage.local");
  assert.ok(!everythingStored().includes(SECRET));

  const key = peekFakeKeystore().get("dek");
  assert.ok(key, "key lives in the keystore");
  assert.equal(key.extractable, false);

  const loaded = await storage.loadDecryptedSettingsResult();
  assert.equal(loaded.ok, true);
  assert.equal(loaded.settings.email, SETTINGS.email);
});

test("legacy v1 blob + plaintext JWK key migrate in place", async () => {
  const legacyKey = await generateDek({ extractable: true });
  const jwk = await crypto.subtle.exportKey("jwk", legacyKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    legacyKey,
    new TextEncoder().encode(JSON.stringify(SETTINGS))
  );
  await local.set({
    [storage.DEK_STORAGE_KEY]: jwk,
    [storage.SETTINGS_STORAGE_KEY]: {
      v: 1,
      iv: bytesToBase64(iv),
      ct: bytesToBase64(new Uint8Array(ct)),
    },
  });

  const loaded = await storage.loadDecryptedSettingsResult();
  assert.equal(loaded.ok, true);
  assert.equal(loaded.settings.password, SECRET);

  const dump = local._dump();
  assert.equal(storage.DEK_STORAGE_KEY in dump, false, "plaintext JWK removed");
  assert.equal(dump[storage.SETTINGS_STORAGE_KEY].v, 2, "blob upgraded to v2");
  assert.equal(peekFakeKeystore().get("dek").extractable, false);

  const again = await storage.loadDecryptedSettingsResult();
  assert.equal(again.ok, true);
});

test("a tampered blob reads as corrupt, and a missing key is never silently replaced", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const dump = local._dump();
  const envelope = dump[storage.SETTINGS_STORAGE_KEY];
  envelope.ct = envelope.ct.slice(0, -4) + "AAAA";
  await local.set({ [storage.SETTINGS_STORAGE_KEY]: envelope });
  assert.deepEqual(await storage.loadDecryptedSettingsResult(), {
    ok: false,
    reason: "corrupt",
  });

  resetFakeIndexedDb();
  await storage.saveEncryptedSettings(SETTINGS); // mints a fresh key + blob
  resetFakeIndexedDb(); // key lost
  const lost = await storage.loadDecryptedSettingsResult();
  assert.deepEqual(lost, { ok: false, reason: "corrupt" });
  assert.equal(peekFakeKeystore()?.get("dek"), undefined, "reading never creates a replacement key");
});

test("custom lock: backoff after repeated failures, reset on success", async () => {
  const built = await lock.buildLockMetaFromSetup(
    { mode: "custom", settingsPassword: "open-sesame", confirmPassword: "open-sesame" },
    SETTINGS
  );
  assert.equal(built.ok, true);
  assert.equal(built.meta.iter >= 600_000, true);
  await lockMeta.saveLockMeta(built.meta);

  for (let i = 0; i < 3; i++) {
    assert.equal((await lock.verifyUnlockPassword("nope")).ok, false);
  }
  const blocked = await lock.verifyUnlockPassword("open-sesame");
  assert.equal(blocked.ok, false);
  assert.equal(blocked.throttled, true);
  assert.match(blocked.error, /Try again in/);

  await session.set({ "csnyExtension.unlockFails.v1": { count: 3, until: 0 } });
  assert.equal((await lock.verifyUnlockPassword("open-sesame")).ok, true);
  assert.equal("csnyExtension.unlockFails.v1" in session._dump(), false);
});

test("legacy custom lock hash is accepted once, then upgraded", async () => {
  const { derivePbkdf2Sha256 } = await import("../shared/lib/crypto.js");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePbkdf2Sha256("old-lock-pw", salt, 100_000);
  await lockMeta.saveLockMeta({
    configured: true,
    mode: "custom",
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
  });

  assert.equal((await lock.verifyUnlockPassword("old-lock-pw")).ok, true);
  const upgraded = await lockMeta.loadLockMeta();
  assert.equal(upgraded.iter >= 600_000, true);
  assert.equal((await lock.verifyUnlockPassword("old-lock-pw")).ok, true);
});

test("biometric: enroll removes plaintext key, locks without the cache, unlocks with the right PRF only", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const before = await storage.loadDecryptedSettingsResult();
  assert.equal(before.ok, true);

  const enrollment = fakeEnrollment();
  const enrolled = await bio.enrollBiometric({
    settings: before.settings,
    enrollment,
    policy: "session",
    minutes: 30,
  });
  assert.equal(enrolled.ok, true);

  assert.equal(peekFakeKeystore().get("dek"), undefined, "keystore key deleted");
  assert.equal(storage.DEK_STORAGE_KEY in local._dump(), false);
  assert.equal(await lockMeta.getLockMode(), "biometric");
  assert.ok(!JSON.stringify(local._dump()).includes(SECRET));

  // Just enrolled: cache is warm.
  assert.equal((await storage.loadDecryptedSettingsResult()).ok, true);

  // Browser restart / expiry: cache gone -> locked, not corrupt.
  await storage.clearDekCache();
  assert.deepEqual(await storage.loadDecryptedSettingsResult(), {
    ok: false,
    reason: "locked",
  });
  const lockedSave = await storage.saveEncryptedSettings(SETTINGS);
  assert.equal(lockedSave.ok, false);
  assert.equal(lockedSave.locked, true);

  const wrong = await bio.unlockWithPrf(fakeEnrollment().prfOutput);
  assert.equal(wrong.ok, false);
  assert.equal((await storage.loadDecryptedSettingsResult()).reason, "locked");

  const right = await bio.unlockWithPrf(enrollment.prfOutput);
  assert.equal(right.ok, true);
  const unlocked = await storage.loadDecryptedSettingsResult();
  assert.equal(unlocked.ok, true);
  assert.equal(unlocked.settings.password, SECRET);

  const edited = await storage.saveEncryptedSettings({ ...SETTINGS, email: "new@school.org" });
  assert.equal(edited.ok, true);
});

test("biometric: 'every sign-in' and 'minutes' policies expire the cache", async () => {
  const realNow = Date.now;
  try {
    let now = 1_700_000_000_000;
    Date.now = () => now;

    await storage.saveEncryptedSettings(SETTINGS);
    const settings = (await storage.loadDecryptedSettingsResult()).settings;
    const enrollment = fakeEnrollment();
    await bio.enrollBiometric({ settings, enrollment, policy: "attempt", minutes: 30 });
    assert.equal(await storage.readDekCache(), null, "enrolling is not a sign-in unlock");
    await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });
    assert.ok(await storage.readDekCache());
    now += storage.ATTEMPT_WINDOW_MS - 1;
    assert.ok(await storage.readDekCache(), "still inside the sign-in window");
    now += 2;
    assert.equal(await storage.readDekCache(), null, "window closed");

    await bio.updateBiometricPolicy("minutes", 10);
    await bio.unlockWithPrf(enrollment.prfOutput);
    now += 9 * 60_000;
    assert.ok(await storage.readDekCache());
    now += 2 * 60_000;
    assert.equal(await storage.readDekCache(), null);

    await bio.updateBiometricPolicy("session", 10);
    await bio.unlockWithPrf(enrollment.prfOutput);
    now += 7 * 24 * 60 * 60_000;
    assert.ok(await storage.readDekCache(), "session policy has no timer");
  } finally {
    Date.now = realNow;
  }
});

test("biometric -> Full auto: settings survive, key returns to the keystore, wrapped copy is gone", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  await bio.enrollBiometric({
    settings,
    enrollment: fakeEnrollment(),
    policy: "session",
    minutes: 30,
  });

  const unlocked = await storage.loadDecryptedSettingsResult();
  assert.equal(unlocked.ok, true);
  const built = await lock.buildLockMetaFromSetup(
    { mode: "custom", settingsPassword: "back-to-auto", confirmPassword: "back-to-auto" },
    unlocked.settings
  );
  await bio.moveToAutoMode(unlocked.settings, built.meta);

  assert.equal(await lockMeta.getLockMode(), "custom");
  assert.equal(peekFakeKeystore().get("dek").extractable, false);
  assert.equal("wrappedDek" in (await lockMeta.loadLockMeta()), false);
  assert.equal("csnyExtension.dekCache.v1" in session._dump(), false);

  const reloaded = await storage.loadDecryptedSettingsResult();
  assert.equal(reloaded.ok, true);
  assert.equal(reloaded.settings.email, SETTINGS.email);
});

test("enrollment rejects a malformed PRF output and leaves everything untouched", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  const bad = { ...fakeEnrollment(), prfOutput: bytesToBase64(new Uint8Array(5)) };
  const result = await bio.enrollBiometric({ settings, enrollment: bad, policy: "session" });
  assert.equal(result.ok, false);
  assert.ok(peekFakeKeystore().get("dek"), "original key still there");
  assert.equal(await lockMeta.getLockMode(), null);
  assert.equal((await storage.loadDecryptedSettingsResult()).ok, true);
});

test("reset wipes the key, blob, lock, and cache", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  await bio.enrollBiometric({
    settings,
    enrollment: fakeEnrollment(),
    policy: "session",
  });
  await storage.clearExtensionStorageData();
  await lock.clearLockStorageData();

  assert.deepEqual(local._dump(), {});
  assert.deepEqual(session._dump(), {});
  const result = await storage.loadDecryptedSettingsResult();
  assert.equal(result.ok, true);
  assert.equal(result.settings.email, "");
});

test("'every sign-in': enrolling does not leave sign-in unlocked", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  await bio.enrollBiometric({
    settings,
    enrollment: fakeEnrollment(),
    policy: "attempt",
    minutes: 30,
  });
  assert.equal(await storage.readDekCache(), null);
  assert.equal((await storage.loadDecryptedSettingsResult()).reason, "locked");
});

test("'every sign-in': opening settings unlocks settings but not sign-in", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  const enrollment = fakeEnrollment();
  await bio.enrollBiometric({ settings, enrollment, policy: "attempt", minutes: 30 });

  // Settings screen unlock: the editor can read/save, but sign-in must still ask.
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: false });
  const forSettings = await storage.readDekCache();
  assert.ok(forSettings, "settings screen can read and save");
  assert.equal(forSettings.forSignIn, false);
  assert.equal((await storage.loadDecryptedSettingsResult()).ok, true);

  // The real sign-in unlock upgrades it.
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });
  assert.equal((await storage.readDekCache()).forSignIn, true);

  // Opening settings afterwards must not downgrade a live sign-in unlock.
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: false });
  assert.equal((await storage.readDekCache()).forSignIn, true);
});

test("'until browser closes' / 'minutes': opening settings also unlocks sign-in (as chosen)", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  const enrollment = fakeEnrollment();
  await bio.enrollBiometric({ settings, enrollment, policy: "session", minutes: 30 });
  await storage.clearDekCache();
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: false });
  assert.equal((await storage.readDekCache()).forSignIn, true);
});

test("switching to 'every sign-in' immediately ends any live sign-in unlock", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  await bio.enrollBiometric({
    settings,
    enrollment: fakeEnrollment(),
    policy: "session",
    minutes: 30,
  });
  assert.equal((await storage.readDekCache()).forSignIn, true);
  await bio.updateBiometricPolicy("attempt", 30);
  assert.equal((await storage.readDekCache()).forSignIn, false);
});
