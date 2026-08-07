---
type: Context Note
title: 'CLI architecture review: skeptic cross-review and finding consolidation'
actor: codex-architecture-skeptic
timestamp: '2026-08-07T14:48:57.893Z'
---
# Summary

Adversarial cross-review of the frozen `packages/cli` architecture evidence approves two public finding families for the minimal final set: (1) create-only lifecycle ownership does not keep postcondition and compensation claims bound to a stable, fully observed target state, consolidating DR-01 with SEC-BRANCH-01 while preserving two causal subpaths; and (2) command grammar does not centrally enforce positional arity, with an exact built-artifact `init` reproduction elevating DR-02 above the other maintainability candidates.

DR-03, DR-05, SEC-BRANCH-02, TST-CLI-01, TST-CLI-03, and TST-CLI-04 should be retained as observations or validation gaps rather than correctness findings at current evidence. DR-04 and the `ui` portion of TST-CLI-02 remain unresolved lifecycle validation gaps; the exact built `serve` signal path survived the tested Darwin/Node 25 probe and is refuted as a present general `serve` failure only within that boundary.

An unqualified approval verdict is blocked until private-route issues receive a private disposition and the final report treats current external dependency-advisory status as not assessed rather than absent. The public report must preserve only the exact routing markers below and must not infer or publish private mechanics.

# Review identity and contract

- Target source: clean `81b3c39ff252013e318b1a714b63430a24074d70` on the frozen review branch.
- Target artifact: `packages/cli/dist/agentstate-lite.mjs`, 4,559,755 bytes, SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583`.
- Approved template: `reviews/architecture-review-template` v1.0, `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- Empirical evidence: `context-notes/cli-architecture-review-empirical-evidence`, `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca`.
- Security evidence: `context-notes/cli-architecture-review-security-findings`, `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a`.
- Testing evidence: `context-notes/cli-architecture-review-testing-findings`, `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9`.
- Design/reliability evidence: `context-notes/cli-architecture-review-design-reliability-findings`, `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5`.
- Cross-review method: static causal-trace challenge plus reconciliation with the exact gate, branch-map, artifact, arity, and signal probes already recorded by the orchestrator. No new source inspection, tests, builds, runtime probes, network operations, or Git mutations were performed in this phase.
- Proximate goal: reduce the candidate set to consequence-backed architectural causes and make remaining uncertainty explicit. This serves the ultimate local-first/conflict-safe product goal by preventing both defect inflation and false assurance.

# Minimal prioritized public finding set

## FINAL-PUBLIC-01 — Create-only lifecycle lacks one fail-closed, identity-bound postcondition owner

- Inputs reconciled: DR-01 plus SEC-BRANCH-01. SEC-BRANCH-02 is not merged; it has a distinct resource-bound invariant and remains an observation below.
- Disposition: approve as a public finding, with two preserved causal subpaths under one architectural cause.
- Status: candidate pending deterministic fault validation; suitable for the final report at E1.
- Severity: Medium.
- Confidence: Medium overall. Confidence is high that the static mechanisms exist, but practical frequency and the exact externally observable end state remain unprobed.
- Priority: Now, before treating the create-only feature as merge-ready.
- Correct architectural owner: the create-only lifecycle/transaction authority, not generic error rendering, the recipe layer, or the tests.
- Violated invariant: success, conflict, and cleanup receipts must remain bound to the exact state claimed by this run; incomplete observation cannot become success, and unverified compensation cannot become a claim that nothing remains.
- Root-cause consolidation: the lifecycle is implemented as pathname-based phases and best-effort checks rather than one explicit transaction state carrying the claimed target identity, observation completeness, commit state, and compensation result through every asynchronous boundary. This is the common owner and architectural cause. The report must still preserve two subpaths: target/state identity can change between phases, and observation or cleanup failures can be suppressed into a false success or false-cleanup premise.
- Why this is not three findings: the user-facing harm, authority, violated postcondition, and correct remediation owner coincide. Separate prose findings would prescribe the same transaction owner and create duplicate priority. The two causal subpaths require separate tests and must not be erased as mere symptoms.
- Why Medium is proportionate: the outcome can violate state-integrity and truthful-recovery guarantees, but it requires concurrency or filesystem-fault timing around a newly claimed target, has a bounded local blast radius, and has no E2 reproduction yet. Critical or High would overstate demonstrated exposure; Low would understate a false success/cleanup premise around a mutating safety feature.
- Required remediation shape: one explicit lifecycle owner must carry stable claimed-state identity and typed phase results, revalidate before irreversible or compensating effects, fail closed on incomplete observation, and distinguish verified cleanup from partial/unverified cleanup. The separate scan-bound observation must be addressed when implementing this owner, but it is not evidence for higher severity.
- Required validation: deterministic phase-boundary fault injection and target/state replacement cases with positive and negative controls; assert no success on incomplete observation, no action against state not owned by this run, no unverified “nothing remains” receipt, and truthful partial-state recovery guidance. Preserve the existing live bidirectional race battery.
- Residual uncertainty: exact fault frequency, portability across filesystem semantics, and the behavior of the final repaired owner remain unassessed.

## FINAL-PUBLIC-02 — Public command grammar permits silent extra positional input before side effects

- Input reconciled: DR-02, strengthened by the empirical arity probe.
- Disposition: approve as a public finding.
- Status: confirmed for the representative `init` path; broader command-family mechanism remains revision-bound static evidence.
- Severity: Medium.
- Confidence: High.
- Priority: Next. It is the highest-confidence cross-cutting improvement, but current evidence does not show destructive loss or justify blocking unrelated fixes already on the branch.
- Evidence: E2 for the exact built-artifact `init` case; E1 for the bounded inventory of other handlers. Do not describe every listed command as empirically reproduced.
- Correct architectural owner: shared command grammar/dispatch metadata. Individual handlers are enforcement sites today, not the desired owner.
- Violated invariant: a public command must reject caller tokens outside its declared positional grammar before any mutation, Git orchestration, listener boot, or other side effect.
- Causal evidence: the exact artifact accepted an extra positional token for `init`, exited 0, and created a bundle. Static inventory shows the same independently selected parser mode and absent positional checks across additional handlers. The positive control is the normal command path; the negative control is the extra-token invocation with observed filesystem effect.
- Impact calibration: this is reliable false success and wrong-action risk, especially for mutating or process commands. It is not evidence of arbitrary command execution, unauthorized access, or data loss. Medium is therefore proportionate.
- Root-cause boundary: do not merge this with DR-03. Both may benefit from typed command descriptors, but arity already has a reproduced correctness consequence, while command-set duplication currently has only latent drift/change-amplification evidence.
- Required remediation shape: the shared grammar owner declares exact/minimum/ranged positional counts and rejects extras before dispatch-side effects. A typed command descriptor may also eliminate DR-03's authority drift, but that larger refactor is optional if an exhaustive agreement and centralized arity primitive achieve the invariant more safely.
- Required validation: a table over every public command/subcommand appends a sentinel positional and asserts usage exit, clean channels, and no side effect. Include built-artifact tests for representative mutation, Git, listener, and read-only classes.

# Observations and improvement opportunities

## OBS-01 — SEC-BRANCH-02: create-only isolation scanning has no explicit application-level work budget

- Disposition: observation/hardening requirement, not a separate final correctness finding.
- Severity if reported independently: Low.
- Reason: the resource invariant differs from FINAL-PUBLIC-01, so it must not be silently deduplicated; however, current evidence establishes only absence of an explicit depth/entry/time budget, not material scale, exhaustion, or supported-mode denial of service.
- Owner/action: the same new create-only verifier should use bounded iterative traversal and surface incomplete verification truthfully. Validate with synthetic deep/wide scratch trees and a deterministic budget oracle.

## OBS-02 — DR-03: top-level command identity is multiply represented

- Disposition: maintainability observation, Planned.
- Reason: bounded comparison found no present user-visible drift after deliberate aliases/private exceptions, and agreement tests already cover important projections. The causal evidence supports change amplification, not a current reliability defect.
- Owner/action: shared command metadata or an exhaustive bidirectional agreement with explicit exceptions. Treat a typed descriptor as leverage for FINAL-PUBLIC-02, not as mandatory architecture for its own sake.

## OBS-03 — DR-05: personal catalog enumeration lacks an application-level result/concurrency cap

- Disposition: performance/operability observation, Planned or Monitor.
- Reason: work and output grow with explicitly enrolled user state, but ordinary enrollment is local and intentional, home already timeboxes/caps the common presentation, and no expected-scale or profile evidence demonstrates material harm. “No application-level cap” must not be rewritten as “unbounded process behavior.”
- Owner/action: catalog presentation/probing. Add a limit, total-versus-shown receipt, and bounded probe concurrency if supported scale or measurement justifies it.

## OBS-04 — TST-CLI-01: the session-start outer timebox is not a cancellation contract

- Disposition: architectural observation plus validation gap, not a Medium final finding.
- Calibrated consequence: Low pending evidence of a late write, retained resource, or process-exit delay.
- Reason: the losing operation can continue, but default Git operations consume remaining budgets, local tail work is bounded, state writes are atomic, and a pending promise alone does not prove a retained process resource. The current evidence establishes a weaker interface contract, not user-visible failure.
- Owner/action: session-start pull lifecycle. First probe foreground return versus process exit, owned-resource closure, and post-return state. Promote to a finding only if the probe demonstrates harm or if the public contract is explicitly strengthened to require cancellation rather than bounded foreground rendering.

## OBS-05 — TST-CLI-03: recurring fault-sensitivity diagnostics remain deliberately sampled

- Disposition: feedback-infrastructure observation, Planned.
- Reason: the exact review now has a one-time branch map, aggregate branch coverage is substantial, and high-risk shared authorities are strong. The mutation slice is explicitly curated because whole-package runs exceed the practical budget. The remaining gap is recurrence and risk-target selection, not absent testing.
- Owner/action: test/release feedback infrastructure. Publish exact scope, name uncovered high-risk decisions, and rotate targets based on risk; do not introduce a global score gate.

## OBS-06 — TST-CLI-04: grammar invariants use finite examples rather than a generative layer

- Disposition: optional test-design opportunity, not a finding.
- Reason: absence of a property-testing library does not establish an escaped defect or inadequate oracle. Existing boundary tables are extensive, and ownership may lie in consumed parser/core packages for delegated invariants.
- Owner/action: the owning canonicalizer/parser, after mapping delegated invariants. Add small deterministic properties only where they cover combinatorial risk not already owned elsewhere.

# Validation gaps and refutations

## GAP-01 — DR-04 and `ui` lifecycle behavior remain unresolved

- The static `ui --open` child-error mechanism is plausible, and a direct Node control behaved as predicted, but the source-level harness with an unavailable opener did not reproduce fatal termination. That contradiction prevents empirical confirmation and lowers confidence in the claimed process consequence.
- The same exact-artifact subprocess harness can cover the distinct `ui` signal path from TST-CLI-02, unavailable-opener behavior, listener continuity, channel cleanliness, shutdown, cleanup, and port reuse. Keep the launcher and signal mechanisms distinct even if one harness validates both.
- Disposition: validation gap/candidate; do not publish DR-04 as confirmed and do not merge it with the signal candidate.

## REF-01 — TST-CLI-02 is refuted for the tested `serve` boundary only

- The exact built `serve` command reached readiness, handled SIGTERM, exited 0, produced no signal code or stderr, and released the port for immediate reuse on the tested Darwin/Node 25 path.
- This refutes a present failure for that exact boundary, not the value of a regression test and not cross-platform or `ui` behavior. Preserve the tested scope in the final report.

## GAP-02 — Current external dependency-advisory status is not assessed

- The live advisory query was not authorized. An offline query reported no cached advisories, but cache freshness is unknown.
- Disposition: not assessed. Do not claim current absence. The final verdict must either remain `incomplete` for this applicable supply-chain boundary or explicitly record a review-authority decision that zero runtime dependencies, artifact allowlisting, and release verification reduce it below the material-verdict threshold without pretending an advisory check occurred.

## GAP-03 — Create-only fault windows lack E2 validation

- FINAL-PUBLIC-01 is publishable at E1/Medium, but exact-draft approval should call out the missing deterministic observation, replacement, and compensation probes. These are safe scratch probes and the highest-priority empirical follow-up.

## GAP-04 — Exact-revision portability evidence is sampled

- The full gate passed locally after loopback permission was supplied, and the repository config statically reaches Linux/Node version lanes. This review did not independently execute current Windows behavior or every configured CI runtime.
- Disposition: coverage limit, not a defect. Do not turn configured CI matrices or conditional tests into claims of current universal portability.

# Negative-claim corrections

- “No runtime cycle” is approved only for the explicit TypeScript local runtime-import graph after excluding type-only edges; it does not cover bundled internals or reflective runtime behavior.
- “No material dead production module found” is not “no dead code.” Runtime reachability at module level does not prove symbol-level use or external compatibility irrelevance.
- “No reverse source import found” does not prove absence of semantic coupling or duplicated contracts.
- The full green gate proves the exact exercised states and artifact only; it does not erase unprobed fault windows or platform gaps.
- Coverage percentages are a decision map, not assurance scores. One-time coverage also does not establish a recurring branch-visibility control.
- Every test file containing an assertion token does not establish meaningful oracles for every test.
- No cached advisory result must not be represented as a current live vulnerability assessment.
- The `init` arity reproduction supports E2 for that representative path; the remaining command inventory stays E1 until exercised.
- Catalog and scan work with no application-level cap must not be described as literally infinite or attacker-controlled without a bounded source-to-work trace and actor model.
- The `serve` signal probe refutes only the tested boundary; it cannot be generalized to `ui`, Windows/Linux, or future artifacts.
- “No property-test library found” does not establish absence of property-like invariant assurance.

# Missing review areas and proportional residual risk

1. Private-routed security candidates have no public technical disposition; final target approval depends on the private lane, not on public speculation.
2. Current live dependency advisory status is not assessed.
3. Deterministic create-only phase-fault and replacement probes have not been run.
4. Exact `ui` signal and unavailable-opener lifecycle behavior remains unresolved.
5. Large-catalog and deep/wide verifier scale are unmeasured; this is proportional because both are currently low-consequence observations.
6. Current Windows behavior and every configured CI runtime were not independently executed in this review.
7. Browser accessibility/semantic UI behavior, production reverse-proxy deployments, and exhaustive external-package correctness remain outside the package-architecture evidence.

# Private routing markers — preserve verbatim

- `PRIVATE_ROUTE_REQUIRED`: physical filesystem containment across filesystem-backed bundle operations — affected files: `packages/core/src/backend.ts`, `packages/core/src/filesystem-lock.ts`, and CLI/server adapters that consume that backend.
- `PRIVATE_ROUTE_REQUIRED`: confidential remote-credential transport policy — affected files: `packages/cli/src/config.ts`, `packages/cli/src/bundle.ts`, `packages/cli/src/commands/ui.ts`, `packages/core/src/remote-backend.ts`, `packages/ui-server/src/proxy.ts`.
- `PRIVATE_ROUTE_REQUIRED`: bounded remote/server resource handling — affected files: `packages/core/src/remote-backend.ts`, `packages/server/src/serve.ts`, `packages/server/src/router.ts`.

`PRIVATE_ROUTE_REQUIRED: destructive remote retry/version binding invariant`

No private mechanism, interleaving, exploit condition, or remediation detail is added here.

# Approval and blocker matrix

| Item | Cross-review decision | Final placement | Approval condition |
| --- | --- | --- | --- |
| DR-01 + SEC-BRANCH-01 | Approve, consolidated with causal subpaths preserved | Medium/Now public finding | E1 wording remains consequence-calibrated; exact-draft names missing fault probes |
| DR-02 | Approve | Medium/Next public finding | E2 scope limited to reproduced `init`; broader inventory labeled E1 |
| DR-03 | Do not approve as correctness finding | Planned maintainability observation | Promote only on present drift or stronger change-cost evidence |
| DR-04 | Do not approve as confirmed | Validation gap/candidate | Resolve source-harness versus direct-control contradiction on exact artifact |
| DR-05 | Do not approve as reliability finding | Planned/Monitor observation | Promote only with supported-scale or material profile evidence |
| SEC-BRANCH-02 | Do not merge into integrity finding | Low hardening observation | Preserve distinct resource oracle; validate bounded traversal |
| TST-CLI-01 | Reject Medium severity at present | Low observation/validation gap | Promote on demonstrated late effect, retained resource, exit delay, or explicit stronger contract |
| TST-CLI-02 | Split | `serve` scoped refutation; `ui` validation gap | Never generalize the Darwin/Node 25 result |
| TST-CLI-03 | Do not approve as product defect | Planned feedback observation | Keep exact scope visible; use named decisions rather than score thresholds |
| TST-CLI-04 | Do not approve as assurance defect | Optional test-design observation | First prove owning-layer gap and combinatorial residual risk |
| Private-route items | No public merits decision | Exact markers only | Private owner disposition required before unqualified target approval |
| Live dependency advisory | Block absence claim | Not assessed | Authorized live evidence or explicit threshold/risk decision |

# Exact-draft recommendation

The final public architecture review should contain two public findings, the exact private markers, the scoped `serve` refutation, and a short residual-gap/observation section. It should not present every improvement opportunity as a defect. A proportionate target verdict is `changes required` for the non-released create-only lifecycle issue and `incomplete` for any overall security/supply-chain approval until the private lane and material not-assessed boundary receive explicit dispositions. If the orchestrator treats the advisory gap as below the material-verdict threshold, that judgment and its zero-runtime-dependency/artifact-verification rationale must be explicit.

Cross-review approval is therefore **APPROVE FINDING SET WITH BLOCKERS**: approve the two-finding public set and the demotions/refutations above; block an unqualified final target approval pending private triage, exact-draft review, and explicit handling of the live-advisory assessment gap.

# Result Envelope

- Status: `PASS_WITH_BLOCKERS`
- Verdict: `APPROVE FINDING SET WITH BLOCKERS`
- Approved public findings: `FINAL-PUBLIC-01`, `FINAL-PUBLIC-02`
- Findings demoted to observations: `DR-03`, `DR-05`, `SEC-BRANCH-02`, `TST-CLI-01`, `TST-CLI-03`, `TST-CLI-04`
- Validation gaps: `DR-04`, `ui` portion of `TST-CLI-02`, create-only E2 fault probes, exact portability sample, current live dependency advisory
- Refutation: `TST-CLI-02` present-failure hypothesis for tested built `serve` on Darwin/Node 25 only
- Not assessed/blocking lanes: private-route dispositions; current external advisory status unless explicitly judged below material threshold
- Highest-priority next action: run deterministic create-only phase-fault/replacement probes and have the orchestrator review the exact final public draft against this consolidation
- Source/test changes: none
- Task state: remain `in_progress` pending exact-draft approval
