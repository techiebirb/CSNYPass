import browser from "webextension-polyfill";
import { normalizeSettings } from "../../shared/settings-schema.js";
import {
  startAutomationEngine,
  runAutomationAfterSettingsChange,
  notifyNavigationCompleted,
  setAutomationSettings,
  resetUnlockRequest,
} from "./automation.js";

let settingsCache = normalizeSettings({});
/** True when the background has no public profile yet; stops pointless polling. */
let awaitingProfile = false;
let unlockRequested = false;

/** Only called on a real sign-in page (see runAutomation), never on page load. */
async function fetchSettingsFromBackground() {
  try {
    const response = await browser.runtime.sendMessage({ type: "GET_SETTINGS" });
    if (response?.locked) {
      awaitingProfile = true;
      settingsCache = normalizeSettings({ ...settingsCache, profileUnavailable: true });
      // First sign-in after an update: one unlock at the OneLogin password builds the
      // profile. Blackbaud pages never ask.
      if (
        response.needsProfile &&
        !unlockRequested &&
        window.location.hostname === "csny.onelogin.com"
      ) {
        unlockRequested = true;
        browser.runtime.sendMessage({ type: "REQUEST_SIGN_IN_UNLOCK" }).catch(() => {});
      }
      return settingsCache;
    }
    if (response?.ok && response.settings) {
      awaitingProfile = false;
      settingsCache = normalizeSettings({
        ...response.settings,
        passwordLocked: response.passwordLocked === true,
      });
      return settingsCache;
    }
  } catch (err) {
    console.debug("[CSNYPass]", err);
  }
  return settingsCache;
}

async function fetchSettingsWithRetry(maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const settings = await fetchSettingsFromBackground();
    if (settings?.email?.trim() || awaitingProfile) {
      return settings;
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
  return settingsCache;
}

/** Relock drops only the password; the email steps keep working. */
function dropPassword() {
  settingsCache = normalizeSettings({
    ...settingsCache,
    password: "",
    passwordLocked: settingsCache.hasPassword === true,
  });
  setAutomationSettings(settingsCache);
}

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "SETTINGS_LOCKED") {
    dropPassword();
    resetUnlockRequest();
    // Re-read what is still public (nothing, after a reset of all saved data).
    fetchSettingsFromBackground().then(setAutomationSettings);
  }
  if (message?.type === "SETTINGS_CHANGED") {
    awaitingProfile = false;
    fetchSettingsFromBackground().then((settings) => {
      runAutomationAfterSettingsChange(settings);
    });
  }
  if (message?.type === "NAVIGATION_COMPLETED") {
    notifyNavigationCompleted();
  }
});

startAutomationEngine(null, {
  refreshSettings: () =>
    awaitingProfile ? Promise.resolve(settingsCache) : fetchSettingsWithRetry(),
});
