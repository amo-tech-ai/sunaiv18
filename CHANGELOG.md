# Changelog

All notable changes to the **Sun AI Agency** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2023-10-27

### Added
- **Core Architecture:**
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
