---
type: Journey Stage
title: Return later and rediscover the workspace
journey: journeys/new-user-to-recurring-value
order: '11'
lane: shared
readiness: rough
criticality: core
description: Stage 11 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:54.066Z'
---
# Desired experience

In a later conversation, the agent immediately discovers the user's relevant bundles and Views,
selects the intended workspace explicitly, and resumes with fresh context.

# Current experience

The workspace catalog, home summary, hooks, and explicit `--dir` targeting exist, but discovery is
not yet a seamless supported journey across every host.

# Acceptance criteria

- The agent sees a compact list of registered workspaces and their paths.
- Cross-workspace actions remain explicitly targeted with no ambient hidden workspace.
- The user can reopen the useful View without remembering commands or identifiers.

# Evidence

The founders dogfood multiple registered bundles, including private and repository workspaces.

# Remaining gaps

Complete catalog dogfood and make the host/session discovery path obvious without adding global
active-workspace state.

[journey stage planned by](../roadmap-items/personal-bundle-catalog.md)

[journey stage specified by](../designs/personal-bundle-catalog.md)

[journey stage implemented by](../tasks/workspace-catalog-dogfood-checkpoint.md)
