---
type: Roadmap Item
title: 'Local-first CLI surface: park the HTTP remote/hosted stack'
status: active
description: >-
  DECIDED 2026-07-12 — the OSS product becomes local-first + git-shared, while
  the hosted control plane is extracted toward a private SaaS repository.
  Extract means relocate behind a clean boundary, not delete.


  Terminology is load-bearing:

  - A git remote belongs to `sync` and remains central to the OSS collaboration
  story.

  - The HTTP wire client (`RemoteBackend` and an explicit `--remote <url>`)
  remains OSS as the intentional on-ramp to the future hosted service.

  - The hosted control plane means server deployment, Cloudflare Worker/D1/R2,
  identity/admin, and future tenancy/billing/collaboration UI; that moves
  private.


  The default experience remains local:

  - Bare commands discover a local bundle or explicit `--dir`.

  - The local Page UI and git `sync` are first-class.

  - Ambient HTTP activation is reduced: `AGENTSTATE_LITE_REMOTE` and committed
  URL bindings should not silently flip an ordinary local session into hosted
  mode.

  - Explicit `--remote` remains functional and documented as an advanced hosted
  connection path rather than repeated as the product's default story.


  Keep OSS:

  - Engine + `StorageBackend`, FilesystemBackend, MemoryBackend.

  - `RemoteBackend`, explicit `--remote`, and a coherent versioned wire
  protocol/spec.

  - CLI, local Pages, local artifact verbs, and the entire git-sharing tier.

  - Whatever generic wire/router primitive local UI demonstrably needs; do not
  duplicate it merely to move a package.


  Move toward the private SaaS repository:

  - Deployable server/Worker/D1R2 and hosted identity/auth/control-plane code.

  - Net-new multi-tenancy, organizations, billing, per-bundle authorization, and
  hosted administration/collaboration UI.

  - Hosted identity commands may remain as a thin OSS/cloud client or move to a
  SaaS plugin; that business/interface choice must be explicit before deletion.


  Prerequisites and boundary work:

  - Publish `@agentstate-lite/core` as a real versioned package consumable from
  another repository.

  - Resolve the current local UI dependency on `packages/server`: either
  preserve a generic OSS reference/router package or extract one shared
  protocol/router primitive before moving deployable server code. No parallel
  router.

  - Keep dependencies one-directional: core imports nothing from hosted
  packages.

  - Keep wire and backend parity tests as the executable OSS/private contract.


  Distribution direction is recorded in `designs/npm-bundle-bootstrap`: npm
  becomes the executable authority; bundle content carries durable meaning; a
  thin plugin supplies bootstrap/hooks. This is a parallel simplification and
  supports the private-repo boundary.


  Delivery sequence:

  1. Retire hosted identity/admin commands from the default everyday surface
  without deleting their implementation or prematurely deciding thin OSS client
  versus SaaS plugin.

  2. Make local the unquestioned default while preserving explicit `--remote` as
  the OSS SaaS on-ramp.

  3. Publish `@agentstate-lite/core` and resolve the local UI/server package
  boundary.

  4. Extract hosted deployment/control-plane units toward the private
  repository, leaving the OSS wire client/spec and proven boundary intact.
actor: codex
timestamp: '2026-07-13T02:34:32.169Z'
---
[contains](../tasks/deprecate-static-viewer.md)

[decision record](../tasks/positioning.md)

[contains](../tasks/retire-hosted-control-plane-cli.md)

[contains](../tasks/default-cli-local-only.md)

[contains](../tasks/park-http-remote-stack.md)

[contains](../tasks/publish-core-package.md)

[contains](../tasks/resolve-local-ui-server-boundary.md)

[contains](../tasks/publish-server-package.md)

[contains](../tasks/ui-declare-server-dev-dependency.md)

[contains](../tasks/package-core-external-proof.md)

[contains](../tasks/risk-tiered-review-gates.md)
