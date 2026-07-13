---
type: Task
title: Publish @agentstate-lite/core as a versioned external package
status: todo
priority: '1'
description: >-
  Prerequisite for moving hosted server/Worker code into a private SaaS
  repository and a foundation for npm-first executable distribution.


  Behavioral claim: `@agentstate-lite/core` is a real, versioned, externally
  consumable package rather than a workspace source alias used only by the
  monorepo CLI build.


  Scope:

  - Define and review the supported public API surface for engine operations,
  StorageBackend, RemoteBackend/wire types where appropriate, version/CAS/actor
  contracts, and errors.

  - Produce a standalone npm tarball with compiled declarations/ESM, no
  workspace-only imports, and an explicit semver/versioning policy.

  - Install the tarball into a scratch external project with no monorepo
  node_modules and prove representative filesystem, memory, and backend-contract
  use.

  - Keep the CLI's self-contained esbuild output working; publishing core must
  not force runtime dependencies into the current CLI accidentally.

  - Add release/drift automation and document how a future private repository
  pins compatible core versions.


  Acceptance:

  - `npm pack` artifact installs and typechecks in an external scratch project.

  - Public exports are intentional and tested; internal helpers do not leak
  accidentally.

  - Core contract/parity tests pass through the packaged entry point where
  feasible.

  - Version and changelog/release ownership are explicit.

  - Builder -> independent reviewer -> QA before publication.
actor: codex
timestamp: '2026-07-13T02:14:50.463Z'
---
[depends on](package-core-external-proof.md)
