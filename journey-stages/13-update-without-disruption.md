---
type: Journey Stage
title: Update AgentState Lite without disruption
journey: journeys/new-user-to-recurring-value
order: '12'
lane: shared
readiness: rough
criticality: core
description: Stage 12 of the new-user-to-recurring-value journey.
actor: anthropic/claude
timestamp: '2026-08-02T16:28:37.713Z'
---
# Desired experience

The user can learn that an update is available, install the supported npm release, verify the active
version, and continue using existing bundles and host configuration unchanged.

# Current experience

The npm-first architecture and version contract are active work. Plugin cache expiry and multiple
historical executable channels have made this an urgent usability problem.

# Acceptance criteria

- The product reports current, latest supported, and compatibility status accurately.
- One documented update command preserves user data, skills, hooks, and MCP configuration.
- Rollback and prerelease channel behavior are explicit.

# Evidence

Repeated founder friction with expiring plugin caches motivated the npm-first priority and current
version-contract work.

# Remaining gaps

Finish the version/update contract, staged release path, documentation cutover, and independent
upgrade proof.

[journey stage planned by](../roadmap-items/distribution-neutral-resources.md)

[journey stage specified by](../designs/version-update-domain-model.md)

[journey stage implemented by](../tasks/version-string-channel-identity.md)

[journey stage implemented by](../tasks/self-discovered-upgrade-proof.md)

[journey stage implemented by](../tasks/skill-freshness.md)
