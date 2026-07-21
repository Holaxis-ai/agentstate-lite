---
type: Context Note
title: 'PR #135 (home surface PR-A) — build state'
actor: mike/claude
timestamp: '2026-07-21T16:08:18.309Z'
---
# Summary

PR-A of plans/home-surface-build shipped as PR #135 @ 0ef76c3 (branch feat/home-surface-reshape, cut from post-#134 main): flat badged grid (Dashboards/Interactive/Documents retired), first-run orientation with per-root localStorage dismissal, live activity feed (debounced invalidate-and-refetch over SSE, conventions/registry filtered), token-contract gate (red-probed). Pure SPA — no new endpoints, no CLI changes. Gates at the SHA: build/typecheck/test green by own exit codes; ui suite 99 green; e2e 12/12 over the real built CLI incl. a live feed-update-without-reload probe. Teaching pin (empty state canonical View vocabulary) preserved. Next: independent review of the exact SHA (ordinary tier), then merge; PR-B (identity truth: sharing chip + workspaces) follows per the plan.
