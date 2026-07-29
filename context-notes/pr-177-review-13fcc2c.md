---
type: Context Note
title: 'PR #177 late-rejection exact-SHA review — PASS'
actor: codex-pr177-review-13fcc2c
timestamp: '2026-07-29T19:10:35.495Z'
---
# Summary

Independent read-only review of exact revised head
`13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2`, parent
`d6a849f416bbf2910fa3d83cf7f8e629cf623bc7`, after the adversarial QA finding in
`context-notes/pr-177-qa-d6a849f`.

**Verdict: PASS — no blocking findings.** The stale-rejection suppression is narrowly scoped to
the one state in which newer host context already says the requested display mode was achieved.
Still-relevant rejections remain visible. The new browser regression reproduces the QA sequence
through the real `AppBridge`, and the combined head retains the prior replay, repeated-visibility,
and stale-success corrections.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: verify that late display-request rejection is suppressed only when newer host
context already establishes the requested mode, while relevant failures remain visible and all
prior fresh-launch fixes remain intact. This serves the ultimate goal by keeping host presentation
status truthful without coupling it to durable authority.

# Narrow correction review

`changeDisplayMode()` captures `displayModeContextRevision` and the requested `target`. Its catch
path suppresses the error only when both are true:

1. a display-mode host-context notification arrived after the request began; and
2. the latest merged host context reports exactly the requested target mode.

Location: `packages/mcp-app/src/view.ts:705-735`.

The relevant truth table is:

| Context after request began | Latest host mode | Rejection handling |
|---|---|---|
| none or non-display-only update | unchanged | report error |
| display update | requested target | suppress stale error |
| display update | original/different mode | report error |
| target update, then original | original | report error |
| original update, then target | target | suppress stale error |

This does not hide a still-relevant failure: without a newer display revision the predicate is
false, and when the latest host state does not equal the requested target it is also false. An
independent host transition that happens to achieve the target makes the request error obsolete
for status purposes, which is the desired user-visible result.

The branch mutates neither `currentHostContext` nor any durable lifecycle state. Suppression simply
preserves the existing trusted-shell status; the host context remains the display authority and
the button continues to derive from it. The `finally` path still re-enables the control.

# Regression adequacy

The new regression at
`packages/mcp-app/test/frame-sizing.browser.spec.ts:473-505`:

- begins from an authorized live durable View with an established status;
- holds a real SDK display request;
- publishes newer host context reporting fullscreen;
- rejects the older request through `AppBridge`;
- proves the button remains `Return inline`; and
- proves live View status is preserved and the stale rejection is absent.

This directly reproduces the empirical QA failure. The inverse/error-visible branches are simple
predicate complements and retain the pre-change catch behavior; an additional table test would
improve mutation resistance but is not required to establish correctness of this narrow patch.

# Prior-fix reconfirmation

- Old result replay guards remain unchanged at `view.ts:374-387`.
- Retired IDs are still recorded before close at `view.ts:139-158`.
- Every hidden transition still advances the resume epoch at `view.ts:867-878`.
- Delayed successful display results still yield to newer host context at `view.ts:705-721`.
- Display bookkeeping remains independent of authorization, polling, subscription, bridge, and
  frame authority.

# Verification sampled

- Focused Chromium review set: 4/4 PASS — fullscreen/repeated visibility, replay, stale successful
  result, and stale rejected result.
- MCP App typecheck: PASS.
- Combined `ca6d6aa..13fcc2c` whitespace check: PASS.
- Worktree remained clean.

# Residual risks

- A request rejection may be reported before a later host-context success arrives; the later
  context corrects the button but does not clear the already-rendered error copy. This ordering was
  not the QA defect or reviewed acceptance row and does not affect display or durable authority.
- The previously documented 256-entry client/server bound-drift risk and hard-unmount candidate
  TTL debt remain unchanged.
- The separately required adversarial QA and real ChatGPT Work Expand → Return-inline dogfood still
  gate completion.

[qa finding](pr-177-qa-d6a849f.md)

[prior review](pr-177-rereview-d6a849f.md)

[plan](../plans/pr-177-fullscreen-fresh-launch-resume.md)

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)
