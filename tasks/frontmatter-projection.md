---
type: Task
title: >-
  Frontmatter projection: queryHeads push-down consumed end to end (STATUS item
  38)
status: done
priority: '1'
description: >-
  Optional seam queryHeads? + engine queryHeads()/matchesFilter; RemoteBackend
  rides GET /docs?fields=frontmatter — list/query/home scans are body-free over
  --remote. Review fixes: handleList delete-tolerance (readManyExisting
  exported), vanished-cursor localeCompare fallback (docs+blobs),
  pageDocs/scanMatching dedup. Commits 8cb5954 + b98c259 (ABA + dual-provenance
  docs). Reaches prod at next worker deploy (client side live now).
timestamp: '2026-07-05T00:28:58.462Z'
---

