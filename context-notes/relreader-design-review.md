---
type: Context Note
title: Relationship reader — pre-build design review (grouping predicate fixed)
actor: fable-reviewer
timestamp: '2026-07-21T20:43:51.914Z'
---
# Summary

Independent Fable design review of plans/relationship-reader-build (relationship-rich reader,
Decision 2 of designs/document-discovery): APPROVE-WITH-CHANGES, all folded into the plan.
Mechanism verified end-to-end (fetchEdges({from}) works; 525 edges with usable text over the
live bundle). The one required change is the grouping PREDICATE.

# The finding that mattered (empirical)

The first-draft grouping rule (named groups = declared verbs; catch-all = empty-or-id/path
text) has a hole: of 525 edges / 246 distinct texts, 0 are empty and only ~97 are id/path —
leaving ~240 with descriptive PROSE text that are neither declared verbs nor id/path. Under
the literal rule those become named groups: 192 named groups bundle-wide, 157 singletons;
worst doc 10 singleton groups of 1. Fragmentation confirmed.

Fix (the product already owns it): decisions/typed-links-carrier (ratified 2026-07-07) — a
link is a typed edge IFF its display text EXACTLY matches a declared relationship type. The
vocabulary rides /__ui/kinds (KindConvention.links), which DocPage already fetches. So: typed
group = text in the declared-links union; everything else → Related, rendered `text — id` so
the descriptive text (the only human signal on ~40% of edges) is not lost. Real-data result:
~36% typed; worst doc `roadmap` = contains(15) + Related(13). Gate-3 clean (vocabulary from
the bundle, no hardcoded verb list; conventions-free bundle → one flat Related list).

# Other accepted items (all folded)

- Related rows render `text — id`; dedupe identical (to,text) rows within a group for display
  (11 real duplicates today; core's per-literal counts untouched).
- Bare target ids acceptable for v1 (matches shipped Cited-by); NO per-target getDoc calls —
  title resolution falls out when Decision 1's browse index caches all heads.
- Two edge fetches (from + to) stay separate — EdgeFilter ANDs from+to, so one call can't get
  both sides. Per-page cost is 2 full walks; fine at 372, ceiling pre-existing/recorded.
- Dangling targets included by design → land on the reader's not-found state (add a test).
- Three unit pins added: predicate (declared groups / prose→Related), conventions-free→flat
  Related, dangling→not-found. Visual smoke adds `roadmap` as the mixed worst-case.

# Survived attacks

endpoint from-filter semantics (matchesEdgeSelector, exact ids safe), self/duplicate edge
pathologies (0 self, 11 dupes measured), empty-text prevalence (0 — the draft's empty branch
is dead but harmless), /__ui/kinds already carries `links` (no new server surface).
