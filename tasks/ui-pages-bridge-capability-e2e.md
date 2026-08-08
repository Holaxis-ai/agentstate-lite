---
type: Task
title: >-
  Bundle pages: e2e asserting a bridge:none page is denied through the real
  PageFrame plumbing
status: done
priority: '3'
description: >-
  Completed in PR #217 (merge 264a1e0) on 2026-08-07. The browser suite now
  frames the real registered access:none About View and sends all six
  data-bearing v0 requests through the actual postMessage shell broker; every
  reply is FORBIDDEN and no seeded task content appears. Navigation remains
  separately allowed and tested. Test-only: no runtime behavior changed. Author
  validation passed (focused 1/1, full pages suite 14/14, UI type-check,
  repository build) and all GitHub gates passed.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T00:18:35.947Z'
---

