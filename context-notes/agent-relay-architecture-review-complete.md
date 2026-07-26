---
type: Context Note
title: Agent Relay 11.2.0 architecture review complete
description: >-
  Evidence-graded architecture inventory for the exact published package and
  attested source commit.
tags:
  - agent-relay
  - architecture
  - comparison
actor: codex-relay-architect
timestamp: '2026-07-26T18:25:06.580Z'
---
# Summary

Proximate goal completed: traced the exact published agent-relay 11.2.0 package and its SLSA-attested source commit 4dac087288ec0a4947d3b69a5dbd03da68392b38 so the comparison can distinguish durable-knowledge gaps from adjacent messaging, runtime, workflow, and hosted layers. This serves the ultimate goal of preserving agentstate-lite as a durable, portable, conflict-safe knowledge system without copying unrelated operational machinery.

The npm artifact is a thin CLI and MCP operator facade plus a top-level JavaScript re-export. It delegates messaging to the sibling SDK and Relaycast clients, local process control to harness-driver and the platform broker binary, hosted operations to cloud, workflows to Relayflows, and provider file mounts to Relayfile.

Relay is strong in live messaging, durable delivery contracts, idempotency, presence, process lifecycle, typed actions, nodes and capability placement, MCP surfaces, and operational recovery. Source tests support many client and broker paths. The main evaluator also obtained E3 evidence: under a Seatbelt profile allowing loopback networking and the exact Node and broker processes, the broker bound a local API port but node up failed during the mandatory default handshake to https://cast.agentrelay.com and exited. Exact source rejects AGENT_RELAY_DISABLE_RELAYCAST and says the broker requires Relaycast, while RELAYCAST_BASE_URL and RELAY_BASE_URL allow a compatible alternate endpoint. The supported boundary is therefore Relaycast-dependent but not necessarily vendor-hosted; standalone offline operation is not supported.

The local broker persists state, pending deliveries, dead letters, and dedup snapshots in persist mode using atomic JSON writes; its replay buffer is bounded in-memory state. These are operational recovery records, not the canonical workspace message store. Relaycast owns canonical messages, inboxes, delivery ledgers, and observer event logs through APIs whose server implementation is outside the reviewed repository.

No first-party repo-native, human-legible knowledge graph, semantic document kind system, per-document version history, or document compare-and-swap substrate was found in the searched exact package and source surfaces. File features are message attachments or Relayfile integration, not an agentstate-lite-style knowledge or artifact substrate.

Important provenance caveat: the attested source commit still declares version 11.1.1 in manifests; the published package declares 11.2.0. The SLSA provenance binds the package to that commit, indicating a release-time version bump. Current main is post-publish and was used only as contextual comparison.

Architecture implication: agentstate-lite and Relay are complementary. Keep durable task, decision, and knowledge state in agentstate-lite; use Relay as an optional operational messaging and runtime integration. Candidate integration lessons are delivery receipts, idempotency keys, replay cursors and explicit gaps, and dead-letter recovery. Agent spawning, hosted rooms, workflow control, and provider mounts are adjacent layers rather than core knowledge-substrate requirements.
