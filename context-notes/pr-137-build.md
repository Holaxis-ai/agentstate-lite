---
type: Context Note
title: 'PR #137 (home identity truth, PR-B) — build state'
actor: mike/claude
timestamp: '2026-07-21T16:57:17.731Z'
---
# Summary

PR-B shipped as PR #137 @ b3b10ee (branch feat/home-identity-truth): sharing chip over the 9-row truth table (CLI classifier ui/sharing.ts — LOCAL evidence only, no network; ui-server-owned shapes; SPA-owned words; both fabrication cases red-pinned; wrong-target guard), where-is-this disclosure (path leaves the identity block), collapsed workspaces block (catalog labels+paths, NO schema change), consumer-owned injection seam with TTL+as_of and SSE-driven config refetch. PR #135's six review follow-ups ride along. Stated deviation: sync runGit on TTL expiry instead of a parallel async git path (single-primitive reuse) — flagged for review.

Gates at the SHA: build/typecheck/workspace tests green; ui 114/114; ui-server 32/32; CLI truth-table battery 11/11 over real temp git repos; e2e 17/17. Visually smoked: private row + the repo's own board rendering a real 'shared · Holaxis-ai/agentstate-lite' chip, light+dark. Next: independent review of the exact SHA, then merge closes tasks/launcher-first-run-onboarding's DoD.
