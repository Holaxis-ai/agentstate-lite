---
type: Context Note
title: 'PR #177 current-head Chromium handoff'
description: >-
  Exact-SHA handoff to Brian for resolving the real-browser sizing evidence
  conflict and Codex initial-mount symptom.
actor: openai/codex
timestamp: '2026-07-29T16:10:39.912Z'
---
# Summary

Brian: please take ownership of the remaining empirical verification for PR #177. This is not a
request to repeat the repository gate or the JSDOM wiring test. The unresolved question is whether
the current exact PR head behaves correctly in a real browser after the parent has already applied
an earlier intrinsic-height report, and whether that explains the Codex host symptom Mike observed.

## Coordination and exact state

- PR: https://github.com/Holaxis-ai/agentstate-lite/pull/177
- Current remote head: `5f36f0e37425630f57d8720b49554863ca37834b`
- Your sizing follow-up: `5cf80553d4c9226736f96e6c7f789059d17d52b9`
- Prior Codex implementation head: `8c745776426d443c2f5bdeabc484d58b05d92743`
- Current-main parent merged into the PR: `cb396e4e549ad188115fb76e6c26dcf9465d669b`
- The broader task `tasks/mcp-durable-view-intrinsic-sizing` remains assigned to
  `openai/codex`, but Mike has explicitly asked that you take this verification/follow-up.
- Your completed `tasks/pr-177-fix-validation` and its notes remain useful evidence; this handoff
  narrows the one contradiction they did not conclusively settle.

## What your follow-up changed

`5cf8055` added a read-only `MutationObserver` over the generated document subtree. It schedules
the existing animation-frame-debounced measurement when DOM content changes without changing the
boxes observed by `ResizeObserver`. This is a sensible fix for overflow-only changes that otherwise
produce no measurement trigger. It does not change the measurement formula:

`max(html.scrollHeight, body.scrollHeight, html bounds height, body bounds height)`.

## Conflicting evidence to resolve

Your validation records:

- flexible reports `150 -> 900 -> 150`;
- fixed-host outer height stays 288 while the nested frame scrolls;
- MCP tests, full check, independent review, and exact-head CI all pass.

Separately, an independent reviewer tested prior head `8c745776` in real Chromium and found:

- a flexible View grew to 900;
- after the content contracted to 200, the View emitted no smaller height and remained 900;
- the suspected mechanism was that, once the parent enlarged the iframe, `scrollHeight` and
  document bounds were floored by the existing 900px viewport.

That reviewer passed the fixed-card probe: outer `clientHeight/scrollHeight` was `288/288`, the
nested frame was 236px high, child content was `236/1200`, and child scrolling advanced from 0 to
400.

The committed `frame-sizing.test.mjs` does not settle the contradiction. It replaces both
`scrollHeight` values and both bounding rectangles with a shared `window.__height`, so a scripted
decrease necessarily reports a decrease. It proves observer wiring and scheduling, but it does not
model a browser viewport flooring the observed document geometry. Because `5cf8055` adds a trigger
without changing the measurement formula, the exact current head needs one real-browser
grow/apply/shrink experiment.

There is also a user-visible initial-mount symptom to preserve in the evidence. In Codex Desktop,
Mike repeatedly saw the View render as a short clipped card without scrolling or interaction. In
an earlier run it became tall only after he scrolled the conversation away and back. That suggests
a host mount/visibility/rehydration timing path distinct from ordinary DOM growth. Do not treat a
grow/shrink-only result as proof that this observed symptom is fixed.

## Requested experiment

Run against detached exact head `5f36f0e`, using real Chromium layout rather than JSDOM or mocked
geometry:

1. Launch a flexible host (`maxHeight`, no fixed `height`) with generated content initially around
   150px.
2. Mutate the DOM so intrinsic content grows to about 900px.
3. Record every child height message and apply the reported height to the actual parent iframe,
   matching production behavior.
4. Mutate the content back to about 150-200px after the iframe has grown.
5. Record:
   - emitted height sequence;
   - applied iframe height after each message;
   - `html/body.scrollHeight`;
   - `html/body.getBoundingClientRect().height`;
   - actual content bounds independent of the viewport.
6. Separately probe initial mount while the MCP result is first inserted and while it is
   hidden/unmounted then made visible again. No user scroll or manual resize should be necessary
   for the first correct height report. If Codex itself cannot be automated, use the closest
   visibility/remount lifecycle available and state the limitation explicitly.
7. Retain the fixed-host 288px probe to ensure the outer shell does not scroll and the nested View
   remains internally scrollable.

## Decision rule

- PASS only if exact head `5f36f0e` reports and applies both growth and shrink in real Chromium,
  fixed height remains internally scrollable, and the first visible mount receives a usable height
  without interaction.
- If growth works but shrink does not, patch the intrinsic measurement so it is not floored by the
  previously applied iframe viewport. Keep measurement read-only and do not restore the
  observer/self-mutation loop.
- If grow/shrink works but initial visible mount remains short, treat mount/visibility scheduling
  as the remaining bug and patch that separately with a real-browser regression.
- Add the real-browser regression that fails before the correction and passes after it. Do not rely
  on the existing mocked-geometry unit as the acceptance proof.
- Re-run the focused MCP suite and the applicable exact-SHA gate after any patch. Keep PR #177
  draft until this experiment is recorded.

## Related board records

- `tasks/mcp-durable-view-intrinsic-sizing`
- `tasks/pr-177-fix-validation`
- `context-notes/pr-177-fix-validation-complete`
- `context-notes/pr-177-sizing-fix-review-5f36f0e`
- `context-notes/pr-177-sizing-system-model`

[handoff for](../tasks/mcp-durable-view-intrinsic-sizing.md)

[follows validation](../tasks/pr-177-fix-validation.md)
