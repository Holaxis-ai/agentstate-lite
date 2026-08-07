---
type: Context Note
title: PR 212 final exact review at 61ff794
actor: codex-pr212-final-reviewer
timestamp: '2026-08-07T16:04:54.029Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: independently determine whether exact SHA `61ff794a6e1515f662c2005d800c814058da0139` satisfies the frozen create-only safety contract after the final three corrections. This serves the ultimate goal by preventing unsafe or unproven unattended workspace creation from advancing to QA.

Verdict: **CHANGES_REQUESTED**. Exact HEAD was detached and clean in `/private/tmp/aslite-pr212-final-review`; no product files were edited, committed, pushed, or synced. One P2 compatibility finding remains at the binding-target observation boundary. Under the frozen three-cycle cap, this substantive finding requires architecture reorientation before another fix.

## Finding

### P2 — stable regular-file binding target has direct-versus-symlink policy divergence

`packages/cli/src/bundle.ts:567-597` returns `null` immediately when the binding target is a direct regular file, so create-only treats it as a non-bundle and proceeds. The same bytes reached through a symlink pass the new realpath and required physical lstat, then the successful regular-file observation is converted to `RUNTIME`/`ESHAPE` by the resolved-shape check.

Empirical exact-SHA probe over two fresh projects:

- direct binding to stable regular-file non-bundle: `SUCCESS`, publish callback reached;
- symlink binding to that same stable regular file: `RUNTIME`, phase `preflight`, operation `validate-resolved-binding-target-shape`, fs code `ESHAPE`, no publish.

This is not justified by the strict-observation correction. Realpath and lstat both succeeded in the symlink case; there was no ENOENT, ENOTDIR, I/O error, or established shape transition. The parent `81b3c39` binding check used permissive `exists(candidate/index.md)` and treated both shapes as non-bundles. Rejected SHA `ab2d97f` also returned `null` for both stable regular-file shapes. The shared parser accepts either filesystem path, and the frozen contract required existing binding and symlink parity without authorizing a new alias-specific binding-target shape policy.

A narrow `return null` for non-directory physical results would restore parity but could hide a genuine directory-to-file transition. The current observer has no pre-realpath physical target-kind receipt for a symlink, so the cap implication is real: reorient the binding observation state machine and decide how stable non-directory targets and shape transitions are distinguished before changing code again.

## Final-correction audit

The three bounded corrections were inspected independently:

1. Post-realpath required observation: direct and symlink directory candidates both perform a required physical lstat after successful realpath. Any thrown ENOENT, ENOTDIR, or other filesystem error routes to structured `RUNTIME`; a legitimate initially absent binding target returns before realpath and remains allowed. The stable symlink-to-regular success case is the P2 above.
2. Release over publish: the release failure remains primary and carries lock phase, operation, path, publication state, and current residual directory receipt. The masked publish failure now retains prior code, phase, operation, path, filesystem code, publication outcome, and a separately copied prior residual-directory array.
3. Installed artifact proof: a generated Node ESM preload wraps the same mutable `fs.promises.mkdir` object used by the bundled production lock. The holder performs the real non-recursive `.lock` mkdir and pauses before returning. The contender reaches the identical lock path, performs the real mkdir, records EEXIST, and remains excluded. The verifier proves no parent or child index exists before release; afterward the holder wins, the contender exits 5, and no nested pair exists. This uses Node `--import` and standard promises APIs available on the supported Node 20 line and adds no product test hook.

## Survived attacks and invariants

- Static inspection and the focused no-deletion regression find no create-only `unlink`, `rmdir`, `rm`, quarantine rename, or old post-publication verifier. Product-tree replacement states remain untouched.
- Initially absent targets remain valid; locked and pre-publish disappearance transitions fail before publication with structured state.
- Binding parsing has one shared `parseProjectBinding`; symlinked binding files and symlinked directory non-bundle targets remain accepted; malformed and URL bindings remain fail closed.
- POSIX parent and child use the same physical root key. The production mutex encloses locked revalidation, component creation, final revalidation, and expect-absent index publication. Recipe application remains after successful release.
- Core expected-version observation propagates non-absence read errors. Final publication remains an expect-absent CAS.
- Ordinary init open/create/idempotence, default/none/named/path Recipe forms, bad-Recipe-before-write behavior, residue receipts, hidden-descendant refusal, and target replacement preservation remained green in the focused suite.
- Built identity reported exact commit `61ff794a6e1515f662c2005d800c814058da0139`, `dirty:false`. The complete installed local package proof reported the same commit and passed its 30-file allowlist, zero runtime dependency, both-bin, offline workflow, and production-lock barrier checks.
- Scope remained create-only policy, its tests, core lock/CAS authority, direct help/skill generation, and package verification. Bot-owned plugin artifacts and manifests were unchanged.

## Commands and results

- `git rev-parse HEAD` → `61ff794a6e1515f662c2005d800c814058da0139`.
- `git status --short --branch` → `## HEAD (no branch)` before and after review commands.
- `git diff --check origin/main...HEAD` → exit 0.
- `npm ci` → exit 0, 437 packages installed.
- `npm run build >/private/tmp/pr212-final-review-build.log 2>&1` → exit 0.
- Exact inline probe invocation: `node --import ./packages/cli/test/ts-loader.mjs --input-type=module -e <direct-versus-symlink regular-file binding probe>` → direct `SUCCESS`; symlink `RUNTIME/ESHAPE` at `validate-resolved-binding-target-shape`.
- `node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts >/private/tmp/pr212-final-review-focused.log 2>&1` → 44 passed, 0 failed.
- `node --test --test-name-pattern="installed create-only proof holds the real production lock boundary" scripts/verify-npm-package.test.mjs >/private/tmp/pr212-final-review-package-structural.log 2>&1` → 1 passed, 0 failed.
- `npm run verify:npm-package >/private/tmp/pr212-final-review-package.log 2>&1` → exit 0; local package verified at exact clean source commit, offline workflow passed.
- `./aslite version --json` → exact commit, source dirty false, local-dev artifact identity.

Builder evidence was audited rather than duplicated wholesale: the correction-2 record reports focused 44/44, CLI 1324/1324, scripts 128/128, build/typecheck/skill/package green; core was unchanged from the accepted 399/399 correction-1 evidence. This review did not rerun `npm run check` or every full suite, per the bounded review assignment.

## Residual risks

- Mutual exclusion remains scoped to cooperating same-user processes on a coherent local filesystem. Different users, raw writers, and incoherent network caches are outside exclusion, while no-deletion and truthful uncertainty still apply.
- Windows case-variant drive and UNC-root semantics were reasoned but not executable on this host.
- Node 20 compatibility of the preload is reasoned from supported standard mechanics; this reviewer executed it on Node 25. Hosted Node 20 execution remains a later exact-SHA gate.

## Result Envelope

- status: COMPLETE
- verdict: CHANGES_REQUESTED
- exact_sha: `61ff794a6e1515f662c2005d800c814058da0139`
- findings: 0 P1, 1 P2
- summary: all three named corrections work for their covered states, but final binding-target hardening regresses stable regular-file non-bundle parity only through a symlink.
- evidence: exact empirical parity probe; focused 44/44; package structural 1/1; full installed package proof green; exact built/package identity clean.
- risks: alias-specific binding policy can refuse a configuration direct-path binding accepts; a narrow correction risks reopening genuine shape-transition uncertainty.
- next recommendation: stop narrow fixes and perform the frozen architecture reorientation around a phase-aware binding-target observation model before any further product change. QA must not start on this SHA.
