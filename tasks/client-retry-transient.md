---
type: Task
title: 'RemoteBackend: retry transient 5xx / network errors with backoff'
status: done
priority: '1'
description: >-
  The D1 cold-start hiccups this session surfaced as HARD failures because
  RemoteBackend does not retry transient errors. FIX: wrap RemoteBackend's fetch
  (core/src/remote-backend.ts) in a bounded retry — retry on transient 5xx
  (500/502/503/504) AND network/fetch errors (ECONNRESET etc.), exponential
  backoff + jitter, ~3 attempts, capped. Do NOT retry 4xx — especially 412
  VersionConflict (a REAL result, not transient) — nor 401 auth. SAFE because
  our ops are content-addressed + CAS: a retried write lands the same version or
  a real 412; reads are always safe. Optional env override (e.g.
  AGENTSTATE_LITE_MAX_RETRIES). Tests: 500-then-200 -> retries and succeeds;
  persistent 500 -> fails after N with a clear error; 412 -> immediate, no
  retry; 400 -> no retry. Discovered while dogfooding on the deployed CF bundle;
  implement AFTER tier1-kind-capabilities commits (avoid tangling the tree).
timestamp: '2026-07-03T20:06:12.326Z'
---

