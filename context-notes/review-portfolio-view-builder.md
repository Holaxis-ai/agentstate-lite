---
type: Context Note
title: Review portfolio View builder
actor: review-view-builder
timestamp: '2026-08-08T18:04:31.254Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** prove the current Review portfolio View's scale, liveness, completeness, and multiplicity failures against the actual v0 authority, then produce inert candidate bytes that repair those failures without narrowing open OKF identity; this serves the ultimate goal by making human currentness claims exact, bounded, and fail-closed.

## Phase boundary: C1 red harness complete

The exact current View `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea` was executed through `/private/tmp/review-portfolio-bridge-harness.test.mjs@sha256:78f6627c8eef3aa45aba8c435ab5590991f8d44175dc534f8b3f7c66e762e9ca`.

Literal red command:

```sh
REVIEW_PORTFOLIO_VIEW_HTML=/private/tmp/reviews-current.html node --test /private/tmp/review-portfolio-bridge-harness.test.mjs
```

Receipt `/private/tmp/review-portfolio-view-red.log@sha256:3fdd27f17f8f6d55f1577b0bba0667e7653c2cd2e3a99a8bdabc2edacefc4589` records exit 1, 26 tests, 3 pass, 23 fail, 0 cancelled. Failures reproduce: concurrent rather than one-in-flight whole-portfolio scans; over-cardinality 33/500 arrays; no malformed/duplicate/raw-byte row-ID preflight; no deterministic batches/first-failure stop/per-direction budget/batch recovery; lossy Set multiplicity; and host-side boundary-whitespace selector mutation. Exact relation text and the empty-portfolio case survive.

The host lane changed concurrently between the first and final red runs: invalid v0 requests now return same-id errors, so 33/500 settle as `live · incomplete` instead of timing out. That is expected host progress, not a harness relaxation. The harness still enforces the declared 5/15-second deadlines and retains pending id/direction/batch diagnostics; parser-invalid portfolio requests are never passed to the controlled-fault injector.

## Harness model and next action

The exact View HTML runs under JSDOM. Its frame messages are structured-cloned into the host realm. Real mode forwards all messages to the built `BridgeService` over a seeded `MemoryBackend`. Fault mode first calls the real `parseBridgeRequest`, then injects only the requested result/rejection shape. Auto-selected single-record relation calls remain outside the portfolio batch counters, preserving the existing selected-detail path while proving the portfolio's separate sequential bound.

Next action: claim `tasks/review-portfolio-view-repair`, apply the smallest candidate-only patch to the exact current HTML, and run this same harness green. No source/live View/registry/blob/commit/push/sync mutation is authorized in this lane.
