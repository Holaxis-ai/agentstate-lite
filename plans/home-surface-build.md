---
type: Plan
title: Build plan — home surface Unit 1 (two PRs)
actor: mike/claude
timestamp: '2026-07-21T15:21:07.612Z'
---
# Build plan — home surface Unit 1 (two PRs)

**Status:** Planned 2026-07-21. Builders: Mike + Claude (this is a founder-built unit, not
a delegated one). Implements [the v1 design](../designs/home-surface.md); the authoritative
direction record is [the roadmap item](../roadmap-items/launcher-home-surface.md).

## PR-A — the SPA reshape (one claim: the landing surface orients and pulses)

Pure SPA + existing APIs; no new endpoints, no CLI changes.

- `Launcher.tsx`: retire the three capability sections → ONE flat recency grid; add the
  capability badge (`live data` / `can edit` / `artifact`) derived from the same enforced
  `bridge` field the card list already carries.
- New activity-feed component: recent docs via `listAllHeads` (heads only, no bodies),
  sorted by timestamp; live-prepend over the existing SSE subscription
  (`subscribeToChanges` / `subscribeToResync` — resync = full refetch, stream is
  replay-free). Verb inference (added vs updated) is client-side best-effort.
- Orientation block + empty states + privacy-promise copy; the old
  "promote an HTML view" paragraph goes away.
- Naming copy: adopt "home" PROVISIONALLY in cheap-to-change strings; route params stay
  compatible (`launcher` keeps parsing). Final name rides test-user feedback.
- Styling codification riding along: token-only rule stated in `styles.css` + a grep gate
  (no hex outside the token block) in the ui test suite.
- Tests: `Launcher.test.tsx` rewrite, feed component tests, e2e `pages.spec.ts`
  additions (fresh-bundle empty state; card click-through unchanged).

Gates: `npm run build` / `typecheck` / `npm test` / `e2e:gate`, each by its own exit code.
Review tier: ordinary code change — independent review of the exact SHA + repository gate.

## PR-B — identity truth (one claim: home tells the truth about where knowledge lives)

The CLI-injection seam (consumer-owned options on `UiServerOptions`, the
`resolveBundleDisplayName` precedent) — ui-server never imports CLI code.

- CLI: refactor `home.ts`'s board probe into a reusable summary (channel detection via
  `detectBoardChannel`, remote, last-sync/unpushed backstop) + read the catalog; inject
  both via new options; extend `/__ui/config`.
- `catalog add --private` flag (catalog schema + list output + SKILL regen `check:skill`).
- SPA: sharing chip + "where is this?" disclosure + workspaces block (names only; per-row
  expand for path + open command; private entries hidden).
- **Sharing-chip truth table (pin with tests):** no git/board → `private`; board branch on
  remote → `shared · <org/repo>` + freshness; IN-TREE board → `shared with the code ·
  <org/repo>`; `--remote` mode → `hosted · <origin>`; probe failure → honest unknown
  ("sharing status unavailable"), never a fabricated "private".
- Tests: CLI probe unit tests per channel mode; ui-server config-shape tests; SPA
  chip/panel tests; e2e for disclosure + workspaces expand.

Gates: as PR-A plus `check:skill` (CLI help/SKILL surface changed). Review tier: ordinary;
no new security surface (session-gated shell endpoints, read-only data) — but the truth
table is the review's center of gravity (a wrong "private" is a trust bug).

## Sequencing and acceptance

A then B (A is user-visible immediately; B depends on nothing in A but reviews better
against the reshaped surface). Acceptance = the task's DoD
([launcher-first-run-onboarding](../tasks/launcher-first-run-onboarding.md)): opening `ui`
on a fresh bundle orients a newcomer (what this is, what to do, where things live), and
the quickstart's "productive" assertion includes the surface orienting — plus the
sharing-chip truth table green across all four channel modes.

## Deferred with a checklist (not in this plan)

Unit 2 (doc reader) needs its own decision first: sanitizer approach (raw HTML disabled),
embedded-UI bundle-size budget, link resolution reusing core's ONE resolver, bridge
`open-doc` as a versioned protocol addition, figures via the existing mint machinery,
high-risk review tier for rendered-content-in-shell-origin. Tier-2 workspace switching
(remount-in-place) parked separately.
