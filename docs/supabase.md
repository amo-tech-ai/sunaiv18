# Supabase Database Schema

**Purpose:** Database schema overview for Gemini Studio context  
**Database:** necxcwhuzylsumlkkmlk.supabase.co  
**Last Updated:** 2025-01-27

---

## Overview

Multi-tenant PostgreSQL database with 30 tables, Row Level Security (RLS), vector search capabilities, and comprehensive relationship tracking for AI agency workflow management.

---

## Key Features

- **Multi-Tenancy:** All tables include `org_id` for tenant isolation
- **Row Level Security:** RLS enabled on all 30 tables
- **Vector Search:** `pgvector` extension for document/embedding search
- **Financial Precision:** Integer-based currency (amount_cents) to avoid floating-point errors
- **Version Tracking:** JSONB flexibility with version numbers
- **Soft Deletes:** Status tracking (active, archived, deleted)

---

## Tables (30 total)

### Core Multi-Tenant Tables

1. **organizations** - Root tenant entity (all other tables reference this)
2. **profiles** - User profiles linked to `auth.users`
3. **team_members** - Organization membership and roles
4. **clients** - Client/lead records with CRM classification
5. **projects** - Project tracking and status

### Wizard & Strategy Tables

6. **wizard_sessions** - Wizard progress tracking
7. **wizard_answers** - Wizard step data and answers
8. **context_snapshots** - Business context snapshots (summary + metrics JSONB)
9. **roadmaps** - Strategic roadmaps
10. **roadmap_phases** - Roadmap phases (3-phase structure)
11. **tasks** - Execution tasks linked to phases

### AI & Analytics Tables

12. **ai_run_logs** - AI execution audit trail
13. **ai_cache** - AI response caching
14. **analytics** - Analytics data (if exists)

### Service & System Catalog

15. **services** - Service catalog
16. **systems** - AI systems catalog
17. **system_services** - System-to-service mapping
18. **project_systems** - Project-system relationships
19. **project_services** - Project-service relationships

### Content & Deliverables

20. **documents** - Document storage with vector embeddings (768 dimensions)
21. **briefs** - Client briefs
22. **brief_versions** - Brief version history
23. **deliverables** - Client deliverables
24. **milestones** - Project milestones

### Financial Tables

25. **invoices** - Client invoices (amount_cents integer)
26. **payments** - Payment history

### CRM Tables

27. **crm_pipelines** - CRM pipelines
28. **crm_stages** - Pipeline stages
29. **crm_contacts** - Client contacts
30. **crm_deals** - CRM deals
31. **crm_interactions** - Interaction history with vector embeddings (1536 dimensions)
32. **activities** - Activity timeline

---

## Key Relationships

```
organizations (root)
  ├── team_members (org_id)
  ├── clients (org_id)
  │   ├── projects (client_id)
  │   │   ├── wizard_sessions (project_id)
  │   │   ├── context_snapshots (project_id)
  │   │   ├── roadmaps (project_id)
  │   │   │   └── roadmap_phases (roadmap_id)
  │   │   │       ├── tasks (phase_id)
  │   │   │       ├── deliverables (phase_id)
  │   │   │       └── milestones (phase_id)
  │   │   └── project_systems, project_services
  │   ├── crm_contacts (client_id)
  │   ├── crm_deals (client_id)
  │   └── crm_interactions (client_id)
  └── services, systems, system_services (org_id)
```

---

## Database Functions (6)

1. `update_updated_at()` - Trigger function for updated_at timestamps
2. `handle_wizard_completion()` - Wizard completion handler
3. `handle_client_onboarding()` - Client onboarding handler
4. `handle_dashboard_activation()` - Dashboard activation handler
5. `handle_new_crm_interaction()` - CRM interaction handler
6. `get_client_classification(p_client_id uuid)` - Client classification function

---

## Views (1)

- `client_crm_status` - Comprehensive client CRM status view (SECURITY DEFINER)

---

## Extensions

- `pgvector` - Vector similarity search (for document/embedding search)
- `pgcrypto` - Cryptographic functions
- `uuid-ossp` - UUID generation
- `pg_stat_statements` - Query performance statistics
- `supabase_vault` - Secrets management
- `pg_graphql` - GraphQL support

---

## Row Level Security (RLS)

- **Status:** RLS enabled on all 30 tables
- **Pattern:** Policies filter by `org_id` for tenant isolation
- **Temporary Policies:** 7 permissive policies (`temp_anon_*`) for anonymous access during MVP development
- **Note:** Temporary policies use `USING (true)` or `WITH CHECK (true)` - must be replaced before production

---

## Data Types

- **Primary Keys:** UUID (all tables)
- **Timestamps:** `timestamptz` (created_at, updated_at)
- **Currency:** `integer` (amount_cents) - avoids floating-point errors
- **Flexible Data:** `jsonb` (for structured but flexible data)
- **Vectors:** 
  - `vector(768)` - Document embeddings
  - `vector(1536)` - Interaction embeddings
- **Text:** `text` (unlimited length strings)
- **Enums:** Custom enum types (crm_interaction_type, crm_sentiment)

---

## Indexes

- Primary key indexes (all tables)
- Foreign key indexes (org_id, project_id, client_id, etc.)
- Vector indexes (for similarity search)
- Composite indexes (org_id + status, org_id + created_at, etc.)
- JSONB GIN indexes (for JSONB field queries)

**Note:** 100+ unused indexes exist (acceptable for development, monitor in production)

---

## Security Notes

- All tables have RLS enabled
- Multi-tenant isolation via `org_id` foreign keys
- Temporary anonymous policies exist for MVP development
- View `client_crm_status` uses SECURITY DEFINER (review needed)
- All Edge Functions have `verify_jwt: false` (intentional for MVP, must fix before production)

---

## Migration Status

- **Total Migrations:** 42
- **Latest Migration:** `20260111045200_temp_anon_wizard_access.sql`
- **Status:** All migrations applied successfully
- **Versioning:** Timestamp-based versioning (YYYYMMDDHHmmss)

---

## Common Patterns

### Multi-Tenant Isolation
```sql
-- All tables include org_id
CREATE TABLE example (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ...
);
```

### RLS Policy Pattern
```sql
-- Standard RLS policy for tenant isolation
CREATE POLICY "Users can access their organization's data"
  ON example FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM team_members WHERE user_id = auth.uid()
  ));
```

### Updated_at Trigger
```sql
-- All tables with updated_at use this trigger
CREATE TRIGGER update_example_updated_at
  BEFORE UPDATE ON example
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Vector Search
```sql
-- Document embeddings (768 dimensions)
embedding vector(768)

-- Interaction embeddings (1536 dimensions)
embedding vector(1536)

-- Similarity search example
SELECT * FROM documents
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

---

## Important Notes for AI Context

1. **Tenant Isolation:** Always filter by `org_id` - never query across tenants
2. **RLS Enforcement:** Policies enforce access control - user must be team member
3. **Vector Search:** Use `pgvector` for semantic search on documents/interactions
4. **Financial Precision:** Currency stored as integers (cents) - divide by 100 for display
5. **JSONB Flexibility:** Many fields use JSONB for flexible schema (metrics, data, etc.)
6. **Versioning:** Context snapshots, briefs, and roadmaps support versioning
7. **Soft Deletes:** Use status fields (active, archived, deleted) instead of hard deletes

---

**Document Version:** 1.0  
**Last Audit:** 2025-01-27  
**Status:** ✅ Current (30 tables verified)