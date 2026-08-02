---
type: Design
title: 'Transient and durable Views: one source contract'
actor: openai/codex
timestamp: '2026-08-02T18:48:01.444Z'
---
# Transient and durable Views: one source contract

## Status

Proposed on 2026-08-02 and independently reviewed. The reviewer approved the consolidation
direction and required the source identity, exact-byte save authority, approval posture, and
governed-action sequencing now incorporated below. This design narrows and simplifies
[One portable View model](unified-portable-view-model.md). It proposes replacing the current
MCP-only generated-presentation contract with transient launches of the same active View source
used by durable bundle Views.

Parent roadmap: [Conversational Views through MCP Apps](../roadmap-items/conversational-mcp-views.md).

If accepted, this design supersedes the parts of
[Conversational Generative Views via MCP Apps](mcp-app-generative-views.md) and
[Durable conversational Views](mcp-durable-view-promotion-discovery.md) that treat script-free,
snapshot-bound HTML as the normal ephemeral form of a View. Their fixed MCP shell, governed host
boundary, shared runtime, and one durable registry remain valid.

## Decision sought

Adopt one View source and runtime contract regardless of lifetime:

```text
one self-contained active View source
  ├─ transient launch: exact bytes held temporarily, not registered
  └─ durable View:     the same exact bytes stored and registered in the bundle
```

Persistence changes lifetime, portability, and discoverability. It must not change the View's
source language, bridge semantics, data behavior, or host compatibility.

The current generated MCP presentation contract—script-free HTML/CSS, frozen object snapshots,
`data-aslite-text`, `data-aslite-markdown`, and separately declared trusted-shell actions—should be
removed after the unified transient launch proves the required journey. It should not remain as a
second format merely for compatibility: the MCP surface is experimental and has no installed-user
contract requiring preservation.

## Problem

AgentState currently has two things called Views:

1. A durable active View is self-contained HTML with the standard View bridge. It can query current
   data, render documents, follow graph relationships, subscribe to changes, and run through web or
   MCP from one registered identity.
2. A generated MCP View is script-free HTML/CSS interpreted by the fixed MCP shell over a bounded,
   frozen snapshot envelope. Its declarative bindings and trusted-shell action declarations are an
   MCP-specific source contract.

The second contract was created for a legitimate safety goal: show model-generated presentation
without trusting generated executable code. But it now conflicts with the stronger product model
that a View is portable across hosts. A useful generated presentation cannot be saved unchanged as
a durable View; an agent must re-author it with a bridge client. “Promote” therefore means
translation rather than persistence, and users and agents must learn two authoring models.

This is complexity at the wrong seam. Ephemeral versus durable is a useful lifecycle distinction.
MCP versus web is a useful adapter distinction. Neither requires a second View source language.

## Proposed product model

### View

A View is one self-contained active HTML source using the standard AgentState View bridge. The
source is host-neutral and may be launched in the web shell, an MCP App, or a future host.

### Transient View

A transient View is exact View source bytes held by a launch authority for a bounded time. It has:

- a content-hash source identity;
- a title and explicitly requested access;
- no bundle registry document and no bundle blob;
- the same bridge, sandbox, CSP defense-in-depth, bounds, and host behavior as a durable View; and
- local exact-byte authorization before bundle data is exposed.

The transient source disappears when its launch expires or the host process ends. A host may retain
ordinary conversation history, but AgentState does not treat that as View persistence.

Launch sources are a discriminated union, never one registry-shaped record with invented values:

```text
registered = registry ID + registry version + entry key + entry version
transient  = source hash + immutable in-memory source record + expiry
```

Transient currentness means that the immutable hash-addressed record is still present and
unexpired. Registered currentness continues to mean that the registry and entry still match the
exact launch identity. The common bridge consumes either through one launch authority without
learning the storage form.

### Durable View

A durable View is the same source bytes stored under `views/…` plus a `type: View` registration
under `views-registry/…`. It is named, portable, discoverable, synchronizable, and launchable later.

### Save / promote

Saving a transient View performs no source transformation:

1. persist the exact tested source bytes as a View blob;
2. create a registry document declaring title, description, entry, and access; and
3. return both durable identities and versions, naming an orphaned blob if the registry write fails.

The saved View may require a fresh local authorization because durable registry identity is part of
the authorization subject. Saving source must never silently transfer approval across a changed
identity or expanded access level.

The save operation is owned by the process holding the transient source. The ordinary CLI cannot
reach another MCP process's in-memory bytes, and asking the model to rewrite its earlier HTML to a
file would not prove exact-byte persistence. A narrow server-owned save operation must resolve the
current launch, reread its immutable source bytes, revalidate expiry/hash/access, promote those
exact bytes through existing write authorities, and create the registry with create-only CAS. It
accepts durable metadata and identity decisions, never replacement HTML. A local-file proof is
acceptable only if both transient launch and durable creation consume the same exact file bytes.

## Security model

The simplification deliberately trades the old preview's approval-free containment for one
consistent executable-View trust model.

- Generated active HTML is untrusted until the human approves its exact bytes and requested access.
- Before approval, it receives no bundle data and cannot use the bridge.
- After approval, it has exactly the same authority as an equivalently declared durable View.
- Direct credentials remain unavailable to the child; sandbox and CSP remain defense-in-depth.
- Unknown access fails closed.
- Changed bytes or expanded access require a new approval.
- A transient launch is bounded in size, lifetime, and count, and is identified by a cryptographic
  content hash rather than a fabricated durable registry ID.
- Its authorization subject includes bundle identity, transient source kind and hash, content type,
  effective access, execution mode, and policy version.
- The first proof keeps transient approval process-local. Durable registry approval retains its
  existing local persistence. Changing bytes, bundle, access, or policy always asks again.

This makes approval meaningful and potentially frequent. That is the central product tradeoff. If
users approve arbitrary generated code mechanically, the security ceremony becomes weak. The
system should communicate that the agent authored executable presentation with the displayed
access, and should prefer stable durable Views for repeated use. In particular, `bundle-read`
allows agent-authored code to query the bundle after approval; it is broader than the old frozen,
selection-confined snapshot. The approval prompt must name that authority and must not imply that
AgentState proved the generated code safe.

Deleting the passive path intentionally gives up approval-free snapshot display, selection-confined
read/action authority, a frozen “what the agent saw” envelope, and the tiny declarative binding
surface. Shared `render-document` and the normal bridge replace the important presentation
capabilities. Durable Artifacts or explicit versioned records cover cases that genuinely require
frozen review evidence. These losses are accepted only after the real-host proof shows that active
transient approval remains understandable rather than becoming reflexive clicking.

## What is removed

After acceptance proof, remove the superseded contract as one consolidation program:

- generated snapshot input (`objectIds` / generated-query selection) from `show_view`;
- frozen generated object envelopes and their transient refresh registry;
- `data-aslite-text` and `data-aslite-markdown` materialization;
- generated-presentation HTML sanitization and nested script-free document construction;
- generated-only trusted-shell action declarations and their launch registry;
- generated-only schemas, recovery branches, tests, guidance, and product terminology; and
- claims that an “MCP View” is a special generated format.

Do not remove shared capabilities that the old path helped motivate: the bounded Markdown renderer,
shared `render-document` bridge row, fixed MCP App shell, trusted action service, versioned mutation
boundary, sizing relay, or host lifecycle recovery.

## Governed actions

The current generated contract can expose `document.set-field` controls through trusted shell
chrome, while durable MCP Views currently accept only `bundle-read`. Deleting it immediately would
temporarily remove the demonstrated conversational mutation path.

Before deletion, implement `bundle-propose` for standard transient and durable MCP Views using the
existing shared trusted-action and mutation authorities. This is a no-regression requirement: the
current generated path is the only demonstrated conversational mutation journey, and human action
through live interfaces is core product value. Action parity remains a separately reviewed,
adversarially tested write-boundary unit.

Do not preserve the entire generated source contract solely to retain one action UI. Action parity
belongs to the shared View capability matrix.

## Host behavior

MCP and web remain adapters over the same launch authority.

- MCP accepts either a registered `viewId` or transient source bytes plus title/access.
- Web continues to launch registered Views and may later accept transient launches through a local
  control channel if a real agent-to-web journey warrants it.
- Both mount the same source and expose the same supported bridge messages.
- Host chrome, sizing, expand/fullscreen, navigation, suspension, and reconnection remain adapter
  responsibilities.

This decision does not require web transient invocation in the first implementation. It requires
that the transient source contract be host-neutral so adding another adapter does not require a new
View format.

The first version deliberately removes separately supplied `objectIds` and generated-query input.
A transient active View performs bounded bridge queries or embeds explicitly selected IDs in its
exact source, which changes its hash and approval. Add host-neutral invocation parameters later
only if repeated use proves the need, and then make them available to both transient and durable
Views rather than recreating MCP-only selection envelopes.

## Implementation shape

Prefer a small extension of the existing host-neutral launch authority with an explicit source
union:

- registered source: resolve exact registry plus entry bytes from the bundle;
- transient source: admit exact supplied bytes, compute their content hash, and retain them only in
  a bounded in-memory source store;
- common launch: admitted bytes, content type, declared/effective access, execution policy,
  authorization subject, bridge dispatch, subscriptions, actions, expiry, and revocation;
- source-specific currentness: bundle reread for registered sources, immutable-store
  presence/hash/expiry for transient sources.

Do not create an MCP-specific persistence store, a second bridge, a synthetic registry document, or
a second active-HTML admission implementation.

## Sequence

1. Freeze this source/lifecycle contract and update the portable-View design and roadmap language.
2. Add transient standard-View launch to MCP using exact bytes and explicit access.
3. Prove live query, `render-document`, edges, subscription, resizing, suspension recovery, and
   exact-byte authorization through that transient launch.
4. Add the server-owned exact-byte save operation. Persist one transient source unchanged, compare
   hashes, require fresh durable authorization, then launch the registered ID in MCP and web.
5. Add standard MCP `bundle-propose`; prove one human-confirmed scalar action from both the
   transient View and its saved durable form.
6. Delete the generated-presentation contract and its documentation/tests in bounded consolidation
   units, with each deletion protected by the cross-host acceptance fixture.
7. Reconsider `aslite view create` as the durable packaging verb after exact-byte save semantics are
   proven; it must not encode preview translation.

## Acceptance proof

Using only installed product guidance, an agent must be able to:

1. author one standard View source for an immediate question;
2. launch it transiently in an MCP App;
3. receive no bundle data before exact-byte authorization;
4. after approval, query current data, render a document through the shared renderer, and observe a
   subscribed update;
5. save the exact unchanged bytes as a durable View;
6. discover and launch that durable View in MCP;
7. launch the same durable ID in the web UI; and
8. complete one governed scalar action from both transient and durable MCP launches; and
9. observe the same supported bridge behavior without generated-only bindings or copied snapshots.

The proof must compare source hashes before and after saving. If the bytes change, promotion is
still transformation and the simplification has not been achieved.

## Rejection criteria

Reject or narrow this proposal if independent review demonstrates that:

- exact-byte approval of agent-generated active HTML is an unacceptable default user experience;
- the target MCP hosts cannot safely run transient active HTML through the already-proven durable
  nested-frame model;
- a stable transient authorization subject cannot be expressed without weakening durable approval;
- the script-free path provides a frequent, indispensable journey that standard Views cannot serve;
  or
- deleting generated actions would remove more product value than action parity can replace.

## Non-goals

- Automatically persist every transient View.
- Transfer authorization merely because source bytes were saved.
- Introduce a separate MCP View kind or entry blob.
- Build hosted storage or remote MCP.
- Make web and MCP host chrome identical.
- Preserve an experimental contract solely for compatibility.

## Recommendation

Proceed with a reviewed transient-standard-View proof. If the proof passes, adopt the invariant:

> Persistence changes a View's lifetime and discoverability, not its source contract or runtime
> behavior.

Then delete the generated-presentation contract rather than maintaining two ways to author a View.

[reviewed by](../reviews/transient-durable-view-unification.md)
