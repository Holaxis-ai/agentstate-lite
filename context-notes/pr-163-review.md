---
type: Context Note
title: 'PR #163 exact-SHA review'
actor: codex-reviewer-163
timestamp: '2026-07-26T16:32:37.622Z'
---
# Summary

Ultimate goal: make agentstate-lite a plain-text, offline-first, human-visible knowledge bundle and agent CLI whose write-time scaffolding preserves knowledge, attribution, and conflict safety across sessions and agents.

Proximate goal: independently review PR #163 at its exact head SHA for introduced correctness, contract, usability, and regression-test gaps; this serves the ultimate goal by keeping the human-facing and agent-facing behavior trustworthy at the merge gate.

Current orientation: the SessionStart board is current as of 2026-07-26. The prior `context-notes/pre-compact-main` snapshot is from 2026-07-24 and predates PR #163, so it is useful historical context rather than current unit state.

Verdict: CHANGES REQUESTED at exact head `8243dfd7b127d0469586693285ab72e303203e13` (base `639957c94081866d9d888a6d1921111912ff827d`).

## Findings

1. P1, empirical — panel 2 teaches setup commands that the supported distribution cannot run. The only currently supported install is the marketplace/plugin channel; its executable is intentionally not placed on PATH, and even when invoked through the bundled resolver it rejects `skill install` because that subcommand is npm-only. Running the exact checkout's marketplace wrapper with `skill install --scope project --json` exited 1 with the designed RUNTIME refusal. The npm package that would support `aslite skill install` remains unpublished. The same bare-invocation problem affects the later recipes/sync examples. Do not present these as copy-paste commands until the UI can expose a valid channel-aware invocation; the cross-channel path that works today is to ask the already-equipped agent.

2. P2, empirical — panel 3's `Next` button is reused as panel 4's `Got it` button. A double-click sends the first click to `Next`, React rebinds the same DOM node to `dismissOrientation`, and the second click immediately dismisses the walkthrough and writes the persistent dismissal before the reader can consume panel 4. A focused adversarial unit probe expecting panel 4 to remain visible failed; the stock 23-test Launcher suite passes because it only single-clicks. Use distinct controls and explicitly transfer focus, or otherwise prevent the activation that caused the transition from becoming a dismissal.

## Verification

- Fresh isolated detached worktree at the exact head, fresh `npm ci`.
- `npm run build`, UI typecheck, `git diff --check`, and the stock Launcher suite (23/23) passed.
- GitHub run `30208711262` is successful at the exact head: Node 20 built-CLI smoke plus Node 22/26 repository gates, including Chromium e2e.
- The adversarial double-click probe failed red as expected and was removed; the stock suite was rerun green and the worktree returned clean.
- Manual rendered/accessibility inspection was unavailable because no browser was attached to the in-app browser runtime. No unrelated browser automation surface was substituted.

Progress: review complete; two findings reproduced and exact-SHA evidence recorded. No repository source was changed.
