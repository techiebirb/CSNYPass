# Security policy

CSNYPass stores a sign-in email and optionally a password, encrypted on the user's device. Security reports are welcome.

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Use GitHub's private reporting instead: **Security → Report a vulnerability** on <https://github.com/techiebirb/CSNYPass>.

Include the browser and extension version, the steps to reproduce, and what an attacker could gain. You'll get a reply as soon as possible, and fixes ship as a new extension version.

## Scope

In scope: the encryption and settings lock, the biometric (WebAuthn) vault, message handling between extension contexts, and anything that could send a saved credential to a page other than `csny.onelogin.com`.

Out of scope: problems in Collegiate School, Blackbaud, or OneLogin themselves, and attacks that need full control of the user's browser profile or operating system.

## Supported versions

Only the latest release receives fixes.
