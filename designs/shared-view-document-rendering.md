---
type: Design
title: Shared bounded document rendering for portable Views
actor: openai/codex
timestamp: '2026-08-02T16:03:27.148Z'
---
# Shared bounded document rendering for portable Views

**Status:** Proposed for independent review, 2026-08-02.

## Decision

Give every authorized durable View the same bounded interpretation of an AgentState document body,
regardless of whether the View is launched in the web UI or through an MCP App. The View keeps full
control of composition, styling, selection, and interaction. AgentState supplies only safe semantic
HTML for one canonical document version.

The additive bridge operation should be document-centric (`render-document`), not a general
`render-markdown` utility. A request names a bundle document id; the host reads that exact document,
applies the existing shared bounded renderer, and returns a versioned safe fragment. This preserves
document identity, relative-link resolution, resource bounds, and freshness semantics in one
authority. It also avoids turning the bridge into an arbitrary string-to-HTML service.

This design advances the [Conversational Views through MCP Apps](../roadmap-items/conversational-mcp-views.md)
roadmap item and supersedes only the Markdown-rendering portion of the older mixed
[Page bridge v1 task](../tasks/ui-pages-bridge-v1.md).

## Problem

AgentState already has one shared Markdown interpreter in `@agentstate-lite/markdown-renderer`.
The web document reader uses it directly, and generated MCP presentations use it through the
trusted shell's `data-aslite-markdown` binding. A durable View, however, receives raw document
bodies through the shared View bridge and has no way to ask either host for the same interpretation.

That mismatch has three visible costs:

1. A portable View cannot render a selected document consistently across web and MCP without
   carrying its own parser.
2. Several bundle Views already contain small, divergent Markdown approximations.
3. The most reusable feature is accidentally attached to transient generated MCP HTML rather than
   to the durable View model that both hosts share.

This is not a request for AgentState to own a View's visual design. It is a request for one stable
authority to interpret untrusted Markdown safely while the View owns presentation.

## Product promise

A View can query or select document ids, ask AgentState to render one of those documents, place the
result anywhere in its own layout, and style the semantic elements with its own CSS. The same View
source works unchanged in the web launcher, the inline MCP surface, and the MCP expanded surface.

For example, a “latest documents” View may:

1. query the five newest documents;
2. render its own selectable list;
3. call `render-document` for the selected id;
4. insert the returned fragment into a panel it owns; and
5. handle an inert resolved concept-link marker by rendering that target in the same panel.

No shell-provided drawer and no host-specific View flavor are required.

## Proposed bridge contract

Add one request to the existing read-only `v0` View bridge:

```json
{
  "bridge": "v0",
  "id": "render-7",
  "type": "render-document",
  "docId": "designs/example"
}
```

Successful reply data:

```json
{
  "document": {
    "id": "designs/example",
    "version": "sha256:..."
  },
  "html": "<div data-aslite-rendered-document>...</div>",
  "bounded": false
}
```

The reply intentionally does not repeat frontmatter or raw body. A View needing those may use
`read`; a View needing only presentation should not pay for both representations. The version says
which exact read produced the fragment and lets the View reason honestly about refreshes.

`render-document` is data-bearing and therefore requires the same `bundle-read` or
`bundle-propose` launch authority as `read`. Existing pre-request and post-request launch
revalidation remains mandatory. The operation is additive within `v0`; an older host returns the
existing unsupported-request error rather than silently changing behavior.

## Rendering and styling contract

AgentState returns a safe semantic fragment, not a themed component:

- Markdown headings, paragraphs, emphasis, lists, blockquotes, code, tables, task markers, and
  other already-supported constructs keep their semantic elements.
- Raw HTML stays escaped or inert under the current closed-construction renderer.
- The fragment has one stable root marker, `data-aslite-rendered-document`.
- Existing stable `doc-*` classes may remain for constructs that cannot be targeted cleanly by
  element name alone. This contract should not add a large styling vocabulary.
- No inline styles or shell theme are returned. The View's CSS owns typography, spacing, colors,
  containment, and layout.

Concept links need a host-neutral representation. The renderer must not emit a raw Markdown URL.
For the first slice, a link accepted by the existing concept-id resolver becomes inert semantic
content carrying only the resolved target id in `data-aslite-doc-id`; rejected, external, reserved,
or non-document links remain inert text. The View may use event delegation on that marker and call
`render-document` for the resolved target. There is no automatic navigation and no `href` in the
returned fragment.

Insertion into the View DOM is necessarily an HTML-string boundary because the trusted host and
opaque-origin View communicate through messages. The authoring contract must say that
`innerHTML` is permitted only for the unmodified `html` value returned by this operation. A View
must not concatenate bundle data, user input, or its own strings into the trusted fragment.

## Owning architecture

Do not make `@agentstate-lite/view-runtime` depend directly on React or the Markdown package.
Its current direction—Node plus core—is valuable, and rendering is a host-provided capability.

Instead:

1. Extend `@agentstate-lite/markdown-renderer` with one static-fragment helper built from the same
   parser, closed React construction, bounds, and concept-id resolver as `renderMarkdown`.
2. Add an optional renderer dependency to `BridgeServiceOptions`. `BridgeService` continues to
   own request parsing, authorization, exact versioned reads, body/reply bounds, and the response
   shape; the injected function owns only interpretation of the already-read document body.
3. Have both `@agentstate-lite/ui-server` and `@agentstate-lite/mcp-app` inject that same helper.
   Neither host implements its own request semantics or parser.
4. Keep the existing generated-presentation binding on the same helper. It becomes another
   consumer of the shared rendering authority, not a privileged second implementation.

If a host intentionally omits the renderer dependency, the bridge returns a typed unsupported
error for `render-document`. The shipped web and MCP hosts must both provide it.

The injected seam should accept the canonical `id` and body and return `{ html, bounded }` only.
It must not read storage or decide authorization. This keeps one document read and one version
receipt inside `BridgeService`, where the race-sensitive semantics already live.

## Safety properties

This capability does not grant a View access to new bundle data: an authorized View can already
read the same raw body. It reduces the amount of parser and sanitization code bundle authors need
to write. The implementation must nevertheless preserve these properties:

- `render-document` is unavailable to `access: none` Views.
- Launch authority is checked before and after the exact versioned read and render.
- Existing document-body and total-reply byte limits still apply; Markdown node/depth/body limits
  may only tighten those bounds.
- Returned markup is created by the existing closed renderer, never from raw HTML passthrough.
- No script, event handler, form control, image fetch, embedded frame, inline style, raw URL, or
  executable navigation enters the fragment.
- The renderer receives no View-provided Markdown in the first slice.
- MCP and web use the same request parser, bridge service, rendering helper, and agreement cases.

The renderer's current web-document navigation callback cannot be serialized into a fragment.
The static helper therefore represents resolved concept links as inert data markers; it does not
simulate clicks or invent a second navigation authority.

## Implementation units

### Unit 1 — shared static rendering authority

- Add the static helper to `@agentstate-lite/markdown-renderer` without forking the parser/walk.
- Preserve current bounds and raw-link invariant with focused adversarial tests.
- Replace the generated MCP presentation's private React-to-static conversion with the helper.
  This proves the helper against an existing consumer and deletes duplicated conversion logic.

### Unit 2 — portable bridge capability

- Add and parse `render-document` in `BridgeService`.
- Inject the renderer from both shipped hosts.
- Add one cross-host agreement row proving identical success, denial, not-found, bounded, and
  changed-launch outcomes.
- Update the shipped View-authoring contract with a small copy-paste client method and styling
  example.

### Unit 3 — bundle dogfood and deletion

- Update the core user-journey View to render linked supporting documents through the new method.
- Migrate one existing View that currently carries a Markdown approximation.
- Record the remaining duplicated renderers as concrete deletion candidates; remove them in small
  follow-ups rather than coupling every bundle View to the runtime PR.
- Prove the same durable View in the web launcher and MCP expanded surface.

Units 1 and 2 may ship together if separating them would leave an exported helper with no new
consumer or require duplicate review overhead. Unit 3 is bundle content and should not be bundled
into the runtime PR.

## Acceptance criteria

The architecture is ready to implement when an independent review agrees that:

1. the bridge remains document-centric and read-only;
2. renderer injection preserves package direction and one semantic authority;
3. the fragment contract lets a View style and compose freely without accepting active markup;
4. concept links disclose only resolver-approved document ids and remain inert by default;
5. both shipped hosts have agreement coverage over the same operation; and
6. the first dogfood View contains no Markdown parser of its own.

The feature is complete when a fresh agent can author a durable latest-documents View once, launch
it in web and MCP, select documents, render their Markdown using AgentState's standard semantics,
and follow resolved document references within the View—without reading product source or adding a
third-party Markdown library.

## Explicit non-goals

- Arbitrary View-authored Markdown rendering.
- A shell-owned document drawer or modal.
- External-link opening.
- Automatic `open-document` or host navigation.
- Mutation, editing, or action-authority changes.
- A new MCP-only View format.
- A second Markdown AST or renderer in `view-runtime`, `ui-server`, or `mcp-app`.

## Alternatives rejected

**Each View bundles a parser.** This maximizes portability outside AgentState but reproduces a
security-sensitive interpretation boundary in every View and guarantees drift.

**Return Markdown AST/JSON.** This avoids an HTML-string boundary but makes every View rebuild the
semantic renderer and styling hooks. It moves complexity to authors without reducing data access.

**Expose arbitrary `render-markdown(markdown)`.** This is broader than the current need, loses
canonical document identity/version/link context, and creates an unnecessary transformation
service for View-controlled strings.

**Add only `open-document`.** Host navigation is useful separately, but it cannot support an
interactive document panel composed inside a View and would preserve the web/MCP surface split.

**Put React rendering directly in `view-runtime`.** That makes a security and authorization
authority depend on a UI stack and reverses the package boundary for convenience.

