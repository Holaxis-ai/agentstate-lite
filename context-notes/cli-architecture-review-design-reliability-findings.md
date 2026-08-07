---
type: Context Note
title: 'CLI architecture review: design and reliability findings'
description: >-
  Static architecture, reliability, operability, resource-bound,
  maintainability, and simplification findings at exact source 81b3c39; includes
  one redacted private-route marker.
actor: architecture-skeptic
timestamp: '2026-08-07T14:36:22.949Z'
---
# Summary

Read-only design, reliability, fault-tolerance, operability, maintainability, performance/resource-bound, and simplification review completed against exact clean source revision `81b3c39ff252013e318b1a714b63430a24074d70` and built artifact SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583` (4,559,755 bytes). This applies approved architecture-review template v1.0 `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09` and domain model v1.0 `sha256:061758d30ed7cb406f4e48157470e742d48ec0a79aaced5fdf05b599e9f1c231`.

The package has a sound high-level dependency direction: the CLI is an adapter over core storage/domain semantics, board-git owns Git mechanics, and server/UI/MCP packages own their runtimes. Cross-cutting error, output, mutation, sync-outcome, invocation, and build policies are mostly centralized. A TypeScript-AST runtime-import pass found 86 source files, 368 explicit local runtime edges, no runtime strongly connected component, and no dynamic import in `packages/cli/src`.

Five public E1 candidate findings remain for cross-review: create-only's post-CAS verifier suppresses observation and rollback errors; command arity is independently and incompletely enforced; top-level command metadata has several authorities; `ui --open` does not absorb asynchronous launcher failure; and the personal catalog has no application-level enumeration/concurrency/output bound. No tests, runtime probes, build, package install, source edits, or Git mutations were performed by this specialist.

`PRIVATE_ROUTE_REQUIRED: destructive remote retry/version binding invariant`

# Review frame

- Target: `packages/cli` source/tests/build/scripts/metadata/references/artifact boundary, plus consumed package contracts where the CLI adapter depends on them.
- Revision: `81b3c39ff252013e318b1a714b63430a24074d70` (clean at final static check).
- Profiles: CLI/process, stateful, concurrent/distributed, security-sensitive local host, published package/plugin, and local UI/server. Pure-library-only checks are not applicable to the package as a whole.
- Ultimate goal: provide visible, conflict-safe, local-first shared memory through a Markdown knowledge bundle and agent-oriented CLI.
- Proximate goal: identify architectural causes that could make the CLI silently do the wrong work, fail open, hang, or drift, while preserving its strong ownership boundaries. This serves the ultimate goal by protecting the trustworthiness of the adapter agents invoke.
- Evidence: E1 static source, test, metadata, artifact-identity, and bounded graph evidence. Historical claims were not promoted without exact-revision support.

# System map

| Capability | Owning authority | `packages/cli` responsibility | Main failure boundary |
| --- | --- | --- | --- |
| Process entry and top-level dispatch | `src/index.ts`, `src/cli.ts`, `src/reference.ts` | executable identity, argv routing, command registration, help/home projections | grammar drift, wrong dispatch, channel/exit mismatch |
| Shared CLI policy | `args.ts`, `errors.ts`, `output.ts`, `invocation.ts`, `actor.ts` | translate parser/domain faults, stable exits/envelopes, executable-correct hints | classification or projection drift |
| Bundle selection and remote activation | `bundle.ts`, `config.ts`, `credentials.ts` | explicit remote activation, local precedence, project binding, credential lookup | ambiguous selection, transport failure, unsafe target identity |
| OKF reads and writes | `@agentstate-lite/core`; CLI commands and `mutate.ts` adapt | parse flags, shape candidate, call core query/mutation/CAS, render receipt | typed domain conflict, malformed stored state, partial local I/O |
| Board sharing | `@agentstate-lite/board-git`; CLI `commands/sync/*`, `sync-outcomes.ts`, `cursor.ts` compose | phase orchestration, public outcome vocabulary, partial-success receipts | Git topology, locks, network, conflicts, post-commit failure |
| Reference server, UI, Views, MCP | server/UI/View/MCP packages; CLI launchers and `src/ui/*` adapt | configure, boot, print capability receipt, wait, close | socket boot, signal/lifecycle, proxy/credential boundary |
| Recipes and installable distribution | `recipe-parser.ts`, source adapters, `recipes.ts`, `skill-render.ts`, `distribution-resources.ts` | acquire/validate/apply portable definitions and project skill/reference projections | unsafe traversal, schema drift, partial apply, projection drift |
| Build and release artifact | `build.mjs`, `scripts/build-bundle.mjs`, preparation and verification scripts | deterministic self-contained executable, generated-input agreement, release identity | stale generated input, dirty/unknown source, tarball leakage |
| Passive orientation | `home.ts`, `session-start.ts`, `update-check.ts`, `update-orientation.ts`, `autopull.ts` | bounded/fail-soft orientation and cache projection | delayed dependency, stale cache, leaked background work |

# Dependency authority summary

- Runtime direction is consistently inward from CLI adapters to `@agentstate-lite/core`, `@agentstate-lite/board-git`, server/UI/View/MCP runtimes, and Node APIs. A bounded search found no source import from those consumed packages back into the CLI.
- The highest runtime fan-in modules are the expected policy seams: `errors.ts` (44), `invocation.ts` (44), `output.ts` (35), `args.ts` (31), and `bundle.ts` (31). Fan-in alone is not treated as a defect; these modules own cross-command policy.
- `mutate.ts` delegates read/decide/CAS/retry semantics to core's document mutation service and owns CLI wording/hooks only. `sync/orchestrate.ts` composes board-git primitives; `sync-outcomes.ts` owns enumerable CLI refusal/guidance copy. These are healthy dependency-inversion examples.
- The build aliases workspace source into one ESM artifact and keeps one esbuild configuration. Release verification inspects an exact tarball allowlist, runtime dependency absence, isolated installation, both binaries, and retained-artifact identity.
- `bundle.ts` now contains local discovery, remote transport construction, project binding, and create-only lifecycle policy. Its size is only a signal, but DR-01 shows that the create-only rollback/verification responsibility has distinct invariants worth extracting into a testable owner.

# Representative change traces

## Routine document mutation

`cli.ts` dispatch -> command-specific parser -> `resolveRemoteFlag`/`openBundle` -> core kind registry -> `mutateDoc` -> core read/decide/CAS retry -> best-effort board attribution -> `render`; any typed or unexpected fault converges on `classifyBundleError`/`toExit`. This is a strong trace: mutation semantics remain in core and presentation remains in CLI.

## Cross-cutting top-level command addition

Implementation/import -> `KNOWN_COMMANDS` -> `runAxiCli.commands` -> `COMMAND_GROUPS` -> `SKILL_COMMAND_RESOURCES`/generated skill checks -> command-specific help/tests. The same public capability is represented in multiple lists, with aliases/private handlers handled as comments and exceptions. DR-03 owns this change-amplification/drift risk.

## Sync failure-policy change

board-git typed outcome/factory -> `commands/sync/orchestrate.ts` phase -> `sync-outcomes.ts` row -> `errors.ts` code-to-exit -> receipt or handled partial envelope -> fixture/agreement tests. This is a strong trace: mechanics, public taxonomy, and rendering are separate authorities joined by explicit adapters.

## Create-only onboarding change

recipe resolution -> target preflight -> directory claim -> core expect-absent bundle CAS -> bidirectional post-CAS isolation verification/rollback -> recipe apply -> receipt. The trace is explicit and well documented, but DR-01 identifies observation and compensation branches that do not uphold the stated fail-closed verdict.

## Distribution change

source/reference inventory -> generated skill/UI inputs -> shared esbuild configuration -> `dist/agentstate-lite.mjs` or controlled plugin writer -> exact tarball/package verifier. The authority chain is strong and prevents ordinary local builds from dirtying the committed plugin artifact.

# Failure models

| Failure model | Existing control | Residual review result |
| --- | --- | --- |
| Concurrent document writers | core versioned reads, expect-absent and compare-and-swap writes, bounded re-derivation | strong; no CLI reimplementation found |
| Cross-process filesystem writers | core per-target runtime locks with typed failure | strong statically; security specialist owns containment review |
| Concurrent parent/child create-only | preflight, claim, expect-absent CAS, post-CAS up/down verification, own-write rollback | DR-01: read and cleanup errors are suppressed, so the verdict can be false |
| Git partial success | phase decomposition, typed board-git errors, partial receipts, awareness/cache refresh | strong; default-path empirical gates remain with root reviewer |
| Remote transport boundary | retries, pagination, typed HTTP errors | private/security routing required; no public detail added here |
| Long-running listener lifecycle | boot error mapping, readiness receipt, signal waiter, close | DR-04 for auxiliary launcher; testing reviewer separately flags real signal boundary |
| Passive update/network work | total timeout, response byte cap, abort, lease/token authority, detached-child error listener | strong and provides a useful counter-pattern for DR-04 |
| Large enumerations | output caps on list/status/history/blobs, prefix push-down, batch reads | presentation is generally bounded; DR-05 is a local catalog exception; whole-bundle analysis remains explicit |

# Candidate findings

## DR-01 — Create-only isolation verification can fail open and overstate rollback

- Category: reliability, fault tolerance, state integrity, maintainability.
- Severity: Medium.
- Confidence: High for the mechanism; Medium for default-environment frequency.
- Priority: Now, before merging the create-only feature.
- Evidence grade: E1.
- Locations: `packages/cli/src/bundle.ts:548-617`, especially `:587-600` and `:602-616`; caller at `packages/cli/src/commands/init.ts:136-175`; success-race tests at `packages/cli/test/init-create-only.test.ts:456-554`.
- Owner/invariant: the create-only isolation owner must return success only after complete observation, and a losing run may claim “nothing remains” only after confirming removal of its exact committed bundle identity.
- Causal trace: this run commits its `index.md` -> descendant scan maps every `readdir` rejection to an empty directory and the shared `exists` helper maps every stat rejection to absence -> a concurrent nested bundle or unreadable subtree can be missed -> verification returns success; alternatively, a conflict is detected -> unlink of this run's `index.md` rejects -> rejection is swallowed -> the command still throws an envelope stating rollback completed and nothing remains.
- Impact: the safety boundary can leave or bless the nested-bundle state it exists to prevent, and its diagnostic can instruct the caller from a false cleanup premise. This is a state-integrity and operability defect, not merely missing logging.
- Counterevidence: the target was empty/fresh at claim; the normal same-user race suite tests both directions and conventional-folder shapes; the rollback targets the file this run won through expect-absent CAS; permission/I/O faults during the narrow verification window are uncommon.
- Recommendation: give create-only verification a dedicated filesystem/identity owner. Treat only proven disappearance as absence; propagate observation failures as a typed fail-closed result. Bind compensation to the exact committed identity, check its result, and emit explicit partial-state/cleanup guidance when compensation cannot complete. Make the descendant walk iterative and budgeted rather than recursive/unbounded.
- Validation: deterministic injected filesystem seams for descendant `readdir`/stat failure, target replacement, unlink failure, and concurrent content at every await boundary; assert no success on incomplete observation and no “nothing remains” claim unless exact cleanup is verified. Retain the live parent/child process battery.

## DR-02 — Command arity is independently enforced and many handlers silently ignore extra input

- Category: correctness, interface design, SOLID/authority, operability, maintainability.
- Severity: Medium.
- Confidence: High.
- Priority: Now or Next.
- Evidence grade: E1.
- Locations: shared parser wrapper `packages/cli/src/args.ts:1-74`; representative ignored-arity handlers `commands/init.ts:75-97`, `commands/list.ts:95-119`, `commands/serve.ts:79-97`, `commands/sync/orchestrate.ts:309-394`; single-target examples `commands/doc/write.ts:43-61`, `commands/doc/read.ts:55-73`, `commands/promote.ts:111-130`. Bounded inventory found eleven zero-positional commands with `allowPositionals: true` and no `positionals` reference: blobs, home, init, kinds, list, recipes, serve, session-start, status, sync, and ui.
- Owner/invariant: each public command grammar must reject tokens outside its declared arity before any read, write, boot, commit, pull, or push.
- Causal trace: every command independently opts into `allowPositionals: true` -> some read only required positions and many inspect none -> extra caller tokens survive parsing -> handler executes the recognized operation while silently discarding the rest -> exit 0 and a plausible receipt validate work other than the caller's full expression.
- Impact: typos become false success. The risk is material on mutating/process commands: an invocation shaped like `init <mistaken-token>` can initialize the default target, and `sync <mistaken-token>` can enter commit/pull/push orchestration.
- Counterevidence: commands with complex subcommands often perform their own exact checks; unknown options and missing option values are centrally classified; usage strings document the grammar; several commands (`delete`, `pull`, `version`, `mcp`, `new`, `doc update`) do reject extras.
- Recommendation: introduce one arity-aware parse result/command-schema helper that specifies exact, minimum, or ranged positional counts and rejects before side effects. Use `allowPositionals: false` for zero-positional commands. Make top-level registry metadata and arity agreement-testable rather than relying on each handler's instinct.
- Validation: a table over every public command/subcommand that appends a sentinel positional and asserts USAGE/exit 2/no side effect; include built-artifact probes for `init`, `sync`, `serve`, and a document mutation.

## DR-03 — Top-level command identity has multiple authorities despite single-source claims

- Category: maintainability, modularity, change amplification, documentation/distribution drift.
- Severity: Low.
- Confidence: High.
- Priority: Planned.
- Evidence grade: E1.
- Locations: `packages/cli/src/cli.ts:55-83` (`KNOWN_COMMANDS`), `:260-304` (runtime handler registry), `packages/cli/src/reference.ts:1-45` and `:45-226` (`COMMAND_GROUPS`), `packages/cli/src/distribution-resources.ts:113-157` (`SKILL_COMMAND_RESOURCES`); representative per-feature checks in `packages/cli/test/delete.test.ts:245-249`, `version.test.ts:50-60`, and `skill-distribution.test.ts:99-116`.
- Owner/invariant: a public command's dispatchability, leading-flag recognition, help visibility, and distribution-resource declaration must derive from one typed capability identity or be covered by an exhaustive agreement.
- Causal trace: adding/renaming a verb requires edits to implementation imports, `KNOWN_COMMANDS`, runtime handlers, `COMMAND_GROUPS`, and resource metadata -> current tests compare selected pairs or resource metadata only to `COMMAND_GROUPS` -> a missed edit can leave a command dispatchable but undiscoverable, advertised but not registered, or rejected by leading-global-flag hoisting.
- Impact: latent release and onboarding drift; review and test burden grows with every verb. No current user-visible drift was established after accounting for deliberate `query`, `home`, `update`, and private-worker exceptions.
- Counterevidence: deliberate exceptions are documented; help/home share `COMMAND_GROUPS`; skill-resource coverage is exhaustive in both directions against that table; command-specific tests frequently assert registration plus reference presence.
- Recommendation: define typed command descriptors with visibility/alias/private classifications and derive known-command recognition, runtime registration keys, and public reference names where practical. If handler imports must remain separate to preserve the pure reference layer, add one exhaustive agreement test with explicit exception metadata rather than repeated feature-local assertions.
- Validation: mechanically compare descriptor/handler/public-help/resource sets in both directions; mutation proof removes one representation and requires the agreement gate to fail.

## DR-04 — `ui --open` can turn a best-effort launcher failure into process termination

- Category: reliability, portability, lifecycle.
- Severity: Low.
- Confidence: High.
- Priority: Next.
- Evidence grade: E1.
- Locations: `packages/cli/src/commands/ui.ts:77-86` and call at `:253`; injected happy-path test `packages/cli/test/ui.test.ts:130-188`; correct detached-child error pattern at `packages/cli/src/update-orientation.ts:884-893`.
- Owner/invariant: opening a browser is an optional auxiliary action; failure must not terminate or change the lifecycle of the already-listening primary UI service.
- Causal trace: `spawn` returns a `ChildProcess` before an executable-resolution failure is delivered -> synchronous `try/catch` completes -> the child emits asynchronous `error` with no listener -> Node treats the unhandled child-process error as fatal -> the foreground UI dies despite its printed-URL fallback contract.
- Impact: `ui --open` can fail on a minimal/headless Linux installation without `xdg-open`, terminating the server after readiness and leaving a stale (dead-token) URL file. The ordinary invocation without `--open` is unaffected.
- Counterevidence: synchronous launch failures are caught; standard desktop installations usually provide the opener; the URL is printed before launch; the flag is explicit and optional.
- Recommendation: retain the child, attach a one-shot no-throw `error` listener before `unref`, and keep the action observably best-effort. Reuse the detached-child pattern already present in update orientation.
- Validation: inject or isolate a missing launcher, assert no uncaught exception, continued listener availability until explicit shutdown, and normal URL-file cleanup.

## DR-05 — Personal catalog list work and output have no application-level bound

- Category: performance, resource bounds, operability.
- Severity: Low.
- Confidence: High for the mechanism; Medium for material scale.
- Priority: Planned.
- Evidence grade: E1.
- Locations: `packages/cli/src/catalog.ts:129-181`, `:317-350`, `:372-379`; `packages/cli/src/commands/catalog.ts:130-151`; containment in `packages/cli/src/commands/home.ts:338-343` and `:869-918`.
- Owner/invariant: an agent-facing enumeration of user-grown state should have an explicit result bound and bounded concurrency, with total versus shown made visible.
- Causal trace: explicit `catalog add` can grow the catalog without a count ceiling -> `catalog list` reads/parses the entire file -> `Promise.all` probes every locator concurrently -> the command renders every entry and has no `--limit` -> memory, filesystem concurrency, latency, and stdout grow directly with user-managed entry count.
- Impact: local self-denial or noisy agent output for an unusually large/corruptly amplified personal catalog; no remote attacker or ordinary bundle content can enroll entries implicitly.
- Counterevidence: enrollment is explicit, labels are length-bounded, duplicates are rejected, locator probes are local filesystem operations, and the default home view reads only labels behind a 500 ms abort budget and display cap. A personal catalog is expected to be small.
- Recommendation: add `--limit`/`shown`/`count`, cap availability-probe concurrency, and consider a documented maximum file/entry envelope at parse/mutation time. Keep exact-one `resolve` unchanged.
- Validation: generate a large valid catalog in an isolated home, instrument peak in-flight probes and bytes/rows rendered, and assert deterministic truncation plus total count.

# Strengths to preserve

1. Dependency direction is clear and acyclic at the inspected explicit-runtime-import layer. Domain parsing/storage/CAS remain in core; Git mechanics remain in board-git; CLI code is predominantly orchestration and projection.
2. `errors.ts` is a genuine typed boundary with one code-to-exit table, structural board-git classification, remote/status-aware mapping, and channel-aware handled errors.
3. `mutate.ts` and core `mutateDocument` provide fresh-read re-derivation and bounded CAS retry rather than stale candidate replay.
4. Sync is decomposed into named phases and a single outcome vocabulary, with explicit partial-success behavior after commits and pushes.
5. Update checking is unusually well bounded: total timeout, byte cap, redirect policy, stream cancellation, atomic cache writes, and token-owned detached work.
6. Session-start's default Git work consumes a remaining budget per process operation, and the 10-second hook envelope is explicit. The testing specialist's cancellation-interface concern remains valid, but default-path boundedness is meaningful counterevidence.
7. Catalog and credential writes use exclusive/atomic temp files, restrictive permissions, and token-owned release; catalog mutations are lock-serialized.
8. Build/release authority is strong: one bundle configuration, generated-input preparation, exact build identity, clean-source requirement for npm artifacts, and isolated package verification.
9. Runtime reachability and cycle evidence is healthy: 82 of 86 source files are runtime-reachable from `src/index.ts`; the four excluded files are a build-time skill renderer/inventory, a declaration-only integration file, and a test-facing historical sync facade.

# Negative claim audit

| Claim class | Bounded negative evidence | Result and limit |
| --- | --- | --- |
| Runtime import cycles | TypeScript AST classified type-only versus runtime import/export edges across 86 source files; 368 local runtime edges; no SCC; no dynamic import in `src` | no cycle found in explicit source runtime graph; bundled dependency internals and runtime reflection are outside this claim |
| Reverse dependency | searched consumed package sources for CLI package/source imports | no reverse source import found; semantic duplication is assessed separately |
| Material dead production module | runtime reachability from `src/index.ts` plus bounded reference search | none established; four non-runtime files have build/test/type roles; symbol-level dead exports were not exhaustively proven absent |
| Unbounded externally controlled work | searched fetch, response parsing, paging, recursion, `Promise.all`, file reads, timeouts and aborts | package-wide boundedness is not claimed; private routing and DR-05 apply; update-check/UI watcher are positive counterexamples |
| Swallowed critical error | reviewed broad catches in target creation, mutation hooks, listener boot, update/cache, catalog, sync and UI launcher paths | package-wide safety is not claimed; DR-01 and DR-04 were promoted; many remaining catches are explicitly best-effort or classification boundaries |
| Command/help/handler agreement | compared `KNOWN_COMMANDS`, runtime registry, `COMMAND_GROUPS`, skill resource mapping and representative tests | no present public drift established after explicit exceptions; DR-03 records latent authority duplication |
| Transaction/concurrency safety | traced core mutation CAS, filesystem locks, catalog lock, create-only phases, sync partial-success handling | no blanket guarantee; DR-01 and private route remain; ordinary document mutation is strong |
| Release artifact cleanliness | inspected scripts, package metadata, frozen artifact identity and verification program | E1 design evidence only; this specialist did not execute build/package gates |

# Refutations and candidates not promoted

- Runtime-cycle hypothesis refuted: a text-only import graph reported recipe and establish cycles, but every apparent back-edge was `import type`. The corrected TypeScript-AST runtime graph contains no cycle.
- Credential lost-update hypothesis not promoted at this revision: `saveApiKeyForOrigin` is a read-modify-write without a lock, but bounded reachability found no production caller in `packages/cli/src`; only tests/provisioning-shaped code invoke it. Treat it as a future-writer design constraint, not a present CLI defect.
- High fan-in and large files were not converted into findings. `errors.ts`, `invocation.ts`, `output.ts`, `args.ts`, and `bundle.ts` are expected shared adapters; line count alone supplies no causal impact.
- The duplicated `mapBootError` helpers in `serve.ts` and `ui.ts` are small and carry command-specific remediation. No drift or behavior defect was established; abstraction would not yet pay for itself.
- `commands/sync-establish.ts` is not runtime-reachable from the executable and is not shipped as a library surface, but current tests deliberately use it as a historical facade. It is a minor simplification opportunity, not material dead code.
- Status's full-bundle work was not promoted as a performance defect: the command explicitly advertises batch analysis, uses one query and derived in-memory passes, and caps each finding category's output. Empirical bundle-scale profiling remains useful.
- The testing specialist's TST-CLI-01 proves the outer session-start race lacks a cancellation contract. Skeptical severity is Low pending empirical evidence because the default Git implementation independently budgets each process call and local tail work is bounded; elevate only if root observes late mutation, an open handle, or process-exit delay after render.

# Not assessed

- Empirical behavior, test pass/fail, branch coverage, mutation survivors, package installation, Node 20/22/26 execution, and runtime performance at this exact revision.
- Private security details beyond the routing marker above.
- Physical-filesystem containment and confidential remote credential transport, owned by the security specialist/private process.
- Browser rendering, accessibility, semantic UI behavior, and production reverse-proxy behavior.
- Correctness of external package internals except where a CLI adapter contract was directly traced.
- Windows/macOS filesystem and launcher behavior beyond static platform branches.
- Exhaustive symbol-level dead-code analysis across test-only exports and tree-shaken bundled dependencies.

# Dissent and cross-review challenges

- Do not merge DR-01 into a generic “race tests are strong” statement. The finding is about incomplete observation and unverified compensation, which normal successful races do not exercise.
- Do not lower DR-02 to documentation polish: silent ignored input precedes mutating `init` and Git `sync` actions. Conversely, do not call it data loss without an empirical misoperation; Medium is calibrated to false-success/wrong-action risk.
- DR-03 is latent architecture debt, not a current outage. Its acceptance criterion is an exhaustive authority agreement, not necessarily one giant registry that creates import cycles.
- DR-05 should remain Low unless an expected catalog scale or empirical profile shows material latency/memory. The home path already contains the common-case blast radius.
- Preserve the testing specialist's TST-CLI-02 real-signal probe as a validation request. Static source makes signal wiring plausible but does not prove the shipped process drains and releases its port.
- Any private-route issue must not be diluted into public prose or folded into a generic recommendation before disclosure triage.

# Confidence

- High: target identity, import direction/cycles, exact static mechanisms in DR-01 through DR-05, central authority/trace descriptions, and existing-test counterevidence.
- Medium: practical frequency and severity of filesystem-fault windows, very large personal catalogs, and default-platform launcher absence.
- Low/not claimed: exact runtime incidence, performance thresholds, package-gate status, or exploitability; those require root empirical/private review.

# Requested validation and handoff

1. Privately triage the routing marker already sent directly to the orchestrator; keep technical content out of public bundle docs until the disclosure decision.
2. Add or run deterministic create-only observation/rollback-failure probes before merge; verify truthful partial-state reporting.
3. Run a built-artifact arity table, prioritizing `init`, `sync`, `serve`, and document mutations, with no-side-effect oracles.
4. Probe `ui --open` with an unavailable platform opener and send SIGTERM to built `ui`/`serve` processes after readiness.
5. If catalog scale matters, profile a large isolated catalog and set an explicit supported envelope.
6. Have the cross-reviewer reconcile DR-01 with the security specialist's target-identity/rollback concern and TST-CLI-01/TST-CLI-02 with the testing specialist's evidence.

# Notes

- The initial text-only graph over-counted type-only edges; the corrected compiler-AST pass is the evidence used here.
- Two ad hoc read-only graph scripts had wrapper syntax/callback mistakes before successful execution. They inspected no repository state before failing and caused no writes; their failures are not architectural evidence.
- All bundle writes for this phase use `./aslite`; no legacy task/knowledge system was used.
- The assigned task intentionally remains `in_progress` for orchestrator aggregation, cross-review, empirical validation, and private triage.
