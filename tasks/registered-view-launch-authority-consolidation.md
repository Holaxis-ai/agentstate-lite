---
type: Task
title: Consolidate registered-View launch authority into view-runtime
status: done
priority: '2'
description: >-
  Delete the web host's parallel registered-View preparation/currentness/catalog
  path and route web plus MCP through one view-runtime authority while
  preserving exact local/remote behavior.
actor: openai/codex
timestamp: '2026-08-08T14:44:17.051Z'
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

- Treat the shipped `RemoteBackend` plus semantic `Bundle` as the remote baseline. Tests of the
  private no-`Bundle` fallback are removed rather than preserved as compatibility behavior.
- Local and RemoteBackend route fixtures pin the observable success and failure taxonomy for
  missing or invalid registration, missing/pinned/inadmissible entry, upstream failure, and
  authorized/unapproved success.
- Host agreement is proven through observable launch fields, exact-byte authorization/currentness,
  and direct static ownership. Internal registry versions are intentionally not added to HTTP/MCP
  payloads merely to make an implementation-detail comparison possible.
- Perturbing runtime admission, byte identity, or currentness makes the retained host proofs fail.
- Static ownership proves no production source outside `view-runtime` mints
  `sourceKind: registered` or reconstructs its identity.
- Focused View/UI-server suites and the full repository gate pass.

# Review tier

Security-boundary behavior-preserving consolidation: builder, exact-SHA independent review, then
focused adversarial QA centered on fixture provenance and fail-closed remote behavior.

# Evidence

[Finding](../findings/registered-view-launch-authority-investigation.md)

[Synthesis](../findings/architectural-smell-investigation-synthesis.md)

# Completion

Implemented and merged in [PR #227](https://github.com/Holaxis-ai/agentstate-lite/pull/227)
(`6d1b811`, merge commit `d65af30`). The web and MCP hosts now delegate registered-View minting
to `view-runtime`; the web host's private remote registry/blob/currentness path and fallback-only
tests were deleted. The change removed 108 net lines.

The full repository gate passed on Node 20, 22, and 26. Exact-SHA independent review approved the
change after one remote error-parity correction. Focused adversarial QA then passed registry and
blob swaps, stale-approval isolation, nonce revocation, HTTP-versus-transport error mapping, and
exact-ID/legacy-key anti-pairing with no remaining findings.
