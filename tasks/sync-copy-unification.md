---
type: Task
title: >-
  Sync-family copy: convert the remaining guidance sites to rows, then unify the
  recorded inconsistencies
status: in_progress
priority: '3'
assignee: mike/claude
description: >-
  CLAIMED mike/claude 2026-07-18. TWO PRs, one claim each, source list = PR
  #92's filed follow-up section (items 1-11 incl. the four
  refusals-with-guidance added at fixup). PR 1 (BEHAVIOR-FROZEN, parity-contract
  tier): convert the remaining inline guidance/refusal sites to outcome-table
  rows — the full-sync no_upstream arm, inTreePullHint receipt twin,
  session-start pull-skip notes, SHOW_INCOMING_NO_UPSTREAM, and the four
  refusals (committed-case on-board-branch, dirty-uncommitted,
  cleanup-branch-exists, greenfield not-conventional-worktree) — fixture-FIRST
  from current code; note these now live in commands/sync/*.ts post-carve (#97).
  PR 2 (DECLARED copy changes): unify the safe inconsistencies
  (marker-unavailable x3 -> one wording; namespace x2; other CLI-side
  divergences) where each change is one row edit + its fixture delta — THE
  FIXTURE DIFF IS THE REVIEW ARTIFACT; builder proposes each winning wording
  with rationale in the PR body. BOUNDARY EXCLUSIONS (propose/flag, do not
  ship): bare-'sync' package strings vs '${inv} sync' — crossing it means
  passing inv into package factories, a design decision the package deliberately
  avoided (may be wontfix-as-designed); detached-HEAD details-shape divergence —
  touches classifyGitError = error taxonomy, out of scope. INDEPENDENT of
  codex's filesystem-lock seam work (zero file overlap). Reviews: one per PR
  (parity/provenance for PR1; fixture-diff for PR2).
actor: mike/claude
timestamp: '2026-07-18T14:47:41.860Z'
---

