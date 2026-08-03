---
type: Context Note
title: Recipe discovery enables a bundle-native AgentState guide
description: >-
  How bundle-free recipe discovery supports shipping an explorable guidance
  bundle inside the aslite npm package without a separate onboarding subsystem.
actor: openai/codex
timestamp: '2026-08-03T03:35:11.705Z'
---
# Summary

PR [#201](https://github.com/Holaxis-ai/agentstate-lite/pull/201) turns the built-in Recipe inventory into the clean discovery and installation seam for a guidance bundle shipped inside the `@holaxis/aslite` npm package.

The npm artifact can carry a content-free built-in Recipe containing the guidance bundle's Kinds, References, and registered Views. Before any bundle exists, `aslite recipes` can describe those assets and emit the exact command to create the learning workspace. The same Recipe can also be added to an existing bundle, and the inventory then reports its applied state.

This supports a simple new-user journey:

1. Install or update `@holaxis/aslite`.
2. Run `aslite recipes` from any directory.
3. See the AgentState guidance workspace alongside other available operating models.
4. Run `aslite init --recipe <guidance-recipe>` to create it as a standalone learning bundle, or `aslite recipe add <guidance-recipe>` to add its definitions and Views to an existing bundle.
5. Explore the bundle through the ordinary web or MCP View surfaces.

The important architectural consequence is that the guidance bundle does not need a special `guide`, `learn`, persona, marketplace, or silent post-install subsystem. It can use the same versioned Recipe manifest and application path as every other shipped operating model. Recipe discovery is executable CLI knowledge, so onboarding does not depend on an Agent Skill being loaded.

PR #201 is therefore an enabler, not the guidance content itself. The remaining work is to choose the built-in recipe identity, author the small bundle-native curriculum and flagship View, decide whether it is definitions-only or includes intentionally educational example data, and test the literal install → discover → initialize → open journey.

[guidance bundle task](../tasks/guidance-bundle-onboarding.md)

[recipe discovery task](../tasks/product-recipe-discovery.md)

[recipe distribution roadmap](../roadmap-items/recipe-plugins.md)
