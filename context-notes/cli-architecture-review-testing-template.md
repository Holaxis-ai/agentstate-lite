---
type: Context Note
title: CLI architecture review — testing and testability template proposal
actor: testing-reviewer
timestamp: '2026-08-07T14:04:07.847Z'
---
# Summary

Independent testing/testability proposal for the reusable architecture-review template. The rubric treats coverage as a traceable relationship among requirements, risks, observables, and test controls—not as line counts, test counts, or a single percentage. It is designed for reuse across packages and projects, with a small core rubric plus boundary-specific probes. This is the divergent template-design phase only; no `packages/cli` findings are asserted here.

Ultimate goal: a markdown knowledge bundle plus an agent-oriented CLI that gives humans visible, conflict-safe, local-first shared memory.

Proximate goal: make the architecture-review template distinguish real behavioral assurance from false confidence, so later CLI findings improve reliability and maintainability of the product boundary.

## Required testing-review output contract

The review must produce four connected artifacts, even if they are embedded in one report:

1. A test inventory that classifies what runs, where it runs, what boundary it crosses, and what oracle it uses.
2. A requirements-risk matrix that maps each material contract/invariant to its test controls and residual risk.
3. A testability assessment of the architecture and side-effect seams.
4. Prioritized gaps and validation strategies, including false-confidence mechanisms and survived attacks.

Do not collapse these into a scalar score. If summary labels are desired, use `strong`, `partial`, `indirect`, `absent`, or `unknown` per requirement and per evidence dimension. `Unknown` must remain distinct from `absent`, and neither may be averaged away.

## 1. Test inventory and classification

For every relevant test asset or suite, record:

- Exact test identifier and source location; owning package/component; exact gate or command that discovers it.
- Level: pure unit, component/service, adapter integration, contract, agreement/parity, subprocess CLI, end-to-end journey, packaging/install, migration/compatibility, or operability/recovery.
- System under test and public surface(s); requirement/risk identifiers it claims to protect.
- Boundary exercised: filesystem, process/stdin/stdout/signals, environment/PATH/cwd, clock/timer, randomness, concurrency/lock, network/server/protocol, external executable, package artifact, browser/UI, or none.
- Behavior class: happy path, validation, boundary value, negative/adversarial, domain failure, dependency failure, cleanup/recovery, idempotence/replay, concurrency/order, compatibility, security, or performance/resource behavior.
- Oracle: explicit semantic assertion, invariant/property, exit/status channel, output shape or exact bytes, persistent state/side effect, absence of forbidden behavior, interaction contract, snapshot/golden, or merely “did not throw.”
- Reality level: real dependency, in-memory fake, contract-checked fake, stub, spy, or mock; include why the double is trustworthy for the claimed behavior.
- Execution properties: deterministic inputs/seed, hermeticity, parallel safety, platform/runtime matrix, skips/todos/retries, typical duration, cleanup discipline, and known flake history.

A file is not “covered” merely because a matching test file exists. The inventory must prove reachability from an actual developer/CI gate, including test globs, build prerequisites, environment guards, and conditional skips.

## 2. Requirements-to-risk mapping

Build the matrix from contracts rather than from the current test directory. Candidate contract sources include public API/CLI help, specifications, architecture invariants, error taxonomies, threat models, operational promises, supported runtimes/platforms, destructive-write guarantees, compatibility/migration promises, and regression history.

Each matrix row must contain:

- Requirement/invariant in observable terms and its source/provenance.
- Affected surfaces, state transitions, and downstream consumers.
- Credible failure modes and risk rationale: impact, exposure/likelihood, detectability, reversibility, and change frequency. Use ordinal judgment with prose, not pseudo-precise arithmetic.
- Existing test controls by level and their exact oracles.
- Positive, boundary, negative/adversarial, dependency-failure, concurrency/time, and recovery coverage as applicable.
- Whether the owning primitive is tested and whether each irreducible public projection/boundary is tested.
- Residual gaps, evidence quality, confidence, and proposed validation.

For a high-risk contract, strong assurance normally requires: a direct oracle at the owning layer; at least one real boundary/public-surface exercise; relevant negative or fault behavior; and evidence that the test can fail when the contract breaks. Missing dimensions require an explicit residual-risk rationale, not an implied pass.

Where one behavioral contract has multiple public surfaces, first ask whether one implementation can own the behavior. If irreducible projections remain, require one shared per-row agreement table. Do not demand false parity where surfaces intentionally have different error or presentation policies.

## 3. Behavioral relevance and oracle quality

Review tests for sensitivity to meaningful defects, not execution volume:

- The test name and assertions must state an observable requirement or invariant.
- Inputs must distinguish the correct behavior from plausible wrong implementations and include meaningful equivalence classes/boundaries.
- Assertions must cover the material result: returned value plus externally relevant state, channels, cleanup, or forbidden effects. Boolean/type-only, assertion-free, “did not throw,” or broad status-only checks are weak unless that is the complete contract.
- Prefer outcome assertions over implementation-detail interactions. Use interaction assertions only when ordering, call count, or non-invocation is itself the contract.
- Snapshots/goldens must be bounded, reviewable, semantically justified, and have provenance/regeneration controls. A large auto-approved snapshot is not a strong oracle.
- Tests must be able to distinguish a domain failure from a harness crash, timeout, or unrelated rejection.
- For representative/high-risk claims, require one red probe: targeted mutation, revert, controlled fault, or assertion perturbation demonstrating that the expected test fails for the intended reason.
- Detect duplicated tests that all exercise the same path/oracle while leaving other failure modes untouched.

## 4. Unit, integration, contract, and end-to-end allocation

Do not enforce a fixed pyramid ratio. Allocate by risk, observability, and boundary ownership:

- Unit tests own dense decision tables, parsers, domain policy, pure transformations, and retry/state-machine logic with fast exhaustive cases.
- Adapter integration tests exercise real filesystem/process/network/package behavior where platform semantics matter.
- Contract tests verify adapters/fakes against a stable interface; agreement tests verify shared behavior across public surfaces.
- Subprocess/black-box tests pin CLI invocation, serialization, stdout/stderr, exit status, environment resolution, signals, and installed/bundled artifact behavior.
- End-to-end journeys cover a small set of highest-value user workflows and recovery paths; they should not be the only proof of internal policy.

The expected pattern is “own the invariant once, then prove each material boundary/projection,” avoiding both over-mocked units and slow all-subprocess duplication.

## 5. Meaningful testability and architectural seams

Evaluate testability as an architectural property, not the number of exported helpers. A useful seam corresponds to a real side-effect or policy boundary and permits controlled input, fault injection, observation, and cleanup without production-only compromises.

Assess whether:

- Domain decisions are separated from transport/rendering/exit behavior.
- Clocks, randomness, environment/config, filesystem, process spawning, network clients, external executables, and retry/scheduling policies have explicit narrow boundaries where control is valuable.
- Cancellation, shutdown, cleanup, and partial-progress state are observable and testable.
- Dependency interfaces are smaller than their implementations and fakes can be contract-checked.
- Error types/outcomes preserve enough structure to assert recovery and classification without matching incidental strings.
- Tests can force each important failure deterministically without global monkeypatch races, unbounded sleeps, test-only production flags, or inaccessible singleton state.
- Real black-box integration remains possible so injectable seams do not replace proof of adapter wiring.

Classify testability per area:

- `strong`: important inputs/failures are controllable, outputs/state are observable, and the real boundary can also be exercised.
- `adequate`: main behaviors are testable but some faults require expensive setup or coarse observation.
- `fragile`: tests depend on globals, timing, broad mocks, or implementation details and cannot localize failures reliably.
- `opaque`: material failures cannot be induced or observed without production changes or nondeterministic external conditions.

Do not recommend dependency injection merely to increase mockability. Recommend a seam only when it clarifies ownership, contains a side effect, or enables a material risk to be tested.

## 6. Determinism, isolation, fixtures, mocks, and fakes

Check that tests:

- Use unique temporary directories, ports, identities, and resource names; do not share mutable global state across tests or workers.
- Control/restore cwd, environment, PATH, locale, umask, clock, random seed, and process handlers when relevant.
- Wait for observable conditions or use controlled schedulers rather than fixed sleeps; use bounded timeouts only as safety nets.
- Close servers, file handles, watchers, child processes, timers, sockets, and signal listeners on success and failure.
- Are order-independent, parallel-safe or explicitly serialized with a documented reason, and reproducible from a recorded seed/command.
- Avoid uncontrolled internet access; network tests use local deterministic peers unless the explicit contract is an external conformance probe.

Fixtures should be minimal, intention-revealing, immutable, and validated before use. Preserve externally shaped/interoperability fixtures when canonicalization is a risk. Generated fixtures/goldens need a provenance-bearing generator and drift check.

Prefer real cheap dependencies; use fakes for expensive/unavailable systems and contract-test them. Mocks must not restate the implementation or reproduce the same defect. A spy verifies interaction only when that interaction is observable policy and should be paired with an outcome assertion where possible.

## 7. Boundary and fault-injection probes

Select probes from actual risks; the reusable menu is:

- Filesystem: absent/corrupt state, permissions, path spaces/Unicode, symlinks/traversal, existing targets, partial writes, rename/atomicity, disk/full or write failure, cleanup, and idempotent replay.
- Subprocess/CLI: argv quoting, stdin EOF/binary bytes, stdout/stderr separation, exact exit taxonomy, missing executable/PATH, nonzero child, signal/abort, hang/timeout, inherited environment, cwd, and orphan cleanup.
- Network/protocol: refused connection, timeout, abort, partial/chunked body, malformed envelope, unexpected status/content type, authentication failure without secret leakage, retry exhaustion, and idempotent replay.
- Packaging/install: clean temporary environment, exact published/bundled artifact, both entry points, offline critical journey, supported runtime/platform matrix, and no source-tree/module-resolution leakage.
- Lifecycle/recovery: fault before mutation, during durable write, after commit but before acknowledgement, during cleanup, and on restart/replay. Assert returned error, state invariant, observability, cleanup, and safe retry.
- Concurrency: barriers/latches that force the contested order; true multi-process tests for OS/file locks; stale-version/CAS conflicts; simultaneous create/update/delete; cancellation and shutdown races. Do not use repeated sleeps as proof of race safety.
- Time: fake/controlled clocks for scheduling/expiry logic plus one bounded real-timer integration proof where runtime semantics matter; cover clock jumps, zero/negative/maximum durations, and event ordering.

Every fault test must assert both the failure outcome and post-failure state. A thrown error alone does not prove safety.

## 8. Branch, mutation, property, flake, and speed evidence

- Use branch coverage as a map of unexercised decisions, especially else/error/cleanup branches. Never translate the percentage directly into assurance.
- Use mutation testing diagnostically. Report named survivors, impacted requirements, equivalent-mutant rationale, timeouts/crashes, and follow-up disposition; do not chase a global mutation score or make it a universal merge gate.
- Confirm instrumentation/source maps include the production code actually executed. A green report over the wrong artifact is no evidence.
- Property/generative tests suit grammars, serialization round trips, invariant preservation, idempotence, and state machines. Persist failing seeds/examples and supplement generators with semantic boundary cases.
- Record skipped/todo tests and conditional branches in the harness; a skipped test protects nothing.
- Treat retries as diagnostics, not a way to make a gate green. Track first-attempt failure, duration distribution, resource contention, and environment correlation.
- Quarantine only with an owner, explicit unprotected contract/risk, issue, expiry, and replacement plan. Do not delete a flaky test without replacing its assurance.
- Separate fast presubmit, slower integration/E2E, and scheduled mutation/environmental lanes while ensuring every material suite has an enforced home.

## 9. Blind spots and false-confidence checks

Explicitly search for:

- Test files omitted by globs, scripts not invoked by the advertised gate, stale built artifacts, conditional skips, environment-only branches, and commands whose failure exit is masked by pipes/wrappers.
- Assertion-free tests, weak type/boolean assertions, snapshots that bless defects, mocks/fakes that copy production logic, and tests that only assert setup succeeded.
- Happy-path monoculture; absent malformed-input, dependency-failure, cleanup, concurrency, cancellation, migration, and destructive-write cases.
- Unit tests for each surface without cross-surface agreement; integration tests that never exercise the public entry point; source tests that never test the shipped artifact.
- Coverage exclusions or transpilation/source-map gaps; mutation “kills” caused by crashes/timeouts rather than the intended assertion.
- Order dependence, shared temp paths/ports/environment, leaked handles, fixed sleeps, implicit locale/timezone/user/git config, or machine-specific tools.
- Broad duplicated tests that create volume without new risks/oracles; obsolete tests that pin implementation history rather than current contracts.
- A green local gate with no CI/exact-SHA enforcement, or CI on a narrower runtime/platform/dependency shape than the product promise.

## Evidence and coverage-quality conventions

Every assurance claim and gap should carry:

- `claim_id`, `requirement`, `risk`, `surface`, `test_level`, and exact source/test/gate references.
- `evidence_kind`: `empirical` (exact command/probe executed), `static` (artifact inspected), `reasoned` (inference with premises), or `historical` (prior report not revalidated).
- `oracle`, `reality_level`, `negative_fault_dimensions`, `execution_environment`, and `observed_result`.
- `sensitivity_evidence`: red probe, named mutation outcome, regression provenance, or `not established`.
- `coverage_quality`: strong/partial/indirect/absent/unknown, with the missing dimensions named.
- `residual_risk`, `confidence`, `false_positive_alternatives`, `survived_attacks`, `recommendation`, and `validation_strategy`.

Empirical evidence must identify exact command, working directory, runtime/platform, exact revision/artifact, and exit code/result. Run gates unpiped or capture their own exit status; do not treat stale runs as current. Static claims of absence must include the search scope/query and limitations. Reasoned findings must state the premises and what probe would falsify them.

Finding severity should reflect user/system impact and exploitability/recoverability; confidence reflects evidence quality. Do not lower severity because confidence is low. Prioritization should also note remediation leverage: moving an invariant into an owning primitive plus one focused test may remove a class of defects more effectively than adding many projection tests.

## Plan and acceptance-criteria critique

The current plan has a sound diverge/freeze/apply/review/QA sequence and correctly requires evidence-backed findings, empirical-vs-reasoned labels, cross-review, and survived attacks. Testing omissions remain:

1. “Unit/integration coverage and relevance” is too broad: no required test inventory or requirements-risk matrix, so the review could become a tour of test files rather than a contract audit.
2. Testability has no operational definition; the plan does not require evaluating side-effect seams, controllability/observability, fault injection, or the danger of over-mocking.
3. It does not require proof that test assets are reached by actual developer/CI gates, nor review of skips, globs, build/artifact identity, runtime/platform matrices, or masked exit statuses.
4. Negative/adversarial, recovery, partial failure, concurrency, time, subprocess, filesystem, network, package/install, and environmental paths are not explicit acceptance dimensions.
5. There is no unit-vs-integration allocation rule and no requirement to identify contracts shared across public surfaces and test them through an owning primitive/agreement table.
6. “Evidence-backed” does not define oracle strength or sensitivity. A passing test can still be assertion-free or irrelevant; representative red probes/mutation evidence and branch maps should be diagnostic conventions.
7. Flaky/slow tests, retries, resource leaks, isolation, fixture provenance, and fake/mock fidelity are omitted.
8. The QA gate empirically verifies high/medium findings but does not require residual-risk/coverage-quality labels for assurance claims, nor require searches for false-confidence mechanisms.
9. Reuse across projects needs an explicit core rubric plus boundary-specific annex; otherwise CLI-specific probes may harden into a supposedly universal checklist.
10. The approved-template freeze lacks amendment handling. Phase 2 should apply the frozen rubric, record any inapplicable criterion or discovered rubric defect, and route changes through a visible amendment rather than silently changing evaluation rules mid-review.

Recommended additions to the parent acceptance criteria:

- The testing section includes a classified inventory, requirements-risk matrix, testability/seam assessment, boundary/fault matrix, blind-spot analysis, and residual-risk statement.
- Every material assurance claim names an observable contract, exact test/gate, oracle, evidence kind, and coverage-quality label; green line/test counts alone are inadmissible.
- High-risk contracts have direct owning-layer evidence, real boundary/public-surface evidence, relevant negative/fault behavior, and sensitivity evidence—or an explicit documented gap.
- The review evaluates determinism, isolation, fixtures/doubles, subprocess/filesystem/network/package boundaries, concurrency/time, mutation/branch/property evidence, skips/flakes/slowness, and gate reachability.
- Recommendations state the intended test level, seam/owner, failure oracle, exact validation strategy, and residual risk after remediation.
- Phase-2 review uses the frozen template; deviations/inapplicable criteria and proposed amendments are recorded.

## Phase-2 probe ideas (not yet executed)

- Build a command-to-suite/gate map from package scripts, test globs, CI workflows, and generated/bundled artifact paths; sample one test from each materially different lane.
- Select requirements from public help/spec/standing gates and trace them forward to tests, then select representative tests and trace them backward to explicit requirements.
- Sample high-risk tests for a controlled red probe and inspect current mutation survivors/branch maps as named leads rather than scores.
- Exercise representative CLI commands through the exact shipped/bundled entry point in isolated temp environments, checking stdout/stderr, exit status, filesystem state, and cleanup.
- Use deterministic injected failures at filesystem, child-process, local network, and lifecycle phases; use barriers for concurrency and one true multi-process proof for OS-level coordination.
- Audit fixed sleeps, retrying tests, conditional skips, open-handle cleanup, shared globals/temp paths/ports, environment restoration, and duration outliers.
- Compare fakes/mocks with the real adapter contract and inspect fixtures/goldens for provenance, external shape, and drift controls.
- Verify representative package/install/offline/runtime-matrix promises without relying on the source workspace’s module resolution.

## Assumptions and edge cases

- The rubric is architecture- and language-neutral at its core; examples emphasize a local-first Node CLI because that is the later target.
- Not every boundary category applies to every project. `Not applicable` requires a short rationale; it is not a free pass.
- Some high-risk real-world faults cannot be safely reproduced in ordinary tests. In those cases accept a reasoned residual-risk statement plus the closest controlled simulation and an explicit operational/QA probe.
- Mutation and coverage tooling can themselves be misconfigured; their inclusion is evidence only after artifact/instrumentation identity is established.
- Exact line references belong to phase 2 and must identify the reviewed revision. This note deliberately contains no actual `packages/cli` findings.

# Progress

Divergent testing/testability template design complete. Awaiting orchestrator synthesis and exact-draft vetting; package review remains intentionally unstarted until the template is approved.
