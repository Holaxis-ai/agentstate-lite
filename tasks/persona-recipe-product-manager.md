---
type: Task
title: 'First persona recipe: Product Manager (data-free, views included)'
description: >-
  Build the first concrete product recipe as a built-in npm-shipped Product
  Manager operating model: data-free Kinds, semantic relationships, references,
  and pre-built Views, installable through init --recipe product-manager or
  recipe add product-manager without a marketplace plugin.
actor: openai/codex
status: todo
timestamp: '2026-07-20T02:47:37.979Z'
---
# Scope

Build one defined, portable, data-free built-in recipe named `product-manager`. It ships inside the
npm CLI through the existing RecipeSource inventory and contains the minimum coherent PM operating
model: semantically described Kinds and relationships, any required host-neutral references, and
pre-built Views. It contains no tasks, roadmap instances, product data, or examples presented as
user state.

The v1 recipe must be self-contained rather than introducing recipe dependency resolution. Reuse
existing generic conventions only where they can be packaged through the same recipe source without
hidden mutation.

# User journeys

Greenfield:

```sh
aslite init --recipe product-manager --dir <workspace>
```

Existing bundle:

```sh
aslite recipe add product-manager --dir <bundle>
```

# Acceptance

- Both journeys work through the exact installed npm tarball, without repository source or a
  marketplace plugin.
- The CLI lists the recipe and describes what it installs.
- The installed bundle contains the declared Kinds, descriptions, relationships, references, and
  registered Views, but no user/project instances.
- A fresh agent can discover the model, create a valid PM record, connect it through declared
  relationships, and open a useful View without implementation knowledge.
- Reapplication is a byte-stable no-op.
- A hand-edited or conflicting target is preserved with a structured refusal.
- Removing the npm package or optional Agent Skill does not make the adopted bundle unintelligible.

# Non-goals

- Recipe composition or dependency resolution.
- Automatic upgrades/migrations of adopted recipe content.
- A new marketplace or persona-specific command family.
- Generalizing personas before this one has been used successfully.

[first concrete product recipe](../roadmap-items/recipe-plugins.md)
