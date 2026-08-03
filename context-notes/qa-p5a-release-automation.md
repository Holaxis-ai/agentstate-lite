---
type: Context Note
title: P5A adversarial QA — retained-artifact staged npm release
actor: claude-p5a-qa
timestamp: '2026-08-03T23:31:43.792Z'
---
# Summary

DELTA re-verify of the P5A builder fix at SHA 631c39cf07a8230e5ecb99aeda307ac4e02f60dd
(fix commit on top of b641dff, branch feat/npm-staged-release-automation). Isolated worktree,
HEAD confirmed at 631c39c. This supersedes the first-round QA note below it.

VERDICT: pass-with-caveats (clean to push as a code-only, no-live-release unit). The HIGH
(shell injection) is GENUINELY CLOSED. Findings #2, #3, #4, and the environment-gate gap are
all addressed. One LOW residual (leading-dash argument injection) remains, not reachable via
the automation and not a merge blocker.

## Injection (the HIGH) — CLOSED. Empirical.

Fix mechanism (verified in source): `release-run-operations.mjs` now runs each operation via
`execFile(argv[0], argv.slice(1))` — NO shell, no `sh -c`, no word-splitting. `release-
operations.mjs` builds validated ARGV ARRAYS and validates every interpolated value at
construction: `assertVersion` (strict SemVer), `assertToken` ([A-Za-z0-9._-]), `assertSha256`.

- My exact original repro re-run: `node scripts/release-run-operations.mjs --op reject
  --stage-id "nope; touch ./INJECTED_PROOF; true" --execute` -> EXIT 1, message "invalid
  stageId (must match [A-Za-z0-9._-])", NO marker file. (Round 1 this created the marker.)
- 45 further bypass shapes across version / tag / stageId / releaseId, all REJECTED at
  construction (empirical): command substitution `$(...)`, backticks, embedded newline,
  semicolon, pipe, ampersand, glob/space, `--flag=value`, URL-encoded, NUL byte, unicode space.
- No residual shell path exists: execFile is the only executor; the display/instruction
  strings are quoted for HUMAN display only and are never executed.

## LOW residual — leading-dash argument injection (empirical, NOT reachable via automation)

`TOKEN = ^[A-Za-z0-9._-]+$` permits a leading dash, so flag-shaped values (`--force`, `--otp`,
`--json`, `--registry`, `-f`, `--`) pass `assertToken` for fields that become a STANDALONE argv
element (stageId in reject/approve, tag in promote, track in rollback). execFile has no shell,
so this is NOT command injection, but npm/gh would interpret the value as a FLAG rather than an
id/tag (classic argument injection). Materially lower severity than the shell injection:
- `=` is banned, so `--flag=value` forms cannot be built; the flag is always the LAST argv, so
  it cannot consume a following value.
- releaseId is neutralized (embedded in the path string `repos/.../releases/<id>` = one arg).
- In the ACTUAL workflow `--execute` paths, the only attacker-influenced inputs are `version`
  (SemVer-guarded, no leading dash possible) and `releaseId` (string-embedded). stageId / tag /
  track are operator-interactive, never fed to the workflow's execute path from dispatch input.
  So this residual is only reachable by an operator hand-typing a flag-shaped value at the CLI
  (self-inflicted), not by the automation with dispatch-controlled input.
- Recommended hardening (not a blocker): reject a leading `-` in `assertToken`, or insert a
  `--` end-of-options separator before any user-supplied argv tail. Also no max-length bound on
  tokens/version (over-long values build an argv) — cosmetic, harmless.

## Spot-checks of the other fixes — all PASS (empirical)

- #2 manifest now REQUIRED (fail closed): `verifyRetainedTarball({manifest:null})` throws
  "requires a candidate manifest"; CLI `--tarball` without `--manifest` exits 1;
  `prepublish-guard.mjs` explicitly refuses (exit 1) when ASLITE_RELEASE_TARBALL is set but
  ASLITE_RELEASE_MANIFEST is not. The round-1 no-manifest SHA-skip is gone.
- #4 the reframed "THE REAL INVARIANT" test is genuine, not vacuous: it asserts each mutating
  job contains the retained-bytes SHA gate AND that every mutating command's string index is
  AFTER the gate's. Probed RED once: injecting `gh release upload` BEFORE the SHA gate in the
  draft job makes the position assertion FAIL — the test catches a premature mutation.
- #5 / env gaps: draft (124), stage (170) in release-staged.yml and registry-verify (63),
  finalize (108) in release-finalize.yml all bind `environment: release`; the candidate
  (build/pack) job binds NO environment. My round-1 concern (registry-verify ran `--execute`
  ungated) is closed — registry-verify is now environment-bound.
- #3 documented-not-wired, HONEST: the release-finalize.yml "OPERATOR-TRUST BOUNDARY" comment
  and the release-state.mjs / release-reconcile.mjs headers now state plainly that byte
  identity is machine-enforced but inspection/approval ORDERING is human-procedural (the
  reconciler is a validation/operator tool, deliberately not the runtime ordering gate; wiring
  it needs persisted operator-signed receipts, tracked as a follow-up before live). No false
  assurance. Acceptable for a no-live merge.

## Gate

- P5A tests all PASS by exit code. `npm run test:scripts` (npm context, so npm_execpath set):
  112 tests, 110 pass. Every P5A test passed, including the heavy real "build once, pack once"
  install proof (4594ms), the injection-refusal unit test, the REAL INVARIANT test, and the
  env-bound test.
- The ONLY 2 failures are `scripts/ci-version-bundle.test.mjs:368` and `:400` — real UI-workspace
  vite-build REPRODUCIBILITY tests, a file UNTOUCHED by P5A, failing under this machine's node
  25.2.1 (a nested-npm UI build flake; the UI builds fine standalone, and CI pins node 20 where
  the builder reports `npm run check` exits 0). These are the BOT-OWNED plugin-bundle
  reproducibility tests, explicitly outside the PR-side gate per CLAUDE.md. NOT a P5A regression.
  Recommend the coordinator confirm CI is green on the exact SHA (node 20).

## Bottom line

631c39c is CLEAN to push as a code-only, no-live-release unit. The HIGH is genuinely closed
(execFile no-shell + strict validators; 45 bypass shapes refused; original repro now exits 1
with no marker). #2/#3/#4 and the environment-gate gap are all fixed and re-verified empirically.
The only residual is a LOW leading-dash argument-injection surface that the automation does not
expose to attacker input — worth a one-line hardening (ban leading `-` / add `--` separator) in
this or a follow-up unit, alongside the already-tracked "wire the reconciler with signed
receipts before live" follow-up, but neither blocks the no-live merge. The 2 red tests are an
unrelated node-25 UI-build environment flake, not P5A.
