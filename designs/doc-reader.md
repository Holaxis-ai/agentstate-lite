---
type: Design
title: The doc reader — the window's second act (v1)
actor: mike/claude
timestamp: '2026-07-21T18:26:51.138Z'
---
# The doc reader — the window's second act (v1)

**Status:** Drafted 2026-07-21 after Unit 1 shipped; **rev 2 same day** — independent
pre-build review (APPROVE-WITH-CHANGES,
[review record](../context-notes/doc-reader-design-review.md)) folded in: the render
chain is now AST→React (no HTML-string intermediate), the load-bearing href invariant is
stated, `links.ts` must shed `node:path` (an EMPIRICAL build-breaker as previously
planned), gfm is in scope, and the figure lifecycle is specified for concurrency. Build
plan: [plans/doc-reader-build](../plans/doc-reader-build.md). Mike's build go is the
gating decision this doc carries.

## Why (the value case, pressure-tested)

The home surface orients, pulses, and tells the truth about sharing — but the human
window still cannot show a DOCUMENT. Knowledge renders only through authored Views, so a
bundle full of decisions presents as cards-about-apps, and the loop dead-ends: agent
writes → human sees an activity row → nothing to read.

1. **The floor under the View ceiling.** Every bundle readable day-zero, zero authoring.
2. **The loop completes.** Steering means reading the decision itself; the test-user
   tutorial gains its missing last beat: watch it land → READ it.
3. **Links become navigation.** Cross-links are the core data model and are invisible to
   humans today. Evidence of the gap: `examples/views/pulse.html:219` hand-rolls a "tiny
   markdown" renderer whose rendered links GO NOWHERE — the sandbox has no destination.
   The reader creates the destination, plus derived backlinks.
4. **Docs become URLs** — deep-linkable, agent-emittable.

## Relationship to View authoring (a protocol, not a competition)

The reader absorbs the READING half of Views and leaves them purely lenses: `open-doc` is
an offer, never a mandate (bridge `read` + own rendering remains available); generated
Views get thinner and more reliable (strengthening tasks/ui-generative-chat); the layer
boundary becomes mechanical (shell = format-universal reading; Views = domain
interaction; the shell never grows a task board); figures give HTML artifacts a home
inside narrative.

## The security boundary (rev 2 — the load-bearing section)

Untrusted bundle content renders in the SHELL ORIGIN (unsandboxed). Three belts, each
independently sufficient for its class:

1. **Renderer escape:** micromark + micromark-extension-gfm with dangerous HTML OFF — raw
   HTML in a body is escaped text, never markup.
2. **Closed construction:** the renderer's AST/events (mdast) map DIRECTLY to React
   elements — there is NO HTML-string intermediate, NO DOMParser step, NO innerHTML
   anywhere (a grep gate bans `dangerouslySetInnerHTML` in the reader path). The
   "allowlist" is a CLOSED SET of mdast node types, not an open tag/attr list over
   browser-parsed HTML; unknown node types render as text. React auto-escapes children
   and attributes.
3. **The shell's own CSP** (`ui-server/src/assets.ts`): `script-src 'self'` — no inline
   script, no event-handler attributes, no `javascript:` navigation executes even under a
   hypothetical total bypass of belts 1–2.

**THE invariant (pinned first, red):** anchor/image attributes are BUILT from the
RESOLVER'S OUTPUT only — a raw markdown href/src never reaches any DOM attribute. A
resolved doc link becomes the `?view=doc&id=…` route; anything the resolver rejects
renders inert. The injection battery treats URL-SCHEME vectors as first-class alongside
tag injection: `javascript:`/`data:`/`vbscript:` autolinks and link targets,
entity-obfuscated (`&#106;avascript:`) and whitespace-split schemes, plus the raw-HTML
set (`<img onerror>`, `<svg onload>`, `<math>`, `<iframe>`, `<style>`, comment/
`<template>`/`<noscript>` mXSS shapes) and frontmatter-sourced strings — all inert.

**Resource bounds:** a body-size cap with an honest truncation notice (the AXI `read`
truncation's human analog) and a bounded render walk (max nodes/depth) — pathological
docs land on the trusted tab and must degrade, not hang.

## Decision (the settled items, rev 2)

1. **Renderer:** micromark + gfm (tables, strikethrough, task lists — the shipped
   authoring contract alone carries 11 table rows), dangerous HTML off, AST→React per the
   boundary above. Size budget: **≤ 40 KB gzipped** added to the embedded assets
   (micromark ≈14 KB gz + gfm ≈10–15 KB gz); the PR measures and states the delta in
   gzip terms.
2. **Link semantics:** core's ONE resolver, `resolveConceptId` — **which first sheds its
   `node:path` import** (pure posix string logic; today's import fails browser bundling
   outright, and a browser-side reimplementation would fork the one resolver, violating
   gate 3). A node↔browser PARITY test pins identical resolver output across runtimes.
   This edit is part of the HIGH-RISK surface — the resolver is the scheme-smuggling
   defense. Resolved links → `?view=doc&id=…`; unresolved → inert text; backlinks via the
   existing `/__ui/edges?to=`.
3. **Figures:** a markdown IMAGE whose target resolves to a REGISTERED View's entry blob
   renders as an inline sandboxed figure (existing mint/nonce/CSP; caption chrome; no new
   privilege). Rev 2 specifics: (a) figure targets need their OWN small blob-key
   resolution (`resolveConceptId` is `.md`-only) + a CLIENT-SIDE registration check
   against the launcher's registry list BEFORE minting — an unregistered target renders
   inert text, never a minted-403 error frame; (b) **re-mint on every (re)mount** — a
   nonce URL is never cached across a mount boundary (the 120 s nonce TTL otherwise 403s
   a remounted figure); (c) lifecycle/cap tests: >120 s remount still renders;
   figure-heavy browsing under the 256-launch registry cap never evicts a visible figure
   without recovery. A plain LINK to a registered View opens full-frame.
4. **Bridge `open-doc`:** versioned sibling of `open-page`, deferred to the unit's last
   PR; the shipped authoring contract is updated with it.
5. **Raster images: deliberately OUT in v1.** `![](x.png)` renders as inert text — a
   conscious deferral, not an accident: session-authed same-origin `<img>` over blob
   routes is a natural follow-up needing its own small look, not a silent rider.

## Reader surface

Frontmatter as a header card (kind pill, kind-declared chips via `/__ui/kinds`, actor,
freshness); body typeset with the shell's format-level typography; figures inline;
derived "Cited by". A back-to-home affordance (the doc page is a shell surface — Blue
accent, like PageFrame's bar). Entry points: activity rows, card provenance, in-body
links, deep links. Live: SSE invalidate-and-refetch per doc id; deleted → honest terminal
state (PageFrame's revoke posture); unknown id → an honest not-found state.

## Build shape

PR-1 reader core (de-`node:path` + parity, routes, DocPage, AST→React renderer +
battery — HIGH tier: builder → independent review → adversarial QA aimed at the belts) →
PR-2 figures (ordinary tier WITH a focused lifecycle-adversarial check scoped into its
review — no new privilege and identical sandbox/CSP, but a changed concurrency profile;
rationale recorded here) → PR-3 `open-doc` + contract update + deep-link e2e (ordinary).
About a week at the demonstrated cadence.

## Out of scope

Editing (reader is read-only; writes stay `bundle-propose` + trusted confirmation), doc
search, reserved-file rendering, raster images (decision 5), server-side markdown of any
kind (the engine never learns HTML exists), a shell task board (standing verdict), and
remote-mode divergence (same `/v0` + `/__ui` surfaces by construction).

[the second act as first recorded](../designs/home-surface.md)

[direction and conversation record](../roadmap-items/launcher-home-surface.md)

[build plan](../plans/doc-reader-build.md)

[the deferred checklist this expands](../plans/home-surface-build.md)

[strengthens generative view authoring](../tasks/ui-generative-chat.md)
