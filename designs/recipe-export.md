---
type: Design
title: >-
  recipe export: extract a data-free recipe from a working bundle (inverse of
  recipe add)
description: >-
  Proposed design for a 'recipe export' CLI command — the inverse of 'recipe
  add'. Reads a working bundle, emits a portable DATA-FREE recipe folder
  (recipe.md + conventions/*.md + views/ + opted-in references/) that 'recipe
  add' installs elsewhere. Core rule: export DEFINITIONS (kind conventions under
  conventions/, Views + HTML), never INSTANCES (data stripped); reference docs
  are opt-in (--include-ref) since auto-distinguishing them from private data is
  unsafe. Data-free BY CONSTRUCTION with an instances_stripped receipt as the
  trust surface; round-trip (export -> add -> identical registry+views, zero
  instances) is the correctness + portability proof. Local-only, deterministic.
  Full design in body.
actor: mike/claude
timestamp: '2026-07-20T20:58:07.772Z'
---
# recipe export — extract a data-free recipe from a working bundle

## Purpose
The inverse of `recipe add`. Read a real, in-use bundle and emit a portable, DATA-FREE recipe folder
(`recipe.md` + `conventions/*.md` + `views/` + optional `references/`) that `recipe add` can install
onto any other bundle. This is what lets someone share a recipe they've refined by daily use WITHOUT
sharing their data (the founder-to-founder ask), and it is the portability proof for
`roadmap-items/recipe-plugins` and `tasks/prove-recipe-plugin-sharing`.

## Definition vs instance — the core rule
Export carries DEFINITIONS (structure), never INSTANCES (data). The classes:
- **Kind conventions** — docs under the `conventions/` prefix, `type: Convention` (the kind-discovery
  contract `loadKinds` already uses). DEFINITIONS → exported verbatim.
- **Views** — `type: View` registry docs + their HTML blobs (`views/<name>.html`). DEFINITIONS → both
  the registration doc AND the HTML bytes.
- **Reference docs** — static operating docs a recipe may carry. AMBIGUOUS (a reference is content;
  so is private instance data), so NOT auto-exported — carried ONLY when explicitly selected
  (`--include-ref <id>`). Auto-distinguishing reference material from private data is unsafe, so it
  is opt-in.
- **Everything else** — the instance docs (Task instances, notes, the actual data). STRIPPED. Never
  read into the output.

## Command
```
aslite recipe export <name> [--dir <bundle>] [--out <folder>] [--include-ref <id> ...] [--check]
```
- `<name>` — recipe name (manifest); `--out` — target folder (default `./<name>`).
- `--include-ref <id>` — explicitly carry one doc as a reference (opt-in, repeatable).
- `--check` — zero-write dry run: report what WOULD export (kinds, views) and what WOULD strip
  (instance count), exit 0 clean. Same AXI drift-probe shape as `index generate --check`.
- **Local-only** — reads a local bundle, writes a local folder; no remote/sync/hook (mirrors the
  `index` command's scope discipline).

## Data-free BY CONSTRUCTION (the trust surface)
Export enumerates ONLY the definition classes (conventions + views + opted-in refs); it never copies
an instance doc's body into the output. The receipt PROVES it: `kinds_exported`, `views_exported`,
and `instances_stripped` (the count of docs deliberately left behind). Surfacing the stripped count
is the user's assurance that no private data leaked — and `--check` shows the same before any write.
This directly serves `tasks/bundle-visibility-safeguard`'s concern (don't let structure-sharing
silently ship data).

## Round-trip correctness (the portability proof)
Contract: `recipe export B → folder`, then `recipe add folder → fresh bundle B'`, yields B' whose
kind registry + registered Views are IDENTICAL to B's, and whose instance-doc count is ZERO. That
round-trip is both the correctness test and the portability proof. It is the true inverse of
`recipe add`, so it must emit exactly the folder shape `parseRecipeFiles` consumes.

## Manifest generation
`recipe.md` is generated: name + description (author-provided via flag), and the DERIVED list of
kinds + views. Follows the exact manifest shape `recipe add` parses.

## Determinism
Output is deterministic (sorted conventions, stable manifest ordering) so re-exporting an unchanged
bundle produces byte-identical files — same discipline as the portable-index projection.

## Open questions (decide at build)
- **Reference selection UX** — explicit `--include-ref <id>` (safest, MVP) vs a `references/` prefix
  convention vs a manifest allowlist. Lean: `--include-ref` for v1.
- **View HTML portability** — a View's HTML may hard-code bundle-specific ids/assumptions; export
  carries the bytes verbatim (the author owns making them generic), but should WARN if a View's
  registration or HTML references an instance doc id that won't exist in a fresh bundle.
- **Instance seeding is OUT of scope** — this exports definitions only; seeding starter instances is
  a separate concern the current `recipe add` (definitions-only) already reflects.

## First real consumer
`tasks/recipe-personal-task-system` — export the founder's real, private, battle-tested task bundle's
STRUCTURE into the first shipped recipe. That extraction is both the recipe and the first end-to-end
exercise of this command.
