---
type: Plan
title: Build plan — home surface Unit 1 (two PRs)
actor: mike/claude
timestamp: '2026-07-21T15:31:35.786Z'
---
# Build plan — home surface Unit 1 (two PRs)

**Status:** Planned 2026-07-21; **rev 2 same day** after independent Fable review
(APPROVE-WITH-CHANGES — [review record](../context-notes/home-surface-design-review.md)):
truth table extended (F2/F3), probe specified (F4/F5), `catalog --private` replaced by
collapsed-by-default (F1), PR-A fixes folded (F6/F7/F8). Builders: Mike + Claude (a
founder-built unit, not a delegated one). Implements
[the v1 design](../designs/home-surface.md); the authoritative direction record is
[the roadmap item](../roadmap-items/launcher-home-surface.md).

## PR-A — the SPA reshape (one claim: the landing surface orients and pulses)

Pure SPA + existing APIs; no new endpoints, no CLI changes.

- `Launcher.tsx`: retire the three capability sections → ONE flat recency grid; add the
  capability badge (`live data` / `can edit` / `artifact`) derived from the same enforced
  `bridge` field the card list already carries.
- Activity-feed component: recent docs via `listAllHeads` (heads only). The SSE
  `ChangeEvent` carries `{id, version}` only — the feed is **invalidate-and-refetch** per
  change (verb inference by set-membership BEFORE refetch), debounced for chatty bundles;
  resync = full refetch. Default filter drops `conventions/` docs and View-registry docs
  from the feed so first-run reads as knowledge, not plumbing.
- Orientation block + empty states + privacy-promise copy (worded to cover in-tree mode;
  no-agent-yet fallback line). First-run dismissal: localStorage keyed by bundle root
  (accepted caveat: ephemeral-port fallback changes origin, may resurface once).
- Naming copy: adopt "home" PROVISIONALLY in cheap-to-change SPA strings; route params
  stay compatible (`launcher` keeps parsing). `UI_USAGE`/`reference.ts` keep "launcher"
  for now — the eventual rename sweep (reference.ts → SKILL regen) is on the deferred
  checklist below.
- Styling codification riding along: tokenize the stray `#fff` (`.action-apply`) as an
  on-accent token; grep gate = hex/color literals permitted ONLY inside the token blocks
  (`:root` + the dark-scheme override + `color-mix` over tokens), added to the ui suite.
- Tests: `Launcher.test.tsx` rewrite, feed tests (refetch semantics, debounce, filter),
  e2e `pages.spec.ts` additions (fresh-bundle empty state; card click-through unchanged).

Gates: `npm run build` / `typecheck` / `npm test` / `e2e:gate`, each by its own exit code.
Review tier: ordinary code change — independent review of the exact SHA + repository gate.

## PR-B — identity truth (one claim: home tells the truth about where knowledge lives)

The CLI-injection seam (consumer-owned options on `UiServerOptions`, the
`resolveBundleDisplayName` precedent). **The injected sharing summary and workspaces
block are PLAIN DATA SHAPES declared in ui-server** (its import-direction test has no
allowlist — not even type-only board-git/CLI imports); the CLI maps channel detection
into them. **The SPA owns the chip's words**; the truth table is pinned in SPA tests over
the state enum, with CLI-side tests pinning state derivation per channel mode.

- **Probe (decided):** OFFLINE local-evidence only — reuse home's probe discipline
  (`defaultLoadBoardStatus`'s posture: never a network op, gate 5), refactored into a
  reusable summary. Computed via async spawns OFF the event loop, TTL-cached (~30s),
  carrying `as_of`; `/__ui/config` includes it; the SPA refetches config on SSE resync
  (today it fetches once with `refetchInterval: false` — that freeze is a bug for a
  days-long server run).
- **Wrong-target guard:** the probe runs ONLY when the served `bundle.root` IS the
  conventional board path (or its worktree interior). Any other `--dir` bundle gets NO
  sharing claim (state `unscoped` → chip omitted or "local folder").
- **Sharing-chip truth table (pin every row; fabrication in EITHER direction is the bug):**
  | state | chip |
  |---|---|
  | no git repo / no board channel | `private — this computer only` |
  | board branch, remote exists | `shared · <remote>` + `as_of` freshness |
  | board branch, LOCAL ONLY (no remote/never pushed) | `private — local branch, not yet shared` |
  | in-tree board, remote exists | `shared with the code · <remote>` |
  | in-tree board, NO remote | `private — committed with code, no remote` |
  | channel refusal states (pre-share window, dual board) | `sharing status unavailable — <short reason>` (a decided mapping, not a catch-all) |
  | probe failure | `sharing status unavailable` (never a fabricated "private") |
  | non-conventional `--dir` bundle | no sharing claim (wrong-target guard) |
  | `--remote` mode | `hosted · <origin>` (server-derived from `remoteBase`, no CLI injection) |
  `<remote>` degrades for non-GitHub URLs (SSH/file/bare-path → host or path tail).
- **Workspaces block:** labels + paths only (NO availability probes — home's budgeted
  discipline), COLLAPSED by default. No catalog schema change in this unit.
- Tests: CLI state-derivation tests per channel mode (incl. both fabrication cases as
  red tests), ui-server config-shape tests, SPA truth-table + chip-wording tests, e2e
  for disclosure + workspaces expand + resync refetch.

Gates: as PR-A plus `check:skill` if any CLI help text moves. Review tier: ordinary; no
new security surface (session-gated shell endpoints, read-only data) — the truth table is
the review's center of gravity.

## Sequencing and acceptance

A then B (A is user-visible immediately; B reviews better against the reshaped surface).
Acceptance = the task's DoD
([launcher-first-run-onboarding](../tasks/launcher-first-run-onboarding.md)): opening `ui`
on a fresh bundle orients a newcomer, the quickstart's "productive" assertion includes the
surface orienting — plus the sharing-chip truth table green across ALL rows above.

## Deferred with a checklist (not in this plan)

- **Catalog privacy flag** — its own decided unit: the catalog is shared user-global
  state parsed strictly (`hasExactKeys`, whole-file throw) by every concurrently
  installed CLI version, so any schema change is a MIGRATION (high-risk tier) needing a
  compat story (tolerant parsing shipped first, older-CLI failure mode accepted and
  tested) and defined semantics for CLI `home` too.
- **Naming rename sweep** once test users decide: reference.ts + UI_USAGE + SKILL regen.
- **Unit 2 (doc reader)** — own decision first: sanitizer (raw HTML disabled),
  embedded-UI bundle-size budget, link resolution reusing core's ONE resolver, bridge
  `open-doc` as a versioned protocol addition, figures via the existing mint machinery,
  high-risk review tier for rendered-content-in-shell-origin.
- **Tier-2 workspace switching** (remount-in-place) parked separately.
