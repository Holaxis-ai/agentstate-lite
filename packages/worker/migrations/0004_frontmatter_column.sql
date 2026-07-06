-- 0004: doc_heads gains a nullable `frontmatter` column (JSON-serialized parsed
-- frontmatter, stored at write time) so head scans (`queryHeads` → GET /docs) are
-- served from D1 alone instead of one R2 GET per doc per page.
--
-- Nullable BY DESIGN: pre-0004 rows cannot be backfilled in SQL (their frontmatter
-- lives inside markdown bytes in R2). A NULL row is served by R2 read-through in
-- `D1R2Backend.queryHeads` and the column self-heals on that doc's next real write.
-- 0001-0003 are untouched.
ALTER TABLE doc_heads ADD COLUMN frontmatter TEXT;
