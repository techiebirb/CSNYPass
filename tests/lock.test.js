import test from "node:test";
import assert from "node:assert/strict";
import {
  LEGACY_PBKDF2_ITERATIONS,
  PBKDF2_ITERATIONS,
  derivePbkdf2Sha256,
  hashCustomLockPassword,
  timingSafeEqualString,
  verifyCustomLockPassword,
} from "../shared/lib/crypto.js";
import { bytesToBase64 } from "../shared/lib/bytes.js";
import {
  lockoutDelayMs,
  nextFailureState,
  remainingLockoutMs,
} from "../shared/lib/throttle.js";
import {
  LOCK_MODES,
  UNLOCK_POLICIES,
  normalizeUnlockPolicy,
  validateLockSetup,
} from "../shared/settings-schema.js";

test("new lock hashes use the stronger iteration count", async () => {
  assert.ok(PBKDF2_ITERATIONS >= 600_000);
  const { salt, hash, iter } = await hashCustomLockPassword("correct horse");
  assert.equal(iter, PBKDF2_ITERATIONS);
  assert.equal(await verifyCustomLockPassword("correct horse", salt, hash, iter), true);
  assert.equal(await verifyCustomLockPassword("wrong", salt, hash, iter), false);
});

test("legacy 100k records still verify when told their iteration count", async () => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePbkdf2Sha256("old-pass", salt, LEGACY_PBKDF2_ITERATIONS);
  const saltB64 = bytesToBase64(salt);
  const hashB64 = bytesToBase64(hash);
  // Default (no iter in meta) must be the legacy count.
  assert.equal(await verifyCustomLockPassword("old-pass", saltB64, hashB64), true);
  assert.equal(
    await verifyCustomLockPassword("old-pass", saltB64, hashB64, PBKDF2_ITERATIONS),
    false
  );
});

test("timingSafeEqualString", () => {
  assert.equal(timingSafeEqualString("abc", "abc"), true);
  assert.equal(timingSafeEqualString("abc", "abd"), false);
  assert.equal(timingSafeEqualString("abc", "abcd"), false);
  assert.equal(timingSafeEqualString("", ""), true);
});

test("lockout backoff grows, caps, and starts after a few free tries", () => {
  assert.equal(lockoutDelayMs(1), 0);
  assert.equal(lockoutDelayMs(2), 0);
  assert.equal(lockoutDelayMs(3), 5_000);
  assert.equal(lockoutDelayMs(4), 10_000);
  assert.equal(lockoutDelayMs(5), 20_000);
  assert.equal(lockoutDelayMs(50), 5 * 60_000);
});

test("failure state tracks count and remaining wait", () => {
  let state;
  const now = 1_000_000;
  for (let i = 0; i < 3; i++) state = nextFailureState(state, now);
  assert.equal(state.count, 3);
  assert.equal(remainingLockoutMs(state, now), 5_000);
  assert.equal(remainingLockoutMs(state, now + 5_001), 0);
  assert.equal(remainingLockoutMs(undefined, now), 0);
});

test("unlock policy normalization", () => {
  assert.deepEqual(normalizeUnlockPolicy("attempt", 5), {
    policy: UNLOCK_POLICIES.ATTEMPT,
    minutes: 5,
  });
  assert.equal(normalizeUnlockPolicy("bogus", 10).policy, UNLOCK_POLICIES.SESSION);
  assert.equal(normalizeUnlockPolicy("minutes", 99999).minutes, 1440);
  assert.equal(normalizeUnlockPolicy("minutes", 0).minutes, 1);
  assert.equal(normalizeUnlockPolicy("minutes", "abc").minutes, 30);
});

test("lock setup validation covers all three modes", () => {
  assert.equal(validateLockSetup({ mode: LOCK_MODES.BIOMETRIC }).ok, true);
  assert.equal(validateLockSetup({ mode: LOCK_MODES.SAME_AS_LOGIN, loginPassword: "" }).ok, false);
  assert.equal(
    validateLockSetup({ mode: LOCK_MODES.SAME_AS_LOGIN, loginPassword: "x" }).ok,
    true
  );
  assert.equal(
    validateLockSetup({
      mode: LOCK_MODES.CUSTOM,
      settingsPassword: "abcd",
      confirmPassword: "abce",
    }).ok,
    false
  );
  assert.equal(
    validateLockSetup({
      mode: LOCK_MODES.CUSTOM,
      settingsPassword: "abcd",
      confirmPassword: "abcd",
    }).ok,
    true
  );
});
