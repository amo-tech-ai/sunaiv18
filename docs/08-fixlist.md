# 08 Fix List: Blank Screen Debugging Log

**Date:** January 28, 2025
**Issue:** "White Screen of Death" / App fails to render in Preview.
**Root Cause:** Conflict between Vite Local Bundling and `importmap` (CDN Loading).

---

## The Problem
The application failed to start because the browser was being instructed to load dependencies (React, ReactDOM) from a CDN (`esm.sh`) via an `importmap` in `index.html`. Simultaneously, Vite was compiling the local code to use its own bundled dependencies. This "Split Brain" architecture caused runtime errors where modules could not be resolved or multiple versions of React collided.

## Attempts & Resolutions

### Attempt 1: Migration to `src/` (Partial Success)
*   **Action:** Moved source files to `src/` directory.
*   **Outcome:** Improved organization, but did not solve the blank screen because the `index.html` still contained the poisoning `importmap`.

### Attempt 2: Router Configuration (Partial Success)
*   **Action:** Created `src/router.tsx` and configured `createHashRouter`.
*   **Outcome:** Essential for navigation, but `src/App.tsx` was still potentially using legacy router components (`<HashRouter>`), conflicting with the new architecture.

### Attempt 3: Config Generation
*   **Action:** Created `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`.
*   **Outcome:** Necessary for the build pipeline, but ineffective as long as `index.html` was bypassing the build pipeline via CDN.

### Attempt 4: The Definitive Fix (Current)
*   **Action:** Manually purged `<script type="importmap">` from `index.html`.
*   **Action:** Removed `<script src="cdn.tailwindcss.com">` from `index.html`.
*   **Action:** Rewrote `src/App.tsx` to strictly use `RouterProvider`.
*   **Action:** Verified `src/components/WizardLayout.tsx` correctly implements `<Outlet />`.

## Current Status
The application architecture is now **Vite Sovereign**.

*   **Entry:** `index.html` -> `src/main.tsx`
*   **Deps:** Managed via `package.json` -> `node_modules`
*   **Routing:** `router.tsx` -> `RouterProvider`
*   **Styles:** `index.css` -> PostCSS -> Tailwind

## Verification Checklist for User
If the screen remains blank, please verify:
1.  Run `npm install` to ensure all `package.json` dependencies are present locally.
2.  Run `npm run dev` and check the console for any remaining module resolution errors.
3.  Ensure your browser cache is cleared, as `importmap` caching can be aggressive.