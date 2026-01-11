# Supabase Edge Functions

**Purpose:** Edge Functions overview for Gemini Studio context  
**Total Functions:** 17 (all ACTIVE)  
**Last Updated:** 2025-01-27

---

## Overview

Deno-based serverless functions for AI-powered business analysis, wizard workflows, and dashboard intelligence. All functions use shared utilities for consistency and maintainability.

---

## Architecture

### Shared Utilities (`_shared/`)

- **`cors.ts`** - Standardized CORS headers
- **`gemini.ts`** - Gemini client initialization (uses `npm:@google/genai`)
- **`supabase.ts`** - Supabase client utilities (admin client, user validation, rate limiting)
- **`validation.ts`** - Request validation schemas (Zod)
- **`industryPacks.ts`** - Industry-specific diagnostic packs

### Best Practices

- ✅ Uses `Deno.serve` (not deprecated `serve` from deno.land/std)
- ✅ Uses `npm:` prefix for npm packages (via shared utilities)
- ✅ Uses shared utilities pattern (no code duplication)
- ✅ CORS headers implemented correctly
- ✅ Error handling with try/catch
- ⚠️ All functions have `verify_jwt: false` (intentional for MVP, must fix before production)

---

## Functions by Category

### Core AI Agents (7 functions)

1. **`analyst`** - Business research and industry classification
   - Model: `gemini-3-flash-preview`
   - Tools: Google Search
   - Features: Structured outputs, multiple modes (research, summarize_docs, classify)
   - Screen: Wizard Step 1 (Right Panel)

2. **`extractor`** - Pain point extraction from diagnostics
   - Model: `gemini-3-pro-preview`
   - Tools: Structured outputs, thinking mode
   - Features: Industry pack integration, system ID mapping
   - Screen: Wizard Step 2 (Right Panel)

3. **`optimizer`** - System optimization and recommendations
   - Model: `gemini-3-pro-preview`
   - Tools: Structured outputs
   - Features: System recommendations based on priorities
   - Screen: Wizard Step 3 (Right Panel)

4. **`scorer`** - Readiness scoring with weighted calculations
   - Model: `gemini-3-pro-preview`
   - Tools: Code execution, structured outputs, thinking mode
   - Features: Weighted scoring algorithm, code-based calculations
   - Screen: Wizard Step 4 (Right Panel)

5. **`planner`** - Strategic planning and roadmap generation
   - Model: `gemini-3-pro-preview`
   - Tools: Structured outputs, thinking mode
   - Features: 3-phase roadmap generation
   - Screen: Wizard Step 5 (Right Panel)

6. **`summary`** - Executive summary generation
   - Model: `gemini-3-pro-preview`
   - Tools: Structured outputs
   - Features: Deterministic scoring + AI narrative
   - Screen: Wizard Step 4 Summary (Right Panel)

7. **`orchestrator`** - Workflow orchestration and agent coordination
   - Model: `gemini-3-flash-preview`
   - Tools: Structured outputs, function calling (recommended)
   - Features: Agent coordination, task generation
   - Screen: Dashboard (Automation Panel)

---

### Wizard Flow Functions (5 functions)

8. **`analyze-business`** - Business analysis for wizard Step 1
   - Model: `gemini-3-flash-preview`
   - Tools: Google Search, URL Context (conditional)
   - Features: Real-time business research, website analysis
   - Screen: Wizard Step 1 (Right Panel - Live Analysis)
   - ✅ **FIXED:** Uses `Deno.serve`, shared utilities (best practices compliant)

9. **`generate-diagnostics`** - Diagnostic question generation (Step 2)
   - Model: `gemini-3-pro-preview`
   - Tools: Structured outputs, thinking mode
   - Features: Industry-specific questions, dynamic generation
   - Screen: Wizard Step 2 (Center Panel)

10. **`assess-readiness`** - Readiness assessment (Step 4)
    - Model: `gemini-3-pro-preview` (recommended)
    - Tools: Structured outputs, thinking mode (recommended)
    - Features: Readiness scoring, gap analysis
    - Screen: Wizard Step 4 (Right Panel)

11. **`recommend-systems`** - System recommendations (Step 3)
    - Model: `gemini-3-pro-preview`
    - Tools: Structured outputs, thinking mode
    - Features: System matching based on diagnostics
    - Screen: Wizard Step 3 (Right Panel)

12. **`generate-roadmap`** - Roadmap generation (Step 5)
    - Model: `gemini-3-pro-preview` (recommended)
    - Tools: Structured outputs, thinking mode (recommended)
    - Features: 3-phase roadmap structure
    - Screen: Wizard Step 5 (Right Panel)

---

### Intelligence & Analytics (5 functions)

13. **`intelligence-stream`** - Streaming intelligence updates
    - Model: `gemini-3-flash-preview`
    - Tools: Streaming API
    - Features: Real-time streaming responses
    - Screen: Dashboard (Intelligence Panel)

14. **`crm-intelligence`** - CRM intelligence and health scoring
    - Model: `gemini-3-flash-preview`
    - Tools: Google Search, structured outputs
    - Features: Relationship health scoring, next action recommendations
    - Screen: Dashboard (CRM Panel)

15. **`analytics`** - Analytics processing
    - Model: `gemini-3-flash-preview`
    - Tools: Code execution, structured outputs
    - Features: Data analysis, trend identification
    - Screen: Dashboard (Analytics Panel)

16. **`assistant`** - General AI assistant
    - Model: `gemini-3-pro-preview` (recommended)
    - Tools: Function calling, RAG (recommended)
    - Features: Conversational AI, context retrieval
    - Screen: Chatbot (Conversational Helper)

17. **`monitor`** - System monitoring
    - Model: `gemini-3-flash-preview` (recommended)
    - Tools: Structured outputs (recommended)
    - Features: System health monitoring, alerts
    - Screen: Dashboard (Monitoring Panel)

18. **`task-generator`** - Automated task generation
    - Model: `gemini-3-flash-preview`
    - Tools: Structured outputs
    - Features: Task breakdown from roadmap phases
    - Screen: Dashboard (Automation Panel)

---

## Gemini 3 Model Selection

### Use Gemini 3 Pro (`gemini-3-pro-preview`) for:
- Complex reasoning (analyst, planner, optimizer)
- High-quality outputs (summary, recommendations)
- Structured outputs with thinking mode
- Agent coordination (orchestrator)
- CRM intelligence (complex analysis)

### Use Gemini 3 Flash (`gemini-3-flash-preview`) for:
- Fast extraction (extractor - but currently uses Pro)
- Quick scoring (scorer - but currently uses Pro)
- Real-time streaming (intelligence-stream)
- Fast analytics (analytics)
- Business analysis (analyze-business)
- Lightweight tasks (task-generator, monitor)

**Note:** Some functions may need model updates for optimal performance/speed balance.

---

## Gemini 3 Features Usage

### Currently Implemented

- ✅ **Google Search Grounding** - `analyze-business`, `analyst`, `crm-intelligence`
- ✅ **URL Context Tool** - `analyze-business` (conditional)
- ✅ **Structured Outputs** - `analyst`, `extractor`, `scorer`, `summary`, `optimizer`, `planner`, `recommend-systems`, `generate-diagnostics`, `crm-intelligence`, `analytics`
- ✅ **Thinking Mode** - `extractor`, `scorer`, `generate-diagnostics`, `recommend-systems`
- ✅ **Code Execution** - `scorer`, `analytics`
- ✅ **Streaming** - `intelligence-stream`, `analyst` (research mode)

### Recommended (Not Yet Implemented)

- ⚠️ **Function Calling** - `orchestrator`, `optimizer`, `assistant` (recommended)
- ⚠️ **RAG (Retrieval Augmented Generation)** - `assistant`, `crm-intelligence` (recommended)
- ⚠️ **Deep Research** - `analyst` (recommended)
- ⚠️ **Structured Outputs** - `analyze-business`, `intelligence-stream`, `assess-readiness`, `generate-roadmap` (recommended)

---

## Request/Response Patterns

### Standard Request Pattern
```typescript
{
  org_id?: string,        // Organization ID (multi-tenancy)
  project_id?: string,    // Project ID (if project-scoped)
  session_id?: string,    // Wizard session ID (if wizard flow)
  // ... function-specific fields
}
```

### Standard Response Pattern
```typescript
// Success
{
  data: any,              // Function-specific response data
  // ... or direct response
}

// Error
{
  error: string,          // Error message
  details?: any           // Validation/error details
}
```

### Authentication

- **Current:** Authorization header presence check (not JWT validation)
- **Status:** ⚠️ All functions have `verify_jwt: false` (intentional for MVP)
- **Recommendation:** Enable `verify_jwt: true` OR implement proper JWT validation before production

---

## Error Handling

All functions follow standard error handling:
```typescript
try {
  // Function logic
} catch (error) {
  console.error("Function Error:", error);
  return new Response(
    JSON.stringify({ error: error.message || 'Internal Server Error' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

---

## Rate Limiting

- Implemented via `checkRateLimit(orgId)` in `_shared/supabase.ts`
- Limit: 100 requests per organization per hour
- Logged in `ai_run_logs` table

---

## Data Persistence

Functions persist data to:
- **`wizard_sessions`** - Wizard progress
- **`wizard_answers`** - Wizard step data
- **`context_snapshots`** - Business context snapshots
- **`roadmaps`** - Generated roadmaps
- **`roadmap_phases`** - Roadmap phases
- **`tasks`** - Generated tasks
- **`ai_run_logs`** - AI execution audit trail

---

## Agent Mapping

Each function corresponds to an AI agent type:

- **Orchestrator** → `orchestrator`
- **Planner** → `planner`, `task-generator`, `generate-roadmap`
- **Analyst** → `analyst`, `analyze-business`, `generate-diagnostics`, `summary`, `intelligence-stream`, `crm-intelligence`, `analytics`
- **Extractor** → `extractor`
- **Optimizer** → `optimizer`, `recommend-systems`
- **Scorer** → `scorer`, `assess-readiness`, `crm-intelligence`
- **Ops Automation** → `monitor`
- **Content/Comms** → `assistant`
- **Controller** → All functions (human approval required)

---

## Best Practices Compliance

### ✅ Compliant

- Uses `Deno.serve` (not deprecated serve)
- Uses `npm:` prefix via shared utilities
- Uses shared utilities pattern
- CORS headers implemented
- Error handling present
- Environment variables used correctly

### ⚠️ Needs Improvement

- JWT verification disabled (intentional for MVP)
- Model selection inconsistent (some functions use wrong model)
- Advanced Gemini 3 features underutilized (function calling, RAG, deep research)
- Agent documentation not explicitly in code

---

## Security Notes

- **Current Status:** All 17 functions have `verify_jwt: false`
- **Impact:** Functions accept unauthenticated requests
- **Recommendation:** Enable `verify_jwt: true` OR implement proper JWT validation before production
- **Rate Limiting:** Implemented per organization (100/hour)
- **Input Validation:** Zod schemas used for request validation

---

## Deployment Status

- **Total Functions:** 17
- **Status:** All ACTIVE
- **Latest Deployment:** All functions deployed and running
- **Versioning:** Functions use version numbers (e.g., analyst v2)

---

## Common Integration Patterns

### Frontend → Edge Function
```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { /* request data */ },
  headers: {
    Authorization: `Bearer ${supabaseToken}`
  }
});
```

### Edge Function → Gemini
```typescript
const ai = createGeminiClient();
const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: prompt,
  config: {
    tools: [{ googleSearch: {} }],
    responseMimeType: "application/json",
    responseSchema: schema
  }
});
```

### Edge Function → Database
```typescript
const admin = getAdminClient(); // Service role client
await admin.from('table_name').insert({ /* data */ });
```

---

## Important Notes for AI Context

1. **Shared Utilities:** Always use `_shared/` utilities - never duplicate code
2. **Model Selection:** Use Pro for complex reasoning, Flash for speed
3. **Structured Outputs:** Use JSON Schema for consistent responses
4. **Error Handling:** Always catch errors and return proper HTTP status codes
5. **Multi-Tenancy:** Always validate `org_id` and filter by organization
6. **Rate Limiting:** Check rate limits before expensive operations
7. **CORS:** Use shared `corsHeaders` for consistent CORS handling
8. **Authentication:** Currently disabled for MVP - must enable before production

---

## Function Status Matrix

| Function | Model | Tools | Structured Outputs | Thinking | Status |
|----------|-------|-------|-------------------|----------|--------|
| `analyze-business` | Flash | Google Search, URL Context | ❌ | ❌ | ✅ Fixed |
| `analyst` | Flash | Google Search | ✅ | ❌ | ✅ Active |
| `extractor` | Pro | ✅ | ✅ | ✅ | ✅ Active |
| `optimizer` | Pro | ✅ | ✅ | ❌ | ✅ Active |
| `scorer` | Pro | Code Execution | ✅ | ✅ | ✅ Active |
| `planner` | Pro | ✅ | ✅ | ❌ | ✅ Active |
| `summary` | Pro | ✅ | ✅ | ❌ | ✅ Active |
| `orchestrator` | Flash | ✅ | ✅ | ❌ | ✅ Active |
| `generate-diagnostics` | Pro | ✅ | ✅ | ✅ | ✅ Active |
| `assess-readiness` | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ Active |
| `recommend-systems` | Pro | ✅ | ✅ | ✅ | ✅ Active |
| `generate-roadmap` | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ Active |
| `intelligence-stream` | Flash | Streaming | ❌ | ❌ | ✅ Active |
| `crm-intelligence` | Flash | Google Search | ✅ | ❌ | ✅ Active |
| `analytics` | Flash | Code Execution | ✅ | ❌ | ✅ Active |
| `assistant` | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ Active |
| `monitor` | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ Active |
| `task-generator` | Flash | ✅ | ✅ | ❌ | ✅ Active |

**Legend:**
- ✅ = Implemented
- ❌ = Not implemented (recommended)
- ⚠️ = Needs verification/recommendation

---

**Document Version:** 1.0  
**Last Audit:** 2025-01-27  
**Status:** ✅ Current (17 functions verified, 1 function fixed for best practices)