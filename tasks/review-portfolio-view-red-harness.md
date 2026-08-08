---
type: Task
title: Create exact Review portfolio red harness
status: done
priority: '1'
assignee: review-view-builder
actor: review-view-builder
timestamp: '2026-08-08T18:04:31.067Z'
---
# Objective

Create the durable exact-View harness and reproduce scale, liveness, aggregation, and fail-closed defects before changing candidate View bytes.

# Acceptance

Use the exact current View with the real built parser/service/core for 0/1/32/33/500 and a parser-validating fault broker. Cover 5/15-second deadlines, pending-id/direction/batch diagnostics, malformed/duplicate row ids, exact whitespace identities/text, one-in-flight sequencing, stop-first-failure, 1,000 rows per direction, strict counts, and repeated-literal multiset behavior. Preserve failing receipts.

# Outcome

Completed red-first on exact `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea` before any candidate edit.

- Harness: `/private/tmp/review-portfolio-bridge-harness.test.mjs` at `sha256:78f6627c8eef3aa45aba8c435ab5590991f8d44175dc534f8b3f7c66e762e9ca`.
- Red receipt: `/private/tmp/review-portfolio-view-red.log` at `sha256:3fdd27f17f8f6d55f1577b0bba0667e7653c2cd2e3a99a8bdabc2edacefc4589`.
- Literal command: `REVIEW_PORTFOLIO_VIEW_HTML=/private/tmp/reviews-current.html node --test /private/tmp/review-portfolio-bridge-harness.test.mjs`.
- Result: exit 1; 26 tests, 3 pass, 23 fail, 0 cancelled, duration 879 ms.

The real-authority rows show current portfolio concurrency 2 at 1/32; 33/500 produce parser-invalid over-cardinality arrays and only an incomplete snapshot under the concurrently repaired correlated-error host; malformed/blank/oversize/duplicate row IDs are not rejected before graph work; the current View does not sequence/short-circuit/budget batches or name a batch; Set aggregation erases repeated literal multiplicity; the concurrently built host still trims boundary-whitespace selectors and returns zero instead of the literal edge. The 5-second ordinary and 15-second 500 deadlines remain executable; this run settled sooner because the concurrently repaired host now correlates invalid v0 errors instead of leaving client promises pending. Diagnostics retain every request id, direction, batch, parser validity, reply id, and maximum portfolio-edge concurrency.

The controlled-fault path never injects a reply until `parseBridgeRequest` accepts the structured-cloned frame message. Valid scale requests use the built `BridgeService` over `MemoryBackend`; no permissive fake transport was substituted.

[governed by](../plans/review-portfolio-bridge-identity-repair.md)
