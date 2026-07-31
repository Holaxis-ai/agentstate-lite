---
type: Decision
title: 'Release identity, supported-version, update, and rollback contract'
description: >-
  Defines the npm release source, complete build identity, supported-release
  discovery, explicit upgrade journey, integration compatibility, human
  approval, and rollback boundary.
actor: openai/codex
timestamp: '2026-07-31T20:49:14.978Z'
---
# Decision

AgentState will treat `@holaxis/aslite` on npm as the single executable authority. One complete build identity will identify the running bytes; one release workflow will map a reviewed source commit to an npm version, Git tag, generated skill, release record, and supported dist-tags; and one read-only update contract will tell users what is current and exactly how to reconcile their installation without AgentState modifying it.

This decision supersedes only the working dist-tag and human-token publishing defaults in `decisions/npm-interim-package-name`. Its package-coordinate decision remains in force.

# 1. Version and supported-release policy

- The canonical current public release is `0.1.0-pre.2`. It is the bootstrap release; it predates the protected provenance workflow defined here.
- Compatible fixes and additions before stable increment `0.1.0-pre.N`. An intentional breaking contract starts the next minor prerelease line (for example `0.2.0-pre.1`) and carries migration guidance. After stable, ordinary SemVer patch/minor/major rules apply.
- Before `0.1.0`, both `latest` and `next` ultimately point to the newest supported prerelease. This is an explicit transitional exception to npm convention so an unqualified global install receives the supported test release.
- At `0.1.0`, `latest` means stable and stale `next` is removed. Thereafter `next` exists only when an actual preview is supported.
- A release is supported because policy selects it through a dist-tag, not merely because its SemVer is numerically newest.
- A bad release is never overwritten or reused. A Brian-or-Mike rollback moves supported tags to the prior known-good exact version, deprecates the bad version with actionable guidance, and publishes a fixed new version. Unpublish is reserved for exceptional security/legal mistakes that meet npm policy, not ordinary defects.

# 2. Release source, transaction, and authority

- Releases are on demand, never every merge. A reviewed release-preparation PR assigns the next SemVer in package source, lockfile, generated identity claims, and release notes. The workflow never invents or commits a version.
- The immutable source is the gate-clean `main` commit named by protected annotated tag `v<version>`. Tag text, package/lockfile version, embedded commit, checkout SHA, generated assets, and documentation claims must agree.
- A single tag-triggered GitHub Actions workflow checks out that commit, uses a supported GitHub-hosted Node/npm toolchain, runs the full repository and installed-package gates, packs once, and carries that exact tarball plus checksums through the remaining transaction. It uses minimal permissions, npm trusted publishing/OIDC, and automatic provenance.
- The selected approval model is npm stage-only trusted publishing. The workflow runs `npm stage publish` for the exact tarball and tag; either Brian or Mike inspects and approves that staged candidate with npm 2FA. This is the one required human publication approval and occurs after the bytes exist. A GitHub environment may bind the OIDC subject and release refs but does not add a second human gate.
- For the next prerelease, stage under `next`. After approval makes it public, run the old-to-new proof while `latest` still points to the prior supported release. On success, Brian or Mike interactively moves `latest` to the exact candidate and the finalizer verifies `latest == next`.
- At the first stable release, publish under `latest`, prove it, and remove stale `next` unless a genuine preview exists. Later previews publish under `next`; stable releases publish under `latest`.
- The interactive secondary-tag and rollback steps are deliberate. npm trusted-publisher OIDC authorizes publish/stage-publish, not dist-tag changes or deprecation. The project will not retain a long-lived automation token merely to hide those small, auditable human operations.
- After registry tag/integrity/signature/install verification, publish an immutable GitHub release containing the exact tarball, checksum, source/tag mapping, and receipt. Any pre-existing mismatched tag, staged candidate, package, or release state fails closed; matching partial state is verified and resumed.

# 3. Complete runtime identity

One `BuildIdentityV1` owner supplies every projection. Its immutable build facts are:

| Field | Meaning |
|---|---|
| `schema_version` | Version of the identity schema |
| `package_name` | `@holaxis/aslite` |
| `release_version` | Canonical SemVer baked from reviewed package source |
| `source_commit` / `source_dirty` | Source revision and build cleanliness, or explicit `unknown` |
| `artifact_channel` | `npm-package`, `marketplace-legacy`, `local-dev`, or `unknown` |
| `compatibility_contract` | Versioned skill/hook/MCP compatibility contract |

Runtime enrichment adds resolved executable path, invocation evidence, launch mode and confidence, and a lazily computed SHA-256 of the actual executable file. The runtime hash avoids a circular embedded self-hash and distinguishes different bytes that share SemVer. Missing evidence fails closed to `unknown`; path shape alone never fabricates certainty.

Artifact channel, launch mode, and release track are different concepts. Identical npm bytes cannot reliably know whether a global shim, `npx`, or a direct path launched them. `aslite version` reports available evidence and confidence rather than claiming an unknowable channel.

- `aslite --version` and `aslite -v` remain the conventional one-line SemVer projection.
- `aslite version` is the complete offline human surface; `aslite version --json` is its stable structured projection.
- Local development may additionally compare the adjacent manifest and report drift, but that manifest is never a second version authority.
- Home/session-start, skill status/manifests, package verification, and MCP startup consume this same identity. MCP advertises the running CLI release version rather than its current unrelated fallback.

# 4. Release track and update discovery

- A release track (`latest` or `next`) is a user/policy selection, not part of immutable artifact identity. npm bytes cannot reveal which mutable tag selected them.
- `aslite version --check` checks `latest` by default. `--tag next` explicitly opts into preview comparison; the initial contract does not silently persist that choice. Before stable the two tags ultimately coincide, so the default remains unambiguous.
- The explicit check performs one bounded request to the official npm packument, validates strict SemVer and selected metadata, and reports `current`, `update_available`, `ahead`, `deprecated`, `unsupported`, or `unavailable`. It never mutates npm, skills, hooks, MCP configuration, or bundles.
- Local identity always renders. A completed comparison—including update availability—is exit 0. Invalid local arguments/identity are usage/data errors; registry timeout, offline, or malformed remote metadata returns structured `unavailable` and a distinct nonzero check exit so scripts cannot mistake it for success. Ordinary commands remain unaffected and offline-functional.
- When an update or rollback is selected, output prints the exact immutable command observed by the check, for example `npm install --global @holaxis/aslite@0.1.0-pre.3`, followed by verification commands. This deliberately differs from generic `npm update -g`: it prevents a moving tag from changing between check and install.
- `aslite update` remains reserved for a possible future command that actually performs an update.

# 5. Orientation notice and privacy

- Passive discovery exists only on bare home/session-start. It renders a valid cached result immediately and, when refresh is due, launches at most one detached bounded refresh per 24 hours. No orientation render waits for the registry.
- Ordinary commands, JSON/MCP protocol stdout, tests, and CI receive no passive notice or network work. `ASLITE_NO_UPDATE_CHECK` and the familiar `NO_UPDATE_NOTIFIER` disable passive refresh/notice; a one-run flag suppresses it for that invocation. Suppression does not disable an explicit `version --check`.
- The advisory cache is schema-versioned, identity/tag-bound, atomically written in user-local AgentState state, concurrency-safe, and ignored on corruption, links, unsafe permissions, or mismatch. It stores only public package/tag/version/deprecation/integrity metadata and timestamps.
- The registry request sends no installed version, cwd, bundle identity, actor, or usage data. Documentation states that the public package coordinate and ordinary network metadata are necessarily visible to npm.

# 6. Skill, hook, and MCP compatibility

- The Agent Skill remains versioned package content. Its managed manifest/status consumes the running build identity and byte-compares installed assets. A same-SemVer/different-byte installation is stale/actionable; convergence occurs only when the user explicitly runs `aslite skill install`.
- SessionStart status classifies each host target as `absent`, `current`, `stale`, `unmanaged`, or `legacy-path-bound` using exact/tokenized semantic ownership. A command merely mentioning “agentstate-lite” is not owned. Status is read-only and prints an exact repair command; upgrades never rewrite hooks automatically.
- Supported MCP host configuration launches stable `aslite mcp` through `PATH`. The upgrade proof installs that configuration once and reuses it unchanged. Legacy version-keyed plugin cache paths receive explicit migration guidance; this task does not scan or rewrite arbitrary host configuration.

# 7. Supported install journeys and proof

- npm-global is the supported repeated-use installation. `npx -y @holaxis/aslite@<tag-or-version> …` is a zero-install trial/bootstrap path over the same npm artifact; launch evidence may identify it only when provable. Other package managers are not guaranteed initially.
- The clean release proof begins with exact published `0.1.0-pre.2`, records complete identity, installs skill/hook and stable MCP launch configuration, checks the new `next` candidate, runs the printed exact command, and verifies the new identity, skill/hook reconciliation, unchanged MCP launch, and offline bundle operation.
- One automated isolated proof plus one founder/unfamiliar-bundle acceptance journey is sufficient; it need not be duplicated by both founders. First-install usability evidence remains owned by `tasks/npm-cli-skill-prerelease` / `tasks/npm-quickstart-onboarding`; this task owns old-to-new upgrade evidence.

# 8. Marketplace retirement and frozen recovery

- The live marketplace executable remains until npm release automation, the old-to-new proof, npm-primary docs, transferred safety gates, and independent recovery proof pass.
- Freeze the exact last working marketplace source as a separate immutable, non-latest GitHub release named `marketplace-recovery-<plugin-version>`. Attach the installable plugin archive, SHA-256 checksum, source commit, and recovery instructions; independently retrieve and run it in isolation before deletion.
- That release is emergency material, not a maintained channel. No updater or automation advances it. Deletion remains owned by `tasks/retire-marketplace-channel`.

# Consequences and proof obligations

1. Per-surface agreement tests prove every identity projection derives from `BuildIdentityV1`; stale-dist, same-SemVer/different-byte, and missing-evidence fixtures fail honestly.
2. Compatibility tables prove exact hook ownership, skill byte/contract states, MCP version agreement, and no-write status behavior.
3. Update tests cover tag selection, SemVer/deprecation, timeout/offline/malformed registry data, hostile/corrupt cache, concurrency, opt-out/CI, background-child failure, and ordinary/protocol output isolation.
4. Release tests execute emitted command chains literally, force every version/tag/commit/tarball/asset disagreement red, and prove resumable state reconciliation without rebuilding.
5. The exact packed candidate and then the public staged candidate pass isolated old-to-new, rollback-readiness, integrity/signature, both-bin, skill/hook, MCP, and offline proofs.
6. Publishing, tag movement, deprecation, immutable-release publication, and live marketplace deletion remain explicit human/external operations, never incidental effects of a feature PR.

[decides](../tasks/version-string-channel-identity.md)

[uses domain model](../designs/version-update-domain-model.md)

[amends](npm-interim-package-name.md)

[gates](../tasks/retire-marketplace-channel.md)
