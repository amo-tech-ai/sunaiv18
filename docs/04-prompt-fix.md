# Prompt: Architectural Refactor & Blank Screen Fix

**Goal:** Fix the "White Screen of Death" caused by the conflict between Vite and `importmap`.
**Reference:** Adhere strictly to `docs/03-custom-instructions.md`.

---

## 🤖 AI Instructions

You are a Senior React Architect. The current codebase uses a "Hybrid CDN" model that crashes Vite. You must refactor the project structure to a standard "Vite + Source" architecture.

### 1. Root Configuration & Dependencies
First, establish the build environment.
*   **Create/Update `package.json`**: Ensure these dependencies are defined (do not use CDNs):
    *   `react`, `react-dom` (^19.0.0)
    *   `react-router-dom` (^6.x or ^7.x)
    *   `@google/genai`, `@supabase/supabase-js`, `lucide-react`
    *   `clsx`, `tailwind-merge` (standard utils)
    *   Dev: `vite`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`
*   **Create `vite.config.ts`**: Standard configuration with `@vitejs/plugin-react`.
*   **Create `tsconfig.json`**: Standard React+Vite configuration.
*   **Create `postcss.config.js`**:
    ```js
    export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
    ```
*   **Create `tailwind.config.js`**:
    *   Move the config object from `index.html` into this file.
    *   Set `content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`.

### 2. Sanitize Entry Point (`index.html`)
*   **REMOVE** the `<script type="importmap">...</script>` block entirely.
*   **REMOVE** the `<script src="https://cdn.tailwindcss.com"></script>`.
*   **REMOVE** the inline `<script>tailwind.config = ...</script>`.
*   **UPDATE** the module script to point to the new source:
    *   From: `<script type="module" src="/index.tsx"></script>`
    *   To: `<script type="module" src="/src/main.tsx"></script>`

### 3. Structural Migration (Move to `src/`)
Move and rename files to create a clean `src` directory. Update all import paths within these files to be relative to their new locations.

*   `index.tsx` → `src/main.tsx` (Ensure it imports `./index.css`)
*   `App.tsx` → `src/App.tsx`
*   `types.ts` → `src/types.ts`
*   `lib/` → `src/lib/`
*   `services/` → `src/services/`
*   `context/` → `src/context/`
*   `components/` → `src/components/`
*   `pages/` → `src/pages/`
*   `data/` → `src/data/`

### 4. Styling Architecture
*   **Create `src/index.css`**:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Move custom styles from index.html <style> block here */
    ```

### 5. Final Verification
*   Ensure `src/main.tsx` uses `createRoot` and renders `<App />`.
*   Ensure `src/App.tsx` imports `HashRouter` from `react-router-dom` (not a CDN URL).
*   Verify no file refers to `https://esm.sh/...`.

---

**Execution:**
Please generate the XML `<changes>` block to implement this restructuring now.
