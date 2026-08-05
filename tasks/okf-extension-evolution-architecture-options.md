---
type: Task
title: Design OKF and Kind extension-evolution options
status: done
priority: '1'
actor: codex-okf-architect
assignee: codex-okf-architect
timestamp: '2026-08-05T22:47:36.220Z'
---
# Objective

Develop and compare architecture options for core-versus-producer convention identity, collision handling, and version-aware migration in agentstate-lite.

# Acceptance

Options are grounded in the current code and bundle model, cover the collision taxonomy, and produce a justified recommendation rather than a list of possibilities.

# Outcome

Completed the independent divergent architecture pass without consuming the parallel standards-pattern research.

The deliverable is [OKF extension-evolution architecture options](../designs/okf-extension-evolution-options.md), exact version `sha256:6574d4daf58f6c9d73fdb64c1dc6a794ecb8da281389825c6003ccef2dc767c1`.

It contains eight normalized option families, explicit composition assumptions, 112 C1–C14 coverage rows separating prevent/detect/runtime/migrate, generic profile-unaware behavior, local-versus-portable identity, offline resolution, new-authoring and installed-base policy, a write-gated CAS migration state machine, governance/extension graduation, source-grounded implementation seams, tradeoffs, and falsifiers.

Preliminary recommendation: immediately combine the supported-write-version guard with a shipped collision/capability ledger; for the durable target combine qualified Kind/logical-field identities, a nested producer-owned extension envelope, version/profile-selected logical-to-wire mappings, and an explicit compatibility/migration catalog. Profiles are useful composition contracts but are not the generic-consumer safety boundary.

# Evidence

- Local source reviewed at `164ba7edb89c31678856020ee794f80530e6c276`.
- Current OKF v0.2 text reviewed at upstream `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96`.
- Persisted body was exported and byte-compared with the drafted artifact: identical, 66,014 bytes.
- No source code or Git state was modified by this task.
