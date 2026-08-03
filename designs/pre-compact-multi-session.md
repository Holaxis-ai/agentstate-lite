---
type: Design
title: Multi-session-safe pre-compaction handoff notes
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:01:08.851Z'
---
# Multi-session-safe compaction handoffs — revision 3

**Status:** implementation-ready draft, 2026-08-03. Revision 2 remains rejected. No user-global hook or instruction change is authorized by this document. Revision 3 is a Claude Code-only pilot and is accepted only by exact-artifact manual and automatic live compaction.

## Purpose and product claim

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: ship one executable Claude Code lifecycle authority that preserves a validated, identity-bound evidence card across compaction and proves the complete rail on the installed host. This serves the ultimate goal by removing a silent context-loss boundary without adding heuristics, board conflicts, or permanent human supervision.

The pilot's claim is deliberately narrow:

- On a machine where Claude Code and agentstate-lite are installed, a main or sub-agent compaction gets one private, exact-identity handoff generation.
- PreCompact durably prepares and reads back that generation before compaction is allowed.
- SessionStart with `source: compact` restores only that generation through Claude's supported model-context channel.
- The first later Stop/SubagentStop acknowledges delivery through CAS; bounded GC physically retires old records.
- Host-local handoffs never enter the project bundle, git, the shared board, catalog, or sync.

Codex and OpenCode compaction handoffs, cross-machine restoration, public handoff commands, orchestrator leasing, and board-shared ephemeral generations are non-goals. Their ordinary SessionStart board orientation remains supported, but hook status must say `compaction_handoff.supported: false` for those runtimes.

## Installed-host evidence that changes the architecture

The exact installed artifact is Claude Code `2.1.220` (commit `4073f59596e2`). A temporary configuration and scratch project exercised real manual and automatic compaction without touching user-global settings.

Observed manual and automatic order was:

```text
PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop
```

A two-second delay inside SessionStart delayed PostCompact by the same two seconds; PostCompact began 57 ms after SessionStart returned. SessionStart therefore cannot wait for PostCompact. PreCompact also fires when Claude later declines manual compaction as "Not enough messages to compact," so prepare must be retryable. In the exercised short journeys, `PostCompact.compact_summary` was only the previous assistant reply (`FOUR` / `AUTO-END`), and the automatic compacted continuation lost earlier canaries. It is audit evidence, not the load-bearing decision card.

The supported SessionStart JSON form was accepted on real startup, resume, and compact events with no schema error. Automatic compaction was forced with a bounded effective window and produced `trigger: auto`, proving that the rail itself is invocable before component implementation.

Evidence: `context-notes/precompact-v3-live-rail-probe` and the official [Claude Code hook contract](https://code.claude.com/docs/en/hooks).

## One executable authority

All lifecycle policy belongs to a private `CompactionHandoffAuthority`. The Claude adapter only parses the documented hook payload, calls the authority, and maps its result onto an event-valid hook response. Identity construction, transcript extraction, schema validation, state transitions, CAS, selection, acknowledgement, and GC may not be duplicated in shell, prose, YAML snippets, or the adapter.

The installed command is the hidden `aslite hook run` subcommand. The same command handles Claude PreCompact, SessionStart, PostCompact, Stop, and SubagentStop based on stdin `hook_event_name`. For Claude SessionStart it also composes the existing board pull/home render so two managed handlers do not race or duplicate context.

## Placement and privacy

Handoffs are session-boundary runtime state, not shared project knowledge. The authority owns a private local OKF journal at `~/.agentstate/handoffs/v1` (test override permitted), initialized with 0700 directories. Its `Session Handoff` documents are protected by that directory boundary and never discovered as a project bundle.

The canonical project/bundle identity is stored in each record and hashed into its local namespace. The journal is excluded by construction from `.agentstate-lite`, git, board sync, remote backends, catalog, and home rendering. Compact summaries and transcript excerpts may contain secrets; no content or receipt may be printed by status, logs, or hook error messages. Receipts expose hashes, versions, lengths, stages, and reason codes only.

## Canonical execution identity

The ordered identity tuple is:

```json
["agentstate-lite-handoff", 1, "claude-code", "<exact session_id>", "<exact agent_id or null>"]
```

Each string is non-empty when present, at most 256 UTF-8 bytes, and contains no NUL or control characters. Values are not trimmed, case-folded, shortened, or path-normalized. `execution_key` is the full lowercase SHA-256 of the canonical tuple encoding; the slot id is `handoffs/v1/claude-code/<64-hex>`.

Every read recomputes the key and compares the full stored tuple byte-for-byte. A digest hit with a different stored identity is `IDENTITY_KEY_COLLISION`, never a match. No fallback uses actor, hostname, cwd, role, recency, a singleton candidate, or an id prefix.

`execution_role` is derived mechanically: missing `agent_id` means `main`; present `agent_id` means `subagent`. `agent_type` is advisory metadata. Actor may be absent. The pilot never infers or claims `orchestrator`; coordination role is advisory unless a future separate lease design proves uniqueness.

## Validated handoff record

The private journal declares a dedicated internal `Session Handoff` kind and also applies a domain validator. A record has a fixed schema version and rejects unknown keys, malformed timestamps, invalid enums, identity/hash disagreement, payload/body disagreement, and over-budget content.

Required envelope fields include:

- schema/runtime/project identity and full execution identity;
- full execution key and authority-owned UUIDv4 generation;
- state (`prepared`, `delivered`, or `acknowledged`), trigger, prepare/expiry timestamps, and current record version;
- typed decision card, payload SHA-256, deterministic human-readable body, and bounded transcript evidence metadata;
- delivery nonce/time when delivered and acknowledgement time/evidence hash when acknowledged.

PostCompact may add only bounded audit fields: summary hash, original length, a capped excerpt, trigger, and observed time. It does not become the restored payload.

### Decision-card contract

The card always has these fixed slots:

1. goal and task references;
2. current state and last completed work;
3. decisions and supporting evidence;
4. constraints and non-goals;
5. blockers and open questions;
6. loaded skills;
7. assumptions and unverified claims;
8. one exact next action or command.

Each slot is either `observed` with literal source excerpts/references or `unknown` with a reason. Unknown is valid evidence discipline; invented semantic completion is not. The payload also carries a bounded, ordered excerpt of recent user/assistant text so the model can inspect evidence directly.

PreCompact builds the card deterministically from the transcript JSONL available before compaction:

- retain the current prompt, last completed assistant response, and most recent visible text turns within the injection budget;
- collect literal OKF ids such as `tasks/...`, exact labelled goal/decision/constraint/blocker/assumption/next-action lines, and named Skill tool invocations;
- attach source message UUIDs/positions and hashes; never summarize with another model;
- mark any unproved slot unknown.

The stored record may keep a larger capped card, but SessionStart additional context must remain below 8,000 characters, leaving headroom under Claude's 10,000-character hook limit. Truncation is deterministic, preserves the current prompt and exact next action first, and is disclosed in the receipt.

## State machine and generation safety

There is one CAS-governed slot per exact execution identity. It is single-occupancy, not last-writer-wins.

### PreCompact — prepare or refresh

1. Resolve the local project bundle only to bind project identity; a project with no agentstate-lite bundle is an intentional no-op.
2. Validate the live identity and transcript; build and validate the evidence card.
3. Run the bounded GC sweep.
4. If the slot is absent, acknowledged, or expired, CAS-write a new generation. If it is still `prepared`, refresh that same generation through CAS because a prior host attempt may have been declined after PreCompact. If it is `delivered` and unacknowledged, return `HANDOFF_IN_FLIGHT` and block rather than overwrite it.
5. Read the just-written version back, revalidate identity/schema/hash, and produce a prepared receipt.

Any identity, persistence, validation, CAS, or read-back failure returns an event-valid PreCompact block. Shell dependencies such as jq, date, hostname, and heredocs do not exist.

### SessionStart compact/resume — exact delivery

For `source: compact`, exact-read the slot, validate every invariant and expiry, then CAS-mark the same generation `delivered` with a fresh delivery nonce. Only after that write succeeds may the authority return the bounded decision card through `hookSpecificOutput.additionalContext` alongside the existing board/home context.

Missing, corrupt, expired, ambiguous, or mismatched state on a bundle where the managed rail is active returns top-level `continue: false`; SessionStart exit code 2 is not treated as a gate by Claude. No unverified record becomes a model premise.

For `source: resume`, a prepared or delivered but unacknowledged exact generation is redelivered; this recovers interruption before acknowledgement. Startup and clear render ordinary board orientation and never select another session's handoff.

### PostCompact — non-load-bearing audit

PostCompact exact-reads the same generation and CAS-attaches only bounded host-summary audit fields. It preserves state and delivery nonce. It cannot block, and its failure never causes SessionStart to trust missing data; the prepared card was already delivered. A structured, content-free diagnostic is recorded for later status/QA.

### Stop/SubagentStop — executable acknowledgement

The first main Stop or sub-agent SubagentStop after delivery exact-reads the current record, verifies full identity, generation, delivery nonce/state, and current version, then CAS-marks it `acknowledged`. `last_assistant_message` is hashed as evidence that a post-delivery model response completed; content is not copied into receipts. User interruption produces no Stop, so the record remains redeliverable.

Acknowledgement does not immediately delete the record. This keeps the transition auditable and avoids delete-before-context hazards. A stale acknowledgement or GC worker cannot mutate a newer generation because every write/delete is based on the version from its own exact read and checks generation/state again.

## Garbage collection

`CompactionHandoffAuthority.gc` is the named physical-GC owner. It runs on prepare and SessionStart and is callable through an internal maintenance seam for tests.

- Acknowledged records are eligible after 24 hours.
- Prepared or delivered records expire after a fixed seven days; callers cannot extend expiry.
- The sweep orders by eligibility then id, inspects a bounded candidate set, and CAS-deletes at most 25 records per invocation.
- The current slot may collect its own expired record even when the global cap is exhausted.
- Version conflicts are skipped without deleting the newer value. Malformed records are retained and reported for inspection rather than guessed safe to delete.

## Managed-hook installation

Claude installation manages exactly one `aslite hook run` command for each of PreCompact, SessionStart, PostCompact, Stop, and SubagentStop. Reinstall is idempotent, collapses duplicate managed entries, migrates the current managed SessionStart command, and preserves every foreign hook and malformed-file refusal guarantee. Uninstall removes only managed entries from every managed event.

Codex and OpenCode retain their existing SessionStart board integration. Install/status receipts distinguish board orientation from compaction handoff capability and report Claude supported/installed versus Codex/OpenCode unsupported. A foreign legacy compaction script is never silently removed; status warns that multiple compaction handlers exist so the user can retire it deliberately.

## Failure and observability contract

The authority returns structured internal receipts with runtime, execution-key hash, generation, stage, record version, payload hash/length, outcome, and reason code. Hook adapters emit only fields legal for that exact Claude event. Expected reason codes include `UNSUPPORTED_RUNTIME`, `UNSUPPORTED_IDENTITY`, `HANDOFF_SCHEMA_INVALID`, `HANDOFF_IN_FLIGHT`, `STALE_RESTORE`, `HANDOFF_NOT_FOUND`, `HANDOFF_EXPIRED`, `IDENTITY_KEY_COLLISION`, `HANDOFF_STORE_UNSAFE`, and `HANDOFF_STORE_CORRUPT`.

No content-bearing fallback is automatic. There is no newest-record selection. Operator recovery is inspectable and local; corrupt or unacknowledged records are preserved until an explicit safe transition or GC eligibility.

## Acceptance criteria

Automated tests must cover first/repeated compaction, old-prefix collisions, concurrent mains, sibling sub-agents, prepare refresh after declined compaction, malformed fields, transcript truncation, stale delivery/ack/GC, every interruption boundary, missing executable/dependencies, permissions and symlink attacks, hook migration, privacy scans, and true multi-process contention.

The exact candidate artifact must then pass, in order:

1. repository/package gates;
2. independent exact-SHA Review;
3. adversarial QA of that reviewed SHA;
4. isolated installed-host manual compaction;
5. separate real automatic context-pressure compaction.

Both live journeys must prove full-identity receipt continuity, card canary restoration, post-model acknowledgement, CAS safety, 0700/private local placement, no project/global configuration mutation outside the isolated target, and truthful unsupported-runtime status. An external inability to exercise a journey is `BLOCKED-PENDING-VERIFICATION`, which blocks merge. A rejected output, missing/out-of-order transition, wrong restore, privacy leak, or canary failure is FAIL.

## Related

- [task](../tasks/pre-compact-multi-session.md)
- [scout research](../context-notes/research-precompact-multisession.md)
- [skeptic review](../context-notes/review-precompact-multisession.md)
- [user-notices](../designs/user-notices.md)
