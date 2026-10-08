/** Backoff for repeated wrong settings-password attempts. */

const FREE_ATTEMPTS = 3;
const BASE_DELAY_MS = 5_000;
const MAX_DELAY_MS = 5 * 60_000;

/** Delay to impose after `failCount` consecutive failures (0 for the first few). */
export function lockoutDelayMs(failCount) {
  if (!Number.isFinite(failCount) || failCount <= FREE_ATTEMPTS - 1) return 0;
  const exponent = failCount - FREE_ATTEMPTS;
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** exponent);
}

/** @returns {number} milliseconds still to wait, or 0 */
export function remainingLockoutMs(state, now = Date.now()) {
  const until = Number(state?.until) || 0;
  return Math.max(0, until - now);
}

export function nextFailureState(state, now = Date.now()) {
  const count = (Number(state?.count) || 0) + 1;
  return { count, until: now + lockoutDelayMs(count) };
}
