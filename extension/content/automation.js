/**
 * Login automation (ported from userscript/main.js, no in-page settings UI).
 */
import browser from "webextension-polyfill";
import { CollegiateDom } from "../../shared/lib/dom.js";
import { normalizeSettings } from "../../shared/settings-schema.js";
import {
  canAutoSubmit,
  isDifferentAccount,
  recordAutoSubmit,
} from "../../shared/lib/attempts.js";
import { findLabeledButton, getSiteConfigForLocation } from "../../shared/config/sites.js";
import { hidePasswordRejectedNotice, showPasswordRejectedNotice } from "./notice.js";

const SESSION_PREFIX = "csnyPass";
/** Not under SESSION_PREFIX/ on purpose: navigation must not reset the submit limit. */
const ATTEMPTS_PREFIX = "csnyPass.attempts";
const LOG_PREFIX = "[CSNYPass]";

let currentSettings = null;
let automationChain = Promise.resolve();
let domWatchStarted = false;
let domDebounceTimer;
let lastAutomationHref = "";
/** @type {null | (() => Promise<unknown>)} */
let refreshSettingsFn = null;
/**
 * In memory on purpose: a page load or a relock must be able to ask again. In
 * sessionStorage it survived both, so a later sign-in in the same tab never prompted.
 */
let unlockRequested = false;
/** A requestSignInUnlock call is already waiting for focus; repeat calls must not stack. */
let unlockPending = false;
/** The "rejected twice" notice was already shown on this page; a dismissed one stays dismissed. */
let rejectionReported = false;

/** The unlock is gone (time limit or sign-in done): the next password step may ask again. */
export function resetUnlockRequest() {
  unlockRequested = false;
  unlockPending = false;
}

function isUserLooking() {
  return document.visibilityState === "visible" && document.hasFocus();
}

/** Resolves once this tab is visible and its window has focus (or after `fallbackMs`, if given). */
function waitForUserFocus({ fallbackMs = 0 } = {}) {
  return new Promise((resolve) => {
    if (!fallbackMs && isUserLooking()) {
      resolve();
      return;
    }
    let timer;
    const done = () => {
      window.removeEventListener("focus", onChange);
      document.removeEventListener("visibilitychange", onChange);
      clearTimeout(timer);
      resolve();
    };
    const onChange = () => {
      if (isUserLooking()) done();
    };
    window.addEventListener("focus", onChange);
    document.addEventListener("visibilitychange", onChange);
    if (fallbackMs) timer = setTimeout(done, fallbackMs);
  });
}

/**
 * Asks the background for the Touch ID / Face ID window, but only while the user is looking
 * at this tab. `stillNeeded` is re-checked after waiting: the page may have moved on.
 */
export async function requestSignInUnlock(stillNeeded) {
  if (unlockRequested || unlockPending) return;
  unlockPending = true;
  try {
    let retry = false;
    for (;;) {
      await waitForUserFocus({ fallbackMs: retry ? 500 : 0 });
      if (!stillNeeded()) return;
      unlockRequested = true;
      let response;
      try {
        response = await browser.runtime.sendMessage({ type: "REQUEST_SIGN_IN_UNLOCK" });
      } catch {
        return;
      }
      if (!response?.notFocused) return;
      // Background disagrees about focus: ask again later instead of spinning.
      unlockRequested = false;
      retry = true;
    }
  } finally {
    unlockPending = false;
  }
}

function stepGuardKey(siteId, step) {
  return `${SESSION_PREFIX}/${siteId}/${step}`;
}

function isStepDone(siteId, step) {
  try {
    return sessionStorage.getItem(stepGuardKey(siteId, step)) === "1";
  } catch {
    return false;
  }
}

function markStepDone(siteId, step) {
  try {
    sessionStorage.setItem(stepGuardKey(siteId, step), "1");
  } catch {
    /* ignore */
  }
}

function clearStepDone(siteId, step) {
  try {
    sessionStorage.removeItem(stepGuardKey(siteId, step));
  } catch {
    /* ignore */
  }
}

function attemptsKey(siteId, step) {
  return `${ATTEMPTS_PREFIX}/${siteId}/${step}`;
}

function autoSubmitAllowed(site, step) {
  try {
    if (canAutoSubmit(sessionStorage, attemptsKey(site.id, step))) return true;
  } catch {
    return true;
  }
  CollegiateDom.debug(`Stopped auto-submitting the ${step} step after repeated attempts`);
  return false;
}

function noteAutoSubmit(site, step) {
  try {
    recordAutoSubmit(sessionStorage, attemptsKey(site.id, step));
  } catch {
    /* ignore */
  }
}

function clearAutoSubmits(site, step) {
  try {
    sessionStorage.removeItem(attemptsKey(site.id, step));
  } catch {
    /* ignore */
  }
}

export function clearAllSessionGuards() {
  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(`${SESSION_PREFIX}/`)) keys.push(key);
    }
    for (const key of keys) sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function shouldSkipBlackbaudEmailStep(site) {
  if (!isStepDone(site.id, "email")) return false;
  if (!site.isEmailStep || !site.isEmailStep()) return true;

  const emailInput = CollegiateDom.queryFirst(site.emailSelectors);
  const empty = !emailInput || !(emailInput.value || "").trim();
  if (empty) {
    clearStepDone(site.id, "email");
    return false;
  }
  return true;
}

async function runBlackbaudSsoPickStep(settings, site) {
  if (!settings.autoClickNext) return;

  const labelRe = site.ssoButtonLabel || /Collegiate School/i;
  if (isStepDone(site.id, "sso")) {
    const stillThere = findLabeledButton(labelRe);
    if (stillThere) clearStepDone(site.id, "sso");
    else return;
  }

  const ssoButton = await CollegiateDom.waitFor(() => {
    const btn = findLabeledButton(labelRe);
    if (btn && !btn.disabled) return btn;
    return null;
  });

  if (!ssoButton) {
    CollegiateDom.debug("Collegiate School SSO button not found in time");
    return;
  }

  const clicked = await CollegiateDom.clickWhenReady(
    ssoButton,
    Number(settings.clickDelayMs) || 0
  );
  if (clicked) {
    CollegiateDom.debug("Clicked Collegiate School (Blackbaud sign-in)");
    markStepDone(site.id, "sso");
  } else {
    CollegiateDom.debug("Collegiate School SSO button not clicked");
  }
}

function shouldSkipOneLoginUsernameStep(site) {
  if (!isStepDone(site.id, "username")) return false;
  const usernameInput = CollegiateDom.queryFirst(site.usernameSelectors);
  if (
    usernameInput &&
    CollegiateDom.isVisible(usernameInput) &&
    !(usernameInput.value || "").trim()
  ) {
    clearStepDone(site.id, "username");
    return false;
  }
  return true;
}

function shouldSkipOneLoginPasswordStep(site) {
  if (!isStepDone(site.id, "password")) return false;
  const passwordInput = CollegiateDom.queryFirst(site.passwordSelectors);
  if (
    passwordInput &&
    CollegiateDom.isVisible(passwordInput) &&
    !(passwordInput.value || "").trim()
  ) {
    clearStepDone(site.id, "password");
    return false;
  }
  return true;
}

async function runBlackbaudEmailStep(settings, site) {
  if (shouldSkipBlackbaudEmailStep(site)) return;

  if (site.isEmailStep && !site.isEmailStep()) {
    CollegiateDom.debug("Not on email step; skipping");
    return;
  }

  const emailInput = await CollegiateDom.waitFor(() => {
    const el = CollegiateDom.queryFirst(site.emailSelectors);
    if (el && CollegiateDom.isVisible(el)) return el;
    return null;
  });

  if (!emailInput) {
    CollegiateDom.debug("Email field not found in time");
    return;
  }

  const targetEmail = settings.email.trim();
  const existing = (emailInput.value || "").trim();

  if (!existing) {
    const filled = CollegiateDom.fillInput(emailInput, targetEmail);
    if (!filled) {
      CollegiateDom.debug("Could not set email value");
      return;
    }
    CollegiateDom.debug("Email filled");
  } else if (existing.toLowerCase() !== targetEmail.toLowerCase()) {
    CollegiateDom.debug("Email field has different value; skipping fill");
  } else {
    CollegiateDom.debug("Email already filled");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "email");
    return;
  }

  const nextButton = await CollegiateDom.waitFor(() => {
    const btn = CollegiateDom.findNextButton(site.nextSelectors);
    if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
    return null;
  }, 5000);

  const clicked = await CollegiateDom.clickWhenReady(
    nextButton,
    Number(settings.clickDelayMs) || 0
  );

  if (clicked) {
    CollegiateDom.debug("Clicked Next");
    markStepDone(site.id, "email");
  } else {
    CollegiateDom.debug("Next button not clicked (missing or disabled)");
  }
}

async function clickSubmit(site, settings) {
  const submitButton = await CollegiateDom.waitFor(() => {
    const btn = CollegiateDom.findNextButton(site.submitSelectors);
    if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
    return null;
  }, 5000);

  return CollegiateDom.clickWhenReady(
    submitButton,
    Number(settings.clickDelayMs) || 0
  );
}

async function runOneLoginUsernameStep(settings, site) {
  if (shouldSkipOneLoginUsernameStep(site)) return true;

  const onUsername = await CollegiateDom.waitFor(() => {
    if (site.getStep() === "username") return true;
    if (site.getStep() === "password") return "skip";
    return null;
  });

  if (onUsername === "skip") {
    CollegiateDom.debug("Already on password step; skipping username");
    markStepDone(site.id, "username");
    return true;
  }
  if (!onUsername) {
    CollegiateDom.debug("Username step not found in time");
    return false;
  }

  const usernameInput = CollegiateDom.queryFirst(site.usernameSelectors);
  if (!usernameInput || !CollegiateDom.isVisible(usernameInput)) {
    CollegiateDom.debug("Username field not visible");
    return false;
  }

  const existing = (usernameInput.value || "").trim();
  if (isDifferentAccount(existing, settings.email)) {
    CollegiateDom.debug("Username field has a different account; leaving it alone");
    return false;
  }
  if (!existing) {
    const filled = CollegiateDom.fillInput(usernameInput, settings.email.trim());
    if (!filled) {
      CollegiateDom.debug("Could not set username");
      return false;
    }
    CollegiateDom.debug("Username filled");
  } else {
    CollegiateDom.debug("Username already filled; skipping fill");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "username");
    return true;
  }

  // No submit cap here: a username can't lock the account, and the cap (shared across
  // repeated sign-ins in one tab) used to leave the email filled but never submitted.
  const clicked = await clickSubmit(site, settings);
  if (clicked) {
    // A fresh sign-in starts here; a rejected password stays on the password step. Without
    // this, earlier successful sign-ins in the tab used up the password cap.
    clearAutoSubmits(site, "password");
    CollegiateDom.debug("Clicked Continue (username step)");
    markStepDone(site.id, "username");
    return true;
  }
  CollegiateDom.debug("Continue not clicked on username step");
  return false;
}

/** Touch ID / Face ID is asked for only here: the password box is on screen and still locked. */
async function requestPasswordUnlock(site) {
  if (unlockRequested || unlockPending) return;
  const onPassword = await CollegiateDom.waitFor(() =>
    site.getStep() === "password" ? true : null
  );
  if (!onPassword) return;
  await requestSignInUnlock(
    () =>
      site.getStep() === "password" &&
      currentSettings?.passwordLocked === true &&
      !currentSettings?.password?.trim()
  );
}

/**
 * Two submits already went through and the box is empty again: OneLogin rejected the saved
 * password. Stop for good, drop the password held in this tab, and tell the user.
 */
function handlePasswordRejected() {
  if (rejectionReported) return;
  rejectionReported = true;
  CollegiateDom.debug("Saved password was rejected twice; stopping");
  if (currentSettings) {
    currentSettings = { ...currentSettings, password: "", passwordLocked: false };
  }
  showPasswordRejectedNotice();
  browser.runtime.sendMessage({ type: "PASSWORD_REJECTED" }).catch(() => {});
}

/** The saved password changed: the earlier rejections no longer count. */
export function resetPasswordAttempts() {
  const site = getSiteConfigForLocation(window.location);
  if (site) clearAutoSubmits(site, "password");
  rejectionReported = false;
  hidePasswordRejectedNotice();
  scheduleAutomation();
}

async function runOneLoginPasswordStep(settings, site) {
  if (shouldSkipOneLoginPasswordStep(site)) return true;

  // Checked before any unlock prompt: a tab that has used up its tries must not ask for
  // Touch ID / Face ID for a password it won't submit.
  if (
    settings.autoClickNext &&
    site.getStep() === "password" &&
    !(CollegiateDom.queryFirst(site.passwordSelectors)?.value || "").trim() &&
    !autoSubmitAllowed(site, "password")
  ) {
    handlePasswordRejected();
    return false;
  }

  if (!settings.password?.trim()) {
    if (settings.passwordLocked) await requestPasswordUnlock(site);
    else CollegiateDom.debug("No OneLogin password saved; skipping password step");
    return false;
  }

  const passwordInput = await CollegiateDom.waitFor(() => {
    if (site.getStep() !== "password") return null;
    const el = CollegiateDom.queryFirst(site.passwordSelectors);
    if (el && CollegiateDom.isVisible(el)) return el;
    return null;
  });

  if (!passwordInput) {
    CollegiateDom.debug("Password field not found in time");
    return false;
  }

  const existing = (passwordInput.value || "").trim();
  if (!existing) {
    if (settings.autoClickNext && !autoSubmitAllowed(site, "password")) return false;
    const filled = CollegiateDom.fillInput(passwordInput, settings.password);
    if (!filled) {
      CollegiateDom.debug("Could not set password");
      return false;
    }
    CollegiateDom.debug("Password filled");
  } else {
    CollegiateDom.debug("Password field already has value; skipping fill");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "password");
    return true;
  }

  if (!autoSubmitAllowed(site, "password")) return false;
  const clicked = await clickSubmit(site, settings);
  if (clicked) {
    noteAutoSubmit(site, "password");
    CollegiateDom.debug("Clicked Continue (password step)");
    markStepDone(site.id, "password");
    return true;
  }
  CollegiateDom.debug("Continue not clicked on password step");
  return false;
}

/** Lets "every sign-in" biometric mode drop its unlock once the login is submitted. */
function reportSignInFinished() {
  browser.runtime.sendMessage({ type: "FLOW_DONE" }).catch(() => {});
}

async function runOneLoginFlow(settings, site) {
  const usernameDone = await runOneLoginUsernameStep(settings, site);
  const passwordDone = await runOneLoginPasswordStep(settings, site);
  const hasPassword =
    Boolean(settings.password?.trim()) || settings.passwordLocked === true;
  if (hasPassword ? passwordDone : usernameDone) reportSignInFinished();
}

/**
 * Does nothing unless a real sign-in form is on screen: settings are not even
 * requested on any other page of these sites.
 */
async function runAutomation() {
  const site = getSiteConfigForLocation(window.location);
  if (!site) {
    CollegiateDom.debug("No site config for", window.location.hostname);
    return;
  }
  if (!site.isSignInPage()) return;

  if (!currentSettings?.email?.trim() && refreshSettingsFn) {
    const refreshed = await refreshSettingsFn();
    if (refreshed) currentSettings = refreshed;
  }
  // Picking "Collegiate School" needs no email or password, so while the public profile
  // is unavailable (first sign-in after an update) it still runs with defaults.
  if (site.runFlow === "blackbaudSsoPick" && currentSettings?.profileUnavailable) {
    await runBlackbaudSsoPickStep(normalizeSettings({}), site);
    return;
  }

  const settings = currentSettings;
  if (!settings?.enabled || !settings.email?.trim()) return;

  if (site.runFlow === "oneLogin") {
    await runOneLoginFlow(settings, site);
    return;
  }

  if (site.runFlow === "blackbaudSsoPick") {
    await runBlackbaudSsoPickStep(settings, site);
    return;
  }

  if (site.runFlow === "blackbaudEmail" || site.emailSelectors) {
    await runBlackbaudEmailStep(settings, site);
  }
}

function scheduleAutomation() {
  automationChain = automationChain
    .then(() => runAutomation())
    .catch((err) => {
      console.debug(LOG_PREFIX, err);
    });
}

/** Swap settings (e.g. password dropped on relock) without triggering a run. */
export function setAutomationSettings(settings) {
  currentSettings = settings;
}

export function applySettings(settings) {
  currentSettings = settings;
  scheduleAutomation();
}

function noteHrefChangeAndMaybeClearGuards() {
  const href = window.location.href;
  if (href === lastAutomationHref) return;
  const prev = lastAutomationHref;
  lastAutomationHref = href;
  if (!prev) return;
  try {
    const next = new URL(href);
    const prior = new URL(prev);
    if (
      next.origin !== prior.origin ||
      next.pathname !== prior.pathname ||
      next.search !== prior.search
    ) {
      clearAllSessionGuards();
    }
  } catch {
    clearAllSessionGuards();
  }
}

function onNavigationLikeActivity() {
  noteHrefChangeAndMaybeClearGuards();
  scheduleAutomation();
}

function startDomWatch() {
  if (domWatchStarted) return;
  domWatchStarted = true;
  lastAutomationHref = window.location.href;

  window.addEventListener("hashchange", onNavigationLikeActivity);
  window.addEventListener("popstate", onNavigationLikeActivity);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) clearAllSessionGuards();
    onNavigationLikeActivity();
  });

  // pushState/replaceState calls made by the page are invisible from the content script's
  // isolated world; the Navigation API reports them. Older browsers rely on the observer below.
  window.navigation?.addEventListener("currententrychange", onNavigationLikeActivity);

  const observer = new MutationObserver(() => {
    clearTimeout(domDebounceTimer);
    domDebounceTimer = setTimeout(onNavigationLikeActivity, 300);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

export function runAutomationAfterSettingsChange(settings) {
  clearAllSessionGuards();
  currentSettings = settings;
  const run = () => scheduleAutomation();
  run();
  setTimeout(run, 900);
}

export function startAutomationEngine(initialSettings, options = {}) {
  currentSettings = initialSettings;
  refreshSettingsFn =
    typeof options.refreshSettings === "function" ? options.refreshSettings : null;
  // A fresh document starts clean (this used to ride on the webNavigation message).
  clearAllSessionGuards();
  scheduleAutomation();
  startDomWatch();
}
