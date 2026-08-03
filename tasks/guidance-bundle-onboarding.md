---
type: Task
title: 'Ship agentstate-guide as an ordered, stateless learning workspace'
status: todo
priority: '2'
description: >-
  Review-revised: ordered built-in guide prototype with read-only live View, CLI
  first action, stateless skill/home/README discovery, build-time asset
  embedding, and a generic create-only init guard predecessor.
actor: codex-onboarding-scope
assignee: brian-claude
timestamp: '2026-08-03T23:34:27.691Z'
---
# Goal

Ship a small, ordered `agentstate-guide` learning workspace through the existing RecipeSource path. It teaches a newcomer AgentState Lite through ordinary static References and one registered `bundle-read` View, then helps them create a separate real bundle without founder explanation.

This task was narrowed once during scoping. This revision folds in [the three-lens review](../context-notes/review-onboarding-synthesis.md); it corrects mechanics and acceptance criteria rather than creating another guide scope.

# Work boundary and gates

## May start now

- Prototype the numbered curriculum, previous/next/graduation links, read-only View, exact CLI first action, and fresh-user walkthrough.
- Prototype the Recipe as a folder source and design its build-time embedding generator.
- Validate content through local builds without claiming it is the recommended built-in.

## Waits for Michael's decision

- Register `agentstate-guide` as a built-in while [the built-in recipe deferral](../decisions/defer-builtin-recipes.md) remains explicitly open for other built-in-flavored work.
- Change the completed no-bundle home/discovery copy or openai/codex-owned Journey/quickstart records.

## Hard predecessor

The guide's public creation path depends on [generic create-only init target safety](init-target-safety-guard.md). Do not publish the command or treat the guide as safely materializable until that guard passes its independent review and adversarial QA.

# Product contract

## Explicit safe creation

The suggested, overrideable personal location is:

```sh
aslite init --create-only --recipe agentstate-guide --dir ~/.agentstate-lite/guide
```

No silent npm postinstall behavior, cwd inference as the guide recommendation, special `guide`/`learn` command, marketplace, second parser, or automatic composition. Generic `aslite recipes` inventory keeps its ordinary command semantics; guide-specific safe placement lives in the front-door copy.

Re-running creation against an existing guide fails safely and points at the reopen path. The guide never injects itself into an existing project; `recipe add` remains the explicit generic operation for changing an existing bundle.

## Ordered but stateless lifecycle

- Numbered static References and explicit previous/next/graduation links provide sequence.
- The guide remains permanently reopenable.
- V1 stores no completion, seen, or acknowledgement state.
- Discovery is zero-nag and stateless: recommend the guide only when a user self-identifies as new or asks how to begin.
- With no repeated prompt there is nothing to suppress, so no marker is needed. Any future repeated/proactive prompting would reacquire the stable-person identity prerequisite from [the notice design](../designs/user-notices.md).

## First action uses shipped mechanics

Begin with no user-instance data. The learner runs an exact attributed CLI command, for example:

```sh
aslite new "Context Note" first-step --title "My first note" --actor <name> --dir ~/.agentstate-lite/guide
```

The `bundle-read` View subscribes and visibly updates when the document lands. It does not initiate the write. View-mediated document creation, `bundle-propose`, and `document.set-field` are out of v1.

## Proactive front doors

After Michael authorizes the completed-surface follow-up:

- the generated Agent Skill source names `agentstate-guide`, prints the exact create-only command, and instructs agents to recommend it only when the user says they are new or asks how to start;
- no-bundle `getting_started` names the same guide/default path while retaining blank-init and generic recipe discovery choices; and
- README/npm quickstart names recipe discovery and the same optional learning path.

These static surfaces must derive or agreement-test their shared name/command/cue so they cannot drift.

# Built-in packaging decision

The guide is expected to be the first named built-in carrying References and a registered View.

- Author its manifest, conventions if needed, References, View registry doc, and HTML as ordinary files under one guide Recipe source directory.
- Extend the existing `prepareCliBundleInputs` path to generate a TypeScript `RecipeFile[]` module from those exact bytes for every CLI-bundle build.
- Import the generated module from the built-in Recipe source and pass it through the existing `parseRecipeFiles` authority.
- Do not perform runtime package-relative reads and do not hand-maintain large Markdown/HTML string constants.
- Add generator provenance/drift coverage and first-built-in-with-References+View inventory/apply/idempotence tests.
- Use the exact installed local-dev tarball for PR proof; later supported-release evidence can exercise the same journey without making guide development depend on P5A.

# Acceptance criteria

Using the exact installed local-dev npm artifact from an isolated home and empty directory:

1. bare `aslite` and `aslite recipes` remain bundle-free and create no files;
2. `aslite recipes` lists `agentstate-guide` with accurate Reference/View assets through the generic inventory;
3. the skill, no-bundle home, and README agree on the guide name, exact create-only/default-path command, when to recommend it, and zero-nag behavior;
4. the create-only command materializes the guide only at a fresh explicit location and never changes an existing, bound, enclosing, ambiguous, or concurrently created workspace;
5. the resulting bundle opens through ordinary local web; MCP presentation is optional “where configured” and not a v1 gate;
6. a fresh user/agent follows the numbered curriculum without source-code reading or founder explanation;
7. the learner runs the exact CLI `new` action, sees the attributed record arrive live in the read-only View, and understands that the View observed rather than wrote it;
8. the learner can explain bundles, docs, links, Kinds, Recipes, Views, status, local-first visibility, and optional sync;
9. the learner creates a separate real workspace, reopens the guide later, and encounters no acknowledgement marker or repeated prompt;
10. at least one fresh-user/fresh-agent walkthrough tests the curriculum order as a revisable hypothesis, with observed friction recorded before v1 is declared done;
11. offline operation after installation, create-only safety, and existing Recipe create-only/idempotent apply semantics remain intact; and
12. installed-tarball tests prove the embedded guide requires no repository checkout, package-relative runtime file, or marketplace plugin.

# Relationship to adjacent work

- [Product recipe discovery](product-recipe-discovery.md) is already done and remains the generic inventory seam.
- [npm quickstart](npm-quickstart-onboarding.md) stays separate and proves the existing `work-tracking` productivity path.
- [MCP installation](mcp-install-verb.md), [general capability hints](capability-awareness-hints.md), and [missing-kind recovery](new-kind-missing-convention-hint.md) remain separate tasks.
- [Product Manager](persona-recipe-product-manager.md) and [Personal Task System](recipe-personal-task-system.md) remain deferred domain operating models. Guide packaging may provide technical precedent but does not take or unblock their product slot.
- When guide evidence exists, openai/codex may update [the guidance Journey Stage](../journey-stages/04-learn-through-guidance-bundle.md) after approval.

# Non-goals

- P5A, staged release automation, update awareness, marketplace retirement, deployment, or MCP host installation.
- A guessed domain operating model or reversal of the recipe deferral without Michael's explicit decision.
- Per-person notices, passive seen tracking, acknowledgement, stable identity, or repeated reminders.
- View-mediated document creation or any new trusted-action mechanic.
- Turning the learning workspace into the user's real project.
- Merging the guide with `examples/sample-bundle`, whose job is interop/round-trip validation.

# Related

- [revised onboarding plan](../plans/onboarding-surfaces.md)
- [Michael sign-off](../review-requests/onboarding-surfaces-mike-signoff.md)
- [distribution-neutral-resources](../roadmap-items/distribution-neutral-resources.md)
- [recipe-plugins](../roadmap-items/recipe-plugins.md)
- [npm-cli-skill-prerelease](npm-cli-skill-prerelease.md)
- [recipe-to-guide handoff](../context-notes/recipe-discovery-guidance-bundle.md)

[depends on](init-target-safety-guard.md)
