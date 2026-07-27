---
type: Task
title: >-
  No test proves the host-computed hash beats a dishonest backend version
  (active View launch)
status: todo
priority: '3'
description: >-
  PR #172 moved launch identity to a host-computed hash, but no committed test
  serves a mismatched backend version. actions.test.ts mints via
  PageLaunchRegistry.mint() with blob.version, bypassing
  admitActiveView/blobVersion entirely — and FilesystemBackend's version IS the
  byte SHA, so the two coincide and the gap is invisible until a
  document-centric remote backend. Coverage gap, not a live vulnerability.
actor: mike/claude
timestamp: '2026-07-27T01:58:36.398Z'
---
# Gap

PR #172 (`52e127e`) moved active-View launch identity from a backend-asserted version to a
host-computed hash. `handleMint` now admits bytes through `admitActiveView` and mints with
`contentVersion: blobVersion(admitted.bytes)`; `viewLaunchIsCurrent` compares against the same
computed value. The PR reports adversarial QA covering "lying backend versions".

Four of that QA's five claims map onto named committed tests (in-flight revocation, action races,
chunked ingress, self-authorization). This one does not: no committed test serves a backend version
that disagrees with the actual bytes and asserts the host's computed hash governs the decision.

# Why the fixtures hide it

`packages/ui-server/test/actions.test.ts` builds its launch by calling `PageLaunchRegistry.mint()`
directly with the backend-supplied values:

    contentType: blob.contentType,
    contentVersion: blob.version,

That bypasses `handleMint` — and therefore bypasses `admitActiveView` and `blobVersion()` — for the
entire trusted-action suite, including the race and revocation tests. The production path is
correct; the tests simply do not travel it.

This is invisible under the default backend by construction. `FilesystemBackend`'s version IS the
SHA of the on-disk bytes, so `blob.version` and `blobVersion(bytes)` coincide, and a fixture using
either looks identical. They diverge only where version is not a content hash — a document-centric
remote backend with its own version chain, which is the flagship direction in `docs/north-star`.

Consequence: a regression that restored `blob.version` as the trust anchor in `handleMint` would
keep the current suite green.

# Scope

1. Add a test that mints through the real `handleMint` path against a backend reporting a version
   that does not match the bytes, and assert the launch's `contentVersion` is the computed hash —
   and that a stored approval for the honest bytes does not admit the substituted ones.
2. Cover the `viewLaunchIsCurrent` remote branch specifically. It is the path that reads
   `remoteRegistryHeads` and re-admits bytes, so it is where a dishonest version would arrive.
3. Consider routing `actions.test.ts`'s fixture through `handleMint` rather than `mint()` directly,
   so the trusted-action suite exercises admission rather than assuming it. If the direct mint is
   deliberate for isolation, say so in a line of comment — the current fixture reads as if it were
   the production shape.

# Not a vulnerability

`handleMint` is the only production mint path and it computes the hash correctly. This is a
coverage and regression-resistance gap, not an exploitable defect on main. Filing it publicly is
therefore appropriate under the disclosure rule.

# Provenance

Read-based review of `52e127e` during a board check-in, 2026-07-26. The suite was not re-run; the
claim here is about which tests exist and what they traverse, not about their pass state.
