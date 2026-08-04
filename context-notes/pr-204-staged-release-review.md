---
type: Context Note
title: >-
  Final review of PR #204 at c1f7937 — approved; probes confirm fail-closed
  claims; 3 minor notes
actor: claude/reviewer
timestamp: '2026-08-04T19:02:49.383Z'
---
# Summary

Final independent review of PR #204 (P5A staged npm release automation,
`feat/npm-staged-release-automation`) at exact SHA `c1f7937c4231087956d7a6cd881671ca7f057491`.
APPROVED. This is supply-chain-tier code and was reviewed at that tier: full diff read, isolated
worktree at the exact SHA (`npm ci` + root build), all six release suites re-run (54/54 including
the build-once retention test), plus independent adversarial probes. CI cited green on the exact
SHA (gate node 22/26 + engines smoke).

# Empirical verification performed

- Injection probe: `release-run-operations --op reject --stage-id '$(touch MARKER);x' --execute`
  -> exits 1 at construction-time validation, no marker file created, no argv ever built.
- Double-dash values are blocked by the arg parser itself ("missing value for --stage-id").
- Leading-dash gap CONFIRMED REAL as tracked: `--stage-id -rf` emits `npm stage reject -rf`
  (npm argument injection, no shell) — exactly matches [[tasks/p5a-pre-live-hardening]] item (b);
  reachable only via operator-typed values, not automation inputs.
- `verify-npm-package --tarball` without `--manifest` -> usage error, exit 1 (fail closed).
- `prepareCandidateOutputDir` on a non-empty foreign directory -> refusal, contents preserved.
- Swap/no-manifest/structural-no-rebuild tests re-run green; the build-once test verified the
  retained manifest SHA against actual tarball bytes.

# Assessment

The three safety claims hold as *tested claims*, not prose:

- **Inert by default.** MODE defaults to dry-run on tag push; every live mutation requires
  MODE=live AND `ASLITE_RELEASE_LIVE_ENABLED=true` from the release environment — the fix for
  the auto-created-environment hole is a real independent gate, and the PR body honestly
  retracts the earlier wrong "environment = second gate" claim.
- **No rebuild after candidate.** verifyRetainedTarball is structurally free of build/pack calls
  (pinned by a source-scan test), the manifest SHA cross-check is mandatory, and both finalizer
  jobs re-verify the chain (candidate bytes, artifact API id/name/digest/run/head_sha/expired,
  dispatch inputs, draft assets) before any mutation.
- **Shell-safe.** Operations are validated argv arrays executed via execFile with no shell;
  workflows bind every GitHub expression to env before shell use (pinned by test).

Known boundaries are honestly documented and board-tracked, and I verified both are real, not
rhetorical: the reconciler-not-wired-as-runtime-gate limitation and the leading-dash token gap
(tasks/p5a-pre-live-hardening, gating live enablement).

# Minor findings (non-blocking)

## N1 — candidate manifest re-declares build identity instead of reading it

`release-candidate.mjs` hand-constructs `build_identity` and hardcodes
`compatibility_contracts {1,1,1}` — now the THIRD hardcode of the contracts (build-bundle.mjs
literal, verify-npm-package assert, here). Today drift fails closed (the install proof's assert
breaks on any mismatch), but the one-authority fix is to derive the manifest's identity by
running the built artifact's own `version --json` instead of re-declaring it.

## N2 — small TOCTOU between the clean-tree check and the injected dirty:false (reasoned)

`assertCandidateSource` observes HEAD/clean, then `buildCli` INJECTS `{commit, dirty:false}`
rather than re-deriving. A tree that became dirty between check and build would be stamped
clean. In practice the window is one process on a fresh CI checkout and the bundle-input
generators write only gitignored paths; noting for completeness, not asking for change.

## N3 — worktree ergonomics

The build-once test's skip guard checks git+npm_execpath but not sibling workspace dists; in a
fresh worktree without a root build it fails with a confusing vite resolve error rather than
skipping. CLAUDE.md documents build-from-root, so this is a two-minute footgun, not a defect.

# Process note

The PR body's corrected-claim section (retracting the environment-gate claim with the reason) is
the right pattern — the record stays honest about what was previously wrong.

Worktree removed after review; main checkout untouched.

[reviews](../tasks/npm-staged-release-automation.md)
