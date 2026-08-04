---
type: Context Note
title: >-
  Revision 3 R6 host probe R2 failure — whole-system model and final repair
  contract
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T01:50:33.485Z'
---
# Summary

The frozen R6 host-probe R2 candidate is rejected before execution. Product acceptance and the independent skeptic both returned exact-digest FAIL at confidence 0.99. R2 materially repaired the original registration, Node-to-tmux transition, expected-resource teardown, Git observer, H3 concurrency, strict receipt, and terminal-evidence failures, but its controller model still permits receipt reachability and failure-created survivors. The execution command remains closed.

This is the mandatory whole-system reorientation before a third intervention. The next edit is the final bounded generator-critic revision of the host probe. It must change the controller architecture, not add local assertions to the rejected model.

# Goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: produce one final statically safe H1-H5 host probe whose observer boundary is structural and whose failure controller reaches a bounded zero-survivor fixed point, then obtain independent exact-byte product and skeptic PASS before any execution; this serves the ultimate goal by preventing unsafe premise-gathering infrastructure from entering the revision-3 compaction-memory design.

# Domain model

- **Controller**: the sole writer, event recorder, and teardown owner for one retained run root. It may summarize facts but is not an acceptance authority.
- **Observer**: a pure H2 computation over one recursively frozen fresh-facts value. It has no controller, writer, path, index, filesystem, callback, closure, or action-receipt capability.
- **Creator surface**: any live capability that can still create another test process: a server, fixture `new-session` client, pane parent, requester/control before release, or a possible negative-query autostart.
- **Resource descriptor**: pre-created controller state for one known or bounded-possible process/socket/handle, with creation anchor, allowed transition, group, owner, recovery path, and terminal disposition.
- **Creation anchor**: evidence captured before PID reuse can occur: a create-only self-record, a live controller-owned child handle plus immediate stable identity, or a unique before/after audit binding to a private socket/marker/closed command. A current PID row alone is not an anchor.
- **Quiescence**: every creator surface is closed, aborted, or reaped so no dependent resource can appear after absence classification.
- **Fixed point**: after quiescence, repeated bounded harvest, audit, cleanup, and audit finds no known PID/group, private socket owner, run-root command, or public marker for two consecutive passes; all controller handles are closed.
- **Negative-branch recovery descriptor**: a descriptor registered before an absent-server query for the bounded possibility that `tmux -N` violates its premise and creates a new server on the exact private socket.
- **Primary evidence**: raw facts used to answer H1-H5. **Controller cleanup evidence** records containment only and can never repair or promote a failed primary assertion.
- **Frozen input**: canonical source root plus exact regular source/contract files, their digests, modes, owner, type, link count, and required clean feature worktree/HEAD.

# Components and interactions

The controller preflights frozen input and the pinned host/tool tuple before H1. It creates one private retained run root, takes protected/worktree baselines, and preplans every ordinary and bounded-possible resource before opening a creator surface. Direct Node gates self-record, block on a closed release channel, and may exec only the pinned tmux vector. Fixture pane/child processes self-record under a unique public marker and must also observe a pre-created controller abort capability so a child that starts after failure fencing terminates without waiting for a late acknowledgement.

On the success path, H1 produces raw action receipts and separately derives fresh PID/group/socket facts. The controller calls the observer as `H2(deepFrozenFacts)` only; the observer returns a plain value. After return, the controller writes observer evidence and hidden-receipt evidence separately. H3 observes two live requester identities/handles before designation. H4 demonstrates the declared server-first survivor and the descendant-first happy-path order. H5 proves exact absence, no-autostart, clean protected/worktree continuity, bounded evidence, and provenance separation.

On any failure path, teardown must first fence future creation. It closes unreleased creator channels, asserts fixture abort capabilities, stops pending fixture clients/requesters/controls, and stops or kills private tmux servers/negative-branch servers through their exact socket/control envelope. Only after creator quiescence may it classify a dependent pane/child absent. It then repeatedly harvests records, audits exact private identities, cleans anchored resources, waits for handles, and audits again to a bounded stable zero-survivor fixed point. A single `ps` timeout/parser error is not terminal: observation is retried, direct handles or private-socket kill paths are used where anchored, and detached fixtures self-terminate through the abort capability. Contradictory identity remains fail-closed and must not authorize a signal.

The controller never adopts a current PID for signaling unless it is tied to a creation anchor. PID/start/UID/PGID/allowed-command checks are freshly sampled immediately before any signal; this remains bounded sampled TOCTOU, not atomic PID-safe signaling. Socket unlink occurs only after quiescence, clean final audit, all associated descriptors resolved, and exact unchanged owned-socket identity. Final manifest/terminal evidence rechecks frozen source-root/file facts and the clean worktree predicate.

# External state and timing dependencies

- Installed Darwin arm64 host with exact pinned Node, tmux, ps, and git bytes; `process.execve` is required.
- Two private tmux sockets and one unpredictable private run root under `/private/tmp`.
- The exact feature worktree must be at HEAD `36c741a8173832d75d61a7ab138b5219c4415c66` with empty porcelain status, worktree diff, and cached diff before H1 and at all terminal checks.
- Real-user protected paths are read-only bounded snapshots; no Claude, auth, normal/global-home fallback, network, bundle, task, Plan, or repository mutation is permitted.
- Creation and cleanup are ordered. Absence before creator quiescence is provisional only. A late child/negative server is a reachable host outcome that the controller must contain before exit.
- Process identity checks are sampled and same-UID/non-malicious-host scoped. Arbitrary unmarked same-UID escape and atomic signaling remain explicit nonclaims.

# Accepted R2 invariants to preserve

R2's pre-registration for expected resources, child create-only record/acknowledgement, exact same-stable Node-to-tmux transition, group-aware cleanup after leader exit, Git no-lock/nonmutating observer, simultaneous H3 rows/handles, closed action vocabulary, strict code/signal/stdout/stderr/EOF/absence receipts, dual source/contract digest gate, mandatory terminal/index/teardown readback, evidence bound, verdict algebra, scope, and nonclaims all survived both reviews.

# Rejected R2 model and exact repair requirements

1. **Pure H2 boundary.** Replace `H2(facts, events)` with a pure one-argument observer returning a plain result. The controller persists all events after return. No writer or file capability crosses the call.
2. **Frozen-root/file binding.** Preflight and terminal checks require canonical non-symlink source root mode `0700`, current UID, exact directory type; source/contract exact regular type, modes `0500`/`0400`, current UID, link count 1, exact paths and digests. Manifest records these facts.
3. **Clean worktree as a machine precondition.** Before H1 require empty status/diff/cached-diff receipts and bind their stable empty digests; H5 and terminal teardown recheck both clean state and continuity.
4. **Negative-query recovery.** Pre-register a bounded possible-autostart descriptor for each absent query. Unique before/after audit plus exact private socket/UID/pinned tmux vector may anchor it; if it appears, stop it through the private socket, prove PID/group absence, then unlink. Audit-only detection is insufficient.
5. **Quiesce before dependent absence.** A pid-null pane/child cannot become terminally absent while any fixture client, pane parent, or server can still create it. Failure teardown fences creator surfaces first, then harvests/cleans descendants.
6. **Bounded stable fixed point.** Repeat harvest/audit/cleanup after fencing until two consecutive clean passes and every handle/abort disposition agrees, under an explicit bound. A final audit that merely reports a survivor is not cleanup.
7. **Observer-failure-independent containment.** Retry bounded `ps` observation; use anchored direct handles/private-socket controls and pre-created fixture abort capabilities so one timeout/parser error cannot strand a known resource. If identity is contradictory, do not signal or unlink.
8. **No unanchored PID adoption.** A current PID row alone never authorizes signaling. Require a create-only identity, live anchored handle with immediate stable sample, or unique private root/marker/socket/closed-vector audit binding; an exited handle cannot be rebound to a reused PID.

All eight changes remain controller/host safety. They must not add lifecycle states, CAS, leases, scheduler matrices, reconciliation policy, schema/attestation/verdict authority, Claude, auth, network, or production acceptance. The script remains exactly H1-H5 and at most 800 effective nonblank/non-`//` lines. If the repaired architecture cannot meet that bound without weakening an invariant, the builder returns FAIL unfrozen.

# Evidence and gate

- Product R2 FAIL: `context-notes/precompact-v3-t35-r6-host-probe-script-acceptance-r2@sha256:aeb48a911249d9342ea7043c8900fcadb7f3fc1b4562e59e97e55e29790a56ec`.
- Skeptic R2 FAIL: `context-notes/precompact-v3-t35-r6-host-probe-script-skeptic-r2@sha256:bf0ef260b52a04e20a76cb59006e0fe4a184d07b2a6a2f91fe2f34921662a891`.
- Rejected source: `host-probe.mjs@sha256:757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c`.
- Rejected contract: `contract.md@sha256:784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a`.

The R2 bytes remain frozen rejected evidence and must never run. A new digest must repeat both exact independent static reviews. Only dual PASS opens one exact no-auth H1-H5 execution, followed by independent retained-evidence audit before any repaired Plan or production implementation.
