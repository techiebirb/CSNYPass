# Publishing a new version

Runbook for a coding agent. Follow it when the user says they want to publish, release or submit to the Chrome Web Store. Publishing is manual: you prepare and commit everything, the user uploads the zip in the Developer Dashboard and presses Submit.

Baseline: `**Last submitted version:**` in [`store-listing.md`](store-listing.md). Its tag is `v<that version>`.

## 1. Review the changes

Run `git status` and `git diff v<last> --stat`, then read the diffs. Report to the user, grouped as: code and UI, manifest/permissions, docs, media, CI. Flag:

- Permission or host changes in `manifest.json` (Google may re-review them, and users may have to re-accept). These also need `PRIVACY.md` and `store-listing.md` updated.
- Changes to `shared/lib/webauthn.js`: Touch ID / Face ID needs a manual check in Chrome or Edge. Say so, since you can't do it.
- New files with personal data: search for home paths, emails, extension ids and credentials (`grep -rn -i -E "/Users/|@gmail|chrome-extension://"`). Raw recordings must stay out of the repo.

## 2. Pre-flight

- `version` in `manifest.json` and `package.json` match, and are higher than the last submitted version.
- `npm test` passes.
- `npm run package` succeeds, then `git status` shows no `dist/` drift.
- `store-listing.md` has a "Changes in <version>" section.
- `PRIVACY.md` and `store-listing.md` match any change to stored data, permissions or hosts.

## 3. Propose a commit message

Match the history: `Release X.Y.Z: <short list of changes>`. The author is the user alone: no Claude co-author line and no extra trailers.

## 4. Build the dashboard checklist

Diff `store-listing.md` and `docs/store/` against the baseline tag. For each Developer Dashboard field that changed, give the tab, the field, the copy-paste text, and the absolute path of any image. List unchanged fields as "leave as is". Tabs: Package, Store listing, Privacy, Distribution. Cover:

- Description, screenshots (1280x800, in the order in `store-listing.md`), small promo tile 440x280, marquee 1400x560.
- Permission justifications, single purpose, data usage checkboxes.
- The submit dialog's "Publish automatically after review" box: tell the user they can untick it to publish by hand after approval.

Images must not show the real email, password or school branding ([`MEDIA.md`](MEDIA.md)).

## 5. Wait for full approval

Show the user the change list, the commit message and the checklist. Don't commit until they approve.

## 6. After approval

1. Set `**Last submitted version:**` in `store-listing.md` to the new version.
2. `npm test` and `npm run package`. Confirm `release/csnypass-v<version>.zip` exists.
3. Stage and check `git status`, then commit. Push `main`.
4. `git tag v<version> && git push origin v<version>`. The tag publishes nothing.
5. `gh release create v<version> release/csnypass-v<version>.zip --title v<version> --generate-notes --verify-tag`.
6. Check CI on `main` with `gh run list`.

## 7. Hand off

Give the user the absolute path of the zip. Tell them to open the [Developer Dashboard](https://chrome.google.com/webstore/devconsole), upload it under **Package > Upload new package**, apply the checklist, and **Submit for review**. Never upload or submit through the Web Store API yourself.

## Never

- Hand-edit `dist/`.
- Put credentials or personal paths in the repo.
- Commit before the user's approval.
