---
type: Context Note
title: 'PR #177 fix validation complete'
description: 'Post-merge sizing fix, exact-SHA evidence, and final CI state for PR #177.'
actor: codex-pr177-validator
timestamp: '2026-07-29T14:57:01.200Z'
---
# Summary

PR #177 is fixed and updated at exact head
`5f36f0e37425630f57d8720b49554863ca37834b`. The branch now includes current `main` at
`cb396e4e549ad188115fb76e6c26dcf9465d669b`.

## Finding and correction

Chromium demonstrated that `ResizeObserver` alone does not report overflow-only content changes in
a fixed-box generated document: the body grew from 150px to 900px without a second height message.
The injected sizing script now uses a read-only `MutationObserver` as another trigger for the
existing animation-frame-debounced measurement. The existing launch/epoch/nonce and source-window
acceptance boundary is unchanged.

## Evidence

- Before correction: flexible reports stayed at `150` while body `scrollHeight` became `900`.
- After correction: flexible reports were `150 -> 900 -> 150`.
- Fixed-host probe: outer `clientHeight == scrollHeight == 288`; nested frame `scrollTop` advanced
  to 300 while outer `scrollTop` remained 0.
- MCP package suite: 41/41 passed.
- Independent review: pass, high confidence, no findings, recorded in
  `context-notes/pr-177-sizing-fix-review-5f36f0e`.
- Full local `npm run check`: exit 0 on exact SHA.
- GitHub run `30462784638`: Node 20 smoke passed; Node 22 and Node 26 full gates passed.
- Final GitHub state: PR open, draft, mergeable, exact head `5f36f0e`.

## Coordination

The validation/follow-up task `tasks/pr-177-fix-validation` is complete. The broader
`tasks/mcp-durable-view-intrinsic-sizing` task remains assigned to `openai/codex` because its
acceptance separately requires real Codex dogfooding; this validation did not close or take over
that task.

## Orchestration reflection

The generator-critic gate was effective: the independent reviewer checked the exact combined SHA
and independently reproduced the browser behavior. Reusing the prior QA agent leaked stale task
context into its first response, and its custom browser probe later hung. Both outputs were rejected;
the exact-SHA full gate evidence was retained, while the known-good probe and GitHub CI supplied the
remaining acceptance evidence.

For future reused-agent gates, the contract should explicitly invalidate prior assignments, name
the exact verification script or command up front, and reject any result that does not echo the
requested SHA and evidence schema.
