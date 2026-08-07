---
type: Context Note
title: npm quickstart Builder current-main integration
actor: codex-npm-quickstart-builder
timestamp: '2026-08-07T18:01:19.951Z'
---
# Summary

Builder integrated the parked npm quickstart checkpoint onto current main and completed the frozen nine-file correction. The branch is clean at `8c9360bb098f33302337d489a54dd0fcb0e16f24`, with rebased checkpoint `8fcd8e34f0aa4eacf06889d0f6dda878996c495c` directly above exact base `531c9df8ac7299f662d87862d270c7eb63f7dfab`. No push, bundle sync, PR creation, or merge was performed.

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: integrate the installed npm first-value journey onto current main so a normal non-empty project follows emitted guidance into a safe conventional bundle, creates one honestly attributed Task, and sees useful state. This serves the ultimate goal by making first value executable without founder explanation.

## Commit transition

- Parked remote checkpoint: `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef` on old base `81b3c39ff252013e318b1a714b63430a24074d70`.
- Rebase command: `git rebase --onto origin/main 81b3c39ff252013e318b1a714b63430a24074d70 HEAD`.
- Rebased checkpoint: `8fcd8e34f0aa4eacf06889d0f6dda878996c495c`.
- Current-main correction: `8c9360bb098f33302337d489a54dd0fcb0e16f24` (`fix(cli): make the npm quickstart executable`).
- `git range-diff 81b3c39..6e2cfaa origin/main..8fcd8e3` preserved the checkpoint; the only mechanical difference shown was the now-main-owned `readFile` import in the static verifier test.
- Final branch is exactly two commits above current main and changes only the approved nine files.

## Red evidence

At original checkpoint `6e2cfaa`:

- In a non-empty bundle-free project containing `marker.txt`, the advertised cwd-target `init --create-only --recipe work-tracking` exited 5 `ALREADY_EXISTS` because it targeted the project root.
- A real existing local bundle returned `applied:false` Recipe rows whose `commands` still included a guaranteed-dead same-target `create_bundle` command.
- Both READMEs taught `@next`; the parked public copy used compatibility-only `--scope global`; neither explained that `quickstart-agent` was an advisory tutorial identity.

After rebase at `8fcd8e3`, test-only frozen expectations were run before product edits:

- `A1.3` and `A1.3b` both failed because home omitted the conventional child.
- The existing-bundle and bundle-free Recipe projection tests both failed because existing rows still exposed creation and bundle-free creation had no `--dir '.agentstate-lite'`.
- The exact home-byte test failed on the old no-target bytes.
- The README static contract failed on the default tagged install.

## Implemented contract

- No-bundle home emits create-only commands for `.agentstate-lite`; an explicit project selection emits its `.agentstate-lite` child. Broken binding and board-first-contact behavior was left unchanged.
- Only `applied === null` local Recipe rows emit `create_bundle`; both existing local boolean states and remote rows are add-only. The help projection follows the same state table.
- Both READMEs install unqualified `@holaxis/aslite` once, retain canonical `--scope user`, limit npx to one labeled unqualified orientation trial, and identify `quickstart-agent` as an advisory example to replace with the actual agent identity.
- The installed verifier now uses a non-empty quickstart project with an unrelated marker, proves home/recipes are read-only, executes the exact emitted create string into `.agentstate-lite`, retries that exact string and byte-pins the whole project tree, then proves attributed Task read/list/home/status state.
- Current-main PR #212 source/artifact identity, retained-package, no-delete/refusal, and real production-lock preload/barrier oracles remain in the verifier. The relocated skill integration now exercises PR #211's canonical `user` spelling for install/status/uninstall.

## Verification

- Focused green: home `2/2`; Recipe state tests `2/2`; exact home bytes `1/1`; README/static lock contract `2/2`.
- Full `home.test.ts`: `24/24`.
- Full `recipes.test.ts`: `56/56` (the sandbox run had only the expected loopback `EPERM`; the unrestricted rerun passed).
- Full `update-orientation.test.ts`: `22/22`.
- `npm run build`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run test:scripts`: unrestricted exit 0, `129/129`. The first sandbox attempt reached only two npm package-consumer `EPERM` cache failures; the required unrestricted retry passed.
- Exact clean-SHA `npm run verify:npm-package`: exit 0; receipt reports source commit `8c9360bb098f33302337d489a54dd0fcb0e16f24`, `dirty=false`, 30 files, zero runtime dependencies, both bins, and the offline workflow passed.
- Exact clean-SHA unrestricted `npm run check`: exit 0, including CLI `1355/1355`, scripts `129/129`, package proof, and Playwright `19/19`.
- `git diff --check`: exit 0. Worktree is clean.
- Final process audit found no remaining test, verifier, installed-lock, npm-check, or Playwright process; only the audit command itself matched.

## Residuals and handoff

- Independent exact-SHA Review is still required before QA.
- Adversarial installed-journey QA is still required after Review approval.
- Live registry installation remains deliberately deferred until a source candidate is published; all current evidence is the exact local tarball, not a registry claim.
- The remote feature branch still points at old checkpoint `6e2cfaa`; the orchestrator owns the later force-with-lease push only after Review and QA.
