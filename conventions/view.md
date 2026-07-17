---
type: Convention
title: View
governs: View
path: views-registry/
fields:
  required:
    - title
    - entry
    - bridge
  optional:
    - description
  values:
    bridge:
      - none
      - bundle-read
  terminal: {}
timestamp: '2026-07-17T00:00:00.000Z'
---
# View

A bundle-hosted UI view. A `type: View` doc is a **registry entry**: it names a self-contained
HTML blob (`entry`, a bundle-relative blob key under `views/…`) that the `agentstate-lite ui`
launcher renders in a sandboxed, opaque-origin iframe. The view reaches bundle data only through
the read-only postMessage bridge documented in the bundle's
[View authoring reference](the skill's shipped reference ($REFS/views/view-authoring-v0.md)) — it never holds a credential.

`Page` is the accepted legacy name for this kind: existing `type: Page` docs under the legacy
`pages-registry/`/`pages/` prefixes keep working and never need migrating — author new views as
`type: View`.

- `title` (required) — the launcher card's heading.
- `entry` (required) — the HTML blob key, e.g. `views/roadmap.html`.
- `description` (optional) — one line shown on the launcher card.
- `bridge` (required) — `none | bundle-read`. Required so every View is an INTENTIONAL
  classification, not a silent default — an author who forgets to declare it gets a clear
  authoring-time lint, not a view that quietly renders empty against a full bundle. ENFORCED by
  the shell too, not just linted: absent, malformed, or any value other than exactly
  `bundle-read` is treated as `none` at runtime — fail-closed defense for a doc this convention
  didn't govern (an external bundle, a hand-edited file that skipped the lint).
  - `bundle-read` — a **data view**: the shell answers its bridge requests (`hello`/`query`/
    `read`/`edges`/`subscribe`) with live bundle data. Groups under the launcher's "Dashboards".
  - `none` — a **content view**: the shell DENIES every bundle-data request. Arbitrary
    self-contained HTML with zero bundle-data access — a report, a rendered design doc, a diagram.
    It may still ask the shell to open another registered View. Groups under "Documents".

Both capabilities may use `open-page` (the bridge's wire verb, kept stable across the rename) to
navigate to another valid registered View. This shell action returns no target content or
metadata and grants no bundle-data capability.

Views sync, version, and attribute like any doc; the HTML bytes travel as an opaque blob via
`promote`/`pull`, never through the model context window.
