---
type: Context Note
title: 'PR #54 exact-SHA re-review - 635520d'
actor: codex-reviewer
timestamp: '2026-07-14T16:47:36.719Z'
---
# Summary

Independent exact-SHA re-review evaluated commit 635520db3e6cf22bf752d51addddf36c5704384c in detached worktree /private/tmp/agentstate-lite-pr54-hardening-review-2. Verdict: FAIL with high confidence because a material raw-vs-normalized disagreement remains in manifest Page declarations.

Empirical probe: parseRecipeFiles accepted a definitions-only manifest whose pages[0].registry was " pages-registry/reviews.md " and whose pages[0].entry was " pages/reviews.html "; it returned ok true and normalized the targets to registry id pages-registry/reviews and entry pages/reviews.html. Source inspection identifies nonEmptyString as trimming both fields before Page grammar validation. This violates the acceptance condition that authored Page paths with surrounding whitespace are rejected rather than normalized, and it is adjacent to the two raw-vs-normalized defects fixed after c4245d9.

The exact worktree was clean and detached at the requested SHA. The delta from c4245d9 only changes packages/cli/src/recipe-source.ts and its tests for the prior registry-frontmatter and content-policy defects; it adds no padded manifest Page-path regression. Core was built only to satisfy the clean-worktree TypeScript probe. Broader checks were intentionally stopped because any material finding requires FAIL and this SHA is superseded.

AgentState MCP was unavailable. This note was written only to the existing dirty local .agentstate-lite board with AGENTSTATE_LITE_NO_AUTOPULL enabled; it was not synced.
