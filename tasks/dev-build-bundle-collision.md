---
type: Task
title: >-
  Local builds dirty the bot-owned plugin bundle - every subsequent git pull
  collides
status: in_progress
priority: '2'
description: >-
  Built + APPROVED, awaiting merge: fix/dev-build-bundle-collision @ c0e1695.
  Default build no longer writes the bot-owned committed bundle (mirror step
  deleted); ONE committed-path writer (build-plugin-bundle.mjs) consumed by CI's
  regen and the manual npm run build:plugin-bundle; stale hints repointed;
  CLAUDE.md invariant recorded. Regression pin runs the REAL root build and
  asserts plugins/+.claude-plugin/ byte-and-mode identical — reviewer proved it
  catches the original bug by revert experiment. Three-way byte equivalence
  (dev/CI/manual = sha 552783f3) verified twice. Side finding filed:
  tasks/bundle-cross-node-reproducibility (node-25 vs node-20 gzip divergence —
  explains why local builds ALWAYS dirtied the bundle).
actor: builder-collision
assignee: brian-claude
timestamp: '2026-07-15T16:17:35.988Z'
---

