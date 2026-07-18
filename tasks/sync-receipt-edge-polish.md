---
type: Task
title: 'Sync receipt honesty + error-message polish (PR#13 review, items 7-8)'
status: todo
priority: '2'
description: >-
  ITEMS 7 + 4 CLOSED via PR #104 (merge 43ab16a, 2026-07-18): item 7 —
  show-incoming now classifies by the DERIVED path (reserved files render honest
  'path:' under ANY spelling — log, log.md, nested tasks/index.md — while
  .md-spelled doc ids stay parsed docs, matching doc read; the review found two
  rule defects in round 1, fixed in one remedy commit). Item 4 — ALREADY FIXED
  2026-07-08 (the U6-era truth pass replaced the SYNC_USAGE phrase; this record
  was stale). RESIDUE (record note, not a task): porcelain.ts:604
  existingDirRefusal wrong_branch copy still says '(a linked worktree or nested
  repo)' — byte-frozen by #92 fixtures; fold into the next unit that touches
  porcelain copy. ITEM 3 DECIDED (Mike, 2026-07-18), Sonnet-safe, now UNBLOCKED
  (#104 landed; same porcelain files): fallback git identity = resolved ACTOR as
  user.name (fallback 'agentstate-lite'), email
  <actor-slug>@agentstate-lite.invalid (RFC 2606, repo precedent
  test-suite@example.invalid); applied per-invocation via -c flags ONLY when
  identity resolution fails; never writes config; users with real identities
  untouched. Safety basis: commit authorship provably non-load-bearing
  in-product (no consumer parses authors/subjects; frontmatter is the
  attribution channel). Accepted judgment point: the committed-case cleanup
  commit carries the synthetic identity into code-repo history via the
  human-opened PR — accepted as honest (machine-authored) vs the flow dying in
  fresh containers. DoD: guarded flag-set + a fresh-container (empty gitconfig)
  test through a real sync commit + the cleanup-commit path. Items 1/10, 2, 5/9,
  6, 8 remain parked per the standing stance.
actor: mike/claude
timestamp: '2026-07-18T16:35:20.866Z'
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
13. (error-boundary review, pre-existing) `doc history <missing-id>` exits 0 with
   count 0 — the one missing-document surface that never says NOT_FOUND.
14. (error-boundary review, pre-existing) `--body-file <missing>` ENOENT surfaces raw
   RUNTIME/1 while promote's source ENOENT is USAGE naming the file — the
   call-site-knows-the-path translation principle applied unevenly.
