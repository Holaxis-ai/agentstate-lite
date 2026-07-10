---
type: Task
title: >-
  Graph-query v0: queryEdges engine atom + link list CLI verb (woken — the UI is
  the consumer)
status: done
priority: '1'
description: >-
  WOKEN from plans/graph-query-v0 (parked 2026-07-07 pending a live consumer).
  Wake condition MET: the bundle-pages UI needs edge queries
  (backlinks/containment) for the roadmap page. Shipping as its OWN PR (own
  merits: CLI edge queries — containment sweep, deprecation blast radius) so the
  UI PR can then rebase + surface queryEdges through the bridge as a thin proxy.
  Scope per the plan: engine queryEdges(bundle, {from?,to?,text?}) generalizing
  the existing backlinks() (one resolver/one walk, gate 3, reader-side only, no
  wire/seam/index change; dangling edges included; deterministic sort;
  per-literal counting), + CLI 'link list' (--from/--to/--text with
  prefix+union, --limit; remote via readMany). REFINEMENT vs the plan: the
  --group-by census failed its worth-it test in the parked review (~85% noise,
  link-text overloaded) — the EDGE QUERY is the value; treat census as a cheap
  ride-along or drop it. Sonnet build to the plan, Fable review. Builds in
  parallel with the UI branch (core/cli, not packages/ui).
actor: mike/claude
timestamp: '2026-07-10T01:38:32.697Z'
---
[implements](../plans/graph-query-v0.md)
