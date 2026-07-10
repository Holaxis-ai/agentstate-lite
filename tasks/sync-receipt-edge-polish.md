---
type: Task
title: 'Sync receipt honesty + error-message polish (PR#13 review, items 7-8)'
status: todo
priority: '2'
description: >-
  Bundle of accepted-but-recorded receipt divergences and message-quality fixes
  from the PR#13 panel: cross-run under-report, non-ff push message,
  git-identity fallback, --help worktree language, single-branch refspec hint,
  code-repo linked-worktree raw fatal.
actor: brian-claude
timestamp: '2026-07-10T15:33:27.388Z'
---
From the PR#13 three-lane review (all empirical):
1. Cross-run receipt under-report: fetch-succeeded-then-failed run → NEXT run
   materializes docs at rebase time but prints "already up to date" (receipt diffs this
   run's pre/post fetch refs only). Sibling: push lands on origin but local tracking-ref
   update fails → next run reports your own doc as incoming. Fix or DOCUMENT as known
   divergences (decide; document at minimum).
2. Non-fast-forward push rejection (two clones racing — the core concurrency story)
   classifies generic RUNTIME with the message truncated to "To <url>"; wants a matcher
   → retryable "a teammate pushed at the same moment — re-run sync".
3. No fallback git identity: fresh CI/container without user.email fails as raw-ish
   RUNTIME ("Please tell me who you are").
4. SYNC_USAGE --help says "linked worktree" — violates the no-worktree-language rule
   (one-liner; may fold into U6's truth pass).
5. Single-branch clones (narrow fetch refspec) with board on origin get "nothing to
   sync" with no hint — provisioning's fetch never sees the board; widen refspec or
   fetch the board ref explicitly, or give no_board its own hint.
6. sync from a linked worktree of the CODE repo leaks a raw git fatal (no-raw-git
   invariant violation on an exotic-but-real path).
7. show-incoming mislabels reserved paths as docs (codex PR#16 review,
   context-notes/pr-16-review): `sync --show-incoming log.md` renders `id: log.md`
   instead of `path: log.md` — probe-first resolution collapses the concept and raw
   interpretations of a `.md`-suffixed input and takes the doc branch. Fix: when the
   input's concept and raw relpaths are identical (or the path is reserved), classify
   the hit as raw; regression test for `show-incoming log.md`.
8. Two error strings in errors.ts (~:360, :370) still say "board worktree" while the
   sibling ffSwallowToError strings now say "board checkout" (U6 vocab sweep missed the
   classifyGitError pair) — same condition renders different vocabulary by path.
9. (upgrades item 5; local-only review 2026-07-09) Narrowed-refspec clones now get an
   AFFIRMATIVE false claim: the new local-only message says "no shared board branch
   exists" while ls-remote shows one — hedge the wording ("no board branch is visible
   to this clone") or widen the probe. Same fix family as item 5.
10. (local-only review) The provision announcement says "materialized from
   origin/board" even when provisioning came from a LOCAL board ref with no origin.
11. (local-only review, docstring-only) hasLocalOnlyBundle notes "at the repo top" but
   never names the nested-bundle miss (repo/pkg/.agentstate-lite reads as bare
   "nothing to sync" even run from inside pkg) — one honest sentence.
12. (local-only delta review) With a RELATIVE origin URL, an establish re-run
   misclassifies as AUTH_REQUIRED exit 4 (relative remotes resolve differently from
   inside the linked board worktree) — pre-existing #36 behavior, git semantics; wording
   or a realpath-at-establish-time fix.
