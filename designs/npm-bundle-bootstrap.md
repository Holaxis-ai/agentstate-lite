---
type: Design
title: 'Distribution boundary: npm executable, bundle-native knowledge, thin bootstrap'
description: >-
  Make npm the executable authority, bundles the durable knowledge authority,
  and plugins a minimal bootstrap. Private extraction consumes published OSS
  core AND server/wire packages; packages/server remains OSS.
actor: codex
timestamp: '2026-07-12T22:57:48.930Z'
---
# Distribution boundary: npm executable, bundle-native knowledge, thin bootstrap

**Status:** Directional decision captured 2026-07-12. Do not remove the current self-contained plugin bundle until the npm-first path has passed the founder-to-founder proof below.

## Decision

Make conventional npm packages the long-term authority for executable code, while moving durable operating knowledge into AgentState bundles. Keep only a tiny harness-specific bootstrap outside the bundle.

The intended division is:

1. **npm package: exact executable mechanics**
   - `agentstate-lite` supplies the CLI on `PATH`.
   - `@agentstate-lite/core` supplies the versioned engine/storage contract needed by the future private SaaS repository.
   - Exact flags, error contracts, and version-specific command help stay generated from the installed CLI source; they are not copied into every project bundle.

2. **Bundle: meaning and operating models**
   - Project orientation, architecture, decisions, Kinds and field/relationship descriptions, recipes, workflows, examples, Pages, review conventions, and agent instructions live as ordinary linked bundle content.
   - This is the durable, human-visible, agent-independent knowledge layer. It can evolve with the project and remains useful across Claude, Codex, OpenCode, and future harnesses.

3. **Thin bootstrap: discovery and operational moment**
   - The irreducible external instruction is only: AgentState exists as `aslite`; run `aslite session-start` (or `aslite home`) and follow the bundle's orientation.
   - A minimal skill/plugin or AGENTS.md entry may install the SessionStart hook and teach these few commands. It should not carry a second full CLI manual or the executable indefinitely.

The bootstrap is necessary because a bundle cannot teach an agent how to read itself before the agent knows the CLI exists. Everything after that bootstrap should be self-describing through the executable and bundle.

## Why this is simpler

Making npm the executable authority can retire version-keyed plugin-cache CLI resolution, the committed generated `.mjs` bundle, builds dirtying bot-owned artifacts, marketplace upgrades merely to receive binary changes, and duplicated executable distribution logic across agent hosts. The plugin remains valuable as knowledge/hook integration, but becomes thin and optional rather than the binary carrier.

This also gives the private SaaS repository a normal dependency boundary: it can pin a published `@agentstate-lite/core` rather than importing source from the OSS monorepo.

## Knowledge placement rule

- Put **syntax that changes with a CLI version** in generated CLI help/reference.
- Put **durable meaning and project operating context** in the bundle.
- Put **only bootstrap/discovery and hook installation** in a harness plugin.

Do not seed a complete command manual into every bundle. That would create version skew and another manually coordinated surface.

## Transition — evidence before removal

1. Publish and externally install `@agentstate-lite/core` with an explicit semver/API contract.
2. Publish/install the `agentstate-lite` CLI conventionally and prove it runs offline after installation.
3. Have one founder install the CLI and hook on a clean machine/session, open an unfamiliar bundle, and successfully work from bundle-native orientation without live explanation from the other founder.
4. Reduce the marketplace plugin to bootstrap, hooks, and optional recipe/Page assets while retaining the bundled executable as a temporary fallback.
5. Remove the committed plugin executable, resolver, and bundle-regeneration automation only after the npm-first path has survived real use and rollback is understood.

## Acceptance proof

The transition is proven when Brian can install the executable, start a fresh agent session, and use a real bundle successfully without Mike explaining the system live; the agent finds the workspace, understands its Kinds/workflows, performs an attributed mutation, and sees the human Page surface. The inverse founder direction should work too.

Pin these mechanically:
- installed CLI and bundle schema compatibility;
- generated CLI help matches the installed binary;
- session hook points to the executable on `PATH`;
- bundle knowledge remains readable without a plugin;
- plugin absence does not remove project meaning;
- offline operation works after initial installation.

## Relationship to remote/SaaS extraction

This distribution boundary complements the two-repository direction:
- OSS keeps the engine, CLI, explicit `--remote` wire client/on-ramp, protocol contract, and local+git product.
- The private repository consumes published core and owns the hosted server/deployment, identity, tenancy, billing, and administration.

Publishing core is a prerequisite for clean extraction. Converting the whole CLI/plugin distribution is not a prerequisite for beginning the remote boundary work; it is a parallel simplification with its own proof gate.

## Open implementation choices

- Global npm install versus a managed per-user install directory.
- Whether the thin plugin can offer installation automatically or only emit an actionable command.
- Compatibility declaration between plugin/bootstrap version and CLI semver.
- Release ordering and rollback while both the npm CLI and bundled fallback exist.
- When the existing `tasks/dev-build-bundle-collision` tactical fix becomes unnecessary versus still worthwhile during transition.

[extends](portable-cognitive-ecosystems.md)

[supports](../roadmap-items/radical-simplification.md)

[prerequisite](../tasks/publish-core-package.md)

[may supersede](../tasks/dev-build-bundle-collision.md)

[clarified by](../decisions/oss-wire-server-boundary.md)
