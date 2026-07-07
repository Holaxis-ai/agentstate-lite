---
type: Task
title: 'Graph lints: write-time link-type conformance + expects_inbound status sweep'
status: in_progress
priority: '1'
description: >-
  The enforce stage of the typed-links pipeline, pulled forward after Mike
  correctly applied consumer-pull against my own deferral (three hand-found
  glue-decay incidents WERE the live consumer). expects_inbound convention key
  (parsed like links, sweep-only by nature); link add warns on wrong-kind +
  case-variant edges (warn-only, no-op path unchecked, conventions-free
  byte-identical); status gains link_type_violations + missing_expected_links
  (single-pass, non-done rows first). Dogfood catch on first real run: 5
  violations on our own board incl. a mistyped edge I wrote hours earlier
  (contains -> a Decision) — fixed by declaring the Roadmap kind (contains ->
  Roadmap Item, first multi-declaration) and one text change, NOT by
  suppressing. Day-one board state: violations 0, missing_expected 16 (4 open
  tasks actionable at top, done-tail honest noise; terminal-status refinement
  stays evidence-gated). Built by one Sonnet no-spawn agent; reviewed/verified
  by orchestrator. Plugin 1.0.11; +11 tests (787). PR #7 — done on merge.
timestamp: '2026-07-07T19:43:06.812Z'
---

