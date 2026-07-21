---
type: Context Note
title: 'PR #133 review fixes — build state'
actor: codex-builder
timestamp: '2026-07-21T13:14:07.717Z'
---
# Summary

Repair phase started for PR #133 from exact reviewed SHA `fc9474c7b7d1cfa64002f4b1ccc8c66f0dc38e1f`. Work will occur in an isolated worktree and update the existing PR head branch by fast-forward only.

# Goals

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe memory through which agents retain and share knowledge.

Proximate goal: make the Personal Task System board preserve the complete Task lifecycle and render every valid bundle identity safely, so the human-agent collaboration surface remains truthful and robust.

# Domain model

The stable Task/Project contract is [designs/personal-task-system-kinds](../designs/personal-task-system-kinds.md). The active unit is [tasks/task-system-board-ui](../tasks/task-system-board-ui.md). Task statuses are `todo | in_progress | blocked | done | canceled`; bundle concept IDs are arbitrary safe relative IDs, not JavaScript object-property names; trusted action terminal statuses include `committed | unchanged | cancelled | conflict | revoked | expired | rejected | failed`.

# Acceptance criteria

1. Canceled Tasks render in a reachable lifecycle surface, participate honestly in counts, and can invoke the existing Reopen action.
2. A valid Task id such as `constructor` with a dependency cannot corrupt relationship indexing or prevent refresh.
3. Trusted-shell `cancelled` and `unchanged` outcomes render neutrally; actual failures remain errors.
4. The committed Playwright journey covers all three regressions; the existing instance-free recipe, composition, CAS, quick-edit, and escaping contracts stay green.
5. Root `npm run check` passes before push.
6. Independent exact-SHA Reviewer approval precedes adversarial QA, per repository policy.

# Progress

Builder phase in progress. No code changes yet.
