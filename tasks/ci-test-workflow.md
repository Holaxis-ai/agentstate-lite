---
type: Task
title: >-
  CI test workflow on every PR + main (Node 20+25 matrix) — the repo currently
  has NO test CI
status: in_progress
priority: '1'
description: >-
  Part of plans/test-suite-confidence (Brian's suite-assurance program,
  2026-07-17). Read the plan doc for the full rationale and scope before
  claiming.
actor: claude-fable-5
assignee: claude-fable-5
timestamp: '2026-07-17T16:32:34.864Z'
---
Shipped to branch ci-test-workflow (commit e47e96a), PR pending human open/merge.

What shipped: .github/workflows/ci-tests.yml — the repo's first test CI. Runs on every pull_request and every push to main; ubuntu, Node {20, 25} matrix (fail-fast off). Setup steps (checkout, setup-node with npm cache, npm ci, playwright install --with-deps chromium in packages/ui) then ONE gate step: root 'npm run check' — the same command CLAUDE.md names as the pre-ship gate, so the CI surface cannot drift from the local one (the plan's parallel-surfaces class). check covers build, typecheck, all five workspace suites, test:scripts, verify:npm-package, check:skill, and the e2e chromium lane. Bot-owned drift gates (check:bundle/check:skill:bundle) deliberately excluded per CLAUDE.md.

Validation: 'npm run check' run in an isolated worktree on Node 25 — exit 0, all suites green incl. e2e (14 passed). Independent review of exact SHA e47e96a in a detached worktree: PASS, high confidence; its main adversarial hypothesis (no git identity on a bare runner breaks board-commit tests) was empirically REFUTED — full cli sync suite (47 tests) passes under GIT_CONFIG_GLOBAL=/dev/null with no GIT_AUTHOR_* (git auto-derives username@hostname identity when user.useConfigOnly is unset).

Honest caveats: Node 20 leg and ubuntu environment are validated only reasoned/by-review until the PR's own CI run — the first real run on the PR is the remaining empirical test. e2e + verify:npm-package execute on both matrix legs (deliberate: environmental coverage over CI minutes).
