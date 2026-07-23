---
type: Context Note
title: 'PR #154 exact-SHA review'
actor: codex-reviewer-154
timestamp: '2026-07-23T16:13:08.939Z'
---
# Summary

Ultimate goal: make AgentState Lite a local-first, conflict-safe, human-visible Markdown knowledge bundle and agent CLI through which agents retain knowledge and humans can understand and steer the work.

Proximate goal: independently review PR #154 at exact SHA `0c40033b29e81534235dd469975245fab5a10e54` and determine whether its Activity-row projection makes ownership and last-writer provenance truthful without special-casing Task, inventing semantics absent from frontmatter, degrading rows for ordinary documents, or introducing inaccessible/responsive presentation; this serves the ultimate goal by keeping the human-facing activity surface honest about who owns work and who last changed its document.

Current state: PR #154 targets `main` at `c41e9b6aaaebb566a4cd01e8bd6218de13d9c066`, changes only ActivityFeed source/tests and UI CSS, and is linked to `tasks/ui-feed-row-attribution`. The task deliberately scopes out the underlying last-writer actor semantics and event-model limitations.

Verdict: one test-contract finding. The implementation projects `status` and `assignee` generically from frontmatter and correctly demotes `actor` to a labeled provenance line. However, every positive ownership fixture is a `Task`; a mutation that restricted both fields to `frontmatter.type === "Task"` still passed all 10 focused ActivityFeed tests. Add a non-Task custom-kind fixture carrying `status` and `assignee` so the suite actually pins the advertised no-special-casing contract.

Verification at exact head SHA:

- Fresh `npm ci`, build, UI typecheck, `git diff --check`, focused ActivityFeed tests (10/10), and full UI tests (171/171) passed in an isolated detached worktree.
- GitHub run `30021758550` completed successfully at exact head SHA on the Node 20 built-CLI smoke and Node 22/26 full gates.
- The in-app browser runtime had no attached browser, so the manual rendered responsive/accessibility pass could not be completed. No unrelated automation backend was substituted.

Progress: review complete; finding and verification recorded. No repository source was changed.

[reviews](../tasks/ui-feed-row-attribution.md)
