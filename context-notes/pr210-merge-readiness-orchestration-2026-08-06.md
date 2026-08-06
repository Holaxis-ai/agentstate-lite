---
type: Context Note
title: PR 210 merge-readiness orchestration start
description: >-
  PR #210 now has tree-identical recovery-retrigger head bc4a59a; GitHub is
  throttling push/PR triggers during its Actions outage, so no hosted run exists
  and no merge was performed.
tags:
  - pr210
  - orchestration
  - hook-ownership
actor: codex-pr210-ci-retrigger
timestamp: '2026-08-06T21:46:09.879Z'
---
---
type: Context Note
title: PR 210 merge-readiness orchestration start
description: >-
  PR #210 carried from failing 4e394db through bounded repair, independent
  review, adversarial QA, exact Node 20/22/25/26 gates, and merge-ready handoff
  at 5a5a622; no merge performed.
tags:
  - pr210
  - orchestration
  - hook-ownership
actor: codex-pr210-orchestrator
timestamp: '2026-08-06T20:02:43.987Z'
---
# Summary

PR #210 merge-readiness orchestration started from exact changes-requested head `4e394db65346d957676e590d7ca287d20b39dafb` on branch `fix/pr207-hook-ownership-housekeeping`.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: close the two exact PR #210 blockers and carry one repaired SHA through independent review, adversarial QA, and repository/CI gates. This serves the ultimate goal by making the hook ownership boundary provably fail-closed without reopening previously rejected generic fallbacks.

## Repair contract

1. Reject noncanonical npm runtime/package path tokens, including dot segments and duplicate separators, before granting ownership. Add pure classification and freshly built Claude/Codex/OpenCode lifecycle tests proving byte-identical preservation.
2. Reconcile the supported local-dev installed-tarball authority with the writer/recognizer contract without restoring the unsafe generic npm fallback. Restore the complete installed-package proof and Node 22/26 repository gates.

The public review record is https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208268039.

## Pipeline and boundaries

Backbone: bounded sequential pipeline with Generator-Critic gates.

1. Independent implementation-plan and skeptic passes.
2. Fresh builder in isolated worktree `/private/tmp/aslite-pr210-repair.miXzoW/repo`.
3. Fresh exact-SHA reviewer; any blocker returns to a bounded repair loop.
4. Fresh adversarial QA only after review PASS.
5. Exact repository gate plus GitHub Node 20/22/26 checks.
6. Record merge-ready SHA and evidence; stop before merge.

Do not modify or merge `main`, broaden scope into unrelated hook design, weaken foreign-state preservation, or treat a focused green suite as a substitute for the installed-package and repository gates.

## Reproduced diagnostic baseline

In the isolated clean worktree, `npm ci` and the prerequisite `npm run build` pass. The subsequent `npm run verify:npm-package` fails at the installed package's `aslite hook install --scope project --json`, reproducing blocker 2 independently of CI.

An ad-hoc source probe at the same SHA proves that same-prefix npm pairs containing `/./`, `//`, or `/a/../` all classify as `current`. The independent skeptic found the same normalization-before-proof flaw in direct npm/local-dev/marketplace executable recognition and in Node launches for local-dev/marketplace entries. The repair invariant is therefore one bounded shared rule: every absolute runtime or executable token admitted as generated must already be in canonical lexical path form. This is a string-provenance check, not filesystem existence or `realpath` resolution; symlink policy remains unchanged. Any legitimate historical noncanonical spelling must be explicitly proven as writer output rather than accepted through normalization.

The local installed-tarball repair must preserve ordinary repository local-dev launches while using stable same-prefix npm evidence when a local-dev artifact is physically installed into the supported npm-global layout. It must not add a generic cross-prefix npm exception to the command recognizer.

## Final outcome

The bounded repair was committed and pushed at exact SHA `5a5a6229c840992e94cf26e91bd1f82b4bf18488`. Independent full-PR review passed with no P0/P1/P2 finding. Aggregate adversarial QA passed after the primary matrix and fresh OpenCode and installed-authority supplements closed every lifecycle leg; no foreign-state mutation or authority counterexample was found.

Repository execution passed at the exact SHA under Node 25.2.1, Node 22.23.2, and Node 26.7.0. The repository's exact Node 20.20.2 engines-floor smoke passed all eight commands. The complete installed-package and poisoned npm-environment proofs passed, plugin/tracked trees remained unchanged, and local/remote branch SHAs match.

GitHub did not enqueue an Actions suite for the automated branch push or the reversible close/reopen event. The PR nevertheless reports OPEN, MERGEABLE, and CLEAN with an empty check rollup; the active workflow's Node 20/22/26 commands were reproduced locally against the exact SHA using stable runtime layouts. This exception is disclosed in the final PR evidence rather than represented as a green hosted check.

Final evidence: https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208761858. Implementation, review, and local QA are complete; no merge was performed because Brian retains the merge gate.

## Hosted-CI dispatch diagnosis

Proximate diagnostic goal: determine why the final exact SHA lacks hosted CI and keep the merge claim aligned with observable evidence. This serves the ultimate goal by ensuring unattended installation safety is backed by the repository's normal external feedback loop, not only local reproduction.

The CI workflow at base SHA `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071` is active, Actions is repository-enabled, and `.github/workflows/ci-tests.yml` has an unrestricted `pull_request` trigger with no path filter. PR #210 is open, non-draft, mergeable, and clean. The final commit message contains no skip marker. GitHub recorded the `4e394db` -> `5a5a622` push at `2026-08-06T19:18:07Z` while the PR was open, and Cloudflare and Devin check suites were created for the new SHA at `19:18:08Z`, proving GitHub received and distributed the push event. However, the GitHub Actions app created no check suite or workflow run for `5a5a622`. GitHub also recorded a close at `19:25:22Z` and reopen at `19:25:28Z`, but no Actions run followed.

The previous head `4e394db` did receive CI run `31057746922` when the PR opened, so the workflow itself parses and is eligible on this PR. No `GH_TOKEN`/`GITHUB_TOKEN` or Actions environment was present in the local process, the branch push used a personal SSH key authenticated as `briand-ai`, and the push actor was the normal `briand-ai` account. Available repository APIs therefore rule out disabled Actions, an ineligible trigger, a path filter, draft state, a skip directive, an unreceived push, and recursive token suppression.

At Brian's direction, a tree-identical empty commit `caa94a061c0ecd60715ed886d4063a86b29675c3` (`chore: retrigger PR checks`) was created directly on top of reviewed SHA `5a5a622`. Both commits have tree `7279c8f2000508bbac363e109c7c12602ffd42e1`, and `git diff-tree` is empty. The push updated the PR head and synthetic merge ref. Cloudflare and Devin again created empty check suites at `2026-08-06T20:15:50Z`; Devin did not run a check or agent. GitHub Actions again created no suite. The manual dispatch endpoint was also attempted, but correctly returned HTTP 422 because this workflow does not declare `workflow_dispatch`.

The causal evidence is now definitive: GitHub's official status API reports an unresolved critical `Incident with Actions` beginning `2026-08-06T15:22:49Z`, with the Actions component in `major_outage`. The latest incident update says capacity is constrained and workflow runs may be delayed or fail. Git Operations and Webhooks remain operational, exactly matching the successful pushes/app notifications and missing Actions orchestration. Incident: https://stspg.io/rcz3fcm83sff

Until a hosted run is attached to the new exact SHA, describe the PR as locally gated and GitHub-mergeable, not as having passed hosted CI. Do not emit more commits during the outage. Monitor GitHub recovery and the new SHA for a delayed run; once Actions recovers, retrigger only if GitHub does not process the queued synchronization.

A continuous read-only monitor ran from `2026-08-06T20:19:45Z` through `20:50:04Z`. Every official status sample remained `major_outage`; no Actions run appeared for `caa94a0`. At the boundary the PR was still OPEN, MERGEABLE, CLEAN, and unmerged, with an empty check rollup; the local branch matched origin and remained clean. Leave the task `in_progress` pending external recovery. The next continuation should first inspect the official incident and exact-SHA run list. If Actions is operational but no delayed run exists, create one fresh synchronization event only, then monitor the hosted jobs through completion.

During reported partial recovery Brian authorized one further attempt. The workflow has no `workflow_dispatch`, so the GitHub UI cannot run it for the current SHA; rerunning run `31057746922` would test old SHA `4e394db`. Empty commit `bc4a59ae20af3ac1ac0a7c78bb59be8027f6c94e` (`chore: retry PR checks during Actions recovery`) was created on `caa94a0` and pushed at `2026-08-06T21:44:36Z`. Parent and child have identical tree `7279c8f2000508bbac363e109c7c12602ffd42e1`, and `git diff-tree` is empty. GitHub updated PR/app state but again created no Actions suite. The latest official incident update explains that webhook triggers remain throttled and many push/PR events are not triggering workflows; the earlier 65% figure applies only to already queued jobs, while only about 15% of webhook triggers were being processed. Do not push another outage-era commit. Current exact PR head is `bc4a59a`; wait for trigger throttling to end, then emit at most one recovery synchronization if no delayed run exists.

[tracks](../tasks/hook-compatibility-ownership.md)
