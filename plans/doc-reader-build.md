---
type: Plan
title: Build plan — the doc reader (three PRs)
actor: mike/claude
timestamp: '2026-07-21T18:26:51.262Z'
---
# Build plan — the doc reader (three PRs)

**Status:** Planned 2026-07-21; **rev 2 same day** after the independent pre-build review
(APPROVE-WITH-CHANGES — [record](../context-notes/doc-reader-design-review.md)): the
`links.ts` node:path build-breaker becomes an explicit high-risk step with a parity test,
the render chain is AST→React (DOMParser step deleted from the plan), the href invariant
is pinned first, gfm + table allowlist added, figure lifecycle specified. Builders:
Mike + Claude. Implements [the doc-reader design](../designs/doc-reader.md) rev 2.

## PR-1 — the reader core (HIGH-RISK tier)

**Claim: any doc renders, safely, and the fabric links into it.**

Ordered steps:

1. **De-`node:path` `links.ts`** (core): replace the three `path.posix.*` calls with pure
   posix string logic — the ONE resolver must run unchanged in node AND browser (a
   browser fork would violate gate 3; the current import FAILS browser bundling,
   empirically). Add the `./links` subpath export. **Node↔browser parity test** pins
   identical `resolveConceptId` output across runtimes. Part of the high-risk surface —
   the resolver is the scheme-smuggling defense.
2. **Renderer:** micromark + micromark-extension-gfm (tables, strikethrough, task lists),
   dangerous HTML off, **AST/events → React elements directly** — no HTML-string
   intermediate, no DOMParser, no innerHTML; unknown node types render as text. Grep gate
   bans `dangerouslySetInnerHTML` in the reader path. Body-size cap with truncation
   notice + bounded walk (max nodes/depth).
3. **THE invariant, pinned first and red:** anchor/img attributes are built ONLY from the
   resolver's output; a raw markdown href/src never reaches a DOM attribute. Battery
   asserts `javascript:`/`data:`/`vbscript:` autolinks and link targets, entity-obfuscated
   and whitespace-split schemes all render inert or as `?view=doc&id=` routes — never the
   raw scheme.
4. **SPA:** `routing.ts` `doc` view; `App.tsx` dispatch; `DocPage.tsx` — header card
   (kind pill, kind-declared chips, actor, freshness), rendered body, "Cited by" via
   `/__ui/edges?to=`, back-to-home affordance, SSE invalidate-and-refetch per id,
   deleted-doc terminal state, unknown-id not-found state. Entry points: activity rows,
   card provenance, in-body links, deep links.
5. **Injection battery:** the scheme vectors above as first-class, plus raw-HTML set
   (`<img onerror>`, `<svg onload>`, `<math>`, `<iframe>`, `<style>`,
   comment/`<template>`/`<noscript>` mXSS shapes), gfm TABLE elements, and
   frontmatter-sourced strings — all inert. e2e: open-from-feed, deep link, injection doc
   inert in a real browser.
6. **Size:** measure and state the embedded-asset delta in GZIP terms (budget ≤ 40 KB gz).

Gates: full repo gate + e2e by own exit codes. **Ladder: builder → independent review →
adversarial QA** aimed at the three belts (renderer escape, closed AST→React
construction, shell CSP `script-src 'self'`), the parity test's coverage, and
pathological-doc degradation.

## PR-2 — figures (ordinary tier + a focused lifecycle-adversarial check)

**Claim: a doc can carry a live, sandboxed visual.**

- **Figure resolution is its own small resolver** (`resolveConceptId` is `.md`-only):
  relative/absolute image target → blob key; then a CLIENT-SIDE registration check
  against the registry list (`isAnyEntryKey` + a registered View's entry) gates minting —
  an unregistered target renders inert text, never a minted-403 error frame.
- **Re-mint on every (re)mount** — never cache a nonce URL across a mount boundary (the
  120 s nonce TTL otherwise 403s a remounted figure). Registry/blob change → re-mint;
  removal → honest terminal state.
- Tests: figure-resolver units; >120 s remount still renders; figure-heavy cap-pressure
  behavior under the 256-launch registry (no unrecoverable eviction of a visible figure);
  e2e figure render + hot-reload.
- Tier rationale recorded in the design: no new privilege, identical sandbox/CSP — but a
  changed CONCURRENCY profile, so the review includes a focused lifecycle-adversarial
  pass (TTL expiry, cap eviction, rapid remounts).

## PR-3 — `open-doc` handoff + polish (ordinary tier)

- `bridge.ts` `open-doc` (id validated, existence via the read dep, navigation-consumption
  fencing reused); `examples/views/references/view-authoring-v0.md` updated; distribution
  drift gates re-run; e2e View → open-doc → reader.

## Sequencing, estimate, non-goals

1 → 2 → 3; ~a week at the demonstrated cadence, PR-1 the bulk. Non-goals per the design:
no editing, search, reserved files, raster images (conscious v1 deferral), server-side
markdown, shell task board. No interference with tasks/task-system-board-ui.

[implements](../designs/doc-reader.md)

[direction record](../roadmap-items/launcher-home-surface.md)
