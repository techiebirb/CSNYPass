import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSettings } from "../shared/settings-schema.js";
import {
  canAutoSubmit,
  isDifferentAccount,
  recordAutoSubmit,
} from "../shared/lib/attempts.js";

test("a 0 ms click delay is kept; bad values fall back to the default and range is clamped", () => {
  assert.equal(normalizeSettings({ clickDelayMs: 0 }).clickDelayMs, 0);
  assert.equal(normalizeSettings({ clickDelayMs: "0" }).clickDelayMs, 0);
  assert.equal(normalizeSettings({ clickDelayMs: "abc" }).clickDelayMs, 300);
  assert.equal(normalizeSettings({}).clickDelayMs, 300);
  assert.equal(normalizeSettings({ clickDelayMs: 99999 }).clickDelayMs, 5000);
  assert.equal(normalizeSettings({ clickDelayMs: -5 }).clickDelayMs, 0);
});

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
  };
}

test("auto-submit is capped at two within the window, then allowed again", () => {
  const storage = fakeStorage();
  const t0 = 1_000_000;
  assert.equal(canAutoSubmit(storage, "k", { now: t0 }), true);
  recordAutoSubmit(storage, "k", { now: t0 });
  assert.equal(canAutoSubmit(storage, "k", { now: t0 + 1000 }), true);
  recordAutoSubmit(storage, "k", { now: t0 + 1000 });
  assert.equal(canAutoSubmit(storage, "k", { now: t0 + 2000 }), false);
  assert.equal(canAutoSubmit(storage, "other", { now: t0 + 2000 }), true);
  assert.equal(canAutoSubmit(storage, "k", { now: t0 + 6 * 60_000 }), true);
});

test("a corrupt attempts record does not block sign-in", () => {
  const storage = fakeStorage();
  storage.setItem("k", "not json");
  assert.equal(canAutoSubmit(storage, "k"), true);
  storage.setItem("k", '{"a":1}');
  assert.equal(canAutoSubmit(storage, "k"), true);
});

test("prefilled username: empty or same account is fine, different account is not", () => {
  assert.equal(isDifferentAccount("", "a@b.org"), false);
  assert.equal(isDifferentAccount("  A@B.org ", "a@b.org"), false);
  assert.equal(isDifferentAccount("other@b.org", "a@b.org"), true);
});
