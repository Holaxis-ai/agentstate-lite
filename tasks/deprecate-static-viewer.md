---
type: Task
title: >-
  Deprecate the static HTML viewer (viz.html) — back out packages/viewer + the
  view command
status: done
priority: '2'
description: >-
  Shipped via PR #63. Removed the legacy static viewer package and CLI view
  command so Pages are the sole human-facing rendering system. Full repository
  gate and packed-install smoke passed for commit 5bf3e52; merged to main as
  8f65350 on 2026-07-15. Independent review was explicitly waived by the product
  owner as a safe, low-risk removal.
actor: mike/codex
assignee: mike/codex
timestamp: '2026-07-15T15:05:06.659Z'
---
**Human decision (Mike, 2026-07-09):** with bundle pages shipping (PR #31 — a launcher +
sandboxed pages including **Roadmap**, a live graph view over `queryEdges`), the UI now provides
the visualization substrate the static viewer was a placeholder for. Gate 4 kept `axi view` →
`viz.html` "until the UI's views supersede it — sunsetting, do not extend." That condition is now
met. This task backs the static viewer out entirely.

## Scope — back out all viz code

- `packages/viewer` — the whole package (the `viz.html` generator engine, a pure consumer of core).
- The CLI `view` / `axi view` command and its wiring in `packages/cli` (dispatch, `reference.ts`,
  the esbuild inline of the viewer into the CLI bundle).
- Tests that assert the viewer / `viz.html` / the `examples/sample-bundle` "4 nodes / 7 edges"
  view smoke.
- Generated command surface: drop the `view` verb from `reference.ts` → regenerate `SKILL.md`
  (npm-target) and let the CI bot regenerate the plugin-target SKILL + bundle on merge.
- Front-door prose: README quickstart's `view` step; **CLAUDE.md gate 4** (remove the
  "kept until superseded / sunsetting" clause and state the viewer is removed); the build/smoke
  instructions in CLAUDE.md that run `view` on `examples/sample-bundle`.

## The tradeoff to weigh BEFORE deleting (honest caveat, not a blocker)

`viz.html` is a **zero-dependency static HTML file**: it works fully offline, needs no server, and
is shareable as a single mailable artifact. The `ui` command needs a running loopback server + a
browser session. Removing `view` trades a static artifact for a served experience. Before the
deletion PR lands, confirm one of:

1. an `edges`-driven bundle page (Roadmap-style) genuinely covers the whole-bundle graph
   use case the static viewer served, OR
2. we accept the loss of the offline single-file artifact deliberately.

Also check interop consumers: the `examples/sample-bundle` round-trip and any doc/skill that
still promises `view`.

## Sequencing

- **Gated on PR #31 merging first** — the superseding views must be on `main` before the viewer
  comes out, so there is never a window with neither surface.
- Ships as ONE reviewed unit (Builder → independent Reviewer → QA). It is a deletion PR, so the
  reviewer's job is specifically: *did we drop a load-bearing capability with no replacement?*
  (the tradeoff above) and *is the CLI bundle still self-contained and the gate green after the
  viewer is gone?*

Relates to the [ui-rethink](../roadmap-items/ui-rethink.md) decomposition and gate 4.
