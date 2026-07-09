---
type: Decision
title: Typed links = a declared vocabulary over link text (RATIFIED 2026-07-07)
timestamp: '2026-07-07T15:55:38.956Z'
---
# Decision: typed links = a declared vocabulary over link text

**Status: RATIFIED** (Mike, 2026-07-07). Routed to Brian for async objection on the
joint-facing halves (his A1 index schema and canonical-import interop remain his/joint). This decision is deliberately scoped to what lite
can decide reversibly; the non-decisions list is part of the decision.

## The decision (four points)

1. **Carrier: link text.** A link is a **typed edge iff its display text exactly matches
   a declared relationship type**. Every other link — id-default citations, prose links —
   is what it always was: an untyped citation. This resolves the text-overloading finding
   (see [plans/graph-query-v0](../plans/graph-query-v0.md), review outcome): the declared
   vocabulary IS the disambiguator, and undeclared text-as-type is explicitly not the
   model.
2. **Declaration: on conventions, shipped by recipes.** Relationship types are declared in
   convention docs — the kind convention schema grows a `links` declaration naming the
   type and its allowed source kind → target kind (e.g. work-tracking declares
   `contains: Roadmap Item → Task`, `depends on: Task → Task`). One registry (`loadKinds`),
   one discovery prefix, seed-then-own via the existing recipe pipeline. No new document
   type, no new machinery.
3. **Enforcement: warn-by-default, never blocking reads.** `link add` / `doc write` warn
   on a declared-type violation (wrong source/target kind), `--strict` rejects; `status`
   grows the graph lints (type violations; containment expectations like "a Task should
   have a containing Roadmap Item"). Identical posture to kind validation today.
4. **Prose-collision posture: lint, not syntax.** A prose link whose text accidentally
   matches a declared type is surfaced by the warn layer, not prevented by markup. No
   `rel:` prefixes, no wikilinks, no frontmatter edge mirror — bundles remain plain OKF
   v0.1 that any conformant reader parses identically.

## Explicit non-decisions (owned elsewhere)

- The cloud's derived-edge-index schema (Brian's A1 reframe) — his side; this decision
  hands him a concrete parse target (declared-vocabulary edges) rather than constraining
  his index.
- Canonical-import interop (frontmatter-mirror translation for canonical's typed refs) —
  joint, when canonical import is a live workflow.
- The structural-position convention (typed edges in a dedicated body block) — noted as
  current de-facto practice and a possible future *additional* convention; not required
  by this decision.

## Reversibility (why this is decidable without the session)

Reader-side only; zero stored-byte changes. Migrating to any other carrier later is a
mechanical script over already-parseable markdown links, at pre-1.0, on bundles measured
in dozens of docs. The parts that would be genuinely costly to reverse (edges-in-bodies,
derived graph, spec-cleanliness) are already jointly settled by both projects' independent
analyses and are NOT reopened here.

## Build sequencing (the graph-query lesson applies)

Deciding now does NOT mean building now. Per the parked graph-query unit's lesson —
capability ships with its first live consumer — the declaration/validation build lands
with the **work-coordination trial** (first consumer: a declared `depends on` type feeding
the unblocked query, plus guarded update). Until then this decision governs authoring
practice (use declared vocabulary deliberately; `contains`/`supersedes`/`supports`/
`depends on` are the working set) and the ontology conversation with Brian.

## Evidence trail

- [research/work-management-trial](../research/work-management-trial.md) — the ladder and
  the glue evidence (usage side).
- Brian's architecture map (canonical workspace, 2026-07-06) — untyped links as "the
  sharpest fault line"; in-document typed-link convention "answers BOTH projects' open
  question at once" (substrate side).
- [plans/graph-query-v0](../plans/graph-query-v0.md) review outcome — the text-overloading
  census that makes the declared vocabulary load-bearing rather than optional.
- Typed-edge reading v0 merged (PR #3, f64090f) — rungs (a)+(b) working on this board.

## Declarations seeded (2026-07-07, same day)

The working vocabulary is now DECLARED on this bundle's own convention docs (frontmatter
`links` mapping on the SOURCE kind, value = allowed target kind), via pull/promote with CAS:

- `conventions/roadmap-item`: `contains: Task`
- `conventions/task`: `"depends on": Task`
- `conventions/claim`: `supersedes: Claim`

The current kinds loader ignores the key (opt-in data, registry loads clean) — the
validator that reads it lands with the work-coordination trial. Known gap, deliberate:
`supports` (Plan → Roadmap Item) is undeclared because Plan has no governing kind
convention; declaring it needs either a Plan kind or a rule for where kind-less source
types declare — a build-time decision for the trial, not worth inventing machinery for
today. The built-in work-tracking recipe in the REPO gains these declarations when the
validator ships (declaration + machinery arrive together for new bundles, per the
consumer-pull discipline).

## Addendum (2026-07-07, ratified same day): `expects_inbound` — the expectation vocabulary

Mike's "do we really need a session?" applied again: the expectation semantics unbundled to
one reversible reader-side key, no joint dependency (normative, not structural — the cloud
edge index never reads it). RATIFIED: a kind convention MAY declare, on the kind the norm
is ABOUT (the link target), `expects_inbound: {<link type>: <source kind>}` = "≥1 inbound
edge of that type from that kind, else a status lint finding." Sweep-only by nature (a
missing inbound edge is someone else's future write — write-time cannot check it);
unconditional in v1 (no cardinality, no status conditions — the done-task noise is honest,
grouped by status, and only lived annoyance justifies a terminal-status refinement).
Enforcement posture unchanged: warn-only, never blocks reads. Shipped with the graph-lints
unit (PR #7) alongside write-time type-conformance warnings on `link add`. First
declaration: Task expects `contains` from Roadmap Item. Also ratified in passing: `contains`
is now declared by TWO kinds (Roadmap → Roadmap Item, Roadmap Item → Task) — the lint
flagged the spine's previously-undeclared usage and the fix was declaring the vocabulary
the data already used; multi-declaration resolution picks the declaration matching the
actual source kind.
