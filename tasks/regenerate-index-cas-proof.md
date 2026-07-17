---
type: Task
title: Pin regenerateIndex conflict and create-race behavior
status: done
priority: '2'
description: >-
  Shipped in PR #84: deterministic existing-index and create-race proofs confirm
  regenerateIndex retries against the fresh head, preserves root okf_version,
  returns persisted content, and retains the deliberate one-scan/self-healing
  policy. No runtime change was required.
actor: mike/codex
timestamp: '2026-07-17T02:29:46.422Z'
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

# Implementation status

Draft PR [#84](https://github.com/Holaxis-ai/agentstate-lite/pull/84) adds the two deterministic
race proofs without changing runtime code. The tests pass against the current guarded implementation
and fail when the index write is temporarily made unconditional. The full repository gate is green.
