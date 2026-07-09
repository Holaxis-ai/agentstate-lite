---
type: Task
title: >-
  Binary-safe conflict exports + show-incoming --out (utf8 round-trip corrupts
  non-text bytes)
status: done
priority: '2'
description: >-
  CLOSED by fix/sync-u3b-hardening (commit 01bd2be) — the finding's own named
  'likely fix' is exactly what shipped: runGitBytes is now the ONE spawn
  chokepoint (buffer stdout, decoded stderr, every wrapper invariant intact)
  with runGit as its utf8-decoding projection, fed by both predicted consumers —
  the :3: conflict-export write and show-incoming --out. Delivered BEYOND the
  prediction: byte-exact exports (the RESCUED copy now matches the blob
  byte-for-byte, mode 0600), BOTH --out modes byte-exact (--out <file> and --out
  - stdout streaming, size_bytes computed from the Buffer), and a pinned
  regression: an add/add conflict over an invalid-UTF-8 blob (sanity-asserted
  non-utf8-round-trippable) round-trips byte-identically through the export AND
  both --out channels, with the kept upstream blob landing byte-identically in
  the worktree. The wake condition was 'board blobs going live' — closed BEFORE
  the wake: no blob ever hits the corrupting path.
actor: builder-u3b
timestamp: '2026-07-08T17:29:50.040Z'
---

