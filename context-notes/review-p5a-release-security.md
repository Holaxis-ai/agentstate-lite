---
type: Context Note
title: P5A release/security review
actor: claude-p5a-reviewer
timestamp: '2026-08-03T22:50:15.465Z'
---
# Summary

Independent release/security review of P5A (retained-artifact staged npm release automation),
exact SHA `b641dff6302d22db4c94c4696d83a2b31f4bc43c` on `feat/npm-staged-release-automation`.
Detached onto the SHA in an isolated worktree, `npm ci`, built, and audited the builder's
verification (re-ran a sampled subset, probed the core invariant RED once).

VERDICT: pass-with-caveats. Ready for adversarial QA. No blocking finding: no path
publishes or tags for real on merge or a bare `v*` tag push. One MEDIUM (builder-self-flagged)
about the invariant TEST overclaiming, plus normative-interpretation items for Brian/protocol
sign-off and E7A first-live-use risks.

## Gates re-run (foreground, by exit code, on the exact SHA — CI has not run)

- `test:scripts` (incl. release-state/operations/candidate/workflow): EXIT 0, 108 tests pass.
  The `build once, pack once` candidate test ran with real `npm_execpath` under `npm run`.
- release-state + release-operations + release-workflow direct: EXIT 0, 31 pass.
- `verify:npm-package` (--local): EXIT 0 — 30 files, zero runtime deps, dirty=false, offline
  workflow passed.
- `prepublish-guard.mjs` with no env: EXIT 1, refuses (empirical).

## Priority-target findings

### 1. No-rebuild invariant is denylist-based and EVADABLE (MEDIUM, empirical)

`BUILD_PACK_TOKENS = ["release:candidate","release-candidate.mjs","build.mjs","npm pack","npm run
build","buildCli"]`. I injected `npx esbuild packages/cli/src/index.ts --bundle
--outfile=release-candidate/holaxis-aslite.tgz` (a real rebuild+repack that even writes a `.tgz`)
into the downstream `stage` job. `release-workflow.test.mjs` stayed GREEN (10/10, "THE INVARIANT"
passed). Swapping the same step to `npm run build` turned the test RED (1 fail), confirming the
scan works only for listed tokens. So the test's "THE INVARIANT" claim is a denylist, not
enforcement — builder admitted this.

Severity is MEDIUM, not HIGH, because the LIVE-SAFETY property is separately and STRUCTURALLY
enforced: before `npm stage publish`, the stage job re-verifies the downloaded tarball's SHA-256
against `needs.candidate.outputs.tarball_sha256` and `exit 1` on mismatch, and it stages the
LITERAL `$ARTIFACT_DIR/$tarball_filename` (the downloaded retained artifact), never a build output.
A disguised rebuild cannot change what gets staged unless it overwrites the downloaded tarball with
byte-identical content (impossible for different bytes). The evasion defeats the TEST's stated
claim, not the guarantee that the staged bytes are the retained candidate.

Fix (should-fix, not a QA blocker): either honestly reframe the token-scan's claim, or strengthen
to a structural check — assert every mutating step in a downstream job is preceded by the
retained-bytes SHA gate (that IS the true invariant), or allowlist the permitted downstream `run:`
commands. A denylist on a security boundary will keep losing this race.

### 2. No-live-publish safety — HOLDS (no blocking finding)

`MODE: ${{ github.event.inputs.mode || 'dry-run' }}`: a bare `v*` tag push (no dispatch input)
runs candidate -> draft -> stage in DRY-RUN. Every mutating step is behind `[ "$MODE" = "live" ]`:
- `npm stage publish` (stage job): MODE==live AND `environment: release`. OK.
- `gh release create/edit/upload --draft` (draft job): MODE==live only; NOT env-bound (see #2b).
- finalize `gh api PATCH ... draft=false` (immutable-release): MODE==live AND `environment:
  release`. OK.
- registry-verify `--execute`: MODE==live; read-only (`npm view`/`audit signatures`/global
  install-smoke). OK.
- `npm dist-tag add/rm`, `npm deprecate`, stage approve/reject, promote: operator-INTERACTIVE
  only (emitted as strings by release-emit-receipt / release-run-operations dry-run). NO workflow
  runs them with `--execute`. Consistent with §5 (promoted/inspected/rejected are Brian/Mike
  interactive). OK.

Conclusion: merging this unit, and a bare tag push, are inert. Reaching a real `npm stage publish`
requires a deliberate `workflow_dispatch` with `mode=live` AND the release environment AND a
configured npm trusted publisher (absent pre-P5S -> fails closed). Good.

2b. LOW/reasoned: the `draft` job (GitHub *draft* release, contents:write) is gated by MODE==live
but NOT bound to `environment: release`, unlike stage/finalize. The file header says every
mutating step is behind "BOTH MODE==live AND the release env"; the draft step has one gate. This
is consistent with §5 (draft_prepared owner = "only contents: write", no environment) and a draft
is unpublished, so no live-release exposure — but the header wording slightly overstates. Note,
not blocking.

### 3. Job-scoped permissions — CORRECT (empirical, pinned by passing test)

Top-level `permissions: {}` in BOTH workflows. candidate=contents:read; draft=contents:write;
stage=contents:read+id-token:write (no contents:write); registry-verify=contents:read;
finalize=contents:write. No overbroad grant. GOOD.

### 4. Guessed live formats — FIRST-LIVE-USE (E7A) risk, fail closed (LOW/reasoned)

- The whole `npm stage publish|download|approve|reject` family assumes an npm staged-publish API
  shape; the `stage_id` sed parse
  (`sed -nE 's/.*stage[ _-]?id[ :=]+([A-Za-z0-9_-]+).*/\1/p' | head -1`) is an unverified guess.
  It fails CLOSED: empty parse -> `test -n "$STAGE_ID"` -> `exit 1`. `set -euo pipefail` covers a
  failed `npm stage publish` upstream of the tee. E7A must confirm the real npm output shape; not
  a pre-live blocker.
- finalize `gh api .../releases/{id} --jq '.draft, .tag_name, .id'` uses REAL, stable GitHub REST
  fields — low risk. `asset_digest` lives in the pure reconciler model, not a live gh query, so
  no unverified live asset-shape parse in the workflow.

### 5. Three normative interpretations vs §5 (all builder-flagged in comments; want sign-off)

(a) `rolled_back` as a distinct TERMINAL state: §5's states/owners table stops at `final`;
    rolled_back is derived from the transient-tag/failure prose. Consistent with "a published
    version is never reused ... prepare the next SemVer." Reasonable. OK.
(b) Extra MODE==live gate beyond §5's "tag-triggered candidate": a bare `v*` tag push runs
    DRY-RUN; a live stage needs an explicit `workflow_dispatch mode=live`. MORE conservative than
    §5 (which reads as the tag itself driving staging). Correct and safe for a no-live unit, but
    it changes the operational model — post-P5S, a tag alone will NOT stage. Wants Brian's
    explicit acknowledgement.
(c) `resolveTags` stable `promoted` COLLAPSES `next` onto the stable version (`next = version`)
    rather than REMOVING the `next` dist-tag as §5 says ("Success removes stale next"). NOTE:
    `resolveTags` is a pure, unit-tested helper NOT wired into any workflow or emitter today, so
    it is advisory — but reconcile "collapse" vs literal "remove" before it ever drives live tag
    ops.

### 6. prepublish-guard — SOUND (empirical)

Refuses a direct publish with no `ASLITE_RELEASE_TARBALL` (exit 1, verified). Imports ONLY
`verifyRetainedTarball` — no `buildCli`/`npm pack` — so it cannot mint a second candidate; with
the env var it only re-proves an already-retained tarball. GOOD.

### 7. candidate.json integrity — SOUND (empirical + reasoned)

`candidate.tarball.sha256 = fileSha256(tarballPath)` computed from the ACTUAL packed bytes, then
cross-checked by `verifyRetainedTarball` (throws before any install on mismatch — pinned by the
`fails closed when tarball bytes do not match manifest SHA` test). The retained verifier region
contains zero `build.mjs`/`npm pack`/`buildCli`/`"pack"` tokens (structural test + my read). The
`build once, pack once` test asserts exactly one retained `.tgz` and the manifest SHA equals the
tarball bytes — passed under `test:scripts`. GOOD.

## Survived attacks (calibration)

- Disguised-rebuild evasion of the token denylist: SURVIVED the test (finding #1), but does NOT
  reach live publish (SHA re-verify gate + literal-filename stage defeat it).
- Bare `v*` tag push causing live publish: did NOT survive — MODE=dry-run, every mutation
  behind `[ "$MODE" = "live" ]`.
- Direct `npm publish` via prepublishOnly: did NOT survive — guard exits 1.
- Tarball swap / rebuilt artifact carried forward: did NOT survive — verifyRetainedTarball SHA
  cross-check + reconciler `artifact_mismatch`/`inspection_mismatch`/`identifier_mismatch`.

## Bottom line

Ready for adversarial workflow QA. Merges as a code-only, no-live-release unit — no accidental
publish/tag path. Recommended (non-blocking) builder follow-ups: reframe or structurally harden
the "THE INVARIANT" token scan (#1); tighten the header wording about the draft job's gate (#2b);
and get Brian/protocol sign-off on interpretations (b) and (c). E7A owns first-live verification of
the npm stage output shape (#4).
