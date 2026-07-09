---
type: Research
title: >-
  Work-management trial: multi-convention recipe + prose glue — findings and the
  typed-links evidence
timestamp: '2026-07-06T21:21:36.284Z'
---
# Work-management trial — multi-convention recipe + prose glue, findings

**2026-07-06 evening. The question under test (Mike's):** does "recipe" deserve to be a
separate noun from "convention," and does prose-only glue (links with text `contains`)
hold up for roadmap-items-containing-tasks? Run live on the board's real spine: three
Roadmap Items created from actual project work, five `contains` links to real tasks.

## Finding 1 — plurality is real; atomicity is soft (the vocabulary verdict)

The first multi-convention recipe (`work-management` v0.1.0: Task + Roadmap Item) applied
in one command with a per-doc receipt: `roadmap-item,true; task,false` — it seeded the
missing convention and no-op'd the pre-existing byte-identical one. So a recipe is NOT a
transaction; it is **a versioned set offered together, filling gaps idempotently**. The
noun survives the test, but with its meaning relocated: "recipe" = the set+version unit,
not an all-or-nothing install. If glue never becomes mechanical, a plain "conventions
folder" would still suffice — the noun's remaining weight rests on composition.

## Finding 2 — prose glue: writable, half-readable (THE typed-links evidence)

- **Outbound direction works:** `link show <item>` lists `{to, text, href}` — the
  `contains` label is visible and agent-filterable. Authoring the relationship costs one
  flag (`--text contains`).
- **Backlink direction loses the type:** `link show <task>` returned
  `backlinks[3]: context-notes/…, roadmap, roadmap-items/local-first-loop` — the
  CONTAINMENT edge is indistinguishable from two ordinary citations. "Which item owns
  me" is only answerable by prefix heuristics. The link text does not survive derivation.
- **Requirements, in ascending cost, now with evidence:** (a) backlinks should carry the
  link text (likely cheap — derivation already walks the outbound links); (b) filter by
  link text in `link show`/queries; (c) validated link types (a `contains` may only go
  Roadmap Item → Task) — the full typed-link-conventions design, which needs the Brian
  ontology session.

## Finding 3 — the rollup costs 1 + N commands

Progress of `local-first-loop` = `link show` + one `doc read --field status` per
contained task + manual aggregation (here: done + in_progress → active). Fine at N=2,
painful at N=20. This is the concrete evidence for the task-ergonomics
"rollup/runnable/blocked query" scope — pulled, not speculative.

## Finding 4 — roadmap-items-as-docs feel right

The real spine mapped naturally onto three items (local-first-loop: active;
claims-provenance: active; ui-rethink: queued) with no modeling friction. Roadmap item 2
("deferred until granular items are actually felt") can be considered FELT.

## Verdict on the vocabulary question

Keep "recipe," defined precisely: **a versioned set of conventions that install
together.** Put the noun on the Brian ontology-session agenda anyway — its long-term
weight depends on whether glue becomes mechanical (typed link conventions), which is that
session's central design question, now carrying tonight's evidence.
