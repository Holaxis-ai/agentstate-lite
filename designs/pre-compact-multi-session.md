---
type: Design
title: Multi-session-safe pre-compaction handoff notes
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:29:30.731Z'
---
# Multi-session-safe compaction handoffs — revision 3

**Status:** review-revised draft, 2026-08-03. Revision 2 remains rejected. No user-global hook or instruction change is authorized by this document. Production code starts only after this exact design and its implementation plan pass the independent plan gate.

## Purpose and bounded product claim

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: ship one executable Claude Code lifecycle authority that preserves a validated, project- and execution-bound evidence card across compaction and proves the complete rail on one digest-pinned candidate. This serves the ultimate goal by removing a silent context-loss boundary without heuristics, board conflicts, or continuing human supervision.

The Claude Code pilot claims:

- An exact-host-verified main or sub-agent compaction gets one private generation bound to canonical project identity plus the complete Claude execution identity.
- Once the managed helper is successfully invoked, PreCompact CAS-publishes and reads back that generation before allowing compaction; SessionStart with `source: compact` restores only that generation through Claude's supported model-context channel.
- A later Stop/SubagentStop may record evidence that a new response followed delivery. It does not claim that Claude cryptographically acknowledged a delivery nonce, and it never authorizes destructive replacement of the current generation.
- Generations become ineligible for restore at fixed expiry; a named event-driven GC owner version-guardedly detaches expired heads and retires eligible records on the next authority invocation.
- Host-local handoffs never enter the project bundle, git, shared board, catalog, or sync.

The verified host artifact is the resolved Claude Code `2.1.220` Darwin/arm64 executable with SHA-256 `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`. The previously reported source commit is supplemental provenance, not a value exposed by the installed runtime and not a readiness key. Status distinguishes `verified_host`, `installed_unverified`, `not_installed`, and `unsupported_runtime`; it never generalizes the verified result to another executable digest, version, platform, or architecture. Codex and OpenCode compaction handoffs, cross-machine restoration, public content inspection, orchestrator leasing, and board-shared ephemeral generations are non-goals. Their ordinary SessionStart board orientation remains supported, while status reports their compaction handoff as unsupported.

The executable cannot control a host that never launches it or kills it at a host timeout. The fail-closed claim therefore starts at successful helper invocation. Install and status must run a schema/health probe of the exact installed helper and report `rail_ready: false` for a missing, moved, non-executable, timed-out, or unhealthy command. Exact-host red probes characterize Claude's launch and timeout behavior rather than disguising that boundary.

## Installed-host evidence that fixes the lifecycle

A temporary configuration and scratch project exercised real manual and automatic compaction without changing user-global settings. The observed order was:

```text
PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop
```

A two-second delay inside SessionStart delayed PostCompact by the same interval; PostCompact began 57 ms after SessionStart returned. SessionStart cannot wait for PostCompact. PreCompact also fires when Claude later declines manual compaction as “Not enough messages to compact,” so a prepared generation must be refreshable. In the exercised journeys, `PostCompact.compact_summary` was only the previous assistant reply (`FOUR` / `AUTO-END`), and the automatic compacted continuation lost earlier canaries. PostCompact is audit evidence, never the load-bearing decision card.

Real SessionStart `hookSpecificOutput.additionalContext` was schema-valid on startup, resume, and compact events. Real automatic compaction was forced with a bounded effective window and emitted `trigger: auto`. Still-unverified negative paths—real PreCompact block, real SessionStart `continue:false`, launch failure, and timeout—are mandatory candidate gates.

Evidence: `context-notes/precompact-v3-live-rail-probe`, `context-notes/precompact-v3-host-identity`, and the official [Claude Code hook contract](https://code.claude.com/docs/en/hooks).

## One executable authority and invocation boundary

All lifecycle policy belongs to a private `CompactionHandoffAuthority`. The Claude adapter parses the documented payload, calls the authority, and maps its result to fields valid for that event. Identity construction, project resolution, transcript extraction, validation, head/generation transitions, CAS, selection, response observation, diagnosis, recovery, and GC may not be duplicated in shell, prose, settings snippets, or the adapter.

The installed command is the private `aslite hook run` subcommand. The same command handles Claude PreCompact, SessionStart, PostCompact, Stop, and SubagentStop according to stdin `hook_event_name`. Compact SessionStart, and resume SessionStart with an eligible handoff, return **only** the bounded handoff result and never start board, network, or home-render work in that process. Startup, clear, and resume with no eligible handoff retain ordinary best-effort board orientation. This branch boundary prevents board latency or output size from timing out or overflowing the load-bearing result.

The helper also exposes content-free health, diagnosis, and exact-version recovery operations under `aslite hook`. They use the same authority and are the only operator surface for the journal; there is no command to print handoff content.

## Placement, privacy, and durability semantics

Handoffs are host-local session-boundary runtime state, not shared project knowledge. The authority owns a private journal at `~/.agentstate/handoffs/v1` with a test-only root override. It creates and verifies 0700 directories and refuses symlinks, unsafe ownership, or permissive boundaries. Journal records are never discovered as project bundles.

Compact summaries and transcript excerpts may contain secrets. Status, logs, recovery output, hook errors, manifests, and receipts expose only runtime, hashed keys, generations, storage versions, lengths, stages, outcomes, and reason codes. The journal is excluded by construction from `.agentstate-lite`, git, board sync, remote backends, catalog, stdout, and home rendering.

The storage guarantee is process-level atomic CAS plus post-write read-back for completed operations. It uses the existing filesystem backend's lock and temp-file/rename behavior. Revision 3 does **not** claim power-loss or kernel-crash durability because the existing path does not fsync both file and parent directory; that stronger guarantee is a separate future change.

## Canonical project and execution identity

The authority derives canonical project identity only from a successfully resolved local bundle:

```json
["agentstate-lite-project", 1, "<canonical real path of bundle root>"]
```

The path is resolved without following an unsafe journal symlink, encoded byte-for-byte, stored privately, and never emitted. `project_key` is the full lowercase SHA-256 of this canonical tuple.

The execution identity tuple is:

```json
["agentstate-lite-execution", 1, "claude-code", "<exact session_id>", "<exact agent_id or null>"]
```

Each string is non-empty when present, at most 256 UTF-8 bytes, and contains no NUL or control characters. Values are not trimmed, case-folded, shortened, or path-normalized. `execution_key` is the full lowercase SHA-256 of the canonical encoding.

The physical namespace is:

```text
projects/<project_key>/executions/<execution_key>/head
projects/<project_key>/executions/<execution_key>/generations/<generation_uuid>
```

Every transition recomputes both keys and byte-compares both stored canonical tuples with the currently resolved project and hook identity. A digest hit with different stored bytes is `IDENTITY_KEY_COLLISION`. A session invoked while another bundle resolves cannot select the former project's generation. No fallback uses actor, hostname, cwd recency, a singleton candidate, a shortened id, or another project.

`execution_role` is derived mechanically: missing `agent_id` is `main`; present `agent_id` is `subagent`. `agent_type` and actor are advisory metadata. The pilot never infers an orchestrator role.

## Head and generation schema

One mutable head selects the current generation for an exact project/execution identity. Each generation has its own address, so selecting a new generation never overwrites retained history. A storage version is metadata returned by a read/write operation and passed separately into validation and CAS; it is never persisted inside the content-addressed document whose bytes define that version.

The private journal declares strict internal `Handoff Head` and `Session Handoff` kinds and applies domain validators. Unknown keys, malformed timestamps, invalid enums, identity/hash disagreement, head/generation disagreement, payload/body disagreement, and over-budget content are rejected.

The head stores schema version, both canonical identities and keys, current generation UUID, and transition timestamps. A generation stores:

- schema version, both identities and keys, authority-owned UUIDv4 generation, and delivery state (`prepared` or `delivered`);
- trigger, fixed prepare/expiry timestamps, refresh count, typed decision card, payload SHA-256, deterministic rendered body, canonical transcript path, prepare checkpoint, and bounded transcript evidence metadata;
- latest delivery attempt with nonce, time, transcript canonical path, pre-delivery transcript checkpoint, and attempt count;
- optional response-observation time, assistant-message hash, and transcript position;
- optional bounded PostCompact audit fields.

Head and generation read receipts carry their independent storage versions. A transition that reads both must CAS the object it mutates, then re-read and validate the head/generation relationship before returning trusted context.

## Decision-card contract

The card always has these fixed slots:

1. goal and task references;
2. current state and last completed work;
3. decisions and supporting evidence;
4. constraints and non-goals;
5. blockers and open questions;
6. loaded skills;
7. assumptions and unverified claims;
8. one exact next action or command.

Each slot is `observed` with literal source excerpts/references or `unknown` with a reason. Unknown is valid evidence discipline; semantic invention is forbidden. The payload also includes a bounded ordered excerpt of recent user/assistant text so the model can inspect the source.

PreCompact builds the card deterministically from transcript JSONL available before compaction:

- retain the current prompt, last completed assistant response, and recent visible text within budget;
- collect literal OKF ids such as `tasks/...`, exact labelled goal/decision/constraint/blocker/assumption/next-action lines, and named Skill invocations;
- attach source message UUIDs/positions and hashes; never summarize with another model;
- mark every unproved slot unknown.

The stored card may be larger, but SessionStart additional context stays below 8,000 characters, leaving headroom under Claude's 10,000-character hook limit. Deterministic truncation preserves the current prompt and exact next action first, retains slot labels and unknown reasons, and records original/rendered lengths plus `truncated: true` in content-free receipts.

Acceptance fixtures and live journeys must contain at least one goal/task reference, one constraint, one evidence-backed decision, one deliberate unknown, and one exact next command. Unique values appear only before compaction, not in the compaction-driving prompt or PostCompact summary. The first post-compaction assistant response must reproduce the required pre-only values and act on the next-action field. An oversized live case must prove current prompt and next action survive disclosed truncation below 8,000 characters.

## State machine and generation safety

### PreCompact — refresh or publish a new head

1. Resolve the local project bundle and canonical project identity. No bundle is an intentional no-op.
2. Validate hook identity and transcript; build and validate the evidence card; run bounded GC.
3. Exact-read the head and current generation if they exist.
4. If the current generation is healthy `prepared`, CAS-refresh that same generation because a previous host attempt may have been declined. Its generation UUID and fixed expiry do not change.
5. If no head exists, or the current generation is healthy `delivered` or expired, create a new generation-addressed `prepared` record and CAS the head to it. The old generation remains retained. A head-CAS loser quarantines or leaves its unreferenced generation for bounded GC and never changes the winner.
6. Read back and validate the selected head and generation, including both identities and hashes, before returning a prepared receipt.

A corrupt or unsafe head/current generation is never guessed around or overwritten. A successfully invoked helper returns an event-valid PreCompact block with a content-free reason. Identity, persistence, validation, CAS, and read-back failures also block. There is no shell jq/date/hostname/heredoc dependency.

### SessionStart compact/resume — exact delivery

For `source: compact`, exact-read the current head and its prepared generation, validate every invariant and expiry, capture a canonical transcript checkpoint, then CAS-mark that generation `delivered` with a fresh nonce. Re-read the head: if it no longer selects that generation, return `continue:false` and inject nothing. Only a still-current, fully valid generation may produce bounded `hookSpecificOutput.additionalContext`.

A retried compact event may create a new delivery attempt on the same current prepared/delivered generation. A `source: resume` event applies a freshness gate before redelivery: a prepared generation is eligible only when the transcript still equals its prepare checkpoint, and a delivered generation is eligible only when the transcript has no visible turn beyond its latest delivery checkpoint. Any transcript advance makes the card stale; resume injects no handoff and returns ordinary board orientation with content-free `STALE_PREPARE` or `STALE_DELIVERY` diagnostics. An eligible retry updates the latest nonce/checkpoint and attempt count through CAS and returns only the handoff result. Startup and clear provide ordinary board orientation and never select another session or project's handoff.

For `source: compact`, missing, corrupt, expired, ambiguous, mismatched, or concurrently displaced state on an active managed rail returns top-level `continue:false`. A resume without an eligible fresh handoff injects no card and falls back to ordinary board orientation with content-free diagnostics. SessionStart exit code 2 is not treated as a gate. No unverified record becomes a model premise. Live fault injection must prove that `continue:false` actually prevents the first post-compaction model response on the verified host.

### PostCompact — audit only

PostCompact exact-reads the current generation and CAS-attaches only bounded summary hash, original length, capped excerpt, trigger, and observed time. It preserves delivery state and nonce. It cannot block, and failure cannot cause SessionStart to trust missing data because delivery already completed.

### Stop/SubagentStop — informational response observation

Stop and SubagentStop do not carry the delivery nonce back from model context, so revision 3 does not claim causal nonce acknowledgement and does not change delivery state. The authority may append bounded informational `response_observation` metadata to the current delivered generation only when:

- head and generation still match the exact project/execution identity;
- the transcript path matches the recorded delivery attempt;
- the transcript has a strict append beyond the delivery checkpoint; and
- `last_assistant_message` matches one unambiguous first assistant response after that checkpoint.

The content is hashed, not copied into receipts. Failure or ambiguity leaves the generation delivered and recoverable. Resume eligibility ignores stored response observations and recomputes freshness only from the latest delivery checkpoint and current transcript. Observation never suppresses redelivery, changes the head, permits replacement/deletion, or changes GC eligibility. A stale concurrent Stop is therefore informational and non-destructive.

## Garbage collection and operator recovery

`CompactionHandoffAuthority.gc` is the sole physical-GC owner. It runs on prepare and SessionStart and has an internal test seam.

- A current prepared/delivered generation is protected only until its fixed seven-day expiry; callers and refreshes cannot extend it. An expired current head is CAS-detached only after re-reading and validating both head and generation versions, then its former generation becomes deletable.
- Every non-current prepared/delivered/orphan generation uses the same fixed prepare-derived seven-day expiry. Response-observation metadata never changes that time.
- The sweep orders by eligibility then path, examines a bounded set, and expected-version deletes at most 25 generation records per call.
- Head/version conflicts and newly selected generations are skipped. SessionStart that races a head detachment fails its final head recheck and injects nothing. Malformed bytes are quarantined, never guessed safe to delete.

Expiry is a hard logical access bound: expired content is never injected. Physical deletion is event-driven on the first later authority invocation, not a wall-clock daemon. A host on which agentstate-lite never runs again may retain expired private bytes; revision 3 does not claim scheduled deletion in that case.

Content-free diagnosis resolves one exact project/session/agent target and reports hashed keys, reason, and raw head/generation versions without content. `aslite hook recover` requires those same exact identities and expected versions. It is allowed only for unsafe, corrupt, or expired state; it privately quarantines the raw bytes, then version-guardedly detaches the head. A conflict changes nothing. Healthy current state cannot be recovered away. The next PreCompact may create a new generation after successful detachment. Quarantine has its own bounded seven-day, 25-record GC policy and remains private.

Because delivered generations no longer block a later PreCompact, ordinary operation needs no human cleanup. Recovery exists only for fail-closed corruption and is testable without exposing content.

## Managed-hook installation and readiness

Claude installation manages one `aslite hook run` command for each of PreCompact, SessionStart, PostCompact, Stop, and SubagentStop. New commands carry an explicit, start-anchored managed marker and exact token shape. Legacy managed forms are recognized only by anchored executable/subcommand patterns. Arbitrary occurrence of `agentstate-lite` in a command string is never ownership evidence.

Install/reinstall/uninstall transformations:

- are idempotent and collapse only structurally recognized managed entries;
- preserve every foreign hook object and command string exactly, including the installed foreign SessionStart `printf` whose payload text mentions `agentstate-lite`;
- migrate recognized earlier agentstate-lite SessionStart forms;
- retain foreign legacy PreCompact/PostCompact scripts and warn about multiple handlers;
- refuse malformed settings rather than rewriting them.

After writing settings, install executes the exact helper's health/schema probe using the configured command, timeout, minimal PATH, and isolated content-free payload. Status repeats that probe and checks executable path/digest, permissions, all five event registrations, foreign coexistence, and the resolved Claude executable realpath, SHA-256, reported version, platform, and architecture. `rail_ready: true` requires a verified Claude host tuple and healthy exact helper. `installed_unverified` may be installed but is never represented as proven support.

## Failure and observability contract

Internal receipts include runtime, project/execution key hashes, generation, stage, storage versions, payload hash/length, outcome, and reason code. Hook adapters emit only fields legal for the exact Claude event. Expected codes include `UNSUPPORTED_RUNTIME`, `INSTALLED_HOST_UNVERIFIED`, `HOOK_HELPER_UNHEALTHY`, `UNSUPPORTED_IDENTITY`, `HANDOFF_SCHEMA_INVALID`, `STALE_RESTORE`, `HANDOFF_NOT_FOUND`, `HANDOFF_EXPIRED`, `IDENTITY_KEY_COLLISION`, `HEAD_GENERATION_MISMATCH`, `HANDOFF_STORE_UNSAFE`, `HANDOFF_STORE_CORRUPT`, and `RECOVERY_VERSION_CONFLICT`.

No content-bearing fallback, newest-record selection, or silent corrupt overwrite exists. Successfully invoked PreCompact failures block; successfully invoked compact SessionStart failures return `continue:false`. Host process-launch/kill/timeout failures are reported by readiness and exact-host probes because a process that did not run cannot emit hook JSON.

## Digest-locked acceptance

Automated tests cover repeated/declined compaction, old-prefix collisions, concurrent mains, sibling subagents, canonical-project separation, head/generation contention, orphan publication, every interruption boundary, transcript usefulness/truncation, corrupt recovery, stale response observation/GC (including unchanged deletion time), missing/moved executable, timeout, permissions/symlink attacks, structural hook migration, exact foreign-hook preservation, privacy scans, and true multi-process contention.

G0 runs all targeted tests, packaging checks, and the complete `npm run check`, then freezes a private candidate manifest containing source commit, packed CLI/tarball SHA-256, CLI version identity, helper digest/path, harness revision, and resolved Claude executable realpath/digest/version/platform/architecture. Rebuilding or changing source, package bytes, helper, harness, or host tuple invalidates the manifest and restarts the chain.

The same manifest digest must pass, in order:

1. independent exact-SHA/package Review;
2. adversarial QA of that reviewed artifact;
3. installed-host negative rail tests for real PreCompact block under both `trigger: manual` and `trigger: auto`, real compact SessionStart `continue:false`, missing helper, and timeout behavior;
4. isolated manual main-session compaction, including a second generation;
5. separate real automatic main-session context-pressure compaction;
6. a real sub-agent compaction from PreCompact through SessionStart/PostCompact, first response, and SubagentStop with stable `agent_id`.

Both main live journeys use distinct pre-compaction-only card values, verify they are absent from the driving prompt and PostCompact summary, and require the first post-compaction assistant response to reproduce them and follow the exact next action. At least one live journey exercises disclosed truncation while preserving the current prompt and next command. The sub-agent journey proves the same identity continuity and response oracle. All live gates verify receipt continuity, retained generations, CAS safety, 0700 placement, redaction, exact foreign-hook preservation, no mutation outside isolated targets, and truthful runtime status.

PASS requires every gate on the one manifest digest. External inability to exercise a required journey is `BLOCKED-PENDING-VERIFICATION` and blocks shipping. Rejected output, missing/out-of-order transition, wrong restore, first-response canary loss, privacy leak, digest drift, or unsupported-host overclaim is FAIL.

## Related

- [task](../tasks/pre-compact-multi-session.md)
- [scout research](../context-notes/research-precompact-multisession.md)
- [skeptic review](../context-notes/review-precompact-multisession.md)
- [user-notices](../designs/user-notices.md)
