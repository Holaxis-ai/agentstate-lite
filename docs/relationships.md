---
type: Doc
title: 'Relationships index: every link label, its tier, and what actually consumes it'
actor: brian-claude
timestamp: '2026-07-14T17:58:09.157Z'
---
## How a label becomes "active" — the mechanism in three tiers

Storage is universal and label-blind: every link is a markdown link in the doc's body
with its label as the link text. "depends on" and the typo "depend on" are stored
IDENTICALLY, and both appear in `link show`, `link list`, and the pages' `edges`
queries. No label is special at storage. A label gains consequences only by climbing
these tiers:

TIER 1 — DECLARED. A kind's convention file lists the label in its `links:` map (e.g.
Task declares "depends on" -> Task). What declaration buys, concretely:

- it appears in `kinds` discovery output, with its #51 machine-readable description;
- `new --link` warns when you use a label the kind didn't declare (teaching, not
  blocking);
- `link add` lints an EXACT match against the declared source/target kinds
  (LINK_TYPE_VIOLATION if a "contains" points at the wrong kind of doc) and catches
  CASE variants ("Contains" -> "did you mean contains", LINK_TYPE_CASE_VARIANT);
- `status` runs the same conformance lint bundle-wide.

Note the deliberate gap: case variants are caught, but WORD typos are not — there is
no edit-distance matching, so "depend on" produces zero warnings anywhere. It is a
legal untyped link, invisible to every consumer of "depends on". (This is the concrete
stake in session decision 2.)

TIER 2 — EXPECTED. A kind declares `expects_inbound` (Task expects a `contains` from a
Roadmap Item). `status` flags every instance lacking a conforming inbound edge
(missing_expected_links), and the Memory page's Wiring panel renders the same rule
live.

TIER 3 — CONSUMED. Code or a bundle page queries the label BY EXACT STRING and does
something with the result. This is the only tier where a label changes what you SEE.

## The relationships index — every declared label and what it actually does

- "contains" (Roadmap -> Roadmap Item; Roadmap Item -> Task). Direction: whole ->
  part. THE MOST ACTIVE LABEL: drives the Roadmap page's per-item progress bars and
  expandable task lists; drives the Memory page's orphan-wiring panel; drives status's
  missing_expected_links sweep (via Task's expects_inbound); drives the Roadmap page's
  stale-status badge. Break this label and the roadmap visualizations go blind.
- "supersedes" (Claim -> Claim). Direction: newer -> older. Drives the Memory page's
  claim-chain collapse (only chain HEADS are shown, with "supersedes N prior") — this
  is why five generations of test-count claims render as one card.
- "depends on" (Task -> Task). Direction: dependent -> prerequisite. DECLARED BUT
  BEHAVIORALLY INERT (audit finding, 2026-07-14): it gets tier-1 lint protection, but
  grep of product code and all three bundle pages finds NO consumer — nothing derives
  "blocked/runnable", orders work, or renders dependency chains from it. The
  task-ergonomics record listed runnable/blocked derivation, but the shipped code does
  not contain it. Writing these links today is documentation, not mechanism.
- "reviews design" / "reviews task" / "reviews roadmap item" (Review -> target kind).
  Direction: reviewer -> reviewed. Declared with lint protection; no behavioral
  consumer found in code or pages — review docs gain structure from it, dashboards do
  not yet read it.
- Undeclared free text (anything else, including typos). Stored, listed, queryable by
  anyone who knows the exact string — but no lint, no expectation, no consumer.

## What this index is for

Session decision 1 ratifies (or edits) exactly this list; decision 2/3 decide what
happens to the undeclared tier; decision 6 extends tier 2. The "depends on" finding is
the sharpest input: EITHER give it a consumer (blocked/runnable derivation in list or
the Board page — it is the obvious next active label) OR acknowledge it as
documentation-only so nobody assumes the system schedules around it. Regenerate this
doc after the session; it should always reflect the audited truth, not aspirations.
