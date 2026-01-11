# SunAI Product Requirements Document

**Version:** 3.1.0  
**Date:** January 27, 2025  
**Status:** Development in Progress (~45% Complete)  
**Audience:** Product Managers, Designers, Engineers, Stakeholders

---

## Executive Summary

SunAI is an AI Business Operating System that helps service businesses discover, implement, and manage AI automation. The platform features a 4-step intelligent wizard (currently implemented) with plans for a 5-step version, powered by Google Gemini AI to analyze businesses, diagnose operational bottlenecks, recommend AI systems, and generate strategic roadmaps.

**Current State:**
- ✅ 4-step wizard UI implemented (Steps 1-3 + Summary)
- ✅ Basic AI integration (client-side Gemini calls)
- ✅ 17 Edge Functions created (backend)
- ⚠️ Data persistence not connected (in-memory state only)
- ⚠️ Many Edge Functions exist but not connected to frontend
- ❌ Authentication not implemented
- ❌ Dashboard partially implemented

**Target Vision:**
- 5-step intelligent wizard with full AI integration
- Complete data persistence with Supabase
- Multi-tenant client dashboard
- Full authentication and authorization
- Production-ready architecture

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Current Implementation Status](#2-current-implementation-status)
3. [Target Architecture](#3-target-architecture)
4. [Wizard Flow (Current vs. Planned)](#4-wizard-flow-current-vs-planned)
5. [Technical Stack](#5-technical-stack)
6. [Data Architecture](#6-data-architecture)
7. [AI Integration Strategy](#7-ai-integration-strategy)
8. [User Experience](#8-user-experience)
9. [Success Metrics](#9-success-metrics)
10. [Roadmap](#10-roadmap)

---

## 1. Product Overview

### 1.1 Core Value Proposition

**For Business Owners:**
SunAI helps service businesses discover which AI solutions match their specific operational needs through an intelligent wizard that analyzes their business and provides personalized AI system recommendations.

**For Agencies:**
SunAI provides a scalable client onboarding and project management platform with AI-powered insights and automated workflows.

### 1.2 Core Components

| Component | Status | Description |
|-----------|--------|-------------|
| **Wizard UI** | ✅ ~60% | 4-step wizard interface (Steps 1-3 + Summary) |
| **AI Integration** | ⚠️ ~30% | Client-side Gemini calls (should use Edge Functions) |
| **Edge Functions** | ✅ ~70% | 17 functions created, most not connected to frontend |
| **Data Persistence** | ❌ 0% | No database connection, in-memory state only |
| **Dashboard** | ⚠️ ~20% | Basic UI exists, no data connection |
| **Authentication** | ❌ 0% | Not implemented |
| **Industry Packs** | ⚠️ ~60% | Data exists, not dynamically loaded |

### 1.3 Target Users

**Primary Persona: Business Owner**
- Owner/operator of SMB (1-50 employees)
- Limited technical expertise
- Time-constrained
- Industries: Fashion, Real Estate, E-commerce, Agencies, Professional Services

**Secondary Persona: Agency Team Member**
- Account manager or project coordinator
- Managing multiple clients
- Needs efficient onboarding workflows

---

## 2. Current Implementation Status

### 2.1 What's Actually Built

#### ✅ Completed Features

**Frontend Structure:**
- React 19.2.3 with TypeScript 5.8.2
- HashRouter with 4 wizard routes
- WizardContext for state management (in-memory)
- 3-panel layout component (WizardLayout)
- Basic UI components (Input, basic styling)
- 4 wizard step components (Step1Context, Step2Diagnostics, Step3Recommendations, Summary)

**Backend Infrastructure:**
- 17 Supabase Edge Functions created
- Shared utilities (_shared/ folder)
- Database schema defined (30 tables, migrations)
- Industry pack data structures

**AI Integration:**
- Client-side Gemini API calls (geminiService.ts)
- Basic business context analysis (Step 1)
- Gemini 2.5 Flash model configured

#### ⚠️ Partially Implemented

**Wizard Steps:**
- Step 1: Form works, AI analysis triggers but uses client-side API (should use Edge Function)
- Step 2: Static questions displayed, no dynamic industry pack loading, no answer collection
- Step 3: Static recommendations displayed, no AI optimization, no selection logic
- Summary: Static display, uses context data only, no AI-generated summary

**Edge Functions:**
- Functions exist but most not called from frontend
- Authentication/authorization not implemented
- Data persistence not connected

#### ❌ Not Started

- Data persistence (no Supabase client in frontend)
- Authentication system
- Dashboard data connection
- Dynamic industry pack loading
- URL Context tool integration
- Google Search Grounding
- Structured outputs (partially)
- Full 5-step wizard (currently 4 steps)

### 2.2 Current Architecture

**Frontend:**
```
React App (HashRouter)
├── LandingPage (/)
├── Wizard Flow (/app/wizard/*)
│   ├── Step1Context (Business Info)
│   ├── Step2Diagnostics (Questions - Static)
│   ├── Step3Recommendations (Systems - Static)
│   └── Summary (Executive Brief - Static)
└── Dashboard (/app/dashboard - Basic UI)
```

**Backend:**
```
Supabase Edge Functions (Deno)
├── analyze-business/ (not connected)
├── generate-diagnostics/ (not connected)
├── recommend-systems/ (not connected)
├── assess-readiness/ (not connected)
├── generate-roadmap/ (not connected)
├── analyst/ (not connected)
├── extractor/ (exists, not connected)
├── optimizer/ (exists, not connected)
├── scorer/ (exists, not connected)
├── summary/ (exists, not connected)
├── planner/ (exists, not connected)
└── ... (7 more functions)
```

**State Management:**
- React Context (WizardContext) - in-memory only
- No database persistence
- No local storage backup

---

## 3. Target Architecture

### 3.1 Planned 5-Step Wizard

| Step | Name | Current Status | Planned Features |
|------|------|----------------|------------------|
| **1** | Business Context | ✅ UI Complete | ⚠️ Needs Edge Function connection, URL Context, Search Grounding |
| **2** | Industry Diagnostics | ⚠️ UI Only | ❌ Needs dynamic questions, answer collection, Extractor Agent |
| **3** | System Recommendations | ⚠️ UI Only | ❌ Needs Optimizer Agent, dynamic recommendations, selection logic |
| **4** | Executive Summary | ✅ UI Complete | ❌ Needs Scorer Agent, AI-generated brief, readiness score |
| **5** | Roadmap & Execution | ❌ Not Started | ❌ Needs Planner Agent, 3-phase roadmap generation |

### 3.2 Data Flow (Target)

```
User Input → Frontend → Edge Function → Gemini API
                                    ↓
                         Supabase Database (wizard_answers)
                                    ↓
                         Frontend Updates from DB
```

**Current Flow:**
```
User Input → Frontend → Client-side Gemini API → In-memory State
(No database persistence)
```

### 3.3 Architecture Patterns

**Three-Panel Layout:**
- Left (20%): Context - Business info, progress
- Center (50%): Work - Forms, selections, primary actions
- Right (30%): Intelligence - AI explanations, insights

**State Management (Target):**
- WizardContext (React) for UI state
- Supabase for persistence
- Edge Functions for AI processing
- Real-time subscriptions for live updates

---

## 4. Wizard Flow (Current vs. Planned)

### 4.1 Step 1: Business Context

**Current Implementation:**
- ✅ Form fields: Full Name, Business Name, Website, Industry, Description, Services
- ✅ Industry dropdown selection
- ✅ Services multi-select chips
- ✅ Client-side Gemini analysis trigger (debounced)
- ❌ No URL Context tool
- ❌ No Google Search Grounding
- ❌ No database persistence
- ❌ Uses client-side API key (security risk)

**Planned Implementation:**
- Edge Function: `analyze-business`
- URL Context tool integration
- Google Search Grounding
- Database persistence (wizard_sessions, wizard_answers)
- Server-side API key management

### 4.2 Step 2: Industry Diagnostics

**Current Implementation:**
- ✅ UI displays static questions
- ❌ No dynamic industry pack loading
- ❌ No answer collection/state management
- ❌ No Extractor Agent integration
- ❌ No pain point extraction

**Planned Implementation:**
- Dynamic questions from Industry Packs
- Answer collection and persistence
- Edge Function: `generate-diagnostics` or `extractor`
- Pain point extraction and matching
- System-to-pain-point mapping

### 4.3 Step 3: System Recommendations

**Current Implementation:**
- ✅ UI displays static recommendation cards
- ❌ No dynamic recommendations
- ❌ No selection logic
- ❌ No Optimizer Agent integration
- ❌ No "Why For You" explanations

**Planned Implementation:**
- Edge Function: `recommend-systems` or `optimizer`
- Dynamic AI-generated recommendations
- System selection (1-3 systems)
- Personalized "Why For You" explanations
- Match score calculation

### 4.4 Step 4: Executive Summary (Current Final Step)

**Current Implementation:**
- ✅ UI displays static summary
- ✅ Uses WizardContext data
- ❌ No AI-generated executive brief
- ❌ No readiness score calculation
- ❌ No Scorer Agent integration

**Planned Implementation:**
- Edge Function: `summary` or `assess-readiness`
- AI-generated 2-paragraph executive brief
- Deterministic readiness score (formula-based)
- Impact metrics calculation
- Key signals display

### 4.5 Step 5: Roadmap & Execution (Planned)

**Status:** ❌ Not yet implemented

**Planned Features:**
- Edge Function: `generate-roadmap` or `planner`
- 3-phase roadmap generation
- Phase breakdown with deliverables
- KPI definition per phase
- Task generation
- Timeline visualization

---

## 5. Technical Stack

### 5.1 Current Stack

| Category | Technology | Version | Status |
|----------|-----------|---------|--------|
| **Frontend Framework** | React | 19.2.3 | ✅ |
| **Language** | TypeScript | 5.8.2 | ✅ |
| **Build Tool** | Vite | 6.2.0 | ✅ |
| **Routing** | React Router DOM | 7.12.0 | ✅ (HashRouter) |
| **Styling** | Tailwind CSS | v3.x | ⚠️ (CDN, should be PostCSS) |
| **AI SDK** | @google/genai | 1.35.0 | ✅ |
| **Icons** | Lucide React | 0.562.0 | ✅ |
| **Backend Runtime** | Deno | Latest | ✅ (Edge Functions) |
| **Database** | Supabase PostgreSQL | Latest | ✅ (Schema exists) |
| **Auth** | Supabase Auth | Latest | ❌ (Not implemented) |

### 5.2 Architecture Decisions

**Current (Needs Migration):**
- HashRouter (should migrate to BrowserRouter for production)
- Tailwind CDN (should migrate to PostCSS)
- Client-side API keys (security risk)
- Root-level source files (should be in /src)
- In-memory state only (no persistence)

**Target:**
- BrowserRouter with SPA rewrite rules
- Tailwind via PostCSS
- Server-side API keys only
- /src directory structure
- Full database persistence

---

## 6. Data Architecture

### 6.1 Database Schema (Supabase)

**30 Tables Defined:**
- Core: organizations, profiles, team_members
- Wizard: wizard_sessions, wizard_answers
- Projects: projects, context_snapshots, roadmaps, roadmap_phases
- Systems: systems, services, system_services, project_systems, project_services
- CRM: clients, crm_contacts, crm_deals, crm_interactions, crm_pipelines, crm_stages
- Execution: tasks, deliverables, milestones
- Documents: documents, briefs, brief_versions
- Billing: invoices, payments
- AI: ai_run_logs, ai_cache

**Current Status:**
- ✅ Schema defined and migrated
- ✅ RLS policies created
- ❌ No frontend Supabase client
- ❌ No data persistence from wizard
- ❌ No authentication

### 6.2 Data Flow (Target)

**Wizard Flow:**
1. User starts wizard → Create `wizard_sessions` record
2. Step 1 completion → Save to `wizard_answers` (step 1 data)
3. Step 2 completion → Save to `wizard_answers` (step 2 data)
4. Step 3 completion → Save to `wizard_answers` (step 3 data)
5. Step 4 completion → Save to `wizard_answers` (step 4 data) + Create `context_snapshots`
6. Step 5 completion → Create `roadmaps` + `roadmap_phases` + Create `projects`

**Current State:**
- All data in React Context (WizardContext)
- Lost on page refresh
- No database connection

---

## 7. AI Integration Strategy

### 7.1 Gemini Models

| Model | Usage | Current Status |
|-------|-------|----------------|
| **Gemini 3 Flash** | Fast operations, Step 1, streaming | ✅ Configured |
| **Gemini 3 Pro** | Complex reasoning, Steps 2-5 | ⚠️ Available, not used |

### 7.2 AI Agents (Edge Functions)

| Agent | Purpose | Status |
|-------|---------|--------|
| **analyst** | Business research, industry detection | ✅ Exists, ❌ Not connected |
| **extractor** | Pain point extraction | ✅ Exists, ❌ Not connected |
| **optimizer** | System recommendations | ✅ Exists, ❌ Not connected |
| **scorer** | Readiness scoring | ✅ Exists, ❌ Not connected |
| **summary** | Executive brief generation | ✅ Exists, ❌ Not connected |
| **planner** | Roadmap generation | ✅ Exists, ❌ Not connected |

### 7.3 Gemini Features

| Feature | Usage | Status |
|---------|-------|--------|
| **URL Context** | Step 1 website analysis | ❌ Not implemented |
| **Google Search Grounding** | Step 1 industry research | ❌ Not implemented |
| **Structured Outputs** | All steps | ⚠️ Partially (Edge Functions have schemas) |
| **Thinking Mode** | Complex reasoning | ⚠️ Configured in Edge Functions |
| **Code Execution** | Score calculations | ⚠️ Used in scorer function |

**Current Implementation:**
- Client-side text generation only
- No URL Context
- No Search Grounding
- No Structured Outputs (frontend)
- Simple prompt-response pattern

---

## 8. User Experience

### 8.1 Three-Panel Layout

**Left Panel (Context - 20%):**
- Current step indicator
- Business information summary
- Progress indicator
- Previous selections

**Center Panel (Work - 50%):**
- Primary form/content
- User inputs
- Action buttons
- Main interactions

**Right Panel (Intelligence - 30%):**
- AI analysis results
- Insights and explanations
- Verification badges (planned)
- Live feedback

### 8.2 Current UX Status

**Implemented:**
- ✅ Basic 3-panel layout structure
- ✅ Form inputs and navigation
- ✅ Step progression

**Missing:**
- ❌ Right panel AI insights (Step 1 has basic analysis)
- ❌ Verification badges
- ❌ Loading states for AI calls
- ❌ Error handling UI
- ❌ Responsive breakpoints fully tested
- ❌ Empty states

---

## 9. Success Metrics

### 9.1 Development Metrics

| Metric | Current | Target |
|--------|---------|--------|
| **Overall Completion** | ~45% | 100% |
| **Wizard Steps Functional** | 1/4 (25%) | 5/5 (100%) |
| **Edge Functions Connected** | 0/17 (0%) | 17/17 (100%) |
| **Data Persistence** | 0% | 100% |
| **Authentication** | 0% | 100% |

### 9.2 Product Metrics (Future)

| Metric | Target |
|--------|--------|
| **Wizard Completion Rate** | >70% |
| **Time to Complete** | <10 minutes |
| **AI Recommendation Acceptance** | >60% |
| **Dashboard Engagement** | Active usage |

---

## 10. Roadmap

### 10.1 Immediate Priorities (Phase 1)

1. **Connect Edge Functions to Frontend**
   - Replace client-side Gemini calls with Edge Function calls
   - Implement authentication/authorization
   - Add error handling

2. **Implement Data Persistence**
   - Add Supabase client to frontend
   - Save wizard data to database
   - Restore wizard state on return

3. **Complete Step 2 Functionality**
   - Dynamic industry pack loading
   - Answer collection
   - Connect Extractor Agent

4. **Complete Step 3 Functionality**
   - Connect Optimizer Agent
   - Dynamic recommendations
   - Selection logic

### 10.2 Near-Term (Phase 2)

1. **Complete Step 4 (Summary)**
   - Connect Scorer Agent
   - AI-generated executive brief
   - Readiness score calculation

2. **Implement Step 5 (Roadmap)**
   - Connect Planner Agent
   - 3-phase roadmap generation
   - Task breakdown

3. **Dashboard Integration**
   - Connect dashboard to database
   - Display project data
   - Implement navigation

### 10.3 Future (Phase 3)

1. **Authentication System**
   - Supabase Auth integration
   - Multi-tenant support
   - Role-based access

2. **Advanced Features**
   - URL Context tool
   - Google Search Grounding
   - Real-time updates
   - AI Coach panel

3. **Production Readiness**
   - Migration to BrowserRouter
   - PostCSS Tailwind setup
   - Security hardening
   - Performance optimization
   - Testing suite

---

## 11. Key Differences from prd-1.md

### 11.1 Wizard Steps

**prd-1.md says:** 5-step wizard (Steps 1-5)  
**Reality:** 4-step wizard (Steps 1-3 + Summary)

**prd-1.md describes:** Step 4 = Executive Summary, Step 5 = Roadmap  
**Reality:** Summary is the 4th step, Step 5 doesn't exist yet

### 11.2 Feature Status

**prd-1.md describes:** Many features as "implemented" or "complete"  
**Reality:** Most features are planned, not implemented

**Examples:**
- URL Context: prd-1 says "implemented" → Reality: Not implemented
- Data Persistence: prd-1 describes full flow → Reality: No persistence
- Edge Functions: prd-1 describes as connected → Reality: Not connected to frontend

### 11.3 Architecture

**prd-1.md describes:** Production-ready architecture  
**Reality:** Development setup with many migration needs

---

## 12. Design Principles

### 12.1 Progressive Intelligence
Each wizard step builds on context from previous steps. Nothing resets. By the final step, AI has comprehensive understanding.

### 12.2 Trust Through Transparency
Every AI decision should be explainable. Users see what was analyzed. Scores are calculated deterministically when possible.

### 12.3 Human Control
AI proposes, humans approve. No AI action happens without user consent. Users can regenerate, modify, or reject any AI output.

### 12.4 Industry-First Personalization
Generic advice fails. Industry Packs customize diagnostic questions, pain points, and system recommendations for each industry.

### 12.5 Sales-Ready Outputs
Every output is decision-oriented, not raw analysis. Executive briefs are structured for stakeholder buy-in. Roadmaps are actionable.

---

## Appendices

### Appendix A: Industry Packs

Supported Industries (data exists, not dynamically loaded):
- Fashion & Luxury
- Real Estate
- E-commerce & Retail
- Agencies & Consulting
- Startups & SaaS
- Travel & Hospitality
- Professional Services

### Appendix B: Edge Functions List

**Wizard Flow Functions:**
- analyze-business
- generate-diagnostics
- recommend-systems
- assess-readiness
- generate-roadmap

**Core AI Agents:**
- analyst
- extractor
- optimizer
- scorer
- summary
- planner
- orchestrator

**Intelligence & Analytics:**
- intelligence-stream
- crm-intelligence
- analytics
- assistant
- monitor
- task-generator

### Appendix C: Database Tables

**Core (3):** organizations, profiles, team_members  
**Wizard (2):** wizard_sessions, wizard_answers  
**Projects (3):** projects, context_snapshots, roadmaps, roadmap_phases  
**Systems (5):** systems, services, system_services, project_systems, project_services  
**CRM (5):** clients, crm_contacts, crm_deals, crm_interactions, crm_pipelines, crm_stages  
**Execution (3):** tasks, deliverables, milestones  
**Documents (3):** documents, briefs, brief_versions  
**Billing (2):** invoices, payments  
**AI (2):** ai_run_logs, ai_cache  
**Other (1):** activities

**Total: 30 tables**

---

**Document Version:** 3.1.0  
**Last Updated:** 2025-01-27  
**Status:** Active Development  
**Next Review:** After Phase 1 completion
