---
type: Plan
title: Plan — agent-relay comparative evaluation
description: >-
  Source-first team evaluation with constrained runtime evidence, independent
  review, and adversarial QA.
actor: codex-main
timestamp: '2026-07-26T18:12:20.217Z'
---
# Outcome

Deliver an evidence-backed, decision-useful comparison of agent-relay and agentstate-lite that separates direct overlap, complementary layers, relevant missing mechanisms, unique advantages, security/runtime risk, and justified product recommendations.

# Acceptance criteria

1. Identify the exact npm package/version/tarball and the associated open-source repository and license.
2. Compare capabilities using the shared taxonomy in [the domain model](../research/agent-relay-comparison-domain-model.md).
3. Separate E0 advertised, E1 shipped, E2 exercised, and E3 observed evidence; label related hosted/ecosystem products.
4. Explain install/run safety, including lifecycle scripts, dependencies, network, credentials, process spawning, filesystem scope, telemetry, updates, native code, and broker/cloud boundaries.
5. Perform source-first analysis, then only targeted runtime checks in a disposable, credential-free, network-disabled execution boundary where practical.
6. Produce both directions of the feature gap: useful Relay mechanisms agentstate-lite lacks, and unique agentstate-lite mechanisms Relay lacks.
7. Distinguish candidates to adopt, candidates to integrate with, and deliberate non-goals.
8. Subject the draft to an independent factual review before adversarial QA and final delivery.
9. Record evidence, limitations, and conclusions in the bundle; close and sync the research task.

# Team workflow

Backbone: fan-out/fan-in research with a generator-critic quality gate.

- **Relay architecture scout** — exact package/source architecture, messaging/delivery/runtime/workflow surfaces, and evidence grades.
- **Security specialist** — dependency and lifecycle risk, telemetry/update behavior, credentials/network/process/filesystem boundaries, and sandbox requirements.
- **agentstate-lite comparator** — independent current capability inventory and two-way mapping against the taxonomy.
- **Primary orchestrator** — npm provenance, constrained runtime experiments, synthesis, evidence ledger, and persistence.
- **Independent reviewer** — checks the synthesized draft for unsupported claims, scope confusion, omissions, and unfair comparisons.
- **Adversarial QA** — re-runs decisive observations and challenges negatives/recommendations after review findings are addressed.

Dependencies: taxonomy and acceptance criteria precede all research; the three specialist reviews run in parallel; synthesis waits on them; Review is a hard gate before QA; final delivery waits on QA.

# Scope constraints

No login, cloud enrollment, room creation, webhooks, schedules, real agent spawning, or use of user credentials. Do not run install lifecycle scripts. No writes to the repository outside agentstate-lite bundle records. Treat the downloaded package and source as untrusted input. Do not claim a security audit or production safety certification.

# Execution log

- 2026-07-26 — orientation complete; exact npm tarball and upstream repository acquired read-only; evaluation task claimed.
- 2026-07-26 — taxonomy, evidence policy, acceptance criteria, and fan-out → independent Review → adversarial QA gates defined.
