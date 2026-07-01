# Android APK (TWA) → Cafebazaar release

The web app is a PWA. The Android app is a **Trusted Web Activity (TWA)** — a thin
native shell (`com.ghestit.app`) that opens `https://ghestit.com` full-screen with no
browser UI. Built with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap).

## What already exists in this repo

- PWA manifest + service worker via `vite-plugin-pwa` (see `vite.config.ts`). Built to
  `dist/manifest.webmanifest` and `dist/sw.js` on `npm run build`.
- Icons in `public/icons/` (regenerate with `npm run icons`).
- `twa-manifest.json` — Bubblewrap config (package id, colors, version).
- `public/.well-known/assetlinks.json` — Digital Asset Links. **Fingerprint is a
  placeholder**; fill it after the signing key exists (step 4).

## Prerequisites

- Node + JDK 17+ (repo host has JDK 21). Bubblewrap downloads the Android SDK on first run.
- `npm i -g @bubblewrap/cli`
- **The PWA must be live at `https://ghestit.com`** (real HTTPS) with
  `/manifest.webmanifest`, `/sw.js`, and `/.well-known/assetlinks.json` reachable.
  Deploy `dist/` there first — TWA validates the live URL, not local files.

## Steps

1. **Deploy the PWA.** `npm run build`, publish `dist/` to `https://ghestit.com`.
   Verify `https://ghestit.com/manifest.webmanifest` loads and Lighthouse → PWA passes.

2. **Init the TWA project** (in an empty dir, not the repo root):
   ```bash
   bubblewrap init --manifest https://ghestit.com/manifest.webmanifest
   ```
   Accept `com.ghestit.app` as package id. Bubblewrap prompts to create a signing
   keystore (`android.keystore`, alias `ghestit`) — **back this up; the same key must
   sign every future update or Cafebazaar rejects it.**

3. **Build the APK:**
   ```bash
   bubblewrap build
   ```
   Produces `app-release-signed.apk` (and `.aab`). Cafebazaar accepts the **APK**.

4. **Wire Digital Asset Links** (removes the URL bar / "running in Chrome" toast):
   ```bash
   bubblewrap fingerprint list        # or: keytool -list -v -keystore android.keystore
   ```
   Copy the **SHA-256** fingerprint into `public/.well-known/assetlinks.json`
   (replace `REPLACE_WITH_SIGNING_KEY_SHA256_FINGERPRINT`), rebuild, and **redeploy the
   site**. Without this the app still works but shows a Chrome address bar.

5. **Device caveat:** a TWA needs a Chromium browser (Chrome 72+) installed on the
   device — it renders inside Chrome Custom Tabs. Most Iranian Android devices have
   Chrome; on those without it, the app falls back to a Custom Tab (`fallbackType` in
   `twa-manifest.json`). For zero-dependency rendering, switch to Capacitor instead.

## Publish on Cafebazaar

1. Register at <https://developers.cafebazaar.ir/en> (developer account, one-time fee).
2. **Create app → upload `app-release-signed.apk`.**
3. Fill store listing (Persian): title `قسطیت`, description, category **مالی/کسب‌وکار**,
   screenshots (min 3), 512×512 icon (`public/icons/icon-512.png`), feature graphic,
   privacy policy URL, support contact.
4. Set content rating + pricing (free). Submit for review.
5. **Updates:** bump `appVersionCode` (+ `appVersionName`) in `twa-manifest.json`,
   `bubblewrap build` with the **same keystore**, upload the new APK.

## Bump version helper

`appVersionCode` must strictly increase per Cafebazaar upload; `appVersionName` is the
human label. Both live in `twa-manifest.json`.
