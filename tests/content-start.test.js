import test from "node:test";
import assert from "node:assert/strict";

// Minimal page globals: enough for the automation engine to start on a non-sign-in host.
const store = new Map([
  ["csnyPass/csny-onelogin/password", "1"],
  ["csnyPass.attempts/csny-onelogin/password", "[1,2]"],
]);
// Deno ships its own sessionStorage global, so a plain assignment would be ignored.
Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: {
    get length() {
      return store.size;
  },
  key: (i) => [...store.keys()][i] ?? null,
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  },
});
const listeners = [];
globalThis.window = {
  location: { hostname: "example.test", href: "https://example.test/" },
  addEventListener: (type) => listeners.push(type),
  navigation: { addEventListener: (type) => listeners.push(`navigation:${type}`) },
};
globalThis.document = { documentElement: {}, visibilityState: "visible" };
globalThis.MutationObserver = class {
  observe() {}
};

const { startAutomationEngine } = await import("../extension/content/automation.js");

test("a fresh page starts with its step guards cleared; the submit-attempt cap survives", () => {
  startAutomationEngine(null);
  assert.equal(store.has("csnyPass/csny-onelogin/password"), false);
  assert.equal(store.has("csnyPass.attempts/csny-onelogin/password"), true);
});

test("page-driven history changes are watched through the Navigation API", () => {
  assert.ok(listeners.includes("navigation:currententrychange"));
});
