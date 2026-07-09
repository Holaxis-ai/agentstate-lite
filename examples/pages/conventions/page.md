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
  values: {}
  terminal: {}
timestamp: "2026-07-09T00:00:00.000Z"
---
# Page

A bundle-hosted UI page. A `type: Page` doc is a **registry entry**: it names a self-contained
HTML blob (`entry`, a bundle-relative blob key under `pages/…`) that the `agentstate-lite ui`
launcher renders in a sandboxed, opaque-origin iframe. The page reaches bundle data only through
the read-only postMessage bridge (`examples/pages/BRIDGE.md`) — it never holds a credential.

- `title` (required) — the launcher card's heading.
- `entry` (required) — the HTML blob key, e.g. `pages/board.html`.
- `description` (optional) — one line shown on the launcher card.

Pages sync, version, and attribute like any doc; the HTML bytes travel as an opaque blob via
`promote`/`pull`, never through the model context window.
