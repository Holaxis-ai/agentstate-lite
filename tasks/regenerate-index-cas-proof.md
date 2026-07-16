---
type: Task
title: Pin regenerateIndex conflict and create-race behavior
status: todo
priority: '2'
description: >-
  Add the missing deterministic proof for the reserved-index CAS boundary while
  preserving its one-scan self-healing policy.
actor: mike/codex
timestamp: '2026-07-16T02:51:41.533Z'
---
# Behavioral claim

`regenerateIndex` proves its documented reserved-file CAS behavior under a deterministic intervening index writer and first-create race, without changing the deliberate one-scan/self-healing policy for concurrently changed concept documents.

# Scope

- Add adversarial engine tests that inject a competing `index.md` write after the read and before the CAS write.
- Cover both an existing-index conflict and an absent-to-concurrently-created index race.
- Prove the retry preserves the root `okf_version` from the fresh index head and returns the actual final content it wrote.
- Keep the concept list/read scan outside the retry loop; a concept changed during that scan remains an explicitly accepted, self-healing staleness case.
- Change runtime code only if the tests demonstrate a real violation.

# Verification

- New tests fail against a stale-decision or unconditional-write implementation and pass against the current intended boundary.
- Core mutation/backend suites remain green.

[identified by](../designs/mutation-boundary-audit.md)
