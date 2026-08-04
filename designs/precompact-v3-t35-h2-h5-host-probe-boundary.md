---
type: Design
title: Revision 3 T3.5 H2-H5-only host-probe boundary R5
description: >-
  R5 preserves one-shot mechanics and narrows CAS/export to cooperative evidence
  admission under the non-malicious same-UID threat model.
actor: codex-t35-option1-orchestrator
timestamp: '2026-08-04T18:42:05.643Z'
---
# Summary

This R5 boundary preserves the accepted R2 H2-H5 architecture, R3's same-attempt preflight causality, and R4's one-shot cross-attempt mechanics. It repairs R4's sole remaining blocker by narrowing the claim honestly: bundle CAS, exported metadata, and audit provide cooperative orchestration and evidence admission, not cryptographic execution authority. H1/no-autostart remains a retained prerequisite; fresh execution answers only H2-H5. After any preflight helper spawns, every defect is terminal FAIL; no conforming later run may adopt a new P0 without a separately reviewed rebaseline Decision tied to the failed attempt.

No build or execution is admitted by this document. The exact R5 bytes require fresh independent product/acceptance and adversarial-skeptic PASS.

# Goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: define a mechanically reviewable H2-H5-only host probe whose every fresh creator has a pre-existing containment owner and whose result-independent facts can feed a replacement Plan; this serves the ultimate goal by preventing premise-gathering races from becoming acceptance authority.

# Exact R1 review inputs and repairs

- Product/acceptance FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance@sha256:9ab4554b694a5f573fc53d8b22e816e834e8c3999a11136684324ed5abb768f7`: split the early creator abort latch from the terminal no-action fence. The server-B kill is the final authorized tmux action between them.
- Adversarial-skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:22c47a846c9dbe7d22742c73babc043469b537caf62c035c2de81682f8b16717`: close target-disappearance, H2 conditioning, unowned detacher, and snapshot-policy gaps as specified below.
- Product/acceptance R2 PASS `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`: retain the explicit pinned option-level `-N` inference, result-independent H2, controller-owned-companion H4 scope, split fences, and closed gates.
- Adversarial-skeptic R2 FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`: allow only preregistered preflight Git helpers before probe-principal spawn, sandwich them with P0/P1 equality and index guards, then freeze the accepted baseline.
- R3 adversarial-skeptic PASS `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`: retain the exact P0/Git/P1 same-attempt sandwich and all accepted R2 mechanics.
- R3 product/acceptance FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`: once any preflight helper spawns, classify drift/error/survivor/inequality as terminal FAIL and prevent a later attempt from silently adopting a changed P0.
- R4 product/acceptance PASS `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4@sha256:85cce4a5b61f15713f5ea8a95e481e084cd99729a75ef5abee07ea212fe69023`: retain one-shot root/task consumption, post-helper FAIL/P0 retention, and rebaseline gating.
- R4 adversarial-skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:ac378402e60ad29f377aecbca0345f5c61a85a0f7c798601d2bea94c51a55cfd`: stop calling self-digested local metadata an execution authority; define either a cryptographic bridge or the weaker cooperative evidence-admission claim.
- Whole-system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c` is the governing component/order/threat model for this repair.

# Domain model and taxonomy

## Evidence classes

- **E1 retained premise:** the selected v5 root, exact source/evidence/summary/protected hashes, independent evidence audit, pinned tmux binary, and pinned installed manpage. E1 is immutable provenance plus one explicit architecture inference; it is not fresh R6 output or a production acceptance oracle.
- **F2-F5 fresh facts:** R6 may produce only H2, H3, H4, and H5 evidence. Fresh evidence never upgrades an E1 audit limitation.
- **Primary evidence:** raw action/identity/topology bytes captured before containment. Only primary evidence can answer H2-H4.
- **Containment evidence:** direct-handle close, both EOFs, exact anchored identity/group absence, owned-socket disposition, and passive audit. It cannot promote a failed primary oracle.
- **Continuity evidence:** exact protected-state and feature-worktree before/after snapshots plus H5's passive inventories.

## Exact principal classes

- Two direct **server gates** are controller children. Each no-auth Node broker writes a create-only identity/READY record and blocks on an anonymous release pipe. Release permits only explicit-argv0 exec into pinned commandless foreground tmux. PID/start/uid/PGID and the controller's original live `ChildProcess` handle survive the transition.
- Two direct **fixture-client gates** are controller children with immutable `tmux -N -S <owned-socket> new-session ...` vectors. Each is preregistered, gate-closed, and reaped through its original handle. It creates one harmless pane with a public marker and 15-second hard lifetime.
- Two simultaneous direct **requester gates** are controller children with immutable `tmux -N -S <owned-socket> display-message -p '#{pid}'` vectors. A is the initial owner; B remains gate-closed until A is terminal.
- Two direct **server-kill controls** are controller children with immutable `tmux -N -S <owned-socket> kill-server` vectors, one per server.
- Two indirect **pane principals** are created by the fixture clients. Each immediately writes a create-only self record and a create-only detacher request, uses no auth/secret, performs no spawn, and waits on the controller's monotonic abort file with a 15-second hard lifetime. A missing/malformed pane record makes the primary oracle FAIL; the exact server handle, pane query when available, fixed lifetime, abort, and passive audits own containment.
- Two direct **marked companions** are created only by the controller after validating the corresponding pane request. Each controller spawn is `detached:true`, so it has a new PGID while the controller retains the original direct handle from creation. It self-records and waits on a controller pipe/abort. Missing/stalled/malformed self-record cannot create an unowned process: the controller already owns the live direct handle and terminates/reaps it before proceeding.
- One controller/event-writer/teardown path owns preregistration, direct handles, action scheduling, the abort latch, terminal action fence, fixed observation plans, evidence bounds, and terminal checks. Synchronous `/bin/ps` and Git helpers are bounded, sequential, and reaped through original direct handles; their output never supplies a new signaling identity by adoption.
- **Preflight observation helpers** are a separate non-primary principal class. Before any helper spawn, every exact Git invocation is preregistered with immutable vector, output/time bounds, expected role, and direct-handle/EOF/absence requirements. Only these helpers may run between protected snapshots P0 and P1. They cannot create a server, client, pane, companion, H2 observer, or ordinary process observer and cannot contribute an H2-H4 primary fact.
- One **execution admission** is a durable Task plus immutable exported JSON lineage input created only after exact script dual PASS. It binds boundary/script/contract digests, attempt ordinal 1, a random 128-bit campaign id, the exact initially absent 0700 run-root path, actor, and `prior_attempt:none`. A conforming runner CAS-claims that Task before invocation; any outcome consumes it and terminalizes it. The script validates the exported file/digest for exact lineage but never reads or writes the bundle and does not claim the export authenticates its creator.
- An **owned socket generation** is exact path, dev, inode, type, uid, mode, and first-observed registered server-release interval. Absence or replacement is never process proof. Unlink is permitted only after every creator and associated exact process/group is absent.

The marked companion is deliberately a pane-requested controller child, not an OS descendant of the pane. H4 therefore proves controller-owned declared-principal topology and teardown ordering. It does not prove arbitrary descendant discovery, ownership transfer from a pane, or containment of an unmarked escape. A future Plan may rely on H4 only if its authority itself launches and retains the marked principal; any pane-owned or arbitrary detacher architecture needs separate design and evidence.

# Bound E1 premise and the target-disappearance decision

The run manifest must verify before any spawn:

- decision `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`;
- Research `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf` and audit `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`;
- retained root `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`, source `launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`, evidence `sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`, summary `sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`, and equal protected snapshots `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`;
- exact tmux binary `/opt/homebrew/Cellar/tmux/3.6b/bin/tmux@sha256:e0c40b227b8d7283c4ace45056c70cf0fe371bd00b62e52b6e14fadae5d69f70` and installed manpage `/opt/homebrew/Cellar/tmux/3.6b/share/man/man1/tmux.1@sha256:6903664073d73ae13d764216917932a4d5a212ce6b8e836297a58b3bf58c78ca`.

The manpage defines top-level `-N` as “Do not start the server even if the command would normally do so.” V5 empirically confirms the exact pinned binary's late absent-socket `-N new-session` and `-N kill-server` failure without socket creation, and live `list-sessions`/`display-message` behavior. R5 retains the reviewed inference that top-level `-N` is an option-level no-autostart property of this exact binary, not a command-tail-specific accidental result. This inference is an architecture premise selected to avoid a hazardous fresh absent-server experiment; it is not represented as fresh empirical proof for every R5 vector.

Every fresh client vector begins with exact top-level `-N`; the allowed command vocabulary is only the three immutable vector families named above. Every release requires a sampled exact-live server/socket precondition. If the server exits between precondition and contact, `-N` prevents server creation; the action must fail, the primary case is FAIL, and passive observation confirms no new socket generation/process. No deliberately absent-target client, `start-server`, fallback/recovery client, arbitrary command/format/target, shell, or post-terminal-fence tmux action exists. If either reviewer rejects the explicit option-level inference, R5 is not build-eligible and option 1 must return to architecture choice; execution may not adjudicate it.

E1 retains every audit limitation: no standalone validated schema, incomplete canary/privacy recomputability, no retained historical full-process transcript, external campaign-time worktree continuity, and sampled rather than pidfd-like signal identity.

# Threat model, one-shot admission, and rebaseline governance

In scope are accidental concurrent claims, stale/mismatched exports, duplicate or replayed conforming invocations, process crashes, observer mutation, retry pressure, evidence substitution, and a compliant agent attempting to advance without the durable gate. The bundle CAS, root acquisition, exact lineage, terminal task state, and independent audit govern which result may advance.

Out of scope are a malicious or compromised same-UID user/agent forging bundle documents, actor labels, admission JSON, or claimed human approval; bypassing the runner; or directly invoking Node/tmux/Git. The same principal can already execute those tools and mutate its own files. R5 makes no claim of a trusted launcher, authenticated actor, signature/MAC, nonforgeable capability, cryptographic human approval, or physical prevention of arbitrary local execution. Adding those properties is a separate security architecture and is not a prerequisite for this no-auth host-fact probe under the accepted non-malicious-same-UID model.

The future execution gate creates exactly one admission record after the immutable script has dual static PASS. Its root must be absent before the script begins; the script create-only makes that exact root and binds the admission digest in its first record. A second conforming invocation with the same root fails before helper spawn because the root is present. An invocation with a different root/campaign/admission is not evidence for this campaign and must fail independent audit.

`BLOCKED_PENDING_VERIFICATION` is available only before the first preflight observation helper spawns, for invalid/missing immutable inputs, unsafe protected structure, inability to complete/read back P0, invalid admission lineage, or non-absent root. The admission is still consumed and no automatic retry exists.

Once the first Git helper spawns, helper error, timeout, survivor, unexpected child, incomplete close/EOF/absence, index drift, P0/P1 inequality, protected/worktree drift, dirty/malformed receipt, or any later defect is terminal FAIL plus bounded containment. The retained failure records must include the original P0, admission digest, helper manifest, every completed receipt, P1 when available, and a final continuity attempt. No post-helper outcome may be labeled BLOCKED.

A later conforming execution requires a new durable rebaseline Decision and a new exact-review dependency before another admission can be created:

- if the prior attempt detected no protected/worktree drift, the Decision cites that evidence and explains the new external prerequisite;
- if drift occurred or cannot be disproved, an independent verifier must either prove current state canonically equals the failed attempt's retained P0 or a compliant orchestrator must receive actual live user direction explicitly approving adoption of a different baseline and record that direction in the handoff;
- automatic restoration, new-root retry, silent P0 replacement, and agent-only approval of changed protected/worktree state are forbidden.

The later Decision/admission is orchestration state, not a script write. A bundle actor label alone never satisfies the live-user-direction predicate. The evidence auditor requires the exact claimed admission lineage and rejects any ordinal/root/campaign outside the cooperative workflow. These are governance predicates, not claims of authenticated provenance against a malicious local actor.

# Four mandatory fresh host questions

## H2 — discarded-result observability with controller-level noninterference

Before any action, the controller writes and read-backs two immutable observation-plan records. Each fixes the exact helper argv sequence, anchors, output bounds, deadlines, and serialization order for post-action PID, group, and socket facts. The plans differ only by case/anchor identity; neither contains an expected outcome or action receipt. Their digests are committed in the root manifest.

For server A, requester A performs the live read-only action and the server-A kill control performs the absent-result action. The controller waits for each action's close event and both stream EOFs but does not parse exit, signal, stdout, or stderr before the associated H2 worker returns. It executes the sealed observation plan unconditionally, irrespective of those opaque buffered bytes.

H2 runs as a separate same-source `observer` child with a minimal no-auth environment and stdin/stdout only. Its one canonical stdin value contains `{schema, case_id, sealed_plan, original_anchors, raw_observer_receipts}`. It receives no action receipt/status/output, file path, writer, handle, callback, environment secret, or mutable capability. The observer mode may call only its pure parser/classifier over stdin; it may not import/call filesystem, process-spawn, network, receipt-reader, controller-global, or module-closure state. Static byte review must verify this call/dataflow boundary. The controller persists/deserializes the opaque action receipt only after H2 close and both EOFs, then records it in a separately namespaced file.

After requester A terminal absence, H2 must classify original server A/group/socket exact-live. After server-A kill-control terminal absence, it must classify original server A/group absent and retain the socket's exact absent/stale generation facts. Any helper error, malformed/multiple/mismatched row, target-race action failure, changed generation, result-conditioned schedule/input, early receipt parse, or observer capability violation is FAIL. H2 proves host observations only, never reconciliation/lease/CAS/retry policy.

## H3 — requester/owner physical identities

Requester A and B must be simultaneously observable as distinct no-auth gate-closed direct identities. Only A is released for the first read-only action. B may be released only after A's original handle close, both EOFs, and exact identity/group absence. B then executes its own read-only action against the still sampled exact-live server A and reaches the same terminal predicates. If server A disappeared, the `-N` race rule yields primary FAIL without autostart.

Retain exact PID/start/uid/PGID/comm/binary records, gate/release ordering, immutable vectors, precondition receipts, raw bounded outputs, and terminal absence. H3 proves physical separation/successor feasibility only; it does not implement lease/CAS ownership, takeover policy, stopped-actor fencing, or two-cleaner rejection.

## H4 — controller-owned marked topology and teardown-order counterexample

Each pane's create-only request causally identifies its pane anchor and public marker. Only after validation may the controller spawn the corresponding marked companion and obtain its direct handle/new PGID. A companion must be fully self-recorded and controller-validated before either branch becomes answerable.

- **Server-first A:** while marked companion A is exact-live, the server-A kill control targets sampled exact-live server A. Primary evidence must show server A and ordinary pane A absent while direct marked companion A remains exact-live. Latch the unsafe-order finding, then terminate/reap companion A through its original controller handle/group. Containment cannot erase the primary finding.
- **Descendant-first B:** create `abort-latch.json` once, reject every later pane request/companion spawn, close all unreleased creator pipes, terminate/reap direct marked companion B and anchored pane B, and prove both groups absent while original server B remains exact-live. Then and only then release the preregistered server-B kill control as the final authorized tmux action. After its handle closes, both EOFs arrive, and its identity/group plus server B/group are absent, create `action-fence.json`. No tmux process may be spawned or released after `action-fence.json`.

The abort latch and terminal action fence are distinct monotonic records with exact allowed transitions. A late pane request after abort latch is retained/rejected before marked spawn. A companion record failure is contained through its pre-existing original direct handle. An unrecorded or unvalidated companion can never satisfy H4 primary evidence or authorize PID adoption.

## H5 — passive terminal continuity

After `action-fence.json`, every creator/release pipe is closed and no tmux action occurs. H5 retains and recomputes exact absence of every registered requester, control, server, pane, marked companion, helper, PID, and PGID; validates/removes each unchanged owned stale socket only after all creators/processes/groups are absent; performs two equal bounded passive inventories separated by a no-action interval; retains a bounded final process transcript; and proves protected/worktree equality below.

H5 explicitly states that no-autostart is supplied by E1 plus the reviewed option-level inference, not freshly reproved by passive absence. Survivor, ambiguity, observer error, new socket generation, protected/worktree drift, fallback-derived primary claim, missing bytes, or any post-action-fence tmux process is FAIL.

# Exact protected-state and worktree authority

The host binding is real home `/Users/brian` whose `lstat`, `realpath`, uid, and directory mode are retained before spawn; spawned processes never receive it as HOME/config/cache. Snapshot targets are exactly:

1. full bounded metadata/content trees: `/Users/brian/.claude.json`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks`, `.codex/config.toml`, `.codex/hooks`, `.config/opencode`, `.agentstate/credentials.json`, `.agentstate/handoffs/v1`, and `.npmrc`;
2. metadata-only npm sentinel: `/Users/brian/.npm` root plus sorted immediate-child names and each child's lstat tuple, never recursive content;
3. feature worktree: canonical `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, branch `feat/precompact-handoff-v3`, exact HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`.

Absent protected targets are valid only as an explicit absent tuple. Any present symlink, non-current owner, special file, traversal outside its exact root, more than 4,096 recursive entries, more than 64 MiB total regular bytes, any regular file over 8 MiB, or npm sentinel over 256 immediate entries is `BLOCKED_PENDING_VERIFICATION` before spawn. Every full-tree row includes relative path, type, dev, inode, nlink, mode, uid, gid, size, mtime-ns, and regular-file SHA-256; ordering is raw-byte lexicographic. Directory metadata is included. Evidence contains only metadata/digests, never protected content.

Worktree observation uses `/usr/bin/git@sha256:179301dcb41ea78accc3fa0048a7e6f6710d891945a751a34addd622020c1818`, version `2.39.5 (Apple Git-154)`, with `--no-optional-locks`, disabled fsmonitor/untracked-cache/submodule recursion/external diff/textconv, and retains exact argv/env plus raw bounded bytes for HEAD/tree, branch, porcelain-v2 including all untracked names, staged/unstaged diffs, `ls-files -s -z`, and tracked-file lstat/content digests. It snapshots the resolved Git index metadata/digest before and after every Git helper and FAILs on helper-caused drift. Preflight requires exact clean bytes; H5 requires byte-identical snapshot. A missing exact path/SHA/branch/clean predicate is BLOCKED before the first helper spawn, not builder policy.

Preflight and baseline causality within the one admitted attempt are exactly:

1. Validate the exact exported execution-admission lineage, create-only exact root, and write/read back the admission-bound first record. In process, validate immutable source/tool/path identities and preregister every allowed preflight Git helper; no child has yet spawned.
2. In process, take and read back full protected snapshot `P0`, including worktree filesystem/index metadata that does not require Git output.
3. Run the fixed preregistered Git helpers sequentially. Each must close with both EOFs, exact process/group absence, bounded raw output, and equal before/after resolved-index metadata/digest. No other child or helper class may spawn.
4. In process, take and read back protected snapshot `P1`. Require canonical `P0 == P1`, every per-helper index guard equal, and the Git receipts to prove the exact clean worktree/branch/SHA/tree predicates.
5. Freeze `baseline.json` as `{admission_digest, campaign_id, P1_digest, git_receipt_digests, worktree_digest, helper_manifest_digest}` and read it back. Only after this successful transition may the first server/client/pane/companion/H2-observer/ordinary-observer principal spawn.

Any P0/P1 difference, helper/index drift, helper error, unexpected child, or incomplete clean receipt after the first helper spawn is terminal FAIL; it is never accepted into P1. Protected/worktree snapshots repeat after each H4 branch and after all terminal evidence, and compare to the frozen baseline. Drift is recorded and never restored. The npm sentinel claim is metadata-only and may not be described as full cache continuity.

# Construction guard

- One clean-room script with exactly four named question functions H2-H5 plus controller/event-writer/teardown and explicit child modes; at most 800 nonblank/noncomment source lines. Inability to fit is unfrozen FAIL, never permission to weaken.
- One admission-bound unpredictable initially absent 0700 `/private/tmp` run root and campaign id; 0600 regular evidence; immutable reviewed source/admission digests; every failed/blocked root retained; no symlink traversal or second conforming invocation.
- Exact pinned Darwin arm64, Node 25.2.1, tmux 3.6b, `/bin/ps@sha256:472992c470606d28f577590decfecd7f4a20f832fd92c671bebc6d44790b5d02`, and `/usr/bin/git@sha256:179301dcb41ea78accc3fa0048a7e6f6710d891945a751a34addd622020c1818` realpaths/digests/versions. `process.execve` is required.
- Two servers, two fixture clients/panes, two requesters, two server-kill controls, and two direct marked companions. No other action client or indirect child exists.
- Every direct principal, including preflight helpers, is preregistered before its spawn and terminated/reaped only through its original live handle. Probe action principals are additionally gate-closed before release. No current/audit PID adoption. Signals require a fresh exact anchor and remain a sampled non-malicious-same-UID bound, not atomic safety.
- Finite phases are `ADMITTED -> PREFLIGHT_P0 -> PREFLIGHT_GIT -> BASELINE_FROZEN -> PRIMARY -> ABORT_LATCHED -> DESCENDANTS_DRAINED -> FINAL_SERVER_ACTION -> ACTION_FENCED -> DRAIN -> CHECK_1 -> CHECK_2 -> TERMINAL`; branch A completes during PRIMARY. No transition reaches `BASELINE_FROZEN` on P0/P1/index/helper inequality. After `PREFLIGHT_GIT` begins, timeout/ambiguity is terminal FAIL plus containment. One cumulative creator-relative deadline/round budget covers abort through terminal.
- Helpers use absolute reviewed vectors, one live helper at a time, bounded output/time/count, SIGKILL and reap through original handles. Raw canonical JSONL plus strict manifest/index/terminal receipt retain exact causal bytes and recomputable digests.
- No Claude, API key, OAuth, normal/global auth, network, host npm cache use, repository/Plan/task/bundle/code mutation, arbitrary shell/executable, manual cleanup dependency, or failed-evidence deletion.

# Verdict algebra and gates

- **Boundary PASS:** both independent reviewers accept the exact option-level E1 inference, H2 noninterference, direct-companion H4 scope, two-fence ordering, pinned continuity authority, P0/Git/P1 causality, cooperative one-shot/rebaseline governance, and explicit non-cryptographic threat boundary as complete and implementable.
- **Script PASS:** only after boundary dual PASS, a clean-room builder authors but does not execute immutable bytes; separate product/acceptance and skeptic reviewers both PASS the exact script.
- **Evidence PASS:** only after script dual PASS may exact bytes run. Every H2-H5 primary/containment/continuity predicate and E1 binding passes; an independent auditor recomputes the verdict from retained bytes.
- **FAIL:** any false/ambiguous/missing oracle, disallowed vector/action, stronger claim, survivor, drift, auth/global fallback, result-conditioned H2 input, unowned marked process, primary fact manufactured by cleanup, or contract violation.
- **BLOCKED_PENDING_VERIFICATION:** only before the first preflight-helper spawn, a mandatory immutable/admission/P0 input cannot safely pass. The one-shot admission is consumed. From the first helper spawn onward every ambiguity/failure is terminal FAIL plus bounded containment. Neither verdict permits automatic retry or fallback by the conforming workflow.

Only boundary dual PASS permits a builder task. Only evidence-audit PASS permits replacement-Plan synthesis, which still needs exact dual review before implementation. No Claude/auth action, candidate freeze, R0/Q0/L0-L3 advance, G0 acceptance, or feature-code mutation is authorized here.

[implements decision](../decisions/precompact-v3-t35-reuse-v5-no-autostart.md)

[tracked by](../tasks/pre-compact-multi-session.md)
