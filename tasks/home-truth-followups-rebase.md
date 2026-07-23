---
type: Task
title: Deliver Home truth fixes on current main
status: in_progress
priority: high
assignee: codex-main-home-truth-rebase
actor: codex-main-home-truth-rebase
timestamp: '2026-07-23T13:25:45.414Z'
---
# Goal

Rebase the already-reviewed Home truth fixes onto current origin/main, resolve integration conflicts without behavioral drift, pass the repository gate and independent exact-SHA review, and safely update the existing remote feature branch.

This serves the product goal by moving three correctness fixes into an integration-ready state while preserving the human merge gate.

# Delivery invariants

- Remote mode never renders local-only privacy onboarding, even with a non-null root.
- Git-only sharing changes are observed through bounded server-owned refresh timing without hosted polling.
- Failed Git discovery reports unavailable while a true non-repository remains private.
- Existing current-main behavior is preserved through conflict resolution.
- Update the existing branch with force-with-lease; do not create or merge a PR.

# Done when

- The branch is based on current origin/main and contains one coherent fix commit.
- Build, typecheck, focused regressions, and the unpiped repository gate pass.
- Independent review approves the exact pushed SHA.
- The shared bundle records the final SHA and evidence, and this task is done.
