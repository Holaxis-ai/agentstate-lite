---
type: Research
title: 'MCP App presentation sizing: protocol evidence and View variant recommendation'
actor: openai/codex
timestamp: '2026-07-27T12:32:08.333Z'
---
# Decision

Treat a durable View as one semantic object with shared identity, data selection, access, and
action authority, but do not assume that one HTML entry is suitable for every presentation.
Conversational inline and desktop workspace use materially different layout contracts. A View may
reuse one responsive entry when it genuinely satisfies both, or provide host-aware presentation
variants under the same View identity.

Do not expose every registered desktop View as conversationally compatible. Promotion and
discovery must become presentation-aware before they are implemented.

# The three sizing layers

1. **Host container.** The MCP host owns the outer iframe. `containerDimensions` tells the View
   whether each axis is fixed, flexible up to a maximum, or unbounded.
2. **MCP App document.** With SDK auto-resize enabled, the App reports its intrinsic document size
   through `ui/notifications/size-changed`; a compliant host with a flexible axis resizes the
   outer iframe.
3. **AgentState durable View frame.** AgentState currently mounts the selected View in a second,
   opaque-origin iframe. The outer App cannot inspect that child's document height. Today that
   iframe has `width: 100%` and `min-height: 18rem`, but no child-to-shell height relay. The MCP
   SDK can therefore size the App shell correctly while the actual View remains a 288px internal
   scroller.

The third layer—not the MCP protocol—is the current AgentState constraint.

# Protocol and host evidence

The stable MCP Apps specification defines fixed, flexible, and unbounded container axes. When an
axis is flexible, hosts MUST honor `ui/notifications/size-changed`; the SDK's `autoResize` behavior
emits those notifications by default. Display mode is negotiated: Views declare supported modes,
inspect the host's available modes, request a change, and must accept that the returned mode can
differ from the requested one.

Sources:

- [MCP Apps stable specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [MCP UI host context API](https://apps.extensions.modelcontextprotocol.io/api/interfaces/app.McpUiHostContext.html)
- [OpenAI plugin UI reference](https://developers.openai.com/plugins/reference)
- [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines)

## Official reference-host experiment

Tested `modelcontextprotocol/ext-apps` v1.7.5, the same SDK version currently used by
`@agentstate-lite/mcp-app`, with its official Basic Host and Basic React/Debug servers in Chromium.

| Case | Outer iframe | Inner document | Result |
| --- | --- | --- | --- |
| Basic app, 1280px viewport | 1246 × 429 | 1240 × 423 | Flexible height honored; no inner scroll |
| Basic app, 480px viewport | 446 × 429 | 440 × 423 | Width contracted; no inner scroll |
| Basic app, 390px viewport | 356 × 453 | 350 × 447 | Content reflow increased height; no inner scroll |
| Long debug app, 1280px viewport | 1246 × 2108 | 1240 × 2102 | Long inline document expanded |
| Long debug app, 480px viewport | 446 × 2195 | 440 × 2189 | Narrow reflow expanded height |
| Long debug app, 390px viewport | 356 × 2549 | 350 × 2543 | Narrow/mobile-like reflow expanded height |
| Explicit `800×600` notification | 1246 × 606 | — | Host honored requested height |
| Fullscreen request, 1280 × 900 viewport | 1248 × 868 | — | Host negotiated viewport-sized presentation |

The reference host advertises a flexible `maxHeight: 6000` and inline/fullscreen modes. These
measurements prove that implementation's behavior; they do not make its exact cap or fullscreen
geometry portable product guarantees.

## Codex/ChatGPT host

The current conversation successfully rendered the AgentState generated-view and Markdown proofs
inline. The host's exact iframe dimensions could not be machine-inspected in this run because the
desktop host blocks automation access to its own UI. Treat the visual proof as evidence that inline
rendering works, not as evidence for exact dimensions.

OpenAI's documented host extensions expose intrinsic-height notification, maximum height,
safe-area, display mode, and requests for fullscreen/PiP. OpenAI's product guidance is stricter
than the protocol:

- every App begins inline;
- an inline card should be lightweight and single-purpose;
- it should have at most two primary actions;
- it should avoid deep navigation and nested scrolling;
- fullscreen is for richer exploration that cannot fit a single card.

# Capability table

| Capability | MCP Apps contract | Official Basic Host | OpenAI documented host | Current AgentState shell |
| --- | --- | --- | --- | --- |
| Responsive CSS inside the View | Supported | Supported | Supported | Supported |
| View learns fixed/flexible container bounds | Supported through host context | Supported | Documented through host globals/context | Host context received but not used for layout policy |
| Outer iframe follows intrinsic height | Required for flexible axes | Verified | Documented | SDK auto-resize is on |
| Nested durable View follows its content height | Not a host concern | Not applicable | Not applicable | **Unsupported today** |
| Request fullscreen | Negotiated, advisory | Verified | Documented | Not declared or requested |
| Request PiP | Negotiated, advisory | Unsupported by Basic Host | Documented; mobile may coerce | Not declared or requested |
| Inline long content without nested scroll | Host-dependent cap | Verified up to 2549px | Guidance says auto-fit up to mobile display area | Not reliable because inner iframe is fixed-minimum |
| Compact action confirmation | App responsibility | Possible | Inline guidance favors simple in-flow actions | Current fixed overlay can create a second scroll area |

# Product recommendation

## One View identity, optional presentation variants

Keep one `type: View` registration as the authority for:

- stable View ID and purpose;
- access level and approval identity;
- query/data-selection semantics;
- governed action vocabulary;
- authoring provenance.

Allow presentation compatibility to be explicit. The lowest-commitment eventual registry shape is
an optional presentation map or equivalent metadata:

- `workspace`: the existing full-page entry;
- `inline`: a compact conversational entry;
- optionally `fullscreen`: either the workspace entry or a dedicated rich entry.

The exact field spelling is not decided by this research. Preserve the current `entry` as the
workspace/default entry for compatibility. A single entry may declare compatibility with multiple
surfaces only when tested at their constraints; variants are optional, not mandatory duplication.

This is analogous to responsive product surfaces sharing a domain model and controller while
having different compositions—not separate products and not separate security models.

## Safe conversational defaults

- Begin inline and assume fullscreen can be refused.
- Prefer a summary, a bounded list, one clear decision, or one/two actions.
- Let the App document contribute intrinsic height; do not create nested scrolling by default.
- For rich desktop Views, provide a compact inline summary and request fullscreen for exploration.
- Use host context to adapt, but preserve usable inline fallback.
- Keep confirmation in trusted shell chrome. In inline mode it should participate in document
  flow rather than rely on a fixed overlay constrained to a 288px child frame.

# Minimal enabling proof

Before promotion/discovery:

1. Add a narrow, shell-owned child-size signal for the opaque nested View iframe. The shell must
   validate `event.source`, bind the signal to the current launch/epoch, clamp untrusted requested
   dimensions to a conservative host-aware maximum, and update only the child frame height.
2. Confirm that the outer SDK auto-resize then propagates the resulting shell height to both the
   official reference host and the Codex conversation host.
3. Exercise short, long, narrow, live-growth, and confirmation states without nested scrolling.
4. Only after the shell behaves correctly, prototype inline/fullscreen declaration and an
   optional inline entry under one View ID.

Do not add arbitrary "preferred width/height" metadata to View documents. Exact dimensions are
host-owned and advisory. Presentation compatibility plus responsive content is the stable concept.

# Consequence for discovery and promotion

The generic catalog remains the right direction, but it must return only presentations compatible
with the invoking host/mode—or label unavailable modes honestly. `show_view({ viewId })` remains
the generic invocation path; it should resolve the best compatible entry without making the model
choose raw HTML paths.

The next implementation unit is therefore the nested-frame intrinsic-sizing proof. The
promotion/discovery design follows it and should define presentation-aware registry semantics
instead of treating every desktop View as automatically conversational.

