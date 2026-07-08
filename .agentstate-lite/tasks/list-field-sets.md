---
type: Task
title: >-
  list --field set membership: comma = OR within a field (open tasks in one
  query)
status: done
priority: '2'
description: >-
  SHIPPED in PR #20 (merge e7a1531, plugin 1.0.22). Comma = OR within a field
  (--field status=todo,in_progress), AND across fields unchanged. Single-value
  rides core push-down byte-identically; multi-value is a CLI post-filter
  reusing core matchesFilter — one coercion, two paths; cold review verified
  remote parity byte-identical. Deliberate behavior change: bare --field status=
  (empty value) is now a loud USAGE exit 2 with tailored wording instead of a
  silent count:0 (a silent zero on a typo is a false negative for agents);
  pinned both ways. Full loop: Sonnet builder, Fable cold reviewer detached on
  the exact sha (first exercise of that convention), verdict MERGE, one fix
  package.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-08T23:17:55.430Z'
---

