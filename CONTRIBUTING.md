# Contributing to CSNYPass

Extension source lives under `extension/`, shared login logic under `shared/`, and installable bundles under `dist/`. End-user setup is in [README.md](README.md). Coding agents: see [AGENTS.md](AGENTS.md).

## Repository layout

| Path | Purpose |
|------|---------|
| [`extension/background/`](extension/background/) | Service worker: encrypted storage, settings lock, biometric vault, messaging |
| [`extension/background/settings-lock.js`](extension/background/settings-lock.js) | Settings lock metadata and verification |
| [`extension/content/`](extension/content/) | Login-page automation (no in-page UI) |
| [`extension/popup/`](extension/popup/) | Settings page script ([`popup/popup.html`](popup/popup.html)) and sign-in unlock window ([`unlock.js`](extension/popup/unlock.js) with [`popup/unlock.html`](popup/unlock.html)) |
| [`shared/lib/dom.js`](shared/lib/dom.js) | DOM helpers (keep in sync with userscript `lib/dom.js`) |
| [`shared/config/sites.js`](shared/config/sites.js) | URLs and selectors |
| [`shared/settings-schema.js`](shared/settings-schema.js) | Defaults, normalize, validation |
| [`shared/lib/crypto.js`](shared/lib/crypto.js) | PBKDF2 and constant-time compare for the settings password |
| [`shared/lib/vault.js`](shared/lib/vault.js) | Pure crypto: data key, settings envelope, biometric key wrapping |
| [`shared/lib/webauthn.js`](shared/lib/webauthn.js) | Touch ID / Face ID via WebAuthn PRF (extension pages only) |
| [`shared/lib/throttle.js`](shared/lib/throttle.js) | Backoff for wrong settings-password attempts |
| [`tests/`](tests/) | Unit and integration tests (fake browser APIs) |
| [`vendor/browser-polyfill.min.js`](vendor/browser-polyfill.min.js) | Mozilla webextension-polyfill (bundled into dist) |
| [`scripts/build.mjs`](scripts/build.mjs) | esbuild build (run with Node or Deno) |
| [`scripts/package.mjs`](scripts/package.mjs) | Builds the Chrome Web Store upload zip in `release/` |
| [`PRIVACY.md`](PRIVACY.md), [`docs/store-listing.md`](docs/store-listing.md) | Privacy policy and the text/answers used on the store listing |
| [`dist/`](dist/) | Built `background.js`, `content.js`, `popup.js`, `unlock.js` (commit after changes) |

## Build

After editing source files, rebuild and commit `dist/`:

```bash
npm install
npm run build
```

No Node? Deno works too: `deno install && deno run -A scripts/build.mjs`.

This produces classic script bundles in `dist/` (no ES modules) that match [`manifest.json`](manifest.json) service worker and page script loading.
## Test

Tests require [Deno](https://deno.com); `npm test` is a wrapper around:

```bash
deno test -A --import-map=tests/import-map.json tests/
```

The tests run the real background modules against in-memory fakes of `browser.storage`, IndexedDB and alarms (see [`tests/fakes/`](tests/fakes/)). They cover Full-auto storage and legacy migration, the settings-password lock and backoff, and biometric enrollment, locking, unlock policies and mode switching. They can't exercise a real Touch ID / Face ID prompt, so try that by hand in Chrome or Edge after changing [`shared/lib/webauthn.js`](shared/lib/webauthn.js).

Do not hand-edit files in `dist/` except by rebuilding. Source maps (`dist/*.map`) are git-ignored and left out of the store zip.

## Release a new version

1. Change source under `extension/` or `shared/`.
2. Bump `"version"` in both [`manifest.json`](manifest.json) and [`package.json`](package.json).
3. Run `npm test` and the build command above.
4. If you touched [`shared/lib/webauthn.js`](shared/lib/webauthn.js), try Touch ID / Face ID by hand in Chrome or Edge.
5. Commit source and rebuilt `dist/` together.
6. Tag the release (`git tag v<version> && git push --tags`).

## Publish to the Chrome Web Store

1. `npm run package` builds `dist/` and writes `release/csnypass-v<version>.zip` (runtime files only: no sources, tests or source maps).
2. Upload that zip in the [Developer Dashboard](https://chrome.google.com/webstore/devconsole). Use the text in [`docs/store-listing.md`](docs/store-listing.md) for the description, single-purpose statement, permission justifications and privacy answers, and link [`PRIVACY.md`](PRIVACY.md) as the privacy policy.
3. Provide screenshots (1280x800) of the settings page; the listing doc says which ones.
4. Every store update needs a higher `version` than the one currently published.

### Automatic publishing

Pushing a `v<version>` tag (step 6 above) runs [`publish.yml`](.github/workflows/publish.yml). It runs the tests, checks the tag matches `manifest.json` and that `dist/` is current, then uploads the zip and submits it for review through the Chrome Web Store API. Google still reviews every update, so "published" means "submitted".

It signs in with GitHub's short-lived OIDC token through Google Workload Identity Federation, so no password, key or token is stored anywhere. Google only accepts tokens from version tags of this repo.

One-time setup:

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Chrome Web Store API**.
2. Create a service account (for example `cws-publisher`) with no project roles.
3. Under **IAM & Admin > Workload Identity Federation**, create a pool and an OIDC provider with issuer `https://token.actions.githubusercontent.com`, the attribute mapping `google.subject=assertion.sub` and `attribute.repository=assertion.repository`, and this attribute condition: `assertion.repository == '<owner>/<repo>' && assertion.ref.startsWith('refs/tags/v')`.
4. On the pool, use **Grant access** with service account impersonation: pick the service account and the principal `repository` = `<owner>/<repo>`.
5. In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole), open **Account** and add the service account's email (a publisher can have one). Note the **Publisher ID** there.
6. In the repo, go to **Settings > Environments**, create an environment named `chrome-web-store` (optionally add yourself as a required reviewer), and add these environment secrets:
   - `GCP_WIF_PROVIDER`: the provider's full name, `projects/<number>/locations/global/workloadIdentityPools/<pool>/providers/<provider>`
   - `GCP_SERVICE_ACCOUNT`: the service account's email
   - `CWS_PUBLISHER_ID` and `CWS_EXTENSION_ID`

None of these values are credentials, but keep them out of the repo, issues and logs anyway. The first version of a listing, and changes to permissions or hosts, are still done by hand in the dashboard. If you changed the listing's visibility in the dashboard, publish once by hand before the API will publish.

## Customize selectors

If Blackbaud or OneLogin changes their login page, edit [`shared/config/sites.js`](shared/config/sites.js), rebuild, and release.

## Conventions

- Keep [`shared/lib/dom.js`](shared/lib/dom.js) in sync with the userscript repo's `lib/dom.js`.
- Keep URLs and selectors in [`shared/config/sites.js`](shared/config/sites.js) only.
- Never log or commit real credentials.

## Architecture notes

- **Content script** requests full settings via `GET_SETTINGS` (content-script senders only) and caches them, listening for `SETTINGS_CHANGED` after saves.
- **Extension pages** (settings page and unlock window) use the extension-page-only messages below. Only the service worker performs encryption and lock verification.
- Extension-page-only messages: `GET_POPUP_STATE`, `UNLOCK_SETTINGS`, `UNLOCK_BIOMETRIC`, `SAVE_SETTINGS`, `UPDATE_LOCK`, `RESET_EXTENSION_DATA`.
- Content-script-only: `GET_SETTINGS`, `FLOW_DONE`. Broadcast by the service worker to content scripts: `SETTINGS_CHANGED`, `NAVIGATION_COMPLETED`.
- Handlers and sender checks are in `MESSAGE_HANDLERS` in [`extension/background/index.js`](extension/background/index.js).
