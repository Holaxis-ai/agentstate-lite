---
type: Convention
title: Context Note
governs: Context Note
path: context-notes/
fields:
  required:
    - title
    - timestamp
  optional:
    - description
    - tags
sections:
  - Summary
freshness_horizon: 24h
browse_collapsed: true
timestamp: '2026-07-03T19:07:30.037Z'
---
# Context Note

An agent's cross-session orientation note: what happened, what was decided, and what's still open. Create one with `new "Context Note" <id>` (scaffolds the `# Summary` section under `context-notes/`), read it with `doc read`, and edit it with `doc update` / `doc write`. `status` surfaces this kind's 24h freshness horizon across the bundle.

## Declaring a kind convention

A kind convention is a plain OKF doc (`type: Convention`) living under `conventions/`. Its FRONTMATTER is the only part core parses (this prose is not). Supported frontmatter keys:

- `governs` (required, non-empty) — the `type` value this convention governs.
- `title` (optional) — display title; defaults to `governs`.
- `path` (optional) — canonical bundle-relative path prefix instances are scaffolded under (e.g. `roadmap/`).
- `fields.required` — list of field names an instance MUST carry (non-empty).
- `fields.optional` — list of field names an instance MAY carry.
- `fields.values` — a MAP of `field name -> list of allowed values`. This is the ONLY place an enum constraint goes — never a top-level `enum:`/`enums:`/`values:`/`constraints:` key, and never a field named directly at the top level either.
- `sections` — list of expected level-1 (`# Heading`) body-section names. Declare only the headings EVERY instance must carry (this Context Note kind declares just `Summary`, the one section `new "Context Note"` scaffolds and every instance carries).
- `freshness_horizon` — `<n>(m|h|d)`, e.g. `24h`, `30d`, `15m`.

Worked example (a `Roadmap Item` kind, with an enum-restricted field and expected sections):

```yaml
---
type: Convention
title: Roadmap Item
governs: Roadmap Item
path: roadmap/
fields:
  required: [title, status]
  optional: [horizon]
  values:
    status: [planned, active, done]
sections: [Why, "Done when"]
freshness_horizon: 30d
---
```
