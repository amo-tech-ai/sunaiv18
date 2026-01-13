# 06 Layout & Routing Architecture

**Version:** 1.0.0
**Status:** ⚠️ Broken (See Audit)
**Framework:** React Router v6 (Data Router) + Vite

---

## 1. High-Level Layout Strategy

The application uses a **Nested Routing** strategy to apply different layouts to different sections of the app without reloading the page.

### A. Root Layouts
| Path | Component | Type | Description |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Fullscreen | Marketing entry point. No sidebar. |
| `/app` | `WizardLayout` | 3-Panel | The core application shell. Contains Context, Work, and Intelligence panels. |
| `/agency` | `AgencyDashboard` | 3-Panel (Agency) | Specialized layout for multi-tenant management. |

### B. The 3-Panel "Wizard" Shell
Defined in `src/components/WizardLayout.tsx`.

1.  **Left Panel (Context)**:
    *   **Width:** 80px (Icon) -> 320px (Expanded).
    *   **Role:** Navigation, Progress Tracking, Session Status.
    *   **Behavior:** Static context that persists while user works in the center.
2.  **Center Panel (Workspace)**:
    *   **Width:** Flex Grow (Fluid).
    *   **Role:** The primary interactive area (Forms, Inputs, Selections).
    *   **Behavior:** Renders the `<Outlet />`. Scrolls independently.
3.  **Right Panel (Intelligence)**:
    *   **Width:** 380px (Fixed).
    *   **Role:** AI Feedback Loop ("Live Analysis").
    *   **Behavior:** Reactive to center panel inputs. Read-only advice.

---

## 2. Routing Implementation (Intended)

The application **MUST** use the Data Router API (`createHashRouter`) to support loaders, actions, and proper error boundaries.

**File:** `src/router.tsx`
```tsx
export const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <WizardWrapper />, // Provides Context + Layout
    children: [
      { path: 'wizard/step-1', element: <Step1Context /> },
      // ... other steps
    ]
  }
]);
```

**File:** `src/App.tsx`
```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const App = () => <RouterProvider router={router} />;
```

---

## 3. 🚨 Audit: Why the Home Page is Broken

**Date:** January 28, 2025
**Symptom:** Blank Screen / Render Failure

### Critical Finding A: Import Map Conflict
*   **File:** `index.html`
*   **Issue:** Contains `<script type="importmap">` mapping `react` to `esm.sh`.
*   **Conflict:** Vite bundles `react` from `node_modules` (Local). The browser attempts to load `react` from CDN (Remote).
*   **Result:** "Dual React Instance" error or module resolution failure. The app crashes before mounting.

### Critical Finding B: Routing Logic Mismatch
*   **File:** `src/App.tsx` vs `src/router.tsx`
*   **Issue:** `src/App.tsx` is currently implementing a **Legacy Router** (`<HashRouter><Routes>...`) manually.
*   **Impact:**
    1.  It ignores the configuration in `src/router.tsx`.
    2.  It fails to provide the Data Router capabilities needed for the architecture.
    3.  It creates code duplication.

### Critical Finding C: Entry Point Confusion
*   **Files:** `index.tsx` (Root) vs `src/main.tsx`.
*   **Issue:** Both files exist. `index.html` points to `src/main.tsx`, but `index.tsx` is lingering code that might confuse developers or AI agents.

---

## 4. Remediation Plan

1.  **Sanitize:** Remove `importmap` from `index.html` entirely.
2.  **Unify:** Rewrite `src/App.tsx` to strictly use `RouterProvider` consuming `src/router.tsx`.
3.  **Cleanup:** Delete root `index.tsx`.
4.  **Verify:** Ensure `src/main.tsx` imports global CSS.
