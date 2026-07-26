---
type: Research
title: Agent Relay comparison domain model and evidence policy
description: >-
  Shared taxonomy, evidence grades, scope boundary, and decision lens for
  comparing agent-relay with agentstate-lite.
actor: codex-main
timestamp: '2026-07-26T18:19:54.219Z'
---
# Purpose

Define a stable comparison vocabulary so the evaluation distinguishes adjacent product layers and grades every material claim by evidence.

# Product layers

- **Durable knowledge substrate** — long-lived, human-legible concepts, relationships, provenance, evolution, and retrieval.
- **Operational coordination substrate** — live agent identity, messages, inbox state, delivery, presence, and event routing.
- **Execution runtime** — process or harness lifecycle, spawning, attachment, steering, placement, and observability.
- **Workflow control plane** — ordered or graph execution, retries, barriers, schedules, approvals, and recovery.
- **File and artifact plane** — immutable artifacts, mutable shared files, permissions, mounts, synchronization, and writeback.
- **Human governance plane** — legibility, confirmation gates, auditability, authentication, authorization, and administrative control.
- **Extension surface** — kinds, recipes, Views, actions, MCP, SDKs, webhooks, providers, and protocol seams.
- **Ownership and portability** — who owns canonical state, offline behavior, open formats, diffability, and exit cost.
- **Reliability semantics** — CAS, idempotency, delivery receipts, replay, liveness, failure recovery, and concurrency boundaries.

# Terms that must not be conflated

- **Document CAS** is conditional mutation of a versioned knowledge object; **delivery idempotency** prevents duplicate operational actions. They solve different races.
- **Artifact storage** is content-addressed durable evidence; **shared file mounts** expose mutable provider-backed working files.
- **Task documents** persist agreed work state; **workflow execution** actively runs and supervises steps.
- **Actor attribution** records who changed knowledge; **agent presence** reports whether a runtime is live.
- **Local-first** means canonical work remains useful without a service; **locally runnable** can still depend on an operational broker or external identity.
- **Package feature** means present in the exact published npm artifact; **repository feature** means present in current source; **ecosystem feature** means supplied by a related package or hosted service.

# Evidence grades

- **E0 — advertised:** stated in marketing or documentation only.
- **E1 — shipped:** visible in the exact package manifest, packed files, or relevant source.
- **E2 — exercised:** covered by tests or an inspectable executable path.
- **E3 — observed:** reproduced in this evaluation's constrained runtime.
- **E4 — operationally validated:** proven under realistic multi-agent or failure conditions; out of scope unless explicitly performed.

All final claims must include enough wording or annotations to reveal their highest evidence grade. Runtime absence is not proof of feature absence; source absence across the scoped surfaces plus independent review is the standard for a negative claim.

# Evaluation boundary

The primary target is `agent-relay@11.2.0`, packed from npm on 2026-07-26. npm's SLSA provenance attestation binds that artifact to `AgentWorkforce/relay` commit `4dac087288ec0a4947d3b69a5dbd03da68392b38`; the packed build and attested commit remain distinct evidence surfaces, and any divergence from post-publish main must be labeled. Relayflows, Relayfile, RelayCron, Relayloop, and hosted Agent Relay are ecosystem evidence, not automatically package evidence. The agentstate-lite comparator is the current workspace at commit `b83a40b960e623e0684d9d72531cb7df41b7af87` (local `origin/main` was two commits newer and limited to UI renderer work when checked), with current source and bundle behavior taking precedence over older vision prose.

# Decision lens

A Relay capability is a meaningful product gap only if it strengthens agentstate-lite's durable knowledge mission proportionately. Capabilities that belong to live messaging, process orchestration, or hosted fleet management should usually be treated as integration opportunities or deliberate scope boundaries, not copied into the core.

Related work: [evaluation task](../tasks/agent-relay-comparative-evaluation.md), [agentstate-lite core](../docs/core.md), and [north star](../docs/north-star.md).
