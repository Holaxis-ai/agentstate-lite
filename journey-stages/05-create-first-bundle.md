---
type: Journey Stage
title: Create the first real bundle
journey: journeys/new-user-to-recurring-value
order: '04'
lane: shared
readiness: works
criticality: core
description: Stage 04 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:52.392Z'
---
# Desired experience

The user describes what they want to manage and an agent creates an explicit local bundle in the
right visibility mode, with safe defaults and a clear location.

# Current experience

The CLI can initialize and establish local bundles, including in-tree and branch-backed operation,
but the product-level choice and newcomer wording still need consolidation.

# Acceptance criteria

- The user understands where the bundle lives and whether it is private or committed.
- The agent can establish it through a deterministic command.
- `aslite` immediately shows useful live state rather than an empty technical shell.

# Evidence

The repository itself and multiple founder bundles use the local-first establishment paths.

# Remaining gaps

Prove the journey from plain-language intent to the correct bundle mode with a new user.

[journey stage planned by](../roadmap-items/local-first-loop.md)

[journey stage implemented by](../tasks/npm-quickstart-onboarding.md)

[journey stage implemented by](../tasks/bundle-visibility-safeguard.md)
