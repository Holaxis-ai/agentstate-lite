---
type: Plan
title: 'Ship the version, update, release, and channel-identity contract'
description: >-
  Decomposes the version/update umbrella into independently reviewed identity,
  compatibility, discovery, notice, publishing, proof, documentation, recovery,
  and retirement units.
actor: openai/codex
timestamp: '2026-07-31T21:21:33.478Z'
---
# Goal

Deliver `tasks/version-string-channel-identity` as coherent, independently reviewed units that make running bytes truthfully identifiable, supported-release discovery safe, integration compatibility actionable, and staged npm publishing/rollback reproducible. This serves the ultimate goal by turning npm distribution into a durable support contract rather than a one-time upload.

# Acceptance and gate discipline

The umbrella stays `in_progress`; child tasks own one behavioral claim and one branch/PR or operational receipt. Every code unit follows Builder → independent exact-SHA Review → QA when its risk calls for QA → repository/package gate → Brian-owned PR/merge. QA may reject reviewed work and never precedes Review. Live registry, protection, tag, release, deprecation, and recovery actions use explicit Brian/Mike rows in the Decision/protocol.

`designs/version-update-protocols` is normative. A builder may not choose a different public schema, state precedence, timeout/cache constant, compatibility mapping, or staged-release continuation without returning to D0 review.

# Dependency DAG

```text
D0 → I1 → {C2H, C2S, U3, P5A, P5B}
U3 → N4
{P5A, P5B} → P5S
{C2H, C2S, U3, N4, P5A} → R6A
{R6A, P5S} → E7A → R6B → E7B
E7B → {F9, G10}; F9 → D8
{D8, F9, G10} → X11
{I1, C2S} → Q6 (parallel evidence path; not a release-mechanics predecessor)
```

C2H/C2S/U3/P5A/P5B test-fixture design may overlap after I1's reviewed API. Implementation branches start from current `origin/main` after required predecessors merge. Review always waits for the complete exact SHA.

# D0 — Decision, protocol design, and Plan (bundle; no code PR)

**Claim:** policy and public/state tables are explicit enough that implementation does not invent behavior.

Roles/gate: product + identity/release research → primary author → independent policy/security and implementation/test Reviewers → revision → focused re-review approval.

Acceptance: task's eight questions; normative identity/check/cache/compatibility/release tables; exact human/external prerequisites; two-release acceptance; unit ownership/dependencies/risk/gates; reconciled umbrella/roadmap/related-task records. Child tasks are created after approval.

# I1 — immutable build/runtime identity authority (PR)

**Claim:** every local identity projection derives from one offline owner and different executable bytes cannot present the same complete identity.

Builder:
- Implement normative `BuildIdentityV1` and exact `version`/`--json`; keep one-line `--version`/`-v`.
- Require explicit flavor/source inputs at every bundler call: ordinary dev=`local-dev`, release candidate=`npm-package`, plugin bot/drift=`marketplace-legacy`; missing flavor fails closed.
- Add resolved executable path, invocation evidence/confidence, lazy actual-file SHA-256, adjacent-manifest drift, and unknown/null behavior.
- Route home identity, skill running-version projection, MCP server version, and package verification through the owner without yet changing compatibility classification.
- Pin exact envelope, additive schema, all projections, two bin aliases, stale local dist, same-SemVer/different-byte, missing path/git, npx/global ambiguity, plugin/source flavors, and MCP agreement.

Risk: medium build/package/API contract. Gate: Identity Builder → independent exact-SHA Reviewer → focused agreement/package tests → full repository gate → merge. QA becomes mandatory if Review finds an unowned projection or evidence upgraded from unknown.

# C2H — hook ownership, compatibility, and mutation safety (PR)

**Claim:** one pure tokenized classifier truthfully recognizes every generated historical/current hook form and never lets install/uninstall mutate a foreign near-match.

Builder:
- Replace substring ownership across status, home prompts, install rewrite/dedupe, uninstall, and OpenCode handling with the protocol table.
- Preserve existing booleans/command; add per-host compatibility/evidence/remedy.
- Preserve exact recognized legacy forms, including path-bound classifications, while rejecting mere mentions and hand-authored npx forms.
- Enforce injected, fail-closed `durable_global` npm-prefix evidence for persistent installs from `npm-package` (PATH equality alone is insufficient); retain explicitly classified temporary legacy/local behavior. Include a literal real `npm exec`/npx-cache fixture that would pass the old PATH-only test and must now refuse without writes.
- Build a fixture matrix for all hosts/scopes, quoted/absolute/bare/old-subcommand/old-timeout/old-coordinate/generated-marker forms, and foreign near-misses.

Risk: high destructive configuration ownership boundary. Gate: Hook Builder → independent exact-SHA Reviewer → adversarial QA running both install and uninstall with byte snapshots, malformed/partial/symlink/concurrency/interruption probes → repository gate → merge.

# C2S — skill compatibility and bounded MCP contract proof (PR)

**Claim:** skill status is additively actionable, and MCP's stable PATH/handshake contract is proven without claiming arbitrary host-config inspection.

Builder:
- Add the protocol's exact skill manifest v2 fields/digests while retaining legacy owned manifests and existing state strings/top-level version; provenance fields remain informational when asset bytes and contract are compatible.
- Implement protocol skill compatibility table, same-SemVer byte drift, newer-contract behavior, explicit remedies, and no overwrite/uninstall of unmanaged targets.
- Require injected, fail-closed `durable_global` npm-prefix evidence for persistent npm-package skill installation.
- Prove `aslite mcp` PATH startup and exact MCP server release version; add generic cache-path migration guidance only to bounded help/generated-skill/release-receipt surfaces.

Risk: medium-high persisted-asset contract. Gate: Skill/MCP Builder → independent exact-SHA Reviewer → adversarial owned/unmanaged/legacy/partial/no-write QA → repository + package/MCP gates → merge.

# U3 — explicit release-track comparison (PR)

**Claim:** `version --check [--tag latest|next]` applies exact dist-tag policy, including rollback, and prints one immutable reconciliation journey without mutation.

Builder:
- Implement the fixed endpoint/Accept/2s/1MiB/no-redirect/no-retry client with injected network/time.
- Implement the normative envelope, precedence, exact-version command, deprecation behavior, and exits 0/1/2.
- Preserve identity output on structured unavailable; never claim current without comparison.
- Test current, forward, rollback, running/selected deprecation, missing/malformed tags/versions/integrity, hostile/oversized/redirect/timeout/offline, tag movement, stdout/JSON, and zero filesystem/config/bundle mutation.

Risk: high external release-selection boundary. Gate: Update Builder → independent exact-SHA Reviewer → adversarial fake-registry/output/no-write QA → repository gate → merge.

# N4 — cached orientation notice (PR)

**Claim:** default home/session-start can surface cached supported-release guidance without registry latency, protocol-output change, privacy leakage, or cache/process fragility.

Builder:
- Implement exact cache/lease paths, schemas, 24h TTL, 30s lease, atomic safe-file checks, private detached worker, and successful-latest-only writes.
- Implement `--no-update-check` plus environment/CI suppression; default TOON-only optional notice; JSON/ordinary/MCP byte parity.
- Add fake-time/process/cache tests for absent/expired/version-mismatch/corrupt/symlink/permission/lease/concurrent/interrupted/hung/child-failure states, privacy payload, and existing session-start budget.

Risk: high timing/cache/process boundary. Gate: Orientation Builder → independent exact-SHA Reviewer → adversarial offline/concurrency/output QA → repository gate → merge.

# P5A — retained-artifact staged-release automation (PR)

**Claim:** code can create, verify, stage, and later finalize one exact candidate without rebuilding, overbroad permissions, or ambiguous partial state.

Builder:
- Refactor package verifier into ordinary scratch-candidate mode and `--tarball` no-build/no-pack mode; refactor `prepublishOnly` so it cannot create a second candidate.
- Add one release-candidate command that cleans/builds `npm-package` with injected tag SHA, packs once, emits manifest/checksums, and feeds exact-tarball tests.
- Add pure state reconciler plus tag-triggered candidate, separately permissioned draft-preparation, stage, and separately dispatched finalizer jobs with job-scoped permissions and immutable run/draft/asset/artifact/stage identifiers.
- Stage the literal retained path with explicit tag, end the run with immutable identifiers, and emit interactive `stage download` checksum-comparison instructions required before approval; prepare but do not publish the GitHub draft.
- Emit exact stage reject/approve, secondary tag, stable-next removal, rollback/deprecation, registry signature/integrity/install, and immutable-release operations.
- Dry-run tests cover every state/mismatch/rerun/failure, prerelease/stable transitions, artifact retention, and prove no build/pack after candidate creation.

Risk: high deployment/supply-chain code. Gate: Release Builder → independent exact-SHA release/security Reviewer → adversarial dry-run QA → full repository/package gate → Brian-owned PR/merge. Merging does not claim external setup or a live release.

# P5B — make repository protection compatible with the temporary marketplace bot (PR)

**Claim:** required main protection will not strand or grant a broad bypass to the still-live marketplace artifact updater.

Builder: convert the direct-main version-bundle workflow to an inspectable bot branch/PR flow (preferred), with loop/idempotency/permission tests and no hand-built plugin artifact in the feature PR. If platform constraints force a bypass, stop and return to Decision review rather than silently widening authority.

Dependencies: I1 (because plugin build identity changes). Risk: high workflow/repository-write boundary. Gate: Bot-workflow Builder → independent exact-SHA security Reviewer → adversarial workflow dry-run/loop/permission QA → repository gate → merge.

# P5S — external release-protection setup receipt (operations; no code PR)

**Claim:** the live trusted-publish path is empirically protected and recoverable before any tag can stage.

Brian/Mike operation: after P5A/P5B merge, configure/verify required main checks/reviews, immutable `v*` rules, ref-restricted no-bypass release environment, exact stage-only npm trusted publisher, both maintainers' 2FA/recovery, and immutable releases. Run the code preflight and store sanitized reviewed-configuration evidence. npm cannot validate the OIDC binding before a real attempt, so E7A's first fail-closed stage—not P5S—is the empirical publisher proof. Do not revoke the fallback publish credential until that succeeds; then require 2FA/disallow tokens and revoke obsolete automation tokens.

Gate: operator setup → independent release/security Reviewer of configuration receipt → observable-setting preflight red/green proof. P5S blocks E7A tagging; E7A records the first empirical OIDC result.

# Q6 — durable first-install quickstart (separate onboarding task/PR)

Owner: `tasks/npm-quickstart-onboarding`. Depends on I1+C2S, not on live release mechanics. It owns literal npm-global install/integration/work-tracking productivity tests and teaches npx only as read-only trial/bootstrap. Its Reviewer checks command provenance; relevant packed-package gates follow. E7A's founder evidence links here and to the existing prerelease task rather than creating another human owner.

# R6A — first contract-release preparation (PR)

**Claim:** one reviewed commit assigns the first compatible contract-bearing SemVer (expected `0.1.0-pre.3`) and candidate-carried claims are coherent before tagging.

Builder: bump package/lockfile; confirm additive 0.1 contract; generate compatible skill/help/package docs and release notes; name the external exact pre.2 bootstrap command; run full source/package gates. Do not tag/publish or embed future commit SHA.

Dependencies: C2H+C2S+U3+N4+P5A. Gate: Release-prep Builder → independent exact-SHA contract/provenance Reviewer → exact candidate dry-run QA → repository gate → Brian opens/merges.

# E7A — bootstrap pre.2 to first contract release (operational receipt)

**Claim:** exact published pre.2 can be migrated honestly to the first protected contract release, which is then the supported at-rest prerelease.

Operations:
1. P5S green; create protected `v<version>` on reviewed R6A SHA.
2. Stage run performs all retained/downloaded-tarball, local upgrade, integration, offline, both-bin, identity, and MCP proofs and records stage ID.
3. Brian or Mike downloads/inspects and rejects or approves with npm 2FA.
4. Separate finalizer verifies public registry integrity/signature/provenance/clean install.
5. Clean pre.2 environment records legacy SemVer, runs the externally documented exact command, and verifies new complete identity/check, explicit skill/hook reconciliation, unchanged stable MCP, npx trial, both bins, and offline bundle work. At least one founder performs the existing unfamiliar-bundle acceptance.
6. On success Brian/Mike moves `latest` to candidate; finalizer proves `latest == next` and publishes immutable release/receipt. Failure follows protocol rejection/restore/deprecate rules.

Gate: all code already reviewed/QA'd → release operator proof → founder acceptance → interactive promotion → independent receipt Review. E7A does not claim pre.2 discovered the update.

# R6B — self-discovery proof release preparation (PR)

**Claim:** a subsequent compatible prerelease (expected next `pre.N`) exists solely through the same reviewed preparation contract and gives the first contract release a real successor to discover.

Dependencies: E7A final. Builder bumps source/lockfile/release notes without unrelated behavior; full gates. Gate: Builder → independent exact-SHA contract Reviewer → exact candidate dry-run QA → repository gate → Brian merge.

# E7B — first self-discovered public upgrade (operational receipt)

**Claim:** the first contract-bearing published CLI discovers, prints, and executes its real registry-selected upgrade and its default orientation notice later surfaces the promoted release.

Operations: tag/stage/preapprove exact R6B bytes; Brian/Mike approve under `next`; in isolated first-contract install run `version --check --tag next`, execute its literal exact command, verify identity/skill/hook/MCP/offline/bins; on success promote `latest`; in a separate still-old install prove cached latest-track default orientation under all budget/output rules; publish immutable receipt. Any failure restores `next`, leaves `latest`, deprecates candidate, and records recovery.

Gate: release QA → independent operational receipt Review → promotion/finalizer. Both E7A and E7B must pass before retirement.

# F9 — freeze and independently prove final marketplace recovery (operations)

**Claim:** the final marketplace state is immutable, downloadable, checksummed, and runnable before docs rely on it.

Dependencies: E7B. Operator drafts `marketplace-recovery-<plugin-version>` with exact source/archive/checksum/instructions → independent Reviewer retrieves from GitHub, not worktree → recovery QA installs/runs in isolation → Brian/Mike confirms boundary → publish immutable non-latest release.

# D8 — npm-primary documentation cutover (PR)

**Claim:** every current surface teaches npm-global install/reconciliation, npx trial, explicit checks, integration remedies, privacy/offline behavior, and the already-proven frozen recovery release only.

Dependencies: F9. Docs Builder → independent literal-command/link/provenance Reviewer → generated-doc/drift/command gates → merge. No docs assert a not-yet-existing recovery artifact.

# G10 — transfer surviving distribution invariants to npm gates (test-only PR)

**Claim:** deleting plugin checks cannot delete an unnamed safety property.

Dependencies: E7B; may run parallel to F9/D8. Test Builder maps every plugin build/drift/version/resolver invariant to an npm identity/verifier/release gate or explicit obsolescence → independent provenance Reviewer forces a representative gate red → repository gate → merge.

# X11 — delete live marketplace channel (separate retirement task/PR)

Owner: `tasks/retire-marketplace-channel`. Requires D8+F9+G10. Deletion Builder → independent exact-SHA inventory Reviewer → adversarial clean-checkout/npm journey/frozen-recovery QA → repository/package gates → merge. It adds no new version/update behavior.

# Requirements matrix

| Requirement | Owner/evidence |
|---|---|
| Policy/public schemas/state tables | D0 Decision + protocol, approved reviews |
| Byte-distinguishing honest identity | I1 agreement/flavor/stale/byte tests |
| Safe hook mutation ownership | C2H exact historical/foreign install+uninstall QA |
| Skill + bounded MCP compatibility | C2S additive state/manifest/PATH/handshake proofs |
| Rollback-aware explicit check | U3 fake registry/no-write/state/exit tests |
| Daily nonblocking orientation | N4 TTL/lease/offline/concurrency/output/privacy tests |
| Exact retained provenance artifact | P5A no-rebuild verifier/workflow/state tests |
| Protected repository/publisher | P5B code + P5S external receipt/preflight |
| Honest pre.2 bootstrap | R6A/E7A receipt |
| Real self-discovered upgrade/notice | R6B/E7B receipt |
| npm-global + npx trial onboarding | Q6/E7 evidence |
| Frozen rollback before docs/deletion | F9 independent retrieval/recovery |
| npm-primary docs | D8 literal links/commands |
| Safety-gate transfer | G10 inventory/red probe |
| Zero live duplicate channel | X11 clean-checkout/npm/recovery QA |
| Review precedes every QA/deploy | Explicit gates above; no Build → QA edge |

# Records and branch discipline

- After D0 focused re-review approval, create/link child Tasks for code/operational units and reconcile `roadmap`, `tasks/npm-cli-skill-prerelease`, `tasks/npm-quickstart-onboarding`, and retirement without reopening completed tasks.
- Each code unit begins from current `origin/main` after dependencies merge, on a descriptive feature branch, and ends with one reviewed commit/SHA, synced task outcome, and paste-ready PR title/body. Brian opens/merges. Dependent units do not claim unmerged behavior.
- Bundle writes use `aslite sync`, never code commits. Code PRs contain no AI attribution and do not hand-build bot-owned marketplace artifacts.

[implements](../tasks/version-string-channel-identity.md)

[applies](../decisions/version-update-contract.md)

[specified by](../designs/version-update-protocols.md)

[uses domain model](../designs/version-update-domain-model.md)
