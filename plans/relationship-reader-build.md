---
type: Plan
title: Build plan — the relationship-rich reader (one PR)
actor: mike/claude
timestamp: '2026-07-21T20:44:03.327Z'
---
# Build plan — the relationship-rich reader (one PR)

**Status:** Planned 2026-07-21. Implements Decision 2 of
[the discovery design](../designs/document-discovery.md) — the no-brainer, shippable
independently of the browse surface. Builders: Mike + Claude. NEXT: design review of this
plan, then build, then code review WITH visual verification (agents see the running page).

## Claim

The doc reader shows a doc's RELATIONSHIPS, so the bundle is walkable as the typed graph it
is: typed OUTBOUND links grouped by their declared relationship, plus the existing "Cited by"
backlinks. Every doc becomes a hub.

## Scope (packages/ui only; no server/core change)

- `DocPage.tsx`: add an outbound-edges query — `fetchEdges({ from: docId })` (the endpoint and
  client already exist; backlinks already ride `fetchEdges({ to: docId })`). Live: the
  existing SSE change/resync invalidation already refetches on doc change — extend it to the
  new query key.
- **Grouping (the one real design decision; predicate fixed by design review):** a typed group
  is an edge whose `text` EXACTLY matches a declared relationship type — the product's ratified
  model (`decisions/typed-links-carrier`: "a link is a typed edge iff its display text exactly
  matches a declared relationship type; undeclared text-as-type is explicitly not the model").
  The vocabulary is the UNION of every kind's declared `links` (and `expectsInbound`) verbs,
  read from `/__ui/kinds` — which `DocPage` ALREADY fetches for its chips — so it is
  bundle-sourced, never a hardcoded verb list in the shell (a conventions-free bundle has an
  empty vocabulary → one flat Related list = a plain link list, gate-3 posture). EVERYTHING
  not in the vocabulary — descriptive prose text, id/path-shaped text, empty — goes to
  **Related**, and a Related row renders `text — id` (the shipped backlink-row idiom) so the
  descriptive text (the only human signal on ~40% of edges) is not lost. Measured on the live
  bundle this yields ~36% typed / worst doc `roadmap` = contains(15) + Related(13) — sane;
  the naive "declared-verbs-plus-id-heuristic" rule the first draft carried would have produced
  192 named groups / 157 singletons (design review, empirical). Deterministic order: typed
  groups first (alpha by verb), then Related. Each row's href is the SAME `?view=doc&id=`
  construction the body links use — never a raw attribute. **Dedupe identical `(to, text)` rows
  WITHIN a group for display** (core keeps per-literal-link counts — 11 real duplicates today;
  display dedupes, core untouched), index-suffixed React keys regardless.
- **Backlinks unchanged in behavior**, restyled to sit beside the new outbound section under
  one "Relationships" region: "Links" (outbound, grouped) + "Cited by" (inbound).
- Empty states: a doc with no outbound links shows only "Cited by"; a doc with neither shows
  a single quiet "No links yet." Terminal/removed-doc states are unchanged (already shipped).

## Non-goals (explicit)

- No graph visualization (rejected in the design). No containment OUTLINE (that is Idea 3, a
  separate build). No typed-relationship pivots. No new server endpoint (reuse `/__ui/edges`).
  No body-link change — the in-body links already resolve through the reader; this is the
  FOOTER relationship region only.

## Verification (the loop's back half — agents SEE it)

- Unit (three pins the design review named, plus the invariant): (i) the PREDICATE — a
  declared-verb `text` groups under that verb; undeclared prose `text` lands in Related as
  `text — id`; (ii) a conventions-free (empty-vocabulary) registry → a single flat Related
  list; (iii) a dangling-target row navigates to the reader's existing not-found state; (iv)
  every relationship row's href is a `?view=doc&id=` route (the reader's invariant, reused);
  plus within-group dedupe of identical rows.
- e2e: a seeded doc with a declared-verb typed link renders the grouped relationship, and
  clicking it navigates.
- **Visual smoke (required): screenshot the relationship reader over the REAL bundle, light +
  dark**, on `roadmap-items/launcher-home-surface` (contains + prose + backlinks) AND `roadmap`
  (contains(15) + id-texts(13) — the mixed worst-case stress doc). The build is not done until
  the screenshots are reviewed by eye.
- Full gate + `verify:npm-package` (zero-dep unaffected — no new dep).

## Review tier

Ordinary (read-only, reuses the edges endpoint and the reader's existing href invariant; no
new trust boundary). Independent code review of the exact SHA + repository gate, and the
reviewer must SEE the running page (screenshots provided, or the reviewer boots the built CLI
and captures its own).

[implements Decision 2](../designs/document-discovery.md)

[extends the reader](../designs/doc-reader.md)
