---
type: Context Note
title: agent-relay comparative evaluation orientation
description: 'Purpose, system model, and current state for the agent-relay comparison.'
actor: codex-main
timestamp: '2026-07-26T18:20:56.891Z'
---
# Summary

Ultimate goal: make agentstate-lite a durable, portable, conflict-safe collaboration substrate in which humans and agent fleets co-create legible knowledge without proprietary lock-in.

Proximate goal: produce an evidence-backed comparison of the current agent-relay npm package and agentstate-lite, so product decisions can distinguish useful missing mechanisms from capabilities that do not serve the core.

Progress: required skills and repository instructions are loaded; current bundle/product context was reviewed; `agent-relay@11.2.0` and the Apache-2.0 `AgentWorkforce/relay` source were acquired read-only; the evaluation is scoped by [a domain model](../research/agent-relay-comparison-domain-model.md) and [a gated team plan](../plans/agent-relay-comparative-evaluation.md). Differentiated parallel review is running. The primary agent installed 443 packages with lifecycle scripts disabled and optional dependencies omitted into a disposable directory, then observed version/help/status only under a validated deny-network/deny-write/deny-home-read/no-subprocess sandbox; no broker, harness, cloud, or real agent was started.

Runtime/install evidence: the scripts-disabled, optional-dependency-omitted install resolved 443 packages and occupied 578 MB (581 manifests, 4 native addons, 15 bundled broker executables). A time-sensitive npm audit on 2026-07-26 reported 12 advisories (1 high, 11 moderate, 0 critical); reachability was not established. The hardened macOS sandbox was behaviorally validated: package reads succeeded while home reads, writes, network, and non-Node child execution returned EPERM. Under it, version/help/status/telemetry-status/node-status/fleet-status and help subcommands exited cleanly. Telemetry and update checks were explicitly disabled. No functional broker/delivery test has run.

Current system model: agentstate-lite is a durable local-first OKF Markdown knowledge substrate with per-document CAS/history/actor semantics, semantic kinds/recipes/link graph, artifacts, bundle-governed Views, pluggable storage, and git board sharing. Agent Relay is primarily an operational coordination and execution substrate: durable real-time messaging/delivery plus runtime, node/fleet, action, workflow, and cloud control surfaces. They overlap at agent collaboration and durable state but occupy different primary layers.

Verified acquisition: npm packed `agent-relay@11.2.0` (shasum `7455e11a5990e249a27d42253cbd9cf3e0dca99c`) into `/private/tmp/agent-relay-eval.qTMdri`; npm's SLSA attestation binds the artifact to upstream commit `4dac087288ec0a4947d3b69a5dbd03da68392b38`; post-publish cloned HEAD was `af898f7998246e3e1cc70d2a8de6cee77a33210f`. Repository metadata associates the package with `https://github.com/AgentWorkforce/relay`, directory `packages/cli`, Apache-2.0.

Unverified or deliberately bounded: reproducibility of the published build from the attested source commit; production cloud behavior; real multi-agent delivery/failure behavior; security of every transitive dependency; hosted products described in versioned ecosystem docs; any claim that the package is safe to run without isolation. Runtime tests will not log in, enroll, spawn real harnesses, or contact cloud services.

Persistent task: [agent-relay comparative evaluation](../tasks/agent-relay-comparative-evaluation.md).
