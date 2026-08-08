---
type: Task
title: Guard unsupported OKF authoring-version claims
status: done
priority: '1'
description: >-
  Implemented in draft PR #220 at db40b91: one core authoring-version authority,
  early CLI validation, and default/0.1/0.2/future/blank acceptance coverage.
  Red-before proof and full repository gate pass; independent exact-SHA review
  remains before merge.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T01:10:33.320Z'
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
