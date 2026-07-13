---
type: Context Note
title: >-
  CLI covers instance authoring, not schema authoring — descriptions write-gap
  (RESOLVED: no meta-kind, evidence-gated)
description: >-
  kind/field descriptions (#42) shipped read-only (no CLI write path; hand-edit
  YAML). Broader pattern: instances are auto-covered (new/doc update derive
  --<field> from a kind), schema is partial (kind field =
  add/remove+required+values). RESOLVED with codex 2026-07-12: do NOT build a
  meta-kind or comprehensive CLI schema-parity — the asymmetry is likely healthy
  (schemas are low-volume, whole-document-reviewed). Evidence-gated; trigger to
  watch = agents producing malformed/silently-skipped conventions when authoring
  directly (risk rises with the agents-author-operational-systems thesis). If
  triggered, the answer is a safe whole-document author+HARD-validate flow, not
  a meta-kind. One small completion regardless: --description on the existing
  kind field add.
actor: mike/claude
timestamp: '2026-07-13T03:33:09.139Z'
---
# Summary

The kind/field **descriptions** feature (#42) is **half-wired**, and it exposes a general pattern
worth naming: **the CLI auto-covers authoring *instances* of a kind, but only *partially* covers
authoring the *schema* (conventions) — because the convention format itself is CODE, not a
self-describing kind.** Found 2026-07-12 while adding descriptions to the `Review Request`
convention: the only way to add a description today is hand-editing the convention YAML.

**Resolved (2026-07-12, with codex): do NOT build a meta-kind or comprehensive CLI schema-parity.
The asymmetry is likely healthy; the remaining gap is evidence-gated. See Resolution below.** The
diagnostic below (the gap, the pattern, the crux) still stands as observation.

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

## Resolution (2026-07-12, with codex)

Discussed with codex and landed here — the diagnostic above is a useful observation, not a build
request:

- **No meta-kind, and no comprehensive CLI schema-authoring parity.** A dedicated mutation command
  per schema dimension (`kind describe`, `kind field describe`, `kind link add/describe`,
  `kind enum describe`, `kind section add`, terminal/path editing) would be SPRAWL that recreates a
  schema-management DSL around a format whose whole advantage is that it is readable text. Rejected.
- **The asymmetry is likely HEALTHY, not a defect.** Instances are high-volume and benefit from
  ergonomic per-field commands; conventions are low-volume and benefit from being authored and
  reviewed as COMPLETE documents. The sufficient boundary: *agents author the complete Convention as
  text; AgentState deterministically parses, validates, versions, installs, and exposes it.*
  "Deterministic" does NOT require every edit decomposed into a bespoke flag.
- **Evidence-gated.** Revisit only when real dogfooding (recipe creation, founder-to-founder
  transfer) shows editing the Convention document directly is genuinely painful or unsafe. Keep
  `kind field add/remove` as the convenience for the most common structural edit; continue
  descriptions through the model + discovery surfaces (next layer: enum-value descriptions); let
  agents author richer Conventions directly.

**The specific trigger to watch (the one sharpening):** not "is editing painful," but **do agents
produce malformed / silently-skipped conventions when authoring them directly.** Today a malformed
convention is skipped-with-a-warning (gate 3), so a fumbled nested-YAML edit yields a kind that
SILENTLY does not govern — the silent-failure class we keep fighting. And that risk RISES with
schema-authoring volume, which the product's own "agents author operational systems / recipes
package operating systems" thesis pushes UP. So "asymmetry is healthy" holds *as long as
schema-authoring stays low-volume and human-reviewed*; the agents-author-kinds direction is exactly
what could break that assumption.

**If that trigger fires, the response is NOT a meta-kind** — it is a safe whole-document
**author → HARD-validate → CAS-write** flow for conventions (reject on malformed rather than
skip-with-warning). Most of the byte channel already exists (`promote`); the missing piece is hard
validation-on-write.

**One small completion worth doing regardless:** `--description` on the EXISTING `kind field add`
(which already takes `--required`/`--values`). #42 already shipped the model, reads, serialization,
and remove-cleanup — only the add-write flag is missing, so this finishes an endorsed convenience
command rather than opening the sprawl. Still optional; reasonable to defer.

**AXI note:** some hand-curation of the agent-facing surface is DELIBERATE regardless — you do not
auto-expose a flag per internal field.

## Relationships

- Next rung of [self-describing-domain-models](../roadmap-items/self-describing-domain-models.md).
- The descriptions feature: [kind-field-descriptions](../tasks/kind-field-descriptions.md) (shipped
  #42, read-only) — this note is the follow-on write-path gap.
- Demonstrated on the [Review Request](../conventions/review-request.md) convention (now
  self-describing via a hand edit).
