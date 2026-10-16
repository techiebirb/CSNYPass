/**
 * In-page banner shown when OneLogin rejected the saved password twice. It lives in a closed
 * shadow root so the page's CSS can't restyle it and the page can't read it.
 */
import browser from "webextension-polyfill";

const MESSAGE =
  "CSNYPass: OneLogin rejected your saved password twice, so autofill stopped to keep your account from being locked. Check the password in CSNYPass settings.";

const STYLE = `
  :host { all: initial; }
  .bar {
    position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
    z-index: 2147483647; box-sizing: border-box;
    width: min(560px, calc(100vw - 24px)); padding: 12px 14px;
    display: flex; gap: 12px; align-items: center;
    font: 14px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #7f1d1d; background: #fef2f2; border: 1px solid #fca5a5;
    border-radius: 10px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  }
  .text { flex: 1; }
  button {
    font: inherit; cursor: pointer; border-radius: 6px; padding: 6px 10px;
    border: 1px solid #b91c1c; background: #b91c1c; color: #fff;
  }
  button.close { border-color: transparent; background: transparent; color: #7f1d1d; padding: 4px 8px; }
`;

let host = null;

export function showPasswordRejectedNotice() {
  if (host?.isConnected) return;
  host = document.createElement("div");
  const root = host.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = STYLE;

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.setAttribute("role", "alert");

  const text = document.createElement("span");
  text.className = "text";
  text.textContent = MESSAGE;

  const open = document.createElement("button");
  open.type = "button";
  open.textContent = "Open settings";
  open.addEventListener("click", () => {
    browser.runtime.sendMessage({ type: "OPEN_SETTINGS" }).catch(() => {});
  });

  const close = document.createElement("button");
  close.type = "button";
  close.className = "close";
  close.setAttribute("aria-label", "Dismiss");
  close.textContent = "×";
  close.addEventListener("click", hidePasswordRejectedNotice);

  bar.append(text, open, close);
  root.append(style, bar);
  (document.body || document.documentElement).append(host);
}

export function hidePasswordRejectedNotice() {
  host?.remove();
  host = null;
}
