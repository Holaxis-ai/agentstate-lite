---
type: Task
title: Use user as the canonical skill and hook install scope
status: in_progress
priority: '1'
assignee: openai/codex
actor: openai/codex
description: >-
  PR #211 is open at exact SHA 742af48. Implementation makes user canonical
  across skill/hook/help/README/generated guidance/update verification,
  preserves global as a silent alias, and normalizes receipts to user. Focused
  tests: 132 passed. Full npm run check passed. Awaiting independent exact-SHA
  review and CI.
timestamp: '2026-08-06T13:21:26.299Z'
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
