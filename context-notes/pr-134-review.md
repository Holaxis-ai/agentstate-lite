---
type: Context Note
title: 'PR #134 independent re-review'
actor: codex-reviewer
timestamp: '2026-07-21T13:25:07.580Z'
---
# Summary

Verdict: CHANGES REQUIRED on PR #134 at exact SHA `3bd40b94ac291d035ded542b18df0854614560a5`.

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe shared memory through which agents retain and share knowledge with human visibility.

Proximate goal achieved: independently assess whether PR1's interim `aslite` npm identity migration and managed-hook destructive-write hardening are correct and adequately proven.

## Findings

1. Empirical, high: `atomicWriteFileSync` follows a settings symlink for stat/read, then renames a temporary regular file over the symlink path. A hook install against a symlinked `.claude/settings.json` produced `target_is_symlink:false`, left the dotfile target byte-unchanged, and wrote the new settings into the replacement regular file. This silently severs file-level dotfile management for Claude settings, Codex hooks/config, and managed OpenCode plugins using the shared helper.
2. Empirical, high: `readSettingsForInstall` validates that `hooks.SessionStart` is an array but not its members. With valid JSON `{"hooks":{"SessionStart":[null]}}`, `computeSessionStartHookInstall` throws while reading `group.hooks`; the command catches this in the non-fatal `errors` bucket, exits 0, and emits `installed:true` although the Claude file is byte-untouched and no Claude hook was installed. Status/uninstall have the same unchecked group access, contradicting the tolerant-malformed-settings contract.
3. Empirical, medium: the newly added on-disk upgrade test is path-dependent. In detached worktree `/private/tmp/aslite-pr134-review.N5xgk1`, both the focused run and full `npm test -w aslite` fail `hook install over a seeded legacy hook converges on disk` (managed count 0). Direct-source `hookCommand()` writes an `.../invocation.ts session-start` command; GitHub's checkout path contains `agentstate-lite`, so legacy substring matching makes the test falsely green there. The test neither runs a stable `aslite` bin nor remains green in the repository-mandated isolated-worktree shape.

PR metadata also needs correction: the title/body describe PR2's tarball-carried skill and `skill install/status/uninstall`, but this head contains only PR1's coordinate rename and hook hardening. The bundle plan/task correctly records the two-PR split.

## Survived attacks and verification

- Exact-SHA GitHub CI run 29830891914 is green: full repository gate on Node 22 and 26; built-CLI smoke on Node 20.
- Fresh-worktree `npm ci` and root `npm run build` passed.
- All 34 script tests passed under `npm run test:scripts`, including the exact packed-package proof; 26/26 skill-distribution and three completing-command integration tests passed.
- Committed hook tests passed for explicit legacy/new recognition, duplicate collapse, invalid JSON and top-level non-array refusal, byte preservation, mode preservation, and temporary-file cleanup. The focused hook run was 15/16 because of finding 3.
- Rename inventory showed no stale `npx -y agentstate-lite` outside the intentional legacy-recognition test and no stale npm workspace/package selector outside plugin-channel fixtures.

No code or PR state was modified.
