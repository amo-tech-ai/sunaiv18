---
description: Supabase development rules for Sun AI Agency v18 (Multi-tenant, RLS, Edge Functions)
alwaysApply: true
---

# Supabase Development Rules

## 1. Multi-Tenancy & Security
*   **Org Isolation**: Every table (except `organizations` itself) **MUST** have an `org_id` column.
*   **Query Filtering**: Client-side queries **MUST** rely on RLS, but explicit `eq('org_id', userOrgId)` is recommended for clarity in complex joins.
*   **RLS Policies**:
    *   Enable RLS on **ALL** tables immediately after creation.
    *   Standard Policy Pattern: `auth.uid() IN (SELECT user_id FROM team_members WHERE org_id = table.org_id)`.
    *   Never use `public` role for data access policies.

## 2. Database Schema Patterns
*   **JSONB Usage**: Use `jsonb` for dynamic, document-style data (e.g., `wizard_answers.data`, `briefs.content`).
    *   *Rule*: Define TypeScript interfaces for all JSONB structures to ensure application-level type safety.
*   **Financials**: Store all monetary values as `integer` (cents), never `float` or `decimal`.
*   **Vector Embeddings**:
    *   Use `vector(768)` for documents (standard text-embedding-004).
    *   Use `vector(1536)` for legacy OpenAI embeddings if present.
    *   Always create an IVFFlat index on embedding columns for performance.

## 3. Edge Functions
*   **Path**: `supabase/functions/<function-name>/index.ts`
*   **Client Initialization**:
    *   Use `createClient` with `Supabase.env.SUPABASE_URL` and `Supabase.env.SUPABASE_SERVICE_ROLE_KEY` for backend logic.
    *   **Crucial**: Service role bypasses RLS. You **MUST** manually validate that the `org_id` passed in the payload belongs to the authenticated user (via JWT verification).
*   **CORS**: Handle CORS `OPTIONS` requests explicitly in every function.

## 4. TypeScript Integration
*   **Type Generation**: Always regenerate types after schema changes:
    `npx supabase gen types typescript --project-id "$PROJECT_ID" > types/supabase.ts`
*   **No Any**: Do not cast database responses to `any`. Use the generated `Database` interface.
    ```typescript
    const { data } = await supabase.from('projects').select('*'); // Typed automatically
    ```

## 5. Migrations
*   **Immutability**: Never edit a migration file after it has been applied to production. Create a new migration instead.
*   **Naming**: Format: `<timestamp>_description.sql`.
*   **Down Migrations**: Always include a comment in the SQL file describing how to revert the change (even if we roll forward).

## 6. Common Patterns
*   **Status Columns**: Use lowercase text strings for status (e.g., 'active', 'archived') instead of integers/enums for easier debugging.
*   **Timestamps**: Use `timestamptz` (not `timestamp`). Ensure `created_at` defaults to `now()` and `updated_at` is handled by the `moddatetime` extension trigger.
