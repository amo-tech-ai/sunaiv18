# Mermaid Diagrams: Edge Functions Implementation

**Purpose:** Visual documentation of Edge Functions architecture, data flow, state transitions, and database schema for live Gemini 3 analysis.

**Based On:** Implementation plan from `docs/tasks/01-edge-functions.md`, corrected prompts from `docs/tasks/03-edge-prompts.md`, and audit findings from `docs/tasks/02-audit.md`.

---

## 1. System Flow: Live Analysis Sequence

Complete end-to-end flow from user input to database persistence, showing all components and their interactions.

```mermaid
sequenceDiagram
    participant User
    participant Step1Context as Step1Context<br/>(pages/wizard/)
    participant WizardContext as WizardContext<br/>(context/)
    participant aiService as aiService<br/>(services/)
    participant SupabaseClient as Supabase Client<br/>(lib/supabase.ts)
    participant EdgeFunction as analyze-business<br/>(Edge Function)
    participant validateUser as validateUser<br/>(_shared/supabase.ts)
    participant GeminiAPI as Google Gemini 3<br/>(gemini-3-flash-preview)
    participant Database as Supabase Database<br/>(context_snapshots)

    User->>Step1Context: Enters Website URL / Business Name
    Step1Context->>Step1Context: Debounce Timer (2s)
    Step1Context->>Step1Context: Check Minimum Data Requirements
    Step1Context->>WizardContext: setAnalysis({ status: 'analyzing' })
    
    Note over Step1Context: Minimum Data:<br/>Website >5 chars OR<br/>(Business Name >2 AND Description >10)
    
    Step1Context->>aiService: analyzeBusiness(context)
    activate aiService
    aiService->>SupabaseClient: functions.invoke('analyze-business', { body })
    deactivate aiService
    activate SupabaseClient
    SupabaseClient->>EdgeFunction: POST Request (with JWT)
    deactivate SupabaseClient
    
    activate EdgeFunction
    EdgeFunction->>EdgeFunction: Handle OPTIONS (CORS)
    EdgeFunction->>EdgeFunction: Parse JSON Body
    EdgeFunction->>validateUser: validateUser(req)
    activate validateUser
    validateUser->>validateUser: Extract Auth Header
    validateUser->>validateUser: Verify JWT Token
    validateUser-->>EdgeFunction: User Authenticated
    deactivate validateUser
    
    Note over EdgeFunction: Secure Server-Side Execution
    
    EdgeFunction->>EdgeFunction: Get API_KEY from Deno.env
    EdgeFunction->>EdgeFunction: Initialize GoogleGenAI Client
    EdgeFunction->>EdgeFunction: Build Tools Array:<br/>- googleSearch (always)<br/>- urlContext (if website provided)
    EdgeFunction->>EdgeFunction: Construct Prompt with Context
    EdgeFunction->>GeminiAPI: generateContent(prompt, tools, model)
    activate GeminiAPI
    Note over GeminiAPI: Tools Used:<br/>- Google Search Grounding<br/>- URL Context (conditional)
    GeminiAPI-->>EdgeFunction: Returns Analysis Text (Markdown)
    deactivate GeminiAPI
    
    EdgeFunction->>EdgeFunction: Format Response: { analysis: string }
    EdgeFunction-->>SupabaseClient: Return JSON Response (200 OK)
    deactivate EdgeFunction
    
    activate SupabaseClient
    SupabaseClient-->>aiService: Response Data
    deactivate SupabaseClient
    
    activate aiService
    aiService-->>WizardContext: Return Analysis Text (string)
    deactivate aiService
    
    activate WizardContext
    WizardContext->>WizardContext: setAnalysis({ status: 'idle', content: result })
    
    alt Valid Analysis Result (not offline fallback)
        WizardContext->>WizardContext: saveSnapshot(content)
        activate WizardContext
        WizardContext->>Database: Query Latest Version
        Database-->>WizardContext: Current Version Number
        WizardContext->>Database: UPDATE is_active = false<br/>WHERE org_id = current
        WizardContext->>Database: INSERT context_snapshots<br/>(summary, metrics, version, is_active)
        Note over Database: Schema:<br/>summary: text (required)<br/>metrics: jsonb (required)<br/>version: integer<br/>is_active: boolean
        Database-->>WizardContext: Snapshot Saved
        deactivate WizardContext
    end
    
    WizardContext->>Step1Context: Update UI State
    deactivate WizardContext
    
    Step1Context->>User: Display Analysis in Right Panel
    Note over Step1Context,User: Live Analysis Panel Shows:<br/>- Status: "idle"<br/>- Content: Markdown Text<br/>- Timestamp: Last Updated
```

---

## 2. State Transitions: Analysis Status Flow

State machine diagram showing all possible state transitions for the analysis process, from initial state through analyzing, success, and error scenarios.

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial State<br/>(No Analysis)
    
    Idle --> Analyzing: User Input Changes<br/>(Debounced, Min Data Met)
    
    Analyzing --> Idle: Analysis Success<br/>(Content Received)
    Analyzing --> Error: Analysis Failed<br/>(Network/API Error)
    Analyzing --> Idle: Offline Fallback<br/>(Edge Function Unavailable)
    
    Idle --> Analyzing: User Edits Input<br/>(Re-analysis Triggered)
    Idle --> Analyzing: User Clicks Refresh<br/>(Manual Re-analysis)
    
    Error --> Analyzing: User Retries<br/>(Error Recovery)
    Error --> Idle: Fallback Shown<br/>(Graceful Degradation)
    
    note right of Idle
        Status: 'idle'
        Content: Analysis Text (Markdown)
        Saved: Database (if valid)
    end note
    
    note right of Analyzing
        Status: 'analyzing'
        Content: Empty
        UI: Loading Spinner/Skeleton
    end note
    
    note right of Error
        Status: 'error'
        Content: Error Message (optional)
        UI: Error State / Retry Button
    end note
```

---

## 3. Entity Relationship: Database Schema

Complete database schema for wizard sessions, answers, and context snapshots, showing relationships, field types, and constraints.

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ PROJECTS : "owns"
    ORGANIZATIONS ||--o{ TEAM_MEMBERS : "has"
    PROJECTS ||--o{ WIZARD_SESSIONS : "tracks"
    WIZARD_SESSIONS ||--o{ WIZARD_ANSWERS : "has"
    PROJECTS ||--o{ CONTEXT_SNAPSHOTS : "stores_ai_results"
    ORGANIZATIONS ||--o{ CONTEXT_SNAPSHOTS : "isolates"
    
    ORGANIZATIONS {
        uuid id PK
        text name
        timestamptz created_at
        timestamptz updated_at
    }
    
    PROJECTS {
        uuid id PK
        uuid org_id FK
        uuid client_id FK
        text name
        int current_step
        float progress
        text status
        timestamptz created_at
        timestamptz updated_at
    }
    
    TEAM_MEMBERS {
        uuid id PK
        uuid org_id FK
        uuid user_id FK
        text role
        timestamptz created_at
    }
    
    WIZARD_SESSIONS {
        uuid id PK
        uuid org_id FK
        uuid project_id FK
        int current_step
        timestamptz created_at
        timestamptz updated_at
    }
    
    WIZARD_ANSWERS {
        uuid id PK
        uuid session_id FK
        uuid org_id FK
        int step_number
        jsonb data
        timestamptz created_at
        timestamptz updated_at
    }
    
    CONTEXT_SNAPSHOTS {
        uuid id PK
        uuid org_id FK "NOT NULL"
        uuid project_id FK "NOT NULL"
        int version "NOT NULL"
        boolean is_active "NOT NULL, DEFAULT true"
        text summary "NOT NULL, REQUIRED"
        jsonb metrics "NOT NULL, REQUIRED"
        timestamptz created_at
        timestamptz updated_at
    }
    
    note for CONTEXT_SNAPSHOTS "CRITICAL: Both summary (text) and metrics (jsonb) are REQUIRED fields.<br/>Summary: Human-readable text (e.g., 'Business Analysis: Company Name - Industry')<br/>Metrics: JSON object containing full content, timestamp, industry, etc.<br/>Only one active snapshot per project (enforced by unique partial index)."
```

---

## 4. Data Flow: Request and Response Pipeline

Detailed data flow showing how data transforms through each layer, from user input to database storage.

```mermaid
flowchart TD
    Start([User Fills Form]) --> Input{Minimum Data<br/>Present?}
    Input -->|No| Wait[Wait for More Input]
    Wait --> Input
    Input -->|Yes| Debounce[Debounce Timer<br/>2 seconds]
    Debounce --> CheckStatus{Status =<br/>'analyzing'?}
    CheckStatus -->|Yes| Wait
    CheckStatus -->|No| SetAnalyzing[Set Status:<br/>'analyzing']
    
    SetAnalyzing --> BuildPayload[Build Payload:<br/>businessName, industry,<br/>description, website,<br/>services]
    BuildPayload --> InvokeEdge[Invoke Edge Function:<br/>analyze-business]
    
    InvokeEdge --> AuthCheck{Authentication<br/>Valid?}
    AuthCheck -->|No| AuthError[Return 401<br/>Unauthorized]
    AuthError --> SetError[Set Status:<br/>'error']
    SetError --> ShowError[Show Error UI]
    
    AuthCheck -->|Yes| GetAPIKey[Get API_KEY<br/>from Deno.env]
    GetAPIKey --> InitGemini[Initialize<br/>GoogleGenAI Client]
    InitGemini --> BuildTools{Website<br/>Provided?}
    
    BuildTools -->|Yes| ToolsWithURL[Tools Array:<br/>googleSearch,<br/>urlContext]
    BuildTools -->|No| ToolsBasic[Tools Array:<br/>googleSearch]
    
    ToolsWithURL --> CallGemini[Call Gemini API:<br/>generateContent]
    ToolsBasic --> CallGemini
    
    CallGemini --> GeminiResponse{Success?}
    GeminiResponse -->|No| GeminiError[Handle API Error]
    GeminiError --> SetError
    
    GeminiResponse -->|Yes| ExtractText[Extract Text<br/>from Response]
    ExtractText --> FormatResponse[Format Response:<br/>{ analysis: string }]
    FormatResponse --> ReturnResponse[Return 200 OK<br/>with JSON]
    
    ReturnResponse --> UpdateState[Update State:<br/>status: 'idle',<br/>content: result]
    
    UpdateState --> CheckValid{Result Valid?<br/>Not Offline?}
    CheckValid -->|No| ShowOffline[Show Offline<br/>Fallback]
    CheckValid -->|Yes| SaveSnapshot[Save Snapshot<br/>to Database]
    
    SaveSnapshot --> QueryVersion[Query Latest<br/>Version Number]
    QueryVersion --> DeactivateOld[Deactivate Old<br/>Snapshots]
    DeactivateOld --> BuildSummary[Build Summary Text:<br/>'Business Analysis:<br/>Name - Industry']
    BuildSummary --> BuildMetrics[Build Metrics JSON:<br/>{ content, timestamp,<br/>industry }]
    BuildMetrics --> InsertSnapshot[INSERT context_snapshots<br/>summary + metrics]
    InsertSnapshot --> ShowLive[Show Live Analysis<br/>in UI]
    ShowOffline --> ShowLive
    
    ShowLive([Display Analysis<br/>in Right Panel])
    
    style SaveSnapshot fill:#e1f5ff
    style InsertSnapshot fill:#e1f5ff
    style AuthCheck fill:#fff4e6
    style GeminiResponse fill:#fff4e6
    style CheckValid fill:#fff4e6
```

---

## 5. Component Architecture: Frontend to Backend

High-level architecture diagram showing how frontend components connect to Edge Functions and database.

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (React + Vite)"]
        Step1[Step1Context<br/>Component]
        WizardCtx[WizardContext<br/>Provider]
        AISvc[aiService<br/>Service Layer]
        SupabaseLib[Supabase Client<br/>lib/supabase.ts]
    end
    
    subgraph EdgeFunction["Supabase Edge Function (Deno)"]
        AnalyzeFunc[analyze-business<br/>Edge Function]
        ValidateAuth[validateUser<br/>Shared Utility]
        CORSHandler[CORS Handler]
    end
    
    subgraph ExternalAPI["External API"]
        Gemini[Google Gemini 3 API<br/>gemini-3-flash-preview]
    end
    
    subgraph Database["Supabase Database (PostgreSQL)"]
        ContextSnapshots[context_snapshots<br/>Table]
        WizardSessions[wizard_sessions<br/>Table]
        WizardAnswers[wizard_answers<br/>Table]
    end
    
    Step1 -->|1. User Input| WizardCtx
    WizardCtx -->|2. Trigger Analysis| Step1
    Step1 -->|3. Call Service| AISvc
    AISvc -->|4. Invoke Function| SupabaseLib
    SupabaseLib -->|5. POST Request<br/>with JWT| AnalyzeFunc
    
    AnalyzeFunc -->|6. Validate| ValidateAuth
    ValidateAuth -->|7. Auth OK| AnalyzeFunc
    AnalyzeFunc -->|8. Handle CORS| CORSHandler
    AnalyzeFunc -->|9. Call API| Gemini
    Gemini -->|10. Analysis Text| AnalyzeFunc
    AnalyzeFunc -->|11. JSON Response| SupabaseLib
    SupabaseLib -->|12. Analysis String| AISvc
    AISvc -->|13. Update State| WizardCtx
    WizardCtx -->|14. Save Snapshot| ContextSnapshots
    WizardCtx -->|15. Save Step Data| WizardSessions
    WizardCtx -->|16. Save Answers| WizardAnswers
    WizardCtx -->|17. Update UI| Step1
    
    style Frontend fill:#e3f2fd
    style EdgeFunction fill:#fff3e0
    style ExternalAPI fill:#f3e5f5
    style Database fill:#e8f5e9
```

---

## 6. Error Handling Flow

Complete error handling flow showing all error scenarios and how they are handled at each layer.

```mermaid
flowchart TD
    Start([Analysis Triggered]) --> CallService[Call aiService]
    CallService --> InvokeEdge[Invoke Edge Function]
    
    InvokeEdge --> NetworkError{Network<br/>Error?}
    NetworkError -->|Yes| NetworkFallback[Return Offline<br/>Fallback Message]
    NetworkError -->|No| EdgeResponse{Edge Function<br/>Response?}
    
    EdgeResponse -->|No Response| TimeoutFallback[Handle Timeout<br/>Show Error State]
    EdgeResponse -->|Error Response| ParseError{Error<br/>Code?}
    
    ParseError -->|401| AuthError[Unauthorized<br/>Show Auth Error]
    ParseError -->|403| ForbiddenError[Forbidden<br/>Show Access Error]
    ParseError -->|400| ValidationError[Bad Request<br/>Show Input Error]
    ParseError -->|500| ServerError[Server Error<br/>Show Generic Error]
    ParseError -->|429| RateLimitError[Rate Limited<br/>Show Retry Message]
    
    EdgeResponse -->|Success| GeminiCheck{Gemini<br/>API Success?}
    GeminiCheck -->|No| GeminiError[Handle Gemini Error<br/>Show Fallback]
    GeminiCheck -->|Yes| ParseResponse[Parse Response]
    
    ParseResponse --> ExtractAnalysis{Analysis<br/>Field Present?}
    ExtractAnalysis -->|No| MissingData[Handle Missing Data<br/>Show Error]
    ExtractAnalysis -->|Yes| UpdateUI[Update UI State]
    
    NetworkFallback --> UpdateUI
    TimeoutFallback --> ShowErrorUI[Show Error UI]
    AuthError --> ShowErrorUI
    ForbiddenError --> ShowErrorUI
    ValidationError --> ShowErrorUI
    ServerError --> ShowErrorUI
    RateLimitError --> ShowErrorUI
    GeminiError --> ShowErrorUI
    MissingData --> ShowErrorUI
    
    UpdateUI --> SaveSnapshot{Save<br/>Snapshot?}
    SaveSnapshot -->|Yes| SnapshotError{Database<br/>Error?}
    SnapshotError -->|Yes| LogSnapshotError[Log Error<br/>Continue Anyway]
    SnapshotError -->|No| SnapshotSuccess[Snapshot Saved]
    SaveSnapshot -->|No| SkipSnapshot[Skip Save]
    
    LogSnapshotError --> DisplayAnalysis[Display Analysis]
    SnapshotSuccess --> DisplayAnalysis
    SkipSnapshot --> DisplayAnalysis
    ShowErrorUI --> AllowRetry{Allow<br/>Retry?}
    AllowRetry -->|Yes| RetryButton[Show Retry Button]
    AllowRetry -->|No| StaticError[Show Static Error]
    
    DisplayAnalysis([Analysis Displayed])
    RetryButton([Error with Retry])
    StaticError([Error Message])
    
    style NetworkFallback fill:#fff3cd
    style ShowErrorUI fill:#f8d7da
    style DisplayAnalysis fill:#d4edda
```

---

## 7. Security and Authentication Flow

Detailed security flow showing authentication validation, authorization checks, and data isolation.

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant SupabaseClient as Supabase Client<br/>(lib/supabase.ts)
    participant EdgeFunction as analyze-business<br/>Edge Function
    participant ValidateUser as validateUser<br/>(_shared/supabase.ts)
    participant AuthAPI as Supabase Auth API
    participant Database as Database<br/>(RLS Policies)

    Client->>SupabaseClient: functions.invoke('analyze-business')
    Note over Client,SupabaseClient: Request includes JWT token<br/>in Authorization header

    SupabaseClient->>EdgeFunction: POST Request<br/>Authorization: Bearer <JWT>
    
    EdgeFunction->>EdgeFunction: Extract Auth Header
    EdgeFunction->>ValidateUser: validateUser(req)
    
    ValidateUser->>ValidateUser: Get Authorization Header
    alt No Auth Header
        ValidateUser-->>EdgeFunction: Error: "Unauthorized: No session found"
        EdgeFunction-->>SupabaseClient: 401 Unauthorized
        SupabaseClient-->>Client: Error Response
    else Auth Header Present
        ValidateUser->>AuthAPI: Verify JWT Token
        AuthAPI-->>ValidateUser: User Data or Error
        
        alt Invalid Token
            ValidateUser-->>EdgeFunction: Error: "Unauthorized: Invalid session"
            EdgeFunction-->>SupabaseClient: 401 Unauthorized
            SupabaseClient-->>Client: Error Response
        else Valid Token
            ValidateUser-->>EdgeFunction: User Authenticated
            
            EdgeFunction->>EdgeFunction: Process Request
            EdgeFunction->>EdgeFunction: Call Gemini API
            EdgeFunction-->>SupabaseClient: Success Response
            
            Note over Client,Database: Data Persistence Layer
            
            SupabaseClient->>Database: Save Snapshot<br/>(with user's org_id)
            Database->>Database: Check RLS Policy
            Note over Database: RLS: Users can only<br/>access their org's data
            
            alt RLS Check Passes
                Database-->>SupabaseClient: Snapshot Saved
            else RLS Check Fails
                Database-->>SupabaseClient: 403 Forbidden
            end
            
            SupabaseClient-->>Client: Success Response
        end
    end
```

---

**Note:** All diagrams are based on 100% accurate implementation requirements from the audit (`docs/tasks/02-audit.md`) and corrected prompts (`docs/tasks/03-edge-prompts.md`). They reflect the actual codebase structure (root-level files, not `src/`), correct database schema (summary + metrics fields), and proper authentication patterns.
