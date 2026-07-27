---
type: Design Review
title: Design review — MCP and web View security-model unification
actor: openai/design-reviewer
timestamp: '2026-07-27T00:01:52.361Z'
---
# Exact design reviewed

`designs/mcp-view-security-model-unification` at
`sha256:2a97e67d1e95c18fadd97e288f1700b545d7b44bf591a35b606a7fac7455c343`.

# Verdict

`approve_with_required_changes`

The direction is correct: MCP must be a second host adapter for the established View contract,
durability must not imply trust, and the passive generated mode must remain a mode rather than
becoming a second durable product. Implementation is not authorized until the blocking decisions
below are incorporated into the design and the private security disposition is complete.

# Blocking findings

## 1. Dispose of the current active-authority security question privately before public work

Stage 0 is mandatory, not merely an optional assessment. The public invariant is:

> Bundle-provided active bytes must not receive a data-bearing bridge reply unless the current
> exact executable content and effective authority are admitted by a locally controlled trust
> decision, or a portable containment proof establishes the required confidentiality property.

The current-main posture requires the repository's private Security Advisory process before any
public implementation or public discussion of concrete failure mechanics. The proving work must
not normalize the existing web boundary as a safe baseline while this disposition is open.

## 2. Put the authority server-side; moving only the pure router is insufficient

The design currently says to extract the v0 parser/router into `view-runtime` and point the web
shell at it. That is ambiguous and risks preserving the important split: the browser currently
decides bridge capability from one registry read, while the server separately mints an exact
launch. Those can diverge across a race, and a browser-imported pure router cannot make the launch
authoritative.

The shared unit must be a server-side `BridgeService` (in `view-runtime`, consumed by
`ui-server` and `mcp-app`) that accepts an opaque launch ID plus a bounded bridge request. It must
resolve effective authority and exact registry/entry provenance from server-owned launch state,
check trust policy, execute the semantic operation, and return a presentation-neutral outcome.
The web child still talks `postMessage` to `PageFrame`, but `PageFrame` forwards to a session-gated
UI-server endpoint; it must not pass a capability sourced from its own earlier document read.
The MCP fixed shell forwards through the app-only tool to the same service.

DOM `event.source`, frame epochs, delayed-reply dropping, and trusted confirmation chrome remain
host-adapter responsibilities. React/browser code should not import the Node-owning
`view-runtime` package merely to share a pure function.

## 3. Separate provenance from local authorization

The proposed four-axis table combines “provenance and trust decision” into one axis. These are
different facts:

- provenance: model-authored, bundle-authored/synced, or verified package-owned bytes;
- authorization: unapproved, session-approved, or persistently approved by this user.

Make them separate axes, or define an equally explicit trust-basis algebra that cannot confuse a
distribution source with consent. “Package-owned” is meaningful only when exact bytes verify
against package-owned metadata; copying package content into a mutable bundle does not preserve
that status by assertion.

## 4. Define request currentness at a server-side authorization point

“Changing bytes/access invalidates before another reply” is stronger than the current watcher and
stronger than a single non-atomic registry-plus-blob check can guarantee. Define the contract in
terms of a server-side authorization/linearization point:

- resolve and validate the launch before the operation;
- revalidate after an asynchronous data operation and before releasing a data-bearing reply;
- revoke on any mismatch;
- let the host epoch drop a reply after local revocation;
- treat change observation as freshness, never as the security gate.

Document the remaining backend race honestly. Do not claim instantaneous revocation outside the
consistency guarantees provided by the backend.

## 5. Choose the first trust policy and identity before the proof

The design requires a “stable bundle identity,” but core currently has a bundle root/backend
handle, not a portable durable bundle identifier. For the first proof, choose session-only approval
scoped to the running bundle instance and exact:

- registry ID;
- executable content hash and accepted content type;
- effective authority;
- execution mode;
- bridge/sandbox policy version.

Persistent approval and portable bundle identity can follow as a separate design. If persistent
approval is included now, its identity, local storage, permissions, revocation, and clone/move
behavior must be specified first.

## 6. Make “unchanged bytes” and host compatibility testable

The source entry may remain byte-identical, but its execution environment is not identical:
MCP-host CSP inheritance, nested-frame support, content decoding, bundle-root disclosure,
navigation, storage, and sizing differ. Define the durable entry admission contract (at minimum
accepted HTML content type, valid decoding, byte/hash provenance, and effective CSP) and call the
claim “unchanged View source against the same bridge contract,” not universal runtime byte parity.

The first proof must run in the official basic host and at least one real supported conversation
host. A host that cannot support the nested active child safely is incompatible and must fail
closed, not fall back to executing it differently.

## 7. Bound the generic broker before exposing it

One generic app-only bridge tool is the right mapping, but only after the shared protocol parser
has exact discriminated request shapes and explicit message, identifier, selector, row, edge,
document-body, and reply-size bounds. Current v0 parsing is intentionally permissive and includes
unbounded forms; app-only visibility is not a substitute for server validation. Pin that a message
from the inner child cannot be mistaken for MCP JSON-RPC to the host transport.

# Nonblocking findings

- Define passive as “no presentation-owned script, navigation, or network authority,” not
  “noninteractive.” Trusted shell controls can still make a passive presentation interactive.
- `hello.bundle.root: null` in MCP is the correct privacy default, but portability guidance should
  say Views must not require a filesystem root.
- App-only polling is an acceptable proof adapter. Arm a server-owned baseline/cursor before
  acknowledging `subscribe`; on hidden/resumed state, cursor loss, or any gap, reload instead of
  synthesizing continuity. Bound polling cost and stop it on teardown.
- An `open-page` target needs its own launch resolution and trust decision. Approval of the source
  must never authorize the target.
- Keep the internal `Page*` names and `open-page` wire spelling during the security unit; rename
  cleanup would obscure the contract change.
- Package signatures/publisher trust can reduce later prompts, but they are not needed for the
  first exact-byte/session proof.

# Survived challenges

- Lifecycle, execution, trust, and authority are genuinely orthogonal; saving bytes should change
  only lifecycle.
- The current passive generated MCP mode remains valuable and should not be rewritten.
- Existing active View source can remain MCP-unaware: child `postMessage` to a fixed shell is the
  correct adapter seam.
- One strict app-only `view_bridge` tool is preferable to one mapping per verb once it terminates
  in the shared server-side service.
- `TrustedActionService` plus core `mutateDocument`/CAS is the correct action and mutation
  authority. No MCP mutation policy is needed.
- `subscribe` can be adapted with honest polling without committing to an event backbone.
- The unchanged Roadmap View is the right meaningful read proof because it exercises query,
  edges, subscription, and refresh. Its receipt must not claim that `read` was exercised if it was
  not.
- Discovery and promotion are correctly deferred until one durable View is safely invokable.
- Promotion and trust approval must remain separate operations.

# Required pre-implementation decisions

1. Complete the private current-main security disposition and define the interim web behavior.
2. Amend the design to make `BridgeService` server-side and launch-bound for both hosts.
3. Separate source provenance from local authorization.
4. Select session-only exact-content approval for the first proof, or fully specify persistent
   bundle identity and local trust storage.
5. Define the authorization/currentness linearization and pre/post revalidation contract.
6. Freeze bounded v0 request/reply schemas for the generic broker.
7. Define the executable HTML/content-type/CSP admission profile and supported-host failure mode.
8. Define polling baseline, cursor/gap, visibility, teardown, and reload semantics.
9. Keep Stage 2 read-only; do not add v1 actions until the read proof and its adversarial QA pass.

# Re-review of the revised design

## Exact revised design reviewed

`designs/mcp-view-security-model-unification` at
`sha256:0dc37c152da4749574f5f66c4c3b393f3e78761b123e18e0be390e3d415ee9ae`.

This re-review compares that exact version against the original review above at
`sha256:9842ce64a0bcd760bafb403c6d43c13f6b11e0e79f05ee5e52a2f1e05b2bfc25`.

## Final verdict

`approve`

All seven design blockers are resolved. This approves the architecture and sequencing; it does
not clear the mandatory private Stage 0 security gate or authorize implementation while that gate
remains open.

## Finding-by-finding disposition

1. **Private disposition — resolved in the design.** Stage 0 is now mandatory, explicitly blocks
   every public implementation path, states only the public invariant, and requires a private
   decision on interim web behavior and clearance.
2. **Server-side authority — resolved.** `BridgeService` is server-side in `view-runtime`;
   `ui-server` and `mcp-app` are its consumers. Browser code forwards only launch ID plus request,
   imports no Node runtime, and no longer supplies capability or semantic dependencies.
3. **Provenance versus authorization — resolved.** They are separate axes and stored as distinct
   facts. Verified package provenance requires exact package-controlled evidence and is not
   inherited by copying.
4. **Currentness — resolved.** The design defines precheck, bounded operation, postcheck,
   release, and host-epoch fence; names the postcheck as the authorization point; and states the
   sequential-backend race honestly rather than claiming instantaneous revocation.
5. **First trust policy and identity — resolved.** The first proof is process-memory,
   session-only, scoped to one running bundle instance and an exact seven-element tuple.
   Persistent trust and portable bundle identity are explicitly deferred.
6. **Unchanged source and host admission — resolved.** `active-view-v1` freezes content type,
   UTF-8 decoding, size/hash, CSP/sandbox, credential exclusion, and host probes. The claim is
   correctly narrowed to unchanged source against one bridge contract, with fail-closed host
   incompatibility.
7. **Generic broker bounds — resolved.** Exact envelopes, discriminated requests, identifiers,
   selectors, rows, edges, bodies, batches, errors, and total replies are bounded. Nested MCP
   transport-shaped input is explicitly rejected before bundle work.

The prior nonblocking findings are also incorporated: passive is defined by presentation-owned
authority rather than interactivity; MCP root is nullable; subscription arms a server baseline
and reloads on uncertainty; navigation gives the target a new authorization decision; Page
renaming remains out of scope; Stage 2 is read-only; and discovery/promotion remain deferred.

## Remaining implementation details, not design blockers

- The Stage 1 plan should spell out the trusted-shell consent ceremony and its server operation:
  active bytes may load under the admitted sandbox, but only trusted shell chrome can create the
  session authorization record, and no data-bearing reply may precede it.
- Add a per-launch request/concurrency budget or circuit breaker. Per-message bounds prevent large
  inputs and replies, but presentation-owned script can still flood many individually valid
  requests. Adversarial QA should prove revocation/teardown stops queued and in-flight work.
- “Baseline advances only after accepted delivery” needs an explicit adapter handshake. For MCP
  polling, retain/repeat a pending delta until fixed-shell acknowledgement, or send the prior
  delivery token on the next app-only poll; returning a tool result alone must not silently count
  as child delivery.
- Name the real supported conversation host before Stage 2 QA begins and pin the exact
  `active-view-v1` host probe there.

## Remaining blocker status

There are no remaining design-document blockers. Implementation remains blocked by the separate
mandatory private Stage 0 disposition and public-work clearance. That gate is deliberately not
satisfied by this approval.

[reviews design](../designs/mcp-view-security-model-unification.md)

[reviews task](../tasks/mcp-view-security-model-unification.md)
