# Sun AI Agency — Implementation Roadmap

**Version:** 1.0.0
**Status:** Planning & Migration
**Architect:** Senior Product Architect
**Target:** Production-Ready MVP with Gemini 3 Intelligence

---

## 1. Executive Summary & Setup Analysis

**Current Architecture:**
*   **Frontend:** React 19, Tailwind (CDN), HashRouter.
*   **Backend:** Supabase (Schema exists), Edge Functions (17 defined but disconnected).
*   **AI:** Client-side Gemini calls (Insecure), currently using `gemini-3-flash-preview`.
*   **Data:** In-memory `WizardContext`. No persistence.

**Critical Gaps:**
*   **Security:** API Keys exposed in client. Must move to Edge Functions.
*   **Persistence:** No connection to Supabase DB.
*   **Routing:** HashRouter is not SEO/SaaS friendly.
*   **Intelligence:** Gemini 3 features (Thinking, Grounding) are not yet implemented.

---

## 2. UI/UX & Dashboards

### Routes & Screens
| Route | Component | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Marketing conversion | ✅ |
| `/app/wizard/step-1` | `Step1Context` | Business profile & AI Analysis | ⚠️ (No DB) |
| `/app/wizard/step-2` | `Step2Diagnostics` | Industry questions | ⚠️ (Static) |
| `/app/wizard/step-3` | `Step3Recommendations` | System stack selection | ⚠️ (Static) |
| `/app/wizard/summary` | `Summary` | Executive Brief | ⚠️ (Static) |
| `/app/dashboard` | `Dashboard` | Client Project View | ⚠️ (Mock) |
| `/agency` | `AgencyDashboard` | Multi-tenant Client Manager | ❌ (Missing) |

### Components Needed
*   `AuthGuard`: Protect dashboard routes.
*   `SupabaseProvider`: Replace/Augment WizardContext.
*   `StreamingResponse`: UI component for rendering streaming AI text.
*   `SkeletonLoader`: For AI thinking states.

---

## 3. Core Features & Gemini 3 Tools

### Gemini 3 Integration Inventory
| Feature | Model | Configuration | Implementation Status |
| :--- | :--- | :--- | :--- |
| **Search Grounding** | `gemini-3-flash-preview` | `tools: [{googleSearch: {}}]` | Phase 2 |
| **Thinking Mode** | `gemini-3-pro-preview` | `thinkingConfig: { thinkingBudget: 2048 }` | Phase 2 |
| **Structured Output** | `gemini-3-pro-preview` | `responseSchema: Type.OBJECT` | Phase 2 |
| **Visualizer** | `gemini-3-pro-image-preview` | (Nano Banana Pro) Dashboard Mockups | Phase 3 |
| **Function Calling** | `gemini-3-flash-preview` | `tools: [functionDeclarations]` | Phase 3 |
| **URL Context** | `gemini-3-flash-preview` | Custom Tool / Grounding | Phase 2 |

---

## 4. User Journeys

### Journey 1: The Diagnostics (Wizard)
1.  **Start:** User lands, clicks "Start".
2.  **Context:** Inputs URL `sunai.com`.
3.  **AI Analysis:** Agent (Analyst) uses **Search Grounding** to verify entity.
4.  **Refinement:** Agent (Extractor) uses **Thinking Mode** to generate industry-specific questions (e.g., "Do you use Jira?").
5.  **Proposal:** Agent (Optimizer) recommends "Unified CRM".
6.  **Sign-up:** User authenticates to save the roadmap.

### Journey 2: The Execution (Dashboard)
1.  **Login:** User enters Dashboard.
2.  **View:** Sees generated Roadmap.
3.  **Visual:** Agent (Visualizer) generates a preview image of their future dashboard using **Nano Banana Pro**.
4.  **Action:** User clicks "Start Phase 1".
5.  **Agent:** Planner Agent breaks Phase 1 into 5 tasks via **Structured Output**.

### Journey 3: The Agency Oversight
1.  **Monitor:** Agency admin views Client List.
2.  **Alert:** Scorer Agent detects "Low Engagement" on Client A.
3.  **Intervention:** Admin clicks "Draft Email".
4.  **Draft:** Assistant Agent uses **Function Calling** to pull project status and draft email.

---

## 5. Workflows & Failure Paths

### Workflow: Step 1 Analysis
*   **Trigger:** User blurs URL field.
*   **Action:** Call `analyze-business` Edge Function.
*   **Logic:**
    1.  Check Cache (`ai_cache`).
    2.  If miss, call `gemini-3-flash-preview` with `googleSearch`.
    3.  Save to `context_snapshots`.
*   **Failure Path:** If API fails/timeout -> Use heuristic regex on URL -> Return "Offline Analysis".

### Workflow: Step 2 Extraction
*   **Trigger:** User submits answers.
*   **Action:** Call `extractor` Edge Function.
*   **Logic:**
    1.  Call `gemini-3-pro-preview` with `thinkingConfig`.
    2.  Parse user text for "Pain Points".
    3.  Map to `systems` table.
*   **Failure Path:** If JSON parse fails -> Return generic "General Efficiency" pain points.

---

## 6. AI Agents

| Agent | Role | Model | Trigger | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Analyst** | Researcher | `gemini-3-flash` | Step 1 Input | Search Grounding, URL Parsing |
| **Extractor** | Diagnostician | `gemini-3-pro` | Step 2 Submit | Thinking Mode, Pattern Rec |
| **Optimizer** | Architect | `gemini-3-pro` | Step 3 Load | ROI Calculation |
| **Planner** | PM | `gemini-3-pro` | Step 4 Submit | Structured JSON (Gantt) |
| **Visualizer**| Designer | `gemini-3-pro-image`| Dashboard Load| Image Generation (Nano Banana Pro) |
| **Guardian** | Compliance | `gemini-3-pro` | Pre-Output | Safety Filters (HIPAA/GDPR) |

**Additional Agent:**
*   **Guardian Agent:** Runs parallel checks to ensure no PII is leaked in summaries.

---

## 7. Implementation Phases

### Phase 1: Wiring & Infrastructure (Days 1-3)
- [ ] **Auth:** Implement Supabase Auth (Anon + Magic Link).
- [ ] **Persistence:** Connect `WizardContext` to `wizard_sessions` table.
- [ ] **Security:** Move `geminiService.ts` logic to Edge Function `analyze-business`.
- [ ] **Validation:** Verify `org_id` RLS policies.

### Phase 2: Intelligence & Logic (Days 4-7)
- [ ] **Analyst:** Deploy `analyze-business` with **Search Grounding**.
- [ ] **Extractor:** Deploy `generate-diagnostics` with **Thinking Mode**.
- [ ] **Planner:** Deploy `generate-roadmap` with **Structured Output**.
- [ ] **Frontend:** Replace mock data with Edge Function responses.

### Phase 3: Dashboard & Visuals (Days 8-12)
- [ ] **Dashboard UI:** Connect `projects` table to Dashboard.
- [ ] **Visualizer:** Implement `gemini-3-pro-image-preview` for "Future State" generation.
- [ ] **Real-time:** Implement Supabase Subscriptions for status updates.

### Phase 4: Agency Features (Days 13-15)
- [ ] **Client List:** Multi-tenant view.
- [ ] **Health Scoring:** Background cron job (Edge Function).
- [ ] **Global Search:** Vector search over all documents.

---

## 8. Frontend-Backend Wiring Setup

**Pattern:** `UI -> Hook -> Supabase Client -> DB/Edge Function`

1.  **Install:** `npm install @supabase/supabase-js`
2.  **Config:** `src/lib/supabase.ts`
    ```typescript
    import { createClient } from '@supabase/supabase-js';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    export const supabase = createClient(supabaseUrl, supabaseKey);
    ```
3.  **Hook:** `src/hooks/useAI.ts`
    ```typescript
    const analyze = async (data: any) => {
      const { data: result, error } = await supabase.functions.invoke('analyze-business', {
        body: data
      });
      return result;
    }
    ```

---

## 9. Acceptance Tests & Validation

### Verification Checklist
- [ ] **Secure:** No `API_KEY` in client bundle.
- [ ] **Persisted:** Refreshing Step 2 retains answers.
- [ ] **Isolated:** User A cannot see User B's wizard session.
- [ ] **Intelligent:** Step 1 actually returns real industry data (not mock).
- [ ] **Responsive:** Works on Mobile Safari.

### Scenario: Roadmap Generation
*   **Given** A completed wizard session with "Retail" industry.
*   **When** User clicks "Generate Roadmap".
*   **Then** `planner` function is invoked.
*   **And** Gemini 3 Pro (Thinking) processes for ~5s.
*   **And** Valid JSON matches `RoadmapSchema`.
*   **And** UI renders a Gantt chart.

---

## 10. Real-World Use Cases

1.  **The Solo Consultant:** Uses Sun AI to generate professional "System Architecture" PDFs for clients in 5 minutes (Step 1-4).
2.  **The Agency Team:** Uses the Agency Dashboard to track 50+ clients, receiving alerts when a client's "Health Score" drops due to lack of activity.
3.  **The E-commerce Brand:** Uses the Visualizer to see a mock "Inventory Dashboard" before committing to a $50k dev project.
