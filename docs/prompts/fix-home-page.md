# Prompt: Fix Broken Home Page & Routing Architecture

## Context
The application is currently failing to render (Blank Screen) due to a conflict between Vite and CDN-based import maps in `index.html`. Additionally, the routing architecture is split between a legacy implementation in `App.tsx` and the modern implementation in `router.tsx`.

## Goal
Restore the application to a working state by sanitizing the entry point and enforcing the "Vite + Data Router" architecture.

## Instructions for AI

### 1. Sanitize `index.html`
*   **Action:** Edit `index.html`.
*   **Requirement:** REMOVE the entire `<script type="importmap">...</script>` block.
*   **Requirement:** Ensure the file looks standard for a Vite React TS app:
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sun AI Agency</title>
        <!-- Fonts/CSS links -->
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
    ```

### 2. Enforce Router Architecture in `src/App.tsx`
*   **Action:** Rewrite `src/App.tsx`.
*   **Current State:** It uses `<HashRouter>` and `<Routes>`.
*   **Required State:** It MUST use `RouterProvider` from `react-router-dom`.
*   **Constraint:** **Do NOT use `<HashRouter>`, `<Routes>`, or `<Route>` anywhere after this change.** All routing must be defined in `src/router.tsx` via route objects.
    ```tsx
    import React from 'react';
    import { RouterProvider } from 'react-router-dom';
    import { router } from './router';

    const App: React.FC = () => {
      return <RouterProvider router={router} />;
    };

    export default App;
    ```

### 3. Cleanup Legacy Files
*   **Action:** DELETE `index.tsx` (in the root directory).
    *   *Reason:* The real entry point is `src/main.tsx`. This file is dead code.

### 4. Verification
*   Confirm `src/main.tsx` correctly imports `./index.css`.
*   Confirm `src/router.tsx` exports the `router` object.
*   **Sanity Check:** Confirm `src/components/WizardLayout.tsx` renders `<Outlet />`. (This is critical for nested routes to appear).

## Execution
Please generate the XML changes to apply these fixes immediately.
