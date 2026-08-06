---
type: Context Note
title: PR 210 merge-readiness orchestration start
description: >-
  PR #210 implementation, exact-SHA review, aggregate QA, and local Node
  20/22/25/26 gates passed at 5a5a622; GitHub received the push but omitted the
  Actions dispatch, so hosted CI remains absent and no merge was performed.
tags:
  - pr210
  - orchestration
  - hook-ownership
actor: codex-pr210-ci-diagnosis
timestamp: '2026-08-06T20:13:24.334Z'
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

The previous head `4e394db` did receive CI run `31057746922` when the PR opened, so the workflow itself parses and is eligible on this PR. No `GH_TOKEN`/`GITHUB_TOKEN` or Actions environment was present in the local process, the branch push used the repository's SSH remote, and the push actor was the normal `briand-ai` account. Available repository APIs therefore rule out disabled Actions, an ineligible trigger, a path filter, draft state, a skip directive, an unreceived push, and the usual recursive `GITHUB_TOKEN` suppression. They do not expose the internal Actions event-delivery reason. The remaining evidence supports a GitHub-side Actions dispatch omission/transient failure, but that causal label is an inference rather than a provable API field.

Until a hosted run is attached to the final tree, describe the PR as locally gated and GitHub-mergeable, not as having passed hosted CI. A tree-identical empty commit pushed to the PR branch is the least invasive new `synchronize` event if Brian asks to retrigger; it changes the exact SHA and therefore requires final SHA bookkeeping, but not a new semantic review of the tree.

[tracks](../tasks/hook-compatibility-ownership.md)
