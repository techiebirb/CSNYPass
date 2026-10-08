import browser from "webextension-polyfill";
import { BiometricError, getPrfOutput } from "../../shared/lib/webauthn.js";

const statusEl = document.querySelector("#unlock-window-status");
const button = document.querySelector("#btn-unlock-window");

function setStatus(message, ok) {
  statusEl.textContent = message || "";
  statusEl.className = "status" + (message ? (ok ? " ok" : " err") : "");
}

async function unlock({ automatic = false } = {}) {
  if (button.disabled) return;
  setStatus("", false);
  button.disabled = true;
  try {
    const state = await browser.runtime.sendMessage({ type: "GET_POPUP_STATE" });
    if (!state?.biometric) {
      setStatus("Touch ID / Face ID isn't set up.", false);
      return;
    }
    const prfOutput = await getPrfOutput(state.biometric);
    const result = await browser.runtime.sendMessage({
      type: "UNLOCK_BIOMETRIC",
      prfOutput,
      forSignIn: true,
    });
    if (!result?.ok) {
      setStatus(result?.error || "Could not unlock.", false);
      return;
    }
    setStatus("Unlocked.", true);
    window.close();
  } catch (err) {
    // Opened mid-redirect, the window may not have focus yet and the browser refuses the
    // passkey prompt. Retry once when it gains focus instead of waiting for a click.
    if (automatic && !document.hasFocus()) {
      window.addEventListener("focus", () => unlock(), { once: true });
      setStatus("", false);
      return;
    }
    setStatus(
      err instanceof BiometricError ? err.message : "Touch ID / Face ID failed.",
      false
    );
  } finally {
    button.disabled = false;
  }
}

button.addEventListener("click", () => unlock());
// Try right away; if the browser wants a click first, the button is still there.
unlock({ automatic: true });
