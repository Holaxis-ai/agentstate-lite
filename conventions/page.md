---
type: Convention
title: Page
governs: Page
path: pages-registry/
fields:
  required:
    - title
    - entry
  optional:
    - description
    - bridge
  values:
    bridge:
      - none
      - bundle-read
  terminal: {}
timestamp: '2026-07-09T00:00:00.000Z'
---
# Page

A bundle-hosted UI page. A `type: Page` doc is a **registry entry**: it names a self-contained
HTML blob (`entry`, a bundle-relative blob key under `pages/…`) that the `agentstate-lite ui`
launcher renders in a sandboxed, opaque-origin iframe. The page reaches bundle data only through
the read-only postMessage bridge (BRIDGE.md, shipped alongside) — it never holds a credential.

- `title` (required) — the launcher card's heading.
- `entry` (required) — the HTML blob key, e.g. `pages/roadmap.html`.
- `description` (optional) — one line shown on the launcher card.
- `bridge` (optional) — `none | bundle-read`. ENFORCED by the shell, not cosmetic: absent,
  malformed, or any value other than exactly `bundle-read` is treated as `none` — fail-closed.
  - `bundle-read` — a **data page**: the shell answers its bridge requests (`hello`/`query`/
    `read`/`edges`/`subscribe`) with live bundle data. Groups under the launcher's "Dashboards".
  - `none` — a **content page**: the shell DENIES every bridge request outright. Arbitrary
    self-contained HTML with zero bundle access — a report, a rendered design doc, a diagram.
    Groups under the launcher's "Documents".

Pages sync, version, and attribute like any doc; the HTML bytes travel as an opaque blob via
`promote`/`pull`, never through the model context window.
