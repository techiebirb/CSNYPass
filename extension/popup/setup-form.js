/** Form helpers shared by the settings page (popup.js) and the welcome tab (welcome.js). */
import {
  DEFAULTS,
  LOCK_MODES,
  UNLOCK_POLICIES,
  normalizeUnlockPolicy,
  validateLockSetup,
} from "../../shared/settings-schema.js";
import { BiometricError, createBiometricCredential } from "../../shared/lib/webauthn.js";

export function setStatus(el, message, ok) {
  if (!el) return;
  el.textContent = message || "";
  el.className = "status" + (message ? (ok ? " ok" : " err") : "");
}

export function setPrimaryBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
}

export function wirePasswordToggles() {
  document.querySelectorAll(".toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const input = id ? document.querySelector(`#${id}`) : null;
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });
}

export function clampDelayMs(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n)) return DEFAULTS.clickDelayMs;
  return Math.min(5000, Math.max(0, Math.round(n)));
}

function formatDelayLabel(ms) {
  const seconds = clampDelayMs(ms) / 1000;
  return `${seconds.toFixed(1)} s`;
}

export function setDelayMs(prefix, ms) {
  const value = clampDelayMs(ms);
  const slider = document.querySelector(`#${prefix}-clickDelaySlider`);
  const number = document.querySelector(`#${prefix}-clickDelayMs`);
  const label = document.querySelector(`#${prefix}-clickDelayLabel`);
  if (slider) slider.value = String(value);
  if (number) number.value = String(value);
  if (label) label.textContent = formatDelayLabel(value);
}

export function wireDelayControls(prefix) {
  const slider = document.querySelector(`#${prefix}-clickDelaySlider`);
  const number = document.querySelector(`#${prefix}-clickDelayMs`);
  if (!slider || !number) return;

  slider.addEventListener("input", () => {
    setDelayMs(prefix, slider.value);
  });
  number.addEventListener("input", () => {
    setDelayMs(prefix, number.value);
  });
  number.addEventListener("change", () => {
    setDelayMs(prefix, number.value);
  });
}

export function isBiometricSelected(prefix) {
  return document.querySelector(`#${prefix}-mode-bio`)?.checked === true;
}

export function syncLockModeVisibility(prefix = "lock") {
  const bio = isBiometricSelected(prefix);
  const autoFields = document.querySelector(`#${prefix}-auto-fields`);
  const bioFields = document.querySelector(`#${prefix}-bio-fields`);
  if (autoFields) autoFields.hidden = bio;
  if (bioFields) bioFields.hidden = !bio;

  const sameAsLogin = document.querySelector(`#${prefix}-same-as-login`);
  const customFields = document.querySelector(`#${prefix}-custom-fields`);
  if (sameAsLogin && customFields) customFields.hidden = sameAsLogin.checked;

  const policy = document.querySelector(`#${prefix}-policy`)?.value;
  const minutesWrap = document.querySelector(`#${prefix}-minutes-wrap`);
  if (minutesWrap) minutesWrap.hidden = policy !== UNLOCK_POLICIES.MINUTES;
}

export function applyBiometricAvailability(prefix, supported) {
  const option = document.querySelector(`#${prefix}-mode-bio-option`);
  const note = document.querySelector(`#${prefix}-bio-unsupported`);
  if (option) option.hidden = !supported;
  if (note) note.hidden = supported;
}

function readBiometricOptions(prefix) {
  return normalizeUnlockPolicy(
    document.querySelector(`#${prefix}-policy`)?.value,
    document.querySelector(`#${prefix}-minutes`)?.value
  );
}

/**
 * @param {string} prefix "lock" | "edit-lock"
 * @param {string} loginPasswordValue
 */
export function readLockConfig(prefix, loginPasswordValue) {
  if (isBiometricSelected(prefix)) {
    return { mode: LOCK_MODES.BIOMETRIC, ...readBiometricOptions(prefix) };
  }
  const sameAsLogin = document.querySelector(`#${prefix}-same-as-login`)?.checked;
  if (sameAsLogin) {
    return {
      mode: LOCK_MODES.SAME_AS_LOGIN,
      loginPassword: loginPasswordValue,
    };
  }
  return {
    mode: LOCK_MODES.CUSTOM,
    settingsPassword:
      document.querySelector(`#${prefix}-password`)?.value ?? "",
    confirmPassword:
      document.querySelector(`#${prefix}-password-confirm`)?.value ?? "",
    loginPassword: loginPasswordValue,
  };
}

export function biometricErrorMessage(err) {
  if (err instanceof BiometricError) return err.message;
  return err && typeof err.message === "string"
    ? err.message
    : "Touch ID / Face ID failed.";
}

/** Runs the OS biometric prompt (needs a click) and attaches the result to the lock config. */
export async function attachBiometricEnrollment(lockConfig) {
  const enrollment = await createBiometricCredential();
  return { ...lockConfig, enrollment };
}

export function validateLockConfigForSetup(lockConfig, loginPassword) {
  if (lockConfig.mode === LOCK_MODES.BIOMETRIC) return { ok: true };
  return validateLockSetup({
    mode: lockConfig.mode,
    settingsPassword: lockConfig.settingsPassword,
    confirmPassword: lockConfig.confirmPassword,
    loginPassword,
  });
}
