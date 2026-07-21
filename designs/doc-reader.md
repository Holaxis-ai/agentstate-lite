---
type: Design
title: The doc reader — the window's second act (v1)
actor: mike/claude
timestamp: '2026-07-21T17:52:33.411Z'
---
# The doc reader — the window's second act (v1)

**Status:** Drafted 2026-07-21 after Unit 1 (home surface) shipped whole (PRs #135/#137).
Distills the "second act" recorded on [the home-surface design](../designs/home-surface.md)
plus the founder conversation that settled its open decisions. NEXT: independent design
review, then Mike's build go — the doc reader has been decision-gated since the layer
boundary was written, and this doc is the artifact that decision approves.

## Why (the value case, pressure-tested)

The home surface can now orient, pulse, and tell the truth about sharing — but the human
window still cannot show a DOCUMENT. Knowledge renders only through authored Views, so a
bundle full of decisions and notes presents as cards-about-apps, and the tutorial loop
dead-ends: agent writes → human sees an activity row → nothing to read.

1. **The floor under the View ceiling.** Every bundle becomes readable day-zero, zero
   authoring. Views stay the purpose-built layer; the reader is the universal one.
2. **The loop completes.** Steering requires reading the decision itself, not knowing one
   exists. Test-user tutorial gains its missing last beat: watch it land → READ it.
3. **Links become navigation.** Cross-links are the product's core data model and are
   currently invisible to humans (CLI-only). Reader links + derived backlinks make the
   graph walkable. Evidence that this is missing: `examples/views/pulse.html:219` carries a
   hand-rolled "tiny markdown" renderer whose rendered links GO NOWHERE — inside the
   sandbox there is no destination to link to. The reader creates the destination.
4. **Docs become URLs** — deep-linkable within the session, emittable by agents.

## Relationship to View authoring (a protocol, not a competition)

The reader absorbs the READING half of Views and leaves them purely lenses:

- **`open-doc` is an offer, never a mandate.** A View shows its lens (board card, roadmap
  row, chart) and MAY hand reading to the shell via the bridge; a View that wants custom
  doc presentation keeps bridge `read` and its own renderer. Nothing is removed.
- **Generated Views get thinner and more reliable** — today every content-showing View
  inlines its own renderer (the pulse pattern); post-reader, an agent-generated View is a
  lens that links into one shared reader. This directly strengthens the generative-view
  story (tasks/ui-generative-chat).
- **The layer boundary becomes mechanical**: shell = format-universal reading (markdown,
  frontmatter, links, kind-DECLARED chips); Views = domain interaction. The standing
  guard survives unchanged: the shell never grows a task board.
- **Figures give HTML artifacts a home inside narrative** — a doc carrying its live
  diagram, papers-with-figures style; a capability that exists nowhere today.

## Decision (the five settled items)

1. **Renderer + security boundary.** micromark with dangerous HTML OFF: raw HTML in doc
   bodies is ESCAPED, never executed — the reader renders in the SHELL origin
   (unsandboxed), so this is a genuine new trust boundary. The reader PR lands in the
   HIGH-RISK review tier (builder → independent review → adversarial QA) with an
   injection-corpus battery pinned red (script/style/event-handler/URL-scheme vectors,
   frontmatter-sourced strings included — titles and field values render too).
2. **Link semantics: core's ONE resolver.** `resolveConceptId` (core/src/links.ts) —
   the browser resolves a doc link exactly as the CLI and reference-graph builder do
   (gate 3; no second resolver). Resolved doc links → `?view=doc&id=…` routes
   (deep-linkable; `parseRoute` gains a `doc` view). Unresolved links render as inert
   text, honestly styled. Backlinks are DERIVED via the existing `/__ui/edges?to=` route —
   no new endpoint.
3. **Figures.** A markdown IMAGE whose resolved target is a `views/` (or legacy `pages/`)
   blob renders as an inline SANDBOXED figure — the existing mint/nonce/CSP machinery,
   embedded instead of full-frame, with caption chrome naming the blob key. A plain LINK
   to a registered View opens it full-frame via the existing route. No new convention
   field, no new privilege: a figure is a page launch with a smaller frame, and
   revoke/hot-reload ride PageFrame's existing lifecycle semantics.
4. **Bridge `open-doc`.** The versioned sibling of `open-page` (same validation posture,
   navigation-consumption fencing included). Deferred to the unit's LAST PR — nothing
   else depends on it.
5. **Bundle-size budget.** The renderer adds to the embedded UI assets and therefore the
   bot-committed plugin artifact. Budget: ≤ ~75 KB added; the reader PR MEASURES and
   states the delta so artifact growth is a number, not a surprise.

One mechanical prerequisite: core's `links.ts` needs a subpath export (the SPA already
runtime-imports `core/query-filter`, `/kinds`, `/page` — established pattern; one
exports-map line, rides the first PR).

## Reader surface (what renders)

Frontmatter as a header card — kind pill, kind-declared status chips (mechanism in the
shell, meaning from the bundle via `/__ui/kinds`), actor + freshness; the body typeset
with the shell's format-level typography; figures inline; a derived "Cited by" section.
Entry points: activity-feed rows, card provenance, doc links, deep links. Live: the doc
page refetches on SSE change for its id (the established invalidate-and-refetch posture);
a deleted doc lands in an honest terminal state, mirroring PageFrame's revoke.

## Build shape (plan doc to follow)

PR-1 reader core (routes + DocPage + injection battery — HIGH tier) → PR-2 figures
(ordinary) → PR-3 `open-doc` + View handoff + deep-link e2e (ordinary). Roughly a week at
the demonstrated cadence; PR-1 is the bulk.

## Out of scope

Editing anything (the reader is read-only; writes remain `bundle-propose` + trusted
confirmation), doc search, rendering reserved files (`index.md`/`log.md`), a shell task
board (standing verdict), remote-mode divergence (the reader works identically over
`--remote` — it consumes the same `/v0` + `/__ui` surfaces), and any second markdown
parser server-side (rendering is SPA-only; the engine never learns about HTML).

[the second act as first recorded](../designs/home-surface.md)

[direction and conversation record](../roadmap-items/launcher-home-surface.md)

[the deferred checklist this expands](../plans/home-surface-build.md)

[strengthens generative view authoring](../tasks/ui-generative-chat.md)
