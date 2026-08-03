---
type: Context Note
title: P0 installed-host lifecycle review — revision 3
actor: codex-precompact-v3-plan-lifecycle
timestamp: '2026-08-03T18:10:43.240Z'
---
# Summary

P0 installed-host lifecycle review — revision 3

status: FAIL

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether the revision-3 implementation plan can prove its load-bearing Claude Code compaction rail on the installed host; this serves the ultimate goal by preventing implementation from proceeding on an unproved lifecycle, migration, or durability assumption.

## Review basis

- Design: `designs/pre-compact-multi-session` at the requested exact version `sha256:8c661dcc49138c854db3dff875a46c4d69794167b8e18993047ae9dc72f6cd1c`.
- Plan: `plans/pre-compact-multi-session-v3` at `sha256:367bb958ae6dd13581ec11789311338e4b58c41cf2b4792b034093ab1a74d3a1`.
- Installed-host probe: `context-notes/precompact-v3-live-rail-probe` at `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`.
- Installed runtime rechecked during review: `claude --version` reports `2.1.220 (Claude Code)`.
- Repository evidence: `packages/cli/src/commands/hook.ts` and `packages/core/src/backend.ts`; read-only inspection of the current user-global `~/.claude/settings.json`.

## What passes

1. **The architecture now follows the observed installed order.** The live probe proves manual and automatic `PreCompact -> SessionStart(source=compact) -> PostCompact`, with PostCompact starting only after SessionStart returns. The design correctly makes the complete PreCompact record load-bearing, SessionStart the delivery event, and PostCompact audit-only. The plan explicitly requires this order in integration tests. This repairs the earlier documentation-derived but false Post-before-SessionStart assumption.
2. **The event-output mapping is conceptually correct.** PreCompact owns the event-valid block, SessionStart owns supported `additionalContext` and top-level `continue:false`, and PostCompact/Stop/SubagentStop are side-effect-only. Real 2.1.220 accepted SessionStart `additionalContext` for startup, resume, and compact. The 8,000-character internal budget leaves headroom below Claude's 10,000-character string limit.
3. **Declined compaction is modeled.** The probe proved PreCompact can run before Claude says `Not enough messages to compact`; prepared refresh instead of create-only blocking is therefore required and present in the design/plan.
4. **The manual and automatic happy-path harness is feasible.** The isolated probe already exercised real `/compact` and forced automatic compaction with temporary config/project roots and bounded environment controls. L0/L1 can therefore use an exact candidate artifact and canaries rather than mocks.
5. **PostCompact is no longer treated as restoration evidence.** The probe's compact summaries were only `FOUR`/`AUTO-END` and lost earlier canaries. The design correctly caps and hashes them as audit evidence without making them a model premise.

## Blocking findings

### B1 — current managed-command recognition would silently replace the installed foreign SessionStart setup hook

The plan and design require foreign hooks to survive and only managed commands to be migrated. Current `isManagedHookCommand` instead returns `command.includes("agentstate-lite") || NEW_BIN_COMMAND_RE.test(command)` (`packages/cli/src/commands/hook.ts:86-103`). The installed user-global SessionStart command begins with `printf`, but its human context text says `project agentstate-lite bundle`. Direct evaluation gave:

```json
{"containsLegacyMarker":true,"startsAslite":false}
```

Consequently the current install transform would classify that hand-authored `printf` command as managed, rewrite it in place, and violate both `foreign hooks survive` and the design's no-user-global-change posture. Uninstall can likewise delete it. Generic `golden settings tables` and `writer/recognizer agreement` do not make this installed collision explicit.

Required plan change before implementation:

- add a named T2 migration task to replace substring ownership with structurally anchored recognition of exact emitted legacy/new executable and subcommand forms;
- require exact positive fixtures for every real legacy writer form and exact negative fixtures for foreign commands that merely mention `agentstate-lite` or `aslite` in arguments/content;
- add the installed `printf` command verbatim as an install/status/uninstall preservation fixture and assert byte-for-byte survival;
- keep genuine legacy `agentstate-lite ... session-start` migration, new `aslite hook run` writer/recognizer agreement, managed duplicate collapse, and foreign legacy Pre/Post preservation as separate cases.

Without this task, T2 starts from a destructive ownership predicate and the plan's migration claim is false on the installed host.

### B2 — the fail-closed claim extends beyond what the host can currently prove when the command does not return a blocking result

The design says PreCompact durably prepares before compaction is allowed and that any persistence/validation failure returns an event-valid block. That is true only after the managed executable starts and returns the blocking form. A missing/moved executable, launch failure, abrupt kill, or timeout cannot return exit 2 or block JSON. The current installer writes a 10-second command timeout (`hook.ts:104-105`), while the plan requires QA to attack moved executables and rejects every silent continuation without a prepared record (`plan:101-103`). The plan contains no installed-host assertion for how 2.1.220 treats launch failure or timeout, nor a product precondition/narrowed claim if the host fails open.

Required plan/design change: add isolated exact-host red probes for (a) normal PreCompact block, (b) command launch failure, and (c) timeout/hang for both manual and forced-auto triggers. If 2.1.220 continues on launch failure/timeout, narrow the guarantee to an invocable/responding managed hook, make status/package health an explicit precondition, and change the impossible QA criterion. Event-specific time budgets must be explicit; SessionStart handoff delivery must not be placed behind a best-effort board pull that can consume the command budget.

### B3 — live gates prove happy-path output, but not the two failure outputs that carry the safety claim

L0/L1 require restored canaries and acknowledgement, but they do not explicitly execute a real installed PreCompact block or a real SessionStart `continue:false` failure. The old rail failed precisely because apparently plausible output was schema-invalid. Simulators and official documentation do not replace exact-artifact host acceptance for the load-bearing failure surfaces.

Required plan change: add candidate-artifact live red legs proving:

- an injected prepare/readback/CAS failure produces no manual or automatic compact boundary;
- a missing/corrupt/mismatched prepared record makes real SessionStart(compact) stop before any model response;
- the manifest records whether PostCompact runs after a stopping SessionStart, rather than assuming it;
- valid event JSON is recorded without content leakage.

These probes may share the isolated L0/L1 harness but are mandatory acceptance gates.

### B4 — the product claims real sub-agent compaction, but no real sub-agent compaction journey is required

The design claims a main **or sub-agent** receives an exact-identity generation and is acknowledged by Stop/SubagentStop. The installed probe exercised main-session manual/auto order only. The plan's simulator, sibling-subagent QA, and `one subagent identity` concurrency supplement can prove authority isolation, but the live acceptance text does not require forcing a real subagent compaction and observing PreCompact/SessionStart/PostCompact/SubagentStop identity continuity on 2.1.220.

Required plan change: add a real isolated subagent compaction live gate on the exact artifact, including full `agent_id`, event order, restored canary, and SubagentStop acknowledgement. If that journey cannot be made bounded/reliable, narrow the pilot claim and hook installation to main sessions until independently proven.

### B5 — `durably prepares` is stronger than the planned store proof

T1 says to reuse the filesystem backend and test process killpoints. Its `atomicWrite` writes a temp file and renames it (`packages/core/src/backend.ts:114-125`) but does not fsync the temp file or parent directory. Readback proves bytes visible to the current kernel/process; it does not establish power-loss durability. Killpoint tests prove interruption behavior, not storage persistence across power loss.

Required plan/design change: either add file-plus-directory fsync semantics for this journal with fault tests, or narrow `durably` to the exact process-crash/readback guarantee actually implemented and accepted.

## Nonblocking findings

1. The isolated live harness should record PTY automation and authentication as explicit prerequisites. The prior probe demonstrates feasibility, so this is operational detail rather than a gate blocker.
2. Preserve the installed foreign `printf` hook intentionally after B1 is fixed. Claude runs matching hooks in parallel, so add a coexistence test showing its extra SessionStart context does not change handoff selection or overwrite managed output. Do not silently absorb its policy into agentstate-lite.
3. SessionStart composition needs an explicit order: complete and validate handoff delivery first, then render the bounded best-effort board context, while emitting one final response. This does not repair command-level timeout fail-open, but it prevents board networking from being the ordinary critical-path dependency.
4. The plan should store the live manifests as local test artifacts/receipts, not in the shared OKF bundle, consistent with the privacy design.

## Gate verdict

FAIL. The installed event order, event roles, and manual/automatic happy-path harness are now sound, but P0 cannot pass while the current recognizer would delete/replace a real foreign hook and while exact-host failure outputs, timeout/launch behavior, real subagent compaction, and the stated durability level remain unproved or overclaimed. Resolve B1-B5 in the design/plan and rerun this lifecycle review before T0/T1/T2 production work.

confidence: high for B1 and the event-order/harness findings; medium-high overall because timeout/launch treatment is intentionally an acceptance unknown rather than inferred behavior.
