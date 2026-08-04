---
type: Context Note
title: Revision 3 T3.5 R6 strict host-probe skeptic static review R2
actor: codex-precompact-v3-r6-skeptic-r2
timestamp: '2026-08-04T01:47:36.571Z'
---
# Summary

Status: complete; independent static review only.

Verdict: **FAIL**. Confidence: **0.99**.

Execution eligibility: **CLOSED**. Do not run the exact execution command for this candidate.

The R2 bytes materially repair R1: all fixture resources are planned before `new-session`, the fixture client is registered at spawn, the marked child waits for controller acknowledgement, Node→tmux is an allowed same-stable-identity transition, H3 retains a concurrent observation, strict action EOF is enforced, the contract digest is supplied to preflight, and mandatory terminal receipts fail closed. Those improvements survive review.

Three load-bearing static counterexamples remain:

1. H2 receives the `EventWriter`, whose `.root` and `.index` expose the action-receipt files; with module-global `fsp`, the supposedly discarded receipts remain reachable through an H2 parameter. The emitted claim `action_receipt_reachable_from_parameters:false` is false.
2. Failure teardown marks pid-null pane/child descriptors absent from one audit **before** the fixture client/server creation surfaces are quiescent. A late pane/child can start after its descriptor's cleanup pass. The final audit detects but does not clean that late survivor; the child watchdog can remain live after controller teardown.
3. Any transient `ps` timeout/parser/identity error during `cleanupResource` is caught and skipped. The exact test-owned resource can remain live; the later audit reports it but performs no recovery cleanup.

The current files therefore cannot satisfy the frozen rule that no reachable assertion/timeout leaves a test-owned PID/group/socket/handle. This is a hard FAIL, not a caveat.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently falsify or validate the repaired immutable R6 H1-H5 host-probe bytes before its exact execution command is opened; this serves the ultimate goal by preventing an unsafe or epistemically incomplete host experiment from becoming a Plan premise.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  execution_eligibility: CLOSED
  static_only: true
  candidate:
    source:
      path: /private/tmp/aslite-t35-r6-host-probe.v2/host-probe.mjs
      sha256: 757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c
      mode: "0500"
      type: regular_file
      links: 1
      size_bytes: 62133
      physical_lines: 851
      effective_nonblank_noncomment_lines: 789
    contract:
      path: /private/tmp/aslite-t35-r6-host-probe.v2/contract.md
      sha256: 784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a
      mode: "0400"
      type: regular_file
      links: 1
      size_bytes: 8201
      physical_lines: 58
    source_root:
      mode: "0700"
      type: directory
      uid: 501
    feature_worktree:
      path: /private/tmp/aslite-precompact-v3.RLDTIZ/repo
      head: 36c741a8173832d75d61a7ab138b5219c4415c66
      porcelain_status: clean
  boundary: context-notes/precompact-v3-t35-r6-host-probe-boundary-synthesis@sha256:61ccbe83a2ce74e859ee18e714d04edf8297edf1db9f7cc9e2947897b1e24c5e
  predecessor_review: context-notes/precompact-v3-t35-r6-host-probe-script-skeptic@sha256:8e40c8d4e567d75ebe8136ac7da55d43c6214ec8acaed33c6fdd22d4a15b7a05
  blocking_issues:
    - severity: critical
      id: H2_RECEIPT_REACHABLE_THROUGH_EVENT_WRITER
    - severity: critical
      id: LATE_FIXTURE_CREATION_AFTER_ABSENCE_CLASSIFICATION
    - severity: critical
      id: INSPECTION_OR_PARSER_FAILURE_SKIPS_RESOURCE_CLEANUP
    - severity: high
      id: UNANCHORED_PID_ADOPTION_CAN_SIGNAL_REUSED_PROCESS
    - severity: high
      id: SOURCE_ROOT_FROZEN_MODE_NOT_PREFLIGHT_BOUND
  note: context-notes/precompact-v3-t35-r6-host-probe-script-skeptic-r2
```

## Exact inputs, recomputation, and isolation

Read in full through `./aslite`:

- boundary synthesis `context-notes/precompact-v3-t35-r6-host-probe-boundary-synthesis@sha256:61ccbe83a2ce74e859ee18e714d04edf8297edf1db9f7cc9e2947897b1e24c5e`; and
- R1 skeptic rejection `context-notes/precompact-v3-t35-r6-host-probe-script-skeptic@sha256:8e40c8d4e567d75ebe8136ac7da55d43c6214ec8acaed33c6fdd22d4a15b7a05`.

I independently read the candidate source and contract in full and recomputed every identity in the envelope. The claimed source and contract SHA-256 values match. Current root/file modes, types, ownership, link counts, sizes, physical/effective line counts, feature HEAD, and clean porcelain status match the envelope. The candidate remains under the frozen 800 effective-line limit and the broader 900-physical-line architecture bound.

No syntax/test/probe command was executed. I did not invoke `--run`, any child mode, tmux, Claude, auth, network, or a test. I did not edit the candidate, repository, feature worktree, task, Plan, or code. I did not inspect or communicate with the product reviewer.

## Critical blocker 1 — H2 still has a receipt-capability path

The repair separates `ctx.controllerHidden.h2` from the recursively frozen `ctx.h2Facts` at lines 519-521, and H2's current predicates read only the narrow facts. That is useful dataflow hygiene, but it does not meet the stronger contract at `contract.md:49`.

`H2` accepts `(facts, events)` at source line 527. `events` is the live `EventWriter`. Its public fields include `root` and `index` at lines 193-210. The index names the H1 receipt event files, and `events.root` identifies their directory. The same module exposes `fsp` globally at line 4. Consequently, the action receipts are reachable from an H2 parameter as:

```text
events.root -> evidence/events/
events.index[*].file -> exact H1 receipt filename
module-global fsp -> readable retained receipt bytes
```

The current H2 statements do not traverse that path, but the emitted evidence at line 534 says `action_receipt_reachable_from_parameters:false`. That factual claim is false. The host question requires the observer to **receive no** action result/hidden receipt; “received a file capability but did not dereference it in this revision” is weaker.

Minimum repair: make the H2 observer a pure computation whose only parameter is the deeply frozen narrow fact object and whose return is a plain verdict/fact record. It must receive neither `ctx`, `EventWriter`, run root, event index, file paths, nor a callback/object that exposes them. The controller, outside the observer, may then persist the returned record and separately retain the hidden receipts as fault-injection proof. Remove the false reachability claim unless construction proves it.

## Critical blocker 2 — one-pass recovery can race late fixture creation

R1's missing-registration hole is substantially repaired:

- unique marker and pane/child/client resources are planned before the fixture client at lines 383-395;
- the fixture-client handle/PID is registered synchronously by `onSpawn`;
- child and parent create-only records are harvested; and
- the child waits up to ten seconds for an exact acknowledgement at lines 271-277.

The teardown order nevertheless reintroduces an unsafe absence inference.

At teardown start, `recoverResources` takes one process audit. For any pid-null resource with no hit, it sets `resource.cleanup_absent = true` at line 690. Resource cleanup then runs once, sorted child (`order:10`), pane (`20`), fixture client (`30`), and server (`100`) at lines 743-746.

A reachable failure trace is:

1. `new-session` has been sent or accepted, but the pane/child are not yet visible when teardown's one audit runs.
2. Pane and child descriptors have `pid:null`, so both become `cleanup_absent:true` and their cleanup passes complete.
3. Only afterward is the fixture client cleaned; the tmux server remains live until order 100.
4. The already accepted session command starts the pane and detached child after their cleanup passes. The child self-records and waits for its acknowledgement; no acknowledgement will be written on this failed path.
5. The final audit at lines 747-750 finds the marker and records an error, but it does not ingest or clean the newly appeared resources and does not repeat audit/cleanup to a fixed point.
6. The controller can exit while the marked child remains live until its ten-second watchdog expires. A delayed process is still a teardown survivor; final detection without cleanup does not satisfy terminal safety.

The same class applies whenever a creator can act after a dependent descriptor is classified absent. The contract promises registration, but registration alone does not quiesce future creation.

Minimum repair: never classify a pid-null pane/child descriptor terminally absent while any fixture client, pane creator, or server command surface can still create it. Failure teardown must first fence/close creation-capable clients, then recover and clean pane/child records/markers, then remove the server. Repeat record harvesting, exact audit, and cleanup until a bounded stable fixed point shows no known/root/marker process and the child watchdog interval cannot introduce a late survivor. A self-closing control channel is preferable to a one-time acknowledgement timeout.

This is controller safety only; it does not require lifecycle CAS, lease, or scheduler policy.

## Critical blocker 3 — parser/inspection failure strands the known resource

`cleanupResource` begins with `inspectResource`, which runs and strictly parses fresh `/bin/ps -p/-g` receipts at lines 696-705. The teardown loop catches every inspection/parser/timeout error, marks the resource unsafe, and moves on at lines 743-745. It does not retry the inspection, use a still-open direct child handle, close a control capability, or invoke any other bounded self-termination path.

A transient `ps` timeout, malformed row, or strict `comm`/group assertion therefore leaves the exact test-owned server, control, requester, pane, or acknowledged marked child alive. The final process audit can report the survivor, but—again—it does not clean after detection. This is safer than signaling an ambiguous PID, but it does not satisfy the prerequisite for running a deliberately detached-process experiment.

Minimum repair: give every created process a cleanup mechanism that does not depend on a single successful parse of the same observer. At minimum, use bounded observation retries; use the still-open controller-owned child handle and the previously recorded stable PID/start/UID/PGID plus the closed Node→tmux transition for direct gates; and give detached fixture processes a controller-loss/self-termination channel. Teardown must not return while an exact known resource is live merely because one observation failed. If exact identity becomes genuinely contradictory, execution must stop in an externally managed quarantine rather than claiming the script can safely self-contain.

## High blocker 4 — current-identity adoption has no stable spawn anchor

`planResource` initializes resources without an identity. `inspectResource` calls `adoptCurrent` when one current PID row exists. If no record/sample identity was previously ingested, `adoptCurrent` accepts the row solely because PID, current UID, `PGID=PID`, and allowed `comm` match (lines 187-190, 696-704). It then uses that newly adopted identity for negative-PGID TERM/KILL.

For a direct child or fixture client that exits before creating/returning a stable record, a numeric PID may be reused by another same-UID Node/tmux process with its own PGID. The resource has a child handle, receipt/exit state, or unique expected command context, but adoption does not consult them. This is broader than the accepted immediate sample-to-signal risk because there may be no original start-time sample at all.

Minimum repair: never signal a known numeric PID after adopting an unanchored current row. Require either a create-only identity containing the original start time, a still-open controller-owned child handle proven not closed plus a fresh exact row, or an exact unique root/marker/closed-command audit binding. If the original handle/receipt proves exit, require original group absence but do not promote a reused PID into the test resource.

## High blocker 5 — source-root drift is not part of preflight

Current source-root/file facts are correct: root `0700`, files `0500`/`0400`, regular, one link, exact digests. Preflight at lines 659-677 verifies the lexical source path, both file digests, both file modes, host tuple, and tools. It does not verify source-root type/mode/owner/canonical path, file type/owner/link count, or the reviewed root's identity.

Thus changing the source root to `0755` while leaving exact file bytes and modes intact would not be rejected, despite `contract.md:9` and `:25` claiming root/frozen-mode binding. The current stat is good; the execution-time guard is incomplete.

Minimum repair: preflight the canonical source root and both inputs with `lstat`/`realpath`: exact directory/regular-file types, uid, modes, link counts, and no symlink/path substitution, in addition to the existing hashes.

## R1 repairs and other attacks that survived

The following attacks did **not** falsify the R2 candidate and should remain unchanged:

- **Exact identity and construction:** recomputed digests, current modes/root, feature HEAD/status, size limits, exactly H1-H5, two servers/panes/children/requesters, and ten-control bound all match.
- **Scope:** no lifecycle ledger, CAS/lease policy, scheduler/fuzzer, replay/retry engine, production schema/verdict authority, Claude/API-key/network path, or claim beyond the five host questions appears.
- **Closed action vectors:** pinned explicit-argv0 Node→tmux server and `tmux -N -S` server/session/pane/kill/final-query vectors remain closed; arbitrary caller action tails are rejected.
- **State-only/fake causation:** real gate self-records, raw `ps`, create-only/fsynced records, release frame+EOF, exact vector, strict close/signal/EOF/output, honest sampled/unsampled tmux phase, effect, and exact PID/group absence are coupled.
- **R1 exec-transition repair:** resources now accept only the exact same PID/start/UID/PGID with `comm` in the closed `{Node, tmux}` envelope, and adoption happens during sampling as well as cleanup.
- **R1 partial-fixture repair:** marker/resources are planned before creation, the fixture-client PID/handle is captured at spawn, records are harvestable, and the child has a bounded acknowledgement watchdog. The remaining defect is ordering/fixed-point cleanup, not missing scaffolding.
- **H1/final query:** strict queries/effects, kill result, server/pane absence, exact absent-query stderr, both EOFs, unchanged socket fact, and original-server absence are required.
- **H3:** owner and successor exact PID/group rows plus both open handles are retained in one fresh pre-designation observation; exact former-owner absence precedes successor release; no lease/CAS claim is made.
- **H4 topology/order:** create-only child record precedes the parent record by source causation and retained timestamps; pane/child groups are distinct; the server-first branch retains the exact marked child survivor; descendant-first proves child/pane absence while the server remains exact-live and answerable.
- **Socket safety:** happy-path and failure-path unlink require unchanged dev/inode/type/uid/mode, clean final audit, and every associated resource absent/non-unsafe. No broad unlink path survived inspection.
- **Primary versus fallback:** controller cleanup provenance remains separate and cannot turn an earlier exception or false question boolean into PASS.
- **Historical audit/evidence:** bounded raw audit, event-file digests, read-back event index, manifest and terminal receipt digests, H5/terminal protected and worktree snapshots, evidence-size margin, and summary nonclaims are retained. Missing required receipts prevents PASS.
- **Git observer:** child Git environments are explicit and no-auth; optional locks, fsmonitor, untracked cache, preload index, submodule recursion, external diff, and textconv are disabled; metadata is hashed before/after each observation. Current feature worktree is clean and no source path can write it.
- **Verdict algebra:** PASS requires all five booleans, no original error, no teardown error, all terminal receipts, and the evidence cap. Cleanup or summary cannot upgrade a failed primitive.

## Minimum repair and next gate

Keep the repair bounded to host-probe controller safety:

1. remove every H2 receipt capability from the observer call;
2. quiesce creators before dependent absence, then repeat harvest/cleanup/audit to a stable zero-survivor fixed point;
3. add retry/handle/self-termination cleanup so one observer/parser failure cannot strand a resource;
4. prohibit unanchored PID adoption before signal; and
5. bind source-root/type/ownership/link facts in preflight.

Do not add product lifecycle states, CAS, leases, scheduler matrices, reconciliation policy, or a second acceptance authority. Freeze new source and contract digests, then repeat independent product and skeptic static review. Until both PASS the same bytes, the exact execution command remains closed.

## Final decision

**FAIL — execution remains CLOSED.**

Confidence: **0.99**.
