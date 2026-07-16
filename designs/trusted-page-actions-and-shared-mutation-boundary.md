---
type: Design
title: Trusted Page Actions and a Shared Mutation Boundary
actor: mike/codex
timestamp: '2026-07-16T02:32:44.761Z'
---
# Trusted Page Actions and a Shared Mutation Boundary

**Status:** Proposed. This design records the safe path from read-only bundle Pages to useful human-confirmed interaction. It does not authorize implementation or weaken the existing read-only Page contract.

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
- The CLI's `mutateDoc` adds document policy: create/overwrite/patch postures, no-op detection, kind validation, timestamps, actor attribution, hard CAS, and final-version receipts.
- The Page iframe is sandboxed with scripts only, has an opaque origin and no network access, and communicates solely through a source-validated `postMessage` bridge.
- The shell already revokes bridge access across reloads, registry changes, deletion, and navigation.
- The wire and storage seams already surface version conflicts.

The missing architectural seam is a CLI-neutral document mutation service that trusted non-CLI consumers can call without bypassing document-level invariants.

## Decision 1: extract the document mutation service below the CLI

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

A future Page capability should express requested access, not authority. A bundle-carried field such as `bridge: bundle-propose` may tell the shell that a Page intends to propose actions. It must never grant mutation merely because incoming Page frontmatter says so.

For the first version, every mutation is individually confirmed. There is no durable trust grant.

The Page sends a narrow, structured intent such as:

```json
{
  "bridge": "v1",
  "type": "propose-update",
  "docId": "review-requests/architecture",
  "expectedVersion": "sha256:…",
  "changes": {
    "status": "approved"
  }
}
```

The Page may provide presentation context, but the shell derives the authoritative target, current values, candidate values, and diff from canonical bundle data.

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

The exact persistence shape requires a separate decision; it must not be smuggled into arbitrary Page-controlled frontmatter.

## Sequence

1. Complete or consume the mutation-boundary audit so the extraction preserves the actual ownership map.
2. Extract the CLI-neutral document mutation service and switch existing CLI callers to it with no behavior change.
3. Specify the action-intent protocol, requested capability, one-shot approval binding, and typed receipts.
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

## Open decisions

- Final requested-capability name (`bundle-propose`, `bundle-actions`, or another term).
- Whether the shared document service belongs directly in core or in a small application package above core; the dependency graph and browser/runtime boundaries should decide this, not naming preference.
- How human identity and Page provenance are represented without treating advisory actor labels as authorization.
- Which action follows field update: typed link addition, constrained document creation, or append-only review response.
- Whether later durable grants are valuable enough to justify a local trust store keyed by Page identity and content digest.
