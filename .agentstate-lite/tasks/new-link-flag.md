---
type: Task
title: >-
  new --link "<type>=<target>": one-step create+link riding the declared
  vocabulary
status: done
priority: '2'
description: >-
  SHIPPED in PR #23 (merge 7a81666, plugin 1.0.24; Brian rebased and merged).
  Repeatable --link "<type>=<target-id>" on new: one-step create+link riding the
  declared vocabulary. Core mutation extracted from link add into exported
  addLink (byte-preserving — old suite untouched and green); fail-fast malformed
  values before the doc write; best-effort per-entry processing after with
  honest partial receipts (exactly one envelope, both output modes); undeclared
  types warn (LINK_TYPE_UNDECLARED_FOR_KIND), dangling targets allowed; receipt
  hints drop satisfied types; --remote parity verified. Known limitations
  documented: a kind requiring a field literally named link is uncreatable via
  new (doc write workaround); link add raw/normalized receipt quirk left as
  separate cleanup candidate. Full loop: Sonnet builder, cold reviewer (verdict
  MERGE zero fixes), +10 tests. Origin: external-agent field feedback
  (create-then-link was two steps).
actor: mike/claude
timestamp: '2026-07-09T15:14:10.078Z'
---

