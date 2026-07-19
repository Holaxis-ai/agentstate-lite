---
type: Roadmap Item
title: 'Conformance ergonomics: extend the lenient-create/strict-patch ratchet'
description: >-
  Theme (Mike, 2026-07-19, from the tasks/action-endpoint-auth-pins dogfood
  moment): the kind-conformance pattern prices failure in deltas — extend that
  pricing where it doesn't reach, shrink remaining round-trip costs. Five
  children in two confidence tiers. TIER 1 (100% confident, DO NOW):
  tasks/kind-error-completing-command (refusals emit a ready-to-run completing
  argv), tasks/status-conformance-debt (status surfaces bundle-level debt
  count), tasks/ratchet-semantics-decision (record aggressive-ratchet-on-touch
  as deliberate — docs only). TIER 2 (PROVE EMPIRICALLY FIRST):
  tasks/overwrite-ratchet-survey (close the overwrite hole ONLY after a
  call-site survey + suite probe proves no legit flow regresses;
  retype/migration edges need a decided hatch), tasks/kind-field-defaults
  (PARKED until a second concrete case demonstrates a default that isn't a small
  lie). Sequencing: tier-1 code units are independent of each other and of tier
  2.
actor: mike/claude
timestamp: '2026-07-19T02:48:11.715Z'
---
Origin: the write/update asymmetry analysis (title-omission failure cost = one 10-line envelope + a 2-flag patch). Principle: strictness at mutation time proportional to the delta; leniency at creation so payloads are never hostages to metadata.
