---
type: Roadmap Item
title: 'Product recipes: installable agent operating systems'
status: active
description: >-
  Ship data-free, view-backed operating models through the one RecipeSource
  pipeline; built-ins travel with npm and become ordinary portable bundle
  content when installed.
actor: openai/codex
sequence: >-
  Personal Task System built-in → installed-npm newcomer proof → working-memory
  Focus/Session layer → only then a second demonstrated domain recipe and
  generalized distribution
timestamp: '2026-07-20T21:52:54.208Z'
---
# Vision

Make useful AgentState operating models installable as **product recipes**: instance-free packages of
Kinds, semantic descriptions, typed relationships, workflows, references, and pre-built Views.
A user should be able to choose a useful working system instead of beginning with an infinitely
flexible blank substrate. The first concrete system is the human-agent collaborative Personal Task
System; Product Manager remains a later domain candidate rather than the release-path dependency.

The first distribution channel is the npm-installed AgentState CLI itself. Built-in recipes ship
with the executable and flow through the same `RecipeSource` parser and create-only apply boundary
as external folders:

```sh
aslite init --recipe personal-task-system --dir <workspace>
aslite recipe add personal-task-system --dir <existing-bundle>
```

The installed result is ordinary bundle content. It remains readable and editable without npm,
without a skill, and without any marketplace account.

# Why this is valuable

- **Collapses cold-start cost.** Users choose an operating model rather than designing an ontology
  before receiving value.
- **Packages accumulated expertise.** Kinds, descriptions, relationships, workflows, and Views
  travel together as one coherent starting system.
- **Keeps the substrate flexible.** A product recipe creates ordinary OKF documents and HTML blobs;
  users and agents can evolve them after installation.
- **Makes npm installation land.** `npm install` provides both the general engine and immediately
  useful product configurations.
- **Preserves portability.** Recipes contain definitions, never another user's instance state.

# Product contract

- A product recipe is a normal, definitions-only RecipeSource—not a new schema or installer.
- Built-ins are packaged with the npm CLI; external folders use `recipe add <path>` through the same
  validation and application path.
- Installation is explicit, idempotent, and expect-absent. It never silently overwrites a bundle
  author's convention, View, or reference.
- A persona recipe may include the base definitions it needs. V1 does not add hidden dependency
  resolution or automatic composition.
- Recipe updates do not automatically mutate previously adopted bundle content. Previewable
  migrations are a separate future problem.
- Skills may teach the operating model, but the recipe body, Kind descriptions, and Views must be
  sufficient for host-independent understanding.

# Sequence

1. Ship the built-in, instance-free `personal-task-system` recipe: settled Task + Project semantics,
   then the collaborative human-writeable board View, then built-in registration by name.
2. Prove both greenfield `init --recipe personal-task-system` and adoption through
   `recipe add personal-task-system` on a fresh installed npm artifact.
3. Have a newcomer create valid Tasks and Projects, collaborate with an agent, and use the pre-built
   View without founder help.
4. Add the working-memory Focus/Session layer after the task system; reconsider Product Manager or
   another domain recipe only when it contributes a genuinely different operating model.
5. Generalize distribution only after a second demonstrated recipe requires it. Treat external
   recipe transport as a later choice; never fork the recipe engine.

# Success condition

A new user installs AgentState from npm, selects the Personal Task System recipe by name, and
immediately receives a useful, view-backed workspace with an understandable Task + Project model,
human-agent write-back, and zero preloaded user instances.
The resulting bundle continues to work as plain portable content if the npm package or Agent Skill
is absent.

[first built-in product recipe](personal-task-system-recipe.md)

[contains](../tasks/prove-recipe-plugin-sharing.md)

[contains](../tasks/portable-recipe-packages-v1.md)

[contains](../tasks/bundle-native-reference-docs.md)

[contains](../tasks/persona-recipe-product-manager.md)

[contains](../tasks/product-recipe-discovery.md)
