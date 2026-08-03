---
type: Context Note
title: Revision 3 T3.5 candidate acceptance Plan R3 skeptic review
actor: codex-precompact-v3-t35-skeptic
timestamp: '2026-08-03T22:10:05.300Z'
---
# Summary

**FAIL** — adversarial re-review of `plans/precompact-v3-t35-candidate-acceptance` at exact version `sha256:45c9862ba1e4a1686bb68d326530fc6f3ae51efa529caa6a3a29b59965c73b0d`. Confidence: **0.97**.

R3 genuinely closes the R2 architectural blockers. The sequential PreCompact wrapper replaces the impossible sibling-ordering claim with a real child-completion boundary; the campaign ledger supplies one-use predecessor state; R0/Q0 assertions are strict and honestly scoped; candidate creation starts from an absent leaf; npm proof no longer overclaims invisible descendants; auth/global drift and the failed host probe are reported truthfully; and the stage graph retains explicit red-first and independent-review gates.

Three implementation contracts remain blocking. First, the campaign lock and tmux reservation are not crash-atomic at the exact moments their owner identity is absent, so the named cleanup authority can itself become unable to recover the sole replay/auth state. Second, the sequential wrapper says it waits for child `exit`, but exit does not prove stdout/stderr EOF; the precise environment and corruption CAS are also not frozen. Third, the verifier's literal “no lifecycle scripts” invariant rejects the current package's intentional `prepublishOnly` script, requiring either an unplanned package-contract change or a narrower install-time-script rule.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether R3 is implementable as a crash-safe, one-use acceptance chain without production behavior change; this serves the ultimate goal by preventing a PASS rail from losing its replay or auth-cleanup authority at an interruption boundary.

Reviewed evidence:

- this exact R3 Plan in full;
- `context-notes/precompact-v3-t35-plan-accept-r2@sha256:0efd106cd1ffcbea3c8596bda056abe413a5e7807704f86760b0aec3cf349fb3`;
- `context-notes/precompact-v3-t35-plan-skeptic-r2@sha256:07c8d03f48a4a620a65fc53e3ecd5f75c8f9b57f579eac2ccb708a3747171a4d`;
- exact host capability note/addendum `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`;
- the retained sanitized fixture at exact SHA-256 `dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`, including its raw-capture caveat;
- current clean implementation worktree at `36c741a8173832d75d61a7ab138b5219c4415c66` and the current package verifier, package manifest, helper adapter, installer/status, and tests; and
- current npm lifecycle documentation for the install-versus-publish script distinction.

No repository file was changed and no Claude or tmux process was invoked.

# Prior-blocker and requested-seam disposition

| Seam | Result | Reason |
|---|---|---|
| Sequential wrapper / no production change | **PARTIAL** | Child process completion is the correct post-read-back seam and uses installed bytes without `packages/cli/src/**` changes. Pipe EOF and exact child environment/CAS semantics remain underspecified. |
| Config CAS/status and tainted cleanup | **PASS** | The Plan captures prior bytes, intentionally requires status unready only during the wrapper substitution, restores by expected-digest CAS, proves ready afterward, and honestly retains the corrupted journal tainted/closed. |
| Campaign lock/history/fsync | **FAIL** | Ledger updates and fsync are strong after lock acquisition, but the `O_EXCL` lock can become visible before a complete owner record exists; dead-owner recovery then has nothing to verify. History/current publication order is not fixed. |
| One-use fanout | **PASS** | Authority-generated ids, root/R0/Q0/six named L0/aggregate/L1-L3 slots, one CAS consumption, and campaign closure on FAIL/BLOCKED prevent stale or duplicate advancement. |
| Strict assertions and actor trust | **PASS with an honest external trust boundary** | Required rows/evidence are challenge-, candidate-, source-, prefix-, and actor-bound. Attestations say only `reviewer_asserted_pass`/`qa_asserted_pass`; semantic truth and non-builder identity remain explicitly orchestration-owned. |
| Absent target / freeze transaction | **PASS** | Atomic creation from an absent validated leaf removes the unobservable reused-empty-root claim; sidecar-last and before/after source facts are sufficient. “Caller-supplied” versus “authority-generated” leaf wording should be reconciled but does not weaken absent-leaf safety. |
| Narrowed npm proof | **PARTIAL** | Top-level argv, offline cache, `--ignore-scripts`, dependency/source/output/network canaries, and no descendant claim are correct. The manifest script invariant is presently impossible as worded. |
| Auth possession and leak scans | **PASS after wording clarification** | R3 honestly allows the operator/runner/owned tmux/Claude environments to possess one API key, bans fallback, and scans persistent/output surfaces. “Environment containing only the named auth value” must mean only auth variable, not literally the only environment entry, because the same section requires relocated HOME/config and compaction controls. |
| Tmux reservation/reaper under SIGKILL | **FAIL** | Reservation before spawn is correct, but a crash before PID/start capture leaves the reaper without the identity tuple it says it must verify; the ledger lock can also block recording cleanup. |
| Protected sentinels before consumption | **PASS** | Structurally unsafe/unreadable sentinels reject before the attempt/consumption CAS. The real npm-cache sentinel is deliberately metadata-bounded and must not be described as a full recursive no-change proof. |
| P35H fixture and capture caveat | **PASS as a gated input** | R3 pins the overall FAIL, `BLOCKED_AUTH`, global drift, isolated primitive component, sanitized fixture digest, and zero-output ambiguity. It forbids inventing missing rows and requires reviewed fixture derivation before H0. The Buffer-wrapper raw file is not used as exact raw-payload provenance. |
| Closed PASS/FAIL/BLOCKED mapping | **PASS** | Pre-attempt invalid inputs create no verdict; pre-event inability uses the closed BLOCKED set; post-PreCompact loss is FAIL; cleanup failures close the campaign and cannot emit a valid advancing sidecar. |
| Red-first / independent review | **PASS** | Every builder depends on a red test unit, R35 is an exact-SHA non-builder dependency before G0, and repairs repeat R35. |

# Blocking findings and required repairs

## 1. The sole campaign lock and tmux reservation each have an unowned SIGKILL window

The ledger is the sole replay authority, so its lock protocol must itself be recoverable at every instruction boundary. R3 says the canonical lock is created with `O_CREAT|O_EXCL`, then validates an owner PID/start tuple, and a dead-owner lock may be recovered only after proving that tuple absent.

Creation makes the lock path visible before the process can write and fsync a complete owner record. SIGKILL or process death in that interval leaves an empty or partial canonical lock. A contender must treat it as held, while `stage cleanup` cannot prove the recorded PID/start tuple absent because there is no valid tuple. This is not merely a liveness nit: the same wedge can occur when the runner is trying to CAS-record a just-spawned auth-bearing tmux server, preventing the cleanup owner from updating the campaign.

The tmux protocol has the analogous gap. The ledger reserves an id/socket, spawns the server, and only afterward queries and records PID/start/binary identity. SIGKILL after spawn but before record leaves an auth-bearing server at a reserved socket, while cleanup says it kills only after verifying the missing PID/start/uid/binary record. “The reservation makes this recoverable” is not an algorithm. Cleanup also cannot record its proof if the lock is stuck in the incomplete-owner state above.

Finally, the Plan says history is create-only/content-addressed and the current ledger is renamed durably, but not which is published first. For a verifier to require complete history after a crash, the ordering must be immutable history blob first, fsync blob and directory, then current pointer/full-ledger rename, directory fsync, and read-back. The reverse order can expose a current revision with no history object. Fail-closed rejection is safe, but it is not the recoverable chain R3 claims unless that disposition is explicit.

Repair:

- Make a complete lock-owner record visible atomically. For example, write/fsync a unique owner file first, then acquire the canonical lock with an atomic same-filesystem `link`/equivalent no-replace operation. A canonical lock must never exist with partial owner bytes. Verify the canonical inode/digest still belongs to the releaser before unlink.
- Define the exact Darwin-compatible liveness identity and dependency. Node built-ins do not expose another arbitrary process's start time directly. Pin the queried mechanism, or use an authority-owned nonce/control-socket handshake whose kernel lifetime closes on process death. Red-test PID reuse, malformed/empty lock, owner death before/after acquisition, and cleanup racing a new owner.
- Define history-before-current ordering and bootstrap revision zero. An orphan immutable history blob is harmless; a current revision without its required history must have an explicit terminal disposition.
- Split tmux recovery into the two states the ledger can actually know: `RESERVED_NO_SERVER_RECORD` and `IDENTIFIED_SERVER`. For the former, define a safe exact-socket nonce/handshake or an explicit private-root rule that permits killing the server at the unforgeable reserved socket without a nonexistent PID record. Do not require facts that cannot yet exist.
- Make server termination possible before acquiring the campaign mutation lock, then CAS-record cleanup after lock recovery. This lets the reaper remove an auth-bearing process even when bookkeeping is wedged.
- Add SIGKILL tests at: lock-path creation before owner publication; history creation/current publication; tmux spawn before socket appearance; socket appearance before PID capture; PID capture before server-record CAS; and cleanup before cleanup-proof CAS. Two cleanup passes must leave no owned server/socket and either a coherent terminal ledger or an explicitly quarantined, non-advancing campaign.

## 2. “Child exit” is not yet a complete wrapper-success predicate

Replacing the parallel fault with a wrapper is correct. The production helper cannot exit 0 until its awaited authority operation, including final read-back, has completed. But Node's child `exit` event can occur before stdout/stderr streams close and all buffered bytes are delivered. R3 says the wrapper “captures bounded stdout/stderr and waits for exit,” then decides from exact bytes. An implementation that acts on `exit` can corrupt the generation before knowing whether late pipe bytes make stdout differ from `{}\n` or stderr nonempty.

The environment equivalence is also not closed. The normal managed command is shell form with `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1` plus the installed executable. The wrapper is an exec-form Node process and then invokes exact Node plus the installed helper. “Identical cwd and allowlisted environment” must enumerate the child environment, including the managed marker, relocated HOME/config/journal variables, and explicit absence of wrapper-only/auth-unrelated values. Direct Node invocation intentionally bypasses the helper shebang; that is acceptable for this semantic fault case only if the exact installed helper bytes/executable readiness were proved first and the attestation says so.

The phrase “atomic create-only fault transform” is also ambiguous for an existing generation. The fault evidence record may be create-only, but corruption of the generation must be an expected-before-digest/version CAS replacement (or an equally precise atomic mutation), followed by fsync/read-back. Otherwise a concurrent or wrong-generation write can be corrupted after child success.

Repair:

- Success requires all of: child `exitCode === 0`; no signal; stdout EOF and stderr EOF; child `close`; exact bounded stdout `{}\n`; exact zero stderr; successful stdin write/end; and no buffer overflow. Timeout/overflow kills the exact child, drains/settles both pipes, and fails without corruption.
- Add tests where stdout/stderr bytes arrive after `exit`, pipes close late, child is signaled, stdin errors, output exceeds the bound, and timeout races close. The mutation must remain absent in every case.
- Freeze the exact child environment key/value derivation and compare its digest to the normal lane-managed invocation contract. Include `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1` if production semantics require it.
- Define the generation mutation as expected-identity plus expected-version/digest CAS. The create-only fault record binds before/after bytes; it is not a substitute for guarding replacement of an existing journal record.

## 3. The current package violates the literal “no lifecycle scripts” candidate invariant

R3 requires the tarball to declare “no lifecycle scripts.” The current `packages/cli/package.json` deliberately contains `prepublishOnly: node ../../scripts/verify-npm-package.mjs --release`; the packed manifest retains that field. `prepublishOnly` is an npm lifecycle script, though it runs only for `npm publish`, not for the exact existing-tarball `npm install`. Implementing the literal rule would reject the current candidate or require removing an existing release verification hook—neither is planned by V0/V1, and the latter changes package/release behavior.

The load-bearing property is narrower: no install-triggered script or implicit native build can execute, plus `--ignore-scripts` and hostile-canary proof. Current npm documentation distinguishes `prepublishOnly` from install-time events.

Repair:

- Replace “no lifecycle scripts” with an exact forbidden install-time set for the pinned npm version, and reject an implicit `node-gyp rebuild` trigger such as `binding.gyp`. Preserve the intentional publish-only `prepublishOnly` unless an independently reviewed package-contract change is desired.
- Pin the npm version's operation-order contract in the V0 fixture and test each forbidden key plus the implicit native-build case. Continue to require `--ignore-scripts`, dependency-free tarball, hostile canary absence, offline cache, and unchanged source outputs.
- Make the manifest/receipt validator and the existing `verify-npm-package.mjs` share this same closed rule, so the refactor does not create a stricter candidate-only policy that the current package can never satisfy.

# Required red-first repair gate

R3 may pass after an exact new version adds these tests before implementation:

1. **A0 lock/ledger tests:** partial/empty lock publication is impossible; dead-owner liveness is exact; PID reuse cannot steal a live lock; immutable history precedes the current revision; every crash either recovers or quarantines without advancement.
2. **H0 tmux tests:** SIGKILL in every reservation-to-record window remains killable from the reserved private socket, even if ledger bookkeeping is temporarily locked; repeated reaping is exact-target and idempotent.
3. **H0 wrapper tests:** `close` plus stdout/stderr EOF—not `exit` alone—is required; exact env/marker/stdin/helper identity and expected-digest generation CAS are asserted before corruption.
4. **V0 package tests:** the current `prepublishOnly` package passes the exact publish-only allowance; every install-triggered/implicit-build fixture fails or remains unexecuted under the one shared verifier.
5. **R35 exact-SHA review:** a non-builder inspects these real interruption paths and makes one lock/reaper or wrapper-order oracle red before G0. No production behavior or live candidate claim is needed.

# What survives skepticism

- The sequential wrapper is the correct no-production-change repair for the former PreCompact sibling race.
- P35H correctly records overall host FAIL, global `~/.claude.json` drift, `BLOCKED_AUTH`, no first model response, isolated primitive PASS, and silent-handler identity NOT PROVEN. R3 never launders the overall probe into candidate PASS.
- Passive observer evidence is limited to host event occurrence; managed effect uses state/transcript/canary consequences rather than invented opaque-id correlation.
- Campaign-authoritative ids and one-use predecessor slots close cross-root replay and caller-selected attempt drift.
- R0/Q0 assertions are mandatory, challenge-bound, evidence-bearing, and semantically honest; human independence remains where it belongs, in orchestration.
- Absent-leaf atomic freeze, exact source pre/post facts, sidecar-last sealing, exact candidate modes/tree, and verifier pre/post drift checks remain sound.
- The auth boundary is now honest: one isolated API key, no real-HOME/global fallback, no OAuth mode, protected sentinels, persistent/output leak scans, and `BLOCKED_AUTH` until a real isolated response exists.
- Fault cleanup now distinguishes restored settings/prefix state from intentionally tainted disposable journal state.
- Closed verdicts, post-PreCompact FAIL classification, red-first builder dependencies, and exact non-builder R35 review are sufficient once the crash and wrapper predicates above are executable.

# Verdict

Do not start F0 from this exact R3 Plan. Preserve the sequential wrapper, campaign/fanout model, strict assertions, host-evidence disposition, absent-root freeze, bounded npm proof, privacy boundary, and red-first graph. Repair the lock/reservation interruption windows, make wrapper success depend on pipe closure and guarded corruption, and align the install-script invariant with the existing package. G0 remains blocked.
