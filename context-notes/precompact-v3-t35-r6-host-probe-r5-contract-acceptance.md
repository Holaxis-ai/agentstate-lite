---
type: Context Note
title: Revision 3 T3.5 R6 final host-probe repair-contract acceptance
actor: codex-precompact-v3-r6-repair-contract-acceptance-r5
timestamp: '2026-08-04T02:16:08.884Z'
---
# Summary

Status: in progress.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether the final exact R3 host-probe repair contract is implementable and mechanically reviewable without unresolved controller safety policy; this serves the ultimate goal by allowing one bounded builder attempt only after the premise-gathering rail is structurally safe.

Exact inputs read in full: `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c` and prior FAIL `context-notes/precompact-v3-t35-r6-host-probe-r4-contract-acceptance@sha256:16f78f9104432ee89b13a5b07483321114f0d6f80f14d5fcb4512d2446a09930`.

The final artifact explicitly adds both prior minimum repairs and expands the contracts for principal taxonomy, action trace bound, synchronous helpers, direct-handle termination, creator-relative unseen lifetime, and socket-generation adoption. Review is testing their interactions and terminal reachability. No candidate, source, skeptic, host, tmux, Claude, auth, Plan, task, code, or repository action is in scope.

[tracked by](../tasks/pre-compact-multi-session.md)
