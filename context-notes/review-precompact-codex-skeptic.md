---
type: Context Note
title: 'Adversarial review: multi-session pre-compaction design'
actor: codex-precompact-skeptic
timestamp: '2026-08-03T17:00:02.749Z'
---
# Summary

status: completed

verdict: fail

Ultimate goal: agentstate-lite provides shared, versioned, conflict-safe memory for concurrent agent fleets.

Proximate goal: falsify revision 2's multi-session handoff guarantees before implementation; this serves the ultimate goal by preventing unsafe or non-operational handoff scaffolding from becoming a trusted primitive.

Revision 2 does not meet the review acceptance gate. It has at least four independent high-severity counterexamples: the proposed PreCompact/PostCompact `additionalContext` rail does not schedule an agent/tool turn; first-8-character keys collide for distinct stable session ids; create-only `promote` makes crash/repeated-compaction recovery fail and can restore stale state; and the three runtimes do not expose equivalent subagent identity or install equivalent compaction hooks. The prior PASS-WITH-CAVEATS verified CLI components in isolation, not the load-bearing delivery lifecycle.

## Issues

- severity: high
  description: The proposed hook rail cannot cause the agent to author or execute the heredoc at compaction time. Current Claude Code documentation limits PreCompact output to blocking and PostCompact to side effects; neither event is a model-context insertion point. The installed scripts print `hookSpecificOutput.additionalContext`, but there is no pre-compaction model/tool turn in which Claude can obey it. The same output shape is not supported by Codex PreCompact/PostCompact either.
  failure_trace: `PreCompact` fires -> `pre-compact.sh` prints an instruction -> Claude Code treats the event as a compaction decision hook, not a context-producing turn -> compaction proceeds without any `promote` call -> no note exists. `PostCompact` then prints a read/delete instruction on an event with no model decision/context control -> no restoration or deletion occurs. Running the heredoc manually in a scratch shell does not exercise this rail.
  location: design load-bearing assumption; decision (e); proposed changes 3 and 4; `/Users/brian/.claude/hooks/pre-compact.sh`; `/Users/brian/.claude/hooks/post-compact.sh`; current Claude Hooks reference and Codex Hooks manual.
  provenance: empirical
  smallest_repair: Move persistence into a deterministic hook-owned command rather than an injected conversational instruction. Have PreCompact or PostCompact invoke a dedicated validated `aslite handoff` operation directly; use SessionStart with matcher/source `compact` for model-visible restoration context, because that event explicitly delivers context before the next model request. Prove the real manual and automatic compaction chain end to end before adoption.

- severity: high
  description: `{id8}` is not collision-free even when both sessions have stable full identifiers, directly failing the acceptance criterion.
  failure_trace: Two stable ids `deadbeef-1111-...` and `deadbeef-2222-...` both derive `context-notes/pre-compact-deadbeef`. In the scratch bundle, promoting session A succeeded; promoting session B to the same derived key exited 5 `ALREADY_EXISTS`. Across clones, the same path enters sync convergence and only one note remains primary. Full `session_id` frontmatter cannot recover the note that never acquired a distinct key.
  location: decision (a), proposed jq derivation, all `pre-compact-{id8}` references.
  provenance: empirical
  smallest_repair: Use an injective path-safe encoding of the full runtime identity, not an eight-character prefix. If runtime ids are not path-safe, use a reversible base64url/percent encoding or retain enough namespaced full identity to make the mapping injective; keep the original full id in metadata for verification.

- severity: high
  description: The write is create-only, so a crash or interrupted consume makes the next compaction unable to write fresh state; exact-id restore can then accept stale same-session state.
  failure_trace: Compaction 1 creates note V1. Restoration crashes after read but before delete, or PostCompact never executes the injected delete. Compaction 2 derives the same key and runs `promote` without `--expected-version`; the built CLI exits 5 `ALREADY_EXISTS` even when bytes are identical. Compaction continues unless separately blocked. Post-compaction exact-read returns V1; its summary and full session id match the same session, so the H2 guard does not detect that it is stale. Scratch re-promotion reproduced the exit-5 failure.
  location: decision (c), verified write block, proposed changes 3 and 4; `packages/cli/src/commands/promote.ts` create-only contract.
  provenance: empirical
  smallest_repair: Give each compaction an immutable generation key carried across the same lifecycle, or implement a hook-owned CAS upsert/rotation with a hard success receipt. A failed durable write must fail closed before compaction rather than becoming an advisory prompt. Add interruption tests at write, compact, read, restore, and consume boundaries.

- severity: high
  description: Cross-runtime identity and hook behavior are not equivalent, and the managed installer does not own this feature. Claude documents `agent_id` as a common subagent field, but Codex PreCompact/PostCompact expose parent `session_id` and `turn_id`, not `agent_id`; sibling Codex subagents under one parent therefore derive the same key under the proposed algorithm. OpenCode has a distinct plugin compaction API, while the generated installer plugin only implements SessionStart-like ambient context.
  failure_trace: Two Codex subagents compact under the same parent -> both PreCompact payloads carry the same parent `session_id`, with no event-specific `agent_id` -> both derive one key -> collision. On OpenCode, `hook install` creates only `experimental.chat.system.transform`; no `experimental.session.compacting` or `session.compacted` handler writes/restores a handoff. Current `./aslite hook status --scope global --json` reported Claude true, Codex false, OpenCode false; the two hand-written compaction scripts exist only under `~/.claude`.
  location: non-goals/cross-runtime caveat; decision (f); `packages/cli/src/commands/hook.ts`; generated OpenCode plugin; current Codex and OpenCode hook documentation.
  provenance: empirical
  smallest_repair: Define a runtime identity adapter and an agreement table per event/runtime. For Codex, use a demonstrated child-unique identity that is present at both compaction events (potentially a verified session/turn composite or a mapping captured at SubagentStart). For OpenCode, implement its compaction plugin events. Make the managed installer/version/status surface own all adapters and test reinstall/upgrade parity; do not rely on three hand-maintained global files.

- severity: high
  description: Delete-on-consume is unconditional and is not coupled to demonstrated restoration, so it can delete a newer handoff or erase the only recovery artifact before skills/state are actually restored.
  failure_trace: Consumer reads V1. Before its unconditional delete, a writer stores V2 at the same key. In scratch, `doc delete` with no expected version deleted V2 successfully, leaving `NOT_FOUND`. Independently, an agent can issue delete after reading but before a listed skill reload or state application fails; the local filesystem backend has no recoverable version history/tombstone.
  location: decision (c), proposed post-compact change 4; `doc delete` is explicitly invoked without `--expected-version`.
  provenance: empirical
  smallest_repair: Carry the read's `head_version`, require an explicit restore acknowledgement after the first successful post-compact model turn, and consume only with `doc delete --expected-version <read-version>`. If acknowledgement is not mechanically observable, retain the note and let bounded GC remove it later rather than deleting eagerly.

- severity: medium
  description: `expires` is inert metadata; revision 2 claims abandoned notes are GC'd, but no GC actor, command, schedule, hook, or status behavior reads it.
  failure_trace: An abandoned note passes its expiry. Bundle scans and status continue to retain it because freshness is derived from `timestamp`, not `expires`. Repository search found every handoff `expires`/GC reference only in the design; no CLI/core/board-git implementation consumes it. Therefore notes silt up indefinitely unless a human deletes them.
  location: decision (c), especially “Notes that are abandoned ... are GC'd by expires; nothing silts up” and non-goal L2.
  provenance: empirical
  smallest_repair: Assign a concrete GC owner and trigger, such as a bounded `handoff gc` run by SessionStart, with strict date validation and CAS deletion. Otherwise remove the GC claim and state that expiry only filters discovery while cleanup is manual.

- severity: high
  description: Raw Markdown `promote` does not enforce the handoff metadata invariants, even with `--strict`. The Context Note kind neither requires nor validates `session_id`, `role`, `machine`, `actor`, or `expires`; role arity and expiry format are unchecked.
  failure_trace: Scratch `promote --strict` accepted (1) a note with nested-object `session_id`, array `role: [orchestrator, main]`, and invalid `expires`, and (2) a note with no `expires`. `status` reported zero kind warnings. The supposedly exact `--field role=orchestrator` query matched the array-valued malformed role, and projected the missing expiry as an empty string. Thus malformed/adversarial data can enter the primary fallback set without any warning.
  location: decision (a), decision (e), verified write block; `conventions/context-note.md`; `packages/cli/src/commands/promote.ts`; `packages/core/src/kinds.ts`.
  provenance: empirical
  smallest_repair: Introduce a dedicated handoff validator/command (and preferably a dedicated kind) that requires scalar nonempty identity/machine/actor, an enum-scalar role, a valid future ISO expiry, and a conforming summary before any write. Do not use raw `promote` as the public correctness boundary merely because it preserves unknown frontmatter.

- severity: medium
  description: Actor and orchestrator identity remain manual, optional, unvalidated, and ephemeral, contradicting the claim that the hook pre-fills the mechanical fields and making the role query unreliable.
  failure_trace: The compaction payload contains no actor or orchestrator designation, and `AGENTSTATE_LITE_ACTOR` is absent in the current environment. A hook can only write `unknown`, a literal placeholder, or default every main to `role: main`; the designated orchestrator can forget to edit it, yielding query count 0. If session identity is absent, all same-host sessions with the same unknown actor share the degenerate key. After successful consume, deletion removes the only role marker, so the query cannot identify the live orchestrator outside the short handoff window.
  location: decisions (a), (d), and (e); proposed jq fallback and injected frontmatter.
  provenance: reasoned
  smallest_repair: Persist role as an explicit session registry/lease independent of the ephemeral handoff, and require a configured nonempty actor at installation/session start (or define a safe actor-absent query path). The hook should validate rather than ask the agent to edit placeholders.

- severity: medium
  description: Fallback selection is internally contradictory and not deterministic at the command boundary: it says both “pick newest” and “if more than one, ask,” while expiry parsing and invalid/missing expiry behavior are unspecified.
  failure_trace: The documented query returns rows in deterministic id order, not newest-first. In scratch it returned three matching candidates, including missing and invalid expiry values. The replacement instruction first tells the agent to pick newest, then says never guess if more than one; different agents can follow different clauses. With exactly one malformed-expiry candidate, “drop rows whose expires is past” has no defined fail-open/fail-closed result.
  location: decision (b) and proposed global CLAUDE.md replacement.
  provenance: empirical
  smallest_repair: Put candidate validation and selection in a typed command: reject missing/invalid expiry; return no automatic selection unless exactly one valid candidate remains; never contain a competing “newest” instruction on the ambiguity path. Emit structured candidate evidence for the human.

- severity: medium
  description: The proposed shell has unowned portability and fail-open dependencies: bare `aslite`, `jq`, Bash substring syntax, hostname, and unslugged actor. Missing tools or malformed environment values let compaction continue without a note.
  failure_trace: If `jq` is absent, RAW derivation fails and the final `jq -n` exits nonzero; PreCompact non-blocking failure still permits compaction. The agentstate-lite skill explicitly says its bundled CLI is not guaranteed on PATH, yet the injected block calls bare `aslite`. An actor containing `/` or whitespace changes the key path because only hostname is slugged; failed/empty hostname collapses degraded identity further. The scripts have no dependency preflight or hard failure contract.
  location: proposed changes 3 and 4; verified write block.
  provenance: reasoned
  smallest_repair: Replace the shell sketch with the managed, portable CLI executable already resolved by `hook install`; parse hook JSON inside that command; validate/encode every identity component; and return a blocking/fail-closed receipt when the durable write cannot be completed.

## Survived attacks

- empirical: Current Claude Code documentation shows both PreCompact and PostCompact receive the same common `session_id`, and subagent events also receive `agent_id`. The identity-source premise is documented for Claude, even though the proposed output/delivery mechanism is not.
- empirical: The corrected jq nonempty-selection expression prioritizes nonempty `agent_id`, falls back to nonempty `session_id`, and returns empty for absent/null/empty values across six tested payloads. It fixes the prior bare `pre-compact-` bug.
- empirical: On the current host, `jq` 1.7.1, bare `aslite`, and a nonempty hostname slug are available, so the dependency failure is a portability/staleness risk rather than a present-host failure.
- empirical: A valid hand-authored Context Note promoted successfully; custom frontmatter round-tripped; actor+machine filters ANDed correctly; direct exact-id reads return `head_version`.
- empirical: `promote` is expect-absent by default and surfaces a local same-key collision as exit 5 rather than silently overwriting it. This is a useful primitive, but revision 2 fails to handle the receipt at the compaction boundary.
- empirical: `doc delete` is idempotent and supports `--expected-version`, so a safe CAS consume repair is available without new core mechanics.
- reasoned: The self-description guard plus mandatory human choice is materially safer than an automatic newest-note guess when the full candidate set is valid and actually surfaced. It should survive as a policy inside a mechanized selector.

## Recommendation

recommendation: revise

Required changes before approval:

1. Replace conversational, hook-injected heredoc execution with a hook-owned validated handoff command; inject restore context only through a runtime event documented to reach the next model request.
2. Use full injectively encoded session/subagent identity and include a per-compaction generation or safe CAS upsert strategy; block/fail closed on write failure.
3. Make the managed installer own versioned Claude, Codex, and OpenCode adapters, with per-runtime event/identity agreement tests and stale-install detection.
4. Validate the handoff schema at write time, including role arity, identity scalars, actor/machine, ISO expiry, and summary.
5. Couple restore acknowledgement to version-guarded deletion; implement a named GC actor/trigger for abandoned notes.
6. Run live manual and automatic compaction tests plus adversarial concurrency/interruption tests: sibling subagents, two stable ids sharing the old id8, no actor, missing dependency, repeated compaction, crash before/after every lifecycle transition, and sync conflict.

confidence: high

## Notes

Remaining uncertainties: I did not trigger a real interactive compaction in this read-only review. The delivery failure is nevertheless grounded in the installed Claude Code 2.1.220 configuration plus current official hook contracts. The exact Codex `turn_id` stability needed for a possible child-identity composite and the OpenCode compaction input schema still require live/runtime-specific probes. Those uncertainties affect the choice of repaired adapter, not the FAIL verdict: revision 2 already has deterministic CLI and lifecycle counterexamples.

Official references consulted: Claude Code Hooks (`https://code.claude.com/docs/en/hooks`); current Codex manual Hooks section (freshly fetched from `https://developers.openai.com/codex/codex-manual.md`); OpenCode Plugins/compaction hooks (`https://opencode.ai/docs/plugins/`).

bundle_note_id: context-notes/review-precompact-codex-skeptic

No code, task status, user-global file, hook, or design was modified. No `aslite sync` was run.
