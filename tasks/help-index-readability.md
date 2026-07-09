---
type: Task
title: >-
  Top-level --help is the worst surface in the tool: TOON-serialized command
  specs on giant single lines
status: done
priority: '2'
description: >-
  SHIPPED in PR #22 (merge 2b0c727, plugin 1.0.23). Top-level --help is now a
  grouped plain-text index — helpIndexText renders the ONE command registry
  (COMMAND_GROUPS untouched) as one command per line with wrapped footer
  pointers; TOON stays the codec for data surfaces. Subcommand help, bare home
  view, and both SKILL channels provably unchanged. Also carried the brian-fleet
  U4 review nit filed onto this task: compactCommandReference now Set-dedupes
  usage variants (key mint, key mint), pinned per-group. Full loop: Sonnet
  builder, one cold reviewer across both sibling units, verdict MERGE zero
  fixes, +13 tests. Origin: external-agent field feedback (the index was the
  worst surface in the tool, per that agent).
actor: mike/claude
timestamp: '2026-07-09T15:06:02.394Z'
---


- Inherited from the U4 review (2026-07-08, pre-existing nit, empirical): home's
  "API keys" command group renders "key mint, key mint" — the two key-mint usage
  variants (self-serve vs --agent) collapse to duplicate labels in the compact
  reference. Dedupe or label-distinguish when reworking the help surfaces.
