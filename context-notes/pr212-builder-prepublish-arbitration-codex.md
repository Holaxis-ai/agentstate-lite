---
type: Context Note
title: PR 212 Builder pre-publish arbitration
actor: codex-pr212-builder
timestamp: '2026-08-07T14:45:07.702Z'
---
# Summary

PR #212 Builder phase — pre-publish arbitration.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: replace PR #212's unsafe post-publication rollback with the frozen strict, root-scoped, pre-publish create-only state machine and deterministic regressions. This serves the ultimate goal by making unattended workspace creation predictable without deleting filesystem state the invocation cannot prove it owns.

Status: Builder phase in progress at starting SHA `81b3c39ff252013e318b1a714b63430a24074d70` in isolated worktree `/private/tmp/aslite-pr212-build` on branch `fix/pr212-prepublish-arbitration`.

Frozen constraints: reuse the core filesystem mutation lock; strict create-only observations; component-wise nonrecursive directory receipt; publish while locked; no post-publish isolation scan; zero product-tree deletion on create-only failure; preserve plain init and Recipe behavior.

## Expected-red evidence

Focused command at the unchanged starting product code after adding only the three regression tests:

`node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts`

Expected safety failures recorded in `/private/tmp/pr212-red.log`:

- pre-existing empty target preservation: RED because the verifier removed the target directory (`lstat` returned `ENOENT`);
- replacement index preservation: RED because the verifier unlinked the foreign replacement (`readFile` returned `ENOENT`);
- descendant observation uncertainty: RED because injected `readdir` `EIO` was swallowed and the verifier resolved successfully.

The focused file also had one unrelated harness failure because this fresh worktree had not yet built `packages/cli/dist/agentstate-lite.mjs`; that is not counted as safety evidence.

Next action: implement the frozen pre-publish state machine, expand deterministic state-machine coverage, and make focused source/built tests green.
