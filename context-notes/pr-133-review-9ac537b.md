---
type: Context Note
title: 'PR #133 exact-SHA repair review — 9ac537b'
actor: codex-reviewer-9ac537b
timestamp: '2026-07-21T13:45:51.062Z'
---
# Summary

Independent exact-SHA review completed for `9ac537be28bb627656f5328e06929f496ad80aac` (parent `fc9474c7b7d1cfa64002f4b1ccc8c66f0dc38e1f`).

Ultimate goal: preserve agentstate-lite as truthful, conflict-safe shared memory visible to humans.

Proximate goal: independently determine whether this commit fully repairs canceled-task visibility, arbitrary valid concept-id indexing, and action-outcome styling without weakening the original hard-CAS journey.

Progress: complete.

# Verdict

PASS, high confidence. No review findings.

# Findings

- Canceled Tasks now remain in the projection and render in a fifth lifecycle column; the existing Reopen action is reachable and summary/card totals agree for valid Task instances.
- All three relationship indexes that accept bundle concept IDs use null-prototype dictionaries, so inherited JavaScript property names cannot corrupt refresh.
- `cancelled` and `unchanged` are the only non-committed neutral outcomes; every other terminal status, including `conflict`, `revoked`, `expired`, `rejected`, and `failed`, follows the error path.
- The expanded regression journey directly exercises canceled visibility/Reopen/cancel styling, unchanged styling, and a valid `constructor` dependency; it retains the original trusted-shell confirmation, persisted status, and actor assertions.
- The diff is limited to the board HTML, its E2E seed, and its E2E journey. Existing escaping remains intact; no external dependency, protocol, distribution, or portability surface changed.

# Empirical evidence

- Detached worktree HEAD exactly `9ac537be28bb627656f5328e06929f496ad80aac`; exact parent verified; three-file diff; `git diff --check` passed; worktree remained clean.
- Fresh `npm ci`: exit 0.
- Root `npm run build`: exit 0.
- Focused Personal Task System recipe plus distribution checks: 26/26 passed.
- Shell/action unit sample: 12/12 passed.
- Expanded Personal Task System Playwright Chromium spec: 1/1 passed.
- Builder full-gate construction audited from root/package scripts and the solitary gate log: `npm run check` includes build, typecheck, all workspace tests, script tests, npm-package proof, skill drift check, and the 16-test Chromium gate; the log records 16/16 Chromium passing. The full gate was not redundantly rerun.
- Parent-red probe: the current adversarial seed with only the parent board HTML produced 0 cards, left the summary at `Connecting to the bundle…`, and surfaced `Could not read the bundle: dependenciesByTask[edge.from].push is not a function`.
- Additional current-SHA prototype-key probe exercised Project id `constructor` and Task ids `toString` and `__proto__`; all seven cards rendered, Project grouping resolved, and both dependency counts rendered.

No QA-blocking issue was found; the exact SHA is ready for the next gate.
