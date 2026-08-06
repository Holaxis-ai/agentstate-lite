---
type: Task
title: Make advisory actor identity persist across shell sessions
status: todo
priority: '2'
description: >-
  First-use follow-up: provide an explicit local, gitignored actor configuration
  while preserving CLI/env precedence and advisory-only semantics.
actor: openai/codex
timestamp: '2026-08-06T14:31:48.468Z'
---
# Problem

`AGENTSTATE_LITE_ACTOR` provides a useful advisory attribution default, but exporting it in every new shell adds recurring setup friction. The completed environment-default task intentionally did not choose a durable local configuration mechanism.

# Scope

- Design one explicit, local, gitignored way to persist the advisory actor label across shell sessions.
- Preserve the existing precedence contract: explicit `--actor` remains strongest and absence remains valid.
- Keep actor labels advisory metadata, never authentication or authorization credentials.
- Avoid silently reading arbitrary project `.env` files or introducing a second general configuration system without an explicit decision.

# Acceptance

- A user can configure an actor once on their machine and receive consistent attribution in later shells.
- Project-local privacy, file permissions, discovery precedence, blank-value handling, and receipts are documented and tested.
- Existing `--actor` and `AGENTSTATE_LITE_ACTOR` behavior remains backward compatible.
- No durable actor configuration is written into the shared bundle or code branch by default.

[First-use evidence](../context-notes/first-use-feedback-2026-08-06.md)

[Builds on the shipped environment default](actor-env-default.md)
