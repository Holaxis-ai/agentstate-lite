---
type: Context Note
title: What landed + the invariant-ownership frame (2026-07-10)
actor: mike/claude
timestamp: '2026-07-10T03:48:10.879Z'
---
# Summary

Where main stands after a heavy session, and the frame guiding what's next.

## Landed this session (committed bundle now **1.0.31**)
- **#29** graph-query — `queryEdges` engine atom + `link list`.
- **#30** body-guard — `doc write`/`doc update --body` refuse to silently drop a doc's outbound links
  (short-term guard; the proper preserve-by-default model is roadmapped at
  [link-model-body-safe](../roadmap-items/link-model-body-safe.md)).
- **#28** opportunistic board freshness — reads freshen a stale board via a best-effort, time-boxed,
  never-blocking `autopull`.
- **#31** bundle pages — the UI capstone (launcher + sandboxed iframes + read-only postMessage bridge
  incl. an `edges` request + live updates; Pulse + Roadmap seed pages). The whole
  spike→security-hardening→branding→edges→seed-swap arc.
- **#33** CI hotfix — see below.

## Open
- **#32** `fix/board-truth-and-hermetic-parity` — trimmed to honest-now scope: CLAUDE.md now states this
  repo's real topology (bundle lives on the `board` branch, gitignored on `main`, materialized via
  `aslite sync` — NOT committed with code), and the roadmap parity test is now hermetic (a committed
  fixture, not the live board). The README/skill sharing reframe was moved to #1 (sync-establish), where
  "local → sync to share" becomes true. Review-ready.

## The guiding frame — [invariant-ownership design](../designs/invariant-ownership-and-change-contracts.md) (openai/codex)
Every load-bearing invariant needs one authority, named consumers, and a gate that fires when either
changes. Decisions taken on its founder-questions:
1. **Shipped conventions are CODE-OWNED** — the recipe is canonical; this repo's board is an applied
   instance that may intentionally diverge. So the parity test is a recipe-fixture contract; no
   board-drift gate is owed.
2. **Event backbone** ([research](../research/real-time-event-backbone.md)) to be ratified as the
   remote/live freshness authority — a design bet, parked, NOT built yet. Local git `session-start` stays
   on its own tier.
3. **Hosted control-plane** to be removed from the default CLI/plugin surface (kept as a private compat
   target). See the Worker note below.
4. **INVARIANTS.md** (a repo-tracked ownership map + 4 PR prompts) — deferred until the two architecture
   consolidations land; it's a map, not a governance layer.

## The CI bot failure (fully closed)
The version-bundle bot went red after #31 — the first ui→core import exposed that the bot's regen ran the
UI production build **without building `core` first** (the PR gate passes because root `npm run build`
orders deps; the bot called the embed step directly). Fixed at the source (the shared embed step now
builds core before ui); bot recovered and regenerated to 1.0.31. **Follow-up queued:** add a bot-regen
*build* smoke to the PR gate (a build check, distinct from the deliberately-excluded drift gate) so this
class is caught pre-merge.

## Hosted Worker — decommission planned
Mike confirmed the production Cloudflare Worker is **unused** (the team's board moved to the git `board`
branch). It's a live, publicly-reachable, auth-gated surface with no users. Decommission is human-gated
infra (Mike runs export → revoke keys/invites → disable route → keep backups); the orchestrator preps the
runbook + cuts an archival tag. "Dormant/private" until explicitly decommissioned.
