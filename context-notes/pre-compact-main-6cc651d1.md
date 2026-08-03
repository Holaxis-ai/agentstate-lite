---
type: Context Note
title: Pre-compaction handoff — main orchestrator session 6cc651d1
actor: brian-claude
timestamp: '2026-08-03T15:08:16.022Z'
---
# Summary

SESSION-SCOPED pre-compaction handoff for session `6cc651d1-a193-4944-9520-a14f2234d0cf`
(the MAIN ORCHESTRATOR session; Brian designated it 2026-07-30: "Ok you are the main orchestration
session"). Written session-scoped because the fixed id `context-notes/pre-compact-main` collides
across concurrent main sessions — the flaw being fixed under `tasks/pre-compact-multi-session`
(claimed in_progress by this session's design team as of 2026-08-03). Reload skills:
holaxis-self-awareness, holaxis-cognitive-ecosystem, aslite, holaxis-orchestrator,
holaxis-agent-launcher (tmux spawns are permission-gated — stage for Brian to run with `!`).

## Active work this session (as of 2026-08-03): the pre-compact-multi-session design team

Dispatched a design team (Sequential Pipeline + Generator-Critic) against
`tasks/pre-compact-multi-session`. Stages: Scout (map current mechanics) -> Designer (write
`designs/pre-compact-multi-session` resolving the 6 decision points + a PROPOSED CLAUDE.md
convention diff, NOT applied — Brian's global instructions are his to change) -> Skeptic reviewer.
On completion: bring the vetted design + proposed convention diff to Brian for sign-off; do NOT
edit Brian's global CLAUDE.md yourself. If resuming mid-flight, check the team's agent outputs and
the board for `designs/pre-compact-multi-session` + any findings context note.

## Highest-leverage open items awaiting BRIAN (do NOT decide for him)

Two review requests where Brian is the NAMED HUMAN REVIEWER — teed up, verdicts are his. When he
gives them, record status + decision_summary on the review doc, then `sync`. Do not flip status
yourself (reviewer is the human judge, not an agent grant).

1. `review-requests/kinds-and-descriptions-architecture` (`changes_requested`) — RE-REVIEW VERIFIED
   THIS SESSION, both recorded blockers CLEARED on main (don't re-run):
   - Blocker 1 (generic link couldn't make two differently-named relationships to one target):
     RESOLVED — PR #55, identity now target + exact text (`link.ts:414`), empirical proof + regression
     `link.test.ts:168`.
   - Blocker 2 (explainer relationship/enum status labels stale): RESOLVED — `pages/architecture-kinds.html`
     now "Shipped · Relationships (PR #51)" / "Shipped · Enums (PR #52)"; stale date gone.
   - PR #52 (enum descriptions) MERGED via the same Convention->parser->registry path (all 4 semantic
     layers shipped) — the review's own validation question.
   - One NON-blocking cosmetic nit: a flow-diagram node still says enums are "in-progress." Recommend
     Brian APPROVE + file the nit as a small follow-up. Near-certain approve.
2. `review-requests/board-placement` (`requested`) — design review, 7 judgments. Design pre-answers most.
   The THREE needing Brian's real judgment: Q2 (is the seam premature? gate-3: is on-main a real second
   strategy), Q5 (commits-on-main = the riskiest bit: a sync pull becomes a fetch+rebase of the CURRENT
   branch scoped to the bundle path — must not touch non-bundle files), Q4 (discovery marker form).
   Evidence: `designs/board-placement`.

## Already captured on the board this session (reference, don't re-narrate)
- Page->View rename (Option C+) COMPLETE — all 3 units merged (#83 U1, #87 U3 + partial-pair pin
  d12b402, #88 U2 detection/nudge/audit at cf8afeb after 3 external-review findings). Record on
  `tasks/rename-page-kind-to-view` (done).
- `designs/user-notices` — addressed/expiring/acknowledgeable notices (expiry-mandatory + optional-ack;
  address the person not the surface; identity seeded from `git config user.email`).
- `tasks/guidance-bundle-onboarding` (P2) and `tasks/pre-compact-multi-session` (P2) created this session.

## Open threads NOT yet captured elsewhere (do / offer)
- ONBOARDING-NEIGHBORHOOD OVERLAP (mapping OFFERED, not done): `tasks/guidance-bundle-onboarding` overlaps
  `tasks/npm-quickstart-onboarding`, `tasks/product-recipe-discovery`, and a NEW `Journey` model from
  openai/codex (`journeys/new-user-to-recurring-value` + `journey-stages/*`). Offer to map differences
  before anyone builds.
- PR-FIX-CLAIM design (discussed, NOT captured): a PR fix becomes claimable once it's a status-bearing doc;
  reuse the exact CAS-flip-with-actor claim; the doc POINTS at the PR by number+head-SHA (bundle owns the
  claim, GitHub owns the PR); one glue step turns review findings into `open` fix docs; claim per fix-ROUND
  to avoid branch-push contention. Offer to write it up + draft the `PR Fix` convention.
- FIVE `in_progress` tasks with NO assignee = likely stale claims to reconcile (re-verify, flip to todo if
  dead): mcp-generated-view-type-discovery, npm-cli-skill-prerelease, source-comment-hygiene,
  sync-receipt-edge-polish, workspace-catalog-dogfood-checkpoint.

## Working conventions in force
- CODE ships on feature branches; push branch + ASCII-safe PR description; BRIAN opens/merges (never
  gh pr create / push main). No AI-attribution trailers.
- Board writes via `aslite sync`. Reviewers detach onto exact SHAs in isolated worktrees; npm ci in fresh
  worktrees; gates verified by DIRECT exit codes, never pipes.
- Sub-agents dropped completion notifications ~3x this session — after a background gate, watch for stall
  and nudge; prefer foreground for a sub-agent's final gate.
- Board writes attributed `--actor brian-claude` (design docs/tasks) this session; the team claim uses
  `--actor claude-main-precompact`.
