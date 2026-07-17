---
type: Design
title: Trusted Page Actions and a Shared Mutation Boundary
actor: mike/codex
timestamp: '2026-07-17T03:24:18.016Z'
---
# Trusted Page Actions and a Shared Mutation Boundary

**Status:** Protocol specified; runtime implementation remains a separate reviewed unit. This design records the safe path from read-only bundle Pages to useful human-confirmed interaction. It does not weaken the existing read-only Page contract.

## Product outcome

A human can use controls rendered by a bundle Page—approve a review, change task status, assign work, or record a structured decision—and see the result become durable bundle state in real time. The interaction remains safe even when the Page HTML arrived from another person or bundle.

The governing model is:

> A Page proposes a structured action. The trusted shell validates, explains, authorizes, and commits it through the same mutation service used by the CLI.

Pages never receive credentials, never call the wire API directly, and never authorize themselves.

## Relationship to existing architecture

This work composes two existing roadmap authorities:

- [Mutation integrity](../roadmap-items/mutation-integrity.md) owns the executable read–decide–CAS boundary and the audit of existing mutation surfaces.
- [The human window rethink](../roadmap-items/ui-rethink.md) owns the local UI shell and bundle-authored Page primitive.
- [The Page model design](page-model-and-viewer-deprecation.md) remains authoritative for sandboxing, opaque origins, registry resolution, and read-only-by-default behavior.

This design adds a trusted action boundary between Pages and bundle mutation. It does not create a second mutation framework.

## Existing foundation

The repository already has most of the low-level machinery:

- `packages/core` owns `versionedMutation`, the generic fresh-read → decision → CAS-write → bounded-retry primitive.
- Core's `mutateDocument` service owns document policy: create/overwrite/patch postures, no-op detection, kind validation, timestamps, actor attribution, hard CAS, and final-version receipts. The CLI's `mutateDoc` is a presentation adapter.
- The Page iframe is sandboxed with scripts only, has an opaque origin and no network access, and communicates solely through a source-validated `postMessage` bridge.
- The shell already revokes bridge access across reloads, registry changes, deletion, and navigation.
- The wire and storage seams already surface version conflicts.

The CLI-neutral document mutation service shipped in PR #85. The remaining seam is the typed, human-confirmed action protocol that lets a trusted non-CLI consumer invoke it without granting authority to bundle HTML.

## Layering decision after the mutation audit

The completed mutation audit separates two complementary guarantees:

1. `FilesystemBackend` must make a version premise atomic across independent local processes. This protects the product as it exists now: two agents, or an agent CLI racing the UI/`serve` process, cannot both report success while one update disappears.
2. The shared document mutation service must make document policy identical across trusted callers. It prevents the CLI and a future UI action from drifting on kind validation, semantic no-ops, actor propagation, retry posture, and final receipts.

The shared-service extraction and cross-process filesystem CAS are now shipped. Together they are the correctness prerequisites for writable Page actions: one preserves document policy across callers and the other makes version premises atomic across local processes.

Therefore the preferred sequence is: enforce cross-process filesystem CAS; pin the remaining `regenerateIndex` adversarial proof; extract the CLI-neutral document service without behavior change; only then expose the first human-confirmed Page mutation. These remain separate reviewed units. The filesystem work stays below semantic consumers, while the shared service remains document-policy-specific and does not absorb links, blobs, deletes, recipes, or reserved-file operations that correctly use lower-level primitives.

## Decision 1: extract the document mutation service below the CLI — shipped

Move the domain-neutral portion of `packages/cli/src/mutate.ts` below the CLI, most likely into `@agentstate-lite/core`. Do not move the file wholesale.

The shared service owns:

- create-only, overwrite, and patch mutation postures;
- fresh-read/decision/CAS coupling;
- hard-CAS versus bounded-retry behavior;
- semantic no-op detection;
- timestamp normalization before validation;
- kind-conformance evaluation;
- actor propagation;
- typed conflicts and structured final-version receipts.

The service must not own:

- CLI flags, stdin, output formatting, or TOON;
- `CliError`, exit codes, help strings, or remote invocation hints;
- browser confirmation UI or Page authorization policy;
- HTTP request or response types.

The CLI becomes a thin adapter: resolve input and policy, call the shared service, then translate typed results and failures into its established CLI contract. Existing CLI behavior and tests are the parity proof for this extraction.

The raw `PUT /v0/.../docs/<id>` route is not a substitute for this service. It provides document-ID safety, base OKF normalization, and CAS, but not the complete kind/no-op/patch/attribution policy owned by the CLI mutation pipeline today.

## Decision 2: Pages request actions; the shell grants each execution

A Page capability expresses requested access, not authority. The v1 requested capability is `bridge: bundle-propose`. It includes the existing bundle-read operations and permits the iframe to submit a proposal to trusted chrome; it does not permit a write. The shell must never grant mutation merely because incoming Page frontmatter says so.

For the first version, every mutation is individually confirmed. There is no durable trust grant.

The Page sends exactly one narrow action shape:

```json
{
  "bridge": "v1",
  "type": "action.propose",
  "requestId": "page-local-correlation-id",
  "action": {
    "kind": "document.set-field",
    "docId": "review-requests/architecture",
    "field": "status",
    "value": "approved",
    "expectedVersion": "sha256:…"
  }
}
```

The Page provides no authoritative presentation context in v1. The shell derives the target, current values, candidate values, confirmation copy, and diff from canonical bundle data.

## Trusted execution flow

```text
Sandboxed Page
    │ structured action intent
    ▼
UI shell broker
    │ source + frame generation + requested-capability checks
    ▼
Trusted candidate builder
    │ current document + narrow patch + kind validation
    ▼
Shell-native confirmation
    │ exact canonical target and diff; explicit human approval
    ▼
Shared document mutation service
    │ single-shot expected-version CAS + actor/provenance
    ▼
Bundle write → final receipt → normal live-change event
```

At execution time the shell revalidates the Page identity, registry version, HTML content version, requested capability, target document version, and exact approved mutation. Any change invalidates the approval.

## Initial capability boundary

The first interactive proof is deliberately narrow:

- local `--dir` UI mode only;
- update declared frontmatter fields on an existing document;
- required `expectedVersion` from the canonical read;
- one shell-native confirmation per action;
- single-shot CAS: a stale human decision reports a conflict and refreshes rather than silently retrying;
- kind-conforming fields and enum values only;
- attributed, auditable result and final-version receipt.

Explicitly excluded from the first proof:

- arbitrary full-document replacement;
- body replacement or arbitrary Markdown injection;
- link mutation;
- document creation;
- deletion;
- remote-mode mutation;
- persistent per-Page grants;
- Page-controlled confirmation markup.

These exclusions can be revisited as separate, evidence-backed capabilities.

## Protocol v1

### 0. Immutable frame launch identity

An approval must bind the HTML bytes that actually produced the proposal, not whatever blob head happens to be current when prepare runs. V1 therefore strengthens frame launch before adding actions.

When trusted chrome opens a registered source view, the server creates a bounded launch record containing:

- random shell-held `launchId` and the separate iframe URL nonce;
- source registry type (`Page` or `View` during the migration), ID, and document version;
- resolved entry blob key, content type, blob version, and the exact blob bytes;
- resolved bridge capability and expiry.

The nonce route serves the pinned bytes from that launch record. It never re-reads a mutable blob head and claims those newer bytes are the launched content. A reload of the nonce succeeds only while the current registry/blob heads still match the launch record; otherwise it is revoked. The mint response gives `launchId` to trusted chrome alongside the iframe URL, and chrome binds that launch ID to the iframe window and frame generation. The launch ID is not sent into the iframe.

Prepare and commit both require the launch record and independently require the current registry and blob heads to match it. If bytes A remain loaded while the blob advances to B, A's proposal is revoked; it can never be attributed to B.

### 1. Iframe proposal message

The iframe-to-shell message is the JSON shape above and no broader. Unknown keys are rejected rather than ignored. `requestId` is only an iframe correlation value; it is echoed in the final bridge response and is never an approval credential.

The shell accepts a proposal only when all of these are true:

- `event.source` is the currently mounted iframe window and the frame generation is current;
- the current registry entry still requests `bridge: bundle-propose`;
- the serialized message is at most 8 KiB;
- `requestId` is a non-empty string of at most 64 characters and there is no other pending proposal for the frame;
- `docId`, `field`, `expectedVersion`, and `value` have exactly the v1 shapes below.

`document.set-field` v1 is limited to an existing governed document and one declared scalar frontmatter field:

- `docId` must pass the core concept-ID guard;
- `expectedVersion` is required, non-empty, and at most 256 characters;
- `field` is non-empty, at most 128 characters, is an own declared required/optional field on the target's governing Kind, and is not `type`, `timestamp`, or `actor`;
- `value` is a string, finite number, or boolean; strings are at most 4 KiB of UTF-8; arrays, objects, `null`, field deletion, and multi-field patches are excluded;
- if the Kind declares enum values for the field, the value must satisfy that declaration;
- the target may be any existing document the current bundle-read capability can read; trusted confirmation, not Page-authored target scoping, is the v1 authority boundary.

Malformed or disallowed proposals receive a typed rejection and never open confirmation UI.

An action-capable iframe obtains its `expectedVersion` through a new `read-versioned` bridge request available only under `bundle-propose`. It returns the canonical document and the version from that same read. Existing read requests and the `none`/`bundle-read` response contracts remain unchanged.

### 2. Trusted prepare request

The shell does not build confirmation markup from Page strings. After bridge validation it sends `POST /__ui/actions/prepare` with the existing same-origin session credential and `X-Requested-With` CSRF header:

```json
{
  "launchId": "shell-held-launch-id",
  "action": {
    "kind": "document.set-field",
    "docId": "review-requests/architecture",
    "field": "status",
    "value": "approved",
    "expectedVersion": "sha256:…"
  }
}
```

The shell takes `launchId` from its frame record, never from the iframe message. The request carries no Page-authored title, explanation, HTML, or confirmation copy. The route rejects non-JSON content, any `X-Requested-With` value other than exactly `agentstate-lite-ui`, and remote mode before performing registry, blob, Kind, or target reads.

The server independently resolves and binds:

- source registry document ID and version;
- source HTML blob key and content version;
- resolved `bundle-propose` capability;
- canonical target document ID, title, governing Kind, current field value, and version;
- the effective governing Kind's convention ID, document version, and canonical semantic digest;
- canonical new scalar value;
- exact system-managed changes: a fixed approval-time timestamp and the resolved advisory actor;
- an expiry two minutes after preparation.

The requested `expectedVersion` must equal the fresh target version before a confirmation is shown. The effective Kind is the registry winner for the target type; binding its ID catches duplicate-precedence changes, while its version and semantic digest catch edits. Kind validation runs against the complete candidate during prepare. A stale or invalid proposal returns a typed result without minting an approval.

Prepare and commit share one pure `document.set-field` planner. It clone-preserves the current frontmatter/body, defines the selected field as an own data property using a prototype-safe setter, fixes the approval-time timestamp, applies the resolved actor exactly as commit will, and produces both the service candidate and canonical typed diff. Commit never rebuilds policy independently. If the requested field already has the same typed scalar value, prepare returns `unchanged` and mints no token; timestamp and actor are not displayed or persisted, matching `mutateDocument`'s no-op-before-attribution behavior.

V1 actions require a non-empty advisory actor resolved once at UI-server boot with `ui --actor` taking precedence over `AGENTSTATE_LITE_ACTOR`. Actor labels remain advisory, not authentication. Read-only UI remains usable without one, but prepare rejects action proposals with setup guidance rather than preserving a prior writer's actor or inventing an identity.

On success the server stores a bounded pending record and returns trusted chrome a random opaque `approvalToken`, expiry, and a canonical confirmation model. The confirmation model contains the source view identity, target ID/title, field, before/after values, target version, actor, and the system-managed timestamp/actor changes. The token is never forwarded into the iframe.

### 3. Shell-native confirmation

Trusted chrome renders the canonical confirmation model outside the iframe. Scalar before/after values use canonical JSON scalar rendering, so `true` and `"true"`, `1` and `"1"`, and an empty string are visibly distinct. V1 has two choices only: cancel or apply. Page-provided markup, labels, explanations, colors, and button text are not accepted.

Cancel immediately disables Apply and sends `POST /__ui/actions/cancel` with only `{ "approvalToken": "…" }` under the same session and CSRF gates; the server atomically consumes it. Apply sends `POST /__ui/actions/commit` with the same token-only body and gates. Double-clicks share one in-flight promise in the shell.

### 4. One-shot commit binding

The server consumes the token atomically before attempting the mutation. Every terminal outcome—success, conflict, revocation, validation failure, or runtime failure—consumes it; retries require a fresh proposal and a new human confirmation.

Before sending the commit request, the shell requires the same iframe window, frame generation, and launch ID that produced the proposal; navigation or reload clears the trusted confirmation and consumes/cancels its token. Immediately before mutation, the server re-resolves the launch, source registry entry, and HTML blob and requires their IDs, exact versions, and capability to match the prepared record. It reloads the Kind registry, requires the same effective Kind ID/version/semantic digest, and re-reads the target at the prepared version. Launch revocation, registry edit/deletion, HTML retarget/change, capability downgrade, effective-Kind change, expiry, or concurrent target mutation invalidates the approval.

The server then calls core `mutateDocument` in patch mode with the stored service candidate, bound actor, `persistActor: true`, and a hard `expectedVersion`. It does not silently retry a stale human decision or reconstruct the candidate from newer state. V1 adds no Page-controlled provenance fields.

### 5. Typed results

The bridge returns one terminal result carrying the original `requestId`:

- `committed`: `{ action: "document.set-field", docId, field, changed, version, warnings, confirmed: true, source: { registryId, registryVersion, contentVersion } }`;
- `unchanged`: the typed scalar already equals the stored field; returned during prepare with no token or confirmation;
- `cancelled`: the human declined or the shell discarded the proposal;
- `conflict`: target version changed; includes expected/actual versions and requires refresh plus reconfirmation;
- `revoked`: source identity, content, capability, or frame generation changed;
- `expired`: the one-shot token exceeded its two-minute lifetime;
- `rejected`: malformed input, undeclared/reserved field, unsupported value, or Kind failure;
- `failed`: an operational error that is not safe to represent as a caller correction.

The iframe receives no session secret, launch ID, approval token, stack trace, or raw backend error. A successful result carries the final version returned by `mutateDocument`; the receipt is immediate and a changed write reaches open consumers eventually through the ordinary watcher/event path. No watcher event is promised for `unchanged`.

The shell owns one terminal-state machine per `(frame generation, requestId)`. Prepare, cancel, expiry, commit response, navigation/reload, and watcher refresh may race, but only the first terminal transition settles the proposal; later completions are ignored. Async prepare/commit responses are generation-fenced before display or iframe delivery. If navigation destroys the source iframe, the shell settles it as revoked internally and does not attempt delivery into a replacement frame.

### 6. Bounds and replay policy

- One pending proposal per frame; later proposals are rejected until the first terminates.
- At most 128 pending approval records per UI-server process; oldest expired records are swept before a new one is accepted.
- If the cap remains full after that sweep, preparation is rejected rather than evicting a live approval.
- Approval tokens contain at least 128 bits of randomness, are compared as opaque values, expire after two minutes, and are single-use.
- Request IDs are correlation only and may repeat after a proposal terminates.
- Local `--dir` mode is the only v1 execution mode. Remote mode returns `rejected` before preparation.
- Existing `bridge: none` and `bridge: bundle-read` behavior is byte-for-byte unchanged.
- Before measuring the 8 KiB message cap, the shell validates an acyclic, exact-key, JSON-compatible plain-object shape; cyclic or non-JSON structured-clone values are rejected. Size is the UTF-8 byte length of the resulting canonical JSON.

## Trust and security invariants

1. **Bundle content can request capability but cannot grant it.** Authorization belongs to the local shell and human.
2. **The Page never holds a session credential.** The shell remains the only API principal.
3. **The confirmation is trusted chrome.** It renders outside the iframe and uses canonical data, so Page content cannot disguise the mutation being approved.
4. **Approval binds to exact state.** Page identity/content and target version changes revoke it.
5. **Requests are narrow and bounded.** The broker validates operation type, identifiers, field names, payload size, and correlation/replay state before candidate construction.
6. **Human decisions are not automatically replayed.** Conflicts require a refreshed proposal and renewed approval.
7. **One domain mutation authority.** CLI, trusted UI, and any future server consumer share the same document mutation service.
8. **Read-only remains the default.** Existing `bridge: none` and `bridge: bundle-read` Pages gain no new power.

## Actor and provenance model

Actor labels remain advisory rather than authentication. A committed action should nevertheless record enough provenance for audit and debugging:

- resolved human/session actor where available;
- that execution was human-confirmed through the UI shell;
- source Page registry ID;
- source Page content version;
- action type and final document version.

For v1, only the existing advisory actor is persisted in document frontmatter/history. The typed receipt carries source Page ID/version, action kind, confirmation fact, and final document version for the current session, but v1 does not add a new durable provenance schema. Such a schema remains a separate decision and must not be smuggled into arbitrary Page-controlled frontmatter.

## Sequence

1. **Done:** complete the mutation-boundary audit and cross-process CAS prerequisite.
2. **Done:** extract the CLI-neutral document mutation service and switch existing CLI callers to it with no behavior change (PR #85).
3. **Current:** specify and review the action-intent protocol, requested capability, one-shot approval binding, and typed receipts.
4. Add a trusted shell endpoint and shell-native confirmation for one existing-document field patch.
5. Prove the workflow with a real Review Request or Task transition.
6. Run independent security review and adversarial QA covering malicious Pages, spoofed confirmations, reload/revocation races, stale versions, replay, oversized input, and concurrent agent writes.

## Acceptance criteria

The architecture is ready for its first interactive proof when:

- all existing CLI mutation behavior delegates to the shared service and its existing tests remain green;
- a read-only Page cannot invoke or escalate into a mutation action;
- an action-requesting Page cannot write without a shell-native human confirmation;
- the shell displays an exact canonical diff and executes only that approved change;
- a concurrent mutation produces a visible conflict without clobbering or silent retry;
- changing or revoking the Page during the interaction invalidates the pending approval;
- the receipt carries the final document version and normal live events refresh all consumers;
- no remote, delete, full-body, or arbitrary-document-write path is introduced by the first slice.

## Open decisions after v1

- Which action follows field update: typed link addition, constrained document creation, or append-only review response.
- Whether later durable grants are valuable enough to justify a local trust store keyed by Page identity and content digest.
- Whether successful human confirmations need a durable provenance event beyond the existing actor field/history and typed session receipt.
