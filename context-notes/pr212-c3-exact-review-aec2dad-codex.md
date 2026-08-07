---
type: Context Note
title: PR 212 correction 3 exact review at aec2dad
actor: codex-pr212-c3-reviewer
timestamp: '2026-08-07T16:33:35.628Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: independently determine whether exact clean SHA aec2dadbe186fe284c3e64a2a568269ef4bacd12 implements the frozen binding-target observer without regressions or unnecessary machinery. This serves the ultimate goal by preventing unsafe or over-engineered unattended create-only onboarding from advancing to adversarial QA.

Verdict: **APPROVE**. No P1, P2, or release-blocking P3 findings. The detached worktree remained clean at the exact SHA. No product, test, git, push, sync, or merge mutation was performed.

## Exact diff audit

The correction changes exactly two files relative to 61ff794: packages/cli/src/bundle.ts has 31 added lines and 3 removed lines; packages/cli/test/init-create-only.test.ts has 230 added lines. There is no coordinator, parser, discovery, mutex, publication, cleanup, help, package-script, or cross-phase change.

The private filesystem seam adds only stat at bundle.ts:357-369. The observer at bundle.ts:560-633 now:

1. treats only initial lexical lstat ENOENT as absence;
2. follows a lexical symlink exactly once with stat, while reusing direct lstat;
3. requires realpath and physical lstat;
4. rejects resolved symlink, directory/non-directory mismatch, and dev/ino mismatch with structured RUNTIME provenance;
5. returns no bundle for a stable physical non-directory; and
6. preserves the existing strict directory marker inspection.

This exactly implements the frozen local S0/S1 transaction. Direct and symlink stable-file spellings converge, while a transition witnessed inside one observer call fails closed. No receipt crosses preflight, locked revalidation, or pre-publish. No product-tree deletion or replacement primitive was added.

## Empirical evidence

- Exact review HEAD: aec2dadbe186fe284c3e64a2a568269ef4bacd12; detached and clean before and after execution.
- Diff scope: two named files only; git diff --check passed.
- Dependencies: npm ci installed the lockfile-exact workspace dependencies.
- Required root build: npm run build passed. An initial pre-build source-test attempt failed only because sibling core dist output was absent, exactly matching the repository guide; it passed after the root build.
- Focused correction suite: 21 passed, 0 failed. It includes stable parity, direct/symlink snapshot counts, directory-to-file and resolved-symlink shape transitions, same-shape identity replacements, followed-stat/dangling/realpath/resolved-lstat fault provenance, post-realpath disappearance, and prior symlinked-directory discovery.
- Exact installed-package proof: npm run verify:npm-package passed; 30 files, zero runtime dependencies, both bins, exact source commit aec2dad, dirty false, and offline workflow.
- Built-CLI parity probe: direct stable file and symlink to the same file both exited 0 with init ok.
- Independent red control at exact 61ff794: direct stable file returned ALLOW; symlink to the same file returned RUNTIME with operation validate-resolved-binding-target-shape and fs code ESHAPE.
- Built identity: local-dev artifact reports source commit aec2dad and dirty false.

## Test proportionality

The 230-line test delta is larger than the 31-line mechanism but is justified by the dangerous filesystem boundary. It contains four distinct obligations rather than 230 lines of duplicate proof: public parity, syscall ownership, deterministic transition injection, and exact fault provenance. Setup could be factored for terseness, but doing so would not reduce product complexity or residual risk and is not a review finding.

The transition table tests directory shape and identity replacement, not every symmetric file variant. The implementation uses one unconditional directory-boolean comparison and one unconditional dev/ino comparison, so file-to-directory and same-shape file replacement follow the same branches. Replaying those rows would be redundant rather than a missing oracle.

## Survived attacks

- Stable direct/symlink file parity is green through both source and built CLI.
- Dangling aliases fail at stat-binding-target with ENOENT after lexical presence.
- Realpath and physical-lstat faults retain exact phase, operation, path, and fs code.
- Direct and symlink directory-to-file transitions fail before publish with ESHAPE.
- Direct and symlink same-shape replacements fail before publish with EPATHCHANGED.
- A physical symlink observed after canonicalization fails before publish.
- Existing post-realpath disappearance and directory-bundle behavior stay green.
- The exact diff has no delete, prune, quarantine, parser fork, retry, watcher, hash, file-descriptor, or cross-phase receipt mechanism.

## Residual risks

The identity check uses the repository existing numeric dev/ino semantics. On a filesystem that exposes weak or rounded inode identity, it may fail to detect one raw-writer same-shape replacement; it does not create a false claim of atomic exclusion and does not weaken the no-deletion guarantee. Raw writers after the final observation, different users, and incoherent filesystems remain outside the mutex boundary as already frozen. Windows execution is reasoned from standard Node stat/realpath behavior and existing repository dev/ino usage; hosted Node 20/22/26 and adversarial QA remain required.

## Result Envelope

- status: COMPLETE
- verdict: APPROVE
- exact_sha: aec2dadbe186fe284c3e64a2a568269ef4bacd12
- findings: 0 P1, 0 P2, 0 release-blocking P3
- review_worktree: /private/tmp/aslite-pr212-c3-review
- worktree_state: detached, clean
- next: adversarial QA on this exact SHA, then repository and hosted CI gates; any code change restarts exact-SHA Review
- bundle_write: this context note only, intentionally unsynced
