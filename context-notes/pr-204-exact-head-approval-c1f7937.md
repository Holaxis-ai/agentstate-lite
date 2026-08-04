---
type: Context Note
title: PR 204 exact-head independent approval at c1f7937
description: >-
  Canonical current PR 204 review: exact head c1f7937 approved; three minor
  notes are explicitly non-blocking and pre-live hardening stays out of merge
  scope.
actor: codex-pr204-scope-auditor
timestamp: '2026-08-04T19:12:00.000Z'
---
# Summary

PR 204 exact head `c1f7937c4231087956d7a6cd881671ca7f057491` received an independent supply-chain-tier review verdict of **Approve** in GitHub issue comment `5183476281` on 2026-08-04. The reviewer read the full diff, used an isolated exact-SHA worktree, ran `npm ci` and a root build, reran all six release suites (54/54), executed independent adversarial probes, and confirmed the exact-head CI gates green.

This supersedes the changes-requested review of `631c39cf07a8230e5ecb99aeda307ac4e02f60dd`. The GitHub `reviewDecision` field remains empty because the approval was posted as an issue comment rather than a formal review event; the comment's textual verdict is unambiguous.

## Accepted safety claims

- Inert by default: tag-triggered mode is dry-run and every live mutation independently requires `ASLITE_RELEASE_LIVE_ENABLED=true` from the release environment.
- Shell-safe: workflow expressions enter shell only through environment variables; operations are validated argv arrays executed with `execFile`, and injection probes failed before argv construction.
- No rebuild after candidate: retained-tarball verification cannot build/pack, the manifest is mandatory, and finalizers verify candidate bytes, artifact metadata/source SHA/expiry, dispatch inputs, and draft assets before mutation.

## Non-blocking notes

1. `release-candidate.mjs` re-declares build identity and compatibility contracts instead of reading the built artifact's `version --json`. Drift currently fails closed; consolidating authority is a future simplification, not a PR 204 merge condition.
2. A small clean-tree-check/build TOCTOU remains on a fresh CI checkout. The reviewer explicitly noted it for completeness and requested no change.
3. The build-once test has confusing fresh-worktree ergonomics when sibling workspace distributions are absent. A root build resolves it; improving the skip diagnostic is optional follow-up work.

Existing `tasks/p5a-pre-live-hardening` remains the authority for the leading-dash argument gap and signed inspection/approval ordering. Those items must land before live enablement but are not merge blockers for this code-only, no-live PR.

## Routing rule

Do not launch another full PR 204 review at this exact head and do not absorb compaction T3.5 or pre-live hardening into this PR. If the head remains `c1f7937`, the next gate is Brian's merge decision. If code changes, review only the exact delta and the safety claims it can affect; do not reopen already-proven areas without a concrete regression trace.

Ultimate goal: agentstate-lite is a dependable, distributable local-first coordination substrate whose releases are reproducible and fail closed.

Proximate goal: carry the independently approved code-only release-automation head through Brian's merge gate without expanding scope; this serves the ultimate goal by shipping the verified retained-artifact release rail before optional simplification and pre-live activation work.

GitHub review comment: https://github.com/Holaxis-ai/agentstate-lite/pull/204#issuecomment-5183476281

[supersedes](pr-204-codex-review-orientation.md)

[reviews](../tasks/npm-staged-release-automation.md)
