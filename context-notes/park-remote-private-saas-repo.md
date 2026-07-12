---
type: Context Note
title: 'SUPERSEDED boundary detail: private SaaS direction (server stays OSS)'
description: >-
  Historical founder direction remains valid for the two-repository SaaS split,
  but its statement that packages/server moves private is superseded by
  decisions/oss-wire-server-boundary. Keep RemoteBackend, explicit --remote,
  wire spec, and packages/server OSS; move packages/worker plus hosted
  auth/deployment private.
actor: codex
timestamp: '2026-07-12T22:57:48.800Z'
---
# Summary

**Decided (2026-07-12, Mike): the peel is GO, and the destination is a PRIVATE REPO, not deletion.**
We are stripping the HTTP remote / hosted / identity stack out of the OSS CLI's default surface
(codex's [radical-simplification](../roadmap-items/radical-simplification.md) arc), and the
extracted parts **relocate to a private repo** that becomes the future SaaS foundation. Peel =
extract, not destroy: the remote bits don't die, they move. This is the SaaS-wrap.

## The decision

- The OSS product becomes **local-first + git-shared, single-tier** — the shipped CLI is
  **local-only by default**; the HTTP remote / deployment / hosted-identity machinery leaves the
  default surface.
- The extracted remote parts are **parked so they can be moved to a PRIVATE repo** (the SaaS
  foundation) — NOT deleted. The hosted tier survives as a product path, in a private repo, on its
  own timeline.
- This turns the old two-tier-in-one-repo framing into **two repos**: OSS (local + git) and
  private/SaaS (hosted), with the `StorageBackend` seam + the wire protocol as the boundary.

## What stays OSS vs moves to the private repo

**Stays OSS (`packages/core` + the CLI):**
- The engine + the `StorageBackend` seam (`core/src/types.ts`) + `FilesystemBackend` +
  `MemoryBackend`.
- The CLI, local-first, and **`sync` (the git tier — KEPT; it is the sharing story, never peeled).**
- **The wire CLIENT (`RemoteBackend` + `--remote`) STAYS OSS as the on-ramp** — any OSS user can
  point `--remote` at the hosted service. Load-bearing for SaaS adoptability: do NOT delete or bury
  it, even as the default flips to local-only.

**Moves to the private repo (the SaaS foundation):**
- `packages/server` (the wire server), `packages/worker` (`D1R2Backend` + Cloudflare deploy).
- The identity/auth layer (`IdentityVerifier` + users / invites / members / keys).
- The **new SaaS layer that does not exist yet**: multi-tenancy, orgs, billing, admin /
  collaboration UI, per-bundle authz. (Moving the worker gives a hosted backend; it does NOT give
  tenancy/billing — that is net-new build in the private repo.)
- Depends on a published `@agentstate-lite/core`.

## Parking discipline (for the build happening now)

Codex's tasks park the HTTP stack "behind a non-default boundary" and make the default CLI
local-only. Given the private-repo destination, park so the eventual **extraction stays clean**:

- Keep the dependency **one-directional** — core imports nothing from `server`/`worker` (verified
  true today; only doc-comment mentions). Do not introduce a back-edge.
- Keep `RemoteBackend` (the client) + `--remote` **alive in OSS** (the on-ramp), even as the default
  is local-only.
- Keep the **wire protocol a coherent, versioned contract** — it is the OSS↔SaaS boundary. Bring
  `docs/WIRE-PROTOCOL.md` back as a first-class public spec if OSS clients depend on it (it moved to
  the board branch in the public scrub).
- Park `server`/`worker` as **move-able units** (self-contained, core-as-dependency), not
  intertwined with CLI internals — so the later `mv` into the private repo + repoint imports to
  `@agentstate-lite/core` is mechanical.

## Prerequisite

Publish `@agentstate-lite/core` as a real **consumable, versioned package**. Today it is only
inlined into the CLI by esbuild (`build-bundle.mjs` aliases `@agentstate-lite/core` → `../core/src`),
so the private repo cannot `npm install` + pin it yet. This partially wakes the parked npm channel.

## Still open (business calls, not blocking the parking)

- **Open-core license** (permissive OSS core vs proprietary SaaS repo) and whether the **wire
  protocol is an open spec** (grows ecosystem, commoditizes the server) **or a moat** (closed).
- Identity commands (`login`/`join`/…): keep thin in OSS as wire-auth calls, vs a SaaS CLI plugin.
- **Update CORE.md + North-Star** — they still say the hosted substrate is FROZEN; this decision
  makes it single-tier OSS + a private SaaS repo.

## Relationships

- Realizes [radical-simplification](../roadmap-items/radical-simplification.md) (codex's active arc)
  — this note is the **destination** for its parking tasks.
- Related: [park-http-remote-stack](../tasks/park-http-remote-stack.md),
  [default-cli-local-only](../tasks/default-cli-local-only.md),
  [retire-hosted-control-plane-cli](../tasks/retire-hosted-control-plane-cli.md).
- Decision record: [positioning](../tasks/positioning.md).

[superseded by](../decisions/oss-wire-server-boundary.md)
