---
type: Context Note
title: packages/cli architecture review target freeze
description: >-
  Exact source, artifact, toolchain, scope, and applicability freeze for the
  approved-template review.
actor: codex-orchestrator
timestamp: '2026-08-07T14:20:55.678Z'
---
# Summary

The targeted review is frozen to the clean current workspace revision `81b3c39ff252013e318b1a714b63430a24074d70` on branch `feat/init-create-only`, tracking its matching origin branch. Base `origin/main` is `458f44ae8b3ed0021997fb537eca356fb47dea1a`. The branch differs from main within packages/cli by 960 insertions and 18 deletions across SKILL.md, bundle target safety, init, reference text, and a 610-line test file. This branch—not a blended moving target—is the review basis.

Root build `npm run build` exited 0. The exact local-dev artifact is `packages/cli/dist/agentstate-lite.mjs`, 4,559,755 bytes, executable mode 755, SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583`. Its self-reported identity binds package `@holaxis/aslite@0.1.0-pre.3`, clean source commit `81b3c39...`, local-dev channel, direct launch, and compatibility contracts skill/hook/mcp v1 without adjacent-version drift.

Toolchain/environment: Node v25.2.1, npm 11.6.2, git 2.39.5, Darwin 25.6.0 arm64. package-lock git object `08c232fed820f2ae113467673ad5228911b999dc`; packages/cli/package.json `c1436ad11de01bd49dc42d74231f87d79ea4478d`; packages/cli/build.mjs `469b7f22109a90cc53c63a3ccc4c7183b88d1c6d`. The tracked code tree remained clean after build.

Scope includes packages/cli source, tests, build/scripts, package metadata, generated/public reference agreements, references, and the exact built/tarball boundary. Consumed workspace packages are out of implementation scope except where CLI adapter contracts, imports, bundling, security boundaries, or agreement behavior depend on them. No hosted deployment or third-party production target is in scope.

Applicable profiles: CLI/process adapter, stateful/persistent, concurrent/distributed adapter, security-sensitive local host/integration, published package/plugin, and local UI/server host. Pure-library-only profile is N/A. All core modules remain required. Security source/sink coverage, requirement-risk-test mapping, state/workflow failure timelines, distribution proof, and negative-claim audit are required.

The approved template is `reviews/architecture-review-template` v1.0 at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`; approval is recorded at `reviews/architecture-review-template-approval`. If source or generated target bytes drift, affected evidence must be rerun or labeled historical.
