---
type: Context Note
title: CLI architecture review security findings
description: >-
  Redacted defensive findings and private-routing markers for the frozen
  packages/cli review.
actor: security-reviewer
timestamp: '2026-08-07T14:30:20.512Z'
---
# Summary

Read-only defensive security architecture assessment completed against frozen source revision `81b3c39ff252013e318b1a714b63430a24074d70` using approved template v1.0. No tests, runtime probes, network operations, source edits, or git mutations were performed by the security reviewer.

Potentially exploitable concerns that appear inherited from the released/main line require private handling. This public bundle intentionally records only redacted routing markers:

- `PRIVATE_ROUTE_REQUIRED`: physical filesystem containment across filesystem-backed bundle operations — affected files: `packages/core/src/backend.ts`, `packages/core/src/filesystem-lock.ts`, and CLI/server adapters that consume that backend.
- `PRIVATE_ROUTE_REQUIRED`: confidential remote-credential transport policy — affected files: `packages/cli/src/config.ts`, `packages/cli/src/bundle.ts`, `packages/cli/src/commands/ui.ts`, `packages/core/src/remote-backend.ts`, `packages/ui-server/src/proxy.ts`.
- `PRIVATE_ROUTE_REQUIRED`: bounded remote/server resource handling — affected files: `packages/core/src/remote-backend.ts`, `packages/server/src/serve.ts`, `packages/server/src/router.ts`.

The reviewed feature branch also has a non-released create-only concurrency hardening gap: the physical target identity is validated and claimed through multiple pathname-based phases, but the contract needs stronger ownership/revalidation through commit and rollback. A separate low-severity resource concern exists in the post-commit recursive isolation scan, which has no explicit depth/entry/time budget. Correct-layer remediation is stable target identity/ownership enforcement, rollback bound to the exact committed state, and bounded iterative isolation scanning. Defensive validation should inject target replacement and concurrent-content changes at every asynchronous phase boundary and assert fail-closed behavior, no writes/deletes outside the selected target, bounded termination, and truthful cleanup receipts.

Safeguards that held under static review include loopback-only defaults for local servers/UI, explicit warning for the no-auth reference server, exact Host/session checks and exact-byte View authorization with revalidation, private atomic credential storage, argv-based subprocess invocation with timeouts and environment controls, CAS and cross-process mutation locking, create-only preflight/expect-absent/post-commit isolation intent, exact build identity, clean-source release gating, retained-tarball verification, and a strict package-content/runtime-dependency allowlist.

Task remains `in_progress` for orchestrator aggregation, independent review, and any private disclosure workflow.
