---
type: Plan
title: Build plan — the doc reader (three PRs)
actor: mike/claude
timestamp: '2026-07-21T18:13:58.251Z'
---
# Build plan — the doc reader (three PRs)

**Status:** Planned 2026-07-21. Builders: Mike + Claude (founder-built, same pipeline as
Unit 1). Implements [the doc-reader design](../designs/doc-reader.md). NEXT: independent
design review of design+plan BEFORE code (the Unit-1 round caught three high findings
pre-build; this unit carries a genuine new security boundary).

## PR-1 — the reader core (HIGH-RISK tier: rendered bundle content in the shell origin)

**Claim: any doc renders, safely, and the fabric links into it.**

- **core (mechanical):** add a `./links` subpath export to `packages/core/package.json`
  exposing `resolveConceptId` (the SPA already runtime-imports `core/query-filter`,
  `/kinds`, `/page` — established pattern).
- **Render pipeline (the security boundary), defense in depth:**
  1. `micromark` with dangerous HTML OFF — raw HTML in a body is ESCAPED at the renderer;
  2. the output HTML is DOM-parsed and walked through an explicit tag/attribute ALLOWLIST
     into React elements — the belt behind the renderer's suspenders, and the ONE
     transformation point where link/image targets are resolved via core's
     `resolveConceptId`;
  3. URL schemes allowlisted (relative + bundle-internal only; `javascript:`/`data:`
     etc. render inert).
  Frontmatter-sourced strings (title, actor, field values) render as TEXT nodes, never
  markup. micromark is a NEW dependency of the PRIVATE ui workspace only — the CLI's
  zero-runtime-deps contract is untouched (assets are built+embedded); the embedded-asset
  size delta is MEASURED and stated in the PR (budget ≤ ~75 KB).
- **SPA:** `routing.ts` gains the `doc` view (+`id`); `App.tsx` dispatches; new
  `DocPage.tsx` — header card (kind pill, kind-DECLARED field chips via `/__ui/kinds`,
  actor, freshness), rendered body, derived "Cited by" via `/__ui/edges?to=`, SSE
  invalidate-and-refetch for the doc id, deleted-doc terminal state (PageFrame's revoke
  posture), loading/error states. Entry points wired: activity rows, card provenance,
  in-body doc links, deep links.
- **Injection battery (pinned red):** corpus over script tags, event-handler attributes,
  `javascript:`/`data:` URLs, SVG/onload vectors, mXSS-shaped nesting, and
  frontmatter-sourced strings — asserting no script execution and no non-allowlisted DOM.
- Gates: full repo gate + e2e (open-from-feed, deep link, injection doc renders inert).
  **Review ladder: builder → independent review → adversarial QA** aimed at sanitizer
  bypass (mutation XSS through the DOM-parse step, allowlist gaps, scheme smuggling,
  pathological/huge docs).

## PR-2 — figures (ordinary tier)

**Claim: a doc can carry a live, sandboxed visual.**

- In the allowlist walk: a markdown IMAGE whose resolved target is a REGISTERED View's
  entry blob renders as an inline sandboxed figure — minted through the EXISTING
  `/__page/mint` (its allowlist already refuses unregistered keys; an unregistered target
  renders inert text). Same CSP/nonce; caption chrome names the blob key. A plain LINK to
  a registered View opens full-frame via the existing route.
- Lifecycle rides the established patterns: registry/blob change → re-mint; removal →
  figure's honest terminal state. No new privilege: a figure is a page launch with a
  smaller frame.
- Tests: transform unit tests; e2e figure render + hot-reload.

## PR-3 — `open-doc` handoff + polish (ordinary tier)

**Claim: Views hand reading to the shell and stay lenses.**

- `bridge.ts`: `open-doc` — the versioned sibling of `open-page` (id validated, existence
  checked through the read dep, navigation-consumption fencing reused in PageFrame).
- Update the shipped authoring contract (`examples/views/references/view-authoring-v0.md`)
  to document the verb; distribution drift gates re-run.
- e2e: View → open-doc → reader; pulse-style detail-pane handoff exercised.

## Sequencing, estimate, non-goals

1 → 2 → 3; PR-1 is the bulk (~a session + the heavier ladder), 2 and 3 ~a session each —
about a week at the demonstrated cadence. Non-goals per the design: no editing, no search,
no reserved-file rendering, no server-side markdown (the engine never learns HTML exists),
no shell task board. No interference with tasks/task-system-board-ui (bundle content, not
shell code).

[implements](../designs/doc-reader.md)

[direction record](../roadmap-items/launcher-home-surface.md)
