---
type: Design
title: view create — adjudicated design (converged reviews + conditions)
actor: claude-main-viewauthoring
timestamp: '2026-07-23T18:44:06.668Z'
---
# `view create` — adjudicated design (two adversarial reviews, converged)

Outcome of a 2026-07-23 design pass: an architecture review and an OKF/interop review, run
independently, initially split (UNSOUND vs SOUND-WITH-CHANGES), converged at
**SOUND-WITH-CHANGES** after cross-examination on one decisive fact both then verified:
`artifact create` (PR #150, `commands/artifact.ts`) is merged precedent for a first-class,
by-name, convention-OPTIONAL verb owning a fumble-prone blob-promote + registry-record sequence.
View is structurally the same shape.

## The ontology this rests on (product owner, 2026-07-23)

Kinds live on two axes. CONTENT kinds (Task, Design, Plan...) declare what information exists —
an instance IS knowledge. A View is REPRESENTATION — rendering logic over other docs, holding no
domain knowledge. The tension "views are fundamental to the UI's value" vs "views are just
documents" resolves by separating the RENDERER (shell capability, fundamental, works on any
`type: View` doc with no convention) from the RENDERED (instances + the convention — plain
documents, never seeded, never recipe-special). Decisions standing: no seeding at init, no
"view recipe" (a recipe is a domain operating model; a view is an ingredient of one), value =
render capability + agents generating views on demand.

## What died in review

The original framing — "surface the code-level View contract at author time,
convention-independently" — conflated the RUNTIME contract (parseRegistration /
resolveBridgeCapability: legitimately hardcoded, must fail-close ANY type:View doc) with the
AUTHORING schema (convention-scoped, already enforced by `new "View"`). Also killed:
auto-installing the convention as a side effect (seeding laundered through a verb), and a bare
"generic lint" as the PRIMARY fix (detection-after-the-fact loses to structural elimination).

## The converged conditions (all load-bearing)

A. **Single-source the bridge check.** Authoring validation reads a strict membership predicate
   EXPORTED from core next to `resolveBridgeCapability`, derived from the SAME constant the
   runtime gate uses. A re-typed literal list in the command IS the schema fork gate 3 forbids.
B. **A declared convention stays the authoring authority.** Route validation through the normal
   strict mutateDoc path (as artifact create does for status); core's predicate is a FLOOR for
   the convention-absent case, never an override. Assert: a convention's `values.bridge` must be
   a subset of core's capabilities (anything else is runtime-doomed by fail-close).
C. **Runtime fail-close remains THE security boundary.** `bridge` decides bundle-data access
   (artifact's `status` does not), so author-time checking is a convenience, never the control.
   Adversarial pin: a hand-edited bad `bridge` still fail-closes to `none` at serve time. This
   puts the unit in the Builder -> independent review -> adversarial QA tier.
D. **Names via core's ONE grammar** (`isViewRegistryId` / `isViewEntryKey`) at author time, so
   the verb cannot create a doc the renderer later refuses.
E. **Write contract = artifact.ts verbatim:** blob-FIRST (version only known post-write),
   create-only CAS record, record-failure NAMES the orphaned blob + recovery command,
   collision-safe id considers existing blob keys so re-runs are never bricked.
F. **Write only convention-governed fields** (title/entry/bridge[/description]); do not invent
   fields the shipped convention and parseRegistration don't carry.

`entry` dangling is STRUCTURALLY eliminated by auto-wiring (E); `tasks/view-entry-dangling-lint`
remains filed as the complementary read-side check for hand-written and external docs.

## The standing scope flag (NOT resolved by this design — a founders' call)

Each such verb grows core's hardcoded, convention-optional "product kind" vocabulary by name
(Artifact, then View). Individually defensible; the DIRECTION deserves a deliberate decision
against docs/core rather than accretion by default. `tasks/cli-view-create-verb` is gated on
that call.

[the task this specifies](../tasks/cli-view-create-verb.md)

[the complementary lint](../tasks/view-entry-dangling-lint.md)
