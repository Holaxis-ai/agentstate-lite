---
type: Roadmap Item
title: 'Recipe plugins: share installable agent operating systems'
status: queued
description: >-
  Package Kinds, agent instructions, and optional Pages as
  marketplace-distributed plugins while keeping adopted knowledge local and
  portable.
actor: openai/codex
timestamp: '2026-07-11T22:53:17.430Z'
---
# Vision

Make an AgentState recipe shareable as an installable agent plugin: the host marketplace distributes and versions the package, while AgentState applies the bundled recipe through the existing `recipe add <folder>` path. A plugin can carry a domain model (Kind conventions), the skill that teaches agents how to operate it, and optional Pages or scripts that make the model immediately useful.

The long-term product unit is not merely a schema. It is a portable agent operating system for a domain: install a research, claims, product-planning, personal-CRM, or other workflow and an agent immediately knows the concepts, relationships, validation rules, commands, and human interfaces involved.

# Why this is valuable

- **Collapses cold-start cost.** A user installs accumulated expertise instead of teaching every agent a workflow from scratch.
- **Makes structure compound.** Kinds turn a useful conversational pattern into durable, executable shared context; plugins make that pattern reusable across people and projects.
- **Creates a community distribution loop.** People can share complete agent workflows and generated interfaces, analogous to an Obsidian plugin or vault template, while the resulting knowledge remains ordinary local bundle content.
- **Preserves ownership and portability.** The installed conventions are plain OKF Markdown, not opaque marketplace state or a hosted database schema.
- **Separates distribution from execution.** Codex/Claude marketplaces handle discovery, versioned installation, and cache refresh; AgentState keeps one recipe parser and one safe apply boundary.

# Intended shape

- A recipe remains the data-only domain model: `recipe.md` plus `conventions/*.md`.
- A host skill explains when and how agents should use those Kinds.
- Optional plugin assets may include Pages, examples, and a small installer/orchestration script.
- Installation is explicit, idempotent, and expect-absent: it never silently overwrites a bundle author's convention.
- Data-only recipes and executable plugin assets are presented as distinct trust tiers.

# Product constraints

- Do not create a second AgentState marketplace while host plugin marketplaces already solve distribution.
- Do not conflate a plugin update with mutation of an adopted bundle. Today's recipe semantics are install-only; upgrading an existing domain model needs a separate previewable migration design.
- Do not add hidden dependency resolution or automatic composition in the proof. The plugin skill may orchestrate existing generic commands explicitly.

# Success condition

One founder can publish a recipe plugin and the other can install it from the real marketplace, apply it to a fresh local bundle without checking out the recipe's source repository, create validated instances, and see the same domain behavior. The handoff should be reproducible enough to become the reference packaging pattern for community recipe plugins.

[contains](../tasks/prove-recipe-plugin-sharing.md)
