---
type: Context Note
title: Session close-out 2026-07-10 — all merged (bundle 1.0.33)
actor: mike/claude
timestamp: '2026-07-10T14:42:36.807Z'
---
# Summary

Session close-out (2026-07-10). **All PRs merged; committed bundle at 1.0.33; CI bot green.** Main is
clean and current.

## Landed this session
- **#29** graph-query — `queryEdges` + `link list`.
- **#30** body-guard — `doc write`/`doc update --body` refuse to silently drop outbound links.
- **#28** opportunistic board freshness (`autopull`) — best-effort, time-boxed, never blocks a read.
  (Delivers the goal of [sync-opportunistic-pull](../tasks/sync-opportunistic-pull.md) — owner
  `brian-claude` can close it.)
- **#31** bundle pages — the UI capstone (launcher + sandboxed iframes + read-only `edges` bridge +
  live updates; Pulse + Roadmap seed pages). Closes [ui-pages-spike](../tasks/ui-pages-spike.md);
  follow-ups remain open (bridge-v1, connection-recovery, per-page-scoping).
- **#33** CI hotfix — the version-bundle bot skipped building `core` before the ui prod build; fixed
  at the shared embed step. **Follow-up (not yet filed):** add a bot-regen *build* smoke to the PR
  gate so a broken embed/bundle build is caught pre-merge.
- **#32** board-truth — CLAUDE.md now states this repo's real topology (bundle on the `board` branch,
  gitignored on main, via `aslite sync`); roadmap parity test made hermetic (committed fixture).
- **#34** engineering-discipline codification + a tracked minimal `AGENTS.md` pointer (Codex) — closes
  the untracked-`AGENTS.md`-drift stray. This is the LIGHT form of the invariant design's INVARIANTS.md.
- **#35** versioned mutation boundary — one `versionedMutation` primitive; fixed a **live** `kind field`
  lost-update + `doc write` stale-guard windows. A second independent review found three more
  (governs-recheck, enum join-collision, ENOSPC→USAGE), all fixed. Key correction: the primitive
  guarantees **version-safety, not domain-invariant-safety** — consumers must re-check mutable
  invariants (`kind.ts`'s `governs` is the cautionary example). Follow-up:
  [error-classification-boundary](../tasks/error-classification-boundary.md) (Codex).
- **#36** `sync --establish` — a new project can stand up a shared board. Review caught an auto-publish
  safety hole (bare `sync` publishing an unrelated private `board` branch); the merged version is a
  **snapshot-first** rewrite that closes it structurally (bare `sync` refuses an unadopted local board
  branch) and never touches the user's folder until the board commit is safely on origin. Delivers the
  establish half of [sync-migrate-removal](../tasks/sync-migrate-removal.md) (owner `openai/codex`; the
  `--migrate` retirement is the remaining half).

## Guiding frame + decisions
Per the [invariant-ownership design](../designs/invariant-ownership-and-change-contracts.md): conventions
are **code-owned** (recipe canonical); the **event backbone** ([research](../research/real-time-event-backbone.md))
is to be ratified but NOT built yet; the **hosted control-plane** is to leave the default surface; the
full INVARIANTS.md map is deferred (the light #34 shipped instead).

## Open strategic thread
The **board-branch model was questioned** — it fights GitHub's UI (every board push offers a forbidden
"Compare & pull request"), needs heavy machinery (`sync`/provision/`--migrate`/`--establish`), and is
being generalized for multi-team users who don't exist yet. Decision this session: **keep the model +
ship the hardened #36**; revisit the *positioning* (branch vs committed-on-main vs separate repo) later
— it does not require touching the now-solid implementation.

## Also pending
Hosted **Worker decommission** (unused; the board moved to the git tier) — human-gated infra, Mike runs
export → revoke keys → disable route; orchestrator preps the runbook + archival tag.
