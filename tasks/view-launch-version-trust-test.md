---
type: Task
title: >-
  No test proves the host-computed hash beats a dishonest backend version
  (active View launch)
status: in_progress
priority: '3'
description: >-
  BUILT, NOT PUSHED — 3 pins green + probed red on branch
  test/view-launch-version-trust @ 33d67bf, local worktree only, no PR. Review
  returned 2 findings: the middle pin's characterization is corrected and
  committed; remaining work is to adopt #173's mintActiveViewLaunch in
  actions.test.ts after #173 merges. An unpushed local commit is not recoverable
  by another agent — push before relying on this record for handoff.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-27T03:10:25.039Z'
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

# Current state (2026-07-27) — BUILT, NOT PUSHED

The tests are written, green, and probed red. **The work exists only as a local commit on one
machine.** Nothing is on the remote, so another agent cannot fetch it — see "Handoff" below before
assuming this is recoverable.

- branch: `test/view-launch-version-trust` (branched from `origin/main` @ `b3006c9`)
- commit: `33d67bf`
- worktree: `/Users/collier/projects/Holaxis/agentstate-lite-view-version-test` (Mike's machine)
- push state: **not pushed**, no PR open

Delivered: `packages/ui-server/test/view-launch-version-trust.test.ts` (3 pins over the real mint,
authorize, and nonce-serve paths against an upstream that pins one `x-version` across a byte swap),
plus the `actions.test.ts` fixture fix.

Gates at that commit: build 0, typecheck 0, full workspace suite 0 (1746 node:test + 140 vitest),
ui-server suite 42/42. Probed red by reverting `handleMint` and `viewLaunchIsCurrent` to
`blob.version`: all three pins fail, then restored and re-verified green.

# Review findings

Independent review of the branch returned two items.

1. **Corrected and committed.** The middle pin originally claimed a regressed host serves the
   substituted HTML. It does not: `servePageBytes` replays the bytes captured at mint, so the
   regressed host returns 200 with the ORIGINAL bytes. Verified by direct probe
   (`status=200, body is ORIGINAL? true`). The real defect is that the stale launch survives —
   the nonce stays live and the approval keeps covering a View the bundle no longer registers.
   The pin now asserts 403 plus a second fetch proving the nonce stays dead on reuse.
2. **DEFERRED — do this after PR #173 merges.** `actions.test.ts` should use #173's new
   `mintActiveViewLaunch` helper instead of hand-reproducing admission and hashing. That restores
   the one-authority rule and deletes the explanatory comment the hand-rolled version required.
   This is the only remaining work on this task.

# Handoff

A local commit on an unpushed branch is not recoverable by another agent or another machine. If
this should survive this session, push `test/view-launch-version-trust` and open its PR; until
then the record above is a pointer to one laptop, not a handoff. Whoever picks it up: rebase onto
main after #173, apply finding 2, re-run the gates.

[depends on](mcp-durable-view-unchanged-proof.md)
