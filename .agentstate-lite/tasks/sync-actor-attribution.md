---
type: Task
title: >-
  Actor attribution: doc write --actor must reach frontmatter (PR#13 review,
  item 3)
status: todo
priority: '1'
description: >-
  HIGH, blocks U4's human face: every CLI-authored doc renders actor 'unknown' —
  --actor persists only as engine version attribution, never frontmatter, which
  is the ONLY source changesSince reads (adjudication F).
timestamp: '2026-07-08T15:03:34.178Z'
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
