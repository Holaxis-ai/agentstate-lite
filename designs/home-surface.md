---
type: Design
title: Home surface — the human window over a bundle (v1)
actor: mike/claude
timestamp: '2026-07-21T15:21:07.487Z'
---
# Home surface — the human window over a bundle (v1)

**Status:** Direction settled 2026-07-21 with Mike across three prototype rounds
(clickable prototype: claude.ai/code artifact `d164ddf6`, private). Unit-1 build planned in
[the build plan](../plans/home-surface-build.md). The doc-reader "window" second act is
recorded here as direction but DECISION-GATED — not part of Unit 1.

## Goal

The `ui` command's landing surface is the FIRST visual thing a user meets and the human
counterpart of the CLI `home` view. It must (1) orient a newcomer without OKF jargon,
(2) show the bundle's pulse live, (3) tell the truth about where the knowledge lives and
who can see it, and (4) launch the bundle's Views. A bare list of View cards is none of
those.

## The surface (Unit 1)

1. **Identity block.** Bundle display name (existing resolution chain). A **sharing chip**
   up front: `private — this computer only` vs `shared · <org/repo>` plus sync freshness.
   A **"where is this?" disclosure** holds the mechanics: folder path, loopback serving
   note, git remote + board-branch detail, last sync / unpushed state. Principle:
   user-meaningful STATE up front, implementation MECHANICS one click behind — and the
   path is never deleted (plain files you own is the product's soul; the path is the
   proof). The chip advances [the visibility safeguard](../tasks/bundle-visibility-safeguard.md).
2. **Orientation (first run only).** What a bundle is, the human–agent loop, the privacy
   promise ("everything stays private to this computer until you choose to share it"),
   and the try-it hook: ask your agent to remember something, watch it land. Replaces the
   developer-facing "promote an HTML view under views/" empty state.
3. **Views: ONE flat recency-sorted grid.** The Dashboards/Interactive/Documents grouping
   is retired — it projected the security model into the IA, and "Documents" collided
   with the product's core noun. Capability becomes a **badge** — `live data` /
   `can edit` / `artifact` — derived from the SAME enforced `bridge` field (the honesty
   property is preserved; it is no longer the organizing principle). No invented
   categorization: if grouping ever returns it is a bundle-authored View-convention field
   justified by real usage.
4. **Activity feed.** Recent docs (head projections — no bodies) with actor + kind +
   title + freshness, updating over the EXISTING SSE stream. This is the tutorial's
   engine and the empty state's fix in one mechanism.
5. **Workspaces (tier 1: see, not switch).** Read-only catalog block — names only, the
   open one marked; each row expands to its path + open command. Private workspaces
   hidden by default. The catalog is CLI policy, so the CLI INJECTS it through a
   consumer-owned ui-server option (the `resolveBundleDisplayName` precedent) — ui-server
   never imports CLI code. In-browser SWITCHING is a separate future decision
   (remount-in-place preferred; multi-mount brushes the frozen multi-bundle unit).
6. **Naming: OPEN.** Candidates home / launcher / workspace / overview. "Home" is the
   working lean (symmetry with the CLI `home` verb; the workspaces block strengthens it).
   Decide with early test-user input, BEFORE tutorial copy hardens the word. The route
   param stays compatible either way (`parseRoute` already falls back).

## Content model — three first-class media

1. **Markdown docs** — the knowledge substrate (diffable, queryable, linkable).
2. **HTML artifacts** (`bridge: none`) — the visual medium: diagrams, explainers,
   organized information. Agents' native artifact form; sandbox + `connect-src 'none'`
   makes them SAFE bundle content with provenance. First-class, not legacy.
3. **Live Views** (`bundle-read` / `bundle-propose`) — lenses and apps over live data.

A readable shell changes only this: HTML stops being conscripted for plain prose and gets
to be what it is good at. The bridge:none role is named by the `artifact` badge.

## Layer boundary (write it down so it never drifts)

The shell renders what is UNIVERSAL to every OKF bundle — docs, links, timeline,
kind-DECLARED chips (mechanism in the shell, meaning from the bundle). Anything
domain-interactive is a View. The boundary is MACHINE-ENFORCED: Views/artifacts render in
opaque-origin sandboxed iframes; no shared DOM, no CSS leak, either direction. The shell
never grows a built-in task board — that is a View, per the standing verdict that removed
the old React board views.

**Second act (decision-gated): the doc reader.** Activity rows and references click
through to a RENDERED doc — frontmatter as header, body typeset (format-level opinion
only, raw HTML disabled), backlinks derived, and HTML artifacts referenced by a doc
rendered inline as sandboxed FIGURES (same nonce/mint/CSP machinery). Plus a bridge
`open-doc` handoff so Views hand reading to the shell and stay thin. New scope — its own
decision before build; the rendered-content-in-shell-origin boundary lands in the
high-risk review tier.

## Styling architecture

1. Tokens are the ONE theming contract: plain CSS (CSP forbids inline styles), all
   components style through the `:root` token block (surfaces, text levels, the three
   semantic accents structure/process/signal, radius, font roles), light + dark at token
   level. Hex values live ONLY in the token block — pinned by a cheap grep gate.
2. ~8 primitives carry the whole surface (pill, chip, badge, card, note, section-title,
   feed row, dialog); new surfaces compose from them.
3. Bundle-DECLARED theming (workspace accent/logo) is deliberately deferred — cheap later
   at the token seam, never backed into.

## Explicitly out of scope for Unit 1

The doc reader build (own decision), tier-2 workspace switching, multi-bundle anything,
categorization fields, bundle theming, and the fundamental
[ui-rethink](../roadmap-items/ui-rethink.md) (post-window).

[direction and conversation record](../roadmap-items/launcher-home-surface.md)

[first contained unit](../tasks/launcher-first-run-onboarding.md)

[the pivot that made this the focus](../decisions/defer-builtin-recipes.md)
