---
type: Design
title: Document discovery and relationship navigation
actor: mike/claude
timestamp: '2026-07-21T20:38:35.934Z'
---
# Document discovery and relationship navigation

**Status:** Drafted 2026-07-21, exploring the increment AFTER the doc reader shipped (PR #138).
Prototyped (claude.ai artifact, private) and design-reviewed by an independent Fable agent
(grouped+horizon recommendation, folded below). Not yet build-committed; recommended to
REPLACE the deferred "figures" PR as the reader's next increment. Grounded in the live bundle:
372 docs, 516 typed edges.

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

## Decision 1 — the browse index (reviewer-validated)

A "Documents" section on the home, grouped by kind, TIERED by the bundle's OWN declarations:

- **Durable kinds** (Design/Decision/Plan/Roadmap Item — declare NO freshness horizon,
  because they don't go stale) sit at top, expanded.
- **Horizon-declaring kinds** (Context Note 24h, Task 30d — the bundle's own statement that
  instances are recent-relevant) sit below, COLLAPSED with a horizon tag. One click to open;
  nothing hidden. Kind-LEVEL, never instance-level (stable, inspectable).
- **Conventions-free bundles degrade to a plain list** — nothing declared, nothing tiered
  (gate 3's posture; matches home-surface's "grouping is a bundle-authored decision").
- **Tasks fold their terminal instances** ("145 closed — show") via the existing
  `applyRowFilters` open-filter; recency-sort otherwise buries the 44 open under the closed.
- **No mode toggle**: grouped is the resting state; typing in search (title+id only — bodies
  never cross for lists) or tapping a kind chip flattens into a filtered list; clearing
  returns to groups.
- **Free of new server surface**: `ActivityFeed` already fetches EVERY head via
  `listAllHeads({})` and shows 8; browse is a pure client re-projection of data already in
  the query cache. Reject: a hardcoded durable-kind list (shell growing domain opinion), and
  a new `browsable` convention field (front-loads a field every existing bundle lacks — earn
  it with usage). The ephemeral/durable split rides the ALREADY-SHIPPED
  `freshnessHorizonMs` over `/__ui/kinds`.

Story: notes and open tasks LIVE IN THE FEED (recent-relevant, by their own horizons); browse
leans durable. Not "hide the notes" — the two surfaces have different jobs, and the bundle's
declarations already say which docs belong to which.

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
