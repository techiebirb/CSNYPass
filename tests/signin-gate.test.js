import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetBrowser, local, runtime, tabs, windows } from "./fakes/browser.js";
import { installFakeIndexedDb, resetFakeIndexedDb } from "./fakes/indexeddb.js";

installFakeIndexedDb();

const storage = await import("../extension/background/storage-crypto.js");
const bio = await import("../extension/background/biometric-vault.js");
await import("../extension/background/index.js");
const { bytesToBase64 } = await import("../shared/lib/bytes.js");

const SETTINGS = { email: "student@school.org", password: "s3cret-pass", enabled: true };
const SECRET = "s3cret-pass";

const SENDERS = {
  school: { tab: { url: "https://collegiateschool.myschoolapp.com/app/student" } },
  signin: { tab: { url: "https://app.blackbaud.com/signin" } },
  onelogin: { tab: { url: "https://csny.onelogin.com/login2" } },
};

function send(type, sender, extra = {}) {
  return runtime.listener({ type, ...extra }, sender);
}

function fakeEnrollment() {
  return {
    credentialId: bytesToBase64(crypto.getRandomValues(new Uint8Array(16))),
    prfSalt: bytesToBase64(crypto.getRandomValues(new Uint8Array(32))),
    prfOutput: bytesToBase64(crypto.getRandomValues(new Uint8Array(32))),
    transports: ["internal"],
  };
}

/** Saves settings, then moves the vault to biometric protection. Returns the enrollment. */
async function enrollBiometric(policy = "session") {
  await storage.saveEncryptedSettings(SETTINGS);
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  const enrollment = fakeEnrollment();
  await bio.enrollBiometric({ settings, enrollment, policy, minutes: 30 });
  await storage.clearDekCache();
  return enrollment;
}

beforeEach(() => {
  resetBrowser();
  resetFakeIndexedDb();
});

test("locked biometric vault: login pages get the email, never the password, and no window opens", async () => {
  await enrollBiometric();
  for (const sender of Object.values(SENDERS)) {
    const res = await send("GET_SETTINGS", sender);
    assert.equal(res.ok, true);
    assert.equal(res.settings.email, SETTINGS.email);
    assert.equal(res.settings.password, "");
    assert.equal(res.passwordLocked, true);
  }
  assert.equal(windows.created.length, 0, "GET_SETTINGS must never prompt");
});

test("the public profile never contains the password and is encrypted", async () => {
  await enrollBiometric();
  const blob = JSON.stringify(local._dump()[storage.PROFILE_STORAGE_KEY]);
  assert.ok(blob);
  assert.ok(!blob.includes(SECRET));
  assert.ok(!blob.includes(SETTINGS.email));
});

test("only OneLogin can ask for the unlock window", async () => {
  await enrollBiometric();
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.school)).ok, false);
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.signin)).ok, false);
  assert.equal(windows.created.length, 0);

  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.onelogin)).ok, true);
  assert.equal(windows.created.length, 1);
});

test("requests from non-automation pages are refused", async () => {
  await enrollBiometric();
  const other = { tab: { url: "https://example.com/login" } };
  assert.equal((await send("GET_SETTINGS", other)).ok, false);
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", other)).ok, false);
  assert.equal(windows.created.length, 0);
});

test("after a sign-in unlock only OneLogin receives the password", async () => {
  const enrollment = await enrollBiometric();
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });

  const onelogin = await send("GET_SETTINGS", SENDERS.onelogin);
  assert.equal(onelogin.settings.password, SECRET);
  assert.equal(onelogin.passwordLocked, false);

  for (const sender of [SENDERS.school, SENDERS.signin]) {
    const res = await send("GET_SETTINGS", sender);
    assert.equal(res.settings.email, SETTINGS.email);
    assert.equal(res.settings.password, "");
  }
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.onelogin)).alreadyUnlocked, true);
});

test("Full auto: Blackbaud tabs never receive the password either", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  assert.equal((await send("GET_SETTINGS", SENDERS.school)).settings.password, "");
  assert.equal((await send("GET_SETTINGS", SENDERS.signin)).settings.password, "");
  assert.equal((await send("GET_SETTINGS", SENDERS.onelogin)).settings.password, SECRET);
  assert.equal(storage.PROFILE_STORAGE_KEY in local._dump(), false, "no profile in Full auto");
});

test("upgrade: no profile yet reports needsProfile; only OneLogin may ask, Blackbaud never", async () => {
  const enrollment = await enrollBiometric();
  await storage.clearProfile(); // as if enrolled before the profile existed

  const res = await send("GET_SETTINGS", SENDERS.school);
  assert.equal(res.ok, false);
  assert.equal(res.locked, true);
  assert.equal(res.needsProfile, true);
  assert.equal(windows.created.length, 0);

  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.school)).ok, false);
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.signin)).ok, false);
  assert.equal(windows.created.length, 0);
  assert.equal((await send("REQUEST_SIGN_IN_UNLOCK", SENDERS.onelogin)).ok, true);
  assert.equal(windows.created.length, 1);

  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });
  assert.equal((await storage.loadProfile()).email, SETTINGS.email);
});

test("'every sign-in': a settings-only unlock keeps sign-in locked, profile still served", async () => {
  const enrollment = await enrollBiometric("attempt");
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: false });
  const res = await send("GET_SETTINGS", SENDERS.onelogin);
  assert.equal(res.settings.password, "");
  assert.equal(res.passwordLocked, true);
});

test("saving in biometric mode refreshes the profile; no saved password is reported", async () => {
  const enrollment = await enrollBiometric();
  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });
  await storage.saveEncryptedSettings({ ...SETTINGS, email: "new@school.org", password: "" });
  await storage.clearDekCache();
  const res = await send("GET_SETTINGS", SENDERS.school);
  assert.equal(res.settings.email, "new@school.org");
  assert.equal(res.passwordLocked, false);
});

test("leaving biometric mode and resetting both delete the profile and its key", async () => {
  const enrollment = await enrollBiometric();
  assert.ok(await storage.loadProfile());

  await bio.unlockWithPrf(enrollment.prfOutput, { forSignIn: true });
  const settings = (await storage.loadDecryptedSettingsResult()).settings;
  await bio.moveToAutoMode(settings, { configured: true, mode: "same_as_login" });
  assert.equal(await storage.loadProfile(), null);
  assert.equal(storage.PROFILE_STORAGE_KEY in local._dump(), false);

  const again = await enrollBiometric();
  assert.ok(await storage.loadProfile());
  await storage.clearExtensionStorageData();
  assert.equal(await storage.loadProfile(), null);
  assert.equal(storage.PROFILE_STORAGE_KEY in local._dump(), false);
  void again;
});

const PAUSE_KEY = "csnyExtension.pausedUntil.v1";

test("pause: login pages are told automation is off while paused, and again after it ends", async () => {
  await storage.saveEncryptedSettings(SETTINGS);
  const live = await send("GET_SETTINGS", SENDERS.onelogin);
  assert.equal(live.settings.enabled, true);

  const { session } = await import("./fakes/browser.js");
  await session.set({ [PAUSE_KEY]: Date.now() + 60_000 });
  const paused = await send("GET_SETTINGS", SENDERS.onelogin);
  assert.equal(paused.settings.enabled, false);

  await session.set({ [PAUSE_KEY]: Date.now() - 1 });
  const over = await send("GET_SETTINGS", SENDERS.onelogin);
  assert.equal(over.settings.enabled, true);
});

test("toolbar badge: no LOCK indicator after an 'every sign-in' unlock is spent", async () => {
  const { action } = await import("./fakes/browser.js");
  const enrollment = await enrollBiometric("attempt");
  const unlockPage = { url: "chrome-extension://test/popup/unlock.html" };

  await send("UNLOCK_BIOMETRIC", unlockPage, { prfOutput: enrollment.prfOutput, forSignIn: true });
  assert.equal(action.badge, "");

  await send("FLOW_DONE", SENDERS.onelogin);
  assert.equal(action.badge, "");
});

const POPUP = { url: "chrome-extension://test/popup/popup.html" };

test("same-as-login lock: a save with the OneLogin password blanked is refused", async () => {
  const settings = { email: "student@school.org", password: "s3cret-pass", enabled: true };
  const setup = await runtime.listener(
    { type: "SAVE_SETTINGS", settings, lock: { mode: "same_as_login", loginPassword: settings.password } },
    POPUP
  );
  assert.equal(setup.ok, true);

  const unlocked = await runtime.listener({ type: "UNLOCK_SETTINGS", password: settings.password }, POPUP);
  assert.equal(unlocked.ok, true);

  const blanked = await runtime.listener(
    {
      type: "SAVE_SETTINGS",
      settings: { ...settings, password: "" },
      sessionNonce: unlocked.sessionNonce,
    },
    POPUP
  );
  assert.equal(blanked.ok, false);
  assert.match(blanked.error, /unlocks settings/);

  const kept = await runtime.listener(
    { type: "SAVE_SETTINGS", settings: { ...settings, enabled: false }, sessionNonce: unlocked.sessionNonce },
    POPUP
  );
  assert.equal(kept.ok, true);
});

test("first install opens the welcome tab; updates do not", async () => {
  await runtime.installedListener({ reason: "install" });
  assert.deepEqual(
    tabs.created.map((t) => t.url),
    ["chrome-extension://test/popup/welcome.html"]
  );

  tabs.created = [];
  await runtime.installedListener({ reason: "update" });
  assert.equal(tabs.created.length, 0);
});
