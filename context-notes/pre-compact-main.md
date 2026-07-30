---
type: Context Note
title: 'Current main-agent checkpoint: PR #177 Claude follow-up'
actor: codex-pr177-followup
description: >-
  Post-compaction recovery checkpoint for the cache-identity follow-up and
  separately reviewed hidden-lifecycle defect.
timestamp: '2026-07-30T00:05:37.223Z'
---
# Summary

## Goals

- **Ultimate goal:** Make agentstate-lite a reliable local-first collaboration substrate whose
  conversational MCP Views behave correctly across supported hosts and whose work state survives
  agent/session boundaries.
- **Proximate goal:** Ship the PR #177 Claude Desktop follow-up as one reviewed cache-identity
  repair, then handle the independently discovered hidden-lifecycle defect as a separate unit.
- The proximate goal serves the ultimate goal by making exact View bytes selectable and testable
  in real hosts without conflating an unrelated lifecycle policy change.

## Skills and instructions active

- Loaded and applied: `holaxis-self-awareness`, `holaxis-cognitive-ecosystem`,
  `agentstate-lite:agentstate-lite`.
- `holaxis-orchestrator` was loaded before required reviewer/QA agent coordination.
- `openai-docs` was loaded only for the later Codex lifecycle-hook discussion.
- `CLAUDE.md` is authoritative. Code work must use isolated worktrees, one coherent claim per PR,
  parent-red tests, independent Review before QA, full gates, feature-branch push, and no agent PR
  creation.
- Board/task/knowledge writes use only this agentstate-lite bundle and `aslite sync`.

## Current system model and evidence

- Merged PR #177 exact head `13fcc2c` rendered and authorized in Claude Desktop but could remain at
  the initial graph-loading state while server logs showed no app-only bridge calls.
- A unique diagnostic resource URI at current main `77c84e4` loaded the live Roadmap immediately in
  Claude Desktop. Visible trace showed the outer document remained visible throughout startup; the
  server log showed child bridge calls and sustained polling.
- Therefore the field incident is stale host reuse/cache under the mutable resource identity
  `ui://agentstate/view-host/v1.html`, not an initially-hidden Claude activation.
- Candidate `91a0cbe` correctly changed the resource identity to a full content-derived SHA URI and
  had parent-red unit provenance plus green focused/full checks.
- The same candidate also attempted the separately proven hidden-first-mount lifecycle repair.
  Independent review rejected the combined candidate:
  1. It violates the repository's one-coherent-claim rule by combining cache identity with a
     separate hidden-lifecycle defect.
  2. It introduces a blocking replacement regression: mounted authorized A -> hidden -> authorized
     replacement B calls `clearFrameDocument()` after B becomes current; the intentional
     `about:blank` load is treated as hostile navigation, so B is retired/closed and cannot resume.
- Exact review record:
  `context-notes/claude-bridge-code-review-91a0cbe`.

## Durable work state

- `tasks/claude-desktop-durable-bridge-initialization`: `in_progress`, actor
  `codex-pr177-followup`. This is the cache-identity field fix and requires exact uninstrumented
  Claude validation.
- `tasks/mcp-app-hidden-authorized-first-mount`: `in_progress`, actor
  `codex-pr177-followup`. This is a separate lifecycle unit.
- Existing rejected combined worktree:
  `/private/tmp/aslite-claude-bridge-fix`, branch
  `fix/claude-desktop-durable-bridge-init`, exact `91a0cbe`.
- Diagnostic worktree:
  `/private/tmp/aslite-claude-bridge-probe`, detached `77c84e4`.
- Main working tree has a user-owned `.gitignore` modification; do not touch it.
- Claude Desktop is currently configured to the unique diagnostic probe server; restore or replace
  that entry only when preparing the exact accepted candidate.

## Next actions

1. Create a clean cache-only worktree/branch from current `origin/main`.
2. Apply only `server.ts` and `server.test.ts` content-derived resource-identity changes, including
   the reviewer's missing assertion that the resource response URI equals the exported hash URI.
3. Prove parent-red and candidate-green, run the relevant full gates, commit, independently review,
   then adversarially QA the exact cache-only SHA.
4. Build that exact SHA, configure Claude Desktop to a uniquely named server, and ask Brian to run
   the uninstrumented Roadmap validation. Record and close the cache task only after it passes.
5. Separately create a lifecycle branch. Add the mounted-A -> hidden -> replacement-B parent-red
   regression before changing the intentional-clear/navigation-guard state machine. Review and QA
   that exact unit independently.

## Unverified assumptions and blockers

- The cache root cause has strong field evidence but final acceptance still needs uninstrumented
  exact-SHA Claude Desktop validation using the production content-derived URI.
- The correct cross-browser representation of an intentional iframe clear has not yet been
  designed. It must remain safe both when clearing emits a `load` event and when it does not.
- No code candidate is currently approved for QA. `91a0cbe` is changes-requested and must not ship.
