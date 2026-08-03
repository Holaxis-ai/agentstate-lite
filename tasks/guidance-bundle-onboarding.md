---
type: Task
title: Ship agentstate-guide as an explicit built-in learning workspace
status: todo
priority: '2'
description: >-
  Ship a standalone bundle-native guide through the existing
  RecipeSource/discovery path; explicit destination, persistent reference, no
  silent install or acknowledgement subsystem.
actor: codex-onboarding-scope
assignee: brian-claude
timestamp: '2026-08-03T22:36:34.255Z'
---
# Goal

Ship `agentstate-guide` as a built-in, data-free Recipe that materializes a standalone learning workspace. It teaches a newcomer AgentState Lite through ordinary bundle References and one registered orientation View, then helps them create a separate real bundle without founder explanation.

This is the guidance work unit defined by [the onboarding surface plan](../plans/onboarding-surfaces.md). It is not a new installer or onboarding subsystem.

# Decided boundary

- Delivery uses the existing built-in `RecipeSource` and the generic [bundle-free recipe discovery](product-recipe-discovery.md) shipped in PR #201.
- The recommended path is explicit standalone creation at a user-chosen destination, equivalent to `aslite init --recipe agentstate-guide --dir <chosen-learning-workspace>`.
- No silent npm postinstall behavior, cwd inference as a product choice, special `guide`/`learn` command, marketplace, second parser, or automatic composition.
- The guide is a persistent reference, not a one-time wizard. V1 has no seen/acknowledgement state and does not depend on the identity/notice design.
- Initial content is data-free: static References plus one bundle-read registered View. The learner creates the first ordinary instance through a safe attributed action.
- The guide remains separate from `examples/sample-bundle`, whose job is interop and round-trip testing.
- The Agent Skill may mention the exact discovery path when asked, but the CLI alone must be sufficient and must not nag.

# Acceptance criteria

Using the exact installed npm artifact from an isolated home and empty directory:

1. bare `aslite` points to recipe discovery without creating files;
2. `aslite recipes` lists `agentstate-guide` with a concise purpose, assets, and an explicit safe creation path;
3. initializing the guide at a chosen path never creates, replaces, or mutates an existing project workspace or binding target;
4. the resulting bundle opens through ordinary local web and, where configured, MCP View surfaces;
5. a fresh user/agent can explain bundles, docs, links, Kinds, Recipes, Views, status, local-first visibility, and optional sync;
6. the learner completes one safe attributed write, observes the result, and creates a separate real bundle without founder coaching;
7. the guide remains reopenable with no acknowledgement marker or stable-person identity; and
8. offline operation after npm installation and existing Recipe create-only/idempotent semantics remain intact.

# Content design questions owned here

- The smallest curriculum and flagship orientation View that satisfy the outcome.
- Which existing base conventions the self-contained Recipe includes without adding hidden dependency resolution.
- The exact safe first action and graduation prompt.
- The emitted destination wording and collision probes needed to make the explicit path honest.

# Dependencies and sequence

- Depends on the shipped PR #201 recipe discovery seam.
- Waits for Michael Collier's sign-off on [the shared boundary](../review-requests/onboarding-surfaces-mike-signoff.md), not on P5A or the npm quickstart task.
- May proceed in parallel with [npm quickstart](npm-quickstart-onboarding.md) after sign-off because that task proves the existing `work-tracking` path.
- When shipped, link evidence to [the guidance Journey Stage](../journey-stages/04-learn-through-guidance-bundle.md); Journey readiness changes only after proof.

# Non-goals

- P5A, staged release automation, update awareness, marketplace retirement, or deployment.
- Personal Task System or another domain operating model. [The built-in recipe deferral](../decisions/defer-builtin-recipes.md) remains in force.
- Per-person notices, acknowledgement, passive seen tracking, or identity work from [the notice design](../designs/user-notices.md).
- Turning the learning workspace into the user's real project or encouraging `recipe add` into an existing project as the default onboarding path.

# Related

- [distribution-neutral-resources](../roadmap-items/distribution-neutral-resources.md)
- [recipe-plugins](../roadmap-items/recipe-plugins.md)
- [product-recipe-discovery](product-recipe-discovery.md)
- [npm-cli-skill-prerelease](npm-cli-skill-prerelease.md)

[part of](../roadmap-items/distribution-neutral-resources.md)

[part of](../roadmap-items/recipe-plugins.md)

[part of](product-recipe-discovery.md)
