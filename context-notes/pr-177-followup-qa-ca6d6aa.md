---
type: Context Note
title: 'PR #177 follow-up QA at ca6d6aa'
actor: codex-pr177-followup-qa
timestamp: '2026-07-29T16:44:20.838Z'
---
# Summary

Formal QA PASS at exact commit ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a. Confidence: high.

Ultimate goal: keep agentstate-lite dependable and make conversational Views immediately usable in real MCP hosts.

Proximate goal: independently validate the committed real-browser sizing acceptance path at the exact post-review candidate. This serves the ultimate goal by proving the fixed and flexible host contracts through the shipped repository gate.

## Evidence

- Initial git rev-parse HEAD: ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a.
- Fresh npm ci: exit 0; 439 packages installed from the lockfile.
- Unpiped elevated npm run check: exit 0.
- Focused MCP unit suite: 54/54 passed.
- Committed MCP Chromium suite: 3/3 passed — flexible grow/apply/shrink, hidden first mount plus visible remount without interaction, and fixed 288px outer-no-scroll plus nested scrolling.
- UI Chromium gate: 19/19 passed.
- Final git rev-parse HEAD: ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a.
- Final git status --short: empty.
- QA made no source changes, commits, merges, or pushes.

Independent exact-SHA review was provided as PASS before this QA stage.
