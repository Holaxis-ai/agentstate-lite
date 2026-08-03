---
type: Context Note
title: Revision 3 data-model and lifecycle-authority research
actor: codex-precompact-v3-data-model
timestamp: '2026-08-03T17:43:11.041Z'
---
# Summary

status: completed

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets, in plain text and owned by the user.

Proximate goal: define one core-backed handoff lifecycle authority whose identity, generation, restore, consume, and GC rules prevent collisions, loss, wrong restore, stale deletion, and unbounded debris. This serves the ultimate goal by making the compaction boundary executable and verifiable rather than dependent on shell/prose conventions.

Recommendation: implement a Claude-Code-scoped private lifecycle command/service over a host-local OKF runtime bundle. Use one single-occupancy document slot per full canonical execution identity. A pending generation is never overwritten: identical retries deduplicate, different concurrent prepares fail `HANDOFF_IN_FLIGHT`, restoration returns the exact document version, and acknowledgement consumes only with `deleteDoc(..., {expectedVersion: restoredVersion})`. Do not use immutable generation record plus pointer in the pilot: core has atomicity per document, not across the record/pointer pair, and the runtime supplies no generation id common to PreCompact and SessionStart.

# Invariant table

| property | owner | mechanism | required test |
|---|---|---|---|
| collision freedom | `handoff/identity.ts` plus service | canonical ordered identity tuple over full runtime/session/sub-agent values; full SHA-256 key; stored full fields are recomputed and exact-compared before every use; a digest collision is a loud `IDENTITY_KEY_COLLISION`, never overwrite/restore | two ids with the same old 8-char prefix; main/sub-agent pair; tuple-boundary ambiguity; injected digest collision |
| loss freedom | lifecycle service + core mutation | strict validation before `mutateDocument(mode:create-only)`; one pending generation per execution; no overwrite while pending; failed write yields no success receipt and must block compaction | concurrent different prepares produce one winner and one `HANDOFF_IN_FLIGHT`; crash/retry after persisted write deduplicates; existing pending bytes remain unchanged |
| wrong-restore freedom | lifecycle service | derive exact id from live full identity; `readDocVersioned`; validate kind/domain schema; recompute key; compare runtime/session/agent exactly; verify payload digest; reject expired; no actor/role/hostname fallback | missing/malformed identity fails; stored-identity tamper fails; malformed payload/hash fails; no singleton fallback |
| consume safety | lifecycle service + `deleteDoc` | acknowledgement carries record id, generation id, and exact read version; reread/verify all fields; CAS delete using that version; absent is idempotent, a newer generation is never deleted | stale acknowledgement after a new generation preserves the new slot; duplicate acknowledgement is harmless |
| repeated compaction | lifecycle service | after successful consume the slot is absent; the next prepare creates a fresh authority-generated UUID generation; before consume, identical request deduplicates and different state fails closed | compact/restore/consume twice yields two generation ids; repeat-before-consume behavior pinned |
| liveness | lifecycle service + GC trigger | pending slot has fixed seven-day `expires_at`; expired own-slot may be CAS-collected before prepare; every prepare and compact SessionStart runs a bounded sweep; errors tell the operator which exact slot/version blocks progress | expired abandoned slot is collected then a fresh prepare succeeds; GC conflict skips rather than loops |
| recoverability | durable slot + receipts | reads never delete; crashes before acknowledgement leave the slot restorable; successful prepare/read receipts name id/generation/version; failures are structured and fail closed | interruption at each write/compact/read/context/ack/delete boundary |
| schema validity | internal Session Handoff recipe + `handoff/schema.ts` | `loadKinds` once; `mutateDocument(strict:true)` for generic kind rules; one domain validator for scalar/date/hash/payload rules; core `splitSections` for body checks; no raw YAML/frontmatter parser | arrays/objects in scalar fields, invalid dates/enums, unknown payload keys, missing/empty sections all refuse before write |
| placement isolation | `handoff/store.ts` | private local bundle under `credentialsDir()/handoffs-v1`, root forced 0700; never project `.agentstate-lite`, never `sync`, remote, catalog, board attribution, or awareness | project sync stages no handoff; two clones/sessions share no board artifact; permission and symlink refusal tests |
| bounded cleanup | lifecycle service | query through `queryHeads`, sort `(expires_at,id)`, inspect a capped candidate set and CAS-delete at most 25 valid expired records per run; malformed records are reported, never guessed/deleted | >25 expired records require multiple runs; concurrent mutation produces skipped conflict; malformed records survive and are reported |

# Recommended state model

## Identity and key

Pilot runtime is exactly `claude-code`; Codex and OpenCode are unsupported until their compaction identity/event adapters are proven. Validate each supplied identity string as a non-empty, untrimmed value of at most 256 UTF-8 bytes with no control/NUL characters; preserve exact bytes (no case-folding or Unicode normalization).

Canonical identity bytes are UTF-8 of the fixed ordered JSON array:

`["agentstate-lite-handoff",1,runtime,session_id,agent_id_or_null]`

`execution_key = "sha256:" + SHA256(canonical_identity_bytes)` and the concept id is `handoffs/v1/claude-code/<64-lowercase-hex>`. The digest is never truncated. The record stores `runtime`, full `session_id`, and full optional `agent_id`; every operation recomputes the key and compares the stored full identity. Thus even a cryptographic collision becomes a fail-closed key collision, not wrong restore or loss.

`execution_role` is derived mechanically: absent `agent_id` = `main`, present = `sub-agent`. `coordination_role` (`orchestrator|worker|unspecified`) and `actor` are advisory only. Neither participates in identity, lookup, GC, or authorization. Actor resolves through the existing explicit flag > `AGENTSTATE_LITE_ACTOR` > absent rule; never manufacture `unknown`. Pass it to core and persist it only when present.

## Generation and lifecycle

The slot holds exactly one immutable pending generation. The authority generates `generation_id` with `randomUUID()` after it has established that the slot is absent. It never accepts a caller-supplied generation. New generation creation uses expect-absent CAS. A live pending slot is never CAS-upserted:

- same full identity plus byte-equivalent normalized payload: return the existing version as `deduplicated:true`;
- same identity plus different payload: `HANDOFF_IN_FLIGHT` (conflict, exit 5);
- different stored identity at the derived key: `IDENTITY_KEY_COLLISION` (runtime failure, no mutation);
- expired valid slot: CAS-delete its exact version, then retry create once; conflict is retryable/fail-closed, never unconditional.

Default lifetime is fixed at seven days in the pilot: `prepared_at` is authority clock, `expires_at = prepared_at + 7d`. Callers cannot lengthen it. `timestamp` equals `prepared_at`.

## Schema

Use a dedicated `Session Handoff` kind in an internal definitions-only recipe applied only to the private runtime bundle. Do not extend `Context Note`: its convention governs all ordinary notes and cannot express the handoff scalar/date/nested-payload requirements without breaking unrelated notes. Do not add the recipe to the public built-in inventory during the pilot.

Required frontmatter: `title`, `schema_version: "1"`, `runtime: claude-code`, `execution_key`, `session_id`, `execution_role`, `generation_id`, `prepared_at`, `expires_at`, `payload_sha256`, `payload`, `timestamp`. Optional: `agent_id`, `actor`, `coordination_role`, `trigger`, `workspace_root`, `git_head`, `transcript_path_sha256`. Convention enums cover schema version, runtime, roles, and trigger.

Normalized payload v1 has exact keys: `ultimate_goal` (non-empty string), `proximate_goal` (non-empty), `task_refs` (string array), `last_completed` (non-empty), `current_state` (non-empty), `decisions` (array of `{decision,evidence_refs}` with non-empty strings and at least one evidence ref per decision), `constraints_and_non_goals` (string array), `blockers_and_open_questions` (string array), `loaded_skills` (string array), `assumptions` (string array), and `next` (`{action: non-empty string, command: string|null}`). Unknown keys fail. `payload_sha256` hashes `JSON.stringify` of the validator-produced fixed-key normalized object.

The body is a deterministic human projection with required level-1 sections: `Summary`, `Goals and tasks`, `Last completed and current state`, `Decisions and evidence`, `Constraints and non-goals`, `Blockers and open questions`, `Loaded skills`, and `Next action`. Read-side validation uses core `splitSections`; it does not parse Markdown back into the payload. The typed `payload` frontmatter is authoritative and the body/hash must agree with its deterministic projection.

## Placement

Place the internal OKF bundle at `credentialsDir()/handoffs-v1` (normally `~/.agentstate/handoffs-v1`), with its root forced to mode 0700 and unsafe/symlinked roots refused. This is host-local runtime state, not project knowledge. It must never be written under the project `.agentstate-lite` bundle: board `stageAndCommit` runs `git add -A`, so any project-bundle handoff can be published by an unrelated sync and then conflict across clones. The local store is not remotely addressable, cataloged, synced, or included in board awareness. Workspace root/head/transcript hashes are recovery discriminators only.

# Authority API

Implement one private service (`prepareHandoff`, `restoreHandoff`, `acknowledgeAndConsumeHandoff`, `gcHandoffs`) and a hidden installed-hook adapter such as `__handoff`. Public `aslite handoff` is deferred. The command always accepts one JSON request from stdin and emits one JSON receipt; hook scripts/plugins do no identity, key, YAML, CAS, selection, or GC work.

`prepare` request:

```json
{"op":"prepare","schema_version":1,"runtime":"claude-code","session_id":"full","agent_id":"optional-full","actor":"optional","coordination_role":"optional","trigger":"manual|auto","workspace_root":"optional","git_head":"optional","transcript_path_sha256":"optional","payload":{"ultimate_goal":"...","proximate_goal":"...","task_refs":[],"last_completed":"...","current_state":"...","decisions":[],"constraints_and_non_goals":[],"blockers_and_open_questions":[],"loaded_skills":[],"assumptions":[],"next":{"action":"...","command":null}}}
```

Write receipt:

```json
{"handoff":"prepared|deduplicated","record_id":"handoffs/v1/claude-code/<hex>","execution_key":"sha256:<hex>","identity":{"runtime":"claude-code","session_id":"full","agent_id":null},"generation_id":"uuid","payload_sha256":"sha256:<hex>","prepared_at":"ISO","expires_at":"ISO","version":"sha256:<hex>"}
```

`restore` request contains only `op`, schema version, runtime, full session id, and optional full agent id. Receipt returns the same identity/id/generation/hash plus `version`, `payload`, and rendered `body`. No identity means `UNSUPPORTED_IDENTITY`; no automatic candidate query exists.

`ack-consume` request contains live full identity plus the restore receipt's `record_id`, `generation_id`, and `version`. The authority recomputes id, rereads, validates everything, requires exact generation/version, then calls CAS delete. Receipt is `{"handoff":"consumed","record_id":"...","generation_id":"...","version":"...","deleted":true}`; an absent record returns `deleted:false, already_absent:true`. A present mismatched/newer record is `STALE_RESTORE` and survives.

`gc` request is internal: `{"op":"gc","trigger":"prepare|session-start|explicit","limit":25}` with production limit clamped to 1..25 and clock injectable only in tests. Receipt reports scanned/eligible/deleted/conflicted/invalid counts and capped ids. Prepare always checks its own expired slot even if the global sweep cap is exhausted.

Fail closed with structured codes: `UNSUPPORTED_RUNTIME`, `UNSUPPORTED_IDENTITY`, `HANDOFF_SCHEMA_INVALID` (usage/2); `HANDOFF_IN_FLIGHT`, `STALE_RESTORE` (conflict/5); `HANDOFF_NOT_FOUND` (not-found/6); `HANDOFF_EXPIRED`, `IDENTITY_KEY_COLLISION`, `HANDOFF_STORE_UNSAFE`, `HANDOFF_STORE_CORRUPT` (runtime/1). PreCompact must block unless it receives `prepared` or `deduplicated`. SessionStart must omit handoff content on every validation/identity/expiry failure and surface the code.

# Mutation mapping

- Store creation: core `initBundle`; internal recipe through existing `parseRecipeFiles` + `applyRecipe`, not hand-written convention installation.
- Registry: `loadKinds(bundle)` once per authority invocation.
- Create: core `mutateDocument({mode:"create-only",strict:true,registry,...})`; it owns timestamp-before-kind validation, expect-absent CAS, actor propagation, and final version receipt.
- Read: core `readDocVersioned`; never raw `fs.readFile` or a second frontmatter parser.
- Schema sections: core `validateAgainstKind`/`splitSections`, plus one handoff-domain validator for types/formats/nested payload.
- Consume and expired cleanup: core `deleteDoc(bundle,id,{expectedVersion})`; never unlink and never unconditional delete.
- Scan: core `queryHeads({type:"Session Handoff",prefix:"handoffs/v1/"})`; never a private filesystem walk.
- Error mapping: existing `VersionConflict`, `InvalidInputError`, and CLI `CliError` taxonomy.
- Do not call CLI `mutateDoc` from the service: that adapter owns user-facing wording and best-effort board attribution. The private service calls core `mutateDocument` directly and owns only handoff-domain errors/receipts.

# GC and consume crash policy

Prepare is durable before compaction: no success receipt means compaction blocks. Read is non-destructive. The first post-compaction model boundary receives the restore receipt/content through the supported SessionStart `source=compact` adapter. A Stop/turn-complete adapter then calls `ack-consume` with that exact read receipt; calling consume from SessionStart itself is forbidden because it would delete before the model boundary.

Crash outcomes are intentional: before write = block/no state; after write before receipt = identical retry deduplicates; after compact before restore = slot remains; after read before context/model = slot remains and redelivers; after first model turn before consume = slot remains and redelivers; after CAS delete = the handoff already crossed the model boundary. GC deletes only strictly valid records with `expires_at <= now`, by exact head version. Malformed/unparseable records are reported and retained for manual repair. CAS conflicts are skipped, not retried with a fresh token in the same sweep.

# Implementation surfaces

- `packages/cli/src/handoff/identity.ts`: validation, canonical tuple, full SHA-256 id.
- `packages/cli/src/handoff/schema.ts`: request/record/payload validators, deterministic payload hash/body projection, typed errors.
- `packages/cli/src/handoff/recipe.ts`: internal recipe bytes routed through `parseRecipeFiles`/`applyRecipe`.
- `packages/cli/src/handoff/store.ts`: `credentialsDir()` placement, private-root checks, `initBundle`, `loadKinds`.
- `packages/cli/src/handoff/service.ts`: the sole lifecycle authority.
- `packages/cli/src/commands/handoff-internal.ts` and `cli.ts`: hidden JSON adapter/router entry; exclude from `KNOWN_COMMANDS`, `reference.ts`, README, and generated skill.
- `packages/cli/src/commands/hook.ts`: managed Claude-only PreCompact/compact-SessionStart/turn-complete adapters, reuse `hookCommand`; preserve existing all-runtime ordinary SessionStart behavior and report unsupported compaction adapters honestly.
- `packages/cli/src/commands/session-start.ts`: compose handoff restore before home without weakening existing best-effort board fallthrough; handoff identity failures are loud in the injected context.
- Tests: `packages/cli/test/handoff-identity.test.ts`, `handoff-schema.test.ts`, `handoff-service.test.ts`, `handoff-cross-process.test.ts`, plus hook/session-start agreement tests and exact installed-version live manual/automatic compaction acceptance.

Adversarial suite must cover prefix collisions, tuple ambiguity, Unicode/control/oversize ids, main/sub-agent concurrency, injected digest collision, scalar-vs-array/object attacks, invalid/expired dates, payload/body/hash tamper, identical and different concurrent prepares, stale consumer/new generation, absent id, GC cap/conflict/malformed records, every crash window, two full compact cycles, and cross-process filesystem contention. Run service tests over MemoryBackend and FilesystemBackend; use the existing storage contract/cross-process harness patterns. Final acceptance remains blocked unless real manual and automatic Claude compactions prove exact installed hook commands, payloads, restoration at the first model turn, and post-turn version-guarded consume.

# Alternatives

- Immutable generation record plus mutable pointer: rejected for the pilot. It requires two document mutations without a transaction. Record-first can orphan; pointer-first can dangle; consume ordering creates the same split. Concurrent prepares make pointer order the selector, but SessionStart has no host-supplied generation id to prove which compaction it is restoring. It is justified only if a runtime later exposes one generation/event id at both lifecycle boundaries or core gains a transactional multi-key primitive.
- Rolling CAS-updated execution slot: rejected. It overwrites an unconsumed generation, so concurrent/repeated compaction can lose the only recoverable state. The recommended slot is single-occupancy and never updated while pending.
- Extend Context Note: rejected because its existing broad convention cannot require handoff-only fields without breaking ordinary notes, and its kind grammar alone cannot validate scalar/date/nested payload shape.
- Public Handoff kind/recipe/command: deferred. The Claude-only pilot does not justify public product surface or a fourth public built-in recipe. Promote only after live usage proves the protocol and other runtimes have adapters.
- Project/board placement: rejected because unrelated `sync` stages every path and makes ephemeral host-bound lifecycle state conflict/publish across clones.
- Actor/hostname or newest-note fallback: rejected as non-identity. Missing canonical identity always stops automation; an eventual human recovery UI may list discriminators but must require explicit selection.

# Issues

1. high: the host still needs a deterministic source for the structured payload before PreCompact; this data-model authority cannot make a model-authored decision card appear in a hook with no model turn. The lifecycle builder must connect an already-maintained scratch/context artifact or add an earlier supported capture moment.
2. high: no current managed hook implements Claude PreCompact plus compact SessionStart plus post-first-turn acknowledgement. Installer changes and live installed-version validation remain required; Codex/OpenCode must stay labeled unsupported.
3. medium: `queryHeads` bounds mutations but a filesystem backend still walks the whole local store before filtering; the 25-row cap bounds destructive work, not worst-case scan I/O. A true cursor/prefix pushdown would be a separate core feature if dogfood shows the store growing enough to matter.
4. medium: local hard delete leaves the session transcript/command receipt as the audit trail; a durable consumed-receipt log would require another record and is deliberately deferred to avoid reintroducing multi-document crash coupling.
5. low: SHA-256 is collision-resistant rather than mathematically injective, but stored full-identity verification makes even an injected collision fail closed.

confidence: high

Assumptions: Claude Code is the only supported pilot runtime; seven days is the fixed recovery window; actor and coordination role are advisory; the host calls acknowledgement only after the first post-compaction model turn. Exact bundle note id: `context-notes/precompact-v3-data-model-research`. No code, hooks, task status, or user-global files were modified, and no sync was run.
