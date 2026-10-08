# CSNYPass privacy policy

_Last updated: 2026-10-05_

CSNYPass is a browser extension that fills in the Collegiate Blackbaud and CSNY OneLogin sign-in pages. It is an independent project, not affiliated with Collegiate School, Blackbaud, or OneLogin.

## What it stores

- The email address you enter, and optionally your OneLogin password.
- Your settings (automation on/off, auto-click, click delay) and the way you chose to protect them (settings password, or Touch ID / Face ID).

All of this is kept **only on your device**, in the browser's extension storage. The email and password are encrypted with AES-256-GCM before they are written. How the keys are held is described under "Privacy and encryption" in the [README](README.md).

## What it does not do

- It does not send any data to the developer or to any third party. The extension makes no network requests of its own and has no servers, analytics, ads, or tracking.
- It does not sell or share data, and does not use it for anything other than filling in the sign-in fields you configured.
- It does not read or change any page other than the sign-in screens of `collegiateschool.myschoolapp.com`, `app.blackbaud.com` and `csny.onelogin.com`. On those pages it fills the fields and clicks the sign-in buttons you enabled, and the saved password is released only to `csny.onelogin.com`.

## Biometrics

If you choose Touch ID / Face ID, the check is done by your operating system through WebAuthn. CSNYPass never receives or stores your fingerprint or face data; it only receives a cryptographic value that unlocks your saved data.

## Your control

You can edit your saved details at any time on the settings page, or erase everything with **Clear all saved data and start over**. Removing the extension also deletes its stored data. There is no way for the developer to recover a forgotten settings password or lost biometric.

## Changes and contact

If this policy changes, the new version will be published in this repository with an updated date. Questions or concerns: open an issue at <https://github.com/techiebirb/CSNYPass/issues>.
