---
type: Plan
title: 'Graph-query v0: one engine atom, one CLI verb'
timestamp: '2026-07-07T14:40:59.847Z'
---
# Graph-query v0 — one engine atom, one CLI verb

**Design goal: maximal simplicity.** The smallest capability that converts this week's
per-doc hand-loops into whole-bundle calls — and nothing else. Everything contentious is
in the non-goals list, on purpose: additions require a new decision, not a new flag.

## Why (evidence, not speculation)

Dogfooding typed-edge reading v0 left a family of questions that are all the same shape —
"give me the bundle's edges, filtered" — and today each one is a per-doc loop or impossible:

- **Vocabulary census**: all distinct link texts with counts — the empirical input the
  Mike/Brian ontology session should start from (what relationship vocabulary actually
  emerged, before formalizing rung c).
- **Ownership/containment sweep**: every `contains` edge into `tasks/` in one call (the
  glue-decay finding of 2026-07-07 was located by hand).
- **Deprecation blast radius**: everything citing a deprecated claim (the claims recipe's
  citations-as-links design assumes this query exists; today it is per-doc `link show`).
- **The UI rethink's data layer**: every candidate view is a graph query rendered.

One generic capability covers all of these. Ten bespoke features would each cover one.

## What ships

### 1. Engine: `queryEdges(bundle, filter) → Link[]`

The whole-bundle derived edge list, filtered. This is the atom; everything else consumes it.

- `filter: { from?, to?, text? }` — each of `from`/`to` accepts a ConceptId, a
  trailing-slash `prefix/`, or (programmatically) an array of either (union). `text` is
  exact-match.
- **Implementation is a generalization, not an addition**: `backlinks(bundle, id)` is
  already this scan hard-wired to one filter; it becomes `queryEdges({to: id})`. Net core
  LOC is expected to be ~zero or negative. ONE resolver, ONE walk — gate 3 preserved.
- Dangling edges included: a link to a doc that does not exist is still an edge (the
  unresolved-link lint and pre-delete impact checks depend on seeing them).
- Deterministic output: sorted (from, to, text). Per-literal-link rows (the counting
  semantics pinned by typed-edge reading v0 — two literal links are two edges).

### 2. CLI: `link list`

```
link list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--group-by text] [--limit <n>] [--remote <url>]
```

- Row schema `{from, to, text}` + `count` (AXI minimal; no `--fields` hatch until a
  consumer needs one). `--from`/`--to` repeatable (union) so a blast-radius id set is one
  call, not M.
- `--group-by text` returns the histogram `texts[N]{text, count}` instead of rows — the
  census. No other group-by dimension in v0.
- Zero-match with `--text` reuses the near-miss hint verbatim (names the texts present).
  Definitive empty states throughout. Errors, exit codes, TOON: as everywhere else.
- Trailing `/` means prefix, anything else is an exact id — one rule, no glob syntax.

### 3. Consumers refactored, none added

`link show`'s backlink path consumes `queryEdges` (deleting its private scan). `status`,
viewer, ui: untouched. Remote: client-side over the existing `readMany` batch, exactly
like `backlinks()` today — one round trip, no wire change, no seam change.

## The composition pattern (instead of joins)

v0 ships **no join surface**. Cross-referencing edges with doc fields is two calls and a
client-side join by id, documented as the pattern:

- Blast radius: `list --type Claim --field status=deprecated` → `link list --to <ids…>`.
- Rollup: `link list --from roadmap-items/x --text contains` → `list --type Task` (status
  column), join client-side.

If lived experience shows 2-call composition is genuinely painful for agents (token cost,
error rate), THAT evidence reopens the join decision — with worked examples in hand.
Engine-side consumers (the future UI query layer, `status` lints) compose `queryEdges` +
`query` in-process and never pay the 2-call cost at all.

## Non-goals (the restraint boundary)

- No edge flags on `list`/`query` (no join surface, no `--linked-to`).
- No for-all/unblocked predicate — arrives only with the work-coordination trial that
  needs it, as a named predicate, never a general expression language.
- No multi-hop / transitive traversal.
- No stored or derived index, no `StorageBackend` change, no wire route. Remote graph
  queries ship bodies (one `readMany` round trip) — fine at current bundle sizes; the
  documented check that gap 2 (change cursor) + a rebuildable index cash later, behind
  this same function signature.
- No regex, substring, or case-insensitive matching. No href matching.
- No query language, ever, per the standing restraint list.

## Semantics pinned (reused verbatim, nothing invented)

Exact text match · per-literal-link counting · edges derived never stored (gate 2) · the
one link resolver (gate 3) · reader-side only, zero stored-byte changes · bundles remain
plain OKF v0.1.

## Cost

Small. Core: generalize an existing function (likely net-negative LOC). CLI: one verb the
size of `link show`, tests mirroring `link.test.ts` + one remote-parity test. Plugin
bump + drift-gate regeneration. Estimate: one Sonnet-agent session, orchestrator-reviewed.

## Worth-it test (how we decide after review)

Ship if BOTH hold: (1) the census on this board produces genuinely useful ontology-session
input; (2) the 2-call composition pattern is judged agent-ergonomic for blast radius —
i.e., deferring joins is a simplification, not a deferral of the actual value. If (2)
fails, the right answer is NOT joins-in-v0 — it is questioning whether v0 is worth
shipping before the coordination trial forces the real requirements.

## Review outcome (2026-07-07) — PARKED, do not build yet

One Fable no-spawn reviewer dug in, code-verified against main, the PR #3 branch, and the
live board. Verdict: at most the engine atom, only after PR #3 — do NOT ship `link list`
or the census. Orchestrator decision, one notch further: **PARK the whole unit** — a
consumer-less engine function is inventory too; `queryEdges` ships inside the first unit
with a live consumer.

Findings that decided it:

1. **Unstated dependency:** this doc's baseline (`backlinks()→Link[]`, `--text`, the
   near-miss hint) is PR #3's branch, not main (the work was reverted into the PR). The
   "net-zero core LOC" claim is wrong-signed even post-merge — prefix/union/sort matching
   is net-new code.
2. **The census already ran and failed.** The reviewer executed it by hand on this board
   (one grep, free): `contains` 11, `supersedes` 2, `supports` 1 — drowned by ~85% noise
   (11 distinct id-default texts from `link add`'s default, plus count-1 prose fragments).
   On a board whose deliberate vocabulary the team itself typed this week, the census
   tells us nothing we don't know. The worth-it test was decidable without building — and
   the answer was no.
3. **The finding that replaces the census as ontology-session input:** OKF link text is
   OVERLOADED — human display text on prose links AND relationship carrier on typed
   links. Any rung (c) design must separate deliberate typed edges from citation noise.
   This is a real, new constraint discovered by running the experiment.
4. **No live consumer:** UI paused (gate 4), ownership sweep already done, blast radius
   speculative until the claims workflow is live. This doc's own "reopen with evidence"
   rule applies one level up: the verb arrives WITH its first consumer.
5. **If ever built, pin with worked examples:** `count`/`--limit` under `--group-by`
   (a capped histogram silently drops the long tail — the part a census wants most),
   cross-flag AND vs within-flag union, exact-id input normalization, output ordering.
6. Census caveat for the record: the resolver drops reserved-file links, so any census
   counts resolved concept edges, not all markdown link text.

**Wake conditions (what un-parks this):** the work-coordination trial's unblocked query,
or a live claims blast-radius workflow. Build `queryEdges` + whatever CLI face that
consumer needs, together, semantics pinned against its real examples. Wire push-down is
not foreclosed (`capabilities().backlinks` is the existing v1 hook).
