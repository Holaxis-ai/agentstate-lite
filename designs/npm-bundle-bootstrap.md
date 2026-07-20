---
type: Design
title: 'Distribution boundary: npm executable and skill, bundle-native knowledge'
description: >-
  Make npm the sole first-party authority for the CLI and optional installable
  Agent Skill; keep durable meaning and product recipes in portable bundles,
  then retire the marketplace channel after proof.
actor: openai/codex
timestamp: '2026-07-20T02:48:49.115Z'
---
# Distribution boundary: npm executable and skill, bundle-native knowledge

**Status:** Direction revised 2026-07-19. npm is the intended sole first-party distribution
authority. Do not remove the current marketplace channel until the npm-first founder proof below
passes, but do not preserve a marketplace plugin as an end-state requirement.

## Decision

Ship one conventional npm package that owns the executable and carries the optional Agent Skill
that teaches it. Keep durable project meaning in AgentState bundles.

1. **npm package: executable mechanics plus an installable Agent Skill**
   - `agentstate-lite` supplies the `agentstate-lite` and `aslite` bins on `PATH`.
   - The same package carries a generated `SKILL.md` and its declared references as package assets.
   - An explicit `aslite skill install|status|uninstall` copies or removes those assets in supported
     agent hosts. It respects `CODEX_HOME` and `CLAUDE_CONFIG_DIR`, supports project/global scope,
     and never relies on npm `postinstall` side effects.
   - The installed skill invokes bare `aslite`; it contains no duplicate executable and no
     version-keyed marketplace-cache resolver.
   - The existing explicit `aslite hook install|status|uninstall` remains the optional ambient
     context integration. Once npm owns the executable, installed hooks point at stable `aslite
     session-start` rather than a disposable cache path.

2. **Bundle: meaning and operating models**
   - Project orientation, architecture, decisions, Kinds and field/relationship descriptions,
     recipes, workflows, examples, Views, review conventions, and agent instructions live as
     ordinary linked bundle content.
   - This is the durable, human-visible, agent-independent knowledge layer. It can evolve with the
     project and remains useful across Claude, Codex, OpenCode, and future harnesses.

3. **npm-shipped product recipes: optional starting operating models**
   - Built-in, data-free recipes may ship in the npm artifact through the existing `RecipeSource`
     pipeline. They are product presets, not a second executable or schema system.
   - A new workspace selects one explicitly with `aslite init --recipe <name>`; an existing bundle
     uses `aslite recipe add <name-or-path>`.
   - `product-manager` is the first proposed persona recipe: Kinds, semantic descriptions, and
     pre-built Views with no user data. It should make the first-run experience concrete without
     reducing AgentState's underlying flexibility.
   - External recipe folders remain supported. Their eventual public transport does not require a
     host-agent marketplace and must not fork recipe parsing or apply semantics.

## Why this is simpler

The npm package already has to contain the authoritative executable. Carrying the generated skill
beside it aligns the two versions and reverses the current dependency in the right direction: the
tool may install its guidance, while guidance never carries another copy of the tool.

This retires:

- version-keyed plugin-cache CLI and hook paths;
- the committed generated CLI bundle inside the marketplace plugin;
- the cache-path resolver and its cross-host/version-selection tests;
- separate plugin-bundle build/check and executable-drift machinery;
- marketplace upgrades merely to receive executable changes;
- dual release/version automation for one CLI.

The skill remains optional. A user who installs only npm still has a fully self-describing CLI:
bare `aslite` renders live home state and `aslite --help` renders the command reference.

## Knowledge placement rule

- Put syntax that changes with a CLI version in generated CLI help/reference.
- Put the optional generated Agent Skill and only its necessary static references in the npm
  package, versioned with that CLI.
- Put durable meaning and project operating context in the bundle.
- Put reusable, data-free starting models in Recipes applied through the one recipe pipeline.
- Do not seed a complete CLI manual into every bundle or maintain a second marketplace copy.

## Transition — evidence before removal

1. Choose the public product/package identity.
2. Extend the npm artifact from the current four-file CLI allowlist to carry the generated skill
   and declared references; add explicit skill install/status/uninstall commands.
3. Publish a prerelease and prove the exact installed package works offline, installs its skill,
   installs stable PATH-based session hooks, and operates an unfamiliar real bundle.
4. Have one founder install it cleanly and successfully use a real bundle without the other founder
   explaining the system live. Repeat in the inverse direction where practical.
5. Make npm the documented primary channel, with rollback understood.
6. Remove the marketplace plugin, committed duplicate executable, resolver, manifests, and
   regeneration/version automation in separate deletion-focused units.

`@agentstate-lite/core` and `@agentstate-lite/server` publication remain separate library/SaaS
boundary decisions. They are not prerequisites for proving the bundled `agentstate-lite` CLI
installation, because that CLI intentionally ships as a self-contained artifact.

## Acceptance proof

The transition is proven when a founder can, on a clean machine or isolated user home:

1. install the npm package;
2. run bare `aslite` and receive directory-scoped live orientation;
3. explicitly install the Agent Skill and SessionStart hook;
4. start a fresh agent session and open an unfamiliar bundle;
5. understand its Kinds/workflows from the bundle and installed guidance;
6. perform an attributed mutation and use its human View surface;
7. remain functional offline after initial installation; and
8. upgrade the npm package without any cached executable or hook path expiring.

Pin mechanically:

- exact npm tarball contents and zero duplicate executable;
- generated skill/help compatibility with the installed CLI;
- skill installation/removal across supported host directories;
- session hooks point at the executable on `PATH`;
- bundle meaning remains readable when the skill is absent;
- a missing CLI produces actionable skill-install guidance rather than a cache search;
- offline operation works after installation.

## Explicit non-goals

- Silent npm `postinstall` mutation of agent configuration.
- Making the skill or hook mandatory for CLI correctness.
- A second recipe parser, marketplace, dependency resolver, or automatic recipe composition.
- Automatically mutating an existing bundle when an npm package or recipe version changes.

## Open implementation choices

- Global npm install versus a managed per-user npm prefix.
- The exact project/global installation shape for Codex and Claude skills.
- Whether one explicit `aslite setup` convenience command eventually composes the separate skill
  and hook installers; the underlying operations remain independently reversible.
- Compatibility and rollback during the short overlap between npm and the marketplace channel.

## Relationship to remote/SaaS extraction

This distribution boundary complements the two-repository direction:

- OSS keeps the engine, CLI, explicit `--remote` wire client/on-ramp, protocol contract, and
  local+git product.
- The private repository consumes published libraries and owns hosted deployment, identity,
  tenancy, billing, and administration.

Converting executable distribution is a parallel simplification; it is not a prerequisite for
other safe OSS work.

[extends](portable-cognitive-ecosystems.md)

[supports](../roadmap-items/radical-simplification.md)

[clarified by](../decisions/oss-wire-server-boundary.md)
