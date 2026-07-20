---
type: Roadmap Item
title: >-
  npm-first distribution: executable, optional skill, and bundle-native
  knowledge
status: queued
description: >-
  Runtime independence and installed-tarball verification are complete. Choose
  package identity, ship an npm-carried optional skill, prove founder use, then
  retire the marketplace executable channel.
actor: openai/codex
sequence: >-
  Choose identity → npm CLI + skill prerelease → founder proof → npm primary →
  delete marketplace channel
timestamp: '2026-07-20T02:49:05.997Z'
---
# Remaining sequence

The CLI is already self-contained, npm-packable, locally oriented without a skill, and verified as
an installed tarball. The remaining work is distribution rather than engine architecture:

1. Choose the product/package identity.
2. Make the npm package carry the generated optional Agent Skill and references, with explicit
   reversible skill installation and the existing hook installation targeting `aslite` on `PATH`.
3. Publish a prerelease and complete the founder-to-founder npm-only acceptance proof.
4. Make npm the primary documented channel.
5. Retire the marketplace plugin and its duplicate executable/build/cache/version machinery in a
   deletion-focused unit.

No marketplace plugin is required in the end state. Bundles remain the durable knowledge layer;
npm owns executable mechanics plus the optional bootstrap skill.

[contains](../tasks/distribution-resource-inventory.md)

[guided by](../designs/npm-bundle-bootstrap.md)

[contains](../tasks/verify-npm-package.md)

[contains](../tasks/recipe-source-decomposition.md)

[contains](../tasks/prune-regenerate-index-api.md)

[contains](../tasks/portable-index-cli.md)

[contains](../tasks/npm-package-identity.md)

[contains](../tasks/npm-cli-skill-prerelease.md)

[contains](../tasks/retire-marketplace-channel.md)
