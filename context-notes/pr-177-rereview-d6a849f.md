---
type: Context Note
title: 'PR #177 revised fresh-launch exact-SHA re-review — PASS'
actor: codex-pr177-rereview-d6a849f
timestamp: '2026-07-29T18:53:42.335Z'
---
# Summary

Independent read-only re-review of exact revised head
`d6a849f416bbf2910fa3d83cf7f8e629cf623bc7`, parent
`c5e8a743b40198c0eb7f09feb19bb727647a0baf`, with the combined unit reviewed from
`ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a`.

**Verdict: PASS — no blocking findings.** All three findings from
`context-notes/pr-177-review-c5e8a74` are resolved in current behavior and have focused browser
regressions. This exact SHA may advance to the separately required adversarial QA stage.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: determine whether `d6a849f` fully resolves old-result replay, repeated
visibility-generation, and stale display-context ordering without introducing unbounded
tombstones or lifecycle regressions. This serves the ultimate goal by making fresh-remount
recovery both usable and fail-closed before QA.

# Prior finding resolution

## High replay finding — resolved

`packages/mcp-app/src/view.ts:374-387` now rejects:

- any durable payload whose launch ID has been retired; and
- any ordinary payload replay carrying the same durable launch ID already current in this App.

The same-current guard acts during quarantine before the old launch is closed. Closure records the
ID synchronously before awaiting the app-only close call (`view.ts:139-158`), so later replay stays
rejected even when the network close is delayed or fails. The prior path into
`renderDurablePayload()` can no longer clear suspension and resume the old baseline.

The regression at `packages/mcp-app/test/frame-sizing.browser.spec.ts:412-446` replays the original
authorized result once while resume is held and again after the old launch is retired. The fresh
candidate remains mounted and is not closed.

## Repeated H→V generation finding — resolved

The hidden handler now advances `frameEpoch` on every hidden transition, including when the same
launch remains quarantined (`view.ts:862-873`). Therefore any in-flight resume from a preceding
visible interval fails the epoch guard, its learned candidate closes, and the final visible state
starts one request for the newest generation.

The regression at `frame-sizing.browser.spec.ts:386-409` specifically runs
`H→V→resume-start→H→V→resume-result`: request 3 is rejected/closed and request 4 is started and
adopted. The implementation also correctly handles response-while-hidden, duplicate visible
events, and additional repeated H/V cycles by the same epoch/single-flight rules.

## Stale display-context finding — resolved

`applyHostContext()` advances a display-only revision only when the partial host context actually
contains `displayMode` (`view.ts:635-649`). `changeDisplayMode()` captures that revision and
applies its request result only if no newer display-mode context arrived (`view.ts:705-721`).
Theme/font/container-only partial updates do not suppress a valid result. A later host-context
update naturally wins after an earlier request result.

The regression at `frame-sizing.browser.spec.ts:448-471` holds a fullscreen result, publishes
newer fullscreen and then inline host contexts, and proves the delayed result cannot overwrite
the final inline state/button.

# Tombstone bounds and semantics

The retired-ID set is bounded FIFO at 256 (`view.ts:75-76,139-150`). At the current exact SHA this
matches `PageLaunchRegistry`'s FIFO maximum of 256
(`packages/view-runtime/src/index.ts:71-73,96-102`). Recording happens before the close call.
Consequently, after enough server-issued replacement launches to evict an old local tombstone,
that old launch has already been revoked by a successful close or evicted by the server registry
bound; replay cannot recover its old subscription baseline. Until eviction, the local tombstone
blocks rendering directly.

This is bounded and safe for the present implementation. It is not an authorization store:
unchanged exact-byte authorization continues to be recomputed server-side for each fresh launch.

# Verification sampled

- Four focused Chromium lifecycle tests passed:
  fullscreen/inline rotation, repeated visibility generation, replay quarantine/retirement,
  delayed display context, and awaited teardown.
- Two sampled MCP server tests passed: fixed contract/app-only visibility and fresh current-byte
  authorization recomputation.
- MCP App typecheck passed.
- Combined exact diff whitespace check passed.
- Worktree remained clean.

# Residual risks for QA / future maintenance

- The client tombstone bound and the private server launch bound are duplicated magic numbers, not
  one exported authority or an agreement test. They match now, but future drift could weaken the
  close-failure argument. A small shared constant/agreement test would make the invariant
  machine-owned; this is not a current-SHA failure.
- The focused display test covers a stale successful result. A request rejection after newer host
  context still changes the shell status text to an error (`view.ts:722-727`) although it does not
  overwrite host display state, launch authority, or the correct button. QA should decide whether
  that copy behavior warrants a follow-up.
- The focused replay test covers direct structured-result replay. The text-only claim path remains
  one-shot and server-resolves only a still-existing launch; after successful close it fails
  closed. A rare close-transport failure plus a previously unused claim is bounded by server
  currentness/registry lifetime and is a useful QA probe, not evidence of baseline reuse in the
  reviewed path.
- As already documented, a resume response lost during hard unmount can leave an unseen read-only
  candidate until TTL/cap/process exit.

[prior review](pr-177-review-c5e8a74.md)

[plan](../plans/pr-177-fullscreen-fresh-launch-resume.md)

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)
