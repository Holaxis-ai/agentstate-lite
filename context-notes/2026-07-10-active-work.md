---
type: Context Note
title: >-
  Active work (2026-07-10): page-model consolidation + Cloudflare-peeling
  decision
description: >-
  Snapshot of the two live threads — Unit A bridge-capability (PR #39 in
  re-review, P1/P2 fixed), Units B/C queued, viewer deprecation; and the parked
  Cloudflare/remote peeling decision (single-tier local-first pivot).
timestamp: '2026-07-10T20:52:06.313Z'
---
# Summary

Snapshot of active work (2026-07-10). Two threads: one **building** (the page-model
consolidation), one **parked on a founder decision** (peeling Cloudflare / the remote stack).

## Thread 1 — Page-model consolidation (ACTIVE, building)

Direction (design doc [page-model-and-viewer-deprecation](../designs/page-model-and-viewer-deprecation.md),
rev 3): collapse all local HTML onto ONE `type: Page` primitive with two usage patterns —
**data pages** (call the read-only bridge, show live bundle data: Board / Roadmap / Memory) and
**content pages** (arbitrary self-contained HTML, no bundle access) — and retire the static viewer
(`packages/viewer` + the `view` / `viz.html` command). DECIDED: the generic whole-bundle graph is
accepted as a loss (no Explorer Page); a graph view, if wanted, is authored as a data page.

**Unit A — enforce a `bridge: none | bundle-read` capability. PR #39, IN RE-REVIEW (not merged).**
Fail-closed default, enforced in the trusted parent frame (`PageFrame`), sourced from each Page's
registry-doc frontmatter — the sandboxed page cannot spoof it. Journey: built (Sonnet) → review
APPROVE → a SECOND independent review found two blockers → both fixed → focused re-review running.
- **P1** (commit 823d24d): a bridge-revocation race. `loadPage` now pre-revokes the capability at
  its top (covering every re-resolution path in one place); `onMessage` replies are epoch-fenced —
  so an in-flight `bundle-read` result can no longer be delivered to a subsequently-loaded `none`
  page (a fail-closed violation). Bite-verified component tests.
- **P2** (commit cdffa04): `bridge` is now `fields.required` — forces intentional classification (a
  clear authoring-time diagnostic instead of a silent runtime denial), with `resolveBridgeCapability`
  kept fail-closed as the runtime defense.

Board migration DONE: the board's `board` / `memory` / `roadmap` pages carry `bridge: bundle-read`
and the board convention declares the field, so there is no dark-pages window on ship. Pending small
follow-up (mine): flip the board convention optional→required to match the code. Follow-up task:
[ui-pages-bridge-capability-e2e](../tasks/ui-pages-bridge-capability-e2e.md).

**Unit B (next):** Page integrity diagnostics in `status` (the registry-doc↔blob seam — dangling
`entry`, orphan blob, wrong content-type, duplicate entries). Fold in a "bridge-using page missing
the field" warning.
**Unit C (unblocked by the graph decision):** delete `packages/viewer` + `view`. Blast radius
includes the #37 distribution gate (`skill-references`' `view: []` must drop in lockstep), the root
build/typecheck SCRIPTS (which name viewer), `package-lock.json`, `README`, CLAUDE.md gates 1 & 4 +
the sample-bundle smoke test, home-view tests, and core comments.

Design note worth keeping: content pages are NOT "how agents share HTML with a user." A one-off HTML
is just a file — write it, the user opens it; agentstate-lite isn't in that loop. Content pages earn
their keep only as persistent, launcher-discoverable, sync-shared project HTML.

## Thread 2 — Cloudflare / remote peeling (PARKED, needs a founder decision)

The board now runs on the git tier (`sync`), so the Cloudflare + wire + identity stack is dead
weight. Proposed: collapse to a SINGLE tier (local-first + git), removing `RemoteBackend`,
`packages/worker` (D1R2), `packages/server` (the reference server), the wire protocol,
`--remote`/`serve`/`ui --remote`, and the identity surface (`login`/`join`/`whoami`/`invite`/
`member`/`key`). KEEP the `StorageBackend` seam + `MemoryBackend` (the non-filesystem proof) +
`sync`.

This is a North-Star pivot (two-tier → one-tier) and a CORE.md scope change (FROZEN → REMOVED).
Optionality stays cheap: the seam makes a future remote a plug-in not a rewrite, and the wire
protocol can live on as a parked spec doc. Awaiting the call: *decommission-the-deployment-but-keep-
hosted-frozen* vs *remove-the-code-and-direction*. Offered next steps (not started): a verify pass
(confirm the prod worker holds nothing unique + map the real removal surface) + a board design doc.

## Shipped this session (context)

- **#37** distribution completeness — the skill now ships the page/recipe contracts + sample-bundle
  via `references/` (an agent no longer reverse-engineers the bridge from the minified CLI).
- **#38** bridge `limit: 0 = unlimited` fix (matched the CLI; closed a silent-empty-page footgun).
- Both merged and live at plugin **1.0.35**.
