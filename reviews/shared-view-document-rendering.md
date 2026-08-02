---
type: Review
title: 'Independent review: shared bounded document rendering'
actor: openai/codex
timestamp: '2026-08-02T16:09:05.058Z'
---
# Independent design review — shared bounded document rendering

**Date:** 2026-08-02  
**Verdict:** Approve after changes. The governing design incorporated every finding before being
marked implementation-ready.

Reviewed artifact: [shared bounded document rendering for portable Views](../designs/shared-view-document-rendering.md).

# Scope reviewed

The reviewer read the proposed design and traced the current implementation in
`packages/markdown-renderer`, `packages/view-runtime`, `packages/ui-server`,
`packages/mcp-app`, and the web document reader. The review challenged the bridge boundary,
package direction, serialized-HTML safety, link semantics, version/freshness behavior, sequencing,
and whether the work reduces real authoring friction.

# Findings

## 1. Preserve the ui-server package-direction gate — P1, empirical

Directly importing the Markdown package from `ui-server` would violate its mechanically enforced
dependency direction. The renderer must be injected at composition roots: CLI passes it through
`UiServerOptions`, ui-server forwards only the view-runtime interface, and MCP injects it directly.

**Disposition:** Incorporated.

## 2. Define an inert static output profile — P1, empirical

The existing React renderer constructs internal anchors and disabled task inputs, while the MCP
presentation currently performs additional cleanup. A safe helper cannot merely serialize that
tree. The shared renderer must construct an inert profile directly: normalized concept-id markers,
inert task markers, and no URLs, forms, events, or active content. Hosts must not each clean up the
result.

**Disposition:** Incorporated with adversarial final-fragment tests required.

## 3. Do not imply resolver-approved targets exist — P2, empirical

The concept resolver validates and normalizes syntax; it intentionally preserves links to absent
documents. A marker therefore carries a normalized concept id and a later render may return
`NOT_FOUND`. The host should not add N+1 existence reads.

**Disposition:** Incorporated.

## 4. Treat unmodified insertion as guidance — P2, reasoned

A locally approved View is executable code and can alter any returned string. The product can
guarantee that the fragment is inert when produced and advise unmodified insertion, but cannot make
the View's later behavior a security invariant.

**Disposition:** Incorporated.

## 5. State the freshness rule — P2, reasoned

The same-read version receipt and pre/post launch revalidation are correct. A View must retain that
version and re-render when a subscription event reports a different one, rather than mixing later
metadata with earlier rendered content.

**Disposition:** Incorporated.

## 6. Keep the first two implementation units separate — P2, sequencing

Generated MCP presentations are already a real consumer for the static helper. Prove and land that
helper under output parity first, then add the wider bridge capability using the proven boundary.

**Disposition:** Incorporated.

# Survived attacks

- `render-document` is the right boundary; arbitrary `render-markdown` loses identity, version,
  relative-link context, and useful constraints.
- Injection is preferable to adding React/Markdown dependencies to `view-runtime`.
- Returning a bounded safe HTML string across `postMessage` is justified; an AST would force every
  View to rebuild rendering semantics.
- Inert concept-id markers are materially better than automatic shell navigation.
- Exact version receipts plus launch revalidation handle concurrent changes honestly.
- This is not speculative framework work: durable Views already duplicate Markdown
  approximations, and the latest-documents interaction is a concrete consumer.

# Final assessment

With the corrections above, the design is implementation-ready. The work should reduce View code
and security-sensitive reinvention while making one durable View behave consistently in web and
MCP hosts.
