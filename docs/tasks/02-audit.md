# 02 System Audit: Blank Preview Screen Analysis

**Status:** Critical Issues Found
**Date:** January 28, 2025
**Scope:** Architecture & Entry Point Configuration

## Executive Summary
The preview screen is likely blank due to a fundamental conflict between the Vite build system and the `index.html` configuration. The presence of an `importmap` forces the browser to resolve React dependencies via CDN (`esm.sh`), while Vite attempts to bundle/serve them locally from `node_modules`. This creates a split-brain runtime where modules fail to link, resulting in a JavaScript crash before the app mounts.

---

## 🚨 Critical Findings

### 1. Forbidden `importmap` Detected
*   **File:** `index.html`
*   **Violation:** "Vite + React System Rules" Section 1 (Vite Sovereignty) explicitly states: **"MUST NOT use importmap in index.html"**.
*   **Impact:**
    *   Vite transforms `import React from 'react'` in `index.tsx` to a path like `/node_modules/.vite/deps/react.js`.
    *   The `importmap` in HTML tells the browser: "When you see 'react', go to `https://esm.sh/react...`".
    *   **Result:** Application crash due to module resolution errors or multiple instances of React loading (Singleton violation).
*   **Contradiction:** `CHANGELOG.md` [0.2.0] claims this was removed, but it persists in the codebase.

### 2. Tailwind CSS via CDN
*   **File:** `index.html`
*   **Violation:** "Styling Rules" Section 1: **"No CDNs: Tailwind MUST be installed via npm"**.
*   **Impact:** While less likely to cause a "white screen of death" than the JS issue, this creates race conditions in styling application and relies on external connectivity, which degrades the preview experience.

---

## 🛠 Recommended Fixes

### Step 1: Sanitize `index.html` (Primary Fix)
Remove the `<script type="importmap">...</script>` block entirely. Vite handles all dependency resolution locally.

### Step 2: Verify `package.json`
Ensure `react`, `react-dom`, `react-router-dom`, `@google/genai`, `@supabase/supabase-js`, and `lucide-react` are present in `dependencies`.

### Step 3: Remove Tailwind CDN
Remove the `<script src="https://cdn.tailwindcss.com"></script>` and the configuration script. Ensure Tailwind is configured via `postcss.config.js` and `tailwind.config.js`.

---

## 📉 Root Cause Analysis
The application fails to mount (`root.render`) because the JavaScript execution stops immediately upon encountering module import errors in the browser console. Fixing the module resolution strategy by adhering to the defined System Rules will resolve the blank screen.