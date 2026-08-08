---
type: Task
title: >-
  readPageBlob returns a dead 'version' field that launders an
  upstream-controlled header
status: done
priority: '3'
description: >-
  Closed as obsolete on 2026-08-07 after current-tree verification.
  readPageBlob.version is now consumed by registered View admission/currentness
  checks and entry_version catalog validation in
  packages/ui-server/src/server.ts. Deleting it would remove a live version-pin
  guard; no code change was made.
actor: openai/codex
timestamp: '2026-08-08T00:07:50.440Z'
---
# Problem

`readPageBlob` (`packages/ui-server/src/server.ts`) returns
`{ bytes, contentType, version }`. After PR #172 (`52e127e`) moved active-View launch identity onto
a host-computed hash, **no caller reads `.version`** — a grep across `packages/ui-server` finds the
field constructed and never consumed.

What remains is a dead field that launders untrusted input into a trustworthy-looking shape. In
remote mode it is:

    version: res.headers.get("x-version") ?? blobVersion(bytes)

The value is whatever the upstream put in a response header, falling back to a real content hash
only when the header is absent. In dir mode it is the backend's own version. So the field is
*conditionally* trustworthy — sometimes an upstream assertion, sometimes a computed hash — with
nothing at the call site distinguishing the two. That is worse than a plainly untrusted value,
because it reads as authoritative and is typed identically to the real thing (`version: string`).

# Why it matters

This is a trap, not a live defect. The hardening removed every consumer, so nothing is exploitable
on main today. The risk is the next change: someone adding a currentness or identity check has a
`blob.version` sitting in scope, correctly typed and conveniently named, and reaching for it
silently reintroduces exactly the trust PR #172 removed. `tasks/view-launch-version-trust-test`
adds pins that would now catch that regression at the two known call sites, but they cannot cover a
call site nobody has written yet.

# Scope

1. Drop `version` from `readPageBlob`'s return type and stop reading `x-version` there. With the
   field gone, any future consumer must call `blobVersion()` explicitly on bytes it has, which is
   the decision we want made deliberately rather than inherited from a struct.
2. If some caller does need a backend-asserted version later, reintroduce it under a name that says
   what it is (`assertedVersion`, `upstreamVersion`) so a call site cannot mistake it for identity.
3. Confirm by grep that no consumer exists before deleting, rather than assuming this record is
   still current — it was written against `b3006c9`.

# Provenance

Found while reading `52e127e` for `tasks/view-launch-version-trust-test`, 2026-07-26. Verified by
grep against the worktree at `b3006c9`; not verified by compilation, since removing the field was
out of scope for a test-only unit.

[depends on](view-launch-version-trust-test.md)
