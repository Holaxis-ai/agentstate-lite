---
type: Review
title: 'Review: transient and durable View unification'
actor: openai/reviewer
timestamp: '2026-08-02T18:46:27.002Z'
---
# Verdict

**APPROVE THE CONSOLIDATION DIRECTION; REVISE THE CONTRACT BEFORE IMPLEMENTATION.**

The central claim in [Transient and durable Views: one source contract](../designs/transient-durable-view-unification.md)
is correct: lifetime should not select a second View language. A self-contained active View should
be launchable from process memory or from a bundle registration through the same admission,
authorization, bridge, sandbox, sizing, recovery, and action authorities. Persisting it should
change lifetime and discoverability, not its executable bytes.

This is a real simplification, not merely vocabulary cleanup. The current generated branch owns a
second input/output schema, launch registry, frozen object envelope, query-selection path,
declarative binding language, sanitizer/materializer, action declaration system, recovery
discriminator, frame-construction path, and extensive tests/guidance. The replacement needs one
new transient source case inside the existing active-View authority, but should delete more
mechanism than it adds.

The exact proposal is not yet executable safely. Three contract amendments are blocking: a
non-synthetic transient source/authorization identity; an explicit authority that can persist the
exact bytes held by the MCP process; and a no-regression decision for the demonstrated governed
action journey. Approval UX and the loss of selection-confined snapshots must also be made honest
before the old path is deleted.

# Blocking findings

## 1. Transient launches need a real source identity, not a fabricated registry identity

The proposed design says this correctly, but the implementation shape needs to freeze the type.
Current `PageLaunch`, `launchIsCurrent`, `pageLaunchAuthorizationSubject`, and
`LocalViewAuthorizationStore` are registry-shaped: authorization contains `registryId`, and
currentness rereads that registration plus its entry blob. The current generated action adapter
already demonstrates the smell the new design must remove by manufacturing
`mcp-ephemeral:<contentHash>` as a registry ID.

Use one discriminated source authority, conceptually:

```text
registered: registry ID + exact registry version + entry key + exact entry version
transient:  exact source hash + immutable source-store record + expiry
```

Common launch state may then carry admitted bytes, content type, requested/effective access,
execution policy, authorization subject, and expiry. Source-specific currentness is different by
construction: a registered source is current only while the bundle registration and entry still
match; a transient source is current only while its immutable hash-addressed record remains
present and unexpired. `BridgeService` can consume both through the same `BridgeLaunchAuthority`
without learning either storage form.

The transient authorization tuple must explicitly include bundle identity, source kind/hash,
exact content type, effective access, execution mode, and policy version. Decide whether a
transient approval is process-local or may use the current persistent local authorization store.
For the first proof, process-local approval is the safer default for model-authored code; durable
registry approvals can retain their current local persistence. In either case, changing bytes,
bundle, access, or policy must ask again. Do not make a fake registry document or ID merely to fit
the current subject interface.

## 2. Exact-byte save has no defined caller or authority

The design requires saving the exact bytes held by the transient launch, but the ordinary CLI
cannot read another MCP process's in-memory source store. Having the model rewrite its tool-input
HTML to a file and then run `view create` is not an exact-byte persistence guarantee; it is a
second serialization attempt whose equality is only hopeful until compared.

Before claiming promotion, define one server-side save operation over the current transient
launch. It may be a narrowly scoped model-visible View command or trusted-shell interaction, but
it must:

- resolve the source bytes from server-owned launch state rather than accept replacement HTML;
- require an explicit durable ID/title/description/access decision;
- revalidate launch expiry, admitted bytes, requested access, and source hash immediately before
  writing;
- promote the exact bytes, then create the registry with create-only CAS through existing write
  authorities;
- report both identities and final versions, plus an orphaned blob if registration fails; and
- require a separate durable authorization decision because the authorization source identity
  changed.

If the first proof intentionally uses a local source file as the common authority instead, say so
and have both transient launch and `view create` consume those exact file bytes. Do not leave the
cross-process handoff implicit. The final source-hash comparison is necessary but does not itself
supply the missing persistence channel.

## 3. Do not delete the only demonstrated conversational action path without replacement

The generated presentation path currently owns the working MCP `document.set-field` experience:
the trusted shell renders controls outside untrusted presentation, preparation revalidates the
frozen selection and version, the human confirms canonical before/after state, and commit reaches
the shared mutation boundary. Standard active MCP Views currently accept only `bundle-read`.

The design offers either action parity or a temporary read-only regression. Given the product's
stated value—humans engaging with agents and acting through live interfaces—the recommended
choice should be explicit: **standard transient and durable MCP Views must gain
`bundle-propose` before the generated contract is deleted.** Reuse `BridgeService`,
`TrustedActionService`, trusted shell confirmation, and `mutateDocument`; do not retain the
generated source format merely to keep its button declarations.

This is a high-risk write-boundary unit and should remain separately reviewed and adversarially
tested. The old path can coexist only until that replacement and its acceptance proof land; it
must then be removed in the consolidation unit.

# Required design amendments

## 4. State the approval UX and authority widening plainly

The old generated path exposes only a bounded, frozen selection without executing model-authored
script. A standard transient View that requests `bundle-read` executes model-authored JavaScript
and can query the whole bundle after approval. The existing sandbox/CSP is defense-in-depth; the
approval is the decision to trust the code with that authority. This is a deliberate security and
product trade, not semantic parity.

Every question-specific source will usually have a new hash, so frequent generation means a
frequent approval prompt. The first real-host proof must evaluate whether that prompt remains
meaningful rather than becoming a reflexive click-through. The trusted prompt should say that an
agent authored executable View code and name the requested bundle authority; it should not imply
that AgentState proved the generated code safe.

Do not solve this by silently persisting blanket approval for “generated Views.” Exact bytes and
access remain the minimum subject. Prefer stable saved Views for repeated journeys, which is the
product pressure this design is meant to create.

## 5. Explicitly accept or replace the old invocation-input behavior

The generated contract lets the agent pass explicit object IDs or one bounded query separately
from presentation. Standard active Views currently have no host-neutral invocation-parameter
contract; they query through the bridge, or their source hardcodes IDs.

For the first unification proof, keep the simplification honest: do not rebuild a second selection
envelope. A transient View may issue its own bounded bridge queries or embed explicitly selected
IDs in its exact source. The latter changes the hash and approval for each selection and may make
that exact source a poor durable generic View; that is acceptable if documented. Add a shared
invocation-input contract later only if repeated dogfood proves it necessary, and then make it a
capability of both transient and durable Views rather than MCP-only generated input.

## 6. Record the intentionally lost capabilities

Deleting the passive path removes:

- approval-free display of selected authoritative snapshots;
- selection-confined read/action authority;
- a coherent frozen “what the agent saw” envelope;
- the tiny declarative binding authoring surface; and
- generated-only shell action declarations.

The shared `render-document` bridge row replaces the important Markdown benefit, and normal
bridge query/read/edges/subscription are more expressive than declarative text bindings. Frozen
review evidence can be represented as a durable Artifact or explicit versioned records when it is
actually required. These losses do not justify maintaining the parallel runtime, but the design
should list them so deletion is an informed product choice rather than an accidental regression.

# Hidden host and lifecycle constraints

- The active nested-frame path is already proven for registered Views in MCP, so transient active
  bytes require no new browser isolation primitive. They should reuse the exact `active-view-v1`
  admission/CSP/sandbox path; incompatible hosts must continue to fail closed.
- MCP tool results currently carry active HTML before approval so the package shell can display
  the trust decision. A conversation host may retain those unexecuted bytes in history. Record
  that source-retention fact; no bundle data should be included in the source.
- Suspension/resume for a transient launch must re-mint from the immutable transient source store,
  not from a synthetic bundle registration. Expired source or process restart may honestly require
  a new model invocation; that is part of transient lifetime.
- The pending-launch recovery registry should collapse to one active payload/source discriminator;
  it must retain exact one-shot claim behavior for hosts that strip structured payloads.
- Keep the existing 512-KiB active-source admission bound, bounded launch count/TTL, bridge message
  limits, one-at-a-time polling, and epoch/revocation fences. Unification is not permission to
  weaken those host-independent controls.

# Practical sequence

1. Amend this design, the portable-View design, and the conversational roadmap with the source
   union, transient approval lifetime, exact-byte save authority, first-pass input posture, and
   action no-regression decision.
2. Generalize the existing active launch/authorization authority to registered and transient
   source variants. Keep one admission function, one byte limit, one bridge authority, and no
   synthetic registry identities.
3. Add MCP transient active launch and prove authorization-before-data, query, read,
   `render-document`, edges, subscribe/polling, resizing, structured-payload recovery, suspension,
   and process-expiry behavior in a supported host.
4. Add the server-owned exact-byte save operation. Persist one transient source unchanged, compare
   hashes, discover the registered View, and launch the same durable ID in MCP and web. Fresh
   durable authorization is expected.
5. Add standard MCP `bundle-propose` through the shared action/mutation authorities, with
   independent review and adversarial QA. Prove one human-confirmed scalar action from both a
   transient and the saved durable View.
6. Delete the generated contract in bounded consolidation units: generated schemas and query
   selection, `McpViewLaunchRegistry`, snapshot envelopes/refresh, presentation materialization,
   `data-aslite-*`, generated actions, dual payload/recovery/frame branches, tests, empty-selection
   special cases, CLI/skill/reference prose, and outdated design/roadmap claims.
7. Finish with an agreement fixture proving that one exact active source has the same supported
   semantics before and after persistence and in both hosts. Net source/test/guidance deletion is
   an explicit success condition.

# Verdict basis

Reviewed proposal bytes:
`sha256:602c85e9c4da11ea674033bea23989b24e4adc48e26e616534ea939539ef5e2e`.

Compared in full with the governing portable-View design and the cited generative,
promotion/discovery, and shared-security designs. Current implementation was traced through the
active launch/authorization/bridge authorities, persistent local authorization store, generated
MCP launch/presentation/action path, durable MCP payload/approval/bridge path, web launch adapter,
and fixed App recovery/frame lifecycle.

# Final recommendation

Adopt the invariant after the amendments above:

> A View has one active source contract. Lifetime selects an immutable transient source or a
> registered bundle source; it does not select another authoring language or bridge.

Do not preserve the script-free frozen-snapshot contract for compatibility. Do preserve it until
the unified path proves exact-byte saving and governed conversational action, then delete it
decisively.
