---
type: Decision
title: 'Release identity, supported-version, update, and rollback contract'
description: >-
  Defines the npm release source, complete build identity, supported-release
  discovery, explicit upgrade journey, integration compatibility, human
  approval, and rollback boundary.
actor: openai/codex
timestamp: '2026-07-31T21:13:41.613Z'
---
# Decision

AgentState will treat `@holaxis/aslite` on npm as the single executable authority. One complete build identity identifies the running bytes; one protected, staged release state machine maps a reviewed source/tag to an exact npm tarball and immutable receipt; and one read-only update contract tells users what policy currently selects and exactly how to reconcile without AgentState modifying itself.

`designs/version-update-protocols` is normative for schemas, state precedence, budgets, compatibility tables, build flavors, and staged-release states. This Decision supersedes only the working dist-tag and human-token publishing defaults in `decisions/npm-interim-package-name`; its package coordinate remains in force.

# 1. Version and track policy

- Canonical current public release is `0.1.0-pre.2`. It is a bootstrap release without the protected provenance workflow or complete identity defined here.
- Compatible fixes/additions before stable increment `0.1.0-pre.N`. An intentional breaking public/compatibility contract starts the next minor prerelease (for example `0.2.0-pre.1`) with migration guidance. After stable, ordinary SemVer applies.
- At rest before `0.1.0`, `latest == next == newest proven supported prerelease`. This temporary exception to npm convention lets unqualified global installs receive the supported test release.
- During a prerelease transaction, `latest` stays on the supported default while `next` may temporarily name the explicit preview candidate under proof. Passive discovery never advertises `next`. Equality is restored only after proof/promotion.
- At `0.1.0`, `latest` means stable and stale `next` is removed. Thereafter `next` exists only for a genuine preview.
- The exact version selected by a requested dist-tag is policy-authoritative even when lower than the running SemVer. A bad public release is never overwritten: restore tags to exact known-good, deprecate with an exact recovery command, and publish a new version. Routine defects never use unpublish.

# 2. Release source, protection, and staged state machine

- Releases are on demand. A reviewed release-preparation PR assigns SemVer in package source/lockfile plus compatible generated claims and candidate notes. The workflow never invents or commits a version or self-referential future commit SHA.
- Protected annotated tag `v<version>` selects one gate-clean `main` commit. Tag text, source/lockfile version, build-time-injected commit, generated assets/docs, packed identity, and checkout SHA must agree.
- Before the first live tag, Brian or Mike must record the protection preflight defined by the protocol: resolve the current direct-main marketplace-bot conflict, protect main and `v*`, bind the exact stage-only trusted publisher/environment, verify both maintainers' 2FA/recovery, and enable immutable releases. Code can merge before this external setup; staging cannot run.
- Source gates may build for testing. After they pass, a release-candidate command builds the production candidate once, packs once, records `.tgz`/SHA/integrity/source identity, and verifies that retained tarball without rebuilding/repacking. The exact retained path is passed to npm.
- Stage-only trusted publishing is selected. A tag-triggered run stages the exact tarball through OIDC and ends with immutable run/artifact/stage identifiers. Either Brian or Mike downloads/inspects it and approves or rejects the stage with npm 2FA. This is the one publication approval; GitHub environment restrictions add no second human gate.
- External npm approval never resumes or is polled by the original run. A separate explicitly dispatched finalizer accepts the immutable identifiers, downloads/verifies rather than rebuilds, performs registry smoke, records interactive tag operations, and publishes the already-prepared immutable GitHub release with separately scoped permissions.
- For prereleases, stage on `next`; after public registry proof and the required upgrade evidence, Brian or Mike moves `latest` to the exact candidate. Preapproval failure rejects the stage. Postapproval failure restores `next` immediately, keeps `latest` unchanged, deprecates the candidate, and records the failed draft/receipt. Stable failure restores all prior tag state immediately.
- npm OIDC authorizes publish/stage-publish, not stage approval/rejection, dist-tags, deprecation, or rollback. Those remain small interactive Brian-or-Mike operations; no long-lived write token is retained to hide them.

# 3. Complete identity and compatibility contracts

- A sole `BuildIdentityV1` owner supplies immutable package/version/source/build-flavor and per-integration contract facts. Runtime enrichment adds actual executable SHA/path and launch evidence/confidence. Missing evidence is `null`/`unknown`; no path heuristic fabricates certainty.
- Artifact channel (`npm-package`, `local-dev`, `marketplace-legacy`), runtime launch evidence (PATH/direct/probable npx), and mutable release track are different facts. Identical npm bytes cannot prove how npm selected them.
- `--version`/`-v` remain one-line SemVer. `version` and `version --json` expose the normative complete envelope. Home, skill, MCP, package verification, and release receipts project from the same owner; adjacent package metadata is drift evidence, never a second authority.
- Compatibility contracts are per integration (`skill`, `hook`, `mcp`) and increment only when persisted shape/semantics require reconciliation—not every release. Skill byte drift can be stale under the same contract; hook compatibility is semantic ownership/command shape; MCP v1 is stable PATH argv plus handshake version.
- The `0.1.x-pre.N` line is additive: existing skill state strings, top-level version, hook booleans, and command fields remain. New compatibility/evidence fields do not rename/retype them. A breaking projection requires the next minor prerelease.

# 4. Explicit supported-release discovery

- `aslite version --check` checks `latest`; `--tag next` explicitly checks preview. It makes one fixed official-registry request under the protocol's 2,000 ms/1 MiB/no-redirect/no-retry bounds and validates tag/version/deprecation/integrity metadata.
- Exact running and selected versions decide: `current`, `upgrade_available`, `rollback_available`, `deprecated`, or `unavailable`. A rollback-selected lower version prints the exact downgrade; numeric “ahead” is never treated as supported. A selected deprecated target is inconsistent/unavailable and is not recommended.
- Successful comparisons exit 0; unavailable/invalid local runtime exits 1; usage exits 2. Local identity is still returned for a structured remote `unavailable` result. Ordinary commands are unaffected.
- Reconciliation prints the exact observed version, e.g. `npm install --global @holaxis/aslite@0.1.0-pre.3`, followed by skill/hook status and stable MCP verification guidance. This deliberate deviation from generic `npm update -g` prevents tag movement between check and install and works for controlled rollback.
- The command mutates no installation/configuration/bundle and stores no release preference. `aslite update` stays reserved for a future command that actually updates.

# 5. Passive orientation and privacy

- Passive latest-track awareness exists only for bare/home/session-start default output. It displays a valid cached actionable result and may launch one detached refresh per 24 hours; rendering never waits. `home/session-start --json`, ordinary commands, MCP, CI, and tests neither display nor refresh.
- `--no-update-check`, presence of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` suppress both cached display and refresh. Explicit `version --check` is unaffected.
- The exact cache/lease paths, permissions, TTL/lease, private worker, network bounds, and optional `update_notice` shape are fixed by the protocol. Corrupt/unsafe/mismatched state is ignored and cannot fail or delay orientation.
- Requests send no installed version, cwd, bundle, actor, or usage data. npm necessarily sees the public package coordinate and ordinary network metadata; docs say so plainly.

# 6. Skill, hook, MCP, and npx behavior

- Skill status compares owned manifest, bytes, and skill contract. Legacy owned manifests remain recognized; same-SemVer/different-byte is stale. Reconciliation occurs only through explicit `skill install`.
- One tokenized hook classifier owns status, install rewrite/deduplication, and uninstall. It recognizes enumerated historically generated forms and exact current commands while rejecting foreign near-matches. Because this is a destructive ownership boundary, install and uninstall receive independent Review followed by adversarial byte-preservation QA.
- Supported MCP host configuration is exact PATH `aslite mcp`; MCP advertises the running CLI release. The CLI proves that contract and emits generic legacy cache-path guidance but does not scan or claim per-host config state and never rewrites it.
- npx is read-only trial/bootstrap, not a persistent integration authority. For an `npm-package` invocation, skill/hook installation refuses unless a managed PATH bin resolves to the running executable, preventing npx cache paths/assets from being persisted. Docs teach global npm before integration install. Temporary marketplace/local-dev behavior is classified separately until cutover.

# 7. Honest two-release proof

- `0.1.0-pre.2` cannot run future identity/check code. The first contract release therefore has an honest bootstrap proof: record legacy pre.2 SemVer, use a separately documented exact version-pinned npm command, then verify complete new identity/check, skill/hook reconciliation, stable MCP, both bins, and offline bundle work. Never claim pre.2 discovered it.
- A subsequent prerelease proves self-discovery: the first contract-bearing CLI checks public `next`, prints/executes the exact command, and verifies the resulting identity/integrations/offline operation. After `latest` promotion, a separate still-old installation proves the passive cached notice.
- Preapproval tests perform everything possible against the retained/downloaded stage bytes. Only registry-specific check/install/signature/provenance smoke waits until approval.
- At least one founder/unfamiliar-bundle journey remains required by the singular existing prerelease acceptance task; automated isolated evidence is separate. Q6 owns durable literal onboarding tests and is not a hard release-mechanics predecessor.

# 8. Marketplace retirement and recovery

- Live marketplace machinery remains until both release transitions, npm-primary docs, transferred safety gates, and independently recoverable frozen artifact pass.
- Before documentation claims “frozen recovery,” create and independently prove an immutable, non-latest `marketplace-recovery-<plugin-version>` GitHub release containing exact archive, SHA-256, source commit, and recovery instructions.
- It is emergency material, not an update stream. No automation advances it. Deletion remains in `tasks/retire-marketplace-channel` after docs and gate transfer.

# Proof obligations

1. Identity agreement/stale/byte/evidence tests and explicit build-flavor tests.
2. Additive skill/hook outputs plus exact historical/foreign classifier and install/uninstall no-collateral-mutation QA.
3. Update state/exit/rollback/deprecation/network/no-write tests and notifier TTL/lease/output/privacy tests pinned to protocol constants.
4. Retained-tarball verifier and literal workflow tests proving the staged path is the tested path and finalization never rebuilds.
5. Protection receipt, staged state receipts, rejection/rollback drills, registry integrity/signature/provenance, and immutable release evidence.
6. Separate pre.2 bootstrap and first-contract self-discovered public upgrade receipts.

[decides](../tasks/version-string-channel-identity.md)

[specified by](../designs/version-update-protocols.md)

[uses domain model](../designs/version-update-domain-model.md)

[amends](npm-interim-package-name.md)

[gates](../tasks/retire-marketplace-channel.md)
