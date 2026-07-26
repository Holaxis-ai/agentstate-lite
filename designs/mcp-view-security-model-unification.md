---
type: Design
title: MCP and web View security-model unification
description: >-
  Revised design for one server-side, launch-bound BridgeService across web and
  MCP hosts, with separate provenance and authorization, bounded schemas, and
  mandatory private Stage 0 clearance.
actor: openai/research-agent
timestamp: '2026-07-26T23:58:36.103Z'
---
# MCP and web View security-model unification

## Status

Revised recommended design for independent re-review. This is a design decision, not
authorization to implement.

This revision incorporates every blocking finding in
[the exact-document review](../reviews/mcp-view-security-model-unification.md) of
`sha256:2a97e67d1e95c18fadd97e288f1700b545d7b44bf591a35b606a7fac7455c343`.
Implementation remains blocked until:

1. the mandatory private current-main security disposition is complete;
2. an independent reviewer approves this revised exact version; and
3. the implementation and adversarial-QA units are separately claimed.

This design refines
[Conversational Generative Views via MCP Apps](../designs/mcp-app-generative-views.md) and
supersedes the durable-format and sequencing recommendation in
[Durable conversational Views: promotion, discovery, and invocation](../designs/mcp-durable-view-promotion-discovery.md).
The earlier document remains useful for generic discovery, invocation, and exact-byte promotion.
Its declarative-first durable format is not the compatibility path.

## Decision

AgentState should have one server-side, launch-bound View authority shared by the local web and
MCP hosts.

The owning primitive is `BridgeService` in `@agentstate-lite/view-runtime`. Both `ui-server` and
`mcp-app` call it. A browser or MCP App forwards only:

- an opaque launch ID; and
- one strictly bounded bridge request.

Neither browser code nor presentation code supplies an access capability, trust decision,
registry version, entry version, or backend dependency. `BridgeService` resolves those facts from
server-owned launch state, revalidates them around each asynchronous operation, applies local
authorization, executes the shared semantics, and returns a presentation-neutral outcome.

The existing View source continues to speak the AgentState `postMessage` bridge. The web shell
transports that request to a session-gated UI-server endpoint. The MCP fixed shell transports it
through one app-only tool. Both terminate in the same service.

The current passive generated MCP presentation remains intact. It is a useful execution mode,
not a second durable View system.

## Five independent axes

The security model has five independent axes:

| Axis | Values | Meaning |
| --- | --- | --- |
| Lifecycle | ephemeral / durable | whether the presentation is persisted and reusable |
| Execution | passive / active | whether presentation-owned code executes |
| Provenance | model-authored / bundle-authored-or-synced / verified-package-owned | where exact bytes came from and what evidence supports that statement |
| Local authorization | unapproved / session-approved / future persistently approved | what this user on this machine has consented to for an exact security tuple |
| Authority | none / read / propose | which bounded operation family `BridgeService` may perform |

No axis implies another:

- saving bytes changes lifecycle only;
- bundle registration requests authority but grants neither provenance nor authorization;
- copying package bytes into a mutable bundle does not make them package-owned;
- verified package-owned means the exact bytes verify against package-controlled metadata;
- active does not imply read access;
- read access does not imply active execution;
- promotion and approval are separate operations.

Examples:

| Presentation | Lifecycle | Execution | Provenance | Local authorization | Authority |
| --- | --- | --- | --- | --- | --- |
| Current generated MCP result | ephemeral | passive | model-authored | not required for passive envelope | bounded frozen snapshots |
| Saved generated report | durable | passive | model- or bundle-authored | not required for passive envelope | same bounded envelope |
| Roadmap View | durable | active | bundle-authored or synced | session-approved for first proof | read |
| Personal task View | durable | active | bundle-authored or synced | later exact authorization | propose |
| Fixed MCP shell | package lifecycle | active | verified package-owned | part of installed TCB | app-only transport authority |

## Terms

- **View:** an AgentState human presentation. A durable View has a `type: View` registry document
  and entry blob.
- **`access`:** the registry field requesting `none`, `bundle-read`, or `bundle-propose`.
  It is untrusted input until server resolution. The retired frontmatter spelling `bridge` stays
  retired.
- **bridge:** the runtime protocol between a presentation and trusted AgentState host. Existing
  `{bridge:"v0"}` and `{bridge:"v1"}` discriminators remain unchanged.
- **launch:** server-owned, bounded, revocable state tying one View source to exact provenance,
  execution policy, local authorization, effective authority, and lifetime.
- **`BridgeService`:** the only authority that turns an opaque launch plus bridge request into
  bundle data or a host intent.
- **host adapter:** web- or MCP-specific transport, frame lifecycle, display, confirmation, and
  change carrier around `BridgeService`.
- **passive presentation:** presentation-owned content with no presentation-owned script,
  navigation, or network authority. It may still be interactive through package-owned controls in
  trusted shell chrome.
- **active presentation:** presentation-owned script executes inside the admitted sandbox profile.
- **promotion:** persistence and registration of bytes. Promotion is not local authorization.
- **unchanged View source:** the exact registered entry bytes and bridge client are unchanged. It
  does not claim identical CSP inheritance, storage, sizing, host APIs, or rendering across hosts.

Keep internal `Page*` names and the `open-page` wire spelling during this security unit. A naming
cleanup would obscure the contract change.

## Current-state diagnosis

### Local web host today

```text
registry + entry
      |
      v
ui-server exact launch/nonce --------------------+
      |                                         |
      v                                         |
sandboxed child --postMessage--> PageFrame       |
                                  |              |
                                  +-- browser-owned router/capability
                                  +-- HTTP reads --------------------> bundle
```

The web host already has important protections: exact entry serving, opaque-origin framing,
session and Host checks, source validation, frame epochs, pre-revocation, delayed-reply dropping,
SSE reload-on-gap behavior, trusted confirmation chrome, `TrustedActionService`, and hard CAS.

The structural problem is that server-owned launch provenance and browser-owned bridge authority
are separate. The browser currently resolves capability from one observation while the server
mints/serves exact content from another. A pure router imported into the browser cannot make the
launch authoritative and would preserve that split.

### Experimental MCP host today

```text
show_view(generated HTML/CSS + selection)
      |
      v
server freezes exact object versions
      |
      v
fixed package shell
      +-- trusted materialization/Markdown
      +-- passive nested presentation
      +-- trusted action controls -> app-only tools -> TrustedActionService
```

This proves one fixed resource, dynamic invocation results, bounded selection, shared Markdown,
app-only tools, and governed shell-owned actions. It does not yet resolve durable registry/entry
launches or expose the v0 bridge.

### What is shared already

- core registration and fail-closed `access` resolution;
- query-selection semantics;
- document/edge/kind authorities;
- exact version tokens and CAS;
- `TrustedActionService`;
- core `mutateDocument`;
- bounded Markdown rendering.

### What must be consolidated

- durable launch resolution and currentness;
- local authorization checks;
- strict v0/v1 request and reply schemas;
- semantic routing for query/read/edges/subscribe/navigation;
- one presentation-neutral outcome model.

## Target architecture

```text
active View source (same postMessage contract)
       |                                      |
       | web                                  | MCP
       v                                      v
PageFrame                              fixed MCP App shell
event.source + epoch                   event.source + epoch
       |                                      |
       | opaque launch + request              | opaque launch + request
       v                                      v
session-gated UI-server endpoint       app-only view_bridge tool
       |                                      |
       +------------------+-------------------+
                          v
            view-runtime BridgeService
       server launch lookup + local authorization
       strict parse + precheck + operation + postcheck
       reply | subscribe intent | navigation intent | error
                          |
                          v
          core query/graph/kinds/mutation authorities
                          |
                          v
                    bundle backend
```

### `BridgeService` owns authority

`BridgeService` is a server-side service instantiated with the running bundle/backend handle,
launch registry, authorization store, core semantic dependencies, limits, and policy version.
`ui-server` and `mcp-app` consume it as normal server packages.

Conceptually:

```ts
handle(
  launchId: OpaqueLaunchId,
  request: unknown,
): Promise<BridgeOutcome>
```

It must:

1. parse the exact request shape and enforce bounds before bundle work;
2. look up server-owned launch state;
3. prevalidate expiration, revocation, exact registry/entry provenance, execution admission,
   local authorization, and effective authority;
4. execute the bounded semantic operation;
5. postvalidate the same security-relevant state after asynchronous work and immediately before
   releasing a data-bearing outcome;
6. revoke and return a terminal reload/error outcome on any mismatch.

It returns only presentation-neutral outcomes:

- exact bridge reply;
- subscription arm/baseline;
- validated navigation target intent;
- prepared governed-action intent;
- reload/revoke outcome;
- bounded error.

It does not know React, `window`, cookies, HTTP route names, SSE, STDIO, MCP tool registration,
host display modes, or confirmation markup.

### Browser responsibilities

`PageFrame` continues to own:

- `event.source` validation;
- current frame epoch;
- pre-revocation before reload/navigation;
- dropping delayed outcomes from an old epoch;
- rendering trusted confirmation chrome;
- transporting replies to the child.

It no longer:

- resolves or passes a capability;
- imports the Node-owning `view-runtime`;
- supplies core data dependencies;
- executes query/read/edges semantics.

For data requests, it posts opaque launch ID plus the untrusted request to a session-gated
UI-server route. The route invokes `BridgeService`. Browser-visible metadata may describe the
grant for presentation, but it is never authorization input.

### MCP responsibilities

The fixed MCP shell owns the same DOM-source and epoch fences and forwards opaque launch ID plus
request through one app-only `view_bridge` tool. The inner View never receives the MCP SDK, tool
names, credentials, approval tokens, or a direct HTTP/MCP channel.

The app-only tool validates an exact outer schema, then passes only its nested request value to
`BridgeService`. It is not a raw JSON-RPC forwarder and never dispatches nested `jsonrpc`,
`method`, or tool-call fields to the MCP transport.

### Launch record

For the first proof, every active durable launch records:

- a process-local opaque launch ID;
- running bundle-instance identity;
- registry ID and exact registry version;
- entry key, exact executable hash/version, normalized content type, and decoded-byte length;
- execution mode;
- source provenance;
- effective authority;
- local-authorization tuple/reference;
- bridge/sandbox policy version;
- created/expiry timestamps and revoked state;
- optional selection confinement;
- subscription baseline/cursor state.

The synced registry can request `access`; it cannot set provenance, approval, effective authority,
or policy version.

## First-proof local authorization policy

The first proof chooses **session-only exact-content authorization**. Persistent authorization is
out of scope.

Authorization is stored only in server process memory. It is destroyed on process exit, server
restart, bundle rebinding, or explicit session teardown. It may be reused by launches in that one
running bundle instance only when every tuple element matches:

1. running bundle-instance handle;
2. registry ID;
3. exact executable content hash;
4. normalized accepted content type;
5. effective authority;
6. execution mode;
7. bridge/sandbox policy version.

Changing any element requires a new decision. Registry title/description changes cause launch
revalidation/reload but do not require a new approval if the tuple remains identical. Registry
entry, executable bytes, content type, execution, authority, or policy changes do.

There is intentionally no portable bundle identity in this unit. A clone, move, new backend
binding, or new process is a new running bundle instance and receives no previous authorization.
Persistent identity, storage location, filesystem permissions, revocation UX, signatures, and
clone/move behavior require a later design.

The decision means: “run these exact bytes under this exact policy with this exact bounded
authority for this session.” It is not a code-safety certification. Sandbox and bridge checks
remain mandatory.

Verified package-owned fixed shell bytes are part of the installed trusted computing base only
when exact bytes verify against package-controlled metadata. A copy placed in a mutable bundle is
bundle-authored provenance and follows ordinary local authorization.

## Mandatory executable-entry admission profile

Call the first profile `active-view-v1`. A durable active entry is admitted only if all checks
pass:

- registry and entry resolve through the one core grammar;
- normalized content type is `text/html` with no charset or `charset=utf-8`;
- raw entry is at most 512 KiB;
- bytes decode as UTF-8 with fatal error handling;
- exact raw-byte hash/version is recorded before execution;
- entry is self-contained;
- the nested child is opaque-origin and receives `allow-scripts` only—no same-origin, forms,
  popups, downloads, top-navigation, auxiliary contexts, or storage grant;
- the effective child policy permits only the explicitly admitted inline document resources and
  denies external fetch, object, frame, worker, form, base, and embedding capabilities;
- no bundle/session/MCP credential or selected data is placed in the child document;
- the host proves it can preserve the required nested-frame, `postMessage`, teardown, and policy
  behavior.

The exact CSP/sandbox bytes and host probes are implementation artifacts of `active-view-v1` and
must be frozen in the reviewed implementation unit. They may be stricter than the current web
policy. They must not be weakened per host to make a proof pass.

The compatibility claim is **unchanged View source against the same bridge contract**, not
universal runtime parity. MCP CSP inheritance, decoding, storage behavior, sizing, and rendering
may differ. Portable Views must not require `hello.bundle.root`; MCP returns `root: null`.

The first proof must pass:

- the official MCP Apps basic host; and
- at least one named supported conversation host.

If a host cannot support the nested active child and exact `active-view-v1` policy, active durable
Views fail closed with an explicit incompatibility result. There is no fallback to top-level
execution, direct MCP access, a weaker sandbox, regenerated source, or silent passive conversion.

## Private security gate

The public invariant is:

> Bundle-provided active bytes must not receive a data-bearing bridge reply unless the current
> exact executable content and effective authority are admitted by a locally controlled
> authorization decision, or a portable containment proof establishes the required
> confidentiality property.

Before any public implementation branch, PR, concrete-mechanics discussion, or claim that current
web behavior is a safe baseline, the security owner must complete the repository's private
current-main disposition. That private record must decide:

- whether the current behavior meets the private-advisory threshold;
- the interim supported web behavior while work proceeds;
- any private remediation and disclosure sequence; and
- when public implementation may begin.

This design intentionally records no concrete failure mechanics. Stage 0 cannot be waived by a
normal design approval.

## Authorization/currentness contract

### Server-side authorization point

For every data-bearing request, `BridgeService` defines the authorization/linearization point as
the successful post-operation revalidation immediately before it releases the outcome.

The sequence is:

1. **Precheck:** read launch, registry, entry identity, requested/effective access, policy, and
   session authorization; reject/revoke before executing if any mismatch exists.
2. **Operation:** perform one bounded semantic operation through core.
3. **Postcheck:** reread/revalidate all security-relevant launch and registration/entry facts;
   reject/revoke instead of releasing data if any mismatch exists.
4. **Release:** emit the bounded outcome only after successful postcheck.
5. **Host fence:** the adapter posts it only if its local frame epoch is still current.

Change observation, SSE, and polling improve freshness. They are not authorization gates.

### Honest backend guarantee

The service uses the strongest currentness primitive offered by the backend. A backend with a
transactional snapshot or conditional head can provide a stronger atomic interval. A filesystem
or remote backend that only supports sequential reads provides two-point detection: the operation
was authorized at the postcheck, but a change immediately after that point can race the already
authorized reply.

Therefore the contract does not claim instantaneous revocation beyond backend consistency. It
does claim:

- no reply after a mismatch observed by either check;
- server-owned revalidation immediately before release;
- host dropping after local epoch revocation; and
- bounded launch lifetime plus reload on uncertainty.

Any later need for stronger snapshot isolation belongs in the backend contract, not browser logic.

## Frozen bounded broker contract

The first implementation unit freezes one strict schema table. Unknown keys, wrong types,
non-plain objects, cyclic/non-JSON values, and out-of-range values fail before bundle work.
No normalizer silently drops malformed fields.

### Common envelope

- Outer app/server call has exactly `launchId` and `request`.
- `launchId`: opaque nonempty ASCII, at most 128 bytes.
- Serialized nested request: at most 8 KiB.
- Bridge correlation `id`/`requestId`: required where the existing verb requires it, nonempty,
  at most 64 bytes.
- Bridge discriminators are exactly `v0` or, in the later action stage, `v1`.
- A nested request containing MCP transport discriminators such as `jsonrpc` or `method` is not
  MCP traffic and is rejected as an invalid bridge shape.

### Identifiers and selectors

- Document and View IDs: relative safe IDs, no absolute path or `..`, at most 512 UTF-8 bytes.
- `type`, `prefix`, and edge `text`: each at most 512 UTF-8 bytes.
- `field` selector: at most 1 KiB.
- `from`/`to`: one safe selector or an array of at most 32 safe selectors.
- `open-page` accepts exactly one valid registry ID and produces only a target intent.

### Requests

- `hello`, `subscribe`: exact discriminator/id keys; no params.
- `query`: exact params from `type`, `prefix`, `field`, `open`, and `limit`.
- Query `limit`: integer 1–100; omitted means 100. `0` is rejected, not treated as unlimited.
- `read`: exactly one safe `docId`.
- `edges`: only `from`, `to`, and `text`.
- V1 retains the existing 8 KiB action parser, 4 KiB scalar value, 128-byte field, 256-byte
  expected-version, and one `document.set-field` action; it is deferred until Stage 4.

### Replies

- Query returns at most 100 rows; each head/frontmatter projection is at most 32 KiB.
- Edges returns at most 500 edges.
- One read body is at most 512 KiB.
- Any complete reply is at most 1 MiB.
- Change batches contain at most 100 changed IDs plus 100 removed IDs and stay under 256 KiB.
- Error messages are package-authored and at most 1 KiB; raw backend errors are mapped, not
  reflected.
- A result exceeding a bound fails explicitly with `BOUNDS` or requests reload; it is never
  silently truncated into a semantically false success.

Exact reply field projections remain the current bridge contract. The implementation unit must
capture pre-change web transcripts, run them against the new server service, and explicitly
adjudicate any previously unbounded request now rejected. The security bound is intentional; it
must not be hidden as “behavior preserving.”

## Shared semantics

### `hello`, `query`, `read`, and `edges`

- `hello` returns protocol, effective grant, privacy-safe bundle name/mode, and `root` as
  `string|null`. MCP uses `null`; portable Views must not require a path.
- `query` uses core head projections and shared `type/prefix/field/open/limit` semantics under the
  frozen bounds.
- `read` returns one canonical document within read/reply bounds.
- `edges` uses the one derived graph query and minimal edge projection.

Web and MCP use the same service outcomes. Agreement tests compare semantic bridge replies; HTTP,
MCP, session, and display envelopes remain adapter-specific.

### Subscription and polling

`subscribe` is freshness, not security.

The service must establish a server-owned baseline before acknowledging:

1. verify the launch;
2. capture a bounded current snapshot/cursor of observable bundle state;
3. store it in launch subscription state;
4. postcheck the launch;
5. then return the subscription acknowledgement and cursor generation.

The web adapter may continue to use SSE. The MCP proof uses app-only polling:

- at most one poll per active launch is in flight;
- default interval is no faster than one second and may back off while unchanged;
- each poll is launch-bound and pre/post revalidated;
- poll compares from the server-owned baseline/cursor, never a child-supplied cursor;
- a bounded diff advances the baseline only after delivery is accepted;
- hidden/suspended then resumed state, cursor loss, server restart, launch expiry, diff overflow,
  any detected gap, or uncertain continuity produces `reload-required`;
- reload means mint/re-authorize a current launch and rerun the View's queries; no synthetic
  catch-up claim;
- polling stops on frame teardown, navigation pre-revoke, App teardown, tool disconnect, launch
  expiry/revocation, or unsubscribe if later added.

If the current backend lacks a durable event cursor, the proof may use a bounded snapshot
fingerprint over relevant heads. It must call that a polling snapshot, not an event backbone.

### `open-page`

The source launch receives only a validated navigation intent. The server resolves the target as a
new launch with its own provenance, admission, and local authorization decision. Source approval
never authorizes the target.

The adapter pre-revokes the source epoch before asynchronous target resolution. The web adapter
changes its route; the MCP adapter swaps launch state inside the same fixed App resource. Only one
navigation may be consumed per source generation.

### Governed actions

Stage 2 is read-only. V1 begins only after the read proof and adversarial QA pass.

Later, `read-versioned` and `action.propose` retain their wire shapes. `BridgeService` gates the
launch and produces a prepared action outcome. Trusted shell chrome renders exact confirmation.
Prepare and commit both revalidate launch/current authorization, document version, Kind, actor,
one-shot approval, and CAS state through the existing `TrustedActionService` and
`mutateDocument`.

The inner View and model never receive write credentials or direct app-only mutation authority.

## Host-neutral responsibilities and adapters

### In `view-runtime`

- server-owned durable launch registry;
- launch admission/currentness;
- in-memory session authorization;
- strict v0 and later v1 parser;
- all numeric protocol limits;
- `BridgeService`;
- query/read/edges semantics;
- subscription baseline/diff outcome semantics;
- navigation target validation;
- presentation-neutral errors/outcomes;
- existing `TrustedActionService`.

### Web-only

- loopback Host/session/CSRF and remote proxy policy;
- HTTP endpoint and response encoding;
- React/frame mounting;
- `event.source` and frame epochs;
- SSE carrier and browser visibility;
- SPA navigation;
- trusted confirmation UI.

### MCP-only

- STDIO MCP server and fixed `ui://` resource;
- model-visible `show_view`;
- app-only tool registration;
- MCP App lifecycle and host-context changes;
- polling carrier;
- nested DOM and host sizing/theme;
- trusted confirmation UI.

Browser code does not import `view-runtime`. Both server adapters do.

## Current passive generated mode

Preserve:

- `show_view` with generated HTML/CSS and exact IDs or bounded query;
- exact frozen object snapshots;
- shared bounded Markdown;
- stripping of presentation-owned script, navigation, and network capabilities;
- package-owned interactive controls outside the passive content;
- fixed app-only prepare/finish actions;
- one fixed `ui://agentstate/view-host/v1.html` resource.

Passive means no presentation-owned script/navigation/network authority, not “no interaction.”
Saving passive bytes does not turn them active. The durable-source input remains mutually
exclusive with the generated source:

```text
generated: html/css + objectIds|query
durable: viewId
```

## Smallest proving slice

After Stage 0 clearance and revised-design approval, the first code sequence is:

1. Create server-side `BridgeService` and server-owned launches in `view-runtime`.
2. Freeze/adversarially test the bounded v0 schemas.
3. Route the web shell through a session-gated UI-server endpoint to that service; remove
   browser-owned capability authority.
4. Add process-memory session approval for exact `active-view-v1` tuples.
5. Capture web agreement transcripts and document intentional bound rejections.
6. Add the MCP durable launch and one app-only `view_bridge` adapter.
7. Run the exact existing Roadmap View source under MCP with `bundle-read`.
8. Adapt `subscribe` with the specified polling baseline/gap/teardown behavior.
9. Prove the same source continues to run through the web adapter.
10. Run adversarial QA against launch races, stale replies, malformed brokers, policy mismatch,
    host incompatibility, gap/reload, and teardown.

The Roadmap View is meaningful because it exercises `hello`, multiple `query` calls, `edges`,
`subscribe`, and refresh. The receipt must not claim `read` or `open-page` if the View did not
exercise them.

Explicitly deferred:

- V1 actions and `bundle-propose` in MCP;
- `open-page` if not required by the proof;
- discovery and promotion;
- persistent authorization or portable bundle identity;
- durable input parameters;
- remote MCP/authentication;
- package publisher trust/signatures;
- naming cleanup;
- event backbone.

## Staged sequence

### Stage 0 — mandatory private disposition and exact-design approval

- Complete the private current-main security disposition and record public-work clearance.
- Define interim web behavior privately.
- Independently approve this exact revised design.
- Freeze the first-proof admission profile, broker limits, and adversarial-QA plan.
- No implementation begins while any item is open.

### Stage 1 — server-side authority for web

- Build launch-bound `BridgeService` in `view-runtime`.
- Add strict bounded v0 schemas.
- Add session-only exact-content authorization.
- Route PageFrame through a session-gated UI-server endpoint.
- Remove browser capability authority.
- Preserve DOM source/epoch fencing in the adapter.
- Agreement-test old/new web semantics and explicitly record intentional bound changes.

### Stage 2 — MCP durable read proof

- Add durable launch resolution to the fixed shell.
- Add one exact app-only `view_bridge` adapter.
- Run unchanged Roadmap source under `active-view-v1`.
- Implement polling baseline/gap/teardown semantics.
- Test official basic host and one named supported conversation host.
- Keep Stage 2 read-only.
- Independent review and adversarial QA must pass before Stage 3 or V1.

### Stage 3 — complete v0 lifecycle

- Add/test `read` if Stage 2 did not exercise it.
- Add separately authorized `open-page`.
- Cover deletion, downgrade, entry retarget, content change, expiry, teardown, concurrent
  navigation, and reload.
- Complete the v0 adapter agreement table.

### Stage 4 — active durable governed actions

- Add v1 `read-versioned` and raw `action.propose` through `BridgeService`.
- Reuse `TrustedActionService` and hard CAS.
- Prove the existing personal task View source unchanged.
- Review and adversarially QA the changed write boundary.

### Stage 5 — discovery and promotion

- one bounded `list_views`;
- generic `show_view({viewId})`;
- no tool per View;
- exact-byte promotion;
- human-confirmed persistence;
- promotion and authorization remain separate.

### Stage 6 — product hardening

- sizing evidence and host-specific UX;
- authoring guidance for portable Views;
- dogfood;
- second-host agreement;
- later persistent trust/identity design;
- remote adapter only after an explicit decision.

## Acceptance criteria

### Authority ownership

- Browser and inner presentation supply only opaque launch plus bounded request.
- `BridgeService` is server-side and consumed by both `ui-server` and `mcp-app`.
- Browser code does not import `view-runtime` or pass a capability.
- Effective access, provenance, authorization, and currentness come from server state.
- One core registration resolver, one bridge service, one action service, and one mutation
  boundary remain.

### Trust and admission

- Provenance and local authorization are stored as distinct facts.
- The first proof uses only process-memory session approval and the exact seven-element scope.
- Process exit, rebinding, or teardown destroys approval.
- Synced content cannot authorize itself.
- Package-owned status requires exact verification and is not inherited by copying.
- `active-view-v1` content type, decoding, hash, size, CSP/sandbox, and host probes fail closed.
- Incompatible hosts never weaken policy or execute the View differently.

### Currentness

- Every data-bearing operation has pre- and post-operation server revalidation.
- The documented authorization point is immediately after postcheck/before release.
- Backend guarantees are stated as two-point or transactional honestly.
- Change observation is never used as the security gate.
- Old host epochs drop delayed outcomes.

### Broker bounds

- Exact keys and discriminators are enforced.
- Every message, identifier, selector, row, edge, body, batch, and total reply bound is tested.
- Nested bridge data cannot dispatch MCP JSON-RPC.
- Overflow and malformed requests fail without bundle work or partial semantic success.

### Freshness

- Server baseline is armed before `subscribe` acknowledgement.
- MCP polling is bounded and one-at-a-time.
- Cursor loss, suspension/resume, gaps, overflow, restart, or uncertainty cause reload.
- Baseline advances only after accepted bounded delivery.
- Teardown/revocation stops polling and destroys launch state.

### Host and product behavior

- The exact Roadmap source runs against the same bridge contract in web and supported MCP hosts.
- Claims name only the verbs actually exercised.
- `hello.bundle.root` may be `null`; portable guidance forbids requiring a filesystem path.
- Passive generated mode remains script/navigation/network-free but may use trusted interactive
  shell controls.
- Current passive results, Markdown, frozen selection, and governed shell actions do not regress.
- Discovery and promotion remain deferred until the durable read proof passes.

## Rejected alternatives

1. **Browser-imported pure router:** preserves split authority and registry/entry races.
2. **Separate MCP durable format:** duplicates identity, recipes, actions, and authoring.
3. **Treat durability or provenance as approval:** confuses persistence/distribution with consent.
4. **Persistent approval in the first proof:** requires unsolved portable identity, storage,
   permissions, and clone/move semantics.
5. **Direct inner HTTP/MCP access:** leaks ambient authority and bypasses the launch service.
6. **One tool per View or bridge verb:** grows model/tool surface and mapping drift.
7. **Weaken the sandbox for incompatible hosts:** creates host-dependent security semantics.
8. **Watcher-driven authorization:** observation cannot provide an authorization linearization
   point.
9. **Unbounded generic broker:** app-only visibility does not make permissive input safe.
10. **Event backbone prerequisite:** bounded honest polling is enough for the proof.
11. **Actions in Stage 2:** mixes the read-security proof with a write boundary.

## Remaining open questions

These do not block the read proof:

1. What portable bundle identity should later persistent authorization use?
2. What signature/publisher model can establish verified package provenance?
3. Is active `access:none` acceptable without a prompt given non-confidentiality risks?
4. Should durable entry bytes travel in initial structured content or an app-only load call?
5. Which additional conversation host becomes the second supported host?
6. What demand would justify a durable passive manifest?
7. When should an event backbone replace polling snapshots?

## Evidence and primary sources

Repository implementation traced:

- `packages/core/src/page.ts`
- `packages/core/src/query-selection.ts`
- `packages/view-runtime/src/index.ts`
- `packages/ui/src/pages/bridge.ts`
- `packages/ui/src/pages/actions.ts`
- `packages/ui/src/views/PageFrame.tsx`
- `packages/ui-server/src/pages.ts`
- `packages/ui-server/src/server.ts`
- `packages/ui/src/pages/pageEvents.ts`
- `packages/ui-server/src/watch.ts`
- `packages/mcp-app/src/server.ts`
- `packages/mcp-app/src/launches.ts`
- `packages/mcp-app/src/presentation.ts`
- `packages/mcp-app/src/view.ts`

Primary external sources:

- MCP server control model:
  https://modelcontextprotocol.io/specification/2025-06-18/server/index
- MCP Apps overview:
  https://modelcontextprotocol.io/extensions/apps/overview
- MCP Apps specification:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
- Official app-only and polling patterns:
  https://apps.extensions.modelcontextprotocol.io/api/documents/Patterns.html
- CSP:
  https://www.w3.org/TR/CSP/
- HTML iframe sandbox:
  https://html.spec.whatwg.org/multipage/iframe-embed-object.html

## Re-review request

The reviewer should verify finding-by-finding that this revision:

- makes Stage 0 mandatory;
- puts authority in a launch-bound server-side `BridgeService`;
- separates provenance from local authorization;
- specifies pre/post revalidation and honest backend currentness;
- chooses a session-only exact authorization scope;
- defines unchanged-source and fail-closed host admission;
- freezes bounded broker schemas;
- defines passive precisely;
- specifies polling baseline, gap, resume, and teardown;
- keeps Stage 2 read-only; and
- contains no concrete current-main failure mechanics.

[designs task](../tasks/mcp-view-security-model-unification.md)
