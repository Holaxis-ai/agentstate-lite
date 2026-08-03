---
type: Journey Stage
title: Learn AgentState through its guidance bundle
journey: journeys/new-user-to-recurring-value
order: '03'
lane: shared
readiness: missing
criticality: core
description: Stage 03 of the new-user-to-recurring-value journey.
actor: codex-onboarding-scope
timestamp: '2026-08-03T23:56:06.899Z'
---
# Desired experience

A newcomer discovers `agentstate-guide` through the no-bundle home, README, or Agent Skill and explicitly creates it at a safe suggested personal location. The guide teaches AgentState through an ordered set of bundle-native References and one read-only live View, then helps the learner create a separate real workspace.

# Current experience

Bundle-free Recipe discovery is shipped, and the launcher/View substrate works. The guide curriculum, build-time built-in assets, stateless front-door copy, and generic create-only init guard are scoped but not implemented. Readiness therefore remains `missing`.

# Acceptance criteria

- The guide is discoverable without creating or polluting a project bundle.
- Its exact command uses generic create-only target safety and a suggested overrideable personal path.
- Numbered References and next-links provide sequence without completion/acknowledgement state.
- The learner creates the first attributed document with an exact CLI `aslite new` command; the `bundle-read` View observes it live and does not write.
- A fresh user/agent completes the curriculum and creates a separate real bundle without founder coaching.
- README, no-bundle home, and Agent Skill agree on the stateless, zero-nag recommendation.
- Local web is sufficient for v1; MCP presentation remains optional where configured.

# Evidence

PR #201 proves bundle-free Recipe discovery. The [reviewed onboarding plan](../plans/onboarding-surfaces.md) corrected the View-action and init-safety assumptions, and [Brian's decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md) permits the guide to pursue built-in status without changing the deferred domain-Recipe policy.

# Remaining gaps

Build and independently validate generic create-only init safety; prototype and fresh-user-test the curriculum/View; embed the first built-in References+View at build time; land stateless front-door copy; and pass installed-tarball/offline gates.

[journey stage planned by](../roadmap-items/distribution-neutral-resources.md)

[journey stage planned by](../roadmap-items/launcher-home-surface.md)

[journey stage implemented by](../tasks/guidance-bundle-onboarding.md)

[depends on target safety](../tasks/init-target-safety-guard.md)
