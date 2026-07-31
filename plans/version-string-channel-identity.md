---
type: Plan
title: 'Ship the version, update, release, and channel-identity contract'
description: >-
  Decomposes the version/update umbrella into independently reviewed identity,
  compatibility, discovery, notice, publishing, proof, documentation, recovery,
  and retirement units.
actor: openai/codex
timestamp: '2026-07-31T20:49:15.190Z'
---
# Goal

Deliver `tasks/version-string-channel-identity` as coherent, independently reviewed units that make running bytes truthfully identifiable, supported-release discovery safe, integration compatibility actionable, and npm publishing/rollback reproducible. This serves the ultimate product goal by turning npm distribution into a durable support contract rather than a one-time upload.

# Acceptance strategy

The umbrella task stays `in_progress`; child tasks own one behavioral claim and one branch/PR or operational receipt. A unit may merge only after independent Review of its exact SHA. QA, where required by risk, is a later dependency and may reject the reviewed result. Brian opens and owns every PR/merge; live publication/tag/deprecation/recovery actions require the explicit human rows in the Decision.

# Dependency DAG

`D0 → I1 → {C2, U3, P5}`; `U3 → N4`; `{I1, C2} → Q6`; `{C2, U3, N4, P5, Q6} → E7 → D8`; `{E7, D8} → F9`; `E7 → G10`; `{D8, F9, G10} → X11`.

- C2, U3, and P5 design/test fixtures may proceed in parallel once I1's reviewed API is fixed. Their implementation branches start from current `origin/main` after I1 merges.
- Q6 remains owned by `tasks/npm-quickstart-onboarding`; it contributes first-use evidence but is not absorbed by this task.
- X11 remains owned by `tasks/retire-marketplace-channel`; deletion cannot begin until its predecessors pass.
- Review always waits for a complete exact SHA. QA always waits for Review approval. There is no Build → QA edge.

# D0 — release Decision and implementation Plan (bundle, no code PR)

**Claim:** policy, state tables, non-goals, ownership, and proof obligations are explicit enough that implementation does not invent product behavior.

Roles and gate: Product/architecture/release research → primary author → independent Plan Reviewer → author revision → reviewer approval. Brian-or-Mike choices are recorded before approval.

Acceptance:
- Decision records SemVer/dist-tags, release transaction/approval/rollback, identity schema, artifact-vs-launch-vs-track distinction, check/notice behavior, exact upgrade journey, compatibility boundaries, proof sufficiency, and recovery shape.
- Plan names unit owners, dependencies, risk tiers, tests, Review-before-QA gates, and branch/PR discipline.
- Umbrella/roadmap ownership is reconciled and child tasks are created only after review approval.

# I1 — one immutable runtime/build identity authority (PR)

**Claim:** every local identity projection derives from one offline owner, and different executable bytes cannot present the same complete identity.

Builder:
- Add `BuildIdentityV1` with injected package/version/source/artifact/contract facts and fail-closed parsing.
- Enrich with real executable path, invocation evidence/confidence, and lazy actual-file SHA-256.
- Add `aslite version` / `--json`; retain exact one-line `--version`/`-v`.
- Route home diagnostics, skill running-version projection, package verification, and MCP server version through the owner.
- Add agreement tables and stale-dist, byte-mutation, missing-realpath, npm/npx/local/plugin evidence fixtures.

Dependencies: D0 approved. Risk: medium build/package contract.

Gate: Identity Builder → independent exact-SHA Reviewer → repository `npm run check` and package-verification gate → merge. QA is required only if Review finds a reachable unowned projection or ambiguous evidence represented as fact.

# C2 — read-only integration compatibility diagnostics (PR)

**Claim:** skill, hook, and bounded MCP launch compatibility is truthful/actionable without rewriting host configuration.

Builder:
- Make skill status/manifests consume identity and compare bytes/compatibility contract, including same-SemVer/different-byte states.
- Replace hook substring ownership with exact/tokenized classification: `absent`, `current`, `stale`, `unmanaged`, `legacy-path-bound`.
- Prove stable PATH `aslite mcp`, pass exact CLI version to MCP initialize, and emit legacy cache-path guidance at the bounded diagnostic/docs surface.
- Preserve existing output fields where compatible; add table/no-write tests over project/global, foreign-marker, malformed, partial, symlinked, and relocated-home states.

Dependencies: I1 merged. Risk: medium-high configuration/destructive-boundary adjacency.

Gate: Compatibility Builder → independent exact-SHA Reviewer → adversarial no-mutation/configuration QA → repository gate → merge.

# U3 — explicit supported-release check (PR)

**Claim:** `aslite version --check [--tag latest|next]` accurately compares the running identity with public npm policy and prints an immutable reconciliation journey without mutation.

Builder:
- Add injected bounded registry client for the official abbreviated packument; validate response size/schema/SemVer/deprecation/integrity.
- Implement default `latest`, explicit `next`, and result states/exit contract from the Decision.
- Print running identity, selected tag/version, exact version-pinned global install command, and verification commands; preserve structured JSON and stdout purity.
- Add fake-registry/black-hole tests for current/update/ahead/deprecated/unsupported/unavailable, tag movement, malformed/hostile data, timeout, offline, and zero filesystem/config mutation.

Dependencies: I1 merged. Risk: high external release-selection boundary.

Gate: Update Builder → independent exact-SHA Reviewer → adversarial registry/output/no-write QA → repository gate → merge.

# N4 — cached daily orientation notice (PR)

**Claim:** bare home/session-start may surface known supported-release information without registry latency, ordinary-command effects, privacy leakage, or cache fragility.

Builder:
- Add versioned tag/identity-bound advisory cache under user-local AgentState state using existing atomic/safe-file primitives.
- Render valid cached result immediately; when due, spawn at most one detached, bounded, no-retry refresh per 24 hours.
- Implement CI/test/environment/one-run suppression and strict orientation-only rendering.
- Add fake-time/process/cache tests for absent/stale/corrupt/link/unsafe/concurrent/interrupted states, hung network, child failure, privacy payload, render budget, and byte parity for ordinary/JSON/MCP output.

Dependencies: U3 merged. Risk: high timing/cache/process boundary.

Gate: Orientation Builder → independent exact-SHA Reviewer → adversarial offline/concurrency/output QA → repository gate → merge.

# P5 — protected single-source npm release automation (PR; deployment remains human-gated)

**Claim:** one protected transaction stages exactly one reviewed source/tarball with provenance, rejects disagreement, and emits auditable finalization/rollback operations.

Builder:
- Add a pure release-state verifier/reconciler and thin `v*`-tag workflow adapter; version remains assigned by release PR.
- Assert tag/package/lock/commit/generated-asset/docs agreement, run full and installed-tarball gates, `npm pack` once, checksum and retain the exact artifact.
- Configure stage-only npm trusted publishing/OIDC with minimal permissions and supported Node/npm; stage explicit policy tag.
- Emit literal interactive commands/verification for secondary-tag promotion, stable `next` removal, rollback, deprecation, signature/integrity/install proof, and immutable GitHub release finalization.
- Add dry-run/scratch-state tests for fresh, partial/resumed, matching existing, every mismatch, stage/tag failure boundary, prerelease/stable transitions, and no-rebuild provenance.

Dependencies: I1 merged; it may develop parallel to C2/U3. Risk: high deployment/supply-chain boundary.

Gate: Release Builder → independent exact-SHA release/security Reviewer → adversarial dry-run QA → full repository/package gate → Brian reviews setup and opens/merges PR. Later tag creation, npm stage approval by Brian or Mike, and interactive finalization remain separate explicit operations.

# Q6 — tested npm-global first-install journey (separate onboarding PR/task)

**Claim:** an unfamiliar user can install globally, opt into integrations, initialize useful work, and understand `npx` only as trial/bootstrap.

Owner/dependency: `tasks/npm-quickstart-onboarding`; depends on I1+C2. Onboarding Builder → independent command-provenance Reviewer → literal packed-package gate; QA only if the automated journey cannot represent the host acceptance.

# E7 — publish the next prerelease and prove `pre.2` → candidate (operational receipt)

**Claim:** a real isolated installation upgrades from published `0.1.0-pre.2` to the next protected candidate without path expiry or integration ambiguity.

Operator work:
- Merge a reviewed release-preparation PR; create protected annotated `v<version>`; let P5 stage exact bytes under `next`.
- Brian or Mike inspects/approves with npm 2FA.
- In fresh HOME/npm prefix/shell, install exact pre.2, record identity, install skill/hook, configure stable `aslite mcp`, run explicit next check, execute its exact printed command, and record resulting identity/fingerprint.
- Prove explicit skill/hook convergence, unchanged MCP PATH configuration/handshake, both bins, offline bundle workflow, npx trial evidence, registry integrity/signatures, rollback readiness, and one founder/unfamiliar-bundle acceptance.
- On success, Brian or Mike moves `latest` to the exact candidate; finalizer verifies tag equality and publishes the immutable GitHub release/receipt.

Dependencies: C2+U3+N4+P5+Q6 complete. Risk: live release.

Gate: release-prep Builder → independent exact-SHA Reviewer → adversarial QA of exact packed artifact → repository gate → Brian merges → stage → Brian-or-Mike npm approval → release QA + one founder acceptance → interactive latest promotion/final verification. Failure stops promotion and invokes rollback/deprecation as applicable.

# D8 — npm-primary documentation cutover (PR)

**Claim:** every current surface teaches one supported npm-global install/upgrade path, npx trial, explicit checks, integration reconciliation, and frozen recovery only.

Dependencies: E7 proof. Docs Builder → independent literal-command/provenance Reviewer → generated-doc/drift/command gates → merge. QA only if Review finds a journey the literal battery cannot execute.

# F9 — freeze and prove final marketplace recovery (operational receipt)

**Claim:** the final live marketplace state is immutable, downloadable, checksummed, and usable without preserving a live update channel.

Dependencies: E7+D8. Release operator creates draft `marketplace-recovery-<plugin-version>` with exact source/archive/checksum/instructions → independent Reviewer retrieves from GitHub, not worktree → recovery QA installs/runs in isolation → Brian-or-Mike confirms boundary → publish immutable non-latest release.

# G10 — transfer surviving distribution invariants to npm gates (test-only PR)

**Claim:** deleting plugin checks cannot delete an unnamed safety property.

Dependencies: E7. Test Builder inventories every plugin build/drift/version/resolver invariant and maps it to an npm identity/verifier/release gate or explicit obsolescence → independent provenance Reviewer forces a representative gate red → repository gate → merge. QA only if parity cannot cover a reachable state.

# X11 — delete live marketplace channel (separate retirement task/PR)

**Claim:** the repo no longer builds, publishes, resolves, or documents a duplicate executable; npm remains green and frozen recovery remains retrievable.

Owner/dependencies: `tasks/retire-marketplace-channel`; requires D8+F9+G10. Deletion Builder → independent exact-SHA inventory Reviewer → adversarial clean-checkout and frozen-recovery QA → repository/package gates → merge.

# Requirements matrix

| Contract requirement | Owner/evidence |
|---|---|
| SemVer/dist-tags/approval/rollback | D0 Decision; P5 policy tests; E7 receipt |
| One byte-distinguishing identity | I1 agreement + stale/byte red probes |
| Artifact vs launch vs track honesty | D0/I1 tables and unknown-evidence fixtures |
| Read-only exact update journey | U3 fake-registry/no-write proofs; E7 live receipt |
| Daily bounded orientation notice | N4 fake-time/black-hole/concurrency/output proofs |
| Skill/hook/MCP compatibility | C2 state/no-write tables; E7 real upgrade |
| npm-global authority; npx trial | Q6 literal journey; E7 evidence |
| One protected source/provenance | P5 mismatch/red probes and retained exact artifact |
| Old-to-new public proof | E7 receipt plus one founder acceptance |
| npm-primary current docs | D8 literal command/drift gates |
| Frozen rollback before deletion | F9 independent retrieval/recovery proof |
| No lost marketplace safety property | G10 provenance inventory/red probe |
| Zero live marketplace machinery | X11 search, clean-checkout, npm and recovery QA |
| Every QA/deploy follows Review | Explicit unit gates above; no Build → QA edge |

# Records and branch discipline

- After D0 approval, create/link child Task docs with the IDs above and reconcile `roadmap`, `tasks/npm-cli-skill-prerelease`, `tasks/npm-quickstart-onboarding`, and the retirement blocker without reopening completed tasks.
- Each code unit begins from current `origin/main` on a descriptive feature branch and ends with one reviewed commit/SHA, synced task outcome, and paste-ready PR title/body. Brian opens and owns the merge gate. A dependent unit does not claim merged behavior early.
- Bundle Decision/Plan/task/roadmap writes use `aslite sync`, never code commits. Code commits contain no AI attribution and do not hand-build bot-owned marketplace outputs.

[implements](../tasks/version-string-channel-identity.md)

[applies](../decisions/version-update-contract.md)

[uses domain model](../designs/version-update-domain-model.md)
