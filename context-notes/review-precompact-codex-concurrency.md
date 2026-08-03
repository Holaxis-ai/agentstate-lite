---
type: Context Note
title: 'Independent concurrency review: multi-session pre-compaction design'
actor: codex-precompact-concurrency
timestamp: '2026-08-03T16:57:45.035Z'
---
# Summary

status: completed

verdict: fail

recommendation: reject revision 2 as an operational protocol; revise and re-review after the delivery rail and identity/lifecycle invariants below are redesigned and exercised through a real compact cycle.

confidence: high

Ultimate goal: shared, versioned, conflict-safe memory for agent fleets.

Proximate goal: determine whether revision 2 gives each compaction lifecycle a deterministic, multi-session-safe identity and exact restore/consume protocol, so compaction cannot lose state or silently import another session's state.

The review separates four properties. Revision 2 fails all four as specified:

| Property | Result | Why |
|---|---|---|
| Collision freedom | FAIL | `id8` is a 32-bit/raw-prefix key, and the no-id slug is shared by concurrent same-actor/same-host sessions. |
| Loss freedom | FAIL | The real hook output is rejected; create-only `promote` cannot refresh an existing slot; sync conflicts and unconditional deletion can discard a generation. |
| Wrong-restore freedom | FAIL | Exact-by-truncated-key reads do not compare the live full identity, and a singleton no-id candidate can be another session whose similar summary passes the semantic check. |
| Liveness | FAIL | Neither live hook injects the promised work, an existing note makes the next write fail, expired notes are never physically collected, and non-Claude runtimes have no defined delivery adapter. |

# Issues

1. severity: high
   description: The load-bearing hook delivery rail is not a valid Claude Code hook protocol. Both live scripts return `hookSpecificOutput.additionalContext` for `PreCompact`/`PostCompact`; Claude Code 2.1.220 rejects that schema. A real compaction on 2026-08-03 recorded both failures, so no pre-write instruction or post-restore instruction was injected. Revision 2 proposes retaining the same output mechanism and its end-to-end harness never exercised the actual hook lifecycle. Current official hook docs allow `PreCompact` only to block via top-level `decision`; `PostCompact` has no decision/context control. `SessionStart` with source `compact` is the supported post-compaction context surface.
   location: `designs/pre-compact-multi-session`, load-bearing assumption, decision (e), Proposed changes #3/#4; live `/Users/brian/.claude/hooks/pre-compact.sh` and `post-compact.sh`; empirical transcript `/Users/brian/.claude/projects/-Users-brian-GitHub-agentstate-lite/f6a09fcd-9c53-43e7-a548-1354d721787a.jsonl:2327`; [Claude hooks reference](https://code.claude.com/docs/en/hooks#precompact)
   provenance: empirical

2. severity: high
   description: `id8` is not collision-free and is not implemented as described. `${RAW:0:8}` takes eight characters, not eight validated hex digits. Two valid UUIDs beginning `deadbeef` map to the same key; `agent-abc123` maps to `agent-ab`; `../../oops` maps to `../../oo`; whitespace is treated as a non-empty identifier. Even for uniform UUIDs, eight hex digits provide only 32 bits and therefore cannot satisfy the design's collision-free acceptance invariant for an agent fleet. The primary exact-read path does not compare the retrieved note's full stored identity to the live full identity, so a prefix collision can cause both loss and wrong restore. For sub-agents the key should be derived from a canonical composite such as runtime + full `session_id` + full `agent_id`, not `agent_id` alone.
   location: decision (a), decision (b) primary path, Proposed changes #3/#4
   provenance: empirical

3. severity: high
   description: The proposed write block is create-only, but the lifecycle assumes the same session key can be written again. Against the built CLI, a second `promote` with no `--expected-version` exits 5 `ALREADY_EXISTS`; it does not clobber locally. Therefore an interrupted prior consume, a repeated compact, or two same-key writers in one checkout causes the new handoff write to fail. In separate board worktrees, two creates can instead converge at sync and retain only one. Revision 2 tested only the first create and describes the degraded slug collision as a clobber, so its failure model and retry behavior are incomplete.
   location: decision (e) verified write command and NEW-2 residual-limit discussion
   provenance: empirical

4. severity: high
   description: The no-ID fallback still permits a silent wrong restore. Trace: sessions A and B share actor, machine, and role; neither has a usable ID; both target the same slug; B's handoff is the only surviving candidate; A resumes; the query sees count 1 and the design allows direct use. If A and B worked on the same task or wrote similar summaries, the self-description check is not an independent identity proof and can pass. The instructions also say both "pick newest" and "if more than one, ask," an unsafe ordering ambiguity. Without a stable independent binding, every candidate must remain explicitly untrusted and require human confirmation; count 1 is not identity.
   location: decision (b) fallback and mandatory guard; Proposed global CLAUDE.md read-side replacement
   provenance: reasoned

5. severity: high
   description: Delete-on-consume is not generation-safe. `doc delete` without `--expected-version` lets a stale consumer delete a newer note written at the same key. Scratch proof: consumer read v1; a later CAS write produced v2; deleting with v1's expected version failed safely with `STALE_HEAD` and preserved v2; the design's unconditional delete then removed v2. Idempotence only makes repeat deletion harmless; it does not protect a new generation. There is also an at-most-once crash window after deletion but before restoration is durably reflected in the resumed session.
   location: decision (c), Proposed change #4
   provenance: empirical

6. severity: medium
   description: `expires` is a discovery stop condition, not garbage collection. No hook, CLI command, daemon, or sync phase in the design sweeps expired notes, so abandoned notes remain in the bundle and on the board indefinitely. The claim "GC'd by expires; nothing silts up" is false. Deletion of successfully consumed notes helps the happy path only.
   location: decision (c), cleanup/staleness
   provenance: empirical

7. severity: medium
   description: Orchestrator identity is advisory and non-unique. The hook cannot infer `role: orchestrator`, no source for a pre-filled ROLE is specified, and multiple sessions may self-assign it (or none may). The machine-scoped query can therefore return zero or many rows and does not answer "which is THE orchestrator" deterministically. Hostname is also neither a durable machine identifier nor guaranteed unique. Treat role as display metadata unless backed by a CAS-governed orchestrator pointer/lease, and define explicit 0/1/many behavior.
   location: decision (d), decision (e) claim that the hook pre-fills role
   provenance: reasoned

8. severity: medium
   description: Board and cross-runtime lifecycle scope is undefined. The write/read/delete commands do not sync, but any unrelated `aslite sync` can publish the ephemeral note and a later local-only delete can leave the board copy visible until another sync. The design neither chooses local-only handoffs nor specifies convergent board semantics and GC. Its concrete hooks and proposed global instruction edit are Claude-only; Codex/OpenCode receive no equivalent pre/post adapter, verified identity source, or exact restoration injection. A caveat about transcript locality is not an executable cross-runtime protocol.
   location: decisions (b), (c), (e); Non-goals / boundaries
   provenance: reasoned

# Concrete failure traces

## Invalid delivery rail

1. Claude Code fires `PreCompact` with a valid `session_id`.
2. The script prints the proposed `hookSpecificOutput.additionalContext` object.
3. Claude Code rejects it as `Hook JSON output validation failed` and continues compaction.
4. No note is written. `PostCompact` emits the same invalid shape and is rejected too.
5. Result: collision is irrelevant because there is no handoff; loss freedom and liveness fail.

## Stable-ID prefix collision

1. Session A has `deadbeef-0000-...`; session B has `deadbeef-ffff-...`.
2. Both derive `context-notes/pre-compact-deadbeef`.
3. In one checkout, B's create exits `ALREADY_EXISTS`; in separate synced checkouts, both creates conflict and one survives convergence.
4. The post hook reads by the shared truncated key and does not require stored full identity = live full identity.
5. Result: at least one handoff is lost; a wrong restore is possible.

## Stale consumer deletes a new generation

1. Consumer C reads key K at version v1.
2. A new handoff writes K at version v2.
3. C executes the specified unconditional `doc delete K`.
4. v2 is deleted. With `--expected-version v1`, the CLI instead returns `STALE_HEAD` and preserves v2.

# Survived attacks

- The revised jq selection drops null and empty-string `agent_id`/`session_id`; ordinary absent fields no longer produce the bare key `pre-compact-`.
- The built CLI preserves the custom `session_id`, `role`, `machine`, `actor`, and `expires` frontmatter on a successful first `promote`.
- The machine + role + actor list filters compose with AND semantics, and projecting the custom fields works.
- `doc delete` is idempotent for repeated deletion of the same already-absent generation.
- The `>1 candidates => ask the human` rule is safe for that specific ambiguity case, provided selection does not occur first.
- Current Claude Code documentation includes `session_id` in both PreCompact and PostCompact inputs. The separate `--fork-session` flag creates a new ID, supporting the interpretation that ordinary resume reuses the original ID. This supports a full-ID Claude adapter, although a real live lifecycle proof is still required.
- Distinct full, validated session identities written to distinct document IDs avoid board path conflicts; the flaw is truncation and fallback reuse, not per-session document partitioning itself.

# Required changes

1. Replace the invalid prompt-injection rail with supported hook mechanics. At minimum, test the exact installed-version behavior through a real manual and automatic compaction. A viable design must say who performs the write: a direct hook side effect, or a tested `PreCompact` block/continue protocol. Use `SessionStart` matcher/source `compact` for post-compaction context injection rather than unsupported PostCompact `additionalContext`.
2. Define one canonical identity function shared byte-for-byte by write and read. For Claude, use the documented full `session_id`, plus full `agent_id` when inside a sub-agent, namespaced by runtime; derive a filesystem-safe digest with at least 128 bits or use the validated full token. Reject absent, whitespace-only, malformed, or unsupported identities on the automatic path. Do not silently demote to actor+hostname.
3. Store identity source/version and full canonical identity in the note; after every exact read, compare them to the live payload before exposing content. Mismatch must fail closed.
4. Define existing-note behavior. A same-identity stale generation may be replaced only after a read + full-identity check + CAS update; a different identity at the same key is a collision and must not be overwritten. Prefer a per-compaction generation key/pointer if the runtime exposes a symmetric event identifier.
5. Return the read version with the restore receipt and consume only with `doc delete --expected-version <that-version>`. Define the durable checkpoint after which consume is allowed, and preserve recovery across crashes between read, restore, and consume.
6. Make the no-ID state explicitly non-automatic: surface candidates and require a human-selected restore, even when count is 1, or obtain an independent transcript/session anchor. Specify deterministic 0/1/many behavior without the contradictory newest-first rule.
7. Add a real expired-note sweep with ownership/CAS rules, and choose whether these notes are local ephemeral state or board-shared state. If shared, specify when writes/deletes sync and how conflicts converge; if local, keep them outside the shared bundle rather than relying on unrelated sync timing.
8. Treat orchestrator role as advisory unless a unique CAS-governed designation exists. Define runtime-specific adapters separately; mark Codex/OpenCode unsupported until their identity and lifecycle surfaces have empirical tests.

# Notes

- assumptions: review target is revision 2 at timestamp 2026-08-03T15:46:26.016Z; installed Claude Code is 2.1.220; the built `./aslite` CLI is the design's claimed execution target.
- gaps: I did not trigger a new live compaction because that would mutate an active external session. Instead I used two existing real-compaction transcripts plus current official hook documentation. I did not test Codex/OpenCode because revision 2 defines no concrete adapter for them.
- empirical probes: raw-prefix edge cases were run in shell; write/existing-slot and stale-delete behavior were run against the built CLI in `/private/tmp/aslite-codex-concurrency-probe/bundle` only.
- skill influence: the cognitive-ecosystem session-boundary test made identity verification, progressive restore, and crash survivability separate gates; the self-awareness discipline caused the hook capability claim to be checked against a real transcript rather than inherited from the prior review.
- exact bundle note id: `context-notes/review-precompact-codex-concurrency`
