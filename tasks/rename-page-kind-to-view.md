---
type: Task
title: Rename the Page kind to View (code + reusable bundle migration)
status: done
priority: '2'
description: >-
  BUILD DISPATCHED (Brian greenlit 2026-07-16 after the non-fork analysis: C+ is
  a strict prefix of the parked Option A — later full deprecation loses nothing,
  and the nudge+forward-prefixes freeze the legacy stock so its cost can't
  grow). SHAPE: Option C+ — dual type-read Page|View (until a future deprecation
  decision), forward-only views-registry//views/ prefixes for new content,
  write-time legacy nudge, re-runnable status audit (doubles as the deprecation
  sizing meter), full teaching pass to canonical View. Units: U1 dual reads
  (S/M, building), U2 detection primitive (S, building), U3 teaching pass (M/L,
  queued behind U1). NOT in scope: migration tool, id moves, removal — parked
  with the vetted Option-A blueprint on plans/rename-page-kind-to-view.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-18T18:22:16.123Z'
---
[informed by](joint-ontology-session.md)

- U2 APPROVED (909a9dc, feat/view-legacy-audit, pushed): predicate + nudge + audit;
  both adjudications ruled — no-op-update nudge ACCEPTABLE (authoring-moment rule,
  one-line filter available if fatigue observed); frozen prefix constants SURVIVE
  integration by design (the sizing meter must outlive the live grammar's legacy
  acceptance) with a TRIPWIRE TEST to add at U1+U2 integration: assert the frozen
  constants equal core's legacy values while dual-read exists — no import coupling.
  Bonus verified: the audit works over --remote.

- U1 APPROVED (0dcaa2b, feat/view-kind-dual-read, pushed): dual reads across core
  grammar / shell / both query paths / blob-nonce-watch / recipes. Legacy-only
  regression proven BYTE-IDENTICAL vs main's own bundle (CLI stdout + HTTP incl.
  CSP); red-on-old verified by three revert experiments; all nonce/traversal/cross-
  prefix attacks survived; mixed name/prefix pairings ruled KEEP (consistent,
  no security delta, audit surfaces them). One-registry verdict: PASS with a note —
  the accepted-prefix-pair lists live at ~4 grep-reachable sites; consolidating into
  core ACCEPTED_*_PREFIXES arrays is folded into the PARKED Unit-5/deprecation scope
  (deprecation day = ~4 files today, 1 after that consolidation).

- U3 APPROVED (cf4f0d3+99589d2, feat/view-teaching, pushed): View canonical across
  every teaching surface; examples re-authored under views-*; both distribution-
  resources columns renamed (atomicity verified); deliberate legacy e2e fixture pins
  dual-read in a real browser; tripwire test engages under either merge order; the
  stale-prose CLASS closed with word-boundary grep-pins over all teaching sources.
  Residual (trivial, ride any later ui unit): PageFrame.tsx:117 error string says
  "registered Page" — one-word fix to "registered View". Board docs applied same day
  (how-it-works section 7 + glossary; conventions/view.md).

- U3 EXTERNAL REVIEW (PR #87), two fix rounds, both re-verified and pushed:
  Round 1 (99589d2): three stale canonical-Page help strings purged; word-boundary
  pins close the class over CLI sources + examples. Round 2 (e72917c): P1 —
  repo-level teaching surfaces (npm README, package.json description, root
  CLAUDE.md/README) View-worded; a THIRD pin over repo-level files mechanically
  proven to trip on all 16 pre-fix lines; plugins/ tree excluded as bot-regenerated
  (verified against ci-version-bundle.mjs). P2 — applyRecipe legacy-alias
  satisfaction: complete-pair gating (a partial legacy leftover never suppresses a
  fresh install), probes derived from core constants (non-View recipes unaffected),
  honest receipts {created, existing, legacy_present}; old v1 recipe vendored
  byte-for-byte from ded8183 as the regression fixture. Reviewer independently
  reproduced legacy-install -> renamed-reapply on the built CLI: zero duplicates,
  ONE launcher card, stable third apply. VERDICT: CONFIRMED, APPROVE stands at
  e72917c. Residual CLOSED at d12b402 (test-only): both partial-pair directions pinned in recipes.test.ts; full check green.

- U2 RE-ANCHORED onto post-#83/#86 main (a61c86d, force-pushed): rebase clean, hint
  wiring intact, full check gate green by direct exit code (e2e 14/14). Ready for
  its PR.

- U2 EXTERNAL REVIEW (PR #88, codex): three findings, all fixed at cf8afeb (one commit
  on the reviewed head f76b536) and independently re-verified. P1 — promote's doc route
  now applies the shared legacy nudge (receipt-level, blob route untouched); the
  documented authoring path can no longer grow the legacy stock silently. P2a —
  isLegacyPageDoc is exact (=== "Page"), matching core's registration grammar; the one
  parse layer does no type trimming (YAML trims plain scalars; only a QUOTED " Page "
  arrives padded, and core rejects it) — trim-pinning test reversed in place. P2b —
  legacyPagePrefixOf REMOVED (no second path); store-aware isLegacyRegistryDocId (docs)
  + isLegacyEntryBlobKey (blobs); cross-store decoy pinned, --remote path verified
  identical. Tripwire ran ENGAGED for the first time (frozen exports unchanged); all
  gates direct exit codes 0. Reviewer verdict: CONFIRMED, no new findings. Pushed;
  PR #88 awaits re-review/merge.

## UNIT CLOSED — Option C+ COMPLETE (2026-07-18)

All three units merged to main: U1 dual reads (PR #83), U3 teaching pass (PR #87,
two external-review fix rounds + partial-pair pin d12b402), U2 detection primitive +
nudge + audit (PR #88, one external-review fix round at cf8afeb: promote-path nudge,
exact type match, store-aware prefix audit). The rename is live: View is canonical
everywhere agents learn; legacy Page docs/prefixes keep working under dual-read; the
write-time nudge (doc write/update/new/promote) stops the legacy stock growing; the
status legacy_naming audit is the standing sizing meter for any future deprecation.
NOT done (parked by design): Option-A full migration/removal — blueprint on
plans/rename-page-kind-to-view, gated on a founders' decision informed by the meter.
Residual riding a later ui unit: PageFrame.tsx:117 "registered Page" error string.
