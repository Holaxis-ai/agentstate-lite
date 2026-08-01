---
type: Context Note
title: 'Dedicated QA: PR 183 fixes 0bd2f17 — PASS'
description: >-
  Exact-SHA F1-F6 QA passed with dirty/local, clean/release, marketplace
  convergence, launch, manifest, and preservation evidence.
actor: build-identity-qa
timestamp: '2026-08-01T00:20:57.307Z'
---
# Summary

PASS. Dedicated adversarial QA found zero blocking findings at exact reviewed commit `0bd2f174e2f338972b8dac35d266f2d81ddc6d23` (parent `d5d2f3f2dd37472f612e5b287f449a1c0b942285`). The F1-F6 repair behaves as designed, the requested package version is `0.1.0-pre.2`, and the isolated worktree plus all bot-owned outputs were unchanged after QA.

# Scope and setup

- Detached clean worktree at exact SHA `0bd2f174e2f338972b8dac35d266f2d81ddc6d23`.
- Lockfile install: `npm ci` succeeded.
- `git diff --check 0bd2f17^ 0bd2f17` succeeded.
- Bot-owned marketplace manifests, SKILL.md, executable, and complete references tree were snapshotted by tracked blob hash and mode before testing.
- Unrelated network-dependent external core/server package-consumer tests were intentionally excluded from this dedicated F1-F6 gate; the primary agent owns the full repository gate.

# F1 — local versus release package proof: PASS

Direct dirty/untracked local proof:

- Added one untracked root probe.
- `npm run verify:npm-package -- --json` exited 0.
- Installed artifact reported `@holaxis/aslite@0.1.0-pre.2`, channel `local-dev`, source commit `0bd2f174e2f338972b8dac35d266f2d81ddc6d23`, and `dirty:true`.
- The complete offline install workflow and both `aslite` / `agentstate-lite` bins passed.

Direct strict-release refusal on the same kind of dirty tree:

- `npm run verify:npm-package:release` exited 1.
- Error reported the observed exact commit and `dirty=true`, then directed ordinary verification to `local-dev` or release preparation to commit/stash/remove changes.

Exact-clean release proof:

- `npm run verify:npm-package:release -- --json` exited 0.
- Installed artifact reported package `@holaxis/aslite@0.1.0-pre.2`, channel `npm-package`, exact source commit `0bd2f174e2f338972b8dac35d266f2d81ddc6d23`, `dirty:false`, matching adjacent version, both aliases, and the complete offline workflow.

Outside-Git proof:

- Exported the exact commit without `.git`, ran `npm ci`, then `npm run verify:npm-package -- --json`.
- It exited 0 and honestly reported `local-dev` with `commit:null` and `dirty:null`.

# F2 — writer/checker round trip: PASS

From the clean exact-SHA worktree:

1. `npm run build:plugin-bundle` succeeded and made only the expected bot-owned SKILL.md and executable dirty.
2. Without cleaning those changes, `npm run check:plugin-bundle` exited 0.
3. Skill projection was current and the normalized executable comparison reported the bundle up to date.

This reproduces the original failure shape and proves the repair.

# F3/F4 — selective bump and structural convergence: PASS

`npm exec -- node --test --test-concurrency=1 scripts/bundle-identity-comparison.test.mjs scripts/ci-version-bundle.test.mjs scripts/dev-build-no-plugin-writes.test.mjs scripts/verify-npm-package.test.mjs` passed 35/35.

Relevant evidence:

- Provenance-only commit/dirty changes normalize equal, restore the prior executable bytes, leave both manifests unchanged, and return no-op.
- Executable code drift stays unequal and bumps both manifests exactly once.
- A second run on the prior generated result converges to a no-op.
- The real repository regeneration path bumps for actual stale content and then converges.
- Missing, malformed, and duplicate identity markers fail closed; package name/version, channel, code, skill, and references changes remain significant.
- Root/default builds leave bot-owned marketplace paths untouched.
- Workflow assertions retain actor filtering only as an optimization and document actor-independent structural convergence.

# F5 — launch precedence: PASS

`npm exec -- node --test --test-concurrency=1 --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/build-identity.test.ts ./packages/cli/test/version.test.ts` passed 12/12.

The adversarial launch matrix proves:

- A managed PATH executable remains certain `path` even with leaked `npm_command=exec`.
- A physical `_npx` cache executable remains inferred `npx-inferred`.
- Direct executable evidence remains certain and precedes environment-only npm inference.
- Source and unknown cases retain their lower-confidence classifications.

# F6 — manifest package identity: PASS

- Source inspection confirms the bundler reads and validates `name` and `version` together from `packages/cli/package.json`.
- Parser tests accept a valid renamed npm package and reject malformed names.
- In a disposable no-Git source export, changed only the manifest name to `@holaxis/aslite-qa-renamed`, then used the supported npm workspace build. The built executable's JSON identity reported package name `@holaxis/aslite-qa-renamed`, version `0.1.0-pre.2`, proving the builder is manifest-backed rather than hardcoded.
- `npm run typecheck -w @holaxis/aslite` passed.

# Preservation and final state

After the writer/checker exercise, only the exact generated QA outputs were restored in the detached test worktree. Final evidence:

- `git status --short --branch` printed only `## HEAD (no branch)`.
- `git diff --check` passed.
- Pre/post tracked blob hashes and file modes match exactly for both plugin manifests, SKILL.md, the executable, and every references file.
- The executable retained mode `100755`; other bot-owned files retained `100644`.
- The shared feature branch was never edited.

# Verdict and goal progress

Dedicated QA gate: **PASS**, zero blockers.

The proximate QA goal is complete: exact commit `0bd2f17` independently proves honest dirty/unknown local identity, strict clean release identity, normalized-but-fail-closed marketplace comparison, selective one-time version bumps, structural convergence, correct launch precedence, and manifest-backed package identity. This serves the ultimate project goal by preserving exact supportable executable identity without degrading local development or marketplace production feedback loops.

[task](../tasks/version-build-identity.md)

[repair plan](../plans/version-build-identity-pr183-review-fixes.md)

[approved code review](version-build-identity-code-review-orientation-0bd2f17.md)
