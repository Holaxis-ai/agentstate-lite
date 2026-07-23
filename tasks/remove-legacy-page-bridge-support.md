---
type: Task
title: 'Phase 3: remove legacy Page/pages-*/bridge read paths from code'
status: blocked
priority: '3'
assignee: ''
description: >-
  Per decisions/legacy-deprecation-path. BLOCKED on phase 2: the status
  legacy-stock audit must read zero across ALL known bundles first. Scope: drop
  Page from PAGE_TYPE_NAMES, drop the pages-registry//pages/ prefixes from the
  grammars, drop the bridge-field fallback from declaredAccessValue, remove the
  dual-read tests and replace them with rejection pins (a legacy doc should get
  a CLEAR error pointing at the migration, not silence). Keep: bridge-named
  internals and the wire-protocol identifier (see the decision doc). HIGH-RISK
  tier: this deletes accepting paths on a security boundary.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T21:00:59.928Z'
---
[depends on](migrate-legacy-page-bridge-stock.md)
