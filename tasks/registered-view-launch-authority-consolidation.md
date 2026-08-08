---
type: Task
title: Consolidate registered-View launch authority into view-runtime
status: in_progress
priority: '2'
description: >-
  Delete the web host's parallel registered-View preparation/currentness/catalog
  path and route web plus MCP through one view-runtime authority while
  preserving exact local/remote behavior.
actor: openai/codex
timestamp: '2026-08-08T14:05:46.385Z'
---
# Objective

Make `view-runtime` the literal single authority for registered-View preparation, identity,
currentness, and catalog semantics across the web and MCP hosts, deleting the web host's live
parallel implementation without changing user-visible behavior.

# Scope

- Require a semantic `Bundle` in both local and remote `UiServerOptions` modes while retaining the
  remote origin/key separately for `/v0/*` proxy transport.
- Route exact-ID web minting through `mintActiveViewLaunch`, launch revalidation through
  `launchIsCurrent`, and catalog projection through `listViewCatalog`.
- Remove the private no-`Bundle` remote registry/blob/currentness implementation and its
  fallback-only tests.
- Preserve the web host's current success payloads, HTTP status/messages, authorization behavior,
  nonce/CSP behavior, and legacy `{ key }` ingress through explicit typed runtime failures and a
  narrow key-to-registry adapter where required.
- Delete imports/helpers outside `view-runtime` that can reconstruct registered launch identity.

# Non-goals

- No generic provider/service abstraction.
- No wire-protocol, UI, approval-policy, mutation, transient-launch, or legacy naming/location
  behavior change.
- Do not remove `{ key }` compatibility in this unit.

# Proof

- Pre-change local and RemoteBackend route fixtures pin success and failure taxonomy for missing or
  invalid registration, missing/pinned/inadmissible entry, mid-mint drift, upstream failure, and
  authorized/unapproved success.
- A local/remote web-versus-MCP agreement table proves identical registry identity/version, entry,
  capability, normalized content type, and host-computed byte hash.
- Perturbing runtime admission/hash/currentness makes both host proofs fail.
- Static ownership proves no production source outside `view-runtime` mints
  `sourceKind: registered` or reconstructs its identity.
- Focused View/UI-server suites and the full repository gate pass.

# Review tier

Security-boundary behavior-preserving consolidation: builder, exact-SHA independent review, then
focused adversarial QA centered on fixture provenance and fail-closed remote behavior.

# Evidence

[Finding](../findings/registered-view-launch-authority-investigation.md)

[Synthesis](../findings/architectural-smell-investigation-synthesis.md)
