---
type: Task
title: 'New-user quickstart: the TESTED install to init-a-recipe to productive journey'
description: >-
  REVISED INTEGRATION PLAN APPROVED. Builder will replay checkpoint 6e2cfaa onto
  main 531c9df and keep the nine-file boundary while correcting three checkpoint
  defects: default commands target .agentstate-lite from a non-empty project;
  existing bundle Recipe rows are add-only; public install uses unqualified
  @holaxis/aslite and labels quickstart-agent as an example. PR #211 user-scope
  and PR #212 no-delete/production-lock/package identity proofs are mandatory.
  Builder is next; exact-SHA Review then adversarial QA before PR.
actor: codex-npm-quickstart-orchestrator
status: in_progress
priority: '1'
timestamp: '2026-08-07T17:45:02.344Z'
---
[the tested new-user onboarding journey](../roadmap-items/distribution-neutral-resources.md)

[depends on CLI+skill+hook install](npm-cli-skill-prerelease.md)

[uses the already-shipped work-tracking recipe; productized recipe learning is separate](../decisions/defer-builtin-recipes.md)

[depends on](version-build-identity.md)

[depends on](skill-mcp-compatibility.md)

# Ownership boundary (2026-07-31)

This task owns the durable literal first-install productivity test and onboarding clarity. It does
not own release staging, old-to-new upgrade mechanics, runtime identity, update selection, or
marketplace deletion. The E7A founder journey may supply human evidence here without making Q6 a
hard predecessor of release mechanics.

# Approved onboarding boundary (2026-08-03)

Brian approved the review-revised [onboarding plan](../plans/onboarding-surfaces.md) while Michael
is unavailable. This task remains separate from guide curriculum and proves the fast path:

1. install the exact npm artifact;
2. receive the no-bundle orientation and generic Recipe inventory;
3. create a genuinely fresh `work-tracking` workspace through generic `init --create-only`;
4. create one valid attributed Task; and
5. observe useful live state; and
6. understand that ongoing authoring is agent-driven: the user supplies source material or intent in their preferred tool, and the agent organizes, types, links, and updates the bundle through the CLI primitives.

This clarity requirement comes from anonymized first-use feedback: successful installation and a
working View did not by themselves give a newcomer a reliable mental model for contributing new
content. The quickstart must prove that handoff explicitly without turning into the separate guide
curriculum.

The [create-only target-safety guard](init-target-safety-guard.md) is a new shared predecessor and
must pass its independent review/adversarial QA before this journey adopts the flag. The separate
`agentstate-guide` may appear in inventory, but this task neither depends on its curriculum nor
tests it. [Brian's guide-deferral decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md)
does not change Q6's `work-tracking` oracle.

[implementation plan](../plans/version-string-channel-identity.md)

[depends on](init-target-safety-guard.md)

[active implementation plan](../plans/npm-quickstart-implementation-2026-08-07.md)
