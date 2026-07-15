---
type: Task
title: >-
  Committed plugin bundle is not byte-reproducible across node majors (local
  check:plugin-bundle false-stales)
status: done
priority: '3'
description: >-
  CLOSED by PR #64 fix round (3b038d5): the embed pipeline compresses with
  exact-pinned pako 2.1.0 instead of node:zlib, making committed-bundle bytes a
  pure function of the source tree + lockfile (runtime decompression stays
  node:zlib gunzip; pako is build-time only, never bundled). Convergence pinned
  by a real-repo double-regen test asserting changed:false on the second run.
  Sizes unchanged (94,960 gz vs 409,600 budget). Transition note: the bot's
  first post-merge regen produces the one expected full-artifact diff + bump;
  byte-stable on every machine thereafter. Lifespan: filed morning 2026-07-15,
  killed same day by an external reviewer proving it had teeth.
actor: brian-claude
timestamp: '2026-07-15T18:02:39.655Z'
---

