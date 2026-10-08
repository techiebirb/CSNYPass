# Chrome Web Store listing

Copy for the Developer Dashboard. Keep it in sync with `PRIVACY.md` and `manifest.json`.

**Name:** CSNYPass
**Category:** Productivity
**Language:** English
**Privacy policy URL:** https://github.com/techiebirb/CSNYPass/blob/main/PRIVACY.md
**Support / homepage URL:** https://github.com/techiebirb/CSNYPass

## Summary (max 132 characters)

Fills your Collegiate Blackbaud and CSNY OneLogin sign-in steps. Credentials are encrypted and stay on your device.

## Description

CSNYPass saves you the repeated typing on the Collegiate School sign-in pages. It fills your email on the Blackbaud portal, picks "Collegiate School" on the Blackbaud sign-in hub, and fills your username and (optionally) password on CSNY OneLogin, clicking Next / Continue for you if you want it to.

How you protect your saved login is up to you:
• Full auto: signs in with no prompt. Opening settings needs a password.
• Fingerprint / Face ID: your saved OneLogin password stays locked until you use Touch ID, Face ID or Windows Hello. Choose how long one unlock lasts.

Privacy first:
• Everything is stored only on your device, encrypted with AES-256-GCM.
• No servers, no analytics, no tracking. The extension makes no network requests of its own.
• It only runs on the three sign-in sites above, and only on their actual sign-in screens.
• Your OneLogin password is only ever released to the OneLogin page.

Handy extras: a toolbar badge shows when your password is locked, and a right-click menu pauses auto sign-in for an hour. If a saved password is wrong, CSNYPass stops after two tries so your account isn't locked out.

You still type your Blackbaud password yourself.

CSNYPass is an independent project and is not affiliated with, endorsed by, or sponsored by Collegiate School, Blackbaud, or OneLogin.

Open source (MIT): https://github.com/techiebirb/CSNYPass

## Single purpose

Fill in and submit the sign-in steps of the Collegiate School Blackbaud portal and CSNY OneLogin pages with the user's saved credentials.

## Permission justifications

| Permission | Why |
|---|---|
| `storage` | Saves the user's encrypted settings, lock settings, and short-lived unlock state on their device. |
| `webNavigation` | Detects when a sign-in page finishes loading so the next sign-in step can be filled. |
| `contextMenus` | Adds "CSNYPass settings" and "Pause auto sign-in for 1 hour" to the right-click menu on the sign-in sites. |
| `alarms` | Re-locks the saved password when the unlock time the user chose runs out, and ends a pause. |
| Host access: `collegiateschool.myschoolapp.com`, `app.blackbaud.com`, `csny.onelogin.com` | The three sign-in sites the extension fills in. No other sites are accessed. |
| Content script on those hosts | Finds the sign-in fields and buttons and fills / clicks them. |

## Privacy practices tab

- **Data collected:** Authentication information (email address and password the user enters), kept locally on the device.
- **Is data sold, used for unrelated purposes, or used for creditworthiness?** No to all.
- **Is data transmitted off the device?** No.
- **Remote code:** No. All code is in the package.

## Assets

Ready to upload from `docs/store/` (none of these ship in the extension package):

- **Screenshots, 1280x800** (upload in this order):
  1. `screenshot-1-welcome.png`: the welcome screen.
  2. `screenshot-2-protection.png`: the Protection step with Full auto and Touch ID / Face ID.
  3. `screenshot-3-full-auto.png`: locked and unlocked settings (password).
  4. `screenshot-4-touch-id.png`: locked settings and the Touch ID prompt.
  5. `screenshot-5-privacy.png`: encryption and privacy points beside the unlocked editor.
- **Small promo tile, 440x280:** `promo-small.png`.
- **Marquee promo tile, 1400x560 (optional):** `promo-marquee.png`.
- **Store icon, 128x128:** `icons/icon-128.png` (already in the package).

The email and password are blurred in every image, and none of them show the Collegiate School logo or other school branding. Keep it that way if you retake any.

The videos in `docs/images/` (`signin-auto.mp4`, `signin-touchid.mp4`) are recorded on the real school sign-in pages, so they are for the GitHub README only. Don't use them in the store listing.
