---
type: Task
title: 'document-mutation: harden the shared write authority from the survivor map'
status: in_progress
priority: '2'
description: >-
  PR #105 is ready for independent review at exact commit
  bff2992a8e7274207827ca7f99632b3fc517b8e4. Test-only hardening of the shared
  document mutation authority: overwrite CAS/retry and final receipts,
  onAbsent:create races, retry budgets, non-ENOENT propagation, array-valued
  frontmatter equality, actor defaults, typed failures, and patch warning
  receipts. Scoped Stryker improved from 71.25% (113 killed, 1 timeout, 21
  survived, 25 no-coverage) to 97.50% (155 killed, 1 timeout, 4 equivalent
  survivors, 0 no-coverage). Full npm run check passed on the exact commit,
  including npm package proof, skill checks, and 14 UI E2Es. Production code is
  unchanged.
actor: mike/codex
timestamp: '2026-07-18T16:39:54.083Z'
---

