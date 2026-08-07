---
type: Context Note
title: CLI architecture review testing cross-review
description: >-
  Cross-review dispositions and executable validation requirements for the CLI
  architecture findings.
actor: codex-testing-reviewer
timestamp: '2026-08-07T14:50:24.778Z'
---
# Summary

Cross-review against architecture-review template v1.0 and exact revision `81b3c39ff252013e318b1a714b63430a24074d70` supports a strong test-foundation conclusion and a minimal public set of three findings:

1. one Medium create-only transaction finding that groups DR-01, SEC-BRANCH-01, and SEC-BRANCH-02 under the missing fail-closed stable-identity lifecycle owner while preserving separate integrity, rollback, and resource-bound subclaims and oracles;
2. one Medium command-arity finding, DR-02, now E2/high confidence for the empirically reproduced `init` case and E1 for the wider statically inventoried command class;
3. one Low/Planned test-feedback finding, TST-CLI-03, about the exact-SHA branch map being review-only rather than durable and the default mutation scope remaining explicitly sampled.

The full exact-SHA `npm run check` gate passed. Node test coverage executed 1,299 tests with zero failures and produced a strong map: 95.49 percent lines, 87.76 percent branches, and 90.50 percent functions. Those measurements refute any broad weak-suite narrative, but do not erase specific missing boundaries or make aggregate percentages an assurance score.

The exact built `serve` process reached readiness, handled SIGTERM, exited 0, emitted no stderr, and released its port. TST-CLI-02 is therefore refuted for the tested serve/Darwin/Node 25 path and must be recorded as a survived probe, not a defect. The untested UI signal path remains a coverage limitation, not a finding.

DR-03, DR-04, DR-05, TST-CLI-01, TST-CLI-02, and TST-CLI-04 should not appear as separate final public findings on current evidence. Their useful remediation or validation ideas are preserved below without inflating the finding set.

# Evidence reviewed

- Approved template `reviews/architecture-review-template` version `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- Empirical record `context-notes/cli-architecture-review-empirical-evidence` version `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca`.
- Testing analysis `context-notes/cli-architecture-review-testing-findings` version `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9`.
- Security analysis `context-notes/cli-architecture-review-security-findings` version `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a`.
- Design and reliability analysis `context-notes/cli-architecture-review-design-reliability-findings` version `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5`.

This specialist did not rerun gates or probes. Empirical claims are accepted from the exact-revision root record and retain its stated environment and limitations.

# Reconciliation of gate, coverage, and candidate claims

The green full gate is E3 machine-enforced evidence for the exact contracts it exercises on the tested environments. It is not counterevidence to a missing arity assertion when the gate itself accepted the wrong behavior, nor to create-only fault windows that the current live race tests do not inject.

The one-time coverage pass is E2 measurement evidence and gives the review a current decision map. High-risk shared authorities such as `errors.ts`, `mutate.ts`, `output.ts`, `bundle.ts`, `commands/link.ts`, `commands/new.ts`, and `commands/status.ts` were strongly exercised. Lower decision coverage in `commands/view.ts`, `commands/ui.ts`, `cli.ts`, `commands/mcp.ts`, `commands/bundle.ts`, `commands/serve.ts`, and `update-orientation.ts` is a prioritization signal only. No finding is justified solely by a percentage.

The arity probe is directly relevant: the exact built artifact accepted `init unexpected --dir <fresh-temp-dir> --recipe none`, exited 0, and created `index.md`. That is an expected-versus-observed side-effect oracle, not merely parser coverage. It elevates the `init` subcase to E2 and shows that a full green gate can coexist with a missing contract.

The built serve SIGTERM probe is also directly relevant and well controlled: readiness preceded the signal; exit status, signal code, stderr, and immediate port reuse were observed. It refutes a present failure on that path. It does not establish UI behavior or other operating systems.

# Public candidate dispositions

| Candidate | Test relevance and ownership challenge | Evidence, severity, disposition |
| --- | --- | --- |
| DR-01 | Current parent/child races exercise successful filesystem behavior but do not inject incomplete observation or failed compensation. The correct owner is one create-only lifecycle authority with controlled filesystem identity, observation, commit, and rollback seams. | Retain, but group with SEC-BRANCH-01 and SEC-BRANCH-02 as one Medium/Now E1 finding with distinct subclaims. High confidence in mechanisms, Medium in incidence. |
| DR-02 | Highly relevant: exact built input, exit, and filesystem side effect were observed. The owner is the shared command grammar/parse contract, with command-specific arity metadata for complex subcommands. | Retain. Medium/Now-or-Next. E2/high confidence for `init`; E1 for the wider statically inventoried class. |
| DR-03 | The proposed set-agreement test is executable and useful, but no present drift or user-visible defect was established. Descriptor centralization is a remediation option for DR-02, not independently required. | Do not retain separately. Fold exhaustive descriptor/handler/help/resource agreement into DR-02 remediation if a descriptor authority is introduced; otherwise track as maintainability improvement. |
| DR-04 | The missing-opener oracle is relevant, but the source-level product harness did not reproduce the predicted fatal exit while an isolated direct `spawn` control did. That unresolved discrepancy is material counterevidence. | Block from final finding set at current confidence. Retain as E1 candidate/coverage limit pending a deterministic built-product or owning-function reproduction. Severity would be Low if confirmed. |
| DR-05 | A large-catalog measurement would be relevant, but there is no declared supported entry envelope or latency/output requirement against which the result could fail. The default home path is already time and display capped. | Do not retain as a final finding yet. First define or infer a product envelope, then measure. Track as a Low performance hypothesis. |
| TST-CLI-01 | The source definitely lacks an abort contract for the outer session-start race, but default Git work is independently budgeted, state writes are atomic, and no late effect, open handle, process-exit delay, or contract failure was reproduced. | Do not retain as a separate public finding. Record as a residual testability/operability limitation and require an open-handle/post-return-state probe before promotion. If confirmed, likely Low unless concrete impact supports Medium. |
| TST-CLI-02 | The original concern was test-boundary absence, not proof of signal failure. Exact built serve behavior survived the requested probe. UI remains untested. | Refute for tested serve path and record as survived attack. Do not retain a generic signal finding. Keep one UI signal validation request. |
| TST-CLI-03 | The review now has a current branch map, so current review coverage is not absent. The repository still has no durable branch-map command or recurring artifact, and the scheduled CLI mutation default remains eight explicitly selected files. | Retain narrowly as Low/Planned test-feedback infrastructure. Do not cite aggregate percentages as harm or request a merge threshold. |
| TST-CLI-04 | Extensive explicit attack tables and high coverage exist. No grammar failure or insufficient owning-layer allocation was demonstrated, and delegated core ownership has not been exhaustively mapped. | Do not retain as a final finding. Preserve deterministic property tests as a planned strengthening task at the owning grammar layer. |
| SEC-BRANCH-01 | Stable physical identity through commit and rollback is directly relevant to create-only integrity. Current race tests identify path competition but do not replace the selected target at each asynchronous phase boundary or prove compensation identity. | Retain as a distinct subclaim and oracle under the grouped create-only finding. E1, Medium group severity, Now before merge. |
| SEC-BRANCH-02 | The recursive post-commit scan has a real absence of depth, entry, concurrency, and time bounds, but localized impact and adversarial/concurrent prerequisites do not justify separate severity inflation. | Retain as a resource-bound subclaim and residual under the grouped create-only finding. Its validation must define an explicit budget before asserting enforcement. |

# Minimal final public finding set

## FINAL-01: Create-only commit verification does not have one fail-closed stable-identity transaction boundary

- Sources consolidated: DR-01, SEC-BRANCH-01, SEC-BRANCH-02.
- Status: candidate requiring changes before merge.
- Severity: Medium.
- Confidence: High for the three static mechanisms; Medium for occurrence in normal environments.
- Priority: Now.
- Evidence: E1 static source/test trace.
- Owner: one create-only lifecycle authority, currently spread across path checks, bundle CAS, descendant observation, and best-effort rollback in CLI bundle creation. Physical filesystem primitives may remain in core, but the lifecycle owner must hold and revalidate the identity and own truthful compensation.
- Why grouping is valid: the shared architectural cause is that no single transaction boundary owns target identity, complete observation, commit, compensation, and bounded verification. Grouping must not erase the distinct triggers:
  1. the pathname can identify a different physical target across asynchronous phases;
  2. observation failures can be translated into absence and rollback failures can be suppressed;
  3. the recursive isolation scan has no explicit resource budget.
- Existing controls: empty/fresh target claim, expect-absent CAS, bidirectional isolation intent, exact own-write rollback intent, and real parent/child process races.
- Residual: ordinary success races do not validate adversarial replacement, filesystem observation failure, cleanup failure, or bounded termination.
- Remediation direction: introduce or extract a create-only transaction/verifier authority with stable identity evidence, typed incomplete-observation outcomes, rollback bound to the exact committed identity, truthful partial-state receipt, and an iterative bounded scan.
- Compatibility risk: stable-handle or canonical-identity techniques differ by platform. The implementation must preserve supported filesystem semantics and avoid claiming identity guarantees unavailable on a platform.

## FINAL-02: Public command arity is decentralized and `init` silently executes with extra input

- Source: DR-02; DR-03 contributes a remediation option, not a separate finding.
- Status: confirmed for `init`; candidate class for the remaining statically identified commands.
- Severity: Medium.
- Confidence: High.
- Priority: Now or Next.
- Evidence: E2 runtime/artifact probe for `init`, plus E1 bounded command inventory.
- Owner: shared command grammar contract. Each public verb or subcommand needs an explicit exact/minimum/ranged positional rule before any side effect.
- Expected: extra positional input returns USAGE/exit 2 and performs no read, write, boot, commit, pull, or push.
- Observed: exact built `init` accepted the sentinel, exited 0, and created a bundle.
- Existing controls: unknown options and missing option values are centrally classified; several complex commands already reject extras.
- Remediation direction: make arity required metadata in the shared parse/command descriptor path. Zero-positional commands should not opt into positionals. Preserve local parsing where subcommand grammars genuinely differ, but require a declared rule.
- Scope caution: the final finding must not say that every inventoried command was empirically reproduced. Only `init` is E2 in the current record.

## FINAL-03: Exact-SHA decision coverage is not a durable feedback artifact

- Source: TST-CLI-03.
- Status: candidate.
- Severity: Low.
- Confidence: High.
- Priority: Planned.
- Evidence: E1 bounded gate/tooling absence plus E2 one-time exact-SHA coverage measurement as contextual evidence.
- Owner: repository test tooling and CI diagnostics, not production CLI code.
- Mechanism: the review had to assemble an ad hoc Node coverage pass; no maintained command or recurring artifact maps branches to source decisions. Scheduled mutation is intentionally sampled to eight default CLI source files, with broader scope only through manual dispatch.
- Existing controls: full gate is strong, current overall coverage is high, mutation uses the full test set and reports named survivors, and the workflow accurately documents its scope and compute ceiling.
- Remediation direction: add a reproducible non-gating decision-coverage command and scheduled or on-demand artifact. Label exact source inclusion and mutation scope. Use the output to file named high-risk decision gaps and mutation survivors; do not introduce an aggregate coverage or mutation score gate.

# Exact executable validation requirements

## FINAL-01 integrity and cleanup oracle

Use a filesystem adapter seam because the invariant depends on phase-controlled identity and fault injection, not because mocks are convenient. The test controller must pause at each asynchronous boundary after preflight, after directory claim, before and after bundle CAS, during descendant observation, and before rollback.

For each barrier:

1. positive control: unchanged target completes with the exact success receipt;
2. replacement control: a second actor replaces or retargets the selected path and installs unique foreign sentinel content;
3. observation-fault control: inject typed `readdir`, stat/lstat, or canonicalization failure;
4. cleanup-fault control: inject failure removing the exact index committed by the first actor;
5. state oracle: snapshot inode/canonical identity where supported, owned sentinel identity, all paths touched, final tree, and receipt;
6. required result: never return success on incomplete observation; never delete or overwrite foreign content; rollback only the exact state committed by this operation; if cleanup is incomplete, return a typed partial-state result that names what may remain and does not say that nothing remains.

Retain a real two-process parent/child race as a public-boundary proof after the deterministic component matrix passes.

## FINAL-01 resource-bound oracle

Define the supported scan envelope first: maximum visited entries, maximum depth if applicable, maximum in-flight reads, and deadline or cancellation behavior. Then construct finite trees immediately below, at, and above each limit. Instrument visits and concurrency.

Required assertions:

- below-limit valid tree reaches the ordinary semantic result;
- at-limit behavior is deterministic;
- above-limit or deadline returns a typed bounded failure;
- visits and in-flight reads never exceed the declared budget;
- no stack overflow, runaway timer, or unbounded recursive allocation;
- no success receipt and no out-of-target write/delete after the bound fires;
- cleanup and partial-state reporting remain truthful.

A wall-clock timeout alone is not the oracle; use counters and an injected clock or cancellation boundary, retaining one real-process timeout probe.

## FINAL-02 arity oracle

Create an exhaustive table from the public command/subcommand registry. For every grammar, append a sentinel positional outside the declared arity and assert:

- USAGE classification and exit 2;
- no success receipt;
- no filesystem mutation;
- no listener bind;
- no child/network/Git activation;
- no ref, cursor, cache, credential, catalog, or bundle change.

At the owning parse layer, inject side-effect spies or use handlers that cannot run after parse failure. Add built-artifact probes for at least `init`, `sync`, `serve`, and one document mutation using isolated temp state and recording helpers. The `sync` probe must assert unchanged Git refs/HEAD and that its fake remote helper was never invoked. The `serve` probe must assert no port bind. The document probe must assert the target version and bytes are unchanged.

Make the suite turn red by removing one arity rule or changing one zero-positional descriptor to allow extras. If command descriptors are introduced, mechanically compare descriptor keys, handlers, public help names, aliases/private exceptions, and distribution resources in both directions.

## FINAL-03 diagnostic oracle

Add a documented command that:

- uses the same discovery glob and build prerequisites as the package gate;
- includes exactly the owned `packages/cli/src/**/*.ts` universe or reports exclusions;
- emits machine-readable per-file and per-branch data;
- fails on tool/configuration/discovery errors, not on a scalar percentage threshold;
- records target SHA, Node/runtime, duration, and report scope;
- makes materially uncovered decisions actionable by name.

For mutation reports, include the exact mutate glob/list and source SHA in the artifact and preserve named survivors. A scheduled rotation may sample additional risk-selected modules, but the report must never imply whole-package coverage.

# Other validation dispositions

- DR-03: if FINAL-02 does not introduce one descriptor authority, add the proposed exhaustive set-agreement test as a maintainability task. Mutation by deleting one representation must make the test fail.
- DR-04: before promotion, run the exact built `ui --open` product path with a controlled unavailable opener on the platform where that opener is selected. Observe readiness, process liveness, stderr, URL-file lifecycle, and later clean SIGTERM. A direct isolated `spawn` control is necessary but not sufficient. Alternatively, expose the owning opener function with injectable `spawnImpl`; return a fake child that emits `error` on the next tick and assert that an error listener is attached before `unref`.
- DR-05: first state an intended catalog envelope. Then generate below/at/above-limit catalogs, instrument peak probes, measure output bytes, and assert deterministic shown/total behavior. Without an envelope, a timing number cannot confirm a defect.
- TST-CLI-01: instrument return time versus process-exit time, active handles/resources, and state after return. A losing controlled pull must receive abort or demonstrably perform no late effect. Promote only if the stated bounded-orientation contract is violated.
- TST-CLI-02: retain the exact serve SIGTERM probe as a survived attack. Add the equivalent built UI probe; absence of that sample is a coverage limit, not proof of failure.
- TST-CLI-04: map ownership first. For CLI-owned grammars, use deterministic generated valid/invalid segments with persisted failing seeds and assert round-trip, idempotence, stable error class, and no root escape. Do not duplicate a core-owned invariant.

# Approvals and blockers

Approved for the final public draft:

- strong-test-foundation conclusion, bounded to the exact gate and environments;
- exact current coverage as a decision map, never an aggregate quality score;
- FINAL-01 with three separately stated submechanisms and oracles;
- FINAL-02 with E2 limited explicitly to `init`;
- FINAL-03 as Low/Planned feedback infrastructure;
- serve SIGTERM as a survived probe.

Blocked from final public draft unless corrected:

- any generic statement that signals are broken or that serve shutdown is untested;
- any claim that all command-arity cases reached E2;
- any claim that high aggregate coverage refutes specific untested faults;
- DR-04 as high-confidence or empirically reproduced;
- DR-05 without a declared performance/resource envelope;
- TST-CLI-01 at Medium without concrete late-effect or exit-delay evidence;
- TST-CLI-04 as a product defect based only on absence of a property-test library;
- a separate DR-03 finding when no present drift was shown;
- language that describes the non-released create-only candidates as released vulnerabilities;
- any public expansion of privately routed security details.

Private security routing remains outside this public testing cross-review. The redacted markers may remain, but this reviewer cannot approve technical exploitability or remediation completeness for evidence that was intentionally withheld.

# Final exact-draft approval conditions

Before this testing specialist approves the final exact draft:

1. preserve the exact target, artifact, environment, and evidence cutoff;
2. include the three public findings above or explain any deviation with owner/mechanism analysis;
3. preserve the distinct FINAL-01 integrity, compensation, and resource oracles;
4. state the E2 boundary of FINAL-02 precisely;
5. record serve SIGTERM as survived evidence and UI signal coverage as residual;
6. keep coverage percentages contextual and avoid aggregate scores or thresholds;
7. include full-gate environmental history: initial loopback EPERM was sandbox policy, identical permitted rerun passed;
8. preserve current external dependency advisory status as not assessed rather than zero known vulnerability;
9. keep private security details out of public records pending disclosure triage;
10. present DR-04, DR-05, TST-CLI-01, and TST-CLI-04 only as limitations/follow-ups unless new evidence changes their disposition.

Task remains `in_progress` pending review of the final exact draft.
