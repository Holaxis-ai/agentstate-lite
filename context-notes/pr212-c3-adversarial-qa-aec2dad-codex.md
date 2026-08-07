---
type: Context Note
title: PR 212 correction 3 adversarial QA at aec2dad
actor: codex-pr212-c3-qa
timestamp: '2026-08-07T16:48:36.042Z'
---
# Summary

Fresh adversarial QA is active on exact reviewed SHA `aec2dadbe186fe284c3e64a2a568269ef4bacd12`; the detached worktree is clean, and no code/test/git mutation is authorized.

# PR #212 correction 3 adversarial QA

## Goal and current state

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: independently adversarially validate exact reviewed SHA `aec2dadbe186fe284c3e64a2a568269ef4bacd12` against the frozen create-only contract and VAL-001 through VAL-009 without changing the reviewed unit. This serves the ultimate goal by preventing unsafe unattended onboarding behavior from advancing to release gates.

The isolated QA worktree `/private/tmp/aslite-pr212-c3-qa` is detached, clean, and at the exact reviewed SHA. Independent Review approved this SHA with zero blocking findings. QA is authorized; any code change would invalidate Review and is forbidden.

## QA model

The final binding observer is a local three-outcome classifier. Initial lexical `ENOENT` alone means no existing bundle. A direct object reuses its lexical `lstat` snapshot; a symlink gets one followed `stat` snapshot. Required `realpath` and physical `lstat` provide the second effective snapshot. Resolved symlink, directory-shape mismatch, or `dev`/`ino` mismatch is typed uncertainty. Stable non-directories are no bundle for both direct and symlink spellings; stable directories are strictly inspected for own and conventional indexes. No observation or failure authorizes deletion.

The broader create-only coordinator serializes cooperating same-user creators with the root-scoped production filesystem mutation lock from pre-publish revalidation through expect-absent `index.md` publication. Raw writers are outside that exclusion boundary, so QA must verify fail-closed detection where observed and the no-deletion guarantee everywhere.

## Planned evidence

Run the focused correction matrix and the complete owning file; audit and exercise no-delete and structured error provenance; verify stable direct/symlink files, dangling targets, witnessed shape/identity transitions, and disappearance; run deterministic source and exact installed-package production-lock barriers; then run build, typecheck, the exact npm-package proof, and the repository gate if locally feasible. Inspect exact artifact identity and keep the worktree clean.

## Verdict

**APPROVE.** Exact clean SHA `aec2dadbe186fe284c3e64a2a568269ef4bacd12` satisfies the frozen create-only contract and VAL-001 through VAL-009. No release-blocking QA finding was discovered. The QA worktree remained detached and clean, no product/test/git file was edited, and no QA process remained after completion.

## Executed evidence

- Exact identity before and after: `git rev-parse HEAD` returned `aec2dadbe186fe284c3e64a2a568269ef4bacd12`; `git status --short` was empty; porcelain reported detached HEAD.
- Dependencies: fresh worktree had no `node_modules`; `npm ci` completed from the exact lockfile.
- Required root build: `npm run build` exited 0.
- Workspace typecheck: `npm run typecheck` exited 0.
- Focused correction matrix, rerun after the orchestrator removed a stale Builder process: 21 passed, 0 failed. It covered stable direct/symlink parity, direct zero-follow versus symlink exactly-one-follow snapshots, witnessed shape/resolved-symlink/identity changes, followed-stat/dangling/realpath/resolved-lstat provenance, prior disappearance, and symlinked binding discovery.
- Complete owning file, also rerun after stale-process removal: 61 passed, 0 failed. It includes default/none/named/path Recipes, ordinary-init compatibility, existing/enclosing/binding conflicts, core expect-absent CAS, deterministic and live concurrency, pre-existing target preservation, replacement survival, no-delete source guard, strict observation faults, residue truth, lock acquisition/release/double-fault provenance, hidden descendant behavior, bad-Recipe-before-write, and permission denial.
- Exact installed package: `npm run verify:npm-package` exited 0 and reported 30 files, zero runtime dependencies, bins `aslite` and `agentstate-lite`, source commit `aec2dadbe186fe284c3e64a2a568269ef4bacd12`, `dirty=false`, and offline workflow passed. The proof exercised the real installed production mutex through its Node `--import` barrier: the holder owned the actual lock path, the contender observed `EEXIST` on that same path, neither published before release, and only one nested location won.
- Repository gate: the first sandboxed `npm run check` attempt was invalid environmental evidence because listener tests received `listen EPERM` on `127.0.0.1`; it was terminated after the log stopped progressing, and its exact process tree was confirmed gone. A fresh unrestricted `npm run check` then exited 0 end to end, including Playwright. No unrestricted QA process remained afterward.
- Built CLI spot probe: stable direct-file and symlink-to-that-file bindings both initialized a different create-only target successfully and preserved the bound file bytes. A dangling symlink binding exited 1 with structured `RUNTIME`, operation `stat-binding-target`, exact alias path, and `ENOENT`; no attempted bundle was published.
- Built identity: package `@holaxis/aslite@0.1.0-pre.3`, artifact channel `local-dev`, source commit exact, `dirty=false`, adjacent manifest version matched, and artifact SHA-256 was `sha256:412e1a27366a39af6b11e43911887dcbc80e65b806723ec4f26a473e16db8e3e`.

## VAL ledger

- **VAL-001 pass:** pre-existing empty-target identity survives injected failure; existing bundle snapshots remain byte-identical.
- **VAL-002 pass:** different-file, same-bytes ABA, symlink, and directory replacements survive release uncertainty; the create-only coordinator contains no product-tree deletion/quarantine operation.
- **VAL-003 pass:** EACCES, EPERM, EIO, EMFILE, ENFILE, later ENOENT/ENOTDIR, ELOOP, followed-stat, realpath, resolved-lstat, shape, and identity faults are structured before publication with phase/operation/path/code.
- **VAL-004 pass:** any top-level descendant refuses without descending into the hidden unreadable subtree, and its bytes survive.
- **VAL-005 pass:** root-scoped production locking deterministically orders parent/child and conventional-child variants in both directions; source and installed barriers show the blocked entrant cannot publish, and live races never produced two winners.
- **VAL-006 pass:** component creation reports the exact ordered receipt, residue remains, and error envelopes truthfully distinguish `not-started`, `started-or-uncertain`, and `published`.
- **VAL-007 pass:** acquisition, release, malformed/stale/timeout, and publish-plus-release uncertainty retain the current and masked prior fault provenance without cleanup.
- **VAL-008 pass:** create-only Recipe forms and refusals, typo-before-write recovery, plain init open/create/idempotence, binding parser/discovery compatibility, and stable direct/symlink non-bundle parity remain green.
- **VAL-009 pass locally:** focused and owning source tests, build, typecheck, deterministic built CLI, exact installed package, and unrestricted repository gate all pass on exact SHA. Hosted Node 20/22/26 remains the orchestrator's post-push gate rather than local QA evidence.

## Residual boundary

The frozen boundary remains honest: root-scoped mutual exclusion covers cooperating same-user local create-only processes, not raw writers, other users, or incoherent filesystems. The local S0/S1 observer detects only transitions it witnesses; it cannot make pathname identity atomic after the final observation. Weak or rounded filesystem inode semantics may reduce same-shape replacement detection, but do not weaken the no-deletion invariant or create a claim of exclusion. Hosted Node 20/22/26 still must pass at this exact SHA before merge readiness.

## Result envelope

- status: COMPLETE
- verdict: APPROVE
- exact_sha: `aec2dadbe186fe284c3e64a2a568269ef4bacd12`
- findings: 0 release-blocking findings
- qa_worktree: `/private/tmp/aslite-pr212-c3-qa`
- worktree_state: detached, clean
- next: orchestrator may advance this unchanged SHA to push/hosted CI/PR evidence; any code change restarts exact-SHA Review and QA
- bundle_write: this context note only, intentionally unsynced
