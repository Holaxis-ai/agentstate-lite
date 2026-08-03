---
type: Context Note
title: Revision 3 T2 Claude adapter and installer builder
actor: codex-precompact-v3-t2-builder
timestamp: '2026-08-03T20:18:14.383Z'
---
# Summary

Final single-surface Revision 3 T2 repair is complete at exact commit `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854`.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make install and status consume one readiness-reason projector; this serves the ultimate goal by preventing truthful host-state semantics from drifting across CLI surfaces. Status: complete and ready for exact-SHA re-review.

## Exact evidence and repair

- Rejected parent: `04dd17a4759e125f94dd143dccdc5ca012c68770`.
- Review: `context-notes/precompact-v3-t2-review-r3@sha256:50b14406da0a6565c85a50a57a63db996581d09ddb877ca8ab2efca19dd2df49`, verdict FAIL, confidence 0.99.
- Repair commit: `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` on `feat/precompact-v3-t2` in `/private/tmp/aslite-precompact-v3-t2.By2PrC/repo`.
- One total `claudeRailReason` function now maps helper failure and every `ClaudeHostState`; both install and status call it. The install-only duplicate conditional was removed.
- A regression executes temporary-root install followed by status and requires identical `not_installed` / `rail_ready:false` / `HOST_NOT_INSTALLED` projections.

## Verification

- Regression-first: the new install/status agreement test failed against `04dd17a` because install returned `INSTALLED_HOST_UNVERIFIED`; it passes after centralization.
- Focused lifecycle/install/status plus existing session-start tests: 72 pass, 0 fail.
- `npm run typecheck -w @holaxis/aslite`: PASS.
- `npm run build`: PASS.
- `git diff --check`: PASS.
- User-global audit: `~/.claude/settings.json` remained `sha256:1d0b7b85ee477312a1bfcc2999ded9678f02e5b00df1d7b1c96edf6f388459e5`; `~/.codex/config.toml` remained `sha256:9eceda823acad96291f7e1cf45af59a236f0ac586970469d9160885be5875063`; absent `~/.codex/hooks.json` and OpenCode managed plugin remained absent.

## Coordination and next action

No task document was edited and no `aslite sync` was run. Next action: independent exact-SHA re-review of `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` before T3 integration.
