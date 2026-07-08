---
type: Task
title: >-
  Actor attribution: doc write --actor must reach frontmatter (PR#13 review,
  item 3)
status: done
priority: '1'
description: >-
  SHIPPED (adfae50, branch feat/sync-actor-attribution). DECISION: persist
  --actor into the doc's own 'actor' frontmatter field at the CLI verb layer
  (doc write / doc update / new) — frontmatter is the ONLY per-doc source sync's
  enrichment reads (adjudication F); engine untouched (gate 3);
  WriteOptions.actor kept as the separate version-history channel; NO git-author
  fallback (machine-level, not per-doc — rejected as primary and unnecessary as
  last resort once frontmatter carries it). Kind conventions needed NO schema
  change: core's validateAgainstKind lints only declared required/enum/sections,
  never undeclared top-level keys (OKF §9) — pinned by a work-tracking
  kind-lint-neutrality test. Semantics: --actor given -> frontmatter.actor set
  on create AND update (update overwrites a previous actor; doc write
  full-replace drops an un-resupplied actor and reports it in dropped_fields);
  no --actor -> field untouched (no default, no env); identical patch + same
  actor stays a no-op; conventions-free/external bundles byte-identical without
  --actor. Tests 495 -> 503 all green (npm run check green); centerpiece e2e:
  doc write --actor alice through the REAL CLI -> sync receipt 'actor: alice',
  commit subject 'board: alice — added <id>', B's incoming rows alice, 'unknown'
  nowhere — no harness hand-seeding (founder e2e converted off writeBoardDoc).
  Caveats: 'actor' is an UNDECLARED convention-less frontmatter key — external
  OKF bundles are unaffected (unknown keys are spec-legal and lint-neutral) but
  any future kind wanting to declare it should list it OPTIONAL, and note 'new'
  treats --actor as a control flag (a kind field named actor is settable only
  through it). doc update --actor alone is still 'nothing to patch' (deliberate:
  counting it as a patch would re-open the held-open-stdin hang class or
  silently stop consuming a piped body). Plugin 1.0.14 -> 1.0.15 (parallel
  branches may collide on the number — orchestrator reconciles at merge).
assignee: brian-claude
timestamp: '2026-07-08T15:19:36.341Z'
---
Driven evidence (PR#13 panel, consumer + mechanic lanes, empirical): receipt `actor:
unknown`, commit subject `board: unknown — 2 docs`, every incoming row `actor: unknown`,
on the product's own authoring path. The suite passes only because the U0 harness
hand-seeds actor frontmatter.

DoD: a real CLI path (`doc write/update/new` with `--actor`, or a decided fallback)
yields non-unknown attribution in the sync receipt, commit subject, and incoming rows —
test-pinned WITHOUT harness hand-seeding for at least one case. Decision to make at
build: persist `--actor` into frontmatter (schema question: is `actor` a convention
field?) vs a git-author fallback in enrichment (weaker: git identity is machine-level).
Must land BEFORE tasks/sync-sessionstart renders the human face ("mike · updated …").
