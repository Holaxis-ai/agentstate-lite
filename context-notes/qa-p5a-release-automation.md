---
type: Context Note
title: P5A adversarial QA — retained-artifact staged npm release
actor: claude-p5a-qa
timestamp: '2026-08-03T23:00:50.368Z'
---
# Summary

Adversarial QA for P5A (retained-artifact staged npm release automation), SHA
b641dff6302d22db4c94c4696d83a2b31f4bc43c, branch feat/npm-staged-release-automation.
Isolated worktree, `npm ci` clean, baseline `node --test` of the three release suites =
31/31 pass (exit 0). Went beyond the suite with direct adversarial inputs against the pure
reconciler, the retained-tarball SHA gate, and the operation emitters.

VERDICT: pass-with-caveats. Merges safely as a code-only, no-live-release unit (every live
mutation is gated behind MODE==live + the not-yet-provisioned `release` environment). Two
findings should be fixed before live is enabled; one is cheap enough to fix now.

## Attacks that SURVIVED (system resisted) — empirical unless noted

- State machine (release-state.mjs) resisted all 27 probes:
  - Transition interruption: prepared->staged (skip draft) rejected (illegal_transition); a
    partial/corrupt ledger that LOST tarball_sha256 fails CLOSED at inspection
    (observed != undefined -> inspection_mismatch), never approves.
  - rolled_back is terminal: ->final and ->promoted both blocked; rollback replay with
    identical receipt is a no-op (changed:false); replay with a changed deprecated_version ->
    identifier_mismatch.
  - Rerun idempotency: every one of the 8 happy-path transitions is changed:false on identical
    replay; re-asserting a different run_id / artifact_id / stage_id -> identifier_mismatch
    every time.
  - Artifact-swap semantics: draft asset_digest != prepared SHA -> artifact_mismatch; inspected
    observed_sha256 != prepared SHA -> inspection_mismatch (cannot approve).
  - resolveTags: prerelease keeps latest known-good until promoted; failed deprecates the
    candidate and keeps both tags; stable failed restores prior latest; bad kind/phase throw.
- Retained-tarball SHA gate (verifyRetainedTarball) held (empirical): a swapped/rebuilt tarball
  whose bytes differ from the manifest sha256 is rejected at the cross-check BEFORE any install
  (3a); a manifest declaring a non-`npm-package` channel is rejected (3d);
  parseVerificationArgs rejects `--tarball` with no value, leftover args, and `--local
  --release` together (3e). The workflow shell steps independently re-shasum the downloaded
  tarball vs candidate.json in draft/stage/registry-verify jobs.
- Fail-closed CLIs (empirical): release-emit-receipt exits 1 on a missing OR empty-string arg;
  release-reconcile exits 1 on empty / non-JSON / incomplete receipt / unknown target state.
- No-live-publish (empirical + reasoned): release-run-operations WITHOUT --execute only prints
  (no sh -c spawn, verified with a marker that was NOT created). A bare `v*` tag push runs
  release-staged.yml with MODE defaulting to dry-run (env `github.event.inputs.mode ||
  'dry-run'`), so candidate builds+verifies but draft/stage only print. All live mutation sits
  behind `[ "$MODE" = "live" ]`.

## Issues

1. [HIGH severity / EMPIRICAL / fix-before-live, recommend now] Shell injection into the
   `sh -c`-executed operation commands.
   - release-run-operations.mjs `execute()` runs `spawn("sh", ["-c", command])`. The command
     strings are built by release-operations.mjs via direct interpolation of `version`,
     `release-id`, `stage-id`, `tag` with NO format validation (`req()` only checks non-empty).
   - Repro (empirical, executed): `node scripts/release-run-operations.mjs --op reject
     --stage-id "nope; touch ./INJECTED_PROOF; true" --execute` -> marker file created ->
     arbitrary code ran on the runner. Same for `--op registry-verify --version
     "0.1.0; <cmd>"` and `--op immutable-release --version/--release-id`.
   - Reachability: release-finalize.yml runs `release-run-operations --execute` in MODE==live
     with `version` and `draft_release_id` taken straight from workflow_dispatch inputs. The
     `registry-verify` job runs `--execute --version <input>` and has NO `environment: release`
     gate (only contents:read), so a live-mode dispatch achieves code execution on the runner
     ahead of the environment-gated finalize job. Requires a privileged actor (Actions dispatch
     + the workflow on the default branch), and live is gated off in this unit, so it is NOT
     reachable today — but the vector ships in the code now and becomes live-reachable the
     moment P5S provisions the environment.
   - Fix: validate inputs before building commands (version -> strict SemVer, run/artifact/
     draft-release ids -> `^[A-Za-z0-9._-]+$`, stage-id -> safe charset), and/or replace
     `sh -c command` with `execFile`/`spawn` over argv arrays (no shell) since none of the
     commands need shell features. Add an adversarial test that an injected metacharacter is
     refused or rendered inert.

2. [LOW / EMPIRICAL+reasoned / fix-before-live] verifyRetainedTarball skips the SHA cross-check
   when `manifest` is null.
   - With manifest=null the tarball-vs-recorded-sha assert is bypassed; only the install +
     identity + channel proof runs (3c). Reachable via prepublish-guard when
     ASLITE_RELEASE_TARBALL is set but ASLITE_RELEASE_MANIFEST is not — so the guard would
     "verify" ANY validly-built npm-package tarball, not specifically the staged candidate.
     Low severity: the workflow path always passes the manifest AND does an independent shell
     shasum compare; release-candidate.mjs always passes manifestPath. Existing tests cover the
     mismatch-WITH-manifest path (release-candidate.test.mjs:84) but not the no-manifest skip.
   - Fix: either require a manifest in retained mode, or have prepublish-guard refuse when no
     manifest is available.

3. [INFORMATIONAL / reasoned / calibration] The pure reconciler (release-state.mjs via
   release-reconcile.mjs) is ORPHANED — referenced by nothing in the workflows or package.json.
   The transition-legality / ordering / idempotency guarantees it so thoroughly proves do NOT
   govern the actual release runtime. The automation enforces byte identity (shell shasum +
   verifyRetainedTarball) but does NOT machine-enforce ordering: release-finalize.yml does not
   verify that inspection+approval actually occurred before it publishes — it trusts the
   operator-supplied draft_release_id/stage_id/version. This is acceptable for a no-live unit,
   but the ordering safety is human-procedural, not mechanical. Recommend either wiring the
   reconciler into the finalize path (reconstruct+verify the ledger from the dispatched IDs
   before mutating) or explicitly documenting that the reconciler is a design/validation
   artifact, not a runtime gate, so a future reader does not assume it is enforcing ordering.

## Bottom line

P5A is safe to MERGE as a code-only, no-live-release unit: all state-machine invariants hold,
the retained-tarball SHA gate genuinely blocks a swapped/rebuilt tarball, no input combination
triggers a live mutation while MODE!=live, and every fail-closed path exits non-zero. The
review's runtime story (stage-time SHA cross-check + literal-file staging beats an
evadable-test rebuild) is CONFIRMED empirically. Recommended: a short builder fix cycle for
issue #1 (shell injection - cheap, and a security defect in a supply-chain publish mechanic
that becomes live-reachable at P5S) and issue #2 (no-manifest SHA skip) before live is enabled,
plus a decision on issue #3 (reconciler is not on the runtime path). None of these block the
no-live merge; #1 should not survive to the P5S/live-enable milestone.
