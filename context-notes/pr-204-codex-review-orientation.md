---
type: Context Note
title: 'PR #204 Codex review — changes requested'
actor: codex-reviewer
timestamp: '2026-08-03T23:48:48.075Z'
---
# Summary

Exact SHA reviewed: `631c39cf07a8230e5ecb99aeda307ac4e02f60dd` for `tasks/npm-staged-release-automation` (P5A).

Ultimate goal: make agentstate-lite a dependable, distributable local-first coordination substrate whose release behavior is reproducible and fail-closed.

Proximate goal: independently determine whether PR #204 safely implements the code-only retained-artifact staged-release unit; this serves the ultimate goal by preventing ambiguous or unsafe npm release automation from entering main.

Verdict: CHANGES REQUESTED. The focused repository suite passes 112/112 and all GitHub checks pass, but source-shape tests miss multiple workflow/runtime and provenance blockers.

# Blocking findings

1. Workflow-dispatch values are interpolated directly into Bash in `release-finalize.yml`. GitHub substitutes expressions before shell execution, so Node-side validation happens too late and command-substitution or quote-breaking payloads execute first. Bind every input/output through step `env:` and reference only shell variables; add a workflow-source injection test.
2. The downstream staged workflow jobs are not executable on fresh GitHub runners. `stage` never checks out the repo but runs `npm ci` and `scripts/release-emit-receipt.mjs`; `draft` also lacks checkout or `GH_REPO` while using `gh release`. In addition, stage pins Node 20, while npm staged publishing requires Node >=22.14 and npm >=11.15. Pin/install a compatible npm toolchain and test the jobs from artifact-only fresh workspaces.
3. The npm staged-publish receipt contract is wrong. npm 11.15 emits `staged with id <uuid>` in text or `stageId` in JSON, neither of which matches the current `stage[ _-]?id` regex. `npm stage download` has no `--out` option and writes `<safe-name>-<version>-<stage-id>.tgz`, so the emitted checksum commands target a nonexistent filename. Use `--json` for staging and derive or discover the documented download filename.
4. The finalizer does not enforce the claimed immutable identifier chain. `artifact_id` and `stage_id` are accepted but never consumed; the staged workflow never emits a draft release ID or asset IDs/digests; finalization checks only draft flag/tag and never re-verifies mutable draft assets. Registry verification prints packument integrity but never compares it with `candidate.json`; `npm audit signatures --package` is not the documented exact-package signature flow and runs before the target is installed. Wire the prepared/staged/draft receipts through and compare actual registry and GitHub asset facts before publication.
5. Cross-run artifact download lacks `actions: read`. The finalizer sets all unspecified permissions to none and grants only `contents: read`, then supplies `github-token` and `run-id` to download another run. Add `actions: read` and download by the dispatched immutable artifact ID, not merely its name.
6. The claimed pre-P5S disarm is false. GitHub automatically creates a referenced missing environment with no protection rules. Because `mode=live` is already dispatchable, absence of `release` does not block the jobs. Add an independent fail-closed enablement/preflight condition; do not use environment nonexistence as a safety gate.

# Additional safety findings

- `release-candidate --out` is passed directly to recursive `rm`; values such as `.` or a source directory can erase the checkout. Require an owned/safe output directory and refuse ancestors or non-owned nonempty targets.
- `createReleaseCandidate` records the supplied commit with `dirty:false` without verifying HEAD or worktree cleanliness. Verify source facts before any generated build writes and reject a mismatch.

# Verification

- `git diff --check origin/main...631c39c`: pass.
- `npm run test:scripts`: 112 tests passed.
- GitHub CI: node 20 smoke, node 22 gate, and node 26 gate all passed.
- Platform contracts checked against current official GitHub Actions documentation and npm CLI 11.15.0 source/docs.

[reviews](../tasks/npm-staged-release-automation.md)
