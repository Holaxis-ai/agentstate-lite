---
type: Context Note
title: 'Revision 3 lifecycle research: Claude Code 2.1.220 compaction rail'
actor: codex-precompact-v3-lifecycle
timestamp: '2026-08-03T17:43:39.781Z'
---
# Summary

status: completed

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets, in plain text and owned by the user.

Proximate goal: determine a supported, testable Claude Code 2.1.220 lifecycle rail and isolated live-compaction acceptance harness; this serves the ultimate goal by making compaction handoffs durable, observable, and fail-closed at the session boundary.

Recommendation: implement a Claude-only, two-phase hook rail owned by one executable authority: PreCompact durably prepares an immutable generation and blocks on ordinary write failure; PostCompact CAS-finalizes that same generation with the runtime-supplied `compact_summary`; SessionStart `source=compact` exact-reads it and injects a bounded restore receipt/context, while missing or invalid evidence stops processing with top-level `continue:false`. Retain the generation through explicit acknowledgement and bounded GC; never delete immediately.

Confidence: medium-high. The event inputs/outputs and blocking/context surfaces are official and the installed version is exactly 2.1.220. The remaining uncertainty is intentionally an acceptance probe, not an implementation guess: the exact installed ordering of PostCompact versus SessionStart, command-hook timeout treatment, and end-to-end manual/automatic behavior must be recorded by the isolated live harness before adoption.

## Recommended rail

### Canonical identity and placement

- Scope the pilot explicitly to Claude Code 2.1.220. Codex and OpenCode keep the existing board-orientation SessionStart integration but are unsupported for compaction handoffs until independently proven.
- Canonical execution identity is the exact structured tuple `claude-code/v1`, full non-empty `session_id`, and full non-empty `agent_id` when present. `agent_type`, actor, role, hostname, cwd, and recency are advisory discriminators only. Hash the canonical bytes with SHA-256 for a path-safe key and store the exact original tuple for mandatory equality checks on every read.
- Main identity is `(runtime, session_id)`; subagent identity is `(runtime, session_id, agent_id)`. Do not assume `transcript_path` points to the child transcript: the common hook contract exposes `agent_id`, while only SubagentStop separately exposes `agent_transcript_path`.
- Give every compaction an immutable random generation UUID allocated by the authority. The runtime exposes no documented compaction-event ID, so a per-identity CAS pointer owns the single in-flight generation; zero or multiple eligible pending generations is an error, never a recency guess.
- Store the ephemeral ledger locally, adjacent to or derived from `transcript_path`, outside the project board and outside `aslite sync`. Use 0600 files/0700 directories. This prevents summaries and lifecycle churn from entering the shared board. The authority may later promote unique decisions into the project bundle, but the operational ledger is local-only.

### Exact event sequence and responsibilities

1. **PreCompact (`manual` or `auto`) — prepare and preflight.** The single managed command parses stdin, validates event name, full identity, trigger, cwd/transcript scalar fields, and optional `prompt_id`; creates immutable generation G plus an in-flight pointer with CAS; records `custom_instructions`, transcript path/hash/observed byte length, timestamps, runtime version, and a deterministic metadata envelope. It rereads the exact bytes/version and records a write receipt. Transcript content is not treated as authoritative because the official contract says transcript writes are asynchronous and may lag. On success, return exit 0 with no unsupported fields. On validation/CAS/write/readback failure, print one safe reason to stderr and exit 2 so PreCompact blocks. Never return `additionalContext` here.
2. **Claude compacts.** For manual compaction this follows `/compact`; for automatic compaction it follows the proactive/full-context trigger. No project or global files are mutated by the handoff authority beyond its local ledger.
3. **PostCompact — finalize.** The same executable derives the same exact execution identity, resolves the one in-flight generation, verifies trigger and any optional correlation fields, validates `compact_summary` as a non-empty bounded string, and CAS-transitions G from `prepared` to `ready` with the exact summary plus its length/hash and a readback version receipt. PostCompact cannot block or change the compaction result; failure must therefore remain visible as a failed/missing ready receipt for the next step. Never return `additionalContext` here.
4. **SessionStart `source=compact` — restore gate.** The same executable exact-reads G by the live identity, compares the stored full tuple, requires `ready` plus the PostCompact version/hash receipt, and CAS-marks it `delivered`. It returns supported `hookSpecificOutput.hookEventName="SessionStart"` plus bounded `additionalContext` containing generation, exact record/version, a restore nonce, essential metadata, a bounded excerpt, and an exact local locator. Do not duplicate an arbitrarily large `compact_summary`: Claude Code already installs its generated compact summary into the compacted conversation, and hook output is capped at 10,000 characters. If G is absent, ambiguous, still `prepared`, malformed, or identity-mismatched, return top-level `{"continue":false,"stopReason":"...repair command..."}` so no next model request proceeds.
5. **Ordinary resume recovery.** A SessionStart `source=resume` handler checks the same identity for a `ready`/`delivered` but unacknowledged generation and re-surfaces it. Ordinary resume reuses the original session ID. `source=fork` is a new session ID and exposes no documented parent ID, so it must not auto-inherit the original handoff.
6. **Acknowledgement and consume.** The first post-compaction model turn is instructed to call the authority with G, exact version, and restore nonce. Acknowledge is a version-guarded state transition, not deletion. If the model never acknowledges, the record remains recoverable and is surfaced on resume. A short Stop-hook guard is optional if the product wants to force acknowledgement before the first post-compact turn can end; it must call the same authority.
7. **GC.** The authority runs a bounded sweep after its foreground lifecycle action on SessionStart/PreCompact: delete only CAS-matching acknowledged generations older than a short diagnostic window (for example 24 hours) and expired abandoned/unacknowledged generations after a longer window (for example 7 days). Cap rows/time per sweep and record deletion receipts. Expiry is a selection rule until this sweep exists; do not call metadata alone GC.

This rail gives one executable owner of validation, identity, generation allocation, CAS, receipts, restore, acknowledgement, and GC. Hooks are adapters, not duplicate shell algorithms.

## Alternatives

### A. PreCompact-only direct write/block — viable recovery envelope, rejected as primary

Sequence: PreCompact snapshots the visible transcript/metadata, persists a handoff, readbacks a receipt, then exits 0 or blocks with exit 2; SessionStart restores it after compaction.

Benefit: the write is before destructive summarization and ordinary errors can block. Failure trace: the transcript is written asynchronously and may lack the current turn; PreCompact receives no model-authored summary and cannot inject a turn asking the model to author one. A successful write can therefore be durable but semantically incomplete, especially for automatic compaction. Use this only as the `prepared` safety envelope in the recommended two-phase rail.

### B. PostCompact direct write + SessionStart restore — viable minimal rail, second choice

Sequence: PostCompact creates a generation from `compact_summary`; SessionStart exact-reads it and either injects context or returns `continue:false`.

Benefit: uses the exact runtime-generated summary and avoids transcript lag. Failure trace: PostCompact has no decision control; a write/CAS timeout cannot undo compaction. SessionStart can stop the next model request, but there is no pre-compaction evidence that the ledger was writable and no preallocated generation to correlate repeated/interrupted compactions. This is acceptable only if the team consciously drops the preflight requirement and retains the SessionStart hard gate.

### C. Unsupported/rejected rails

- PreCompact or PostCompact `hookSpecificOutput.additionalContext`: schema-invalid on these events; rejected empirically twice by installed 2.1.220.
- Agent-authored heredoc triggered by PreCompact: no model/tool turn exists at that event.
- Full-summary injection from SessionStart without a bound: hook strings are capped at 10,000 characters; one installed transcript's compact summary was 20,395 characters.
- Immediate `doc delete`: loses forensic evidence and is generation-unsafe unless guarded by the exact read version; retention plus acknowledgement/GC is safer.
- Actor/hostname/role/newest fallback: not identity proof. Automatic restore fails closed when full runtime identity is absent.

## Runtime contract

### Inputs

- All hooks: `session_id`, `transcript_path`, `cwd`, `hook_event_name`; optional `prompt_id` after first input; optional `permission_mode`; `agent_id` and `agent_type` when inside a subagent (`agent_type` also appears for `--agent`). The transcript may lag the in-memory conversation.
- PreCompact: `trigger: "manual"|"auto"`; `custom_instructions` contains `/compact` arguments for manual and is empty for auto.
- PostCompact: same trigger plus `compact_summary`, the generated conversation summary.
- SessionStart: `source: startup|resume|clear|compact|fork`; optional `model`, `agent_type`, `session_title`. Since 2.1.214, fork reports `fork`; ordinary `--resume`/`--continue` reports `resume`.

### Supported outputs and failure semantics

- PreCompact supports top-level `decision:"block"`/`reason` or exit 2. Exit 2 blocks manual and automatic compaction; proactive auto-compaction is skipped, while recovery after an API context-limit error surfaces the underlying error. Exit 1/other nonzero is non-blocking for most events and must not be used for enforcement.
- PostCompact is side-effect-only. It has no decision control and exit 2 only shows stderr to the user.
- SessionStart supports plain stdout context or `hookSpecificOutput.additionalContext`; top-level universal `continue:false` stops processing entirely. SessionStart exit 2 does not block and Claude does not see its stderr, so it is not a restore gate.
- Hook JSON is parsed only on exit 0 and stdout must contain only the JSON object. Hook strings are capped at 10,000 characters.
- Command hooks default to 600 seconds; the repository's current installer explicitly sets 10 seconds. All matching handlers run in parallel. Install exactly one managed lifecycle handler per event and keep it synchronous. Command-timeout behavior as a PreCompact policy gate is not explicitly documented; acceptance must fault-inject a hang. The SessionStart backstop remains mandatory even if ordinary PreCompact failures block.

### Ordering and observed installed evidence

The supported lifecycle is PreCompact before compaction, PostCompact after compaction completes, then SessionStart with `source=compact` before the next model request. The first two positions are explicit in official event definitions; SessionStart `compact` is the documented post-compaction context event. Installed-version mutual ordering of PostCompact and SessionStart is an acceptance assertion to record, not assume.

Installed empirical evidence: `claude --version` is `2.1.220`. Manual transcript `f6a09fcd-9c53-43e7-a548-1354d721787a.jsonl` records a `compact_boundary` with `trigger:manual`, 161,970 ms duration, then an `isCompactSummary:true` user record of 20,395 characters; the compact notice records PreCompact validation failure before PostCompact validation failure. Both failed because they returned unsupported `additionalContext`. The transcript ordering/timestamps are asynchronous enough that they must not be used as the lifecycle lock.

### What `compact_summary` can and cannot supply

It supplies the exact model-generated summary string after successful compaction and is the best semantic payload exposed to hooks. It does not supply a durable receipt, canonical identity, generation ID, actor/role authority, acknowledgement, GC state, or proof that every prior decision/constraint was preserved. Treat it as opaque, lossy model output wrapped in validated lifecycle metadata; do not claim it satisfies a fixed decision-card schema without a separate validator/model pass.

## Isolated live harness (do not run until implementation is reviewed)

### Isolation/bootstrap

Use a fresh root such as `/private/tmp/aslite-claude-compact-v3.XXXXXX` with subdirectories `claude-config`, `codex-home`, `xdg`, `project`, `handoff-store`, `receipts`, and `logs`. Set all of these before installer/runtime invocation:

```sh
CLAUDE_CONFIG_DIR="$HARNESS_ROOT/claude-config"
CODEX_HOME="$HARNESS_ROOT/codex-home"
XDG_CONFIG_HOME="$HARNESS_ROOT/xdg"
AGENTSTATE_LITE_HANDOFF_ROOT="$HARNESS_ROOT/handoff-store"
AGENTSTATE_LITE_HOOK_TRACE="$HARNESS_ROOT/receipts/hook-events.jsonl"
```

Run the feature-branch CLI installer with those environment values and `hook install --scope global`; inspect the generated Claude settings and confirm one managed command per PreCompact, PostCompact, and SessionStart lifecycle role, absolute/exec-form invocation, 10-second timeouts, and no writes outside the harness roots. Keep the scratch cwd outside any git repo so project settings/CLAUDE.md cannot leak in, and launch Claude with `--setting-sources user`, `--no-chrome`, no MCP config, and the minimum tools needed for acknowledgement.

First run `claude --init-only` under the isolated environment. This exercises SessionStart without starting a conversation/model turn and should produce only a startup trace, no handoff. Direct JSON-to-authority component/fault probes also use no model/API.

Environmental limitation: `CLAUDE_CONFIG_DIR` relocates credentials as well as settings/history. A fresh directory may not share the user's existing OAuth login. Prefer an already-provided `ANTHROPIC_API_KEY`; otherwise perform `claude auth login` under the temporary config directory. Do not copy/symlink the primary config or credential files. Authentication/bootstrap may use network/browser but does not touch active transcripts.

### Manual acceptance

1. Generate a unique UUID and launch a PTY/tmux interactive session under the isolated environment with `claude --session-id <uuid> --setting-sources user --no-chrome --debug-file <harness>/logs/manual.debug`.
2. Submit a short prompt containing unique goal/constraint/next-step sentinels and let Claude answer. This is a model/API call.
3. Send `/compact v3-manual-<nonce>: preserve the goal, constraint, and next step`. There is no documented standalone/non-interactive `claude compact` subcommand in installed help; PTY automation of the interactive `/compact` command is the practical supported trigger. Compaction invokes the model/API to generate the summary.
4. After the compact notice, submit a prompt asking Claude to report the restore generation/version/nonce and acknowledge it with the authority. This is another model/API call and proves the SessionStart context reached the first post-compaction request.
5. Exit, then launch ordinary `--resume <uuid>` and verify `source=resume`, the same session ID, and no duplicate restore after acknowledgement. Launch `--resume <uuid> --fork-session` and verify `source=fork`, a new session ID, and no automatic inheritance. Starting/resuming itself need not send a model request until a prompt is submitted.

### Automatic acceptance

Use a separate UUID/store and set:

```sh
CLAUDE_CODE_AUTO_COMPACT_WINDOW=50000
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
```

The official variables make proactive auto-compaction occur earlier; the percentage only lowers the threshold and applies when the explicit auto-compact window is set. Use persisted print-mode turns for a bounded, machine-readable run:

```sh
claude -p --session-id "$SID" --setting-sources user --tools "" \
  --output-format stream-json --include-hook-events --max-turns 1 \
  --max-budget-usd "$PER_RUN_BUDGET" "Remember auto-v3-<nonce> and reply briefly" \
  > "$HARNESS_ROOT/logs/auto-0.jsonl"

claude -p --resume "$SID" --setting-sources user --tools "" \
  --output-format stream-json --include-hook-events --max-turns 1 \
  --max-budget-usd "$PER_RUN_BUDGET" \
  < "$HARNESS_ROOT/fixtures/bounded-filler.txt" \
  > "$HARNESS_ROOT/logs/auto-1.jsonl"
```

Repeat the bounded filler turn only until the hook trace records `trigger:auto`, with a predetermined maximum number of turns/budget. Every `-p` turn and the compaction summary use model/API capacity; `--include-hook-events` only exposes lifecycle events. If 50k/50% does not trigger on the chosen model/baseline, lower `CLAUDE_CODE_AUTO_COMPACT_WINDOW` in a fresh session and record the value; do not use `CLAUDE_CODE_MAX_CONTEXT_TOKENS` for recognized Claude models because official docs say it only takes effect with all compaction disabled.

### Receipts/observations that prove acceptance

- Monotonic hook trace shows, for the same full identity and generation: PreCompact(`manual` or `auto`) success receipt -> PostCompact matching trigger with summary length/hash and ready version -> SessionStart `source=compact` delivery receipt. Record actual order rather than relying on transcript line order.
- PreCompact version can be reread before compaction; PostCompact CAS consumes that exact prepared version; stored summary hash equals the hook input hash.
- SessionStart output is schema-valid, under 10,000 characters, and names exact generation/version/nonce; the first post-compact model reply reports/acknowledges that nonce.
- Transcript contains `compact_boundary.compactMetadata.trigger` and `isCompactSummary:true`; manual and auto receipts are distinct immutable generations.
- Ordinary resume keeps identity; fork changes identity and does not restore the parent; a subagent auto-compaction probe records `agent_id` and does not collide with main.
- Red probes: unwritable/CAS-conflicted PreCompact blocks and creates no compact boundary; forced PostCompact failure is followed by SessionStart `continue:false` and no model response; identity mismatch, ambiguous pending generations, stale acknowledge, and stale GC delete all fail closed. Add a timeout-overrun probe because command-hook timeout blocking is not specified.
- Filesystem audit shows no harness writes outside the temporary config/store/log roots and no changes to the user's existing session/config timestamps.

## Implementation implications

- `packages/cli/src/commands/hook.ts`: extend Claude installation/status/uninstall to own PreCompact, PostCompact, and SessionStart restore while preserving the existing Codex/OpenCode SessionStart-only claim; use exec-form `command` + `args`, exact managed markers, one handler per event, reinstall migration, and truthful per-runtime status.
- New private lifecycle authority, likely `packages/cli/src/commands/handoff-hook.ts` plus a core service such as `packages/core/src/session-handoff.ts`: parse/validate hook envelopes; canonical identity; immutable generation/pointer; CAS transitions; receipts; bounded restore output; acknowledgement; GC. Keep host adapters thin.
- `packages/cli/src/cli.ts` and `distribution-resources.ts`: hidden hook entrypoint dispatch. Add a small public/read-only `handoff status|acknowledge|repair` surface only if the model/operator needs a stable command; if public, update `reference.ts`, generated `packages/cli/SKILL.md`, and help agreement tests.
- Reuse `commands/session-start.ts`/home rendering inside the one Claude SessionStart owner rather than installing parallel managed handlers that race. Keep handoff ledger local so SessionStart board pull ordering is irrelevant.
- Tests: extend `packages/cli/test/session-start.test.ts` installer matrices; add lifecycle state-machine/unit/CAS/crash/interruption/identity tests; add exact per-event agreement rows and schema red probes. Add an opt-in live script under `scripts/` that is never part of ordinary offline `npm run check` because it spends model/API capacity.
- Durability caveat: current `FilesystemBackend.atomicWrite` is temp-write + rename and returns a hash version but does not call file/directory `fsync`. If “durable” includes power-loss durability, strengthen the owning core primitive to fsync temp then parent directory (with platform tests) or explicitly narrow the claim to atomic, process-crash-persistent local persistence. Do not claim fsync-level durability from the current receipt.
- Plugin bundle/version artifacts remain bot-owned on merge per repository policy; do not hand-rebuild them in the PR.

## Issues (severity-ranked)

1. **Critical — official + empirical:** PostCompact cannot block and SessionStart exit 2 cannot gate restoration. The rail must use PreCompact exit 2 for ordinary preflight failures and top-level SessionStart `continue:false` as the post-compaction backstop. Live failure injection is mandatory.
2. **High — official:** transcript writes may lag. A PreCompact-only semantic handoff can omit the latest turn; use it only for durable prepare metadata, never as proof of a faithful summary.
3. **High — official + empirical:** `compact_summary` is opaque/lossy and may exceed the 10,000-character hook-output cap (20,395 characters observed). Store it exactly, inject a bounded receipt/excerpt, and do not assert decision-card completeness.
4. **High — official + reasoned:** no compaction generation ID is exposed. The authority must allocate an immutable generation before compaction and resolve it via one CAS-governed in-flight pointer; ambiguity blocks.
5. **High — official:** all matching handlers run in parallel. Separate Pre/Post key algorithms or parallel SessionStart restore/home handlers reintroduce races; install one lifecycle authority per event and compose existing home behavior internally.
6. **Medium — empirical:** current filesystem receipts prove atomic visible bytes/version, not fsync-level power-loss durability. Narrow or strengthen the durability claim.
7. **Medium — official:** fork creates a new session ID and SessionStart exposes no documented parent ID. Never auto-restore an ancestor into a fork.
8. **Medium — environmental:** a fresh `CLAUDE_CONFIG_DIR` may lack authentication. The live harness is blocked until a temporary-config login or API key is available; do not fall back to the user's active config.
9. **Medium — official-gap:** command-hook timeout behavior as a PreCompact blocker is not specified. Internal deadlines reduce risk but do not cover forced process kill; test a real timeout and rely on the SessionStart hard gate as backstop.
10. **Medium — security/reasoned:** compact summaries may contain secrets. Keep the ledger local with strict modes, never sync it, hash/redact trace receipts, and bound GC.

## Official sources and exact local evidence

- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Environment variables / automatic compaction controls: https://code.claude.com/docs/en/env-vars
- Session resume, fork, transcripts, and `/compact`: https://code.claude.com/docs/en/sessions
- CLI flags including `--include-hook-events`, `--init-only`, `--fork-session`: https://code.claude.com/docs/en/cli-usage
- Context survival across compaction: https://code.claude.com/docs/en/context-window
- Subagent identity/transcript/auto-compaction behavior: https://code.claude.com/docs/en/sub-agents
- Config isolation with `CLAUDE_CONFIG_DIR`: https://code.claude.com/docs/en/claude-directory

Local evidence read-only: installed `claude --version`/`--help`; `~/.claude/settings.json`; the two hand-written compact scripts; the current repo hook installer/tests; manual compact transcript `f6a09fcd-9c53-43e7-a548-1354d721787a.jsonl`; current core filesystem write primitive.

Exact bundle note id: `context-notes/precompact-v3-lifecycle-research`.

Progress: research completed and recorded. No repository code, hooks, global settings, task status, active session, or sync operation was changed; only this assigned bundle note was written.
