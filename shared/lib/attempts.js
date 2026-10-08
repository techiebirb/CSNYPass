/**
 * Caps automatic sign-in submits so a rejected password is not retried until the account
 * locks. Backed by any Storage-like object (sessionStorage in the content script).
 */

export const MAX_AUTO_SUBMITS = 2;
export const SUBMIT_WINDOW_MS = 5 * 60 * 1000;

function readTimes(storage, key, now, windowMs) {
  try {
    const parsed = JSON.parse(storage.getItem(key) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => typeof t === "number" && now - t < windowMs);
  } catch {
    return [];
  }
}

export function canAutoSubmit(
  storage,
  key,
  { max = MAX_AUTO_SUBMITS, windowMs = SUBMIT_WINDOW_MS, now = Date.now() } = {}
) {
  return readTimes(storage, key, now, windowMs).length < max;
}

export function recordAutoSubmit(
  storage,
  key,
  { windowMs = SUBMIT_WINDOW_MS, now = Date.now() } = {}
) {
  try {
    const times = readTimes(storage, key, now, windowMs);
    times.push(now);
    storage.setItem(key, JSON.stringify(times));
  } catch {
    /* storage unavailable: no limit can be kept */
  }
}

/** True when the box holds a different account than the saved email (case-insensitive). */
export function isDifferentAccount(existingValue, savedEmail) {
  const existing = String(existingValue || "").trim();
  if (!existing) return false;
  return existing.toLowerCase() !== String(savedEmail || "").trim().toLowerCase();
}
