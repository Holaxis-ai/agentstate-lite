---
type: Review
title: Architecture review — packages/cli
actor: codex-orchestrator
timestamp: '2026-08-07T14:58:31.837Z'
---
# packages/cli architecture review

## Decision card

- **Target:** `packages/cli` and its consumed contracts, tests, build/distribution machinery, generated references, and shipped artifact at clean source revision `81b3c39ff252013e318b1a714b63430a24074d70` on `feat/init-create-only`.
- **Artifact:** `packages/cli/dist/agentstate-lite.mjs`, 4,559,755 bytes, SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583`.
- **Base:** `origin/main` at `458f44ae8b3ed0021997fb537eca356fb47dea1a`.
- **Environment:** Darwin 25.6 arm64, Node 25.2.1, npm 11.6.2; configured Linux/Node 20, 22, and 26 lanes were inspected but not all independently rerun by this review.
- **Purpose:** the publishable agent-facing adapter over core OKF semantics, board-git, reference server, View/UI runtimes, and build/distribution authorities.
- **Applicability:** CLI/process, stateful, concurrent/distributed, security-sensitive local host, published package/plugin, and UI/server profiles are required. Hosted deployment internals and browser accessibility are outside this package review.
- **Review status:** **APPROVED BY REVIEWERS**; independent QA outcome is recorded in the separate exact-version approval record.
- **Template:** approved reusable architecture review template v1.0 at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- **Evidence cutoff:** 2026-08-07; target drift invalidates affected findings and probes.
- **Target verdict:** **Incomplete; changes required within the assessed scope.** Three public findings require remediation or an explicit acceptance decision. Current live dependency-advisory status is not assessed, and disclosure-sensitive main-line candidates require private advisory handling before an unqualified security/release conclusion.
- **Highest-leverage action:** create one identity-bound, fail-closed create-only lifecycle owner and its deterministic phase-fault harness; then centralize positional arity enforcement before command side effects.

No aggregate architecture score is reported. Severity, confidence, evidence, and priority remain separate.

## Review contract and evidence

The review must determine whether the CLI reliably preserves caller intent, bundle identity, state integrity, bounded lifecycle behavior, stable public contracts, and a verifiable shipped artifact. The material capability/risk universe was frozen before implementation review: dispatch/grammar; local and remote bundle selection; document mutation; board sync; recipes; server/UI/MCP lifecycle and trust boundaries; passive orientation; build/package/install; resources; portability; and test feedback.

Methods included exact-revision static source and test tracing, a corrected TypeScript runtime-import graph, full repository gate execution, Node test coverage, exact-artifact arity and signal probes, package/build identity checks, specialist review, and adversarial cross-review. E1 means a revision-bound causal trace; E2 adds a bounded reproduction or survived probe; E3 is reserved for independently reproduced or continuously enforced properties.

The first sandboxed full gate failed because the environment denied loopback binds with `EPERM`. The identical `npm run check` rerun with loopback permission exited 0. Node coverage then executed 1,299 tests with 0 failures in 41.9 seconds: 95.49% lines, 87.76% branches, and 90.50% functions. Percentages are used as a branch map, not an assurance score.

A live npm advisory query was not authorized because it would transmit the dependency graph. The offline cache reported zero advisories, but its freshness is unknown. No current-absence claim is made.

## Applicability and stopping-rule disposition

| Template module or cross-cutting artifact | Disposition | Evidence boundary, rationale, and residual risk |
| --- | --- | --- |
| Purpose, requirements, and scope coherence | Required — assessed | Product authority and CLI scope were traced from `docs/core`, `CLAUDE.md`, the frozen target, and public surfaces. Hosted deployment is separately N/A below. |
| Domain model, cohesion, coupling, and SOLID | Required — assessed | Authority/change traces and corrected runtime graph cover the material CLI adapters. Large files/fan-in were signals only; symbol-level cohesion was sampled around risk owners rather than exhaustively scored. |
| API, compatibility, and error contracts | Required — assessed | Argv, error/output/exit, command registration, generated reference, and package/bin contracts were traced; CLI-ARCH-02 is the material gap. |
| Security and trust boundaries | Required — assessed in public and private lanes | Public controls and branch findings are reported defensively; inherited main-line candidates were privately dispositioned and remain exact routing markers. Current live dependency advisories are separately not assessed. |
| Reliability, fault tolerance, and recovery | Required — assessed | Local mutation, create-only, sync partial-success, passive orientation, server lifecycle, and recovery receipts were traced. Create-only deterministic fault validation and `ui` lifecycle remain gaps. |
| Tests, coverage relevance, and testability | Required — assessed | Requirement-risk-test matrix, 82-file gate reachability, full gate, 1,299-test coverage run, fault seams, mutation scope, and false-confidence risks were reviewed. A one-time branch map is not a recurring control. |
| Performance and resource behavior | Sampled | Update/network bounds, whole-bundle operations, create-only scanning, and catalog enumeration were selected by externally/user-grown work reachability. Deep/wide scan and large-catalog scale remain unmeasured. |
| Operability, observability, and human/agent legibility | Required — assessed | Structured receipts, exits/channels, partial-state guidance, help/reference projection, and lifecycle readiness were traced. False postconditions and ignored argv are findings. |
| Build, dependencies, distribution, and portability | Required — sampled and partly not assessed | Exact local artifact, full gate, tarball allowlist/install proof, generated inputs, dual bins, runtime floor design, and configured CI lanes were inspected. Only Darwin/Node 25 was rerun here; current live dependency advisories are **not assessed**, making the overall verdict incomplete. |
| Maintainability, documentation, dead code, and simplification | Required — sampled | Module reachability, command/reference authorities, historical facade, generated-source agreements, and representative large/change-heavy modules were reviewed. No material dead production module was found; exhaustive symbol-level dead-code proof was not attempted. |
| Capability/authority/contract trace | Required — assessed | The system and authority map below covers every frozen material capability; full traces are exact-version-bound in the design/reliability evidence. |
| Security entrypoint/privileged-sink matrix | Required — assessed in private lane, publicly redacted | Security specialist traced filesystem, credential/remote, loopback host/View, subprocess, and package boundaries. Public output retains only controls, branch findings, and exact routing markers. |
| Requirement/risk/test/oracle matrix | Required — assessed | The assurance summary below and exact testing evidence classify owning tests, real/fake boundaries, negative cases, and residual gaps. |
| Mutation/workflow failure timeline | Required — assessed | Routine mutation and sync timelines survived review; create-only preflight → claim → CAS commit → isolation observation → compensation → receipt exposed CLI-ARCH-01A/B. Full exact trace is linked in design/reliability evidence. |
| Representative change traces | Required — assessed | Routine mutation, cross-cutting command addition, sync failure-policy, create-only onboarding, and distribution changes were traced; command-metadata multiplication remains an observation. |
| Dependency/authority map | Required — assessed | Corrected TypeScript local runtime graph plus consumed-package direction and semantic-owner tracing found no runtime SCC or reverse source import within the stated universe. Semantic duplication is not excluded. |
| Negative/exclusive-claim audit | Required — assessed | Runtime cycles, reverse imports, dead modules, swallowed errors, resource bounds, command agreement, transaction safety, and artifact cleanliness use class-specific bounded claims and corrections below. |
| Survived attacks, refutations, limitations, and dissent | Required — assessed | Exact-artifact arity reproduction, built `serve` signal survival, unresolved `ui` control, negative-claim limits, scope limits, and three specialist disagreements are recorded below. |
| Browser accessibility and semantic UI behavior | Not assessed | Reachable UI behavior is applicable but was outside this architecture evidence; residual risk is inaccessible or semantically misleading interaction despite correct host/runtime architecture. |
| Hosted/public deployment internals | Not applicable | Hosted deployment code is absent from this OSS repository and frozen by product authority; the reachable local reference server/UI and remote adapter remain assessed above rather than being hidden by this N/A. |

The stopping rule is satisfied for inventory and disposition: every frozen material item has a row or linked exact-version disposition. The target verdict remains `Incomplete` because a material current advisory boundary is not assessed and private remediation/disclosure work remains outside this public artifact.

## System and authority map

| Capability | Owning authority | CLI role | Review disposition |
| --- | --- | --- | --- |
| Process entry, argv, errors, output, exit codes | `index.ts`, `cli.ts`, `args.ts`, `errors.ts`, `output.ts`, command handlers | parse, dispatch, translate, render | Concern: positional arity is not centrally enforced; otherwise error/channel authorities are strong. |
| Local/remote target selection | `bundle.ts`, `config.ts`, `credentials.ts`; core backends | apply explicit-remote and local precedence, construct adapter | Concern: create-only lifecycle findings plus private-route markers; ordinary precedence is well centralized. |
| OKF reads and mutations | `@agentstate-lite/core`; `mutate.ts` adapter | shape intent, delegate versioned mutation, render receipts | Meets declared contract within reviewed bounds; fresh-read/CAS policy remains in core. |
| Board sharing | `@agentstate-lite/board-git`; `commands/sync/*`, `sync-outcomes.ts` | orchestrate phases and project typed outcomes | Strong static and test evidence for partial-success and conflict handling; private remote item remains separate. |
| Server, UI, Views, MCP | server/UI/View/MCP packages; CLI launchers | configure, boot, print readiness, wait, close | Partial: security controls are strong; built `serve` signal lifecycle survived E2; `ui` lifecycle has unresolved validation. |
| Recipes and portable definitions | recipe parser/source/resolver and `recipes.ts` | acquire, validate, apply expect-absent definitions | Strong boundary and adversarial fixture coverage; no separate parser authority found. |
| Passive orientation | `session-start.ts`, `autopull.ts`, `update-check.ts`, `update-orientation.ts` | bounded/fail-soft refresh and render | Partial: default operations are budgeted, but the outer timebox is not a cancellation contract. |
| Build, package, install, references | one esbuild configuration, build identity, generators, tarball verifier | produce self-contained dual-bin artifact | Strong machine-enforced artifact/allowlist/install evidence; live advisory freshness not assessed. |

The corrected explicit local runtime-import graph covers 86 source files and 368 runtime edges, excludes type-only imports, and contains no runtime strongly connected component. No reverse source import from consumed packages into the CLI was found. Expected high fan-in sits at cross-command policy seams (`errors.ts`, `invocation.ts`, `output.ts`, `args.ts`, and `bundle.ts`); fan-in and file size were not treated as defects without a causal failure.

## Assurance summary

| Requirement/risk | Assurance | Evidence and oracle | Residual gap |
| --- | --- | --- | --- |
| Parser/error/output/exit contract | Strong except arity | direct tests plus built subprocess assertions for codes/channels | surplus positional tokens are accepted on multiple handlers; one mutating path reproduced |
| Local mutation, idempotence, CAS, concurrency | Strong | real temp filesystems, Git repositories, subprocess races, exact versions/winner counts/state | create-only post-commit fault and target-replacement windows lack deterministic probes |
| Sync and degraded operation | Strong within tested topologies | real local Git topology, conflict/partial-success receipts, timeout cases | private remote item; exact production networks outside scope |
| Server/UI trust boundary | Strong controls, partial lifecycle | loopback defaults, Host/session checks, exact-byte View approval/revalidation, proxy/security tests | built `ui` signal and unavailable-opener behavior unresolved |
| Build/package/install/runtime floor | Strong gate design and exact local pass | full check, package allowlist, isolated install, both bins, build identity, Node-floor CI design | current external advisory status not assessed |
| Fault sensitivity | Partial but deliberate | one-time branch map; scheduled scoped mutation with full CLI tests | no recurring branch map; default mutation scope is 8 of 86 source files |
| Grammar/path invariants | Substantial finite examples | IDs, argv, recipe manifests, safe paths, symlink/ambiguity cases | no generative layer; ownership must be mapped before adding one |

Notable lower-branch/function areas in the one-time map were `commands/view.ts`, `commands/ui.ts`, `cli.ts`, `commands/mcp.ts`, `commands/bundle.ts`, `commands/serve.ts`, and `update-orientation.ts`. High-risk shared mutation/error/output authorities were materially stronger. The map directs follow-up; it does not override requirement-level evidence.

## Public findings

The team converged on two remediation families. The create-only family retains two separate finding IDs because its identity-continuity and observation/compensation invariants have different causal mechanisms and validation oracles.

### CLI-ARCH-01A — Create-only verification can convert incomplete observation or failed compensation into a false postcondition

- **Status/category:** confirmed E1 static finding; reliability, state integrity, operability. Here `confirmed` means the revision-bound mechanism and violated postcondition have a complete E1 causal trace; it does not claim E2 reproduction of the fault outcome.
- **Affected surface:** `init --create-only`; `packages/cli/src/bundle.ts:548-617`, caller `packages/cli/src/commands/init.ts:136-175`.
- **Invariant:** success requires complete post-commit isolation observation; a conflict receipt may claim clean rollback only after exact compensation is verified.
- **Expected/observed:** expected fail-closed typed outcomes and truthful cleanup state. The current descendant observation suppresses read failures and compensation suppresses removal failures, permitting an incomplete check to appear successful or an unverified cleanup to be described as complete.
- **Impact/exposure:** bounded local state-integrity and recovery-truth risk during concurrent creation or filesystem faults. The normal race suite is strong counterevidence for ordinary paths but does not exercise these fault windows.
- **Severity/confidence/priority:** **Medium** / **Medium overall** (High confidence in the static mechanism; Medium confidence in reachable occurrence and externally observable consequence) / **Now**, before treating the feature branch as merge-ready.
- **Owner/remediation:** a dedicated create-only lifecycle authority with typed phase results, explicit observation completeness, exact compensation receipts, and partial-state recovery guidance. Do not repair this in generic error rendering or recipes.
- **Validation:** deterministic injected read/observation/removal failures at each asynchronous phase boundary; assert no success on incomplete observation and no “nothing remains” receipt without verified cleanup. Retain the live bidirectional race battery.
- **Residual risk:** portable filesystem behavior and repaired-state semantics remain to be validated.
- **Disclosure:** public branch finding; defensive detail only.

### CLI-ARCH-01B — Create-only ownership is not bound to a stable physical target identity across phases

- **Status/category:** confirmed E1 static finding; security-adjacent state integrity and concurrency. `Confirmed` is limited to the complete static mechanism/invariant trace; the occurrence remains un-reproduced.
- **Affected surface:** the create-only preflight, claim, commit, verification, and rollback lifecycle in `packages/cli/src/bundle.ts:363-617` and `commands/init.ts`.
- **Invariant:** every irreversible or compensating action must remain authorized by the exact target identity/state claimed by this run.
- **Expected/observed:** expected identity continuity and revalidation through commit and rollback. The current multi-phase pathname-oriented lifecycle does not carry one stable ownership identity across every boundary.
- **Impact/exposure:** a concurrent target-shape or identity change can make later verification or compensation authority ambiguous. No exact-SHA replacement probe was run.
- **Severity/confidence/priority:** **Medium** / Medium / **Now**, before feature-branch merge.
- **Owner/remediation:** the same create-only lifecycle authority as CLI-ARCH-01A, but with stable target identity/ownership, revalidation before irreversible and compensating effects, and rollback bound to the exact state created by this run.
- **Validation:** target/state replacement and concurrent-content cases at every await boundary; assert fail-closed behavior, no out-of-target effects, and exact-state cleanup receipts.
- **Residual risk:** practical frequency and platform-specific identity semantics remain unmeasured.
- **Disclosure:** public branch finding; technical detail is limited to defensive invariants.

### CLI-ARCH-02 — Command grammar permits silent extra positional input before side effects

- **Status/category:** confirmed for representative `init` at E2; broader handler inventory E1. Correctness, API design, operability.
- **Affected surface:** shared parser wrapper `packages/cli/src/args.ts:1-74`; representative handlers include `commands/init.ts`, `commands/list.ts`, `commands/serve.ts`, and sync orchestration. Eleven zero-positional handlers opt into positionals without inspecting them.
- **Invariant:** tokens outside a command's declared positional grammar must be rejected before mutation, Git orchestration, listener boot, or other work.
- **Expected/observed:** expected USAGE/exit 2/no side effect. The exact built artifact accepted `init unexpected --dir <fresh-temp-dir> --recipe none`, exited 0, and created `index.md`.
- **Impact/exposure:** reliable false success and wrong-action risk, particularly for mutating and process commands. This does not establish command injection, unauthorized access, or data loss.
- **Severity/confidence/priority:** **Medium** / High / **Next**.
- **Owner/remediation:** one arity-aware command grammar authority declaring exact/minimum/ranged counts and rejecting surplus tokens before side effects. A typed command descriptor can also reduce command-metadata drift, but is not required if a smaller centralized primitive and exhaustive agreement suffice.
- **Validation:** an exhaustive public command/subcommand table appends a sentinel positional and asserts USAGE/exit 2, channel cleanliness, and no side effect. Include built-artifact mutation, Git, listener, and read-only representatives.
- **Residual risk:** only `init` was empirically reproduced; the bounded remainder stays E1 until exercised.
- **Disclosure:** public correctness finding.

## Observations and improvement opportunities

- **OBS-01 — create-only scan budget (Low/Planned):** the recursive post-commit isolation scan has no explicit depth/entry/time budget. Keep this resource invariant distinct from CLI-ARCH-01A/B, but implement a bounded iterative traversal in the same lifecycle owner and test deep/wide scratch trees with a deterministic budget oracle.
- **OBS-02 — command metadata authority (Planned):** `KNOWN_COMMANDS`, runtime handlers, public command groups, and skill-resource metadata are separately represented. No current public drift was found after deliberate exceptions, so this is change-amplification debt, not a correctness finding. Prefer typed descriptors or one exhaustive bidirectional agreement.
- **OBS-03 — catalog enumeration (Planned/Monitor):** catalog list parses and probes all explicitly enrolled entries and renders them without a command-level cap. Ordinary scale is expected to be small and home already timeboxes/caps its common projection. Measure supported scale before promoting; add `limit`, total/shown, and bounded probe concurrency if justified.
- **OBS-04 — session-start cancellation (Low/Next):** the outer `Promise.race` bounds foreground rendering but does not cancel its losing pull. Default Git operations consume remaining budgets and writes are atomic, so current evidence does not demonstrate late harm. Probe process exit, resource closure, and post-return state; then either propagate an `AbortSignal` through the owning contract or document the weaker guarantee.
- **OBS-05 — recurring branch/mutation feedback (Planned):** this review produced a one-time branch map; scheduled mutation is deliberately scoped to eight invariant-bearing files because whole-package runs exceed the practical budget. Publish exact scope, name uncovered decisions, and rotate risk-selected targets without introducing a global score gate.
- **OBS-06 — generative grammar testing (Optional):** current ID/path/recipe/argv attack tables are extensive but finite. Map each invariant to its owning package first; add deterministic properties only for combinatorial residuals not already owned elsewhere.

## Validation gaps, survived probes, and refutations

- **Built serve signal lifecycle survived (E2):** the exact artifact reached readiness, handled SIGTERM, exited 0 with no stderr, and released the port for immediate reuse on Darwin/Node 25. This refutes a present failure only for that boundary; it does not establish `ui`, cross-platform, or future-artifact behavior.
- **`ui --open` unresolved:** static asynchronous child-error reasoning is plausible, and a direct Node control failed as predicted, but a source-level unavailable-opener harness did not reproduce termination. Keep this as a candidate/validation gap rather than a confirmed finding. One exact-artifact harness should separately test unavailable opener, listener continuity, signal exit, channels, URL cleanup, and port reuse.
- **No material dead production module found:** module-level runtime reachability plus build/test reference search found no material dead module. `commands/sync-establish.ts` is a test-facing historical facade and a minor simplification opportunity. This does not prove symbol-level absence of dead code.
- **No runtime import cycle found:** approved only for the corrected explicit TypeScript local runtime graph after excluding type-only edges.
- **No present command/help drift found:** duplicated authorities remain an observation because current agreements and explicit exceptions close the sampled set.
- **Historical flakes not promoted:** historical timing failures were not reproduced at the exact revision and remain historical evidence only.

## Security and disclosure routing

The public review records only these approved routing markers. It intentionally omits trigger combinations, source-to-sink traces, reproductions, payloads, bypass detail, and private remediation mechanics.

- `PRIVATE_ROUTE_REQUIRED`: physical filesystem containment across filesystem-backed bundle operations — affected files: `packages/core/src/backend.ts`, `packages/core/src/filesystem-lock.ts`, and CLI/server adapters that consume that backend.
- `PRIVATE_ROUTE_REQUIRED`: confidential remote-credential transport policy — affected files: `packages/cli/src/config.ts`, `packages/cli/src/bundle.ts`, `packages/cli/src/commands/ui.ts`, `packages/core/src/remote-backend.ts`, `packages/ui-server/src/proxy.ts`.
- `PRIVATE_ROUTE_REQUIRED`: bounded remote/server resource handling — affected files: `packages/core/src/remote-backend.ts`, `packages/server/src/serve.ts`, `packages/server/src/router.ts`.

`PRIVATE_ROUTE_REQUIRED: destructive remote retry/version binding invariant`

The security specialist completed a private threshold disposition for the inherited main-line candidates. Required private lanes remain outside this public artifact. This report does not authorize disclosure, merge, or release.

Public-safe strengths to preserve include loopback-only server/UI defaults, explicit no-auth reference-server posture, exact Host/session controls, exact-byte View authorization and revalidation, private atomic credential storage, argv-based subprocess execution with bounds, core CAS/cross-process locks, build identity and clean-source release gates, retained-tarball verification, and a strict package-content/runtime-dependency allowlist.

## Prioritized action plan

1. **Now:** design and implement the create-only lifecycle owner addressing CLI-ARCH-01A and CLI-ARCH-01B; add deterministic phase-fault, replacement, and bounded-scan tests before feature-branch merge.
2. **Next:** centralize arity enforcement and add the exhaustive no-side-effect agreement table for CLI-ARCH-02.
3. **Next:** resolve the `ui` lifecycle probe contradiction and test built `ui` signal shutdown; probe session-start post-return finality.
4. **Planned:** reduce command metadata drift, make branch visibility recurring, rotate mutation targets by risk, and measure catalog scale before adding bounds.
5. **Private:** open and validate the required private advisory lanes; keep technical details off public branches and the shared board.
6. **Assessment closure:** obtain an explicitly authorized current dependency-advisory result or retain the published `not assessed` limitation in any release decision.

## Scope limits and dissent

- **Create-only grouping:** the security reviewer requires CLI-ARCH-01A and CLI-ARCH-01B to retain separate IDs because their violated invariants, mechanisms, and validation oracles differ. The architecture skeptic prefers one root-cause family with the two causal subpaths preserved. The testing reviewer preferred one grouped finding containing both integrity mechanisms plus the distinct scan-budget subclaim/oracle. The synthesis follows the security structure because template section 8 forbids deduplication when invariant and mechanism differ, groups 01A/01B under one remediation program to avoid duplicate implementation, and retains the scan budget separately as OBS-01 because no material exhaustion consequence was established.
- **Feedback-infrastructure status:** the testing reviewer proposed the non-recurring branch map and deliberately sampled mutation scope as a Low/Planned final finding. The skeptic preferred an observation. The synthesis retains OBS-05 because the exact review produced a current decision map, the default mutation scope is explicitly labeled and risk-selected, and no escaped defect or false release decision was causally attributed to the absence of a durable artifact. Promotion remains appropriate if recurrence fails to surface a named high-risk decision.
- **Create-only status/confidence:** the security reviewer treated the complete E1 static mechanisms as confirmed findings; the skeptic called the family a candidate pending deterministic fault validation and selected Medium overall confidence. The synthesis uses `confirmed E1` only for the revision-bound mechanism and violated postcondition, not for occurrence, while adopting **Medium overall confidence** and explicitly requiring E2 phase-fault probes. This preserves publication of a complete causal trace without implying empirical occurrence.
- The review did not independently execute every configured CI platform/runtime, Windows filesystem behavior, browser accessibility/semantics, hosted deployments, production reverse proxies, or exhaustive external-package internals.
- Full green gates prove the exact states exercised; they do not close fault windows named above.
- Current external dependency advisories remain not assessed. Zero cached advisories is not a current audit.
- Private security merits and mechanics are intentionally absent from this public artifact.

## Template post-use retrospective

The template materially improved the decision by separating severity, confidence, evidence, and priority; forcing target/artifact freeze; requiring counterevidence and survived probes; preventing file size and coverage percentages from becoming findings; preserving the DR-01/SEC-BRANCH-01 dissent; and routing released security candidates before public persistence. The most useful cross-project artifacts were the capability/authority map, requirement-risk-test matrix, failure/postcondition trace, and negative-claim audit.

The costliest fields were repeated per-finding restatement across specialist notes. A future template version may offer a compact finding table plus linked full records, but this is not a material defect and does not amend v1.0. No checklist quota or aggregate score should be added. Reuse should retain explicit applicability, evidence grades, private routing, and post-use pruning.

## Provenance

| Input synthesized | Exact version |
| --- | --- |
| `reviews/architecture-review-template` | `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09` |
| `reviews/architecture-review-template-approval` | `sha256:c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead` |
| `context-notes/cli-architecture-review-target-freeze` | `sha256:fdd6953d0862663b70dbad7029c84b02c0d77023c7b058ce95bf77479926b33c` |
| `context-notes/cli-architecture-review-empirical-evidence` | `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca` |
| `context-notes/cli-architecture-review-security-findings` | `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a` |
| `context-notes/cli-architecture-review-testing-findings` | `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9` |
| `context-notes/cli-architecture-review-design-reliability-findings` | `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5` |
| `context-notes/cli-architecture-review-security-cross-review` | `sha256:47cd166a7a40789698885e4d5d9abb999e1ba7710bd5ed964a230edb77974ae2` |
| `context-notes/cli-architecture-review-testing-cross-review` | `sha256:9694f58e303a6d350cc98477da81ba625e4b21e132b506e5e8fb32cf5c524c59` |
| `context-notes/cli-architecture-review-skeptic-cross-review` | `sha256:b87dac9c69d0dd613c083f1b9de00f059987147335f236ef1eee5f5fdb191bbe` |
| `plans/cli-architecture-review` | `sha256:f4f5e6f11f044b17e9f060f5a45ad040b318fd18418a2daf36cd9355fcab198a` |
| `tasks/cli-architecture-review` | `sha256:283b6d9990c85bf0b88d757a830a45bdb9e946ff164f29e25ddb592ab041ed77` |

[uses approved template](architecture-review-template.md)

[template approval](architecture-review-template-approval.md)

[target freeze](../context-notes/cli-architecture-review-target-freeze.md)

[empirical evidence](../context-notes/cli-architecture-review-empirical-evidence.md)

[security findings](../context-notes/cli-architecture-review-security-findings.md)

[testing findings](../context-notes/cli-architecture-review-testing-findings.md)

[design and reliability findings](../context-notes/cli-architecture-review-design-reliability-findings.md)

[security cross-review](../context-notes/cli-architecture-review-security-cross-review.md)

[testing cross-review](../context-notes/cli-architecture-review-testing-cross-review.md)

[skeptic cross-review](../context-notes/cli-architecture-review-skeptic-cross-review.md)

[review plan](../plans/cli-architecture-review.md)

[review task](../tasks/cli-architecture-review.md)
