---
type: Decision
title: T3.5 reuses audited v5 no-autostart evidence
description: >-
  Option 1: bind audited v5 for H1/no-autostart and freshly probe only H2-H5
  under a no-absent-query boundary.
actor: codex-t35-option1-orchestrator
timestamp: '2026-08-04T18:05:01.584Z'
---
# Decision

The user selected architecture option 1 on 2026-08-04: revision 3 will bind the already audited v5 exact-host evidence for H1/no-autostart and will freshly probe only H2-H5.

This decision removes every fresh tmux action against an absent server/socket from the R6 execution obligation. It does not waive the no-autostart premise; that premise is carried only by the exact retained v5 evidence and its independent audit:

- `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`
- `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`
- `launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`
- `evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`
- `summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`
- byte-identical protected snapshots at `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`

The evidence remains research input, not a production acceptance oracle. Its audit limitations remain binding: no validated standalone schema, incomplete recomputability of canary/privacy claims, no retained historical all-process transcript, external campaign-time worktree continuity, and sampled PID/start/PGID signaling rather than a pidfd-like guarantee.

# Consequences

- No replacement Darwin supervisor is authorized or needed for this proof route.
- No fresh absent-server query, `new-session`, `kill-server`, recovery, or final read-only tmux action may run in R6.
- H2-H4 may use only preregistered direct clients targeting an exact currently live foreground server and owned socket generation.
- H5 is passive terminal continuity. Its no-autostart input is the retained v5 binding, not a new action.
- The revised exact boundary requires independent product/acceptance and adversarial-skeptic PASS before a builder may author a script.
- Script bytes then require another dual exact static PASS before execution; retained execution evidence requires independent audit before replacement-Plan synthesis.

# Goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: safely close the remaining T3.5 host-fact gap by reusing audited negative evidence and freshly proving only self-contained H2-H5 facts; this serves the ultimate goal by keeping an orphan-capable negative experiment out of the compaction-memory acceptance rail.

[tracked by](../tasks/pre-compact-multi-session.md)
