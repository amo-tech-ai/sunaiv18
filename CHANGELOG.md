# Changelog

All notable changes to the **Sun AI Agency** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2025-01-28

### Fixed
- **Module Resolution & Import Errors**:
  - Moved root-level `data/` and `services/` directories into `src/` to resolve broken relative imports (e.g., `../../data/industryPacks`) in wizard components.
  - Fixed `aiService.ts` paths to correctly reference Supabase client and types.
- **Tailwind Configuration**:
  - Created `postcss.config.js` and `tailwind.config.js` to replace inline HTML configuration.
  - Configured content sources to correctly scan `./src/**/*.{ts,tsx}`.

### Added
- **Build Configuration**:
  - Added `vite.config.ts` with standard React plugin and alias resolution (`@` -> `./src`).
  - Added `tsconfig.json` and `tsconfig.node.json` for proper TypeScript compilation boundaries.

### Refactored
- **Directory Structure**:
  - Enforced "Src Sovereignty": All application source code now resides strictly within `src/`.
  - Removed "Split-Brain" logic where some business logic lived in root while UI lived in `src`.

## [0.3.2] - 2025-01-28

### Fixed
- **Critical Rendering Bug**:
  - Removed conflicting `<importmap>` from `index.html` that caused a "Split Brain" React instance issue (Vite vs CDN), resolving the blank screen on startup.
- **Routing Architecture**:
  - Refactored `src/App.tsx` to strictly use `RouterProvider` via `src/router.tsx`.
  - Removed legacy `<HashRouter>`/`<Routes>` implementation that was ignoring the Data Router configuration.

### Removed
- **Legacy Entry Point**:
  - Deprecated `index.tsx` in favor of `src/main.tsx` to adhere to Vite standards.
- **CDN Dependencies**:
  - Removed Tailwind CSS CDN script from `index.html` (now handled via PostCSS).

## [0.3.1] - 2025-01-28

### Added
- **Documentation**:
  - Added `docs/sitemap.md` containing the project directory tree, routing architecture, and user journey flow diagrams.

## [0.3.0] - 2025-01-28

### Added
- **Edge Functions**:
  - Implemented `analyze-business` function using `gemini-3-flash-preview`.
  - Integrated `googleSearch` and `urlContext` tools for real-time grounding.
  - Added robust error handling and `Authorization` header validation.
- **Data Persistence**:
  - Connected `Step1Context` to `context_snapshots` table.
  - Implemented `saveSnapshot` in `WizardContext` with proper schema mapping (`summary` + `metrics`).
- **Testing**:
  - Added `tests/manual-verification.md` for end-to-end flow validation.

### Changed
- **AI Service**:
  - Refactored `services/aiService.ts` to invoke Supabase Edge Functions.
  - Removed client-side Gemini generation logic.
  - Added "Offline Analysis Mode" fallback for resilience.
- **Wizard Step 1**:
  - Analysis now triggers server-side execution.
  - Snapshots are only saved when analysis is successful (non-offline).

## [0.2.0] - 2025-01-27

### Added
- **Agency Dashboard**:
  - New route `/agency` for multi-tenant client management.
  - Implemented Client List view with health scores and status tracking.
  - Added "Agency Intelligence" right panel for cross-client AI insights.
- **Guest Mode**:
  - Implemented fallback authentication in `WizardContext`.
  - Application now functions in "Guest Mode" if Supabase Auth is unreachable or anonymous sign-ins are disabled.
  - Enables UI development without active backend connection.
- **Documentation**:
  - Added `docs/00-progress-tracker.md` for real-time implementation status tracking.
  - Added `docs/prd.md` (Product Requirements Document v3.1.0).
  - Added `docs/supabase.md` (Database Schema Reference).
  - Added `docs/roadmap.md` (Implementation Roadmap).
  - Added `docs/prompts/` directory for step-by-step AI development tracking.

### Changed
- **Architecture**:
  - Removed `importmap` from `index.html` to comply with strict Vite + TypeScript build rules.
  - Updated `lib/supabase.ts` to safely handle `import.meta.env` for environment variable injection.
- **Dependencies**:
  - Standardized on React 19 and Vite 6 patterns.

## [0.1.0] - 2023-10-27

### Added
- **Core Architecture**:
  - Implemented Vite + React 19 + TypeScript stack.
  - Configured `importmap` for build-less dependency resolution via `esm.sh`.
  - Set up `HashRouter` for stable client-side routing.
  - Added `metadata.json` for application permissions and metadata.

- **Design System:**
  - Integrated Tailwind CSS via CDN.
  - Configured custom color palette (`stone`, `accent`) and typography (`Instrument Serif`, `Inter`).
  - Created reusable "Editorial" style form components (`Input`, `TextArea`).

- **Wizard Experience:**
  - **Layout:** Developed a responsive 3-panel layout (Context Sidebar, Workspace, AI Intelligence Panel).
  - **State Management:** Created `WizardContext` for global session data and AI analysis state.
  - **Step 1 (Context):** Business profile form with debounce-triggered AI analysis.
  - **Step 2 (Diagnostics):** Interactive questionnaire logic (mocked data).
  - **Step 3 (Architecture):** System recommendation selection interface.
  - **Summary:** Executive brief generation view.

- **AI Integration:**
  - Integrated `@google/genai` SDK (Gemini 1.5).
  - Implemented `geminiService` using `gemini-2.5-flash-latest` model.
  - Added "Live Analysis" feedback loop in the Wizard right panel.
  - Implemented graceful fallback (Mock Mode) when API key is missing.

- **Dashboard:**
  - Created post-onboarding Client Dashboard.
  - Added visualizations for Active Agents, Tasks Automated, and Efficiency Scores.

- **Documentation:**
  - Added `docs/01-overview.md` with technical stack, sitemap, and architectural diagrams.

### Changed
- N/A (Initial Release)

### Fixed
- N/A (Initial Release)