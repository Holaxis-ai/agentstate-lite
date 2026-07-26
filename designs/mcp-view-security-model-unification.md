---
type: Design
title: MCP and web View security-model unification
description: >-
  One View security and bridge model across web and MCP hosts, parameterized by
  lifecycle, execution, provenance, and authority.
actor: openai/research-agent
timestamp: '2026-07-26T23:41:21.941Z'
---
# MCP and web View security-model unification

## Status

Recommended design for independent review. This is a research/design decision, not authorization
to implement. The first implementation unit is security-sensitive and must use the repository's
security review and adversarial-QA ladder.

This design refines
[Conversational Generative Views via MCP Apps](../designs/mcp-app-generative-views.md) and
**supersedes the durable-format and sequencing recommendation** in
[Durable conversational Views: promotion, discovery, and invocation](../designs/mcp-durable-view-promotion-discovery.md).
The earlier document remains useful for its generic `list_views`, generic invocation, and
exact-byte promotion ideas. Its recommendation to create a script-free declarative durable format
before attempting the established bridge is withdrawn.

## Decision

AgentState should have **one View security and bridge model** parameterized by four independent
axes:

1. **Lifecycle:** ephemeral or durable.
2. **Execution:** passive/declarative or active/scriptful.
3. **Provenance and trust decision:** unreviewed, locally approved for exact bytes and authority, or
   package-owned.
4. **Authority:** none, read, or propose.

These axes must not be collapsed into each other. Durability is persistence and reuse, not trust.
Saving identical bytes must not change their execution mode, authority, or security treatment.
Likewise, MCP is a host adapter, not a passive-only View format.

The fixed MCP App shell is already active package-owned JavaScript. The current inner generated
presentation is passive because the spike needed a fast, portable safety boundary for unreviewed
model output after arbitrary generated JavaScript failed the no-egress proof. That was the correct
constraint for that input class. It is not an MCP Apps limitation and must not become the only
durable View architecture.

Existing active bundle Views should retain their current `postMessage` bridge contract and be
hostable by both:

- the local web shell; and
- the fixed MCP App shell, which brokers the same bridge through app-only MCP calls.

That reuse is **functionally feasible but security-conditional**. The current local sandbox
substantially isolates a View from the shell, credentials, storage, and direct bundle APIs. Current
evidence does not establish the stronger invariant that arbitrary active content granted bundle
data has no outbound signaling path. Therefore implementation must not simply copy the existing
web frame attributes into MCP and call the result safe. Before an active View receives `read` or
`propose` authority in either host, one of these must be true:

- an empirical, portable containment proof establishes the required no-egress invariant; or
- the user has deliberately approved the exact executable bytes together with the exact effective
  authority, using trust state that the synced bundle cannot grant itself.

The same rule belongs in both hosts. An MCP-only approval gate would preserve an inconsistent
security model.

Passive unreviewed presentations remain valuable and safe-by-construction within their bounded
data/action envelope. They may be ephemeral or durable. Active Views also may be ephemeral or
durable; lifecycle alone grants nothing.

## The key question

### Can one existing active durable View run under both hosts?

**Protocol and runtime answer: yes.** MCP Apps standardizes an active sandboxed UI resource,
`postMessage` communication, and App-to-server tool calls. A package-owned fixed shell can place
the existing View bytes in a nested sandbox, validate messages from that one child, and translate
the existing AgentState bridge protocol into app-only calls. The View itself neither imports the
MCP Apps SDK nor learns MCP tool names. Its bytes and bridge client can remain unchanged.

**Security answer: conditionally.** MCP Apps protects the conversation host from the fixed App.
AgentState still owns the inner boundary between its fixed App and bundle-authored content. The
MCP host's sandbox does not automatically prove every AgentState-specific confidentiality
property for that nested active content. The local web host has the same distinction. The proof
must cover the inner View's granted bundle data, not only the parent shell's cookies and DOM.

**Product answer: this is still the right direction.** It preserves one authoring model, one
registry identity, one bridge grammar, one action model, and portable Views. The correction is to
strengthen and accurately describe the common trust boundary, not to invent a second durable
format.

## Orthogonal security axes

| Axis | Values | What it controls | What it does not imply |
| --- | --- | --- | --- |
| Lifecycle | ephemeral / durable | whether the presentation survives and is discoverable later | trust, script permission, or bundle authority |
| Execution | passive / active | whether presentation-owned JavaScript executes | whether bytes are persisted |
| Provenance | unreviewed / exact-byte locally approved / package-owned | the basis for granting an active presentation authority | authority by itself |
| Authority | none / read / propose | what the trusted shell may do for the View | direct credentials or unrestricted writes |

Examples:

| Presentation | Lifecycle | Execution | Provenance | Authority |
| --- | --- | --- | --- | --- |
| Current generated MCP result | ephemeral | passive | unreviewed model output | bounded selected snapshots; optional shell-owned proposal controls |
| A saved generated report | durable | passive | unreviewed or reviewed | same bounded contract; saving changes no security property |
| Existing Roadmap bundle View | durable | active | bundle-authored; exact-byte decision required for sensitive grant unless no-egress is proved | read |
| Personal task board View | durable | active | bundle-authored; exact-byte decision required for sensitive grant unless no-egress is proved | propose |
| Fixed MCP App shell | package lifecycle | active | package-owned | app-only broker; never raw bundle authority for child code |

This model deliberately permits future combinations rather than encoding policy into format names.
For example, an ephemeral active View can exist after explicit exact-byte approval; a durable
passive View can remain unreviewed.

## Terminology

Use these terms consistently:

- **View:** an AgentState human presentation. A durable registered View is identified by a
  `type: View` registry document and an entry blob.
- **`access`:** the current registry frontmatter field declaring the authority requested by a
  durable View. Accepted values resolve fail-closed to `none`, `bundle-read`, or
  `bundle-propose`. The retired frontmatter field `bridge` must not return.
- **bridge:** the runtime message protocol and broker between presentation and trusted shell. The
  existing wire discriminators `{ bridge: "v0" }` and `{ bridge: "v1" }` remain bridge
  terminology.
- **host adapter:** web or MCP-specific transport, lifecycle, and shell integration around the
  common bridge authority.
- **fixed MCP shell:** package-owned MCP App resource. It is active code and is trusted by
  AgentState to broker only the narrow authorities defined here.
- **inner presentation:** bundle-authored or model-authored content rendered inside the fixed MCP
  shell.
- **launch:** bounded in-memory authority binding presentation provenance, effective access,
  lifetime, and any selected document versions.
- **promotion:** persistence/registration of presentation bytes. Promotion is not approval.

Internal `Page*` type and filename names are historical implementation vocabulary. Renaming them is
not part of the proving unit; do not mix a broad naming cleanup into the security change. The
`open-page` v0 wire verb also remains stable for compatibility even though its target is a View.

## Current state: local web View host

```text
bundle registry doc + entry blob
        |
        | core parseRegistration + resolveDeclaredAccess
        v
ui-server mint
  exact registry version + entry version + content type + effective access
        |
        | short-lived entry-only nonce; CSP response
        v
sandboxed active iframe (opaque origin; no bundle/session credential)
        |
        | AgentState v0/v1 postMessage
        v
packages/ui PageFrame
  event.source check + frame epoch + pre-revoke/reload fences
        |
        +--> browser bridge router --> HTTP read dependencies --> ui-server/core
        |
        +--> trusted confirmation chrome --> ui-server
                                               |
                                               v
                                     view-runtime TrustedActionService
                                               |
                                               v
                                  core mutation service + hard CAS

ui-server watcher --> SSE to shell --> v0 change message to subscribed iframe
```

### What is already strong

- Core has one strict registration grammar and one fail-closed `access` resolver.
- The server, not the frame, pairs registry identity with exact entry bytes.
- The entry nonce is distinct from the shell session credential and authorizes only one entry.
- The child has an opaque origin, no same-origin access to the shell, no direct bundle credential,
  and a restrictive resource/connect policy.
- `PageFrame` accepts messages only from the current child `contentWindow`.
- Frame generations are fenced. Reload, access downgrade, registry change, deletion, navigation,
  and reconnect pre-revoke the old capability before asynchronous re-resolution.
- V0 is read-only by construction: `hello`, `query`, `read`, `edges`, `subscribe`; `open-page` is
  a shell navigation intent.
- V1 permits only `read-versioned` and one `document.set-field` proposal under
  `bundle-propose`.
- Human confirmation is package shell chrome, not View-controlled markup.
- `TrustedActionService` revalidates launch, document version, Kind definition, field, value,
  actor, and one-shot approval before delegating to the shared mutation service with hard CAS.
- SSE reconnect does a full frame reload because the stream has no replay buffer; it does not
  pretend a reconnected delta stream caught up.

### What is host-specific today

- Loopback Host allowlist, session-token/cookie exchange, CSRF header, nonce byte route, HTTP
  router/proxy, and SSE.
- Browser API clients and React frame lifecycle.
- URL history changes for `open-page`.
- Filesystem/remote watcher mechanics.

### What is not yet a shared authority

The v0 router and v1 message parser live in `packages/ui`, even though their semantics are not
intrinsically React or HTTP. `PageFrame` correctly owns DOM-source and lifecycle fencing, but it
also wires all semantic dependencies. The MCP adapter therefore cannot consume the bridge as a
normal package dependency today.

## Current state: experimental MCP App host

```text
model calls show_view
  generated HTML/CSS + exact IDs OR bounded launch-time query
        |
        v
packages/mcp-app server
  core query selection + exact document snapshots/versions
        |
        v
McpViewLaunchRegistry
  content hash + frozen object envelope + optional declared actions
        |
        | structuredContent
        v
fixed package-owned MCP App shell (active)
        |
        +--> sanitizes/materializes selected values and shared Markdown
        |
        +--> passive nested iframe (sandbox; no scripts)
        |
        +--> package-owned action buttons and confirmation
                  |
                  | app-only prepare/finish tools
                  v
          shared TrustedActionService --> core mutation + CAS
```

### What the spike proved

- One fixed `ui://` resource can render invocation-specific results.
- The fixed shell can use active JavaScript and call same-server app-only tools.
- App-only tools can remain hidden from the model.
- Exact IDs or one bounded query can resolve deterministic current snapshots.
- Shared Markdown rendering can materialize a selected document safely.
- A human-confirmed scalar action can use the same `TrustedActionService` and core mutation
  boundary as the web host.
- The official MCP Apps host lifecycle works over the locally spawned STDIO process.

### Why the generated child is passive

It is passive because its bytes are unreviewed model output. The spike found that ordinary
iframe/CSP isolation was not, by itself, enough evidence to grant arbitrary generated JavaScript
authoritative bundle data. The smallest reliable proof was therefore:

- strip active and navigation-bearing content;
- replace only declared text/Markdown bindings in trusted shell code;
- place no object payload or credential in the child;
- render actions in trusted shell chrome.

This is a valuable execution mode. It is not a statement that MCP Apps cannot run JavaScript:
the fixed shell already does, and MCP Apps itself is an active-UI protocol.

### What is duplicated or parallel today

- `McpViewLaunchRegistry` is a second launch projection specialized for generated snapshot
  envelopes.
- MCP resolves query/IDs and freezes objects at launch; durable web Views query on demand through
  their bridge.
- MCP has no durable registry/entry resolution path.
- MCP has no v0 `hello/query/read/edges/subscribe/open-page` broker.
- Generated actions are predeclared as shell descriptors and selected by opaque `actionId`; an
  active durable View instead sends the existing v1 `action.propose` message.
- Lifecycle/change handling is refresh-after-action only, not a general subscription.

These differences are appropriate for the passive generated mode, but they must not become a
second durable View system.

## Shared authorities versus irreducible adapters

### Must be host-neutral

The following should be owned below both shells, preferably in `@agentstate-lite/view-runtime`
while core continues to own bundle semantics:

1. **Registration and effective access**
   - Continue using core's `parseRegistration` and `resolveDeclaredAccess`.
   - A launch receives effective authority from trusted resolution, never a frame claim.

2. **Launch provenance and currency**
   - Registry ID and exact registry version.
   - Entry key, content type, exact entry/content version.
   - Execution mode.
   - Effective authority.
   - Provenance/trust decision applicable to those exact bytes and authority.
   - Optional selected document/version envelope.
   - Expiration and explicit revocation.
   - One check determining whether that launch is still current.

3. **Bridge grammar and semantic router**
   - V0 request validation and bounded reply shapes.
   - V1 request validation.
   - Capability gating before data dependencies.
   - Query/read/edges semantics.
   - Navigation target validation returning an intent, not performing host navigation.
   - Subscription intent and the common `change` message shape.
   - Presentation-neutral errors and size limits.

4. **Data semantics**
   - Core's existing query-heads, shared `field/open/limit` filtering, Kind registry, document
     reads, and derived edges.
   - No MCP-specific query language and no browser-specific graph implementation.

5. **Governed actions**
   - Existing `TrustedActionService`, action parser, approval lifetime, exact confirmation,
     Kind revalidation, actor requirement, no-op semantics, and hard CAS.
   - A launch authority adapter may further confine actions to selected object versions, as the
     passive generated mode already does.

6. **Trust policy inputs**
   - Active/passive mode, exact content identity, effective authority, and trust-decision result.
   - The synced registry may request access but may not assert that its own executable bytes are
     trusted.

The host-neutral layer should return outcomes such as reply, subscribe intent, navigation intent,
prepared confirmation, or terminal error. It should not know React, `window`, HTTP, SSE, STDIO,
MCP tool registration, or host display modes.

### Must remain host adapters

| Concern | Web adapter | MCP adapter |
| --- | --- | --- |
| Process/transport | loopback HTTP or reverse proxy | host-spawned STDIO MCP |
| Trusted outer shell | React SPA | fixed MCP App resource |
| Child transport | DOM `postMessage` | nested DOM `postMessage` to fixed App |
| Server calls | same-origin HTTP + session | same-server app-only MCP tools |
| Live change carrier | SSE + reconnect reload | app-only polling first; future negotiated notification only after proof |
| Navigation | local SPA route | replace current durable launch inside fixed shell |
| Host lifecycle | React mount/unmount, server restart | `ui/initialize`, tool result, host-context changes, teardown |
| Presentation sizing/theme | local CSS | MCP host context, auto-resize, display modes |
| Authentication | local per-run session or remote proxy credential | local STDIO process; remote OAuth is a separate future boundary |

The sandbox policy itself should have a shared specification and agreement tests, while DOM
mounting and response/CSP delivery remain adapter-specific.

## Recommended target architecture

```text
                  AgentState View contract
        registry/access + launch provenance + bridge semantics
                               |
                +--------------+--------------+
                |                             |
        web host adapter                MCP host adapter
      HTTP/SSE + React shell       STDIO + fixed MCP App shell
                |                             |
       active/passive child             active/passive child
                |                             |
                +------- same bridge ---------+
                               |
                  host-neutral BridgeService
          hello/query/read/edges/subscribe/navigation/actions
                               |
                 core query/graph/kinds/mutation
                               |
                         Bundle/backend
```

### The MCP durable launch

The model-visible tool remains generic. Conceptually:

```json
{ "viewId": "views-registry/roadmap" }
```

The server must:

1. Resolve the registry with core's existing grammar.
2. Read exact registry and entry versions server-side.
3. Resolve effective `access`.
4. Determine execution mode from the content contract, not lifecycle.
5. Apply the common trust policy before granting sensitive authority.
6. Mint a bounded launch containing exact provenance.
7. Return enough fixed-shell state to open that launch without exposing a bundle credential.

Prefer an app-only `load_view_launch` call for large executable bytes after the fixed shell
connects, rather than making the model-visible tool result the durable byte channel. The initial
tool result still carries a useful text fallback and opaque launch identity. This is a transport
choice, not a new presentation format.

The fixed shell then:

1. Pre-revokes the old child/launch epoch.
2. Loads exact entry bytes into an AgentState-controlled nested iframe.
3. Allows scripts only when the execution mode and trust decision permit it.
4. Validates every child message by `event.source` and current epoch.
5. Calls one typed app-only bridge tool with the launch ID and existing bridge request.
6. Posts only the validated common reply back to the current child.
7. Renders confirmation in fixed shell chrome for v1 proposals.

The inner View never receives:

- the MCP `App` instance;
- MCP tool names;
- a reusable MCP or bundle credential;
- approval tokens or launch authority beyond the replies its declared access permits.

This preserves existing View bytes. They continue to speak AgentState's bridge, not MCP.

### One app-only bridge tool versus one tool per verb

Recommend one app-only tool, conceptually `view_bridge`, whose strict input is:

```json
{
  "launchId": "opaque",
  "request": { "bridge": "v0", "id": "7", "type": "query", "params": { "type": "Task" } }
}
```

The server passes `request` to the shared parser/router and returns a typed bridge outcome. This
avoids reproducing the bridge mapping across six MCP registrations. It is not a broad raw core API:
the server still resolves the launch, gates access, validates the exact bridge grammar, applies
bounds, and returns only bridge replies/intents.

Multiple app-only tools are defensible if host observability demands them, but they increase
mapping drift and make agreement harder. They should not be the first design.

### Query, read, and edges

The result contract must remain the existing v0 contract so current View code is unchanged:

- `hello` returns protocol, effective grant, and a privacy-safe bundle identity. MCP may return
  `root: null`; it should not disclose a local path merely for cross-host byte parity.
- `query` uses core head projections and the shared `type/prefix/field/open/limit` semantics.
- `read` returns one canonical document under the launch's read authority.
- `edges` uses core's derived graph query and returns its minimal projection.

Agreement tests should run the same request rows against a web dependency adapter and an MCP
dependency adapter, then compare semantic outcomes. Transport envelopes may differ; bridge
outcomes must not.

### Subscribe and live-change semantics

An unchanged real View such as Roadmap calls `subscribe` and expects later v0 `change` messages.
The semantic contract is:

1. Subscription acknowledges only after the host has armed its change observation.
2. Deltas identify changed document IDs/versions and removed IDs.
3. A delivery gap must trigger full resynchronization/reload; reconnect alone is not catch-up.
4. Registry deletion, access change, entry change, or content-version change pre-revokes the old
   launch before reload.

The web adapter keeps SSE.

For the MCP proving unit, use the official app-only polling pattern because it is supported by the
current SDK and does not assume hosts forward a custom server notification. The fixed shell polls
only while a current child has subscribed and while the App is visible/alive. The server compares
bounded snapshots/cursors and returns changes. If continuity cannot be proved, the shell discards
the child and reloads the exact View rather than synthesizing incomplete deltas.

This is an adapter, not an event-backbone commitment. A future event backbone can replace polling
without changing the View bridge.

### `open-page` navigation

Keep the wire verb for compatibility.

- The shared router validates that the target is a usable registered View and returns a navigation
  intent with no target bytes or metadata.
- The web adapter pre-revokes the source and changes its SPA route.
- The MCP adapter pre-revokes the source and asks the server to mint the target launch in the same
  fixed App resource.
- Only one navigation may be consumed per source generation.
- Do not map this to an external-link capability.

### Governed actions

For an active durable `bundle-propose` View, preserve the existing v1 messages:

- `read-versioned`;
- `action.propose`.

The MCP fixed shell passes a proposed action to an app-only prepare operation associated with the
current durable launch. Unlike the passive generated path, it cannot require a predeclared
`actionId`; that would force existing Views to change. The server uses the same
`TrustedActionService`. The fixed shell shows exact source/document/Kind/field/before/after/actor
confirmation, delays activation against click-through, and calls app-only commit or cancel.
Only the terminal result is returned to the child.

Prepare and commit must both revalidate:

- current launch and effective authority;
- registry and entry provenance;
- trust decision where required;
- target document version;
- current Kind identity/version and field rules;
- actor;
- one-shot approval token;
- CAS result.

The current passive generated action-descriptor path remains useful. Both paths converge at
`TrustedActionService`; they need not have identical presentation inputs.

## Threat model and trust boundaries

### Protected assets

- Bundle document contents and graph relationships.
- Bundle integrity and version history.
- Local paths and workspace identity that are not needed by the View.
- UI session credentials, remote credentials, MCP connection authority, launch IDs, and approval
  tokens.
- The user's ability to distinguish View-controlled presentation from trusted confirmation chrome.

### Potentially hostile inputs

- Model-authored HTML/CSS.
- Durable View registry documents and entry bytes received through a synced bundle or recipe.
- Malformed/stale bridge messages.
- A previous frame continuing to post while a replacement resolves.
- A page on the same machine attempting loopback requests.
- A stale or compromised MCP tool result.
- UI text designed for phishing or click-through.
- Resource exhaustion by active presentation code.

### Boundaries

1. **Conversation host ↔ fixed MCP App:** MCP Apps host sandbox, CSP, capability negotiation, and
   JSON-RPC/postMessage protocol.
2. **Trusted AgentState shell ↔ inner presentation:** AgentState-owned nested sandbox,
   `event.source`, epoch fencing, shared bridge parser, and trust/authority policy.
3. **Host adapter ↔ bridge authority:** typed calls carrying a server-resolved launch, never a
   caller-selected capability.
4. **Bridge/action authority ↔ core:** bounded engine calls and the shared mutation service.
5. **Bundle ↔ local trust state:** synced content can request access but cannot approve itself.

### Required security invariants

- No presentation can read bundle data without a current server-resolved launch and effective
  authority.
- No presentation receives storage, session, MCP, or remote credentials.
- A child cannot call app-only tools directly; only the fixed shell maps validated bridge requests.
- Messages from any non-current child or after revocation produce no data-bearing reply.
- Changing exact entry bytes, security-relevant registration state, or effective authority
  invalidates the launch before another reply.
- Active content with sensitive authority is admitted only under a portable no-egress proof or an
  explicit exact-byte local trust decision.
- Trust state is outside the synced bundle and binds exact executable content plus effective
  authority. Promotion does not create it.
- `access: bundle-propose` grants proposal authority only. It never grants a write token or
  bypasses human confirmation and CAS.
- Trusted confirmation is package shell chrome and names the exact source and target state.
- Passive generated markup never gains JavaScript merely because it is saved.
- CSP and iframe attributes are defense in depth; they are not used as evidence for a property
  they do not empirically prove.

### Exact-byte trust decision

The smallest robust approval identity is:

- stable bundle identity;
- registry ID;
- exact executable content version/hash;
- effective authority;
- bridge/security contract version.

A registry change that alters entry or authority must invalidate approval. Whether a title-only
registry edit also invalidates approval is an open UX decision; the launch still records the exact
registry version for provenance. Trust records must live in a local user-controlled store, not in
frontmatter that collaborators can sync.

This is consent to run those exact bytes with that authority, not a claim that the code is benign.
Sandboxing and all bridge checks still apply.

## Rejected alternatives

### 1. Treat MCP as a separate durable View format

Rejected. It duplicates identity, recipes, discovery, authoring guidance, actions, and future
evolution. The passive generated presentation contract is a mode, not a second durable product.

### 2. Port the web iframe attributes unchanged and declare parity

Rejected. Functional parity is not a security proof. Both hosts must meet the stronger inner
presentation invariant, and current evidence does not justify an unconditional claim for arbitrary
active content with granted bundle data.

### 3. Make every durable View passive/declarative

Rejected as the default architecture. It would strand existing useful Views, reduce expressiveness,
and confuse persistence with execution. Passive durable Views may still be valuable and should use
the same identity and lifecycle.

### 4. Trust content because it is registered, durable, synced, or shipped in a recipe

Rejected. All four are content-distribution facts. None is a user trust decision.

### 5. Let each durable View import the MCP Apps SDK and call tools

Rejected. Existing Views would not run unchanged, authors would reproduce host integration, and
the View would gain a broader protocol surface than AgentState's bridge. The fixed shell is the
only MCP client inside the App.

### 6. Give the inner View direct HTTP or MCP access

Rejected. It would require credentials or ambient server authority in untrusted code, bypass the
launch/capability broker, and fork authentication across hosts.

### 7. One MCP tool or changing MCP UI resource per View

Rejected. Tool catalogs are model context; UI resources are cacheable predeclared application
assets. Keep one generic invocation surface and one fixed package shell.

### 8. Implement discovery or promotion before bridge compatibility

Rejected as sequencing. A catalog that advertises Views the host cannot safely run is inert; a
promotion flow built around a premature format persists the wrong contract.

### 9. Use durability as approval

Rejected explicitly. Promotion and approval are separate lifecycle operations.

### 10. Require the event backbone before live Views

Rejected. App-only polling can adapt the existing subscription semantics for the proof. The event
backbone may replace the adapter later.

## Migration from the current spike

The current spike should be preserved, not rewritten:

- Keep `show_view` for passive agent-generated HTML/CSS.
- Keep exact IDs and bounded launch-time query selection.
- Keep the shared Markdown materialization path.
- Keep the passive child script-free and navigation-free.
- Keep fixed-shell action descriptors and app-only prepare/finish tools.
- Keep the fixed `ui://agentstate/view-host/v1.html` resource.

Add a mutually exclusive durable source to the generic invocation tool only after the reviewed
bridge proof:

```text
generated source: html/css + objectIds|query
durable source: viewId (+ future validated inputs)
```

Do not create `format: declarative-v1` as a prerequisite. If later dogfooding shows that durable
passive Views deserve an explicit manifest, add that as an execution-mode contract under the same
View identity.

The MCP launch registry should converge on a common launch authority rather than absorb web
semantics piecemeal. The passive generated selection envelope remains an optional confinement on a
common launch.

The local web host should then consume the extracted shared bridge router and the same active
content trust policy. This is not merely MCP enablement; it is a chance to make the existing web
security claim executable and shared.

## Smallest proving implementation slice

The smallest honest proof is **one existing, unchanged, read-only active View** under the MCP fixed
shell, after the trust/containment decision is implemented. Use the existing Roadmap View because
it exercises `hello`, multiple `query` calls, `edges`, `subscribe`, and live refresh. A content-only
View would prove framing but not the bridge.

Scope:

1. Extract the v0 bridge grammar/router and change-message shape below the web shell without
   changing web behavior.
2. Add a common durable launch identity with exact registry/entry provenance and effective access.
3. Add a generic app-only MCP bridge tool.
4. Add a nested active frame in the fixed MCP shell with current-child `event.source` and epoch
   fencing.
5. Add durable `show_view({viewId})` only for `bundle-read`.
6. Add `hello/query/read/edges/subscribe` sufficient for the unchanged Roadmap View.
7. Adapt subscription using app-only polling with full reload on uncertain continuity.
8. Enforce the reviewed active-content trust decision before any data reply.
9. Prove the same Roadmap bytes still run in the local web host.

Explicitly defer from this first slice:

- `bundle-propose` under MCP;
- `read-versioned` and `action.propose` from active durable Views;
- `open-page` if the selected proof does not invoke it;
- discovery;
- promotion;
- durable inputs;
- presentation sizing policy beyond functional rendering;
- remote MCP/authentication.

The first slice must not claim full v0/v1 compatibility. Its receipt names exactly which existing
messages the unchanged proof View exercised.

## Staged implementation sequence

### Stage 0 — review and security disposition

- Independent review this exact design document.
- Privately assess whether the containment evidence exposes a current-main security defect and
  follow the repository's disclosure policy.
- Decide the first active-content trust mechanism.
- Define adversarial QA before code begins.

### Stage 1 — shared read bridge authority

- Move or recreate by mechanical extraction the pure v0 parser/router in `view-runtime`.
- Replace UI-owned API response types with host-neutral core/runtime types.
- Point the web shell at it with agreement tests and no behavior change.
- Keep DOM event-source/epoch and HTTP dependencies in the web adapter.
- Correct stale comments that still describe the retired frontmatter `bridge` field.

### Stage 2 — MCP durable read proof

- Common exact-provenance durable launch.
- Fixed-shell nested active frame.
- One generic app-only bridge broker.
- Unchanged Roadmap View.
- App-only polling adapter for `subscribe`.
- Real Chromium, official MCP basic host, and one real conversation host.

### Stage 3 — full v0 navigation/lifecycle

- `read` if not exercised in Stage 2.
- `open-page` target launch/swap.
- Registry deletion, access downgrade, entry retarget, content change, teardown, and concurrent
  navigation revocation.
- Agreement tests over every v0 request/outcome.

### Stage 4 — active durable governed actions

- V1 `read-versioned` and raw `action.propose` broker.
- Fixed-shell confirmation and terminal result reply to child.
- Shared action-service revalidation and CAS.
- Prove the existing personal task board View unchanged.
- Independent review plus adversarial QA as a changed write boundary.

### Stage 5 — discovery and promotion

- Resume the useful parts of the superseded design:
  - one bounded model-visible `list_views`;
  - one generic `show_view({viewId})`;
  - no tool per View;
  - exact successful bytes and unresolved data/input contract on promotion;
  - human-confirmed persistence;
  - promotion and trust approval remain separate.

### Stage 6 — authoring and host polish

- Sizing evidence across hosts.
- Concise authoring guidance for passive and active modes.
- Dogfood saved Views.
- Second host agreement.
- Remote adapter/authentication only after an explicit later decision.

## Acceptance criteria

### Architecture and agreement

- One core registration/access resolver.
- One host-neutral v0/v1 bridge grammar and semantic router.
- One governed action authority and one core mutation boundary.
- Web and MCP adapter agreement table covers every supported request/outcome.
- No MCP-specific durable View kind, query language, or action semantics.

### Provenance and authority

- A durable launch records exact registry ID/version, entry key/version/content type, execution
  mode, effective access, trust-decision basis, and expiration.
- Registry deletion, entry/content change, or security-relevant access change revokes before
  another data reply.
- Promotion alone never changes execution/trust/authority.
- Synced content cannot write its own local approval.
- `access` is shell-resolved and frame claims are ignored.

### Frame and lifecycle security

- Both shells reject messages whose `event.source` is not the current inner frame.
- A delayed reply from an old frame epoch is dropped.
- Reload and navigation pre-revoke before asynchronous target resolution.
- Inner Views receive no bundle/session/MCP credential, approval token, or MCP SDK handle.
- Active-content admission meets the reviewed no-egress or exact-byte-approval rule in both hosts.
- Security claims are demonstrated in a real browser/host, not inferred from jsdom or markup alone.
- Passive generated-script and navigation stripping remains regression-pinned.

### Read bridge

- One unchanged existing View renders the same authoritative bundle facts in web and MCP hosts.
- `hello`, `query`, `read`, and `edges` either agree semantically or unsupported verbs fail
  explicitly.
- Query results use shared bounded filtering and honest pre-limit counts.
- MCP does not leak a local filesystem root when the View does not need it.

### Freshness

- `subscribe` never acknowledges before observation is armed.
- A real document change updates the running View.
- A delivery gap causes a full resync/reload.
- Teardown stops polling/listeners and revokes launch state.
- Registry/entry changes reload exact new bytes only after the new authority is resolved.

### Navigation

- `open-page` validates one registered target and exposes no target content to the source.
- At most one navigation is consumed per source generation.
- The old child cannot read or navigate after swap begins.

### Actions

- Active durable proposals use the existing v1 shapes unchanged.
- The model and inner View cannot directly call app-only mutation tools.
- Prepare is non-mutating.
- Confirmation is trusted shell chrome and shows exact before/after/source/actor.
- Commit revalidates View, document, Kind, trust decision, and approval; writes through hard CAS.
- Missing actor, stale document, changed View/Kind, expired approval, and cancellation fail closed.

### Product and documentation

- Current passive generated Views continue working.
- The fixed MCP shell remains one package-owned resource.
- The generic model-visible surface remains bounded.
- The old promotion/discovery design is visibly superseded where it conflicts.
- Authoring guidance describes `access` as the field and bridge as the protocol.

## Open questions for review

1. **Approval persistence:** session-only, per-user local store, or both? The first proof can be
   session-only; supported reuse likely needs a local store.
2. **Approval granularity:** exact entry hash + access + registry ID is the minimum. Should a
   title-only registry change force reapproval, or only relaunch?
3. **Content provenance UX:** how should a recipe/package publisher signature reduce repeated
   approvals without allowing synced content to self-authorize?
4. **Active `access: none`:** it has no bundle-data confidentiality risk but retains phishing and
   resource-consumption risk. Is ordinary sandboxing sufficient without a prompt?
5. **Bundle root in `hello`:** recommend `null` for MCP. Does any current View truly require the
   local path?
6. **MCP polling cursor:** reuse a host-neutral snapshot/diff primitive, adapt `ui-server`'s
   watcher, or implement a launch-scoped snapshot in `mcp-app`? Avoid creating an event backbone
   accidentally.
7. **Tool-result byte channel:** should durable entry bytes arrive in initial structured content or
   only through an app-only load call? App-only load is cleaner for large code and model context.
8. **Host variability:** which supported hosts reliably permit the required nested active iframe,
   app-only tool calls, teardown, and auto-resize?
9. **Bridge version evolution:** keep separate v0 read/v1 action discriminators for compatibility,
   or later describe them under one documented protocol family without changing wire bytes?
10. **Passive durable contract:** useful later, but not required for compatibility. What demand
    would justify standardizing it?

## Evidence and sources

### Repository implementation traced

- `packages/core/src/page.ts` — one View registration grammar and `access` resolver.
- `packages/core/src/query-selection.ts` — shared field/open/limit query projection.
- `packages/view-runtime/src/index.ts` — exact View launch state and shared governed-action service.
- `packages/ui/src/pages/bridge.ts` — current pure v0 router.
- `packages/ui/src/pages/actions.ts` — current v1 parser.
- `packages/ui/src/views/PageFrame.tsx` — source validation, epoch fences, revocation, navigation,
  SSE fan-in, and confirmation UI.
- `packages/ui-server/src/pages.ts` and `server.ts` — nonce byte tier, CSP, exact serve-time
  revalidation, session boundary, and trusted-action adapter.
- `packages/ui/src/pages/pageEvents.ts` and `packages/ui-server/src/watch.ts` — reconnect/full-resync
  and current change snapshots.
- `packages/mcp-app/src/server.ts`, `launches.ts`, `presentation.ts`, and `view.ts` — fixed
  resource, passive generated containment, selection envelopes, app-only action tools, and active
  package shell.

### Primary external sources

- MCP server primitive control model:
  https://modelcontextprotocol.io/specification/2025-06-18/server/index
- MCP Apps overview and security model:
  https://modelcontextprotocol.io/extensions/apps/overview
- MCP Apps 2026-01-26 specification, including sandbox proxy, tool visibility, resource linkage,
  lifecycle, and security requirements:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
- Official MCP Apps patterns for app-only tools and polling:
  https://apps.extensions.modelcontextprotocol.io/api/documents/Patterns.html
- CSP Level 3, including directive coverage and inherited policies:
  https://www.w3.org/TR/CSP/
- HTML iframe sandbox semantics:
  https://html.spec.whatwg.org/multipage/iframe-embed-object.html

## Review request

The reviewer should challenge, in particular:

- whether exact-byte approval is sufficient and correctly separated from durability;
- whether a portable stronger containment proof is realistically available;
- whether one generic app-only bridge tool is narrower or broader in practice than per-verb tools;
- whether the proposed polling adapter honestly preserves `subscribe` semantics;
- whether the smallest proof exercises enough of an unchanged real View;
- whether any host-neutral responsibility has been left in a shell or any host detail has leaked
  into `view-runtime`; and
- whether this document states current-web security accurately without overclaiming.

[designs task](../tasks/mcp-view-security-model-unification.md)
