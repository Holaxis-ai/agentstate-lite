---
type: Task
title: 'UI v1: same-origin web UI over the deployed Worker (spike done, plan next)'
status: blocked
priority: '1'
description: >-
  PAUSED BY HUMAN VERDICT (2026-07-06, Mike): the v1 board UX is 'terrible' —
  the UI needs a rethink before ANY further UI investment; do NOT resume phase C
  (doc detail/admin/graph) or phase D without explicit human direction. WHAT'S
  BANKED and survives any UI rethink (commits e3ef115 + 4a0941a, STATUS item
  46): the ui command + loopback server, token/Host/CSP security, --dir
  in-process router + --remote key-injecting proxy (content-coding fix),
  deterministic gzip embed pipeline + budget gate, typed client + query layer +
  401/429 interceptor + 412-conflict mapping, Playwright harness, and the
  generic boardShape/conventions-derivation groundwork — all
  UI-framework-agnostic plumbing; only the React views are disposable. The
  rethink question connects to tasks/ui-generic-kinds (what IS the right human
  window onto a knowledge substrate — a kanban may be the wrong primitive).
  Priority focus as of now: the git-first transition of the team board
  (tasks/git-sharing Tier 0).
timestamp: '2026-07-06T16:10:56.312Z'
---
[context-notes/agentstate-lite/coordination/ui-v1-next-steps](../context-notes/agentstate-lite/coordination/ui-v1-next-steps.md)
