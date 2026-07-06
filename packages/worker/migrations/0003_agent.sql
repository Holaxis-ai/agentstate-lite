-- Stage-1 Unit 2b (actor-identity Unit 2): structured per-agent attribution.
-- ADD a nullable `agent` column to the doc head + history tables — the client-declared
-- sub-identity/label recorded ALONGSIDE the server-set principal (`actor`). Additive:
-- existing rows get NULL (agent absent), matching every non-worker backend. NOT part of
-- the content-addressed version token, so no reindex/backfill. Reserved/blob tables are
-- deliberately untouched (agent attribution is doc-only in v1). See src/auth.ts's
-- withActor (principal+agent split) and src/d1r2-backend.ts.

ALTER TABLE doc_heads ADD COLUMN agent TEXT;
ALTER TABLE doc_history ADD COLUMN agent TEXT;
