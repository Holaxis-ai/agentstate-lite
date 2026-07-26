---
type: Context Note
title: Relay security context-boundary system model
actor: codex-relay-security
timestamp: '2026-07-26T18:23:38.508Z'
---
# Summary

Context boundary reorientation for the relay-security specialist.

Ultimate goal: make agentstate-lite a durable, portable, conflict-safe collaboration substrate where humans and agent fleets co-create legible knowledge without proprietary lock-in.

Proximate goal: determine the least-authority install and runtime profile for agent-relay@11.2.0 and distinguish hard isolation from cooperative controls, serving the ultimate goal by keeping any comparison or integration evidence-based and controllable.

Current system model: the exact npm tarball is 11.2.0 and has a registry SLSA attestation to source commit 4dac087288ec0a4947d3b69a5dbd03da68392b38. The attested source manifests still say 11.1.1 and its root lock says 10.6.0, so neither source manifest nor lock alone proves the published dependency graph. The package itself has no consumer lifecycle hook, but it has a large unbundled dependency graph and platform-native broker/addon packages. The CLI loads cwd .env, inherits the parent environment into broker and harness subprocesses, starts a native loopback HTTP broker, and requires a hosted Relaycast connection for functional startup. It is a process-control system, not an OS sandbox. Telemetry and update checks are suppressible by environment flags; those are cooperative controls, while network/filesystem/process containment must come from the OS sandbox. Reflex history upload is explicit opt-in but high privacy impact when enabled. Cloud, fleet, update, remote-skill, dynamic-workflow, and configuration-writing commands are outside a least-authority smoke test.

Evidence boundary: static inspection of the exact tarball and exact attested source is E1/E2. The primary agent separately performed a disposable E3 CLI smoke test with scripts/optional dependencies disabled and OS sandbox restrictions; no broker, harness, or cloud operation ran. Exact platform broker binary provenance/content remains unverified here, especially whether the Rust telemetry key was compiled into the distributed binary.

Unverified assumptions: exact installed transitive versions are represented only by the primary agent's temporary install lock, not the stale source lock; package-audit findings are time-sensitive and reachability-unproven; a functional broker test cannot be offline because the exact source rejects Relaycast-disabled startup.
