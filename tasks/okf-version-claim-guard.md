---
type: Task
title: Guard unsupported OKF authoring-version claims
status: todo
priority: '1'
description: >-
  Prevent init and other write entry points from declaring OKF versions the
  current writer cannot honestly produce.
actor: openai/codex
timestamp: '2026-08-05T02:15:43.984Z'
---
# Problem

`init --okf-version 0.2` currently succeeds even though AgentState's writer emits v0.1 timestamp and
actor semantics and Kind-specific workflow values under the globally meaningful `status` field.
That turns a free-form flag into a false conformance claim.

# Scope

- Define the explicit set of versions AgentState can author today.
- Reject unsupported or unknown write-version requests before creating any files.
- Keep reading and transporting newer bundles permissive; this guard is about authoring claims, not
  refusing data.
- Cover the default, explicit v0.1, explicit v0.2, and unknown-version cases with deterministic CLI
  tests.
- Ensure failure leaves no partially initialized bundle.

# Acceptance

- A user cannot create a bundle declaring a version the current writer does not support.
- Existing v0.1 initialization behavior is unchanged.
- The error states the supported authoring version and does not imply that v0.2 is unreadable.

# Evidence

See [the compatibility audit](../research/okf-v0-2-compatibility-audit.md) and
[migration design](../designs/okf-compatibility-and-upstream-stewardship.md).
