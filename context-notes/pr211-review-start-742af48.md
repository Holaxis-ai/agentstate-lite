---
type: Context Note
title: PR 211 exact-SHA review start at 742af48
description: >-
  Independent review of the canonical user-scope vocabulary and global
  compatibility alias across skill and hook lifecycle surfaces.
actor: codex-pr211-reviewer
timestamp: '2026-08-07T00:21:39.979Z'
---
# Summary

Independent exact-SHA review start for PR #211, `fix(cli): make user the canonical install scope`, at head `742af48ee353a7f4bd68d33e588ac23401b6fde0` against base `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071`.

## Goals

- Ultimate goal: keep AgentState Lite a plain-text, local-first knowledge substrate whose CLI reduces avoidable onboarding friction without creating ambiguous behavior.
- Proximate goal: prove that `user` is the single public per-user installation vocabulary while `global` remains a behaviorally identical compatibility input across every skill and hook operation, receipt, help surface, and supported host.
- Service upward: one accurate vocabulary reduces newcomer decisions while preserving existing automation and target-selection safety.

## Acceptance under review

- `skill` and `hook` accept `user` for install, status, and uninstall.
- `global` selects exactly the same targets and normalizes receipts to `user`.
- Public help/onboarding teaches `project|user`, with only a concise compatibility note where useful.
- Default project behavior and target selection are unchanged.
- Installed-package and focused installer verification pass.

## Review method

The shared checkout is on unrelated branch `feat/init-create-only`; do not modify it. Fetch and inspect the exact PR ref in an isolated detached worktree, audit the complete base-to-head diff, test the cross-product of commands/scopes/hosts and malformed values, compare with exact-SHA CI, and record the verdict on the task.

[task](../tasks/user-scope-install-vocabulary.md)
