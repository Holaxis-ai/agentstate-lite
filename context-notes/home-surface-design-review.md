---
type: Context Note
title: Home-surface design review — independent Fable round (rev 2 folded)
actor: fable-reviewer
timestamp: '2026-07-21T15:31:35.530Z'
---
# Summary

Independent design/plan review of [designs/home-surface](../designs/home-surface.md) +
[plans/home-surface-build](../plans/home-surface-build.md), performed by a fresh Fable
agent (no part in the design conversation), read-only, against the docs AND the actual
code (Launcher/App/pages/pageEvents/routing/styles, ui.ts, ui-server + its
import-direction test, home.ts, catalog.ts, board-git channel.ts). Verdict:
**APPROVE-WITH-CHANGES** — PR-A buildable as planned (small fixes); PR-B needed three
plan changes before build. All findings accepted and folded into rev 2 of the design and
plan the same day.

# Findings (as accepted)

1. **F1 high, empirical — `catalog add --private` was a hidden migration.** The catalog
   is user-global, parsed strictly (`hasExactKeys`, whole-file throw) by every installed
   CLI version; one new-key write bricks older CLIs' catalog commands and their
   session-start home. Replaced in Unit 1 by collapsed-by-default (zero schema change);
   the real flag deferred to its own high-tier unit with a compat story.
2. **F2/F3 high, empirical — the sharing-chip truth table was two rows short and could
   fabricate "shared"**: in-tree-without-remote and local-only board branch both rendered
   as shared; `ui --dir <other-bundle>` could wear the conventional board's chip
   (wrong-target). Table extended to 9 pinned rows incl. refusal states and non-GitHub
   remote degrade; wrong-target guard added.
3. **F4/F5 medium, empirical — probe mechanism/timing unspecified; injected types must be
   ui-server-owned.** Decided: offline local-evidence probe (home's posture, never
   network), async off the event loop, TTL ~30s, `as_of` label, SPA refetches config on
   SSE resync (the once-only fetch was a freeze bug); plain data shapes declared in
   ui-server (its import-direction test has no allowlist); SPA owns chip wording.
4. **F6–F8 low, empirical — PR-A realities**: stray `#fff` fails the planned hex gate
   (tokenize; gate scoped to token blocks); SSE deltas carry `{id,version}` only so the
   feed is invalidate-and-refetch with debounce + a conventions/registry filter;
   first-run dismissal mechanism decided (localStorage by bundle root, caveat accepted);
   orientation copy gets a no-agent fallback and in-tree-safe privacy wording;
   "artifact" badge word joins the test-user question set; workspaces injection is
   labels+paths with no availability probes.

# Survived attacks

One-parser/one-runtime, the layer boundary (feed = universal timeline, no shell task
board), route compatibility of the rename, the injection-seam precedent, the PR split and
tiers, the session-gated security surface, and remote-mode behavior — all attacked, all
held (empirical).
