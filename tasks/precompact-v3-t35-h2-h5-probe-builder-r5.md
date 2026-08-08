---
type: Task
title: Author exact R5 H2-H5 clean-room probe
status: canceled
priority: '1'
assignee: codex-t35-r5-builder
description: >-
  Canceled by runtime-neutral consolidation; the Claude/tmux clean-room host
  probe is no longer an implementation predecessor.
actor: codex-compaction-reconciliation
timestamp: '2026-08-08T16:39:20.939Z'
---
# Reconciled disposition (2026-08-08)

This exact Claude/tmux clean-room probe is canceled. It is no longer an implementation predecessor
after consolidation under the runtime-neutral
[compaction checkpoint lifecycle](../tasks/compaction-context-checkpoint-lifecycle.md). The accepted
boundary and prior review artifacts remain evidence, but no source authoring or host execution is
authorized by this Task.

# Goal

Author the exact clean-room R5 H2-H5 host-probe source without executing any part of it. This serves the ultimate agentstate-lite goal by turning the independently accepted host-fact boundary into reviewable immutable bytes while keeping every host mutation behind later static-review and admission gates.

# Exact authority

- Boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:33db32b3d9088052481301ee5829170c0ddee4f333eabf6b06907818bc951852`.
- Whole-system diagnostic: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c`.
- Acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r5@sha256:d2e72878e0e7968daae4daf268d111a0113d6aa09c9d7f4cc6c7dc83be51b050`.
- Skeptic PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r5@sha256:b3fc5bb7be1f1fc47baa2ea95bf1703a22e31d31a8d5973138ccc5e64bc5a384`.
- Output root already exists, is empty, and is mode 0700: `/private/tmp/aslite-t35-h2-h5-source-r5`.
- Sole source output: `/private/tmp/aslite-t35-h2-h5-source-r5/h2-h5-probe.mjs`.

# Build contract

Read the exact authority documents in full. Work clean-room: do not inspect or reuse any rejected R6/H2-H5 probe source. The selected retained-v5 source may be read only if required to bind the exact immutable E1 fields already named by R5; do not run it.

Implement the R5 boundary literally in one Node ESM source file, at most 800 nonblank/noncomment source lines. It must expose exactly four named question functions H2-H5 plus controller/event-writer/teardown and the explicit child modes permitted by R5. Preserve every bound vector/tool/path/digest, principal count, pre-registration rule, sealed-observer dataflow, P0/Git/P1 causality, one-shot admission validation, phase transition, evidence bound, protected-state rule, verdict classification, containment rule, and nonclaim. Incorporate the skeptic's byte-review residuals: exact durable Task id plus preclaim/claimed CAS or equivalent claim receipt, export digest, terminal-consumption receipt, idempotent crash recovery/finalization, and a rule that final Task shape or self-consistent JSON alone is insufficient evidence.

The script must never read or write the bundle. Its only orchestration input is the immutable exported admission JSON and digest described by R5. Do not add shell invocation, network, Claude/API/auth, npm cache use, repository/Plan/task mutation, extra clients, fallback actions, or automatic retry/rebaseline.

# Builder fence

Author only. Do not invoke Node on the file for any reason, including `node --check`, import, parse, unit test, child mode, or dry run. Do not execute tmux, Git helpers, ps, the retained v5 script, or any tool vector embedded in the source. Do not create an execution-admission export or run root. Do not mutate the feature worktree, bundle except for this task/context note, protected state, parent/handoff/Plan, or board sync.

Static reads are allowed after authoring: byte hashing, mode/owner/stat, ordinary line counts, lexical searches, and direct source inspection. These checks must not execute or import source bytes. Use `apply_patch` to create/edit the sole source file. Once final, set it read-only (0400) and do not change its bytes again.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-probe-builder-r5` with exact source path, SHA-256, byte count, total line count, nonblank/noncomment line count, owner/mode, a concise implementation map, static-only checks performed, known residuals, and explicit confirmation that no source execution or host-probe principal occurred. Close this Task with exact versions. A builder-complete result authorizes only fresh independent exact-byte static review.
