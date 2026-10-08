# AGENTS.md

Instructions for coding agents working in this repo (CSNYPass). Human contributor docs: [CONTRIBUTING.md](CONTRIBUTING.md). End-user docs: [README.md](README.md).

## Project

CSNYPass is a Manifest V3 browser extension (Chrome, Edge, Firefox 109+) that autofills the Collegiate Blackbaud and CSNY OneLogin sign-in steps. Credentials are stored encrypted in extension storage. Sister project: [Userscript Ver](https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript).

## Commands

```bash
npm install
npm run build     # esbuild: extension/ + shared/ -> dist/
npm run watch
npm test          # runs `deno test`; Deno is required for tests
npm run package   # build + release/csnypass-v<version>.zip for the Chrome Web Store
```

No Node: `deno install && deno run -A scripts/build.mjs`.

## Layout

- `extension/background/`: service worker (encryption, settings lock, biometric vault, messaging)
- `extension/content/`: login-page automation
- `extension/popup/`: settings page and sign-in unlock window scripts (HTML in `popup/`)
- `shared/`: pure libs (`lib/`), site URLs/selectors (`config/sites.js`), settings schema
- `tests/`: tests with in-memory fakes of browser APIs (`tests/fakes/`)
- `dist/`: build output, loaded by `manifest.json`

## Rules

- Edit source in `extension/` and `shared/`. Never hand-edit `dist/`; rebuild and commit it together with the source.
- Bump the version in both `manifest.json` and `package.json`.
- Only the service worker encrypts, decrypts, or verifies locks. Other contexts go through messages (`MESSAGE_HANDLERS` in `extension/background/index.js`) and must respect its sender checks (`extensionPageOnly`, `isContentScriptSender`).
- Login URLs and selectors live only in `shared/config/sites.js`.
- Keep `shared/lib/dom.js` in sync with the userscript repo's `lib/dom.js`.
- Never log, hardcode, or commit credentials. Don't weaken crypto parameters (PBKDF2-SHA-256 at 600,000 iterations, AES-256-GCM).
- Don't modify `vendor/`.

## Verification

Run `npm test` and `npm run build` after changes. Tests can't exercise a real Touch ID / Face ID prompt, so changes to `shared/lib/webauthn.js` need a manual check in Chrome or Edge; say so when you can't do it.

## Docs

Changes to what data is stored or which permissions/hosts are requested must also update `PRIVACY.md` and `docs/store-listing.md`.

User-facing behavior changes go in README.md. Developer workflow changes go in CONTRIBUTING.md.
