import browser from "webextension-polyfill";

/**
 * Memory-only, extension-only storage (cleared when the browser closes).
 * Survives MV3 service-worker restarts, unlike a plain variable. Falls back to a
 * Map on browsers without storage.session.
 */
const fallback = new Map();

function area() {
  return browser.storage?.session ?? globalThis.chrome?.storage?.session ?? null;
}

export async function sessionGet(key) {
  const store = area();
  if (!store) return fallback.get(key);
  const result = await store.get(key);
  return result?.[key];
}

export async function sessionSet(key, value) {
  const store = area();
  if (!store) {
    fallback.set(key, value);
    return;
  }
  await store.set({ [key]: value });
}

export async function sessionRemove(key) {
  const store = area();
  if (!store) {
    fallback.delete(key);
    return;
  }
  await store.remove(key);
}
