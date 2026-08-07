---
type: Context Note
title: PR 212 exact review at 12dd30b
actor: codex-pr212-independent-reviewer
timestamp: '2026-08-07T15:23:20.153Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: independently determine whether exact SHA `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d` satisfies the frozen pre-publish create-only safety invariants, serving the ultimate goal by preventing unsafe onboarding concurrency and destructive failure behavior from shipping.

Verdict: **CHANGES_REQUESTED**. Exact HEAD was verified detached and clean in `/private/tmp/aslite-pr212-review`; no product code was edited, committed, pushed, or synced. The repair removes the destructive rollback and correctly places publication inside a root-scoped critical section, but frozen fail-closed observation, binding parity, truthful uncertainty, and deterministic production-lock proof are not complete.

## Findings

### P1 — pre-publish unexpected target disappearance is accepted as fresh absence

`packages/cli/src/bundle.ts:455-519` treats every `ENOENT` while resolving the target as another missing tail. The final strict inspection at `:841` does not tell resolution that the invocation just created that target, so `ENOENT` for the target during pre-publish revalidation is accepted and publication proceeds. A deterministic real-coordinator probe injected `ENOENT` on the target lstat at the third phase (preflight, locked revalidation, pre-publish); result was `SUCCESS`, `targetLstats:3`, and `indexExists:true`. This violates the frozen strict-observation rule that unexpected disappearance/shape transition is `RUNTIME` before publication.

### P1 — release failure can erase an uncertain publication outcome and report the opposite

`packages/cli/src/bundle.ts:820-883` tracks only `published`, while the lock primitive releases in `finally`. If publication throws an uncertainty and lock release also throws, the release exception replaces the inner error. Because `published` is still false, the outer mapper reports `operation: acquire-filesystem-mutation-lock` and `publication_outcome: not-published`, even though the lock was acquired and publication was attempted with an uncertain outcome. A deterministic double-fault probe produced exactly that false envelope, with non-empty residual directories. Separately, raw publish errors at `:795-801` omit `publication_outcome: uncertain`, and raw non-`FilesystemMutationLockError` acquisition failures escape at `:883`; the production lock suite explicitly pins EACCES/EIO acquisition failures as raw errors. This violates the frozen residue/lock/post-publish truth contract.

### P2 — create-only duplicates and diverges from the established project-binding parser

`packages/cli/src/bundle.ts:571-624` reimplements JSON/URI/path binding parsing already owned by `resolveProjectBinding` at `:192-236`; `existingBundleAt` at `:545-568` also applies create-target symlink policy to a binding lookup target. Empirical parity probes show the parent SHA accepts both cases while the reviewed SHA changes them: an ordinary symlinked `.agentstate.json` is followed by `resolveProjectBinding` but create-only now rejects it as malformed USAGE; a regular binding pointing through a symlink to an empty non-bundle is allowed at `81b3c39` but rejected at `12dd30b` as though the bound alias were the create target. This violates the frozen existing-binding contract and the requirement not to create a second divergent binding parser.

### P2 — the deterministic mutex gate does not exercise the production mutex or package concurrency path

`packages/cli/test/init-create-only.test.ts:472-537` replaces `withFilesystemMutationLock` with a role scheduler that ignores `_key` and directly invokes callbacks. It genuinely orders both parent/child directions and ordinary/conventional shapes, but it would pass if the production lock key/default wiring were broken. The key test at `:717-743` covers only the current platform; the built-process test at `:756-786` is scheduler-timed smoke. `scripts/verify-npm-package.mjs:405-429` proves only installed fresh creation and existing-bundle refusal, not the repaired parent/child mutex. Thus the frozen deterministic production-lock/package proof remains unowned.

## Evidence and survived attacks

- Exact SHA: `git rev-parse HEAD` -> `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d`; parent -> `81b3c39ff252013e318b1a714b63430a24074d70`; detached clean status.
- Old-SHA red proof in isolated `/private/tmp/aslite-pr212-old-review`: pre-existing empty target had a recorded dev/ino, then `verifyCreateOnlyIsolation` removed it; final lstat was `ENOENT`.
- Sampled reviewed-SHA suites: focused CLI `35/35`, focused core expected-version `1/1`, production filesystem-lock `25/25`; root build exit 0. Built identity reported exact commit, `dirty:false`.
- Builder logs audited: full CLI `1315/1315`, full core `399/399`, typecheck/build/skill checks green; exact post-commit local package proof reported 30 files, zero runtime dependencies, both bins, commit `12dd30b...`, `dirty=false`, offline workflow passed. I did not claim or rerun `npm run check`.
- Survived: POSIX physical parent/child targets derive `/`; source construction uses the platform path root so same-drive and same-UNC-share ancestor pairs derive one Windows root. Symlinked ancestors are physicalized before keying; root/alias changes are re-resolved under lock and immediately before publish. The critical section contains locked strict inspection, component creation, final inspection, and expect-absent publication; Recipe application remains outside only after success.
- Survived: no create-only coordinator path contains `unlink`, `rmdir`, `rm`, cleanup/quarantine rename, or the old verifier. Pre-existing target identity and file/symlink/directory replacements survive the tested failures. External runtime-lock removal and the atomic publication rename are outside the forbidden product-tree rollback class.
- Survived: manual core probes found directory-shaped `index.md` fails with `EISDIR`, a symlink to existing bytes produces `VersionConflict`, and chmod-denied bytes propagate `EACCES`; no broad `currentVersionAt` regression was found.
- Residual risk after correction: guarantee remains same-user/cooperating/local-filesystem; raw writers and incoherent network caches cannot be mutually excluded, but must still receive no deletion and truthful uncertainty.

## Commands/results

- Read `CLAUDE.md`, required skills, `docs/core`, `tasks/init-target-safety-guard`, frozen plan, all three R0 notes, builder note, and pre-compact notes from the primary bundle with explicit `--dir` and auto-pull disabled.
- `npm ci` and `npm run build` in the reviewed worktree: exit 0.
- `node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts`: 35 pass, 0 fail.
- `node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/filesystem-expected-version.test.ts`: 1 pass, 0 fail.
- `node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/filesystem-lock.test.ts`: 25 pass, 0 fail.
- `./aslite version --json`: commit `12dd30b...`, dirty false.
- Old worktree red probe: `81b3c39...`, conflict returned, pre-existing target removed (`ENOENT`).
- Reviewed-SHA targeted probes: unexpected pre-publish ENOENT succeeded and published; binding parity diverged; raw publish/lock envelopes lacked required state; publish-uncertainty plus release failure falsely reported not-published/acquire.

## Result Envelope

- status: COMPLETE
- verdict: CHANGES_REQUESTED
- exact_sha: `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d`
- findings: 2 P1, 2 P2
- summary: destructive rollback is removed and the intended critical-section shape exists, but strict disappearance fails open, release masking can make uncertainty false, binding policy forked, and deterministic production-lock/package proof is missing.
- risks: unattended create-only can publish after an observation the frozen contract calls uncertain; error automation can retry on a false not-published premise; valid existing binding shapes regress; mutex gate can stay green without the production lock.
- next recommendation: repair the strict expected-presence observer and error-state machine; reuse one binding parser with strict I/O injected around it; make the deterministic parent/child barrier delegate to the real production lock and carry it through the exact installed package; add red regressions for every finding, then restart exact-SHA Review before QA.
