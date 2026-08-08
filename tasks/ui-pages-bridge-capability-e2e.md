---
type: Task
title: >-
  Bundle pages: e2e asserting a bridge:none page is denied through the real
  PageFrame plumbing
status: in_progress
priority: '3'
description: >-
  Implemented in draft PR #217 at ec4b421. The new browser test frames the real
  registered access:none About View and sends all six data-bearing v0 requests
  (hello, query, read, render-document, edges, subscribe) through the actual
  postMessage shell broker; every reply is FORBIDDEN and no seeded task content
  appears. Navigation remains separately allowed and tested. Validation: focused
  proof 1/1, full pages browser suite 14/14, UI type-check, and repository build
  all pass. Test-only; no runtime behavior changed.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T00:11:53.918Z'
---

