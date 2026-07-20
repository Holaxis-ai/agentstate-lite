---
type: Task
title: 'Product recipes: bundle-free discovery before init'
status: todo
priority: '1'
description: >-
  Make the built-in Recipe inventory discoverable offline before a bundle
  exists: actionable operating-model summaries, init/add commands, no-bundle
  home and init-help pointers, and applied state when a bundle is present.
actor: openai/codex
timestamp: '2026-07-20T02:52:39.826Z'
---
# Problem

`aslite recipes` currently opens a bundle so it can calculate whether each built-in is applied.
That makes the shipped Recipe inventory awkward to discover before `init`—the exact moment a new
user or agent needs to choose between a blank workspace and a prepackaged operating model such as
Product Manager.

The Agent Skill documents the command, but skill guidance cannot be the sole discovery surface.
The npm CLI must be able to explain its built-in operating models from an empty directory, offline,
with no bundle and no marketplace plugin.

# Behavioral claim

Make the existing Recipe inventory a bundle-optional, content-first discovery surface. `Recipe`
remains the package/apply primitive; user-facing copy describes substantial built-ins as operating
models or workspace setups rather than introducing a second persona-configuration abstraction.

# Scope

1. Make bare `aslite recipes` list built-in recipes without requiring a resolved bundle.
2. When a bundle is available, retain the useful `applied` projection. When none exists, represent
   application state honestly as unavailable/not-applicable rather than failing or implying false.
3. Give each row enough information for an agent to choose and act:
   - stable recipe name and version;
   - concise purpose/summary;
   - what it installs, at least Kind/Reference/View identity or compact counts;
   - an exact greenfield command using `init --recipe <name>`; and
   - an exact existing-bundle command using `recipe add <name>`.
4. Make the no-bundle home view offer both paths without becoming a catalog dump: create a blank
   bundle, or run `aslite recipes` to browse available workspace setups.
5. Make `init --help` point to `aslite recipes`. The generated Agent Skill inherits the same
   reference guidance but remains secondary to the executable surface.
6. Preserve offline behavior, bounded output, deterministic ordering, JSON/TOON modes, and existing
   applied-state behavior for callers already inside a bundle.

# Acceptance proof

Using the exact installed npm tarball from an empty directory and isolated home:

- `aslite recipes` exits 0 without creating a bundle or any files;
- current built-ins are listed with actionable init/add commands;
- after initializing or applying one, the same command reports its applied state accurately;
- a built-in containing References and Views describes those assets without reading a target
  bundle;
- bare `aslite` with no bundle points at recipe discovery as well as blank initialization;
- `aslite init --help` exposes the discovery path;
- adding the future `product-manager` built-in automatically makes it discoverable through the same
  inventory, without product-manager-specific CLI branching; and
- a fresh agent can select the Product Manager operating model from CLI output alone.

# Non-goals

- Renaming the Recipe engine, manifest, or existing `recipe add` command.
- Adding a second `persona`, `template`, `setup`, or marketplace subsystem.
- Enumerating arbitrary recipe folders elsewhere on disk.
- Building external npm recipe search, dependency resolution, composition, or upgrades.
- Installing a recipe automatically because an agent inspected the inventory.

[advances product recipes](../roadmap-items/recipe-plugins.md)
