---
type: Context Note
title: 'PR #177 sizing fix exact-SHA review — PASS'
actor: codex-pr177-reviewer
timestamp: '2026-07-29T14:35:15.078Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: 5f36f0e37425630f57d8720b49554863ca37834b
Current-main parent: cb396e4e549ad188115fb76e6c26dcf9465d669b
Fix parent: 5cf80553d4c9226736f96e6c7f789059d17d52b9
Prior PR head: 8c745776426d443c2f5bdeabc484d58b05d92743

No blocking or non-blocking issue survived independent exact-SHA review. This review validates the post-merge sizing correction without claiming or closing the open implementation task.

## Scope and integration

The combined diff from current main changes exactly four intended MCP sizing files: frame-sizing.ts, view.html, view.ts, and frame-sizing.test.mjs. The correction from the prior PR head to 5cf8055 changes exactly frame-sizing.ts and its regression test. The exact merge has no combined conflict-resolution delta; its second-parent changes are the already-current main PR 179 and plugin regeneration files. No unintended source, generated artifact, manifest, or plugin change appears in the feature-side combined diff. git diff --check passed.

## Survived attacks

- Overflow-only intrinsic growth and shrink are remeasured through a MutationObserver watching the document element subtree, even when ResizeObserver sees no box change.
- Mutation, resize, viewport, font-ready, and initial triggers share the same scheduled flag and animation-frame callback. Measurement only reads geometry and posts a message. It does not mutate the observed document, so the new observer cannot create its own mutation loop.
- An independent actual-MutationObserver probe produced heights 150, 900, 150 and then remained idle-stable.
- Unchanged heights are not reposted.
- Launch ID, epoch, nonce, current child-window source, finite-positive height validation, sandbox, CSP, and hidden durable-bridge boundaries remain unchanged.
- Fixed host height still removes any inline frame height and returns before intrinsic sizing is applied. The fixed shell retains hidden outer overflow and an internally scrolling flex child.
- Flexible sizing remains bounded by host maxHeight, shell chrome, and the product ceiling.
- The committed regression test wires MutationObserver, invokes its callback with a changed intrinsic measurement, asserts the observed target and full subtree options, and keeps the read-only no-style-mutation assertion.

## Evidence

- npm ci: passed
- npm run build: passed
- npm run typecheck --workspace @agentstate-lite/mcp-app: passed
- node --test --import ./packages/mcp-app/test/ts-loader.mjs ./packages/mcp-app/test/frame-sizing.test.mjs: 7 of 7 passed
- No-file JSDOM MutationObserver probe: 150 to 900 to 150, idleStable true
- git diff-tree --cc produced no combined merge delta
- Worktree remained clean at the exact SHA

Recommendation: safe to send to QA. Optional future hardening would move the no-file actual-mutation growth-and-shrink probe into the committed suite, but the current regression test directly proves observer wiring and the production behavior is independently verified here.
