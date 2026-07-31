---
type: Task
title: Transfer marketplace invariants to npm gates
status: todo
priority: '1'
description: 'Implement G10: test-only provenance inventory and surviving npm safety gates.'
actor: openai/codex
timestamp: '2026-07-31T21:26:29.487Z'
---
# Goal

Transfer every surviving marketplace distribution invariant to named npm identity/verifier/release gates before deletion. This is G10.

# Acceptance

- Before/after inventory maps each plugin build/drift/version/resolver check to a surviving gate or explicit obsolescence.
- Reviewer traces representative provenance and forces at least one retained gate red.
- Test-only unit changes no runtime behavior.

# Gate

Test Builder → independent provenance Review → representative red probe → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](self-discovered-upgrade-proof.md)
