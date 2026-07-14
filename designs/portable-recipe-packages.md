---
type: Design
title: 'Portable recipe packages: content-free cognitive ecosystems'
actor: codex
timestamp: '2026-07-14T03:52:21.297Z'
---
# Portable recipe packages v1

## Decision

Extend the existing recipe folder and `recipe add <name-or-path>` pipeline so a recipe may carry
content-free bundle definitions beyond Kind conventions: explicitly declared Page registry
documents and their self-contained HTML blobs. The recipe remains the portable authority. A
Codex/Claude plugin is only a distribution and activation wrapper around the same folder.

This is an extension of the existing recipe primitive, not a new marketplace, bundle type, or
parallel installer.

## Product contract

A portable recipe transfers a cognitive operating model without transferring its users' state.
It may contain:

- Kind Convention documents under `conventions/`;
- declared `type: Page` registry documents under `pages-registry/`;
- the registry documents' self-contained HTML entries under `pages/`;
- host-neutral explanation in `recipe.md`'s body.

It may not install Kind instances, tasks, notes, claims, review requests, or other project data.
Host-specific skills and scripts live outside the recipe folder in a marketplace plugin and point
at this host-neutral package.

## Manifest shape

The existing `recipe.md` frontmatter gains two optional fields:

```yaml
type: Recipe
id: review-workflow
title: Review Workflow
version: "1"
summary: Durable human review requests with a live evidence Page.
content_policy: definitions-only
pages:
  - registry: pages-registry/reviews.md
    entry: pages/reviews.html
```

`content_policy: definitions-only` opts into the strict portable-package contract. In that mode,
every file under the recipe root must be one of the manifest, a Convention markdown document, or
one of the explicitly declared Page registry/entry pairs. Undeclared files and instance-shaped
documents are rejected before any bundle write. Existing convention-only recipes without the
field remain backward-compatible.

## Validation boundary

The one `parseRecipeFiles` path validates the entire acquired file inventory before materializing
a `LoadedRecipe`:

- paths are relative, traversal-free, and cannot escape through symlinks;
- Page registry paths live under `pages-registry/` and end in `.md`;
- Page entry paths live under `pages/` and end in `.html`;
- every declared file exists and no Page file is undeclared;
- each registry document has `type: Page` and its `entry` exactly matches the declared HTML key;
- duplicate registry or entry targets are rejected;
- at least one valid Convention remains required in v1, preserving recipe identity as a domain
  model rather than an arbitrary asset archive.

No second Markdown/frontmatter parser is introduced.

## Apply boundary

`applyRecipe` remains the one apply authority:

1. The package is fully parsed and validated before writes begin.
2. Convention documents keep their existing expect-absent, never-clobber semantics.
3. For each Page, install the HTML blob first with expect-absent CAS, then its registry document.
   A crash can therefore leave only an unregistered blob; rerunning completes the pair without
   ever publishing a registry entry whose HTML was not written.
4. An existing identical Page entry or registry document is an idempotent no-op. An existing
   different target is a structured conflict, never silently accepted or overwritten.
5. The receipt reports convention and Page outcomes and `changed` is true when any artifact was
   created.

Multi-file installation is not presented as atomic. Validation-first, create-only CAS, blob-first
ordering, equivalence checks, and a truthful receipt are the v1 recovery model.

## Reference ecosystem and executable proof

Ship a content-free `review-workflow` example recipe containing:

- the generic Review Request Kind, including Kind, field, relationship, and enum-value
  descriptions;
- the Page Kind Convention;
- the generic live Review Requests Page and registry document;
- no Review Request instances or project-specific evidence.

The clean-room test installs it into an empty bundle and proves:

- the expected Kinds and Page are present;
- strict `new "Review Request"` succeeds for a valid instance and rejects invalid lifecycle data;
- no source-board instance data is present;
- reapplication is byte-stable and `changed:false`;
- hand-authored or differently-valued Page targets are not overwritten;
- the same external folder path works through the normal `recipe add` command.

## Explicit non-goals

- Automatic recipe upgrades or migrations.
- Dependency resolution or recipe composition.
- Installing examples or seed instances.
- A new AgentState marketplace.
- A new `ecosystem` command.
- Cross-bundle launchers or hosted subscription state.

## Roadmap relationship

This is the first implementation unit of the Recipe Plugins roadmap. It makes the package itself
portable and content-free; the existing founder-to-founder marketplace task can then test transport,
cache refresh, and host-specific skill activation without also inventing package semantics.

[advances](../roadmap-items/recipe-plugins.md)

