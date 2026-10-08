/** Shared settings shape (mirrors userscript CollegiateStorage). */

export const DEFAULTS = {
  enabled: true,
  email: "",
  password: "",
  autoClickNext: true,
  clickDelayMs: 300,
};

export function normalizeSettings(raw) {
  const merged = { ...DEFAULTS, ...(raw && typeof raw === "object" ? raw : {}) };
  merged.enabled = merged.enabled !== false;
  merged.email = String(merged.email || "").trim();
  merged.password = String(merged.password || "");
  merged.autoClickNext = merged.autoClickNext !== false;
  const delay = Number(merged.clickDelayMs);
  merged.clickDelayMs = Number.isFinite(delay)
    ? Math.max(0, Math.min(5000, delay))
    : DEFAULTS.clickDelayMs;
  return merged;
}

export function validateSettingsForSave(values) {
  const payload = normalizeSettings(values);
  if (!payload.email) {
    return { ok: false, error: "Enter your email address." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  return { ok: true, settings: payload };
}

export const LOCK_MODES = {
  CUSTOM: "custom",
  SAME_AS_LOGIN: "same_as_login",
  BIOMETRIC: "biometric",
};

/** How long one biometric unlock keeps sign-in automation working. */
export const UNLOCK_POLICIES = {
  ATTEMPT: "attempt",
  SESSION: "session",
  MINUTES: "minutes",
};

export const DEFAULT_UNLOCK_POLICY = UNLOCK_POLICIES.SESSION;
export const DEFAULT_UNLOCK_MINUTES = 30;
export const MAX_UNLOCK_MINUTES = 1440;

export function normalizeUnlockPolicy(policy, minutes) {
  const valid = Object.values(UNLOCK_POLICIES);
  const normalizedPolicy = valid.includes(policy) ? policy : DEFAULT_UNLOCK_POLICY;
  const m = Math.round(Number(minutes));
  const normalizedMinutes = Number.isFinite(m)
    ? Math.min(MAX_UNLOCK_MINUTES, Math.max(1, m))
    : DEFAULT_UNLOCK_MINUTES;
  return { policy: normalizedPolicy, minutes: normalizedMinutes };
}

const MIN_CUSTOM_LOCK_PASSWORD_LENGTH = 4;

/**
 * @param {{ mode: string, settingsPassword?: string, confirmPassword?: string, loginPassword?: string }} input
 */
export function validateLockSetup(input) {
  if (input?.mode === LOCK_MODES.BIOMETRIC) {
    return { ok: true, mode: LOCK_MODES.BIOMETRIC };
  }
  const mode = input?.mode === LOCK_MODES.SAME_AS_LOGIN
    ? LOCK_MODES.SAME_AS_LOGIN
    : LOCK_MODES.CUSTOM;

  if (mode === LOCK_MODES.SAME_AS_LOGIN) {
    const loginPassword = String(input?.loginPassword ?? "");
    if (!loginPassword.trim()) {
      return {
        ok: false,
        error: "Enter your OneLogin password, or choose a separate settings password.",
      };
    }
    return { ok: true, mode };
  }

  const settingsPassword = String(input?.settingsPassword ?? "");
  const confirmPassword = String(input?.confirmPassword ?? "");
  if (!settingsPassword) {
    return { ok: false, error: "Enter a settings password." };
  }
  if (settingsPassword.length < MIN_CUSTOM_LOCK_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Settings password must be at least ${MIN_CUSTOM_LOCK_PASSWORD_LENGTH} characters.`,
    };
  }
  if (settingsPassword !== confirmPassword) {
    return { ok: false, error: "Settings passwords do not match." };
  }
  return { ok: true, mode };
}
