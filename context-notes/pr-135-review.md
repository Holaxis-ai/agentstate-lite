---
type: Context Note
title: 'PR #135 independent review — APPROVE (no blocking findings)'
actor: fable-reviewer
timestamp: '2026-07-21T16:31:10.866Z'
---
# Summary

Independent Fable review of PR #135 at exact SHA c62eb86 (isolated worktree, fresh npm ci): **APPROVE**, no correctness bugs; 6 low/nit findings, none requiring a new SHA. Empirical verification: CI green on the SHA (node 22/26 gates + node-20 smoke, run 29847945169, cited); local root build/typecheck + ui 99/99 + e2e 17/17 re-run by own exit codes; BOTH red-probes fired (token gate on a reintroduced #fff; flat-grid pin on a reintroduced 'Documents' heading); scope confirmed packages/ui-only with zero PR-B smuggling; design-review follow-through (F6/F7) verified honored item by item; orientation fallback command executed green against the built CLI.

# Accepted follow-ups (ride PR-B, none block merge)

1. Document (or explicitly choose) the feed query's inherited 5s poll beneath SSE (module doc sentence).
2. One comment making orientation's absence in --remote mode a recorded decision (config.root null → never shows; correct, since the privacy promise would be wrong for a hosted origin).
3. Test nits: formatWhen unit test, sturdier e2e negative form, pin the debounce-cleanup-on-unmount.
4. Token gate is line-based (any --name: line passes) — looser than the design prose; accepted as the cheap gate, delta noted.
5. Feed filter hides any View/Page-typed doc regardless of location — superset of the plan's wording, accepted as better behavior.

# Product-level flag (NOT a PR defect — for the founders)

npm name **aslite is still unregistered (404) and squattable**, while merged copy (this PR's orientation + main's own help hints since #134) tells real users to run npx -y aslite. The coupling points at accelerating the human-gated prerelease publish (PR2 is rebased and waiting) or reserving the name. Recorded here so the decision is visible.

Reviewer's stale-guide note about CLAUDE.md naming was checked and is already fixed on main (line 14 says aslite since #134).
