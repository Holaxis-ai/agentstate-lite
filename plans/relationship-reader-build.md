---
type: Plan
title: Build plan — the relationship-rich reader (one PR)
actor: mike/claude
timestamp: '2026-07-21T20:38:35.818Z'
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
- **Grouping (the one real design decision):** group outbound edges by `text` (the edge's
  relationship label, which core's `queryEdges` already returns). Edges whose `text` is a
  declared typed-link verb (`contains`, `depends on`, `reviews design`, `supersedes`, …) form
  named groups; edges whose `text` is empty or is just the target id/path (an untyped
  cross-link — real in this bundle) collapse into ONE "Related" catch-all. Deterministic
  order: typed groups first (alpha by verb), then Related. Each row: the target's id, clickable
  to its reader route (the SAME `?view=doc&id=` construction the body links use — never a raw
  attribute; the title is not in the edge list, so show the id, or the id as the label).
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

- Unit: DocPage tests extend to assert outbound grouping (typed groups + Related catch-all),
  empty states, and that every relationship row's href is a `?view=doc&id=` route (the
  reader's invariant, reused).
- e2e: a seeded doc with a typed link (`[x](../tasks/y.md)` under a `contains`-style relation)
  renders the grouped relationship, and clicking it navigates.
- **Visual smoke (required): screenshot the relationship reader over the REAL bundle, light +
  dark**, on a doc with rich relationships (e.g. `roadmap-items/launcher-home-surface` — it
  has `contains` edges and backlinks). The build is not done until the screenshots are
  reviewed by eye.
- Full gate + `verify:npm-package` (zero-dep unaffected — no new dep).

## Review tier

Ordinary (read-only, reuses the edges endpoint and the reader's existing href invariant; no
new trust boundary). Independent code review of the exact SHA + repository gate, and the
reviewer must SEE the running page (screenshots provided, or the reviewer boots the built CLI
and captures its own).

[implements Decision 2](../designs/document-discovery.md)

[extends the reader](../designs/doc-reader.md)
