---
type: Task
title: Use user as the canonical skill and hook install scope
status: in_progress
priority: '1'
assignee: openai/codex
actor: codex-pr211-reviewer
description: >-
  INDEPENDENT REVIEW PASS at exact PR #211 head
  742af48ee353a7f4bd68d33e588ac23401b6fde0: no findings. Current main is
  dc341159 after PR #210; the clean prospective merge was tested explicitly
  because both branches touch hook code. Exact-head focused tests passed
  150/150; integrated focused tests passed 156/156; built-CLI scope matrix
  passed 18 lifecycle receipts plus 8 invalid inputs; full npm run check passed
  on the integrated tree; hosted Node 20/22/26 checks are green on the original
  base. Technically merge-ready without a rebase. If rebased or otherwise
  changed, require a short exact-SHA confirmation review before Brian's merge.
timestamp: '2026-08-07T00:31:11.974Z'
---
# Problem

A newcomer reasonably used `--scope user` for Agent Skill installation and the CLI rejected it because the public vocabulary exposes `project|global`, even though `global` writes only to the current user’s configured host directories. This is avoidable friction in the core npm onboarding journey.

# Scope

Make `user` the canonical public spelling for skill and hook install/status/uninstall. Preserve `global` as a silent compatibility alias mapped to the same per-user targets. Update command help, generated skill guidance, README surfaces, and agreement tests. Keep the default project scope and all target-selection behavior unchanged.

# Acceptance

- `skill` and `hook` accept `--scope user` for install, status, and uninstall.
- `--scope global` continues to resolve to the identical targets.
- Help and onboarding copy teach only `project|user`, with one concise compatibility note where appropriate.
- Receipts describe the canonical user scope without creating a second behavioral mode.
- Installed-tarball and focused installer tests pass.
