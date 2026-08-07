---
type: Context Note
title: CLI architecture review testing findings
description: >-
  Static test coverage, relevance, and testability assessment at exact source
  81b3c39.
actor: testing-reviewer
timestamp: '2026-08-07T14:30:10.795Z'
---
# Summary

At exact clean source revision `81b3c39ff252013e318b1a714b63430a24074d70`, the `packages/cli` suite provides strong behavioral assurance for its central local-first workflows. It does this through real temporary filesystems, real Git repositories and races, subprocesses of the built CLI, local HTTP servers, explicit fault tables, package-install verification, and source/generated agreement tests. The current package gate reaches every current top-level `.test.ts` file. The main residual risks are architectural rather than raw test-count deficits: the session-start outer timebox does not cancel the losing pull, real OS signal shutdown is bypassed by command tests, diagnostic sensitivity is only sampled across a curated slice, and grammar-heavy surfaces have no generative invariant checks.

This is a read-only static application of architecture-review template v1.0. It did not execute tests, coverage, mutation, package installation, or network probes. Findings below are candidate inputs for cross-review, not final report findings. Historical claims remain historical until the root reviewer validates them against this exact revision.

# Review frame

- Target: `packages/cli` plus its exact repository gates, build/package scripts, fixtures, generated-agreement surfaces, and built-artifact entrypoints.
- Revision: `81b3c39ff252013e318b1a714b63430a24074d70`.
- Template: `reviews/architecture-review-template` version `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- Domain model: `research/architecture-review-domain-model` version `sha256:061758d30ed7cb406f4e48157470e742d48ec0a79aaced5fdf05b599e9f1c231`.
- Ultimate goal: provide visible, conflict-safe, local-first shared memory through a Markdown knowledge bundle and agent-oriented CLI.
- Proximate goal: distinguish real behavioral assurance from false confidence so the CLI review can strengthen reliability without rewarding test-count theater.
- Evidence class: E1 static evidence unless a row explicitly points to historical evidence awaiting reproduction.
- Exclusions: no current empirical pass/fail result, no current branch coverage map, no current mutation survivor set, and no current duration distribution.

# Classified inventory and exact gate reachability

The exact source tree contains 86 `packages/cli/src` files, 82 top-level `packages/cli/test/*.test.ts` files, no nested `.test.ts` files, 13 fixture files, and the test loader/helper files. The package test script at `packages/cli/package.json:42` builds the local-dev artifact and runs `node --test --import ./test/ts-loader.mjs ./test/*.test.ts`; therefore every current test file is reachable from the package gate. The root test and check scripts at `package.json:14-17` reach workspace tests, script tests, package verification, skill checks, MCP browser tests, and UI end-to-end tests. The CI gate runs the same root `npm run check` on Ubuntu with Node 22 and 26 at `.github/workflows/ci-tests.yml:50-71`. A separate built-artifact smoke at `.github/workflows/ci-tests.yml:73-105` exercises the declared Node 20 engine floor.

Static classification, which is not an assurance score:

- 70 test files directly import source modules.
- 20 test files contain process-spawn or subprocess patterns.
- 17 test files reference built or dist artifacts.
- 26 test files exercise network or local-server behavior.
- 20 test files contain explicit timing primitives.
- All 82 test files contain an assertion token, but this does not prove every declared test has a meaningful oracle.
- Seven explicit environment skips were found: Darwin-only filesystem flags, root-sensitive permission behavior, and zsh-only resolver behavior. No generic quarantine or retry mechanism was found.
- The mutation runner reaches all current test files through `test/*.test.ts`, but the default CLI mutate set covers eight named source files at `packages/cli/stryker.config.json:11-20`.
- No c8, Istanbul, nyc, lcov, Node test-coverage gate, `fast-check`, `fc.assert`, or `fc.property` reference was found in the bounded package, root-script, lockfile, and workflow search.

# Requirement-risk-test matrix

| Requirement or risk surface | Assurance state | Exact tests or gates and oracle | Real versus fake boundary | Negative or fault evidence | Environment and residual risk |
| --- | --- | --- | --- | --- | --- |
| CLI parse, usage, error taxonomy, exit and output channels | strong | `test/args.test.ts:22-181`, `test/error-boundary.test.ts:96-241`, and raw output cases in `test/doc.test.ts:2594-2990`; exact strings, codes, stdout, and stderr are asserted | direct source plus built subprocess cases | unknown codes, non-Error throws, ENOSPC, EACCES, missing docs, invalid typed inputs | Ubuntu CI on Node 22/26 plus Node 20 artifact smoke; branch sensitivity remains unmapped |
| Local bundle resolution, mutation, idempotency, CAS, and create-only behavior | strong | broad `doc.test.ts`, `filesystem-cross-process-cas.test.ts:98-221`, and `init-create-only.test.ts:239-574`; exact versions, conflicts, winner counts, and filesystem state | real temp directories and real subprocess races | stale heads, simultaneous writers, symlinks, permissions, conflict cleanup | root and platform-specific permission semantics are conditionally skipped |
| Git sync, establish, in-tree, conflicts, autopull, and session-start | partial | sync-family suites and real Git topologies assert refs, receipts, cursor/cache state, conflict classifications, and offline fall-through | real local Git repositories and fake remote helpers | divergence, races, hanging helpers, tiny budgets, conflict families | behavior is broad, but outer session-start cancellation is not observable or enforceable; see TST-CLI-01 |
| Long-running serve and UI command lifecycle | partial | `serve.test.ts`, `ui.test.ts`, and `ui-pages.test.ts` assert listener behavior, close calls, post-close drain, and command output | real local listeners with injected shutdown promises | bad ports, boot failures, aborting in-flight snapshot, boot timeouts | real SIGINT and SIGTERM public boundary is bypassed; see TST-CLI-02 |
| UI host, token, cookie, proxy, and secret boundaries | strong | `ui-security.test.ts:18-93`, `ui-proxy.test.ts:20-140`, and UI page suites assert host policy, token checks, secret removal, encoding, and 502 classification | local server/proxy boundaries with controlled peers | hostile Host, cookie and query cases, upstream failure, abort and timeout | no claim here about production reverse proxies or public networks; security reviewer should cross-check |
| Update-check cancellation, bounds, and response handling | strong | `update-check.test.ts:255-390` asserts exact request policy, redirect/retry absence, stream cancellation, peer closure, malformed and oversized responses, timeout, and offline behavior | injected fetch plus controlled response streams | abort, early failure, malformed bytes, HTTP failures, oversize, timeout | testability is high because fetch, timeout, and byte ceiling are injected |
| MCP stdio startup and channel purity | strong | `mcp-stdio.test.ts` drives the built CLI and asserts clean stdio behavior | built npm CLI subprocess | startup/usage paths and stdout contamination guards | external host integrations beyond the clean subprocess are outside this package pass |
| Build, generated assets, package install, bins, runtime floor | strong statically; empirical status pending | root `npm run check`; `scripts/verify-npm-package.mjs`; Node 20 smoke; skill-distribution suite. Oracles include exact allowlist, no runtime dependencies, both bins, version/build identity, recipe workflow, skill and hook lifecycle, and tarball SHA | actual pack/install in isolated prefix when executed; exact built artifact for smoke | create-only, retained channel, uninstall, missing/extra files, engine-floor behavior | root reviewer must run the exact-revision package probes before elevating from E1 gate inspection to E2 |
| Source/generated and cross-surface agreements | strong for named agreements | `query-surface-agreement.test.ts:110+`, `host-config-root-agreement.test.ts:53+`, `render-document-surface-agreement.test.ts:271-317`, `sync-outcomes.test.ts`, and `skill-distribution.test.ts:57-545` compare authoritative surfaces | real generated files and fixtures, not duplicated mocks | orphan and phantom entries, missing roots, divergent outcome rows | named agreements are controlled; this does not prove every duplicated surface has an agreement test |
| Grammar-heavy IDs, argv, safe paths, recipe manifests, prefixes | partial | `concept-id.test.ts`, `args.test.ts`, `invocation-hints.test.ts`, and `recipe-source.test.ts:75-745` have extensive hand-authored boundary and attack cases | direct owning parsers and real fixture directories | unsafe paths, case folds, dot files, symlink escapes, ambiguity, reserved keys | no generative or property invariant layer; see TST-CLI-04 |
| Fault sensitivity diagnostics | partial | weekly and on-demand mutation workflow uses the full CLI test set with per-test coverage; survivors are reported | real instrumented build and suite | seeded mutations in selected invariant modules | default CLI set is 8 of 86 source files and there is no branch map; see TST-CLI-03 |
| Isolation, flake resistance, and timing determinism | unknown statically | tests use fresh temp homes/repos and restore environment in finally blocks; timing cases include real hanging remotes and some injected clocks | mixture of real processes and fakes | explicit hangs and zero-boundary clock jumps | historical flake claims require exact-SHA reproduction; several wall-clock threshold tests remain current |

# Strong controls worth preserving

1. The suite tests behavior at owning layers and public boundaries rather than relying on a single style. Direct modules, real local resources, built subprocesses, and package-install probes complement each other.
2. Concurrency tests use real cross-process contention and exact winner/conflict/state oracles. This is materially stronger than mocked concurrency.
3. Agreement tests compare maintained surfaces to an authority. Current query, host-root, render-document, outcome-state, and skill-distribution agreements close several historically documented drift risks.
4. Error and raw-output tests assert channel purity and exact classification under injected filesystem failures.
5. Package verification is a substantial release contract, not a smoke-only check.
6. Update checking exposes controlled fetch, timeout, and byte-limit seams and tests cancellation and peer closure.
7. CI has no retry or generic quarantine that could hide a failure, and it allocates full harness testing to Node 22/26 while separately exercising the shipped bundle on Node 20.

# Candidate finding TST-CLI-01: the session-start outer timebox is not a cancellation boundary

- Candidate severity: Medium.
- Confidence: High that the mechanism exists; Medium that it produces user-visible harm under default dependencies.
- Priority: Next.
- Evidence: E1.
- Requirement, risk, surface: `session-start` promises bounded foreground orientation. A timed-out pull must not retain unbounded resources, mutate state unexpectedly after the command has rendered, or keep the process alive beyond the advertised budget.
- Observed mechanism: `SessionStartDeps.pull` accepts only `dir` and `budgetMs` at `src/commands/session-start.ts:120-125`. The outer `Promise.race` at `:286-309` returns an offline outcome after the timer, but the source explicitly states that the losing pull continues detached and its rejection is swallowed at `:289-293`.
- Existing controls and counterevidence: `sessionStartPull` uses an injected clock and passes remaining budgets into Git operations at `:136-150`; real hanging-remote, clock-jump, zero-budget, and never-resolving-dependency tests exist at `test/session-start.test.ts:508-625`. State writes are designed to be atomic. These controls make current default-path corruption less likely.
- Oracle and boundary gap: the never-resolving test proves only that home renders within a threshold. No oracle asserts cancellation, resource closure, absence of late writes, or prompt process exit after the outer timeout. The injected `pull` seam cannot receive an `AbortSignal`.
- False-confidence risk: a green latency assertion can be read as proof that the operation itself was bounded, when it proves only that one waiter stopped waiting.
- Causal chain: asynchronous pull exceeds budget -> outer race resolves offline -> pull remains live with no cancellation contract -> resource or state activity may continue after render -> latency, exit, and state-finality guarantees depend on undocumented behavior of each dependency.
- Recommendation: make cancellation part of the owning pull contract, preferably with an `AbortSignal` propagated through asynchronous operations. Add deterministic tests that observe the abort, release an owned resource only on abort, attempt a late state write, and assert no post-return effect. Retain one real hanging-helper test for the Git process timeout.
- Empirical validation for root: run a built-artifact or controlled-dependency probe that records command-return time, process-exit time, open-resource closure, and post-return state. If default dependencies are all synchronously bounded and cannot retain resources, lower severity and document that invariant explicitly.

# Candidate finding TST-CLI-02: real OS signal shutdown is outside the command test boundary

- Candidate severity: Low.
- Confidence: High.
- Priority: Next.
- Evidence: E1.
- Requirement, risk, surface: public `serve` and `ui` commands promise to remain foregrounded until SIGINT or SIGTERM and then close their listener cleanly.
- Observed mechanism: both commands implement private default signal waiters with `process.once` at `src/commands/serve.ts:67-70` and `src/commands/ui.ts:70-73`, followed by listener closure at `serve.ts:135-138` and `ui.ts:255-258`. The command tests deliberately inject `waitForShutdown`; bounded search found no test that sends SIGINT or SIGTERM to either public command. `test/serve.test.ts:103-104` also waits for readiness with an unbounded polling loop.
- Existing controls and counterevidence: tests do boot real listeners, verify command output, control shutdown, and assert listener closure. UI page tests exercise aborting in-flight work, boot timeouts, and post-close mutation drain. The default signal code is small.
- Oracle and boundary gap: no built-subprocess test asserts that the actual signal listener is installed, the process exits successfully, the port becomes reusable, and stdout/stderr remain contract-clean. Dependency injection bypasses the exact public lifecycle boundary.
- False-confidence risk: injected shutdown validates cleanup after a promise resolves, not signal delivery or subprocess termination.
- Causal chain: command launched through shipped entrypoint -> private signal wiring differs or regresses -> injected tests still resolve normally -> real command may fail to close or exit cleanly on operator shutdown.
- Recommendation: centralize the duplicated signal waiter or expose it as one tested authority. Add bounded built-artifact subprocess tests for `serve` and `ui`: wait for an explicit readiness receipt, send SIGTERM, assert exit 0, assert expected channel bytes, and prove the port can be rebound. Bound the current serve readiness wait by run rejection plus a short timeout.
- Empirical validation for root: a signal probe on the exact built artifact can either confirm the current path and reduce urgency or expose a lifecycle failure.

# Candidate finding TST-CLI-03: fault-sensitivity diagnostics cover a curated slice and provide no branch map

- Candidate severity: Low.
- Confidence: High.
- Priority: Planned.
- Evidence: E1.
- Requirement, risk, surface: the review needs sensitivity evidence for high-risk decision points, especially error translation, sync routing, security boundaries, cancellation, and packaging policy.
- Observed mechanism: the scheduled CLI mutation configuration names eight source files at `packages/cli/stryker.config.json:11-20`, while the exact CLI source inventory is 86 files. The workflow documents the 300-minute whole-CLI limit and permits an on-demand override at `.github/workflows/mutation-tests.yml:20-27,110-117`. No branch-coverage tool or gate was found.
- Existing controls and counterevidence: the selected modules are deliberately invariant-bearing; the full CLI test set is used, the built artifact is rebuilt after instrumentation, per-test coverage is enabled, and survivor details are reported. Mutation is appropriately scheduled rather than a PR score gate.
- Oracle and boundary gap: current diagnostics cannot show which branches in the remaining source are never executed or whether their key decisions can survive plausible defects. A mutation report may look package-wide even though the default mutate list is narrow.
- False-confidence risk: green CI plus mutation output can be interpreted as broad sensitivity without a decision map or explicit scope label.
- Recommendation: add a non-gating branch-map run and publish named uncovered high-risk decisions, not a numeric threshold. Rotate or risk-select mutation targets outside the default eight, preserve named survivor actions, and label reports with the exact mutate scope. Prioritize session cancellation, signal lifecycle, UI security/proxy decisions, package policy, and grammar boundaries.
- Empirical validation for root: collect exact-SHA branch output and the current mutation scope/report. Do not convert either into a global score.

# Candidate finding TST-CLI-04: grammar-heavy invariants depend on finite examples only

- Candidate severity: Low.
- Confidence: High.
- Priority: Planned.
- Evidence: E1.
- Requirement, risk, surface: concept IDs, aliases, argv errors, recipe paths, prefixes, safe segments, and manifest inventories are combinatorial grammars whose invariant space is larger than a fixed case table.
- Observed mechanism: the relevant tests are extensive but hand-authored. The bounded repository search found no property-test library or `fc.assert` or `fc.property` use.
- Existing controls and counterevidence: `test/recipe-source.test.ts:75-745` covers safe and unsafe paths, case-fold duplicates, dot-prefixed files and directories, undeclared content, symlink escapes, and exact spellings. `concept-id.test.ts` covers alias ambiguity and physical-path escape, while `args.test.ts` covers the current parser error taxonomy.
- Oracle and boundary gap: there is no generative proof that valid IDs round-trip, invalid path segments never escape a root, arbitrary parser failures never leak advisory text, or normalization remains idempotent across combinations.
- False-confidence risk: a long example table can still miss interactions between separators, case folding, Unicode, dot segments, prefixes, and platform path rules.
- Recommendation: add small deterministic property suites at the owning parser or canonicalization layer. Generate valid and invalid segments, persist failing seeds, and assert round-trip, idempotence, no escape, and stable error-class invariants. Keep the current explicit cases as readable regression examples.
- Empirical validation for root: confirm whether property tests exist in a consumed owning workspace package before treating this as CLI-owned. If the CLI delegates an invariant completely, map and cite the owning property test rather than duplicating it.

# Historical claims to verify, not current findings

The bundle note `tasks/flaky-timing-test-cluster` records four full-suite flakes observed on 2026-08-05: a core lock timing case, three session-start timing boundaries, and a serve case. Those occurrences are historical and were not reproduced here. Current exact source still contains real wall-clock assertions around hanging helpers at `test/session-start.test.ts:508-527,538-569,586-619` and `test/autopull.test.ts:345-374`, plus the unbounded readiness loop at `test/serve.test.ts:103-104`. Some decision logic already has injected clocks, and the tests use generous thresholds.

Root verification should repeat the targeted timing cluster under ordinary and loaded conditions, record individual durations and failure modes, and distinguish product timeout failures from test-harness scheduling noise. If current flakes reproduce, prefer deterministic clocks for deadline decisions and isolate or serialize the small number of real process-timeout proofs. Do not add blind retries.

The historical `plans/test-suite-confidence` and `tasks/branch-coverage-audit` describe agreement drift, branch blindness, environment monoculture, and prior mutation measurements. Current source now contains named agreement tests and cross-version CI, so those old claims must not be copied forward wholesale. The missing branch map remains current static evidence. Historical mutation scores or survivors must be rerun before citation.

# Requested empirical follow-ups for the root reviewer

1. Run the exact-revision `packages/cli` package test gate and the root `npm run check`; record command, runtime, environment, duration, and exit.
2. Run the package verification path and Node 20 built-artifact smoke or equivalent exact probes; preserve the tarball and built-artifact identities.
3. Produce a non-gating branch map and name materially uncovered decisions. Do not report only a percentage.
4. Reproduce the timing cluster repeatedly, including under load, and record whether failure is timeout enforcement, scheduling slack, leaked work, or readiness polling.
5. Send SIGTERM to built `serve` and `ui` processes after explicit readiness; assert exit, channels, listener closure, and port reuse.
6. Probe session-start cancellation semantics: foreground return versus process exit, open handles, abort observation, and post-return state.
7. Inspect a current mutation report or run a bounded risk-selected target set; report named survivors and exact scope.
8. Check consumed owning packages for property tests covering IDs and safe-path grammar before assigning TST-CLI-04 solely to the CLI.

# Assumptions and unverified edges

- Static reachability from scripts does not prove that every test executed or passed at this revision.
- Assertion-token presence does not prove oracle quality for every test.
- Local Git and HTTP peers exercise protocols and lifecycle without representing every production network, proxy, filesystem, or credential environment.
- Conditional root, Darwin, and zsh skips are explicit portability gaps, not automatically defects.
- The built artifact and tarball identities recorded in target-freeze evidence were not independently rebuilt by this specialist.
- TST-CLI-01 is a definite missing cancellation contract but its practical severity depends on the actual default pull dependencies and open-handle behavior.
- TST-CLI-04 should move to the owning workspace if canonical grammar behavior is fully delegated there.
- Security conclusions are deliberately limited to testing allocation and should be reconciled with the security specialist.

# Cross-review handoff

Cross-review should challenge candidate severity and ownership, not the static mechanisms. Reliability should review TST-CLI-01 and the historical timing cluster. Runtime or packaging should validate built-process signal and package probes. Security should confirm whether the current UI boundary cases cover the material threat model. Maintainability should assess whether centralizing the duplicated signal wait and making cancellation first-class improves ownership without widening the API unnecessarily.
