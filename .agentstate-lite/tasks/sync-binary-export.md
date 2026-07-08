---
type: Task
title: >-
  Binary-safe conflict exports + show-incoming --out (utf8 round-trip corrupts
  non-text bytes)
status: todo
priority: '2'
description: >-
  U3b reciprocal-review finding (2026-07-08, empirically confirmed): runGit
  decodes all stdout as utf8, so a conflicted BINARY file's :3: export corrupts
  irreversibly (11-byte blob -> 21 bytes, high bytes -> U+FFFD); same cause
  reaches show-incoming --out. Only the RESCUED copy is affected — kept board
  content moves via git checkout and stays byte-exact. LATENT-NOT-LIVE: today's
  board carries zero blobs, and the U3b task record already notes exports are
  utf8-only. Wake condition: board blobs going live (e.g. promoted HTML on the
  board branch). Likely fix: a binary/buffer spawn option on the one runGit
  chokepoint, fed by show/export paths. See PR #15 review for the repro.
actor: claude
timestamp: '2026-07-08T17:03:59.299Z'
---

