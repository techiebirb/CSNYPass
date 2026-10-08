import browser from "webextension-polyfill";
import {
  LOCK_MODES,
  validateSettingsForSave,
} from "../../shared/settings-schema.js";
import { BLACKBAUD_SIGN_IN_URL } from "../../shared/config/sites.js";
import { isBiometricSupported } from "../../shared/lib/webauthn.js";
import {
  applyBiometricAvailability,
  attachBiometricEnrollment,
  biometricErrorMessage,
  readLockConfig,
  setDelayMs,
  setStatus,
  syncLockModeVisibility,
  validateLockConfigForSetup,
  wireDelayControls,
  wirePasswordToggles,
} from "./setup-form.js";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const ORDER = ["intro", "login", "protect", "done"];
const PROGRESS_STEPS = ["login", "protect", "done"];
const STEP_TITLES = {
  login: "Your school login",
  protect: "Keep it protected",
  done: "All set",
};
const CONFETTI_COLORS = ["#00306b", "#f5a623", "#6cb4ee", "#0a6b32", "#e86a92"];
const CONFETTI_COUNT = 32;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const $ = (sel) => document.querySelector(sel);
const stepsEl = $("#steps");
const progressEl = $("#progress");
const stepEls = Object.fromEntries(
  [...document.querySelectorAll("[data-step]")].map((el) => [el.dataset.step, el])
);

/** @type {string} */
let currentStep = "intro";
let transitioning = false;
let migrationPending = false;
let biometricSupported = false;
/** Validated login settings carried from the login step to the protect step. */
let pendingSettings = null;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---- Motion helpers -------------------------------------------------------------

function animateHeight(from, to) {
  if (reducedMotion() || from === to) return;
  stepsEl.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: 280,
    easing: EASE_OUT,
  });
}

/** Runs a layout-changing update and eases the card to its new height. */
function withHeightChange(update) {
  const from = stepsEl.offsetHeight;
  update();
  animateHeight(from, stepsEl.offsetHeight);
}

function shake(el) {
  if (!el || reducedMotion()) return;
  el.classList.remove("shake");
  void el.offsetWidth; // restart the animation
  el.classList.add("shake");
  el.addEventListener("animationend", () => el.classList.remove("shake"), { once: true });
}

function burstConfetti() {
  const host = $("#confetti");
  if (!host || reducedMotion()) return;
  host.replaceChildren();
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const dist = 70 + Math.random() * 110;
    const span = document.createElement("span");
    if (Math.random() < 0.3) span.className = "round";
    span.style.setProperty("--c", CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
    span.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    span.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    span.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
    span.style.setProperty("--delay", `${Math.random() * 120}ms`);
    host.append(span);
  }
  window.setTimeout(() => host.replaceChildren(), 1900);
}

// ---- Step navigation ------------------------------------------------------------

function updateProgress(name) {
  const idx = PROGRESS_STEPS.indexOf(name);
  progressEl.hidden = idx === -1;
  if (idx === -1) return;
  const finished = name === "done";
  progressEl.style.setProperty("--p", String(finished ? 1 : idx / (PROGRESS_STEPS.length - 1)));
  [...progressEl.children].forEach((li, i) => {
    li.classList.toggle("is-done", finished || i < idx);
    li.classList.toggle("is-current", !finished && i === idx);
    if (i === idx && !finished) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
}

function settle(stepEl, name) {
  const target = stepEl.querySelector("[data-autofocus]") ?? stepEl.querySelector("h1");
  target?.focus({ preventScroll: true });
  const idx = PROGRESS_STEPS.indexOf(name);
  $("#step-announce").textContent =
    idx === -1 ? "" : `Step ${idx + 1} of ${PROGRESS_STEPS.length}: ${STEP_TITLES[name]}`;
}

async function showStep(name, { instant = false } = {}) {
  const next = stepEls[name];
  const cur = stepEls[currentStep];
  if (!next || transitioning || next === cur) return;
  updateProgress(name);

  if (instant || reducedMotion() || !cur || cur.hidden) {
    for (const el of Object.values(stepEls)) el.hidden = el !== next;
    currentStep = name;
    settle(next, name);
    return;
  }

  transitioning = true;
  const dir = ORDER.indexOf(name) >= ORDER.indexOf(currentStep) ? 1 : -1;
  const fromHeight = stepsEl.offsetHeight;
  try {
    await cur.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(${-24 * dir}px)` },
      ],
      { duration: 160, easing: "ease-in", fill: "forwards" }
    ).finished;
  } catch {
    /* interrupted: carry on to the next step */
  }
  cur.getAnimations().forEach((a) => a.cancel());
  cur.hidden = true;
  next.hidden = false;
  animateHeight(fromHeight, stepsEl.offsetHeight);
  next.animate(
    [
      { opacity: 0, transform: `translateX(${24 * dir}px)` },
      { opacity: 1, transform: "none" },
    ],
    { duration: 280, easing: EASE_OUT }
  );
  currentStep = name;
  transitioning = false;
  settle(next, name);
}

// ---- Login step -----------------------------------------------------------------

function readLoginPayload() {
  return {
    enabled: true,
    email: $("#cas-email").value.trim(),
    password: $("#cas-password").value,
    autoClickNext: $("#cas-autoClickNext").checked,
    clickDelayMs: $("#cas-clickDelayMs").value,
  };
}

function showEmailError(message) {
  const el = $("#email-error");
  el.textContent = message;
  if (message) shake($("#cas-email"));
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const validation = validateSettingsForSave(readLoginPayload());
  if (!validation.ok) {
    showEmailError(validation.error);
    $("#cas-email").focus();
    return;
  }
  showEmailError("");
  pendingSettings = validation.settings;
  showStep("protect");
}

// ---- Protect step ---------------------------------------------------------------

function setFinishBusy(busy) {
  const button = $("#btn-finish");
  button.disabled = busy;
  button.classList.toggle("is-busy", busy);
}

function protectError(message) {
  const el = $("#protect-status");
  setStatus(el, message, false);
  shake(el);
}

async function handleProtectSubmit(e) {
  e.preventDefault();
  const statusEl = $("#protect-status");
  setStatus(statusEl, "", false);

  const loginPassword = pendingSettings?.password ?? "";
  let lockConfig = readLockConfig("lock", loginPassword);

  // A half-migrated install already has its login saved; only a custom password needs checking.
  if (!migrationPending || lockConfig.mode === LOCK_MODES.CUSTOM) {
    const lockValidation = validateLockConfigForSetup(lockConfig, loginPassword);
    if (!lockValidation.ok) {
      protectError(lockValidation.error);
      return;
    }
  }

  setFinishBusy(true);

  if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
    setStatus(statusEl, "Waiting for Touch ID / Face ID…", true);
    statusEl.classList.add("waiting");
    try {
      lockConfig = await attachBiometricEnrollment(lockConfig);
    } catch (err) {
      protectError(biometricErrorMessage(err));
      setFinishBusy(false);
      return;
    }
  }

  let result;
  try {
    result = await browser.runtime.sendMessage({
      type: "SAVE_SETTINGS",
      settings: migrationPending ? null : pendingSettings,
      lock: lockConfig,
      migration: migrationPending,
    });
  } catch (err) {
    protectError(err && typeof err.message === "string" ? err.message : "Could not save settings.");
    setFinishBusy(false);
    return;
  }
  setFinishBusy(false);

  if (!result?.ok) {
    protectError(result?.error || "Could not save settings.");
    return;
  }

  const autoClick = pendingSettings ? pendingSettings.autoClickNext : null;
  finishSetup(lockConfig.mode, autoClick);
}

// ---- Done step ------------------------------------------------------------------

function describeSetup(mode, autoClick) {
  const protection = mode === LOCK_MODES.BIOMETRIC ? "Touch ID / Face ID" : "Full auto";
  if (autoClick === null) return protection;
  return `${protection} · Auto-click ${autoClick ? "on" : "off"}`;
}

function finishSetup(mode, autoClick, { celebrate = true } = {}) {
  // Nothing sensitive should linger in the page once it has been saved.
  for (const id of ["#cas-email", "#cas-password", "#lock-password", "#lock-password-confirm"]) {
    const el = $(id);
    if (el) el.value = "";
  }
  pendingSettings = null;
  $("#done-chip").textContent = describeSetup(mode, autoClick);
  showStep("done", { instant: !celebrate }).then(() => {
    if (celebrate) window.setTimeout(burstConfetti, 650);
  });
}

// ---- Wiring ---------------------------------------------------------------------

function wireLockControls() {
  const ids = ["lock-mode-auto", "lock-mode-bio", "lock-same-as-login", "lock-policy"];
  for (const id of ids) {
    $(`#${id}`)?.addEventListener("change", () => {
      withHeightChange(() => syncLockModeVisibility("lock"));
    });
  }
  applyBiometricAvailability("lock", biometricSupported);
  syncLockModeVisibility("lock");
}

function wireEmailValidity() {
  const input = $("#cas-email");
  const wrap = input.closest(".email-wrap");
  input.addEventListener("input", () => {
    wrap.classList.toggle("is-valid", EMAIL_RE.test(input.value.trim()));
    if ($("#email-error").textContent) showEmailError("");
  });
}

function openSettings() {
  browser.runtime.openOptionsPage().catch(() => {});
}

async function init() {
  wirePasswordToggles();
  wireDelayControls("cas");
  setDelayMs("cas", 300);
  biometricSupported = await isBiometricSupported();
  wireLockControls();
  wireEmailValidity();

  $("#btn-start").addEventListener("click", () => showStep("login"));
  $("#form-login").addEventListener("submit", handleLoginSubmit);
  $("#form-protect").addEventListener("submit", handleProtectSubmit);
  $("#form-login [data-back]").addEventListener("click", () => showStep("intro"));
  $("#form-protect [data-back]").addEventListener("click", () => showStep("login"));
  $("#btn-open-settings").addEventListener("click", openSettings);
  $("#btn-note-settings").addEventListener("click", openSettings);
  $("#btn-open-signin").href = BLACKBAUD_SIGN_IN_URL;

  let state;
  try {
    state = await browser.runtime.sendMessage({ type: "GET_POPUP_STATE" });
  } catch {
    state = { ok: false };
  }

  if (state?.ok && state.settingsCorrupt) {
    showStep("note", { instant: true });
    return;
  }

  if (state?.ok && state.migrationPending) {
    migrationPending = true;
    $("#migration-banner").hidden = false;
    $("#protect-title").textContent = "One more step";
    $("#protect-lead").textContent = "Choose how to protect your settings.";
    $("#btn-protect-back").hidden = true;
    $("#lock-same-as-login").checked = state.suggestSameAsLoginLock === true;
    syncLockModeVisibility("lock");
    showStep("protect", { instant: true });
    return;
  }

  if (state?.ok && state.configured) {
    $("#done-title").textContent = "You're already set up";
    $("#done-lead").textContent = "CSNYPass is filling your sign-in steps.";
    finishSetup(state.lockMode, null, { celebrate: false });
    return;
  }

  $("#btn-start").focus({ preventScroll: true });
}

init();
