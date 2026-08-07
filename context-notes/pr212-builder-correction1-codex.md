---
type: Context Note
title: PR 212 Builder correction cycle 1
actor: codex-pr212-builder
timestamp: '2026-08-07T15:38:09.460Z'
---
# Summary

PR #212 Builder correction cycle 1 is in progress from rejected SHA `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d` in `/private/tmp/aslite-pr212-build`.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: close the exact review's four remaining gaps—phase-consistent strict presence, truthful lock/publication state, single-authority binding parity, and production-lock/package concurrency proof—while preserving the accepted no-deletion state machine. This serves the ultimate goal by making create-only automation safe to interpret as well as safe on disk.

Red checkpoint at `12dd30b`: focused `init-create-only.test.ts` completed with 35 pass / 6 fail. The six behavioral failures exactly cover (1) symlinked binding-file parity, (2) post-creation pre-publish ENOENT being accepted, (3) a pre-existing target disappearing before locked revalidation being recreated, (4) raw publish EIO lacking the started-or-uncertain publication envelope and exact index path, (5) release failure being mislabeled acquire/not-published after a publish attempt, and (6) raw lock acquisition EACCES escaping without a CLI envelope. No product source had changed before this run.

Current system model: preflight, locked revalidation, component creation, pre-publish inspection, and expect-absent publication run inside one root-scoped filesystem mutex. The observer currently treats every ENOENT as ordinary missing-tail state, regardless of whether an earlier phase proved a component existed. Lock error classification currently infers acquire versus release only from successful publication, so callback entry and unsuccessful publication attempts are lost. Binding parsing exists twice, and the strict copy imposes symlink rules not present in ordinary discovery. The deterministic parent/child test currently substitutes a scheduler instead of delegating to the production filesystem mutex.

Still-unverified assumptions to close: production mutex blocking uses the same conservative root key in both directions and target shapes; installed package behavior exercises that same lock; legitimate initial absence remains allowed; ordinary and strict binding discovery parse the same supported binding forms while strict observation errors remain typed.

Implemented in the isolated worktree:

- Locked revalidation compares target component presence and existing-directory identity with preflight; pre-publish requires the target still to be present and preserves existing-directory identity. Legitimate absence is still allowed only when both preflight and locked revalidation agree, followed by verified component creation.
- The coordinator tracks critical-section entry separately from `not-started`, `started-or-uncertain`, and `published` publication state. Raw publish and lock failures now carry typed phase/operation/path/fs-code/residue details, and a release failure that masks a callback failure remains a release failure with prior failure metadata and the truthful publication state.
- Ordinary and strict binding discovery share `parseProjectBinding`. Strict discovery accepts the same valid symlinked binding-file form; bound-target lookup follows a symlink to inspect an empty nonbundle without applying create-target symlink rejection.
- The four-way deterministic parent/child test delegates to the real `withFilesystemMutationLock`, holds its real critical section, verifies the shared conservative key, and proves the second contender remains excluded. The packed-artifact verifier now concurrently runs parent/child create-only through the installed CLI and requires exactly one conflict-class loser.

Green verification after implementation: focused create-only 41/41; full CLI 1321/1321; core 399/399; script suites 127/127; `npm run verify:npm-package` passed with the new installed concurrency case; `check:skill`, CLI typecheck, build, JavaScript syntax check, and `git diff --check` passed. The only intermediate green-cycle failure was TypeScript conservatively narrowing callback-mutated publication state; it was fixed by preserving the declared state-machine type at the post-callback boundary.

Proximate goal status: complete. Correction commit `ab2d97fff7fe391e7b46cf3509eef6631008288e` (`fix(cli): close create-only arbitration review gaps`) follows rejected SHA `12dd30b` without amending it. The branch is clean and unpushed. Next action belongs to exact reviewer/QA against this exact SHA.
