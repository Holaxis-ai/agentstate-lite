---
type: Context Note
title: >-
  Pre-compaction state — MAIN ORCHESTRATOR session (reviews teed up, onboarding
  overlap, PR-fix-claim)
actor: brian-claude
description: >-
  Post-compaction recovery checkpoint for the cache-identity follow-up and
  separately reviewed hidden-lifecycle defect.
timestamp: '2026-08-03T15:01:40Z'
---
# Summary

Pre-compaction state for the MAIN ORCHESTRATOR session (Brian designated it explicitly on
2026-07-30: "Ok you are the main orchestration session"). Captures only what is NOT already on the
board. Reload skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, aslite, holaxis-orchestrator
(dispatch), holaxis-agent-launcher (tmux spawns are permission-gated — stage for Brian to run with `!`).

## Highest-leverage open items (both awaiting Brian's own decision — DO NOT decide for him)

Two review requests where Brian is the NAMED HUMAN REVIEWER. Both are teed up; verdicts are his to
give. When he gives them, record status + decision_summary on the review doc, then `sync` — do not
flip status yourself (the Review Request convention: reviewer is the human judge, not an agent grant).

1. **`review-requests/kinds-and-descriptions-architecture`** (currently `changes_requested`) —
   RE-REVIEW VERIFIED THIS SESSION, both recorded blockers CLEARED on main (don't re-run this):
   - Blocker 1 (generic link couldn't make two differently-named relationships to the same target):
     RESOLVED — fixed in PR #55, link identity now keyed on target + exact text (`link.ts:414`),
     proven empirically (citation + depends-on to one target both persist), regression test
     `link.test.ts:168`.
   - Blocker 2 (explainer relationship/enum status labels stale): RESOLVED — `pages/architecture-kinds.html`
     now reads "Shipped · Relationships (PR #51)" / "Shipped · Enums (PR #52)"; stale July-2026 date gone.
   - Validation question resolved: PR #52 (enum descriptions) MERGED via the same Convention->parser->registry
     path (all four semantic layers shipped).
   - One NON-blocking cosmetic nit: a flow-diagram node still says "enum meaning is the current in-progress
     extension" (stale vs the same page calling enums Shipped). Recommend Brian APPROVE + file the nit as a
     small follow-up task. Near-certain approve.

2. **`review-requests/board-placement`** (currently `requested`) — design review, 7 explicit judgments
   (decouple sync's value from placement; thin `placement: main|branch` seam over git.ts; config home;
   fresh-clone discovery marker; commits-on-main; transitions; anything missing). Design pre-answers most
   with leanings. The THREE that need Brian's real judgment: **Q2** (is the seam premature? — gate-3: is
   on-main a real second strategy or hypothetical), **Q5** (commits-on-main is the riskiest bit: a sync
   pull becomes a fetch+rebase of the CURRENT branch scoped to the bundle path — must not touch non-bundle
   files), **Q4** (discovery marker form for the branch case). Full brief was delivered in chat; evidence is
   `designs/board-placement`.

## Already captured on the board this session (reference, do not re-narrate)
- Page->View rename (Option C+) COMPLETE — all 3 units merged (#83 U1, #87 U3 + partial-pair pin d12b402,
  #88 U2 detection/nudge/audit at cf8afeb after 3 external-review findings fixed). Record on
  `tasks/rename-page-kind-to-view` (status done).
- `designs/user-notices` — addressed/expiring/acknowledgeable notices design (expiry-mandatory +
  optional-ack; address the person not the surface; identity prerequisite seeded from `git config user.email`).
- `tasks/guidance-bundle-onboarding` (P2, todo) — guidance bundle shipped with npm.

## Open threads NOT yet captured anywhere (do these / offer them)
- ONBOARDING-NEIGHBORHOOD OVERLAP (flagged, mapping OFFERED but not done): the new guidance-bundle task
  overlaps `tasks/npm-quickstart-onboarding`, `tasks/product-recipe-discovery`, and a NEW `Journey` model
  from openai/codex (`journeys/new-user-to-recurring-value` + `journey-stages/*`). Risk: 3-4 half-built
  onboarding surfaces. Offer to map where they genuinely differ before anyone builds guidance-bundle.
- PR-FIX-CLAIM design — discussed in chat, NOT captured. Shape: a PR fix becomes claimable the moment it's
  a status-bearing doc; reuse the exact CAS-flip-with-actor claim; the doc POINTS at the PR by number+head-SHA
  (bundle owns the claim, GitHub owns the PR — don't mirror PR state); one new glue step turns review findings
  into `open` fix docs; claim per fix-ROUND to avoid branch-push contention. Offer to write it up as a design +
  draft the `PR Fix` convention.
- FIVE `in_progress` tasks with NO assignee = likely stale claims to reconcile (check actor/timestamp, flip
  back to todo if dead): mcp-generated-view-type-discovery, npm-cli-skill-prerelease, source-comment-hygiene,
  sync-receipt-edge-polish, workspace-catalog-dogfood-checkpoint. (Some may have been touched since; re-verify.)

## Working conventions in force (from Brian's global + repo CLAUDE.md)
- CODE ships on feature branches; I push branches + write ASCII-safe PR descriptions; BRIAN opens/merges PRs
  (never gh pr create, never push main). No AI-attribution trailers.
- Board writes go through `aslite sync` (board branch). Reviewers detach onto exact SHAs in isolated
  worktrees; `npm ci` in fresh worktrees; gates verified by DIRECT exit codes, never pipes.
- Sub-agents have dropped their completion notifications ~3x this session — after dispatching a background
  gate, watch for stall and nudge; prefer foreground for a sub-agent's final gate.
- Board writes attributed `--actor brian-claude` this session.
