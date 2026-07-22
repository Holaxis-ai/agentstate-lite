---
type: Design
title: Document discovery and relationship navigation
actor: mike/claude
timestamp: '2026-07-21T20:38:35.934Z'
---
# Document discovery and relationship navigation

**Status:** Drafted 2026-07-21; **Decision 1 SHIPPED (PR #149, 2026-07-22)** — Decision 2 shipped as
the inline-edge reader (PR #145). Decision 1's tiering was REVISED during build: the freshness-horizon
split below was replaced by a bundle-declared `browse_collapsed` marker (see the Decision 1 rewrite).
Idea 3 + the deferred/rejected list still stand. Grounded in the live bundle: ~383 docs.

## The gap

The doc reader (PR #138) can render any bundle doc — but it is reachable ONLY through the
home's ~8-row activity feed + deep links. There is no way to reach an older doc, and no way
to see how docs relate. A reader without discovery is legs-less: the reader design's own loop
(agent writes → human reads → human STEERS) requires FINDING last week's decision, not just
today's churn.

## Two shapes of the problem, grounded in real data

The bundle is not a flat list — it is a typed graph. Measured on the live bundle:

- **Distribution is lopsided.** Task 189 + Context Note 61 (agent-to-agent comms + work
  tracking) are ~67%; durable human knowledge (Design 18, Decision 6, Plan 32, Roadmap
  Item 19) is ~20%. A naive recency-sorted flat list buries the 20% signal under the 67%
  churn the feed already shows.
- **The relationships are the spine, not decoration.** 516 edges, dominated by **126
  `contains`** (Roadmap → Roadmap Item → Task — a real work-breakdown TREE) and **42
  `depends on`** (Task→Task), plus `supersedes` (Claim chains), `reviews`, `implements`,
  `informs`. Grouping-by-kind flattens all of that.

So discovery has THREE distinct jobs, and one widget cannot serve all three:

| Job | Question | Surface |
|---|---|---|
| Find | "where's that decision?" | the grouped index |
| Understand structure | "what's the shape of the work?" | the containment outline |
| Explore neighborhood | "what connects to this?" | per-doc typed links + backlinks |

## Decision 1 — the browse index (SHIPPED PR #149; tiering revised)

A **"Browse"** section on the home lists EVERY doc grouped by kind — find any doc, not just the
recent pulse the feed shows.

- **Grouped by kind, size-ordered, capped**: each kind group shows its 6 newest with a "show all N"
  expander; a filter (title+id only — bodies never cross for lists) flattens to a recency-sorted
  match list across every kind. No mode toggle; grouped is the resting state.
- **Collapse is a BUNDLE-DECLARED marker, not a time axis.** A kind renders collapsed-by-default iff
  its convention declares `browse_collapsed: true` (core `KindConvention.browseCollapsed`, parse +
  serialize round-trip); collapsed kinds sort to the bottom, everything else expanded on top. The
  built-in `context-notes` recipe declares it, so context notes collapse out of the box (per-bundle
  overridable); every other kind — including Task — stays expanded.
- **REVISED from the original freshness-horizon tiering** (durable=no-horizon expanded /
  horizon-declaring collapsed). That collapsed **Task** (30d horizon) alongside transient Context
  Notes — wrong: a stale task is still a task you browse. Freshness-horizon is a *staleness* signal,
  not a *browse-prominence* signal; conflating them over-collapsed. So this design's own rejection of
  "a new `browsable` convention field (earn it with usage)" was **overridden** — the declared marker
  IS the honest, kind-agnostic signal, and the founder's call ("don't go based on time") settled it.
- **Conventions-free / unmarked bundles degrade to a plain grouped list** — nothing collapsed
  (gate-3 posture; the shell never names a kind).
- **Free of new server surface**: reuses `ActivityFeed`'s `listAllHeads({})` head fetch + `isFeedHead`
  (the one plumbing filter — conventions + View/Page out); `/__ui/kinds` already serializes the full
  convention, so `browseCollapsed` flows for free.
- **Named "Browse", not "Documents"** — "Documents" collided with the retired capability-section name
  the launcher tests guard against.
- **DEFERRED**: terminal-instance folding (the original "145 closed — show" for Tasks). The cap-at-6
  handles volume for now; a stronger second consumer is the Artifact `active/superseded/archived`
  lifecycle (see [artifacts-as-temporal-outputs](artifacts-as-temporal-outputs.md)) — worth building
  once that lands.

## Decision 2 — the relationship-rich reader (NO-BRAINER; can ship independently)

The doc page already shows "Cited by". Extend it: show TYPED OUTBOUND links GROUPED BY their
declared relationship (`contains: …`, `depends on: …`, `reviewed by: …`, `supersedes: …`) plus
backlinks. Every doc becomes a hub; the bundle becomes walkable as the graph it is. Nearly
free — `queryEdges` already returns each edge's `text` (the type), the reader already fetches
backlinks; add `?from=<id>` and group by `text`. Gate-3 clean: the shell renders whatever edge
TYPES exist, knowing nothing about domain meaning; a bundle with no typed links shows plain
backlinks. NOT entangled with the browse surface — it enriches the doc page that already
ships, so it can be a small standalone PR.

## Idea 3 — the containment outline (the standout structural lens; a real build)

Follow the 126 `contains` edges into a collapsible outline — Roadmap ▸ Roadmap Items ▸ Tasks —
with status ROLLUPS (a roadmap item shows "8/12 done" from its contained tasks). Turns the
browse surface's SECOND lens from "grouped by kind" into "the project's actual shape". Still
format-universal: the shell renders a generic tree of `contains` edges; a bundle declaring no
containment simply doesn't get the lens. Does NOT duplicate the roadmap/task-board VIEWS
(those are domain-interactive kanbans) — this is the readable floor under them, and stays on
the right side of "the shell never grows a task board" (an outline is a reader, not a board).

## Deferred / rejected

- **Typed-relationship pivots** ("everything that reviews this", "the dependency chain of this
  task") — powerful, uses the declared vocabulary as navigation, but needs a starting node and
  more UX. Fast-follow, not v1.
- **Graph visualization (node-link)** — REJECTED. At 372 nodes / 516 edges it is a hairball
  that is pretty and useless; this product already BUILT AND RETIRED React graph/board views
  (recorded human verdict). The only defensible form is a 1-hop local neighborhood around the
  current doc, and even then a styled typed-link list (Decision 2) beats a node-link diagram.

## Sequencing

Recommended: this REPLACES the doc-reader plan's PR-2 "figures". Evidence: exactly 1 of 373
docs contains markdown image syntax at all (the doc-reader design describing the feature) —
figures would ship into bundles with nothing to show, while discovery serves all 372 docs the
day it lands, and it is a low-tier client-side projection vs figures' mint/nonce concurrency
profile. Do not silently drop PR-3 (`open-doc` bridge handoff) — generated Views wait on it;
it trails discovery. Build order: relationship-rich reader (Decision 2 — cheap, do first) →
browse index (Decision 1) → containment outline (Idea 3) → open-doc (PR-3).

Honest caveats (reviewer): (a) discovery's value grows with bundle AGE — a day-zero test-user
bundle is small, though even one enthusiastic session overflows 8 feed slots; (b)
`tasks/bundle-visibility-safeguard` (P1) is the one competing priority — a false privacy
belief is trust-ending for test users in a way a discovery gap is not; it is CLI-side and
parallelizable, build it in a different lane, don't let it slip past the test-user round;
(c) the full-scan-per-render ceiling at MUCH larger bundles is pre-existing feed behavior, a
note for the design, not a blocker.

[the reader this extends](../designs/doc-reader.md)

[the surface this lives on](../designs/home-surface.md)

[what this replaces as the next increment](../plans/doc-reader-build.md)

[reader-enrichment plan](../plans/relationship-reader-build.md)
