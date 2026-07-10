---
type: Design
title: 'Human window: one page primitive, and retiring the static viewer'
description: >-
  Plan of record (rev 3): unify local HTML onto type:Page with an ENFORCED
  bridge:none|bundle-read field; retire the static viewer. Whole-bundle graph
  decided (accept loss). Unit A (bridge capability) in progress.
actor: mike/claude
timestamp: '2026-07-10T19:37:00.639Z'
---
# Human window: one page primitive, and retiring the static viewer

**Status:** Plan of record — converged with Mike (2026-07-10), then revised the same day
incorporating a technical design review. Four corrections folded in: (1) make the data/content
distinction ENFORCED, not cosmetic; (2) be honest that the viewer's baked-data snapshot and its
whole-bundle graph are being *removed*, not *subsumed*; (3) separate byte-portability from
sandboxed-portability and add Page integrity diagnostics; (4) correct the storage model and
expand the blast radius. **Whole-bundle graph decision made (2026-07-10): accept its removal.**
Execution started — Unit A in progress (see Execution status at the end).

## Why now

- The generative UI (bundle pages) is shipped, working, and dogfooded on this board (Board /
  Roadmap / Pulse / Memory pages). Human verdict: lean into it.
- Gate 4 (CLAUDE.md) kept the static viewer "until the UI's views supersede it." Leaning into
  generative UI is that supersession — this unblocks the deprecation honestly, not by jumping
  the gate.
- The reframe that shaped this: two HTML use-cases — HTML that **displays bundle data**
  (data pages) and HTML **created without bundle data** (content pages) — are the SAME
  mechanism, not two features.

## The model: one page primitive, two usage patterns — ENFORCED

A bundle page = a self-contained HTML blob under `pages/`, a `type: Page` registry doc, rendered
by `ui` in a sandboxed, opaque-origin iframe. Today the bridge is available to ANY framed page —
the shell brokers requests for every page (`packages/ui/src/views/PageFrame.tsx`) — so a page's
data access is NOT currently gated by its registry doc. Left there, "content page" would be
presentation metadata, not an enforced distinction.

So add a REQUIRED field to the `Page` convention (which today declares only `title`, `entry`,
`description`):

```yaml
bridge: none | bundle-read
```

- **`bundle-read`** — data page: the shell answers bridge requests (`query`/`read`/`edges`/
  `subscribe`) with live bundle data. Board, Roadmap, Pulse.
- **`none`** — content page: the shell DENIES all bridge requests; arbitrary self-contained HTML
  (a report, a rendered design doc, a diagram, a notebook export).

That one field is load-bearing four ways: it (1) **enforces** bridge access at the broker — a
`none` page's requests are *refused*, not merely unused; (2) groups the launcher; (3) defaults
SAFELY on a malformed/absent value (→ `none`, deny); and (4) is the first rung of per-page
scoping (`tasks/ui-pages-per-page-scoping`) — `bundle-read` later subdivides into narrower
scopes. Enforcement lives at the bridge broker; launcher grouping is a read of the same field.
Existing Page docs + examples declare it in the SAME unit.

## Portability: byte-portable is free; sandboxed portability is not

Two distinct claims, kept separate (my first draft conflated them):

- **Byte portability — free.** A content page's blob is a self-contained HTML file:
  `pull --doc-key pages/x.html --out x.html` (or the source you authored) opens directly in any
  browser. Nothing to build.
- **Sandboxed portability — NO.** The sandbox + CSP are supplied by the `ui` runtime at
  serve/frame time (`packages/cli/src/ui/pages.ts`). Opening the pulled HTML directly (`file://`)
  REMOVES that confinement — it runs with full local privileges. So **direct-open HTML must be
  trusted**; the sandbox is a property of viewing *inside* `ui`, not of the file.
- **Data pages are not portable standalone at all** — opened without the `ui` shell, the bridge
  has no peer, so data never loads (the reason a bundle page can't run as a Claude artifact).

## What we deprecate, and why

**Deprecate:** `packages/viewer` (the static-HTML visualizer engine) + the `view` command
(`view` → `viz.html`).

**Why:**

- It is a SECOND HTML-generation engine and a separate command, parallel to the page model.
  Gate 3 wants ONE viewer engine; the page primitive becomes that surface.
- Interactive / graph viewing is superseded by live data pages.
- Its portability is ALREADY compromised: `viz.html` inlines the bundle DATA but **CDN-loads its
  render libraries** (Cytoscape / marked / DOMPurify) — an offline recipient sees a blank shell,
  which `view.ts` already emits as a note. It was never the fully-offline artifact it looks like.

**The capabilities we are deliberately DELETING** (stated honestly — not "subsumed"):

1. **Baked live-data export.** A generic "snapshot any page" protocol is a POSSIBLE FUTURE
   replacement, **not an existing substitute** — snapshotting arbitrary asynchronous HTML
   (canvas, scripts, subscriptions, readiness) is not a trivial generic transform.
2. **The generic whole-bundle graph.** The viewer draws a whole-bundle graph for ANY bundle with
   zero authoring. The current Roadmap graph page is BESPOKE (roadmap items only), not a generic
   substitute. **DECIDED (2026-07-10, Mike): accept the loss** — we will NOT ship a generic
   Explorer Page. The generic whole-bundle graph goes with the viewer; if graph viewing is wanted
   later it is authored as an ordinary data page. This unblocks the deletion (step 3).

**Blast radius** (viewer is a LEAF — only the CLI consumes it):

- `packages/viewer/` workspace (~10 src files)
- `packages/cli/src/commands/view.ts` + the `view` dispatch in `cli.ts`
- `reference.ts`: the `view` usage + the Bundle command group (`init, view, status` → `init,
  status`) — regenerates SKILL / home
- **`skill-references.ts`** (`COMMAND_CONTRACTS` carries `view: []`) + **`skill-render.ts`** —
  removing `view` must drop its `COMMAND_CONTRACTS` key IN LOCKSTEP with `reference.ts`, or the
  distribution exhaustiveness gate (`skill-distribution.test.ts`) goes red
- `packages/cli/build.mjs` + `scripts/build-bundle.mjs` viewer alias; `packages/cli/package.json`
  dependency; **`package-lock.json`**
- root `package.json`: the **`build` / `typecheck` SCRIPTS** (which explicitly
  `-w @agentstate-lite/viewer`) + the **description** ("bundles core + viewer"). NOT a
  "workspaces list" — that is a `packages/*` glob and drops the directory automatically.
- **`packages/cli/README.md`** + package descriptions
- `CLAUDE.md`: gate 1's `view` AXI principle, gate 4's "viewer kept until superseded," the
  sample-bundle smoke test (`view` → 4 nodes / 7 edges)
- tests: the viewer suite, any cli `view` tests, and **home-view tests that suggest `view`**
- **core comments naming the viewer** (`core/src/index.ts`)

**Unaffected / kept:** the `ui` command, bundle pages, the bridge, the `promote`/`pull`/blobs
byte channel. Local HTML publishing is fully retained via the page model.

## Page integrity — new `status` diagnostics

The registry doc and its blob are two INDEPENDENTLY MUTABLE objects; as pages become the central
surface, that seam needs diagnostics. Add to `status` (or a dedicated `pages` check):

- the registry `entry` exists (no dangling registry doc),
- `entry` is under `pages/`,
- the blob has an HTML content-type,
- duplicate registry `entry`s are forbidden or explicitly supported,
- unreferenced `pages/*` blobs are reported (orphans).

## Storage / volume (corrected)

Content pages are blobs stored in the bundle, which SYNCS to teammates over the board branch —
and sync stages EVERYTHING (`git add -A`, `packages/cli/src/git.ts`). So a "local-only prefix"
inside a synced board is NOT currently viable — exclusions would be a new partial-board sync
model. The honest options:

- publish a size guideline / warning,
- keep bulky HTML outside the bundle,
- use a separate local-only bundle,
- (later) design an explicit blob-tier policy.

## Sequencing (revised per review)

1. **Enforced `bridge: none | bundle-read`** on the Page convention (broker enforcement +
   launcher grouping + safe default), **Page integrity diagnostics** in `status`, and **one
   content-page fixture**. Update existing Page docs + examples in the same unit. Additive —
   nothing removed.
2. ~~Decide whole-bundle graph viewing~~ **DONE (2026-07-10): accept its removal** — no generic
   Explorer Page. Step 3 is unblocked.
3. **Delete** `packages/viewer` + `view` as one Builder → Review → PR unit, using the expanded
   blast-radius checklist; update CLAUDE.md gates 1/4 + the smoke test in the SAME unit (a gate
   owns the risk it guards).
4. **Snapshot export stays PARKED** as a separate protocol/design problem (not a generic
   transform).

## Backlog impact

- `deprecate-static-viewer` → becomes active; this doc is its plan.
- `ui-v1` (P1, blocked — same-origin web UI over the deployed **Worker**): the OLD hosted-UI
  direction; superseded / reframed by the local generative-page model. Revisit — likely close or
  re-scope.
- `ui-pages-*` (bridge-v1, connection-recovery, per-page-scoping) SUPPORT this model — keep,
  elevate. Per-page-scoping is the natural home of the `bridge` field's evolution.
- `ui-generative-chat` (prompt → live page) is the headline of this direction.

## Open questions

1. ~~Whole-bundle graph~~ — **RESOLVED (2026-07-10): accepted as a loss**, no Explorer Page.
2. **Snapshot export** — build the generic snapshot protocol later, or let it go?
3. **Volume / storage** — which of the four options above for bulky content pages on a synced
   board?

## Execution status

- **In progress:** Unit A — enforce the `bridge: none | bundle-read` capability (Page convention
  field + shell-side broker enforcement + launcher grouping + a content-page fixture). Builder
  dispatched 2026-07-10 on `feat/page-bridge-capability`. Board-data migration (the board's own
  Page docs + `conventions/page.md` gain `bridge: bundle-read`) is coordinated with that merge.
- **Next:** Unit B — Page integrity diagnostics in `status`. Unit C — delete `packages/viewer` +
  `view` (now unblocked by the graph decision).

(Resolved by the review: launcher grouping is no longer an open question — it rides the enforced
`bridge` field.)

## Non-goals

- A second mechanism for content pages (they are just pages, with an enforced `bridge` field).
- Keeping the viewer as a parallel engine.
- Building snapshot export now (parked until a real need + a real protocol design).

## Related

- [plan for](../tasks/deprecate-static-viewer.md)
- [realizes](../roadmap-items/ui-rethink.md)
