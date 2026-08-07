---
type: Context Note
title: PR 212 Builder pre-publish arbitration
actor: codex-pr212-builder
timestamp: '2026-08-07T15:09:17.670Z'
---
# Summary

PR #212 Builder phase is complete at exact commit `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d` on `fix/pr212-prepublish-arbitration`. The worktree is clean and the commit was not pushed.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: replace PR #212's unsafe post-publication rollback with the frozen strict, root-scoped, pre-publish create-only state machine and deterministic regressions. This serves the ultimate goal by making unattended workspace creation predictable without deleting filesystem state the invocation cannot prove it owns.

## Result Envelope

- Status: COMPLETE
- Commit: `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d`
- Branch/worktree: `fix/pr212-prepublish-arbitration` at `/private/tmp/aslite-pr212-build`
- Summary: create-only now shares a physical-root external same-user mutex, strictly re-resolves and revalidates while locked, creates path components nonrecursively with an exact diagnostic receipt, publishes `index.md` while locked, and never performs product-tree cleanup. Plain init and Recipe ordering/application remain outside this policy change.
- Evidence: deterministic red baseline at `81b3c39`; focused CLI 35/35; focused core 1/1; full core 399/399; full CLI 1315/1315; root build/typecheck green; generated skill check green; exact clean-SHA installed-package proof green.
- Risks: conservative POSIX host-global create-only serialization; guarantee is scoped to cooperating same-user processes on a coherent local filesystem; raw writers can still mutate paths but are never deleted; failed publication may retain reported empty directories; release uncertainty after publication requires inspecting both lock and target.
- Next recommendation: independent Reviewer must inspect exact SHA `12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d`, probe at least one regression red against `81b3c39`, and approve before adversarial QA starts. Any product-code change restarts the exact-SHA gate.

## Changed files

- `packages/cli/src/bundle.ts`: replaced assert/claim/post-CAS verifier lifecycle with strict probes, physical-root lock-key derivation, component receipt creation, and one pre-publish coordinator; old verifier and all create-only deletion calls are gone.
- `packages/cli/src/commands/init.ts`: create-only routes publication through the coordinator; plain init remains direct/open-or-create; Recipe application remains after publication and lock release; help reports retained directory residue truthfully.
- `packages/core/src/index.ts`: exports the existing filesystem mutation-lock authority and types for internal workspace reuse.
- `packages/core/src/backend.ts`: expected-version observation maps only explicit file absence to `null`; other read failures propagate.
- `packages/cli/test/init-create-only.test.ts`: replaces verifier scaffolding with deterministic mutex barriers, strict fault tables, replacement preservation, exact receipt/residue, compatibility, and no-deletion coverage.
- `packages/core/test/filesystem-expected-version.test.ts`: pins fail-closed expect-absent observation on injected `EIO`.
- `packages/cli/src/reference.ts` and generated `packages/cli/SKILL.md`: make runtime residue behavior truthful.

## Expected-red evidence at starting SHA

After adding only the first three regression tests to unchanged product code at `81b3c39ff252013e318b1a714b63430a24074d70`:

`node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts`

- Pre-existing empty target preservation: RED because the verifier removed the target directory (`lstat` returned `ENOENT`).
- Replacement index preservation: RED because the verifier unlinked the foreign replacement (`readFile` returned `ENOENT`).
- Descendant observation uncertainty: RED because injected `readdir` `EIO` was swallowed and the verifier resolved successfully.
- One additional dist-missing harness error was setup noise from the initially unbuilt fresh worktree and was not counted as safety evidence.

Red log: `/private/tmp/pr212-red.log`.

## Green verification

- `npm run build` — exit 0 before commit; repeated after commit so built identity is exact SHA.
- `npm run typecheck` — exit 0.
- `node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/filesystem-expected-version.test.ts` — 1 passed, 0 failed.
- `node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts` — 35 passed, 0 failed after the final source change and root build. This includes four deterministic parent/child mutex schedules (parent-first/child-first × ordinary/conventional child), replacement/no-deletion tables, strict fault injection, and built-CLI process coverage.
- `npm test -w @agentstate-lite/core` — 399 passed, 0 failed with loopback permission enabled. The sandboxed attempt had only two `listen EPERM 127.0.0.1` environmental failures; the permitted rerun passed.
- `npm test -w @holaxis/aslite` — 1315 passed, 0 failed with loopback permission enabled.
- `npm run verify:npm-package` — exact post-commit local package passed: 30 files, zero runtime dependencies, both bins, offline workflow, `source commit=12dd30b73642b8bf1c0e94ce9f9619afd08d7d1d`, `dirty=false`.
- `npm run check:skill -w @holaxis/aslite` — exit 0.
- `git diff --check` and scoped secret-pattern scan — clean.

## Scope and residual risk

The product diff is restricted to create-only policy, its core lock/CAS authorities, tests, and directly generated/help text. No quickstart, release, plugin artifact/manifest, hook, sync, MCP, View, or unrelated architecture file changed. The former create-only block was removed rather than retained in parallel. There is no create-only call to `unlink`, `rmdir`, `rm`, or quarantine `rename`.

Empty directories in `residual_created_directories` are deliberately retained. A lock-release error after successful publication reports `publication_outcome: published`; it does not claim that no bundle exists. The mutual-exclusion proof does not cover other OS users, non-cooperating raw filesystem writers, or incoherent network filesystem caching, matching the frozen threat boundary.
