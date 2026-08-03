---
type: Context Note
title: Revision 3 T3.5 candidate acceptance plan skeptic re-review
actor: codex-precompact-v3-t35-skeptic
timestamp: '2026-08-03T21:40:11.128Z'
---
# Summary

**FAIL** — adversarial re-review of `plans/precompact-v3-t35-candidate-acceptance` at exact version `sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0`. Confidence: **0.98**.

The revised Plan is a major advance. It concretely closes most of the first review's static candidate-integrity gaps: an out-of-band reviewed SHA, one-build/one-pack transaction, non-circular manifest plus sidecar, exact allowlisted tree and modes, factored existing-package verification, pre/post candidate and host checks, a closed R0/Q0/L0-L3 case graph, stage attestations, isolated global state, privacy scans, and explicit red-first dependencies. The candidate manifest itself is no longer the weak link.

Four load-bearing contracts are still not executable as written. Most importantly, the proposed SessionStart fault is a race between parallel hooks with no observable “managed PreCompact completed read-back” boundary. The Plan also defers proof of exact-host exec-form and sibling-wait behavior until after all T3.5 implementation, despite the calibration lesson that the rail must be proved invocable first. In addition, an R0 PASS file is not challenge-bound, auth cannot reach only the final Claude process through tmux by the described means, crash cleanup has no recovery owner, and the claimed real-npm descendant command graph has no observation mechanism.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether this exact T3.5 Plan can produce a replay-resistant, privacy-safe chain over one reviewed candidate without hidden timing or operator conventions; this serves the ultimate goal by preventing acceptance infrastructure from certifying evidence it could not have observed.

Reviewed evidence:

- this exact revised Plan;
- both incorporated FAIL reviews: `context-notes/precompact-v3-t35-plan-accept@sha256:e0bcd0091f6cc39b412b20a8cf4ea94bf4a20d2b822aea450997eed6316c7278` and `context-notes/precompact-v3-t35-plan-skeptic@sha256:552830be73f9e9a9cec0b949874e9c211efe248d7ebecbb7442860c0b4524dcd`;
- accepted design `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`;
- accepted implementation plan `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`;
- current orientation `context-notes/precompact-v3-orientation@sha256:27a888993183defc49e11990b9e0a96b6a4979300ec21f23aeae102f51ced151` and installed-host probe;
- read-only repository state at clean HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`, with `origin/main` an ancestor;
- current `scripts/verify-npm-package.mjs`, T0 live skeleton/support tests, and five-event installer/readiness code; and
- the current official Claude Code hook and environment references. Those current docs describe command-hook exec form (`command` plus `args`) and matching hooks running in parallel, but they are not version-locked evidence that the pinned `2.1.220` artifact implements every behavior this Plan now relies on.

No repository file was changed and no Claude process was run.

# Closure audit of the six prior blocker families

| Prior family | Re-review result | Reason |
|---|---|---|
| Reviewed-SHA transactional freeze | **PARTIAL** | Exact reviewed SHA, before/after source facts, sidecar-last publication, one build/pack, and invalid partial roots are specified. “Previously used” cannot be proved for a caller-created empty root; require the target path to be absent and let `freeze` atomically create it. |
| Factored existing-package verifier | **PARTIAL** | Fresh isolated offline install, exact Node/npm, pack contract, alias/helper identity, and no source fallback are specified. The asserted complete real descendant argv graph has no named enforcement or observation mechanism. |
| Filesystem/manifest immutability | **PASS within the stated same-user drift-detection model** | The manifest is non-circular; sidecar semantics, normalized relative paths, owner/type/nlink checks, exact allowlist, and final modes are coherent. On this host `/`, `/private`, and sticky `/private/tmp` satisfy the proposed ancestor shape, and 0500 directories with 0400/0500 files are feasible. Later gates correctly rehash because mode sealing is not cryptographic immutability against the owning uid. |
| Pre/post artifact and host drift | **PASS, subject to ordinary same-user TOCTOU limits** | Candidate, helper, harness, manifest, Claude, Node, npm, tmux, and git are rechecked before and after verification and again before final PASS. The Plan does not overclaim protection from an actively malicious same-uid mutator between the last check and rename. |
| Replay-resistant R0-Q0-L0-L3 chain | **FAIL** | The case/predecessor graph is now complete, but the human R0 finding is not required to bind the fresh attempt/challenge/manifest/source, and “previously opened attempt” uniqueness has no cross-root authority. |
| Auth/global/privacy | **FAIL** | The protected set and leak scans are much stronger, but the auth-to-tmux transfer claim is internally inconsistent and a crashed runner can leave a tmux server holding auth with no idempotent recovery owner. |

# Blocking findings and required repairs

## 1. The exact-host observer/fault rail is still unproved, and the SessionStart fault has an unsolved parallel race

The Plan chooses foreign observer hooks and correctly says matching hooks run in parallel. It then claims that the `L0_SESSIONSTART_CONTINUE_FALSE` fault handler can run alongside managed PreCompact, wait for the candidate-managed generation, corrupt it **after prepare read-back**, and return before the host advances.

Generation existence is not an observable read-back-complete marker. The production authority writes the generation and only then performs its mandatory read-back and validation. A sibling handler that detects the new generation can corrupt it in the interval between those operations. The managed PreCompact hook may then read corrupt bytes and block PreCompact. That does not exercise the required journey “successful PreCompact followed by corrupt compact SessionStart returning `continue:false`.” Waiting for all siblings only establishes a join before the next host event; it creates no order between the managed hook's internal read-back and the fault mutation. Fixed sleeps make the race likely, not deterministic.

The accepted installed-host probe proved a single SessionStart delay and the five-event sequence. It did not prove on exact `2.1.220` that:

- project hooks with `command` plus `args` use no shell;
- multiple same-event foreign/managed handlers each receive complete stdin;
- the host waits for every synchronous sibling before the next lifecycle event;
- debug output exposes a stable, machine-detectable managed-hook-completion boundary while a sibling remains running; or
- the proposed tmux invocation and observer configuration survive the exact isolated settings hierarchy.

Current documentation is not a substitute for an exact-artifact probe. This is the same class of mistake that caused the original delivery rail to fail: the load-bearing mechanism is postponed until after the components are built.

Repair:

1. Add a pre-implementation `P35H` exact-host capability gate before F0. In a disposable config/project, with no candidate or production behavior change, prove exec-form argv, independent stdin, sibling parallelism plus join, debug visibility, and the chosen tmux action path on the manifest-pinned `2.1.220` tuple. Persist a content-free exact-host probe note/fixture. Inability to run it is `BLOCKED_PENDING_VERIFICATION`, not Plan PASS.
2. Name an actual synchronization signal that occurs strictly after managed PreCompact exits successfully but before the fault sibling returns. If the exact host debug log provides that signal, define the exact line/event schema and prove it in P35H; the fault handler may then corrupt the lane generation while keeping the host joined. If no such signal exists, replace this sibling-fault design. Do not add a production helper receipt channel under T3.5 without returning to T3 review.
3. Red-test adversarial schedules: fault observes generation before read-back, managed hook stalls after write, observer finishes first/last, debug line is delayed/duplicated, fault times out, and managed PreCompact fails. Only the strictly ordered successful-PreCompact/corrupt-SessionStart journey may satisfy this case.

## 2. R0 can replay a stale human PASS under a fresh stage attestation

The stage envelope binds attempt id, runner challenge digest, manifest, source, and predecessor. The R0 “structured reviewer finding file,” however, merely *may* carry file/line evidence and PASS/FAIL. It is not required to contain or prove the current attempt id, raw challenge response/digest, manifest digest, source SHA, exact installed-prefix inventory, or reviewer identity. A stale `PASS` findings file can therefore be supplied to a new `stage finalize`; the runner will hash that stale file and create a fresh outer attestation containing the new challenge. The outer binding does not retroactively bind the human assertion.

Likewise, “a finalized or previously opened attempt cannot be reused” is not enforceable across fresh lane roots without a durable attempt registry. Per-lane create-only files reject reuse only inside that lane. Random runner challenges make accidental collision negligible, but the Plan must use that property explicitly rather than claim a global uniqueness authority it has not named.

Repair:

- Define strict `agentstate-lite-handoff-review-finding/v1` and QA finding schemas. Every finding must contain the exact stage/case, attempt id, raw challenge or challenge digest as the chosen protocol requires, manifest digest, source SHA, installed-prefix inventory digest, verdict, closed reason, actor identifier, and bounded finding rows. Unknown/missing keys reject.
- `stage finalize` must validate those semantic bindings before hashing the finding; a stale finding from another attempt, challenge, candidate, source, or prefix must fail red tests.
- State the trust boundary honestly: this proves that a challenge-bound reviewer assertion was submitted, not that the executable can establish human independence. Independent role assignment remains an orchestrator gate unless a reviewer signing key/trust anchor is introduced.
- Either add a private create-only attempt ledger with named owner and atomic semantics, or narrow the uniqueness claim to a lane and rely on a fresh 256-bit runner challenge plus challenge-bound finding to prevent replay. Add same-attempt/different-root and stale-finding/new-challenge red tests.
- Specify sidecar-last atomic publication for stage attestations as well as candidate manifests; an interrupted finalizer may invalidate the attempt and require a new one, but it cannot leave an apparently valid orphan attestation.

## 3. The auth-through-tmux and cleanup contracts are contradictory and incomplete

The Plan says private operation provides one auth environment variable to `stage run`, the runner holds one real auth value in memory, and auth is injected only at the final Claude spawn. It also requires the runner to launch Claude inside a dedicated tmux server without serializing auth in argv, spec, log, or receipt.

As written, no channel connects those statements. If `stage run` receives the secret as an environment variable, the runner already has it in its process environment. If tmux inherits that environment, the tmux server holds it too. If the runner launches a sanitized tmux server, then passing the secret to the eventual pane command requires some additional channel: tmux environment state, an argv/command string, a disk file, inherited descriptor, or private socket. The Plan chooses none. `CLAUDE_CODE_OAUTH_TOKEN` is also not established by the accepted exact-host probe, while the officially documented API-key path can present an interactive approval in fresh config. “The runner owns prompts” is not an executable auth state machine.

The terminal cleanup statement covers a normally running `stage run`, but not runner SIGKILL/crash, tmux client failure after server creation, observer/fault crash, or finalizer interruption. A dedicated server can outlive the runner and retain the auth environment. The Plan has no `cleanup/recover` owner, no socket/PID attestation, and no pre-run sweep. `L0_SESSIONSTART_CONTINUE_FALSE` also says fault transitions are reversible but never says whether the deliberately corrupt lane generation is restored, quarantined, or retained as tainted evidence.

Repair:

- Choose and document one auth transport. The simplest honest contract may allow the acceptance runner, dedicated tmux server, and Claude process to hold the one secret in process memory/environment while prohibiting argv/disk/spec/log/receipt serialization. If the stricter final-Claude-only property is required, design and test a concrete inherited-FD or private-socket broker and its lifecycle.
- Restrict allowed auth modes to ones proved in P35H on exact `2.1.220`; machine-drive every trust/key-approval prompt or classify the lane `AUTH_UNAVAILABLE` before opening an attempt.
- Add a create-only server identity record containing socket hash, server PID/start facts, and owner. Add idempotent `stage cleanup` owned by the executable; `prepare`, `run`, and `finalize` must pre/post-reap only the exact owned server and verify process/socket absence. Never pattern-kill another tmux server.
- Add crash/killpoint red tests after server start, after auth injection, during every PTY action, during observer/fault execution, and during finalize. They must prove no owned server survives, no auth reaches disk/argv/log, protected state is restored, and cleanup can safely repeat.
- Publish a per-fault cleanup table: mutated objects, evidence checkpoint taken before restoration, exact restoration/CAS rule, terminal retained state, and behavior after cleanup failure. If the corrupt lane journal is intentionally disposable rather than restored, stop calling that transition reversible and attest the lane as tainted/closed.

## 4. Two implementation claims still lack enforceable mechanisms: real npm descendant policing and “previously used” roots

The verifier correctly constrains its own command authority to exact Node + exact npm CLI with `--offline --ignore-scripts`, an empty npmrc/cache, a dependency-free package contract, and an existing tarball. Those properties can establish that the acceptance executable issues no build/pack/test command and that package lifecycle scripts cannot run. They do not, by themselves, produce “the complete descendant argv graph” of a real npm process. An injected fake runner can record mocked descendants, but that is not observation of real npm. OS-level tracing or a deliberately instrumented npm execution seam would be required for the literal acceptance claim. No such mechanism is named, and some tracing mechanisms require privileges that are not part of the gate.

Separately, `freeze --candidate-root <root>` requires a caller-created empty root and claims to reject a “previously used” root. Emptiness, owner, prefix, and mode cannot distinguish a freshly created empty directory from one that was used and manually emptied. There is no external root registry.

Repair:

- Define the no-build proof at the enforceable boundary: exact top-level command graph, `--ignore-scripts`, dependency-free tarball, hostile lifecycle-script fixture that remains unexecuted, offline/network canary, no source path/import, and no build output mutation. If literal descendant observation remains required, name a portable tracer/interposition seam and test the real npm process, not only mocks.
- Make the candidate target path absent at entry and have `freeze` atomically `mkdir(0700)` the exact validated `/private/tmp/aslite-precompact-v3-candidate.<random>` leaf. Existing paths reject before build. This makes “new” observable and removes the impossible previously-used-empty test. Preserve the partial-root/new-attempt rule.

# Red-first graph required before implementation

The existing F0/F1 -> V0/V1 -> A0/A1 -> H0/H1 graph is structurally correct once repaired. Add these dependencies:

1. **P35H exact-host primitive probe** must PASS/BLOCK before F0; fake-host tests cannot replace it.
2. **F0** includes absent-root atomic creation and removes the impossible caller-created “previously used empty” oracle.
3. **V0** distinguishes enforceable top-level/no-script/no-network proofs from any real descendant tracer and includes hostile package-script fixtures.
4. **A0** lands stale-R0-finding/new-challenge, same-attempt/different-root, interrupted attestation publication, and trust-boundary tests red before A1.
5. **H0** lands adversarial sibling schedules, exact managed-exit synchronization, tmux/auth transport, owned-server crash recovery, and per-fault cleanup red before H1.
6. **R35** inspects the real auth/tmux/process path and repeats the exact-host primitive smoke on the reviewed SHA before G0. This does not run the candidate lifecycle or change production behavior; it verifies that the acceptance rail can invoke its own mechanism.

No repair above requires a production `packages/cli/src/**` behavior change. If the only solution to the fault ordering is a production helper side channel, the Plan's own stop rule applies and T3 must be reopened with tests and exact-SHA review.

# What survives skepticism

- The candidate manifest is non-circular: it covers tarball/helper/copied-harness facts, omits its own digest, and is bound by a canonical sidecar plus out-of-band expected digest.
- Exact tree allowlisting, owner/type/nlink/path checks, 0400/0500 file modes, 0500 final directories, and sidecar-last sealing are coherent on the target host.
- Reviewed-SHA pre/post source proof and one-build/one-pack freeze are correct once `freeze` owns atomic root creation.
- Factoring one existing-package policy out of the current verifier is the correct direction; current verifier behavior can remain green while the candidate path adds no-build/no-source enforcement.
- Re-verification before prepare, immediately before launch, and immediately before PASS closes the original stale-preflight gap for the stated non-malicious same-uid threat model.
- The closed stage/case graph now includes R0, Q0, all L0 cases and aggregate, L1, L2, and L3 with exact predecessor digests.
- Raw evidence can remain private and content-addressed while attestations expose only hashes/counts/booleans/reasons.
- The protected snapshot scope, minimal environments, canaries, and recursive auth/content scans are materially sufficient once auth transport and crash cleanup are made executable.
- The Plan correctly prevents T3.5 from silently changing production lifecycle behavior and makes review a dependency before QA/live gates.

# Verdict

Do not begin F0 from this exact Plan. Preserve the static candidate, verifier, manifest, stage graph, privacy, and red-first work. Repair and independently re-review the exact-host primitive gate and fault synchronization, challenge-bound R0 findings/replay scope, auth/tmux transport plus crash recovery, and the two unenforceable filesystem/process claims. G0 remains blocked.
