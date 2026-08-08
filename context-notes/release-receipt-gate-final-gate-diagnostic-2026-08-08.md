---
type: Context Note
title: P5A exact-SHA repository gate diagnostic
actor: openai/codex
timestamp: '2026-08-08T17:48:34.029Z'
---
# Summary

Status: resolved. Confidence: high.

Ultimate goal: make agentstate-lite a dependable shared knowledge substrate while enabling safe protected npm distribution with human-controlled publication.

Proximate goal: obtain an honest repository-gate result for exact reviewed and QA-approved SHA `25a33930ca978e400cc19f6bc53cccb3de436e91`, then publish only the feature branch so P5A can enter the human-owned PR merge gate. This serves the ultimate goal by preventing unverified release-finalization mechanics from advancing on the npm critical path.

Progress: Build, exact-SHA Review, targeted adversarial QA, and the repository gate are complete. The reviewed branch is pushed; Brian's human PR/merge gate remains.

## Whole-system model

The repository gate is a root-level command that builds all workspaces, typechecks, runs the workspace and script suites, proves the installed npm tarball, and checks npm-target skill drift. Output is redirected to `/private/tmp/receipt-final-check.log`; success is determined only from the command's own exit code. The active gate process is a Node test runner over the CLI test inventory. Its long-lived child is executing `packages/cli/test/serve.test.ts`, whose tests create and stop local reference-server processes and therefore depend on child-process lifecycle, loopback ports, timers, and open-handle cleanup. The P5A delta itself changes only release scripts and the release-finalize workflow, not CLI server code.

## Observed state

- Exact candidate: `25a33930ca978e400cc19f6bc53cccb3de436e91`; current main `56b5693d` is an ancestor.
- Feature worktree: `/Users/brian/GitHub/agentstate-lite/.claude/worktrees/receipt-gate-build`.
- Gate session id: `80621`.
- The log reached 122846 bytes and then remained unchanged for more than 12 minutes.
- Process inspection showed the root CLI test runner PID `91568` and long-lived child PID `99454` running `packages/cli/test/serve.test.ts` for more than 13 minutes.
- The bounded failure tail exposed the shared cause: every affected remote/UI-server test failed
  with `listen EPERM: operation not permitted 127.0.0.1`; the sandbox disallowed the loopback
  listeners the test harness requires.
- The owned failed run was stopped. The same unmodified exact SHA then ran the same root
  `npm run check` outside the listener-restricted sandbox and exited 0.
- The branch was pushed with an exact force-with-lease from remote tip `4b905b3f` to
  `25a33930ca978e400cc19f6bc53cccb3de436e91`.

## Diagnosis and next action

The initial lifecycle-hang hypothesis was corrected by the failure evidence: the environment denied
all loopback listener creation, causing many unrelated server-backed suites to fail and leaving the
CLI test child alive. The successful unrestricted rerun verifies this was environmental and not a
P5A regression. Next: Brian opens and owns the PR/merge gate, explicitly checks the two intended
allowed-signer key lines, and may invite an external-team review. After merge, P5A can close and P5B
can be claimed.

## Critical-path state

P5A remains `in_progress`. The durable dependency chain is P5A -> P5B -> P5S -> continuous staging. No downstream task is authorized to bypass the exact-SHA Review -> QA -> repository-gate order.
