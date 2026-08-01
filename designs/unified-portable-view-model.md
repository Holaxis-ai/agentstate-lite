---
type: Design
title: 'One portable View model: author once, invoke anywhere'
actor: openai/codex
timestamp: '2026-08-01T20:05:50.666Z'
---
# One portable View model: author once, invoke anywhere

## Status

Revised product and architecture direction after independent review. The reviewer approved the
direction with contract corrections incorporated here. This design consolidates the existing web
View and conversational MCP work; it does not introduce a third rendering system.

Parent roadmap: [Conversational Views through MCP Apps](../roadmap-items/conversational-mcp-views.md).
Independent review: [Unified portable View model review](../reviews/unified-portable-view-model.md).

The governing product invariant is:

> A View is durable bundle content. Web, MCP Apps, and future hosts are invocation adapters over
> the same View identity, source bytes, requested access, admission policy, bridge semantics, and
> authorization subject. Authorization decisions remain local to a host, process, machine, or
> principal and do not travel merely because the View does.

`show_view` is one way to invoke a View. Clicking it in the local launcher, opening it from
another View, or asking a future host to present it are other ways. None of those surfaces defines
a different kind of View.

## Problem

The implementation has substantially converged on one View model, but the agent-facing product
story still exposes the order in which features were built:

- the web launcher teaches durable bundle Views;
- the MCP tool leads with generated, invocation-specific HTML and mentions registered Views as a
  second form;
- `data-aslite-markdown` exists only for generated MCP presentation;
- durable authoring is a hand-coordinated blob promotion plus registry write;
- MCP discovery is planned as a catalog of Views declared suitable for MCP rather than a catalog
  of the bundle's Views; and
- some bridge capabilities remain host-specific (`open-page` works in the web host but is rejected
  by the MCP adapter).

This causes a predictable failure: an agent working in another bundle can see an MCP `show_view`
tool and still conclude that it cannot create, persist, and display a durable View. The underlying
capability exists; its authoring and discovery contract is not legible as one product.

## Product model

### View

A durable View consists of the existing portable pair:

1. a `type: View` registry document with stable ID, title, description, entry, and access; and
2. exact self-contained HTML bytes stored as a bundle blob.

The View is independent of its host. It travels with the bundle through local files, board sync,
recipes, export, or a future remote backend. Its identity is the registry ID; its authorization
subject is the exact current registry, entry bytes, and declared access already computed by the
shared View runtime. A host applies its own local authorization decision to that subject.

### View invocation

An invocation resolves one View ID into one current launch. The shared runtime owns resolution,
exact-byte identity, authorization, bridge dispatch, currentness, subscriptions, and governed
actions. A host adapter owns only presentation mechanics.

Equivalent invocation surfaces include:

- the web launcher opening a registered View;
- MCP `show_view({viewId})` presenting it in a conversation;
- another View requesting `open-page` for that registered ID; and
- a future CLI or hosted shell opening that same ID.

All must resolve through the same authority. A host cannot reinterpret the registry, weaken access,
or substitute different source. Portability does not require every host to support every access
level immediately: an unsupported access level must fail explicitly without creating a different
View class. Durable MCP invocation currently supports `bundle-read`, not `bundle-propose`.

### Preview

Agent-authored, invocation-specific HTML is useful, but it is not a second durable View format. It
is a **View preview**: transient presentation proposed for one invocation and mediated by the fixed
trusted shell.

The current script-free generated MCP path remains a valuable low-trust preview mechanism. Its
declarative bindings and trusted actions can remain convenient host sugar. Product language and
documentation should stop using that special path as the definition of an “MCP View.”

Promotion means re-authoring or packaging a useful preview as an ordinary durable View. Until the
two source contracts genuinely converge, the system must not imply that arbitrary preview bytes
can be persisted unchanged as an active View.

## One authoring workflow

Agents should be taught to author an **AgentState View**, not a web View or MCP View.

The existing primitive sequence remains valid but is too fumble-prone to be the primary product
contract:

1. write self-contained HTML;
2. promote it under `views/`;
3. write a matching `type: View` registry document; and
4. ensure the View convention is available when the bundle uses conventions.

The proven `artifact create` precedent and executable blob/registry pairing create a sound
independent case for the previously gated compound command. Recent cross-bundle dogfood proves an
authoring/discovery legibility failure; it does **not** by itself satisfy the earlier hypothesis
about repeated preview-to-durable promotion. The command should be unblocked only when the founder
explicitly accepts View as a mechanism-level framework exception. If accepted, the first ergonomic
unit should be create-only:

```sh
aslite view create latest-documents \
  --html ./latest-documents.html \
  --title "Latest documents" \
  --description "Browse recent documents and read their contents" \
  --access bundle-read
```

It should compose existing generic writes rather than add View storage or mutation policy:

- validate `access` with the one shared access authority;
- validate entry path, content type, UTF-8, and size through the current active-View admission
  authority rather than retyping those checks;
- choose collision-safe registry and blob keys;
- promote exact bytes;
- create the registry using create-only CAS;
- report final identities and versions;
- name an orphaned blob if registry creation fails; and
- remain convention-optional, matching the renderer's mechanism-level recognition of `type: View`.

The existing `promote` and document commands remain available as lower-level primitives. Updating
an existing View can continue through them until repeated update friction proves a `view update`
command is warranted.

This is a deliberate framework exception, not a general command per domain kind: View is a
representation and executable-trust mechanism that the hosts must recognize. Recipes remain the
extension channel for domain taxonomies.

## One discovery contract

There should be one shared `listViews` authority over valid bundle registrations. Every discovery
surface projects it:

- `aslite view list` for agents and terminal users;
- MCP `list_views` for a model connected to one bundle; and
- the web launcher for humans.

The shared result should contain stable ID, title, description, access, and validity/currentness
information needed to decide whether the View can be invoked. It must not return HTML, credentials,
nonces, approval state, or other launch secrets.

The first MCP catalog remains bounded and model-visible, but every valid View whose access the MCP
host supports must remain discoverable and invokable. It should not require
`presentation: inline | adaptive` or hide a View merely because its author imagined a large window.
A View is portable; the host owns inline, expanded, or fullscreen presentation.

The already-proposed optional `presentation: workspace | inline | adaptive` field may remain as an
advisory preference used for ranking, warnings, or initial display mode. It is never an eligibility
or security gate and never selects a different entry blob. Absence means no preference.

Bounded output must be honest: return total compatible count, deterministic ordering, whether the
result is truncated, and a bounded continuation cursor (or equivalently bounded follow-up query)
when more Views exist. A 20-row cap without continuation would still silently hide valid Views.

## One capability contract

Registered Views should receive the same semantic bridge in every supported host. The contract is
owned below adapters and tested once across them.

Current common read capabilities:

- `hello`
- `query`
- `read`
- `edges`
- `subscribe`

Governed scalar proposals are shared in concept but are not yet supported for durable MCP Views;
action parity is later capability-matrix work, not a current portability claim.

Remaining parity work should be treated as shared View work, not MCP or web features:

1. **Standard Markdown/document rendering.** Design an additive host-mediated `render-document`
   (name to be finalized) request accepting an authoritative document ID. `BridgeService` owns
   request validation, authorization, authoritative reread, captured version, and reply bounds;
   `markdown-renderer` remains the closed-construction rendering authority and is supplied through
   a narrow host-neutral seam rather than imported into `view-runtime`. Freeze the reply contract
   before implementation: exact version, bounded/truncated status, inert safe markup, and internal
   targets represented as IDs without raw navigable URLs. Both hosts implement the same semantic.
   The existing `data-aslite-markdown` preview binding then becomes sugar over that authority.
2. **View-to-View navigation.** `open-page` keeps its stable wire spelling for compatibility but
   must work in MCP as well as web. Each host decides how to present the target; both validate the
   target through the shared registration authority.
3. **Lifecycle recovery.** Suspension, remount, expansion, and reconnect are adapter concerns. They
   may rotate launch and subscription identities but must preserve the View experience without a
   new model invocation. Exact-byte approval remains valid only for the same trust subject.
4. **Agreement tests.** One fixture View should run the same bridge rows through web and MCP. Host
   tests then cover only sizing, transport, history, visibility, and other adapter mechanics.

## Host boundary

Hosts will differ, but only at the edge.

The web adapter owns URLs, browser history, launcher chrome, tabs, and its loopback transport. The
MCP adapter owns the tool/resource handshake, conversation embedding, host theme/context,
expand/fullscreen requests, intrinsic sizing, visibility suspension, and App-only relay tools.

Those differences must not affect:

- View registry shape;
- source HTML;
- access meaning;
- bridge request semantics;
- exact-byte trust identity;
- data/query behavior; or
- whether the View is considered a valid bundle View.

## Security posture

This design preserves the shared security model rather than widening it:

- bundle-provided active HTML remains sandboxed and opaque-origin;
- direct data/network credentials remain unavailable to the child;
- the trusted shell enforces declared access and exact-byte approval through a local authorization
  decision; approval does not become portable merely because the subject is stable;
- bridge schemas, response sizes, query limits, and subscriptions remain bounded;
- generated previews remain script-free and cannot silently become durable executable content;
- mutations remain governed proposals handled by trusted chrome and the shared mutation boundary;
  and
- host recovery may mint a fresh launch but cannot transfer approval to changed bytes or access.

## Relationship to existing plans

### [`designs/mcp-app-generative-views`](mcp-app-generative-views.md)

**Keep:** MCP Apps are a conversational host; the fixed trusted shell, bounded previews, and tiny
model-visible surface remain sound.

**Refine:** durable Views, not generated MCP presentation, become the central product noun.
Generated HTML is described as a preview invocation mode. MCP is an adapter, not a View subtype.

### [`designs/mcp-durable-view-promotion-discovery`](mcp-durable-view-promotion-discovery.md)

**Keep:** one existing `type: View` identity, one bounded `list_views`, generic
`show_view({viewId})`, one responsive entry, and no MCP-only persistence.

**Change:** retain `presentation: workspace | inline | adaptive` only as an advisory preference,
never a discovery eligibility rule. All access-supported registered Views remain discoverable and
invokable; display mode is owned by the host. The dogfood evidence proves the durable authoring
path is illegible, but does not complete the earlier preview-promotion experiment. `view create`
instead rests on the separate structural case and an explicit founder mechanism-level decision.

### [`designs/mcp-view-security-model-unification`](mcp-view-security-model-unification.md)

**Retain as the security authority and amend additively for new bridge rows.** Its shared
launch-bound bridge and separate provenance/authorization model enable this design. A future
`render-document` reply carries new data and therefore requires explicit bounds and adversarial
tests; this design does not claim that change is already covered.

### [`designs/view-create`](view-create.md) and [`tasks/cli-view-create-verb`](../tasks/cli-view-create-verb.md)

**Ready for an explicit founder decision.** The earlier design is the detailed implementation
authority. If accepted as a mechanism-level exception, update its legacy `bridge` option spelling
to `access`, add current active-View admission validation, and preserve its safety conditions. Do
not mislabel the current cross-bundle discoverability failure as preview-promotion dogfood.

### [`designs/page-model-and-viewer-deprecation`](page-model-and-viewer-deprecation.md)

**Preserve the one-human-view primitive.** Its Page terminology and legacy `bridge` spelling have
since been replaced by View and `access`; the architectural decision to retire parallel renderers
is reinforced here.

### [`tasks/ui-pages-bridge-v1`](../tasks/ui-pages-bridge-v1.md)

**Re-scope.** Markdown rendering, document navigation, and change semantics belong to the shared
View bridge/runtime, not `packages/ui`. Web and MCP adapters should consume the same authority.

### [`tasks/mcp-view-authoring-guidance`](../tasks/mcp-view-authoring-guidance.md)

**Reframe.** Write one host-neutral View authoring reference, with short adapter-specific guidance
for conversational sizing and web navigation. Do not create a separate MCP authoring doctrine.

### [`tasks/view-recipe-missing`](../tasks/view-recipe-missing.md)

**De-emphasize.** A standalone View recipe is not required to make View authoring first-class. The
View mechanism is recognized by the hosts, and `view create` can be convention-optional. Recipes
may still carry View definitions as part of a portable operating model.

## Proposed sequence

1. Ratify this one-View invariant and explicitly supersede the conflicting roadmap/design/task
   language in the same decision unit.
2. Implement one shared bounded View catalog, projected as CLI `view list`, MCP `list_views`, and
   the existing web launcher; keep presentation advisory and add honest bounded continuation.
3. Consolidate authoring guidance around one durable View workflow and call generated HTML a
   preview; repeat the fresh-agent discovery journey.
4. Record the explicit founder decision on the mechanism-level `view create` exception. If
   accepted, implement the create-only command using `access`, current admission checks, and the
   existing write authorities.
5. Specify and security-review authoritative document/Markdown rendering as a new shared bridge
   row, then implement it and retire duplicated View-local Markdown parsers as Views adopt it.
6. Make `open-page` host-parity complete and add the cross-host agreement fixture; target launch
   authorization remains independent of source approval.
7. Address durable governed-action parity after read/render/navigation semantics stabilize.
8. Dogfood from a fresh agent in another bundle: discover no suitable View, author one, verify it,
   create it durably, discover it, launch it in MCP, and open the same ID in the web launcher.

## Acceptance proof

The direction is proved when a fresh agent, given only the installed AgentState capability and one
bundle, can complete this journey without reading source code or being told there are separate web
and MCP View systems:

1. list the bundle's Views;
2. create a durable “latest documents” View when none fits;
3. verify it against live bundle data;
4. invoke it in conversation by ID;
5. expand, collapse, suspend, and resume it without losing the experience;
6. open the same View from the web launcher; and
7. observe the same supported data, Markdown rendering, and navigation semantics in both, with
   unsupported access failing explicitly rather than changing View identity.

## Non-goals

- A hosted MCP service or remote bundle decision.
- A second MCP-specific View kind or durable format.
- Multiple source blobs per host or display mode.
- Automatic persistence of every generated preview.
- General agent CRUD through MCP.
- Pixel-identical host chrome or dimensions.

## Decision summary

The code has already done most of the hard architectural convergence. The remaining work is to make
that convergence the public product contract: one View, one registry, one bridge, one authoring
workflow, one discovery authority, and multiple invocation adapters.
