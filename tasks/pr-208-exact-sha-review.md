---
type: Task
title: Review PR 208 rollback-aware supported release checks
status: done
priority: '1'
assignee: codex-pr208-review
description: >-
  Exact-SHA review complete at 31ba3ab: CHANGES REQUESTED for uncancelled early
  HTTP bodies plus the stale help-integration gate failure.
actor: codex-pr208-review
timestamp: '2026-08-05T17:09:39.454Z'
---
# Goal

Independently determine whether PR 208 exact head `31ba3abe32ea69c62bcc349d44e9ece9d2d839d7` implements a rollback-aware, fail-closed, read-only supported-release check whose structured output and emitted commands remain trustworthy under hostile registry behavior. This serves the ultimate agentstate-lite goal by making npm distribution a durable support contract without introducing hidden mutation or unsafe update advice.

# Exact scope

- PR: https://github.com/Holaxis-ai/agentstate-lite/pull/208
- Base: `8d0253a40bc00f9c7997e177a70b21f829769e8e` (`main` at the review request).
- Head: `31ba3abe32ea69c62bcc349d44e9ece9d2d839d7`.
- Clean builder worktree: `/private/tmp/aslite-supported-release.H860lp` on `feat/supported-release-check`; reviewer must confirm it remains clean and exact before using it.
- Product task: `tasks/supported-release-check`.
- Normative inputs: `plans/version-string-channel-identity` and `designs/version-update-protocols`.

# Review model

- **Selected release:** the exact version named by the requested npm dist-tag; SemVer maximum is not policy authority.
- **Running identity:** complete local build/runtime identity that must survive every available and unavailable projection.
- **Trust boundary:** one bounded public-registry response with strict package, version, integrity, deprecation, redirect, size, and time validation.
- **Actionability:** version-pinned install and post-install verification commands whose bytes and semantics match the selected release.
- **Mutation boundary:** the check may read the network and emit output only; it must not write npm, host integrations, preferences, or bundle state.

# Acceptance review

Audit the exact diff and surrounding command/identity code against the normative U3 schema and precedence. Inspect CI failures before rerunning tests. Sample the builder's focused suite and add only bounded adversarial probes for untested trust-boundary behavior. Verify literal emitted commands where feasible. Do not edit source or post GitHub comments.

# Deliverable

Record a findings-first PASS or CHANGES REQUESTED note for exact head `31ba3ab`, close this review task, and sync the board. Preserve the user's unrelated main-checkout `CLAUDE.md` modification.

# Outcome

Completed at exact head `31ba3abe32ea69c62bcc349d44e9ece9d2d839d7` with verdict **CHANGES REQUESTED**. One high-severity resource-boundary defect survived: early HTTP/redirect/declared-oversize failures do not cancel the response body, allowing network activity beyond the total timeout and byte cap. One medium mechanical gate defect also survived: the help integration test still expects the old version synopsis, leaving Node 22/26 CI red. Focused tests passed 26/26, `git diff --check` passed, Node 20 smoke passed, and the review worktree remained clean. Full evidence is in `context-notes/pr-208-exact-sha-review-31ba3ab`.
