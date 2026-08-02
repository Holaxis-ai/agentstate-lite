---
type: Task
title: >-
  Ship a guidance bundle with the aslite npm package that teaches users how to
  use aslite
status: todo
priority: '2'
description: >-
  Ship a bundle-native onboarding/guidance bundle with the npm package; decide
  install model (silent-auto vs explicit command + destination),
  skill-awareness, and lifecycle (always-available vs one-time wizard vs
  combination).
actor: brian-claude
timestamp: '2026-08-02T15:32:12.127Z'
---
# Guidance bundle shipped with the aslite npm package

## Goal

Ship a **guidance bundle** alongside the aslite npm package that teaches a new user how to use
aslite — a bundle-native onboarding/education surface (aslite teaching aslite in its own medium),
so a first-time user has a concrete, explorable example plus guidance rather than only docs/skill
prose.

## Why

Onboarding today is prose (README + the skill). A shipped guidance bundle makes aslite
self-teaching in its own format and gives a newcomer something real to open, browse, and poke at.
Fits the npm-first, bundle-native-knowledge direction ([distribution-neutral-resources]) and the
installable-operating-model direction ([recipe-plugins]).

## Decisions to make (this is the crux — the task is to decide these, then build)

1. **Install model.** Silent + automatic on `npm install`, OR an explicit CLI command
   (e.g. `aslite guide` / `aslite learn` / a `recipe add`) that lets the user choose a destination
   folder.
   - If AUTOMATIC: WHERE does it land? A fixed per-user home (e.g. `~/.aslite/guide`)? The cwd?
     Automatic-into-a-project risks creating an unwanted bundle or colliding with the standing
     "never init over an existing workspace" rule and the conventional-folder discovery walk.
   - If EXPLICIT COMMAND: avoids that pollution risk and gives a destination choice, but adds a
     discovery step (the user has to know the command exists — see decision 2).
2. **Skill awareness.** Should the aslite skill KNOW about the guidance bundle — recommend it when
   a user seems new or stuck, and/or surface relevant guidance inline while working elsewhere?
   (Requires the skill to reference the guide's existence + how to install/open it.)
3. **Lifecycle.** Always-available reference, a one-time wizard, or a combination. Candidate
   combination: the skill notices a likely-new user and points at the guide -> the user runs a
   one-time wizard and ACKNOWLEDGES having viewed it (a durable marker) -> thereafter the agent
   stops prompting, but the bundle stays available on demand.

## Acceptance criteria (to refine once the decisions above are settled)

- A guidance bundle exists and ships with (or is materialized from) the npm package with no extra
  network beyond the already-installed package.
- The install path is decided and documented, and it NEVER silently creates or clobbers a
  project's own workspace bundle (honor the discovery-walk + "join, don't create a second bundle"
  rules).
- If skill-aware: the skill can recommend the guide and/or surface guidance, gated so it does not
  nag after the user has acknowledged it.
- If wizard: a durable "viewed/acknowledged" marker makes the one-time flow genuinely one-time,
  while the bundle stays browsable afterward.
- Content teaches the core loop (init/sync, docs, links, kinds/recipes, Views, status) through a
  real explorable bundle, not just prose.

## Open questions

- Does the guidance bundle double as the canonical example bundle (replacing/merging
  `examples/sample-bundle`), or is it separate?
- Is it a RECIPE (applied into a bundle) or a STANDALONE bundle the user opens/browses? These are
  different install shapes.
- How does it interact with discovery-before-init ([product-recipe-discovery]) — is the guide the
  thing a bundle-free newcomer discovers first?
- Does the acknowledgement marker live per-user (`~/.aslite/`) or per-bundle, given the same
  person may onboard once across many projects?

## Related

- [distribution-neutral-resources](../roadmap-items/distribution-neutral-resources.md)
- [recipe-plugins](../roadmap-items/recipe-plugins.md)
- [product-recipe-discovery](../tasks/product-recipe-discovery.md)
- [npm-cli-skill-prerelease](../tasks/npm-cli-skill-prerelease.md)

[part of](../roadmap-items/distribution-neutral-resources.md)

[part of](../roadmap-items/recipe-plugins.md)

[part of](product-recipe-discovery.md)
