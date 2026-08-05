---
type: Context Note
title: 'Supported release check: compaction reorientation'
description: >-
  Current system model, goals, builder state, and unverified assumptions after
  compaction.
actor: codex-supported-release-check
timestamp: '2026-08-05T16:38:01.746Z'
---
# Summary

The supported-release check builder is implemented and is resuming at focused verification and full-diff audit; independent exact-SHA review remains the next release gate.

# Goal and current system model

Ultimate goal: make agentstate-lite a shared, versioned, conflict-safe Markdown memory that people can install and use without founder intervention.

Proximate goal: make npm release selection exact, bounded, and rollback-aware so the first contract prerelease can ship safely.

The running CLI owns an immutable local version identity. `aslite version --check` performs one read-only request to the fixed npm packument endpoint, selects only the requested supported dist-tag (`latest` or `next`), validates the selected release and canonical SHA-512 integrity, and compares exact strict-SemVer identities. The selected dist-tag is authoritative in both directions: a newer selection offers an upgrade and an older selection offers a rollback. All transport and metadata failures are normalized into the bounded `aslite.update-check.v1` result; no update is installed and no filesystem state is written. Ordinary `aslite version` remains local-only and byte-compatible.

Builder implementation is present, uncommitted, in worktree `/private/tmp/aslite-supported-release.H860lp` on `feat/supported-release-check`. Focused protocol tests, CLI typecheck, skill-reference checks, and a literal public-registry probe passed before compaction. The final test-only hardening added a wrong-length SHA-512 case, a fixed-request contract test, and exact ordinary-version byte assertion; these additions still need the focused suite rerun.

Unverified assumptions at this boundary: the latest test-only changes pass; the complete diff has no protocol drift; and the eventual committed SHA has not yet received the required independent review. Adversarial QA and the full repository gate must wait until that exact-SHA review.
