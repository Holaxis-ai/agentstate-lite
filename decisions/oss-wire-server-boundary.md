---
type: Decision
title: 'OSS wire boundary: keep packages/server public; extract Worker/auth/deployment'
description: >-
  The generic wire/router/reference server stays OSS; packages/worker and hosted
  control-plane concerns are the private extraction unit.
actor: codex
timestamp: '2026-07-12T22:57:38.190Z'
---
# Decision

`packages/server` remains in the OSS repository as the shared Fetch-standard wire/router and Node reference-server authority. It is not part of the hosted control plane being extracted.

The private/SaaS extraction unit is `packages/worker` plus its D1/R2 backend, Cloudflare deployment, identity/authentication, membership, invitations, keys, and future tenancy/billing/admin surfaces.

## Evidence

- `packages/server` is a pure consumer of core and owns the one wire router used by both local UI and Worker.
- Local `ui --dir` imports `createRouter` and the Node Request/Response adapters from this package.
- Worker imports `createRouterForBackend` from the same package and adds hosted storage/auth/deployment around it.
- Moving the server package private would either break local Pages or force a duplicate router. Neither is acceptable.

## Consequences

- Keep core transport-agnostic; no HTTP concerns move into core.
- Keep `RemoteBackend`, explicit `--remote`, the wire protocol/spec, and the reference server OSS.
- Publish and version both `@agentstate-lite/core` and `@agentstate-lite/server` before a private Worker repository consumes them.
- Move Worker/auth/deployment only after those package boundaries exist.
- No bespoke package-boundary static analyzer is required. Ordinary package declarations, focused package tests, runtime wire/UI integration tests, and code review are proportionate enforcement.

## Follow-up found during investigation

`packages/ui` imports `@agentstate-lite/server` from its E2E harness without declaring the corresponding dev dependency. Fix that independently as a small packaging-hygiene unit.

## Discarded experiment

An unpushed branch attempted a comprehensive static package/dataflow boundary checker. Review and QA showed that proving arbitrary future import, reachability, workspace, and symlink behavior would require disproportionate compiler-like machinery. The branch and worktrees were deleted without merge or push. This decision does not depend on that checker.
