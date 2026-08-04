---
type: Context Note
title: Revision 3 T3.5 H2-H5 boundary skeptic review R2
actor: codex-t35-h2-h5-skeptic-r2
timestamp: '2026-08-04T18:25:23.469Z'
---
# Summary

Status: **complete**.

Verdict: **FAIL**.

Confidence: **0.99**.

`builder_task_eligible: false`

R2 closes the four R1 skeptic findings and the R1 product fence contradiction. I accept its explicit option-level `tmux -N` architecture inference on the exact pinned binary/manpage, its sealed H2 dataflow, its controller-owned companion scope, and its split abort/action fences. One exact construction contradiction remains in the pinned continuity authority: the worktree baseline is required to be produced by spawned Git helpers, while the same boundary requires protected/worktree snapshots to run before the first process spawn. There is no implementation that satisfies both statements. This must be repaired at the boundary because it defines which preflight observers are inside the run's mutation/containment envelope and which bytes become the baseline.

# Exact reviewed inputs

- R2 task claim input: `tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:65ac828a8a919fc4d3b7ba4e0a5555a6f95935ea5e999333d61fd2a094afbee4`; claimed by exact CAS as `codex-t35-h2-h5-skeptic-r2`.
- Decision: `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`.
- R2 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:1847717b5456a3cea3325cab947543c91cc0c6cb00403d4b99d00a5971c56b51`.
- R1 acceptance FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance@sha256:9ab4554b694a5f573fc53d8b22e816e834e8c3999a11136684324ed5abb768f7`.
- R1 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:22c47a846c9dbe7d22742c73babc043469b537caf62c035c2de81682f8b16717`.
- Retained Research: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Retained audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.
- Retained source: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ/launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`.
- Retained evidence: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ/evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`.
- Retained summary: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ/summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Pinned tmux binary: `/opt/homebrew/Cellar/tmux/3.6b/bin/tmux@sha256:e0c40b227b8d7283c4ace45056c70cf0fe371bd00b62e52b6e14fadae5d69f70`.
- Pinned installed manpage: `/opt/homebrew/Cellar/tmux/3.6b/share/man/man1/tmux.1@sha256:6903664073d73ae13d764216917932a4d5a212ce6b8e836297a58b3bf58c78ca`.

The retained file hashes matched. I inspected the exact source vectors and relevant evidence receipts. The exact manpage states at top-level `-N`: “Do not start the server even if the command would normally do so,” and separately states that `new-session` with multiple shell-command arguments executes them directly without `sh -c`.

# Isolation

This was a fresh independent static falsification review. I did not inspect or communicate with the current R2 acceptance reviewer, run tmux or any host probe, inspect live processes, use Claude/auth/network actions, run tests, modify repository code, modify a Plan/parent task/shared handoff, or sync. I performed only exact bundle reads, retained-file hashing/static inspection, my CAS task claim, this uniquely owned review note, and my terminal task update.

# Blocking adversarial trace

## C1 — the Git-backed preflight snapshot cannot precede the first process spawn

R2 mandates both of these exact rules:

1. “Worktree observation uses pinned absolute Git” and retains Git argv/env/raw bytes, with synchronous Git helpers explicitly included in the bounded helper taxonomy.
2. “Protected/worktree snapshots run before the first process spawn.”

Minimal exhaustive trace:

1. The controller completes the in-process protected-tree walk but does not yet possess the required worktree snapshot.
2. To obtain HEAD/tree/branch/porcelain/diffs/`ls-files` through the mandatory authority, it spawns the first pinned Git helper.
3. At that instant the protected/worktree snapshot has not yet completed, so the requirement that it run before the first process spawn is false.
4. Avoiding the spawn cannot repair the trace: in-process Git parsing violates the mandatory pinned-Git authority and omits the required raw Git receipts. Supplying externally computed bytes moves the observer outside the preregistered helper/containment/evidence model.
5. Treating “first process” as “first non-helper principal” is a plausible repair, but it is not what the exact boundary says and it leaves the baseline ordering undefined. In particular, the boundary must decide whether a preflight Git helper's possible mutation of protected state is measured before or after the accepted baseline; index before/after receipts alone do not cover every protected target.

This is not a future script-style check. It is a missing architecture rule for preflight observer causality. A builder must not silently decide that helper processes are exempt from “first process spawn.”

Minimal repair: permit only preregistered preflight observation helpers before the first probe principal/action process; take protected snapshot P0; run each direct Git helper with its mandated index-before/index-after guard and exact close/EOF/absence; take protected snapshot P1; require P0=P1 and no worktree/index drift; then freeze P1 plus the Git receipts as the baseline before any server/client/pane/companion/action process. Equivalent explicit ordering is acceptable, but it must be exact and re-reviewed.

# Adversarial attacks that R2 survived

## Explicit option-level `-N` inference — survived

The inference is now an honest architecture premise rather than a claim that every vector was empirically run. The exact installed manpage defines `-N` at option level, independent of command tail; the exact v5 source/evidence additionally exercise live `list-sessions`/`display-message`, absent-socket `new-session`, and absent-socket `kill-server` on the same binary. Every future client family is required to carry top-level `-N`, has a sampled exact-live precondition, and becomes primary FAIL if the server disappears before contact. Accepting documented behavior of the exact hashed binary is a legitimate option-1 premise and does not promote v5's canary/schema/process-history limitations.

Future byte review must still prove that every gate releases by exact same-PID `execve` into a preregistered top-level-`-N` vector and that no implicit/default, recovery, pane-query, or fourth command family exists. That is an implementation check because R2 already supplies the closed vocabulary and verdict.

## H2 controller-level noninterference — survived

The two plans are sealed/read back before the H2 actions, helper order and bounds are fixed, action bytes/status remain opaque until the observer returns, and the observer is a separate stdin/stdout-only same-source child forbidden filesystem/spawn/network/receipt/global/closure authority. Result-conditioned plan selection, early parsing, or a capability-bearing observer is expressly FAIL.

Future byte review must audit dynamic imports/mode dispatch, output buffering, overflow handling, callback captures, plan construction, and unconditional helper scheduling. Those checks instantiate an already-complete dataflow rule; they do not require a new architecture choice.

## Controller-owned companion and pane scope — survived

The pane no longer spawns a new-PGID detacher. It only writes its bounded record/request and has abort plus hard lifetime. The controller creates each marked companion directly, owns its handle before self-record, validates its new PGID, forbids indirect children, and can reap record failures without PID adoption. R2 also states the resulting nonclaim plainly: this evidence is usable only by a later authority that itself launches and retains the marked principal, not by a pane-owned/arbitrary-descendant design.

The exact tmux manpage supports a shell-free compliant pane vector: multiple `new-session` shell-command arguments are executed directly without `sh -c`, matching the retained v5 source pattern. Future byte review must require that form, verify the pane never spawns, and reject any extra pane-query action outside the three closed vector families.

## Abort/action fences — survived

`abort-latch.json` closes future creators and late pane requests; it does not claim terminal no-action. After descendants drain, the preregistered server-B kill is the sole final tmux action. Only its close, both EOFs, control/server absence create `action-fence.json`, after which tmux spawn/release is forbidden. This removes the R1 product contradiction.

## Remaining safety and provenance attacks — survived

- Requester B remains gate-closed until requester A close, both EOFs, and identity/group absence; a vanished target yields fail-closed `-N` behavior.
- A direct companion record failure stays owned through the original handle; a registered/stopped direct principal cannot be adopted from an audit PID.
- Changed socket generation cannot be adopted or unlinked as the owned socket and makes H5 fail.
- Observation error/malformed/multiple rows cannot become absence.
- H4 latches primary topology before containment; fallback cannot overwrite it.
- H5 is passive after the action fence, rejects every registered survivor/helper/process/group, and cannot claim a fresh H1 proof.
- Protected targets, npm metadata-only scope, exact worktree path/branch/SHA, bounds, symlink policy, Git index drift guard, and non-restoration rule are now pinned. Selecting the exact Git binary/digest and implementing raw-byte traversal are future immutable-byte review checks.
- The 800-line cap is fail-closed: inability to implement the exact model is FAIL, not authority to omit policy.

# Required next gate

Repair C1 with an explicit preflight-helper/baseline order, freeze a new exact boundary version, and send it through fresh isolated acceptance and skeptic review. Do not create a builder task from R2.

[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r2.md)
