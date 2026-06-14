# Ghestit App Test Report

Date: 2026-06-10
Target: local Vite app in C:\Users\admin\Desktop\ghestit

## Commands run

- npm run lint
- npm run build
- npm run dev, then Playwright smoke tests against http://127.0.0.1:3000/
- npm run preview -- --port=4173 --host=127.0.0.1, then production-preview smoke check against http://127.0.0.1:4173/

## Summary

Passed:
- TypeScript check passed (`tsc --noEmit`).
- Production build passed (`vite build`).
- Local dev server returned HTTP 200.
- Production preview returned HTTP 200.
- Home page rendered the main Persian H1.
- Desktop pricing nav scroll worked.
- Desktop docs navigation rendered docs content.
- Desktop contact navigation rendered contact content.
- Mobile hamburger opened the menu and the demo CTA opened the modal/form.

Issues found:

### 1. 3D model load error in browser console

Severity: Medium
Category: Functional / Console

Observed on:
- http://127.0.0.1:3000/
- http://127.0.0.1:4173/

Console error:
`Error loading 3D model: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`

Evidence:
- `src/components/ThreeCanvas.tsx` loads `/logo111.glb`.
- The project contains `public/logo.glb` and `public/3DLogoSpin111.glb`, but not `public/logo111.glb`.
- Curl checks against production preview:
  - `/logo111.glb` -> HTTP 200 `text/html` (Vite SPA fallback, not a GLB file)
  - `/logo.glb` -> HTTP 200 `model/gltf-binary`
  - `/3DLogoSpin111.glb` -> HTTP 200 `model/gltf-binary`

Expected:
The GLTFLoader should fetch an actual `.glb` binary file and load the 3D model without console errors.

Actual:
The app requests `/logo111.glb`, receives `index.html`, and GLTFLoader tries to parse HTML as GLB/JSON.

Suggested fix:
Change line 42 of `src/components/ThreeCanvas.tsx` from:
`loader.load('/logo111.glb', ... )`

to one of the existing public assets, probably:
`loader.load('/logo.glb', ... )`

or:
`loader.load('/3DLogoSpin111.glb', ... )`

Then rerun `npm run lint`, `npm run build`, and the browser smoke test.

## Warnings noted

These appeared in headless Chromium but are likely lower priority than the missing model path:
- `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`
- Headless/WebGL software fallback warnings.
- WebGL `GPU stall due to ReadPixels` performance warnings.

## Artifacts

- Browser smoke test JSON: `C:\Users\admin\Desktop\ghestit\dogfood-output\smoke-results.json`
- Screenshots:
  - `C:\Users\admin\Desktop\ghestit\dogfood-output\home-desktop.png`
  - `C:\Users\admin\Desktop\ghestit\dogfood-output\docs-desktop.png`
  - `C:\Users\admin\Desktop\ghestit\dogfood-output\contact-desktop.png`
  - `C:\Users\admin\Desktop\ghestit\dogfood-output\mobile-demo.png`

## Note

I installed Playwright temporarily with `npm install --no-save playwright@1.53.2` and downloaded Chromium for the browser smoke tests. This did not add Playwright to `package.json` or `package-lock.json`.
