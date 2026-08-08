---
type: Finding
title: Architectural-smell investigation synthesis
actor: openai/codex
timestamp: '2026-08-08T13:41:40.248Z'
---
# Decision

Do not convert the quantitative architectural-smell report into a remediation backlog. Its
measurements remain useful inventory, but the four current-main investigations reduce to two
narrow units with demonstrated value, one retained observation, and one closed cleanup claim.
The existing simplification audit remains the ranking authority; this Finding is an adjudication
input, not a parallel queue.

| Rank | Candidate | Decision | Why |
| --- | --- | --- | --- |
| 1 | Registered-View launch preparation | **Create a task now** | A live security-sensitive preparation/currentness authority is implemented twice, and history shows two semantic changes coordinated across both copies. |
| 2 | Core production import direction | **Create a task now** | The repository's bottom-layer rule is important and currently true, but no source-level executable check owns type-only/upward edges. |
| — | Core's server-backed tests | **Retain as an observation with triggers** | The isolated-test cost is empirical, but the dependency supports an intentional cross-backend contract suite and no present workflow defect justifies redistributing ownership. |
| — | CLI type-only cycles | **Invalidate/close as standalone work** | The runtime graph is acyclic, the recipe relocation premise is stale, and changing code to satisfy a type-insensitive counter has no demonstrated value. |

# Reduction standard

The promotion rule is causal evidence, not metric magnitude: an executable invariant gap,
recurring defect, repeated change coordination, measurable operability cost, or a feature that
materially needs decomposition. File size, custom complexity counts, clone counts, type-erased
SCCs, and expected LOC savings do not cross that threshold by themselves.

This preserves the restraint stance in
[Change-surface simplification](../roadmap-items/change-surface-simplification.md) and the ranking
role of the [bounded simplification audit](../tasks/simplification-audit.md). The
[CLI architecture review](../reviews/cli-package-architecture-review.md) is stronger than the
source survey on runtime-cycle and command-framework claims; it found no runtime SCC and promoted
only a narrow grammar authority after reproducing a side effect. The
[mutation-boundary audit](../designs/mutation-boundary-audit.md) is stronger on mutation posture
and rejects a ceremonial funnel for raw replacement, expect-absent, hard-CAS, and domain-specific
mutations. No mutation, `defineCommand`, generic complexity, or clone-removal task follows from
this investigation.

# 1. Registered-View authority — create task now

## Why the promotion survives challenge

The source report overstated the duplication as the whole launch sequence. On shipped CLI paths,
post-launch bridge, action, approval, and currentness checks already use `view-runtime`. There is no
present exploit or observed user-visible disagreement.

The narrower defect in authority ownership is nevertheless real. Web minting still independently
performs registered-doc/version resolution, registration validation, entry read/version pinning,
active-HTML admission, exact-byte identity, registered launch minting, and the post-mint race fence.
MCP calls `mintActiveViewLaunch` for the same operation. Exact-byte approval and `entry_version`
changes were each applied to both copies historically. That is demonstrated repeated coordination
on a security boundary, and it makes existing design prose claiming both hosts use one launch
authority false.

## Hidden scope and conflicts

This is not a local extraction. The shipped remote CLI already supplies a `RemoteBackend`-backed
semantic `Bundle`, but `UiServerOptions` also supports a private no-`Bundle` remote fallback.
Several tests call that fallback directly even though it cannot construct the complete bridge host,
and its upstream-failure behavior already differs from the shipped path. Literal consolidation
therefore requires narrowing that private option contract and deleting the fallback; leaving it in
place would preserve the second authority.

`mintActiveViewLaunch` currently types only not-found distinctly while the HTTP host exposes a
larger status/message taxonomy. Exact response preservation requires typed runtime failures or an
equally explicit non-string-matching mapping. The legacy `{ key }` mint input is not used by the
current SPA, but deleting it would add an unnecessary compatibility claim. Preserve it initially as
a narrow key-to-registry-ID ingress adapter, then enter the shared authority.

This work is independent of core's import gate and of the mutation audit. It should not overlap an
in-flight View admission, approval, remote-UI, or `ui-server` option-contract change without an
explicit rebase/ownership handoff.

## Minimal task scope

1. Require a semantic `Bundle` in both `UiServerOptions` modes while retaining remote origin/key
   separately for `/v0/*` proxy transport.
2. Route exact-ID web minting through `mintActiveViewLaunch`; route every launch revalidation
   through `launchIsCurrent`; route catalog projection through `listViewCatalog`.
3. Remove the no-`Bundle` `remoteRegistryHeads`/direct-blob registered-View implementation and its
   fallback-only tests.
4. Preserve current web HTTP payloads, status codes, messages, authorization behavior, nonce/CSP
   handling, and `{ key }` ingress behavior through explicit typed failure translation.
5. Delete the imports and host helpers that can reconstruct registered launch identity outside
   `view-runtime`.

Non-goals: a generic source/provider/service abstraction; wire-protocol changes; View UI changes;
approval-policy changes; mutation work; legacy folder/name migration; transient-launch changes; or
removing `{ key }` compatibility in the same unit.

## Proof, risk, and expected result

- Freeze pre-change local and `RemoteBackend` route fixtures for success and the current failure
  taxonomy: missing/invalid registration, missing/pinned entry, inadmissible content, mid-mint
  drift, upstream failure, and authorized/unapproved success.
- Run one local/remote web-versus-MCP agreement table over registry identity/version, entry,
  capability, normalized content type, and byte hash.
- Probe the authority red once: perturbing runtime admission/hash/currentness must fail both host
  surface proofs.
- Enforce static ownership: no production source outside `view-runtime` mints
  `sourceKind: "registered"` or retains the primitives needed to recreate its identity.
- Run the focused runtime/server suites and full repository gate.

Risk/review tier: **security-boundary consolidation with a private option-contract narrowing**.
Use Builder -> independent exact-SHA review -> focused adversarial QA. Review must center on
pre-change fixture provenance and fail-closed remote behavior.

Expected result: one registered-launch preparation/currentness/catalog authority, deletion of the
mode-specific remote compatibility implementation, and no new abstraction layer. Do not promise a
LOC target; the value is removal of a live security decision path.

Sequence: highest-value of these candidates. Land before another change to registered-View
admission, identity, pinning, approval, or currentness. It may be prepared independently of the core
gate, but should be based on current main after any active work touching the named packages settles.

# 2. Core import direction — create task now

## Why the promotion survives challenge

Current production source is clean: core has no workspace import, and only Node builtins plus its
declared `gray-matter` and `js-yaml` dependencies. This is preventive enforcement, not remediation,
and it adds test LOC. The external packed-core proof also supplies substantial counterevidence.

The gap is still distinct and executable. The packed-artifact proof cannot own erased type-only
source dependencies and localizes failures only after a full build. An upward type import would make
core's public types depend on a consumer while preserving runtime acyclicity. The bottom-layer rule
is one of the repository's strongest stated package contracts, and comparable packages already
enforce their direction with AST tests.

## Hidden scope and conflicts

A robust gate is closer to the existing AST tests than to the report's “about 30 lines.” Do not turn
this into a shared architecture-test framework merely because scanner code is repeated. The rule
must scan production source only; extending it to `packages/core/test` would collide with the
separately adjudicated server-backed integration fixture. The allowed external set must come from,
and pin, the intentional runtime manifest contract rather than silently permit every dev dependency.

## Minimal task scope

Add one core-local source test that rejects workspace imports, relative escapes, import-equals,
non-literal dynamic imports, and `require`/`createRequire` channels while allowing Node builtins,
relative modules inside `core/src`, and exactly the declared runtime dependency set.

Non-goals: restrictions on core tests/devDependencies; moving contract tests; a reusable repository
scanner package; `madge`/`jscpd`; cycle, size, or complexity gates; production-source refactors.

Proof: the real-tree pass plus synthetic red cases for a type-only upward import, relative escape,
and non-literal dynamic import; green cases for an internal relative import and both declared
externals; manifest peer/optional dependency assertions; core tests/typecheck and the repository
gate.

Risk/review tier: **low, test-only invariant contract**. Author validation plus relevant automated
checks is sufficient under the repository ladder; independent review is optional unless the unit
extracts shared machinery or changes package policy.

Expected result: zero production deletion and positive test LOC. The improvement is that the
bottom-layer direction moves from prose/reviewer memory into one executable owner; do not sell it as
a size simplification.

Sequence: independent of the View task and safe to land first as a small isolated unit if it does
not delay the higher-value authority consolidation. It must not absorb the core/server test decision.

# 3. Core/server test dependency — retain observation with triggers

The all-scope cycle and developer inconvenience are empirical: after a clean core-only build, five
core test modules fail to load until `server/dist` is built. That does not establish runtime,
packaging, CI, or product harm. Root build/check and mutation workflows already encode sibling build
order, while the reviewed StorageBackend contract deliberately registers Filesystem, Memory, and
Remote together. Moving all five tests to server would invert semantic ownership; adding a contract
workspace would add a package and another test authority.

Retain the observation under the simplification audit. Promote only if core gains a supported
independent build-and-test promise, repeated failures or measured mutation cost are attributed to
the sibling build, an external adapter forces a shared contract-test authority, or a per-assertion
ownership matrix proves meaningful deletion and one clear owner. Any future unit begins with that
matrix; it is not a bulk file move. Removing the devDependency, proving a clean core-only build/test,
and avoiding a duplicated contract helper are acceptance conditions, not assumptions.

# 4. CLI type-only cycles — invalidate and close

Close this as a standalone remediation candidate. The runtime graph has zero SCCs; TypeScript with
`verbatimModuleSyntax` erases both closing imports. No build, editor, test-isolation, runtime, or
change-history failure is attributable to them. The recipe recommendation is partly stale because
the types already live in `recipe-parser.ts`; one internal import merely still uses the stable
facade. Moving `EstablishOutcome` risks adding a leaf module or muddying `sync-outcomes.ts` for no
semantic gain.

Do not select a type-insensitive cycle gate and then change production structure to satisfy it. A
future real value-cycle or reproducible tooling failure is a new claim with new evidence. If a
feature already edits one of these exact imports and the cleanup becomes free while clarifying
ownership, it may ride that feature; it does not need a standing task or observation slot.

# Source investigations

- [Core import-direction gate investigation](core-import-direction-gate-investigation.md)
- [Core/server test-dependency investigation](core-server-test-dependency-investigation.md)
- [Registered-View launch-authority investigation](registered-view-launch-authority-investigation.md)
- [CLI type-only cycles investigation](cli-type-only-cycles-investigation.md)
- [Architectural-smell report remediation claim](../claims/architectural-smell-report-remediation.md)

