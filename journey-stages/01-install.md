---
type: Journey Stage
title: Install AgentState Lite from npm
journey: journeys/new-user-to-recurring-value
order: '01'
lane: shared
readiness: works
criticality: core
description: Stage 01 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:51.464Z'
---
# Desired experience

The user runs one documented npm command and receives a working `aslite` executable with no plugin
cache knowledge or repository checkout.

# Current experience

The npm prerelease exists and the executable path has been proven, but the first supported release,
documentation cutover, and clean-newcomer install proof are still active work.

# Acceptance criteria

- A clean supported machine installs the current supported release from npm.
- `aslite` is available by its short name in a new terminal.
- The user is shown the next onboarding action.

# Evidence

The prerelease and bootstrap path have been exercised by the founders.

# Remaining gaps

Complete the supported-release and newcomer proof rather than treating prerelease publication as
validated onboarding.

[journey stage planned by](../roadmap-items/distribution-neutral-resources.md)

[journey stage specified by](../designs/npm-bundle-bootstrap.md)

[journey stage implemented by](../tasks/npm-quickstart-onboarding.md)
