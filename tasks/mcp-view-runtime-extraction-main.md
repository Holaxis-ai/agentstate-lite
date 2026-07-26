---
type: Task
title: Extract the host-neutral trusted View action authority
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Draft PR #165 opened at exact SHA c8d7d9dd8c3fe05705e1d10979f778549847491e.
  Behavior-preserving unit: moved the existing View launch registry and trusted
  scalar-action authority 89% intact into private @agentstate-lite/view-runtime,
  added only a host-neutral launch-authority seam, and adapted ui-server as the
  sole current consumer. Existing public re-exports, endpoint behavior, error
  wording, confirmation/CAS/Kind/revocation semantics remain pinned. Explicitly
  excludes all MCP code and selection-envelope/action extensions. Focused
  view-runtime plus all 35 ui-server tests passed; full npm run check passed
  including browser 18/18; post-doc npm run test:scripts passed; no open PR or
  semantic collision with Brian's headless verifier.
actor: openai/codex
timestamp: '2026-07-26T18:07:26.808Z'
---

