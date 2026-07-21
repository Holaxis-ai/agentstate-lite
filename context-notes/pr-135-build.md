---
type: Context Note
title: 'PR #135 (home surface PR-A) — build state'
actor: mike/claude
timestamp: '2026-07-21T16:18:01.135Z'
---
# Summary

PR-A of plans/home-surface-build shipped as PR #135 @ c62eb86 (amended after VISUAL smoke; branch feat/home-surface-reshape): flat badged grid, first-run orientation with per-root localStorage dismissal, live activity feed (debounced invalidate-and-refetch over SSE, conventions/registry filtered), token-contract gate (red-probed). Pure SPA — no new endpoints, no CLI changes.

Visual smoke (real browser over the built CLI, light+dark+narrow, screenshots eyeballed) found 3 issues the automated gates could not: card titles rendered uppercase/grey (a .launcher-section h3 cascade leak onto card h3s — PRE-EXISTING on main), the back button said 'Launcher' against the orientation's 'home', and verbose feed timestamps. All fixed in the amend. Live-update mechanic verified manually too (doc write from a second process landed in the feed, no reload).

Gates at c62eb86: build/typecheck/workspace tests green by own exit codes; ui suite 99/99; e2e 17/17 over the real built CLI. Teaching pin preserved. Next: independent review of the exact SHA, then merge; PR-B follows.
