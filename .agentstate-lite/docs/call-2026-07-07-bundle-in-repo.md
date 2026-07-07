---
type: Doc
title: >-
  Call record 2026-07-07: bundle-in-repo decision, orientation-first UI,
  division of labor
timestamp: '2026-07-07T17:55:53.963Z'
---
# Mike/Brian call, 2026-07-07 — bundle moves into the repo; UI = orientation-first

## Decisions

1. **Bundle location: IN the project repo, committed** (`agentstate/`-style folder at project
   root). Git becomes the async collaboration mechanism between the founders. The PR #2
   "project-owned" binding pattern becomes the DEFAULT; the home-dir pattern demotes to the
   alternative.
2. **This project's own bundle gets checked into the agentstate-lite repo** so Brian's agents
   can pull it. GATE BEFORE PORTING: the repo is PUBLIC — the board carries the production
   worker URL, canonical-AgentState internals, private-workspace references, and the
   pre-public change archive. A scrub/redaction pass (or an explicit "all public" decision)
   is REQUIRED first, same discipline as the pre-open-source scrub.
3. **UI direction (the gate-4 rethink gets its brief):** orientation-first — a welcome page
   teaching the mental model (nodes/relationships/recipes), then generic views rendered from
   whatever recipes the bundle actually adopted (the kinds registry, incl. the typed-link
   vocabulary, is the schema a generic view reads). Brian's new-user experience: the task
   board showed zeros while his agents wrote context notes — "showing false information."
   Open design question Mike floated: recipes MAY carry display hints; later, generative UI.
4. **Division of labor:** Mike merges PR #4 then HOLDS. Brian: skill default-location fix,
   recipe-display question, orientation UI start, power-user recipe experiment (Mike
   especially wants multiple recipes linked/rolling up — the typed-links machinery is
   exactly this). Mike after Brian's changes: port documents into the in-repo bundle;
   consider the git-pull sync mechanism (tasks/git-sharing territory).

## Evidence worth keeping

- Brian (new user): agents use lite seamlessly; the HUMAN cannot tell what value they got —
  the product is invisible when it works. Third independent arrival at the gate-4 problem.
- Mike on canonical's leases: they sometimes ADDED friction (agents left claimed tasks
  open). Real prior for the coordination trial — respect the null hypothesis; claims stay
  consumer-pulled, minimal until need is demonstrated.
- Correction to call memory: shipped built-ins are context-notes + work-tracking (statuses
  only, no claim mechanism); claims is the example folder recipe; no roadmap built-in.

the scrub-gate audit (kept in the private board archive)
