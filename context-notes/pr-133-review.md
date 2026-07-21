---
type: Context Note
title: 'PR #133 independent review'
actor: codex-reviewer
timestamp: '2026-07-21T13:06:49.364Z'
---
# Summary

Independent review of PR #133 at exact SHA `fc9474c7b7d1cfa64002f4b1ccc8c66f0dc38e1f` found three reproducible View defects. Verdict: CHANGES REQUIRED.

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe memory through which agents retain and share knowledge.

Proximate goal achieved: evaluate whether PR #133 safely adds the human-facing Personal Task System board while preserving instance-free installation, shared human-agent visibility, the trusted-shell/hard-CAS boundary, robust rendering, and canonical portable references.

# Findings

1. Canceled Tasks are counted but completely unreachable. `filtered()` drops every `status: canceled` row, although `primary()` defines a Reopen action for canceled Tasks. Chromium reproduction: after adding a fifth canceled Task, the summary reported 5 Tasks, only 4 cards rendered, and the canceled Task could not be found. This hides agent/CLI cancellations from the human and makes the Reopen branch dead.
2. Valid concept IDs can break the entire initial refresh. `dependenciesByTask` is an ordinary object indexed by arbitrary edge source IDs. A valid Task with id `constructor` and a `depends on` edge resolves the inherited constructor instead of an owned array; `.push` throws. Chromium reproduction left the board on “Reading your work…” with “push is not a function.” Use null-prototype dictionaries or Maps for bundle-controlled keys.
3. Canceling a trusted-shell proposal is rendered as an error. The shell returns `status: cancelled`, while the View checks for the nonexistent `canceled` spelling. Chromium reproduction showed `Change cancelled.` with class `toast show error`. Handle the actual terminal statuses explicitly; `cancelled` and `unchanged` should be neutral.

# Evidence

- Exact-SHA GitHub CI run 29783633363: Node 20 built-CLI smoke and Node 22/26 full `npm run check` jobs all passed.
- Detached worktree: `npm ci`, root `npm run build`, focused Personal Task System + skill-distribution tests 26/26, shell/action unit sample 12/12, and the committed Personal Task System Chromium journey 1/1 passed.
- One-off Chromium probes 4/4 reproduced the three findings and confirmed that priority, assignee, and due edits commit through trusted shell confirmation; adversarial assignee HTML remained text with no injected element.
- `git diff --check` passed. No code was changed.
- The in-app browser runtime exposed no browser binding in this session; this was an environmental capability gap. Real Playwright Chromium remained available outside the macOS process sandbox and supplied the empirical UI evidence.

# Next

Fix the three findings, add regression coverage for canceled visibility, safe bundle-key indexing, and cancellation result styling, then request exact-SHA re-review.
