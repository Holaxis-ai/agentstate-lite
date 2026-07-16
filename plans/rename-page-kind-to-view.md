---
type: Plan
title: >-
  Plan: rename the Page kind to View — dual-read window, shipped migration tool,
  gated removal (UNDER VETTING)
actor: brian-claude
timestamp: '2026-07-16T15:31:48.395Z'
---
Binding implementation plan, code-grounded (2026-07-16, planner agent; VETTING IN
PROGRESS — a skeptic + mechanic panel adjudicates before any build). Goal: remove the
Page-vs-pages interface defect WITHOUT stranding any project's dashboards.

## Adjudication: reject the clean break — ship a dual-read window

The task's provisional clean-break lean is OVERTURNED by distribution mechanics: the
plugin updates via marketplace independently of any bundle's data migration. A
clean-break release makes every project that updates the plugin before migrating lose
its dashboards silently — on N bundles we don't control. Adopted shape: Release 1
dual-reads Page+View, ships the migration tool, and surfaces a loud legacy notice;
Release 2 removes dual-read once the ecosystem converges.

## The skew matrix

- old code / old data: renders (status quo).
- NEW code / OLD data: renders via dual-read — THE load-bearing safe state (the state
  every project sits in right after updating, before migrating).
- new code / new data: renders (steady state).
- new code / mid-migration twins: launcher dedups (prefers views-registry/). Safe.
- OLD code / NEW data: INVISIBLE — the dangerous cell. Prevented by an ordering GATE,
  not code: never migrate a shared board until every machine syncing it is on
  Release 1.
- removal release / un-migrated data: INVISIBLE — why Release 2 is gated on founder
  confirmation + a grace window of legacy-notice nagging.

## 1. Inventory (code-grounded; file:line)

Core grammar: core/src/page.ts (isPageRegistryId hardcodes pages-registry/,
isPageEntryKey hardcodes pages/), + core tests. UI shell: ui/src/pages/registry.ts:33
(type === "Page"), pages/bridge.ts:187/189 (open-page + usage string),
api/pages.ts:45-46 (listPages type query), views/Launcher.tsx:99 (prose + grouping),
PageFrame(+tests), App.tsx, routing.ts (view=page is an internal SPA route, distinct
from the kind). CLI ui plumbing: cli/src/ui/pages.ts:19 (PAGE_BLOB_PREFIX),
server.ts:137/151/187-192/320-348 (nonce allowlist + /__page route), watch.ts (hot
reload). Recipes/distribution: recipe-parser.ts:224-238/479-484 (grammar + type
requirement + error strings), recipes.ts:341-504, distribution-resources.ts:38-72/135/
158-159 (NOTE: its pages/ keys are skill resource-namespace keys, NOT the blob prefix
— do not conflate), reference.ts:27/157/171, skill-render.ts. Docs/fixtures:
docs/how-it-works section 7 + glossary, board conventions/page.md,
designs/page-model-and-viewer-deprecation.md, examples/pages/**,
examples/recipes/review-workflow/**. THIS BOARD: conventions/page.md, 8
pages-registry docs, 8 pages/ blobs, REAL inbound links (review-requests/
kinds-and-descriptions-architecture.md:439 and others).

## 2. Bridge message: KEEP open-page permanently

The wire verb is embedded in every shipped dashboard's bridge client (immutable blob
bytes across all bundles). The founders' defect is the KIND name in agent teaching;
the bridge verb is internal ABI, invisible to kind-authoring agents. Renaming it
breaks every existing dashboard's navigation and buys nothing.

LOAD-BEARING SUBTLETY (the thing a naive implementation gets wrong): some dashboards
HARDCODE navigation target ids in their bytes (e.g. "pages-registry/reviews" per
plans/review-request-workflow.md:112). After migration that doc has MOVED — dual-read
prefix acceptance does not save a target whose doc is gone. RESOLUTION: during the
window, open-page/resolvePageTarget ALIAS-NORMALIZE a legacy pages-registry/<x>
target to views-registry/<x> when the former is absent and the latter present. Part
of Unit 1.

## 3. The migration tool

SHIP IT IN THE PLUGIN as a first-class subcommand (aslite migrate page-to-view) — the
decisive difference from sync --migrate's ship-use-delete: this tool must reach OTHER
projects, which only the marketplace-distributed CLI can do. Composes existing
verbs/engine primitives; no new engine capability.

Per-doc mechanics (create-new BEFORE delete-old, crash-safety-critical): (1) copy
blob pages/<e> -> views/<e> (expect-absent CAS); (2) write views-registry/<x> with
type View + entry views/<e>, all else preserved (expect-absent CAS); (3) rewrite
INBOUND LINKS bundle-wide (relative + bare forms), read-CAS-write each; (4) delete
old registry doc; (5) delete old blob. Once per bundle: conventions/page.md ->
conventions/view.md (governs View, path views-registry/).

Idempotency/resume: presence-keyed steps — twins mean resume; both-new means skip;
double-run is a no-op; mid-crash leaves twins the dual-read launcher dedups and re-run
completes. Preview-first by default, --yes to execute (house pattern), AXI receipt
with counts. CAS everywhere: VersionConflict aborts that doc with a report, never
overwrites. NOT touched: blob internals (embedded open-page calls + hardcoded ids —
carried by alias-normalization), non-Page docs, other bundles. Weird inputs
(malformed entry, mid-path .md, missing blob): SKIP with collected warning, listed in
preview, never thrown.

Tests (HIGH risk, adversarial QA): MemoryBackend units per step + idempotence +
CAS-conflict abort + link rewrite + weird-skip + convention rewrite; a full-bundle
integration against a COPY of this repo's board (8 docs/blobs, real links); a
crash-resume test (kill after step 2, re-run completes). First LIVE run: this board.

## 4. Rollout

RELEASE 1 (units 1-4, one bot version): dual-read + tool + legacy notice. Then live
migrations in order: (1st) this repo's board — GATE: both founders' machines on
Release 1 first; (2nd) the founders' other bundles (strategy-execution etc.), each
after confirming its plugin is current. RELEASE 2 (unit 5): remove dual-read +
prefixes + alias-normalization + notice. Wake condition: founders confirm their
bundles migrated AND a grace window has passed. Until then dual-read stays (parked
with written wake condition, per house discipline).

## 5. Units + risk tiers

- UNIT 1 — dual-read recognition (MEDIUM): grammar accepts both prefixes (design
  question FOR THE PANEL: parameterize core/page.ts vs parallel module — gate 3's
  one-grammar rule argues parameterization); type match accepts Page+View at
  registry.ts/api/server; nonce+blob guards both prefixes; launcher twin-dedup;
  alias-normalization; recipe-parser both prefixes. Red-on-old pins both directions +
  alias test + dedup test.
- UNIT 2 — migration tool (HIGH, destructive writes -> adversarial QA): as section 3.
- UNIT 3 — legacy notice (LOW): launcher banner + status lint when legacy Page
  content present, naming the exact command.
- UNIT 4 — teaching channel to canonical View (MEDIUM — regenerated prose can go
  silently false): reference.ts, skill-render, how-it-works section 7 + glossary +
  system-kind note, conventions, examples/pages -> examples/views (cascades into
  distribution-resources path maps), review-workflow recipe, page-authoring
  reference. check:skill regen in-PR; re-read regenerated prose.
- UNIT 5 — removal (MEDIUM, GATED behind Release 2's wake condition): drops
  dual-read; Unit 1's pins flip to assert Page rejected.
Every unit: Builder -> independent Reviewer -> QA; worktree isolation; npm ci fresh.

## 6. Failure modes

Mid-migration crash (ordering + resume + dedup = no loss); double-run (no-op);
hand-authored weird docs (skip + preview listing); hardcoded blob target ids (alias
normalization through the window; authoring guidance says re-author before Release
2); sync carrying a migrated board to an old-plugin teammate (the invisible cell —
prevented by the rollout GATE, not code); CI bot regen interplay (PRs never touch
manifests/bundle; unit 4 regenerates the PR-gated npm SKILL.md; branch each unit from
CURRENT main).

## Open item for the panel

Parameterize the one grammar module vs add a parallel views grammar — planner
recommends parameterization (one module, two prefix constants); flagged as the
review-worthy design decision inside Unit 1.

[plan for](../tasks/rename-page-kind-to-view.md)
