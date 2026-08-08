---
type: Context Note
title: Review portfolio relation-detail repair boundary
actor: review-view-builder
timestamp: '2026-08-08T15:58:26.914Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions are easy to find, correctly typed, and linked to evidence and governed work.

**Proximate goal:** repair the exact current Review portfolio so every incomplete relation-detail response gives an actionable retry/CLI complete-evidence path; this serves the ultimate goal by keeping partial graph evidence visibly non-authoritative and recoverable without inventing a second review system.

## Phase boundary

Builder `review-view-builder` is reopening only `tasks/architecture-review-alignment-portfolio-view`. The exact starting blob is `pages/reviews.html@sha256:2ceab5dfe2dfca39f22fb72175e9e760330aa1690db890b819d601436ca6035f`; the registry remains `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.

The bounded defect is operator guidance in relation detail: rejected, missing-count, and bridge-truncated directional edge responses already fail closed and show accurate counts, but do not always show a concrete Retry or CLI complete-evidence next action. No source code, migration inventory, wrappers, registry identity/access, or other artifacts are in scope.

## Required evidence

The prior red/green and static security harnesses must remain green. A focused fixture must reproduce outbound `{edges:[one],count:2}` plus inbound `{edges:[],count:0}` and prove the rendered incomplete state includes the next action. Promotion is CAS-only, followed by exact-byte pullback and a Task outcome update to `done`; no sync is authorized for this child phase.

## Completion boundary

The bounded repair is complete. `pages/reviews.html` is now `sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9` (49,590 bytes); registry `pages-registry/reviews` remains exactly `sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`. The focused fixture went red on the former exact bytes and green on both candidate and promoted pullback; the prior red/green and static security gates also pass. Task `tasks/architecture-review-alignment-portfolio-view` returned to `done` at `sha256:b6322f61c2ab7b8a23d2d96f6a7d5443bec13713de97a9432121797aabc94c6d`.

Independent exact-byte re-review and browser/adversarial portability QA remain downstream gates; this builder made no source-code, inventory, wrapper, registry, or sync changes.

## Structural repair phase

The portfolio task is reopened for one representation-boundary repair starting from `pages/reviews.html@sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9`; registry `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03` remains frozen.

The proximate goal is now to align every emitted edge request, result-completeness decision, and human CLI recovery subcommand with the shipped v0/parser and open-world identity contracts. This serves the same ultimate goal by ensuring the View cannot convert invalid bridge evidence or unsafe string construction into an authoritative or misleading human action.

This phase removes unsupported edge request fields, centralizes strict collection/count validation, and centralizes POSIX quoting plus the invocation-neutral recovery subcommand. It will use the real `parseBridgeRequest`/service path, adversarial count shapes, and representative opaque IDs as executable feedback before CAS promotion. Source code, protocol, inventory, wrappers, registry, ID schema, and sync remain out of scope.

## Structural repair completion

The repair is complete at `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea` (50,182 bytes); registry `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03` remains unchanged. All View edge requests now match the shipped v0 grammar, strict array/count classification is shared across every query and graph surface, and the recovery subcommand preserves opaque IDs as one POSIX-shell argument without assuming an executable prefix.

The candidate and exact promoted pullback passed the real parser/service correlation probe, strict fake bridge, adversarial count shapes, representative ID quoting, focused relation-detail fixture, prior five-family regression harness, static security, exact-byte comparison, and bundle-health gates. Task `tasks/architecture-review-alignment-portfolio-view` is ready to return to `done`. Independent exact-byte re-review and browser/adversarial QA remain downstream; no source-code, protocol, inventory, wrapper, registry, ID-schema, or sync change occurred.
