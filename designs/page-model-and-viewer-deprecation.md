---
type: Design
title: 'Human window: one page primitive, and retiring the static viewer'
description: >-
  Plan of record: unify all local HTML onto the type:Page primitive (data pages
  vs standalone content pages) and retire the static viewer (packages/viewer /
  view -> viz.html). Includes why, blast radius, sequencing, and open questions.
actor: mike/claude
timestamp: '2026-07-10T18:38:54.016Z'
---
# Human window: one page primitive, and retiring the static viewer

**Status:** Plan of record — converged with Mike (2026-07-10). Captures the decision to lean
into the generative UI, unify all local HTML onto the `type: Page` primitive, and retire the
static viewer (`packages/viewer` / `view` → `viz.html`). Not yet executed; sequencing + open
questions at the end.

## Why now

- The generative UI (bundle pages) is shipped, working, and being dogfooded on this board
  (Board / Roadmap / Pulse / Memory pages). Human verdict: lean into it.
- Gate 4 (CLAUDE.md) kept the static viewer "until the UI's views supersede it." Leaning into
  generative UI is that supersession — which unblocks the deprecation honestly, not by jumping
  the gate.
- The reframe that shaped this: there are two HTML use-cases — (1) HTML that **displays bundle
  data** (generative / data pages) and (2) HTML **created without bundle data** (standalone
  content). They are the SAME mechanism, not two features.

## The model: one page primitive, two usage patterns

A bundle page = a self-contained HTML blob under `pages/`, a `type: Page` registry doc,
rendered by `ui` in a sandboxed, opaque-origin iframe (`sandbox="allow-scripts"`,
`connect-src 'none'`). Whether it calls the read-only postMessage bridge is the page's own
choice — so one primitive covers both use-cases:

- **Data pages** — call the bridge (`query`/`read`/`edges`/`subscribe`), render live bundle
  data. Board, Roadmap, Pulse.
- **Content pages** — ignore the bridge; arbitrary self-contained HTML (a report, a rendered
  design doc, a diagram, a notebook export).

Both share the same render path and the same sandbox (no network, opaque origin), so a content
page is confined exactly like a data page — unifying costs nothing security-wise. There is **no
second mechanism to build**: a content page is simply a page that never calls `Bridge.query()`.

### Launcher grouping

Content pages will outnumber curated dashboards, so a flat launcher list buries the useful live
views. Group them — data vs content — driven by either a `category` field on the `Page`
convention (preferred: explicit, survives moves) or a path convention (`pages/dashboards/…` vs
`pages/docs/…`, zero-schema). OPEN — see below.

## Portability: mostly free, one narrow gap

- **Content pages are portable for free.** The blob is a self-contained HTML file:
  `pull --doc-key pages/x.html --out x.html` (or the source you authored) opens directly in any
  browser, no server, offline. Nothing to build.
- **Data pages are NOT portable standalone** — opened without the `ui` shell, the bridge has no
  peer, so the data never loads (the same reason a bundle page can't run as a Claude artifact).
- The ONLY thing `pull` + open can't do is freeze a **live-data** page into a shareable
  snapshot — which is exactly what `viz.html` did (query once, bake the results in, emit a
  standalone file). If we ever want that, it becomes a **generic "snapshot this page"** step
  applied to any page — NOT a separate viewer engine. PARKED as optional.

## What we deprecate, and why

**Deprecate:** `packages/viewer` (the static-HTML visualizer engine) + the `view` command
(`view` → `viz.html`).

**Why:**

- It is a SECOND HTML-generation engine and a separate command, parallel to the page model.
  Gate 3 wants ONE viewer engine; the page primitive becomes that one surface.
- Interactive / graph viewing is superseded by live data pages.
- Its one unique trick — a baked-in-data static snapshot — is subsumed by the (optional)
  generic page-snapshot, if we ever want it.
- Portability, the other reason to keep it, is already covered by `pull` + open for content
  pages.

**Blast radius** (viewer is a LEAF — only the CLI consumes it; core just names it in comments):

- `packages/viewer/` workspace (~10 src files) + the root workspaces list
- `packages/cli/src/commands/view.ts` + the `view` dispatch in `cli.ts`
- `reference.ts`: the `view` usage block + the Bundle command group (`init, view, status` →
  `init, status`) — regenerates SKILL / home
- `packages/cli/build.mjs` + `scripts/build-bundle.mjs` viewer alias; `packages/cli/package.json`
  dependency
- `CLAUDE.md`: gate 1's `view` AXI principle, gate 4's "viewer kept until superseded," and the
  sample-bundle smoke test (`view` → 4 nodes / 7 edges)
- tests (viewer suite + any cli `view` tests)

**Unaffected / kept:** the `ui` command, bundle pages, the bridge, the `promote`/`pull`/blobs
byte channel. Local HTML publishing is fully retained — it just goes through the page model.

## Sequencing

1. **Unified page model + launcher grouping** (additive) — add the data/content distinction
   (field or prefix) and group the launcher. Ships first; nothing removed.
2. **Retire the static viewer** — remove `packages/viewer` + `view` as one
   Builder → Review → PR unit (the blast radius above). Update CLAUDE.md gates 1/4 and the
   smoke test in the SAME unit (a gate owns the risk it guards).
3. **(Parked, optional) Generic page snapshot** — "export any page to a self-contained file with
   its data baked in," only if a real need appears.

## Backlog impact

- `deprecate-static-viewer` → becomes active; this doc is its plan.
- `ui-v1` (P1, blocked — same-origin web UI over the deployed **Worker**): the OLD hosted-UI
  direction; superseded / reframed by the local generative-page model. Revisit — likely close or
  re-scope.
- `ui-pages-*` (bridge-v1, connection-recovery, per-page-scoping) SUPPORT this model — keep,
  likely elevate. Per-page-scoping matters more as content pages proliferate on a shared board.
- `ui-generative-chat` (prompt → live page) is the headline of this direction.
- Minor drift to fix while here: `ui --help` still advertises "board · doc detail · admin ·
  graph" (React views removed in the pages spike) — correct the `ui` blurb in `reference.ts`.

## Open questions

1. **Launcher grouping** — a `category` field on the `Page` convention vs a path convention.
   (Lean: field.)
2. **Snapshot export** — build the generic page-snapshot, or let it go and rely on
   `pull` + `ui` + sync?
3. **Volume / storage** — content pages are blobs stored in the bundle, which SYNCS to teammates
   over the board branch. Voluminous HTML bloats the board. Decide a policy: a size guideline, a
   local-only prefix, or keep bulky content pages out of the synced board.

## Non-goals

- A second mechanism for content pages (they are just pages).
- Keeping the viewer as a parallel engine.
- Building snapshot export now (parked until a real need).

[plan for](../tasks/deprecate-static-viewer.md)

[realizes](../roadmap-items/ui-rethink.md)
