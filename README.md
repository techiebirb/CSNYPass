# CSNYPass

> Unofficial. CSNYPass is an independent project and is not affiliated with, endorsed by, or sponsored by Collegiate School, Blackbaud, or OneLogin. Those names belong to their owners and are used only to describe which sign-in pages the extension works on.

Desktop browser extension for **Chrome** and **Edge** that fills parts of the Collegiate login flow—**email** on the Blackbaud portal and, when configured, **CSNY OneLogin** username and password steps. You still enter your **Blackbaud password** yourself.

Settings live on the extension's **settings page** (click the toolbar icon), not on the login page. You choose how your saved login is protected:

- **Full auto:** signs in automatically with no prompt. Opening settings needs a password.
- **Fingerprint / Face ID:** your saved OneLogin password stays locked until you use Touch ID / Face ID (or Windows Hello). The email steps run without a prompt; you're asked only at the OneLogin password step, and to open settings. After you unlock, sign-in is automatic for as long as you chose.

**Repository:** [github.com/techiebirb/CSNYPass](https://github.com/techiebirb/CSNYPass) · [Privacy policy](PRIVACY.md)

For iPhone, iPad, and Android, use the [userscript version](https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript) instead.

## Supported sites

| Site | What the extension does |
|------|-------------------------|
| [Blackbaud student portal](https://collegiateschool.myschoolapp.com/app/student) | Fills **Email address** and optionally clicks **Next**. You enter Blackbaud password manually. |
| [Blackbaud sign-in hub](https://app.blackbaud.com/signin/) (redirect during SSO) | Optionally clicks **Collegiate School** when **Automatically click Next / Continue** is on. |
| [CSNY OneLogin](https://csny.onelogin.com/login) | Fills username (your email), optional **Continue**, then OneLogin password from settings and **Continue** again. |

## Install

**Chrome Web Store:** coming soon. Until then, use the developer-mode steps below.

### Unpacked / developer mode

1. Build the extension (see [CONTRIBUTING.md](CONTRIBUTING.md)). The repo includes a pre-built `dist/` so you can skip this if files are already present.
2. **Chrome or Edge:** Open `chrome://extensions` or `edge://extensions` → enable **Developer mode** → **Load unpacked** → select the repository folder (the one containing `manifest.json`).
3. Click the extension icon → enter your school **email**, optional **OneLogin password**, and pick a protection mode:
   - **Full auto:** set a **settings password** (or choose **Use OneLogin password to unlock settings**).
   - **Fingerprint / Face ID:** pick how long one unlock lasts, then confirm with your fingerprint or face when prompted.

   Then **Save**. You should see **Settings saved.**
4. Open a supported login URL in the same browser and confirm automation runs (or turn it off on the settings page after unlocking it).

**Updating from an older version:** The first time you open the settings page after updating, you may be asked to **protect existing settings** with a settings password. Your saved email and password stay as they are; you only set the lock.

## Daily use

- **Blackbaud:** Open the portal; the extension fills email and may click **Next**. Enter Blackbaud password yourself.
- **OneLogin:** Often after Blackbaud; extension fills username/password steps if saved. If the wrong account is prefilled, use **Not you?** yourself—the extension does not click that.

### Toolbar badge, pausing, and retry limit

- **Badge:** the toolbar icon shows **LOCK** when your saved OneLogin password is still locked (Fingerprint / Face ID mode) and **OFF** when automation is turned off or paused. Click the icon while on a OneLogin page that shows **LOCK** to reopen the unlock window right away; anywhere else it opens settings.
- **Pause:** right-click a login page → **Pause auto sign-in for 1 hour** (and **Resume auto sign-in**). Pausing needs no unlock and ends on its own, or when the browser closes.
- **Retry limit:** if OneLogin rejects the saved password, the extension submits at most twice in 5 minutes per tab, then stops so your account isn't locked out. Fix the saved password in settings and reload.
- **Different account prefilled:** if the OneLogin username box already holds another email, the extension leaves it alone.

## Settings

The settings page opens from the **CSNYPass** toolbar icon. It opens in a browser tab because the system Touch ID / Face ID prompt can close a small popup.

After the first save, opening settings shows a **locked** screen. Unlock it with your settings password (Full auto) or Touch ID / Face ID (Fingerprint / Face ID). When unlocked, an **Automation on/off** chip at the top shows whether the helper is enabled. The unlocked screen locks itself after 30 minutes, and you unlock again to keep editing.

| Setting | Meaning |
|--------|---------|
| Sign-in & settings protection | **Full auto** or **Fingerprint / Face ID** (see below). Can be changed later under *Sign-in & settings protection*. |
| Settings password | Full auto only. Required to open the settings screen. |
| Use OneLogin password to unlock settings | Full auto only. Your saved OneLogin password also unlocks settings, so it can't be saved blank while this is on. |
| How long one unlock lasts | Fingerprint / Face ID only. **Every sign-in** (asks each time; the unlock is dropped after the login is submitted, or after 3 minutes), **Until I close the browser**, or **A set number of minutes**. |
| Enable automation | Turn the helper on or off |
| Email | Login email (Blackbaud and OneLogin) |
| Password (OneLogin) | Optional if you only use the Blackbaud email step |
| Automatically click Next / Continue | Click after filling fields |
| Advanced → wait before clicking | Slider and milliseconds field (default 300 ms; 0 means no wait). Increase if buttons stay disabled briefly (try 500–1000 ms). Site URLs are under **Learn more** / **Supported sites**. |

### Fingerprint / Face ID mode

Your email is not a secret, so the Blackbaud email step, the "Collegiate School" button and the OneLogin username step run with no prompt. When the OneLogin **password** box appears and the password is still locked, a small **Unlock to sign in** window opens. Use Touch ID / Face ID and the sign-in continues on its own. If you dismiss it, it won't pop up again for a minute; reload the login page to bring it back. Opening the settings screen always needs a fresh Touch ID / Face ID.

The extension only acts on real sign-in screens (the Blackbaud email form, the Blackbaud "Collegiate School" button, and the OneLogin username/password form). It never prompts while you browse the signed-in site, such as a class bulletin board. After updating from an older version, the "Collegiate School" button is still clicked automatically; the first sign-in asks once at the OneLogin password step so your email can be remembered for prompt-free email steps (until then, type your email on the Blackbaud page yourself).

It uses WebAuthn with the PRF extension, which needs a recent Chrome or Edge (116+) and a device with a platform authenticator. If your browser or device can't do it, the option is hidden or setup tells you so, and nothing is changed.

## Privacy and encryption

- Settings are saved only in **extension storage on your device**. They are not sent to GitHub or the author.
- Email and password are encrypted with **AES-256-GCM** (with the format version authenticated) before being written to `storage.local`.

**Full auto**
- A random data key is generated on first use and kept as a **non-extractable** key in the extension's IndexedDB, separate from the ciphertext. Its bytes can't be read back out through any API.
- The settings **password** (PBKDF2-SHA-256, 600,000 iterations, or your OneLogin password) only controls access to the settings screen, with an increasing delay after repeated wrong attempts.
- **What this protects:** casually reading or copying the storage JSON, and casual use of the settings screen on an unlocked computer.
- **What this does not protect:** a full copy of your browser profile, malware, or anyone with full access to your logged-in user account. The key has to be reachable by the extension for sign-in to be fully automatic, so someone who can run code as you can use it.

**Fingerprint / Face ID**
- The data key is never stored in the clear. Only a copy **wrapped by a key derived from your biometric** (WebAuthn PRF) is saved. Without a successful Touch ID / Face ID, the stored data can't be decrypted.
- After you unlock, the data key is held in memory-only extension storage (cleared when the browser closes, or sooner per your setting).
- Your email and settings toggles (never the password) are also kept in a separate copy encrypted with a non-extractable key, so the email steps work without Touch ID / Face ID. The password is released only to the OneLogin sign-in page.
- **What this does not protect:** malware running as you *while* the extension is unlocked.

**Forgot your password, or lost access to your biometric?** There is no recovery. The data can't be decrypted without it. Use **Clear all saved data and start over** in the settings page Help section. You do not need to remove the extension from the browser.

Never commit real credentials to git.

## Troubleshooting

- **Nothing happens:** Confirm the extension is enabled. Unlock the settings page and check your email is saved and **Enable automation** is on. Reload the login tab after saving.
- **Forgot settings password / can't use Touch ID anymore:** see **Privacy and encryption** above. Clear all saved data and set up again.
- **Saved settings could not be read:** Use **Clear all saved data and start over** on the settings page, then set up again. Login automation will not run until settings are saved again.
- **Nothing happens at the OneLogin password step in Fingerprint / Face ID mode:** you're locked and the unlock window was dismissed or hidden. Reload the login page (after a minute) and use Touch ID / Face ID in the window that opens.
- **Next / Continue stays gray:** On the settings page, open **Advanced** and increase the wait before clicking (try 500–1000 ms), save, reload.

<details>
<summary><strong>“Access other apps and services on this device” (Chrome)</strong></summary>

This is **not** an extra extension permission. Chrome is asking whether **`collegiateschool.myschoolapp.com`** (or another login host during SSO) may use **Apps on device** (Local Network Access)—often to reach a desktop SSO or MFA helper on your machine. You may see it **once per site** even with the extension turned off when you click **Next** manually. **Allow** once for a smoother login, or use the lock icon next to the address bar → **Apps on device** → **Allow**. You can also allow origins at `chrome://settings/content/loopbackNetwork` (Edge: **Settings → Privacy → Site permissions → Apps on device**), for example `https://collegiateschool.myschoolapp.com`, and during SSO hops `https://app.blackbaud.com` and `https://csny.onelogin.com`. If you dismiss the prompt, the site may ask again; turning off **Automatically click Next / Continue** reduces repeated **Next** / SSO clicks while the dialog is open. The extension throttles repeat auto-clicks so it does not hammer the same step every few hundred milliseconds.

</details>

- **Console:** On the login page, look for messages starting with `[CSNYPass]`.

Still stuck? Open an issue on [GitHub](https://github.com/techiebirb/CSNYPass/issues).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for build, test and release steps, and [AGENTS.md](AGENTS.md) for coding-agent instructions.

## License

[MIT](LICENSE)
