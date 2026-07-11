---
type: Task
title: Prove founder-to-founder sharing of an AgentState recipe plugin
status: todo
priority: '2'
description: >-
  Package one useful external recipe as a real plugin; publish, install, apply,
  and version-refresh it across the founders' machines with reproducible
  evidence.
actor: openai/codex
timestamp: '2026-07-11T02:37:28.662Z'
---
# Objective

Prove the complete founder-to-founder distribution path for an AgentState recipe packaged as a plugin. This is an empirical packaging and usability spike, not a new plugin system.

# Experiment

1. Choose one small but genuinely useful external recipe rather than a synthetic fixture.
2. Package it in a real Codex/Claude-compatible plugin with:
   - `recipe.md` and `conventions/*.md`,
   - a focused `SKILL.md` teaching the workflow,
   - a cache-safe installer or resolved-path instruction that invokes `agentstate-lite recipe add <absolute-folder>`.
3. Publish it through an existing marketplace with an intentional plugin version.
4. On the other founder's machine, refresh/install the plugin from the marketplace without using the recipe source checkout.
5. Apply it to a fresh local AgentState bundle and exercise the resulting Kinds through the generic CLI.
6. Perform one plugin-version update round trip to prove changed package bytes reach the second machine. Do not treat that as an automatic upgrade of conventions already adopted by a bundle.

# Acceptance evidence

- The receiving machine's version-keyed plugin cache contains the recipe, skill, and any declared assets.
- `recipe add <plugin-recipe-folder>` succeeds through the existing external recipe pipeline.
- `kinds` reports the installed conventions and `new` creates a strictly validated instance.
- Declared typed links and `status` diagnostics behave as the recipe specifies.
- Reapplying the identical recipe returns `changed:false` and does not rewrite convention bytes.
- A pre-existing hand-edited convention is not clobbered.
- A marketplace version bump produces a new cache version containing the updated plugin assets on the receiving machine.
- The exact publisher and receiver command chain, cache paths, friction, and any Claude/Codex differences are recorded on this task.

# Non-goals

- Building an AgentState-specific marketplace.
- Designing automatic recipe upgrades or schema migrations.
- Silently patching existing conventions.
- General dependency resolution between recipes.
- Polishing a broad public catalog before the two-founder handoff works end to end.

# Why this proof matters

This validates the distribution mechanism behind a potential ecosystem: reusable agent workflows whose structure, operating knowledge, and interfaces can be installed conversationally while the user's resulting knowledge stays local, inspectable, and portable.
