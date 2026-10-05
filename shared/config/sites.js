/**
 * Host-specific login step configuration.
 * Ported from the CSNY Auto Sign-in userscript repo, config/sites.js
 */
import { CollegiateDom } from "../lib/dom.js";

/** Where the welcome page sends people to try their first sign-in. */
export const BLACKBAUD_SIGN_IN_URL = "https://collegiateschool.myschoolapp.com/app";

export function findLabeledButton(labelRe) {
  for (const el of document.querySelectorAll(
    'button, input[type="submit"], input[type="button"]'
  )) {
    if (!CollegiateDom.isVisible(el) || el.disabled) continue;
    const text = (
      el.textContent ||
      el.value ||
      el.getAttribute("aria-label") ||
      ""
    ).trim();
    if (labelRe.test(text)) return el;
  }
  return null;
}

function createBlackbaudSiteConfig(id, hostPattern) {
  return {
    id,
    runFlow: "blackbaudEmail",
    hostPattern,
    pathPattern: /\/app/i,
    emailSelectors: ["#Username"],
    nextSelectors: ["#nextBtn", 'input[type="submit"][value="Next"]'],
    /**
     * The whole /app area is the signed-in site, so the URL can't tell us. Only the
     * Blackbaud sign-in form (email box + Next, no password box) counts.
     */
    isSignInPage() {
      const username = document.getElementById("Username");
      const next = document.getElementById("nextBtn");
      const password = document.getElementById("Password");
      return (
        CollegiateDom.isVisible(username) &&
        CollegiateDom.isVisible(next) &&
        !CollegiateDom.isVisible(password)
      );
    },
    isEmailStep() {
      const password = document.getElementById("Password");
      if (!password) return true;
      return password.offsetParent === null;
    },
  };
}

const COLLEGIATE_SITE_CONFIGS = [
  createBlackbaudSiteConfig(
    "collegiate-school-nyc",
    /^collegiateschool\.myschoolapp\.com$/i
  ),
  {
    id: "blackbaud-app-signin",
    runFlow: "blackbaudSsoPick",
    hostPattern: /^app\.blackbaud\.com$/i,
    pathPattern: /\/signin/i,
    ssoButtonLabel: /Collegiate School/i,
    isSignInPage() {
      return findLabeledButton(this.ssoButtonLabel) !== null;
    },
  },
  {
    id: "csny-onelogin",
    runFlow: "oneLogin",
    hostPattern: /^csny\.onelogin\.com$/i,
    pathPattern: /\/login2?(?:\/|\?|#|$)/i,
    usernameSelectors: ["#username", 'input[name="username"]'],
    passwordSelectors: ["#password", 'input[name="password"]'],
    submitSelectors: ['button[type="submit"]'],
    isSignInPage() {
      return this.getStep() !== null;
    },
    getStep() {
      const password = CollegiateDom.queryFirst(this.passwordSelectors);
      if (password && CollegiateDom.isVisible(password)) return "password";
      const username = CollegiateDom.queryFirst(this.usernameSelectors);
      if (username && CollegiateDom.isVisible(username)) return "username";
      return null;
    },
  },
];

export function getSiteConfigForLocation(location) {
  const host = location.hostname;
  const href = location.href;
  for (const config of COLLEGIATE_SITE_CONFIGS) {
    if (!config.hostPattern.test(host)) continue;
    if (config.pathPattern && !config.pathPattern.test(href)) continue;
    return config;
  }
  return null;
}
