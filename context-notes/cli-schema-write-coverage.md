---
type: Context Note
title: >-
  CLI covers instance authoring but not schema authoring — the descriptions
  write-gap + the meta-kind option
description: >-
  kind/field descriptions (#42) shipped read-only: no CLI write path (kind field
  add has no --description; hand-edit YAML only). Broader pattern: new/doc
  update auto-expose --<field> from a kind (instances = auto-covered), but the
  kind command edits only add/remove+required+values (schema = partial);
  descriptions/terminal/links/sections/kind-description are hand-edited. Root
  cause: the convention FORMAT is hardcoded (VALID_FIELDS_KEYS), not a
  self-describing meta-kind, so its editing surface can't auto-generate. Two
  paths: patch the ~4 write flags, or model the convention format as a meta-kind
  (kinds all the way down).
actor: mike/claude
timestamp: '2026-07-13T03:12:02.261Z'
---
# Summary

The kind/field **descriptions** feature (#42) is **half-wired**, and it exposes a general pattern
worth naming: **the CLI auto-covers authoring *instances* of a kind, but only *partially* covers
authoring the *schema* (conventions) — because the convention format itself is CODE, not a
self-describing kind.** Found 2026-07-12 while adding descriptions to the `Review Request`
convention: the only way to add a description today is hand-editing the convention YAML.

## The concrete gap

#42 shipped the descriptions **model** (`fields.descriptions` in `core/src/kinds.ts`),
serialization, and every **read** path (`kinds`, `new "<Kind>" --help`, and the UI Kinds endpoint
all surface descriptions), plus the `kind field remove` cleanup. But there is **no CLI *write*
path**: `kind field add` takes `--required`/`--values` but NOT `--description`, and nothing sets the
kind-level `description`. So an agent can only author self-describing kinds by editing raw
frontmatter — a missing half for a feature whose whole point is agents authoring self-describing
kinds.

## The pattern: instances auto-covered, schema partial

- **Instances of a kind — fully covered, automatically.** `new` / `doc update` are KIND-AWARE:
  they read a kind's declared fields at runtime and auto-expose a `--<field>` flag for each. Add a
  field to a kind → its instance flag appears for free.
- **The schema (conventions) — only partial.** The `kind` command edits exactly one slice:
  `kind field add/remove` + `--required` + `--values`. Everything else about a convention —
  `descriptions`, `terminal` sets, the typed-link vocabulary (`links`), body `sections`, `path`,
  the kind-level `description` — has NO CLI write path; you hand-edit the YAML. Descriptions are not
  special; the entire schema-editing surface is partial.

## Why CLI coverage isn't automatic (the crux)

CLI commands are hand-written imperative handlers, with ONE schema-driven exception:

- **Read paths pick up new model dimensions "for free"** because they WALK the convention structure
  and render whatever is there (why #42's descriptions appeared in reads with no per-feature code).
- **Write paths do not** — each flag is bespoke, hand-coded. Adding a model dimension conjures no
  flag.
- **The exception that proves the rule:** instance authoring IS schema-driven (flags derived from
  the kind). It just stops at one level.

**Root cause:** the system is "kinds are data" for INSTANCES, but the convention FORMAT itself is
code, not a self-described kind. In `kinds.ts` the set of things a convention may contain is a
hardcoded allowlist — `VALID_FIELDS_KEYS = {required, optional, values, terminal, descriptions}`.
That Set IS the meta-schema, but it lives in TypeScript, not in a convention. So instances derive
from their kind, but kinds derive from nothing self-describing; the schema-of-schemas is hardcoded,
which is exactly why its editing surface can't auto-generate.

## Two paths forward

1. **Patch the gaps (pragmatic near-term).** Hand-add the ~4 missing write flags:
   `kind field add --description`, a `kind describe "<Kind>" "<text>"` for the kind-level
   description, and complete `terminal` / `links` / `sections` editing. Small — each roughly an
   afternoon with tests. (The `--description` one is nearly trivial: #42 already did the model,
   serialization, reads, and remove-cleanup; only the add-write flag is missing.)
2. **Meta-kind — "kinds all the way down" (strategic).** Model the convention format ITSELF as a
   self-describing meta-kind (a "Convention convention": `required[]`, `optional[]`, `values{}`,
   `descriptions{}`, `terminal{}`, `links{}`, `sections[]`). Then the `kind` editing command
   generates itself the way `new` does today, and EVERY future schema dimension gets a CLI write
   path automatically — collapsing the instance/schema asymmetry. This is the natural next rung of
   the self-describing-domain-models thread.

**AXI caveat (both paths):** some hand-curation of the agent-facing surface is DELIBERATE — you do
not auto-expose a flag per internal field. Even full auto-generation must still curate what an agent
sees.

## Decision framing

This is not just a chore vs a rewrite — it is *patch the four gaps now* vs *make the schema layer
self-describing so gaps cannot recur*. The second is legitimately strategic (it is the meta-level
of the exact self-describing thesis the product is betting on), so it deserves a real decision, not
a default.

## Relationships

- Next rung of [self-describing-domain-models](../roadmap-items/self-describing-domain-models.md).
- The descriptions feature: [kind-field-descriptions](../tasks/kind-field-descriptions.md) (shipped
  #42, read-only) — this note is the follow-on write-path gap.
- Demonstrated on the [Review Request](../conventions/review-request.md) convention (now
  self-describing via a hand edit).
