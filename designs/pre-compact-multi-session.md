---
type: Design
title: Multi-session-safe pre-compaction handoff notes
actor: claude-precompact-designer
timestamp: '2026-08-03T15:46:26.016Z'
---
# Multi-session-safe pre-compaction handoff notes

**Status:** Revision 2 for `tasks/pre-compact-multi-session`, 2026-08-03
(claude-precompact-designer), after a FAIL from `context-notes/review-precompact-multisession`.
Every mechanism below was run end to end against the BUILT CLI
(`packages/cli/dist/agentstate-lite.mjs`) over a `examples/sample-bundle` copy with the
`context-notes` recipe applied (the governed-kind case). See "What was tested" for the harness.
Builds on `context-notes/research-precompact-multisession`; stays consistent with
`designs/user-notices`.

## What changed since rev 1 (the FAIL was correct)

Rev 1 asserted a write path (`doc write` / `doc update` of custom frontmatter) that HARD-ERRORS
exit 2, and claimed the discovery fallback "does not bet on UUID stability" when under concurrency
it does. Both are fixed and re-tested. Rev 2 also incorporates a mechanism rev 1 missed entirely:
**the write/read is already driven by two hooks** (`~/.claude/hooks/pre-compact.sh`,
`post-compact.sh`), which today still call the LEGACY MCP tool and emit the colliding
`pre-compact-main` id. Those hooks are the real delivery rail and the right home for the fix, and
the hook layer can read a per-session identifier from its stdin payload — the identity source rev 1
lacked.

## The load-bearing assumption (stated, then survived)

**ASSUMPTION:** a per-session identifier is reachable at write time AND at resume time, and is the
SAME across a compaction / `--resume`. Two candidate sources, in priority order:

1. **Hook-supplied id (primary).** The `PreCompact` / `PostCompact` hook reads its stdin payload:
   `agent_id` for a sub-agent (the existing hook already does this), `session_id` for a main
   session. Claude Code hook inputs carry `session_id` (the Scout confirmed it on the SessionStart
   payload; the existing post-compact.sh notes `agent_id` rides `BaseHookInput`). The hook injects
   the exact note id into `additionalContext`, so the agent NEVER reads its own scratchpad path.
2. **Agent-read scratchpad UUID (secondary).** If a session is resumed WITHOUT the hook (manual
   `--resume`, a non-Claude runtime), the agent falls back to the id8 it can read from its
   scratchpad path — and, failing even that, to the frontmatter query below.

**What I could NOT verify from inside one session** (stated honestly, not skipped this time): I
cannot trigger a real compaction / `--resume` in a fresh process, so I could not observe (a) whether
`session_id` appears in the `PreCompact` main-session payload, nor (b) whether it (or the scratchpad
UUID) survives `--resume` unchanged. These are the exact bits to confirm before Brian relies on the
FAST path. **The design is built so that if the assumption is FALSE, correctness degrades to a
best-effort, GUARDED fallback (see (b)/H2) rather than a silent wrong-restore** — that degradation
is the whole point, and it no longer over-claims a guarantee.

## Decision resolutions (one recommendation each; all re-tested)

### (a) Note identity — ONE shape for main AND sub-agent

`context-notes/pre-compact-{id8}`, `{id8}` = first 8 hex of the session identifier (hook-supplied
`session_id`/`agent_id`, else agent-read scratchpad UUID). Same shape for main and sub-agent; the
main/sub distinction is the `role` frontmatter field, not the id. If NO per-session id is reachable
in a runtime, the degenerate slot is `pre-compact-{actor}-{hostname-slug}`.

Every note carries this frontmatter (all custom fields verified PRESERVED through the write path):

| field | purpose |
|---|---|
| `type: Context Note` | reuse the kind; no new kind, no codec (gate 3) |
| `session_id` | FULL id; the self-describing tiebreaker and the H2 mis-pick guard anchor |
| `role` | `orchestrator` \| `main` \| `sub-agent` (decision d) |
| `machine` | `hostname`; scopes discovery to the host holding the transcript |
| `actor` | person/tool label (existing mechanism) |
| `expires` | ISO date, mandatory (decision c) |
| `timestamp` | existing freshness/recency field |
| `# Summary` body | REQUIRED heading (the governed kind lints its absence — verified) + self-describing state for the H2 guard |

Consume is by DELETION, so there is no `consumed` field to write (see (c)/H3) — this removes rev 1's
inoperable `--consumed` step entirely.

### (b) Discovery on resume — exact-id primary, guarded best-effort fallback

**Primary (hook path):** `post-compact.sh` computes the SAME id8 from its live payload and injects
`aslite doc read context-notes/pre-compact-{id8}`. This is an EXACT, direct read — no recency
guessing, so the concurrency mis-pick (H2) cannot arise here. This is the common case.

**Fallback (degraded: no hook, or the id changed/was lost):** the frontmatter query, now labeled
explicitly BEST-EFFORT, not a guarantee:

```sh
aslite list --type "Context Note" --prefix context-notes/pre-compact- \
  --field actor=<me> --field machine=<hostname> \
  --fields id,role,session_id,expires,timestamp
```

then, client-side: drop rows whose `expires` is past; if resuming as the orchestrator add
`--field role=orchestrator`; among the remainder pick the newest `timestamp`.

**Mandatory mis-pick GUARD (the H2 fix).** Recency identifies who WROTE last, not who is RESUMING,
so under concurrent same-`(actor,machine,role)` sessions the fallback CAN select the wrong note.
Therefore, on the fallback path the resuming agent MUST NOT silently trust the pick:

- The note self-describes its own work (proximate goal, active task ids, `session_id`, start time in
  `# Summary`). Before restoring, the agent checks "does this describe the work I am resuming?" A
  mismatch is detectable because the body names concrete tasks/goals.
- If MORE THAN ONE candidate survives the filter, the agent surfaces the candidates to the human and
  asks which to restore, rather than auto-picking newest. A single unambiguous candidate may be
  used directly; ambiguity escalates. This closes the silent-wrong-restore hole the FAIL identified.

The fallback is honestly framed as recovery of the single-session-per-`(actor,machine,role)` case;
multi-concurrent recovery without a stable id is human-confirmed, not automatic.

**Residual limit the guard does NOT remove (NEW-2).** The slug fallback (`pre-compact-{actor}-
{hostname}`, used when no `session_id`/`agent_id` is in the payload) is NOT session-granular: two
concurrent same-actor + same-machine main sessions with no session id both key on the SAME slug, so
the second write clobbers the first (the original collision, in the degraded no-id case). The
self-description guard prevents a resuming agent from restoring the WRONG session's handoff, but it
does NOT prevent that handoff LOSS — the guard closes wrong-restore, not loss. Loss in this corner
is only truly fixed by a session-granular id actually being present (the primary hook path), which
is why confirming `session_id` in the payload matters. In the common case (a real `agent_id`/
`session_id`), distinct ids mean no slug and no collision.

### (c) Cleanup / staleness — mandatory expiry + delete-on-consume

Mirrors `designs/user-notices` (expiry does double duty: stop-condition AND GC; mandatory).

- `expires` REQUIRED, default now + 7 days (covers a weekend/PTO gap between write and resume).
- **Consume = `aslite doc delete context-notes/pre-compact-{id8}`** — ONE idempotent command
  (verified: `deleted:true` then `deleted:false` on re-run, exit 0). `post-compact.sh` injects it
  AFTER the agent has restored. This replaces rev 1's broken `doc update --consumed` and needs no
  `--expected-version`. A consumed note is gone, so it can never re-nag or win a later pick.
- Notes that are abandoned (never resumed) are GC'd by `expires`; nothing silts up.
- (Audit-trail alternative, not recommended: mark-consumed via `promote --expected-version` — it
  works, verified, but is multi-step; deletion is cleaner for an ephemeral handoff.)

### (d) Orchestrator distinguishability — a machine-scoped query

`role` frontmatter field (`orchestrator` | `main` | `sub-agent`). "Which is THE orchestrator?" is:

```sh
aslite list --type "Context Note" --prefix context-notes/pre-compact- \
  --field role=orchestrator --field machine=<hostname> \
  --fields id,session_id,machine,timestamp
```

**The answer is PER-MACHINE** (M3 fix): the board is shared across hosts, so the query MUST include
`--field machine=<hostname>` or it returns orchestrators from every host Brian runs. "THE
orchestrator" is well-defined only within one machine; a cross-host view intentionally lists one per
host. Verified: `--field role=orchestrator --field machine=testhost` AND-filters correctly.

**`role` is set manually, not auto-populated (NEW-3).** The hook payload carries no signal for
whether a session is THE orchestrator, so the hook cannot infer `role: orchestrator` — it can only
distinguish sub-agent (`agent_id` present) from main. `role` therefore stays a value the
orchestrator session sets on its own note (the interactive session that Brian designated as
orchestrator writes `role: orchestrator`; other mains write `role: main`; dispatched sub-agents are
told `role: sub-agent`). Decision (d)'s query still works exactly as written — it is just filtering a
manually-set field, not a hook-derived one.

### (e) Convention vs tooling — RE-OPENED and RESOLVED: convention on the verified promote path, mechanized by the hook

Rev 1's "convention-only via the generic path, tool deferred" was untenable (the generic path
exit-2s). Re-decided: **convention-only, but built on the `promote` path that actually works, with
the two compaction hooks pre-filling everything mechanical** so the agent runs verbatim commands —
no instinct, no new package code. `aslite handoff` is demoted to an OPTIONAL future ergonomic
upgrade (spec retained below), not required for correctness.

Why this beats "build the tool now": the hooks must be touched anyway (they are stale — legacy MCP
tool + colliding id, see M2), and once touched they can compute `id8` (from `session_id`/`agent_id`),
compute `expires`, stamp `machine`/`actor`/`role`, and inject a ready-to-run `promote` command. The
only thing the agent authors is the `# Summary` body (unavoidable — it IS the handoff). That makes
the write mechanical with ZERO new CLI surface, satisfying "scaffolding over instinct" without
re-introducing the deleted `note` command (gate 3).

The verified write command the `PreCompact` hook injects (the agent fills the body, then runs it):

```sh
# hook substitutes ID8, EXP, SESSION_ID, ROLE, ACTOR; agent writes the # Summary body
ID8=<first 8 hex of session_id/agent_id>
EXP=$(date -u -v+7d +%Y-%m-%d 2>/dev/null || date -u -d '+7 days' +%Y-%m-%d)   # BSD or GNU date
F=$(mktemp)
cat > "$F" <<EOF
---
type: Context Note
title: Pre-compaction handoff — session ${ID8}
session_id: <full session_id/agent_id>
role: <orchestrator|main|sub-agent>
machine: $(hostname)
actor: <actor>
expires: '${EXP}'
timestamp: '$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'
---
# Summary

<agent authors: proximate goal, loaded skills, active task ids, current state, next step>
EOF
aslite promote "$F" --doc-key "context-notes/pre-compact-${ID8}.md"
```

Verified end to end: this exact block wrote the note, custom frontmatter round-tripped, the
discovery query found it, and `doc delete` consumed it.

**Optional future upgrade (deferred, not required):** `aslite handoff` in
`packages/cli/src/commands/handoff.ts` — `handoff write --session-id <id> --role <r>
[--expires-in 7d] --body-file <f>`, `handoff resume [--role orchestrator]` (runs the fallback query
+ guard prompt), `handoff consume`. Pure wrapper over `promote`/`list`/`doc delete`; no new kind, no
codec. Build it only if the hook-injected block proves too clunky in dogfooding. If pursued, file as
follow-on task `tasks/aslite-handoff`.

### (f) Reconcile with the sub-agent scheme — and every source that names the old ids

Collapse the three live patterns (`pre-compact-main`, `pre-compact-main-{id8}`,
`pre-compact-{agent_id}`) into the ONE shape in (a); the main/sub split becomes `role`. This defines
the previously-undefined sub-agent `{agent_id}` source canonically as the hook payload's
`agent_id` (id8). **Completeness (M2):** I grepped every instruction source under
`~/.claude/skills/` and `~/.claude/` for the old ids. Findings:

- `holaxis-orchestrator` skill: **no reference** to `pre-compact` / `agent_id` (grep empty) — it
  does not need changing. (The skeptic's suspicion here was unfounded, now checked.)
- `~/.claude/hooks/pre-compact.sh` and `post-compact.sh`: **BOTH name the old ids AND call the
  legacy `mcp__agentstate-mcp__agentstate_context_note_write` tool** — doubly stale. They are the
  primary thing to update (proposed diffs below). The global CLAUDE.md is the other source.
- Other hits are historical transcripts/archives (`holaxis-ce/**`, `~/.claude/projects/**`) — not
  live instructions; out of scope.

## Proposed changes — PROPOSED — for Brian to apply (do NOT let an agent edit these)

### 1. Global CLAUDE.md — replace the read-side sentence (exact live bytes, em-dash preserved)

M1 fix: the SEARCH string below uses the live file's em-dash ("—"), not an ASCII hyphen, so a
literal find/replace matches.

```
SEARCH (exact live bytes, note the em-dash before "if one exists"):

  Specifically, check for a note at `context-notes/pre-compact-main` (main agent) or `context-notes/pre-compact-{agent_id}` (sub-agents) — if one exists, it was written immediately before the last compaction and contains the skill set and work state from that moment; use it to restore your context and reload any skills listed in it.

REPLACE WITH (plain ASCII):

  Specifically, find YOUR pre-compaction handoff. All handoffs (main OR sub-agent) live under one pattern: `context-notes/pre-compact-{id8}` (id8 = first 8 hex of your session id). Normally the post-compact hook tells you the exact id to read; run that `doc read` directly. If you were resumed WITHOUT that hook, find the note by QUERY, not by a remembered id: `aslite list --type "Context Note" --prefix context-notes/pre-compact- --field actor=<you> --field machine=<hostname> --fields id,role,session_id,expires,timestamp`, drop rows whose `expires` is past, add `--field role=orchestrator` if you are the orchestrator, and pick the newest `timestamp`. This fallback is BEST-EFFORT: before trusting a note, confirm its `# Summary` describes the work YOU are resuming; if more than one note matches, ask which to restore rather than guessing. After restoring, consume it: `aslite doc delete <that-id>`.
```

### 2. Global CLAUDE.md — add a write-side bullet (same Session-setup section)

```
ADD:

  Before a compaction, write your handoff as a `type: Context Note` at `context-notes/pre-compact-{id8}` via `promote` (the generic `doc write`/`doc update` path CANNOT set the needed custom frontmatter). The pre-compact hook injects a ready-to-run command with id8/expires/machine/actor/role pre-filled; you author only the `# Summary` body (proximate goal, loaded skills, active task ids, current state, next step) and run it. Required frontmatter: session_id (full), role (orchestrator|main|sub-agent), machine (hostname), actor, expires (now+7d, ISO date). Include a `# Summary` heading (the Context Note kind lints its absence). Never use the old fixed id `pre-compact-main` — concurrent sessions clobber it silently. A dispatched sub-agent writes role: sub-agent (the orchestrator tells it its role alongside the bundle location and --actor).
```

### 3. ~/.claude/hooks/pre-compact.sh — key on session_id, drop the legacy MCP tool

**KEY correctness (NEW-1):** jq `//` treats an EMPTY string as present, so
`((.agent_id // .session_id // "") | .[0:8])` emits a bare `pre-compact-` when `agent_id` is `""`
(or both fields are `""`/absent) — reintroducing the original fixed-id collision. Use an explicit
non-empty filter and a NON-EMPTY slug fallback. Copy-paste-correct block:

```
# Pick the first NON-EMPTY of agent_id, session_id (jq drops null AND ""); RAW is empty only if none.
RAW=$(echo "$INPUT" | jq -r '[.agent_id, .session_id] | map(select(. != null and . != "")) | (.[0] // "")')
if [ -n "$RAW" ]; then
  ID8="${RAW:0:8}"
  KEY="pre-compact-${ID8}"
else
  # No session-granular id in the payload -> a NON-EMPTY, never-bare slug (see NEW-2 caveat).
  ACTOR="${AGENTSTATE_LITE_ACTOR:-unknown}"
  HOST=$(hostname | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed 's/-\{1,\}/-/g; s/^-//; s/-$//')
  KEY="pre-compact-${ACTOR}-${HOST}"
fi
```

What each branch produces (verified against all six edge cases):
- `agent_id` present (sub-agent): `pre-compact-<agent_id[0:8]>` (e.g. `pre-compact-ad77f1b9`).
- `agent_id` empty/absent, `session_id` present (main): `pre-compact-<session_id[0:8]>`
  (e.g. `pre-compact-cccc3333`).
- BOTH empty/absent/null: `pre-compact-<actor>-<hostname-slug>`
  (e.g. `pre-compact-brian-claude-brianss-macbook-pro-m4-local`) — never a bare `pre-compact-`.

Also change additionalContext to instruct the aslite `promote` write (the block in decision (e)),
NOT `mcp__agentstate-mcp__agentstate_context_note_write`. Have the hook substitute the computed
`KEY`, the `EXP` date, `session_id`, and `role` into the injected command.

### 4. ~/.claude/hooks/post-compact.sh — same id, aslite read + delete-consume

```
- Compute the SAME KEY (the exact block from #3, so both hooks agree) and inject:
    aslite doc read context-notes/<KEY>
  (reload the skills it lists, restore state), then AFTER restoring:
    aslite doc delete context-notes/pre-compact-<id8>
- Drop the legacy-tool phrasing; if the id is absent, tell the agent to run the best-effort
  query + guard from CLAUDE.md change #1.
```

## Non-goals / boundaries

- No new kind, no core codec, no engine change (gate 3): `type: Context Note` + custom frontmatter
  via `promote`.
- No new CLI code required for correctness (`aslite handoff` is optional/deferred).
- **Host-locality is scoped to Claude Code, not asserted universally (M4).** For Claude Code a
  resume reads a local transcript, so a handoff is host-local and machine-scoping discovery is
  correct. Whether Codex/OpenCode keep transcripts (and any per-session id) host-local is
  [U] per the Scout — if a runtime syncs transcripts across hosts, machine-scoping could hide a
  needed note there; carry that caveat rather than treating locality as settled.
- Freshness caveat (L1): the shared Context Note kind's horizon is 24h, but a handoff's `expires` is
  7d, so `status` will flag a >24h-old handoff as `stale`. This is advisory lint noise only —
  `expires` (not the kind horizon) is the real stop/GC — and is accepted rather than forking a
  dedicated kind. A future `aslite handoff` could refresh `timestamp` to quiet it.
- Expiry (L2): kept at 7d for weekend survival; it is GC only and is NOT relied on for
  mis-selection safety — the H2 guard is what prevents a wrong restore.
- No security identity: role/machine/actor are advisory, self-asserted (same posture as
  user-notices).

## What was tested (empirical provenance, this session, against the built CLI)

Harness: `examples/sample-bundle` copy + `recipe add context-notes` (governed Context Note kind:
required `# Summary`, 24h horizon, fields title/timestamp/description/tags). All via `./aslite ...
--dir <copy>`.

- H1 repro: `doc update context-notes/x --role orchestrator --machine host1` -> exit 2 USAGE
  ("unknown field(s) for kind 'Context Note': role, machine"). `doc write` has no
  custom-frontmatter flag. CONFIRMED inoperable.
- Write path: hand-authored .md with `session_id/role/machine/actor/expires` -> `promote --doc-key
  context-notes/pre-compact-<id8>.md` -> `written`; `doc read` shows ALL custom fields preserved.
- Discovery: `list --field actor=.. --field machine=.. --fields id,role,session_id,expires` ->
  `count:1`, custom fields projected. `--field role=orchestrator --field machine=testhost`
  AND-filters correctly.
- Consume: `doc delete <id>` -> `deleted:true`, re-run `deleted:false` (idempotent, exit 0).
  Mark-consumed via `promote --expected-version <ver>` also verified (set `consumed`), but rejected
  as multi-step.
- Full hook-injected block (mktemp heredoc with id8/expires/hostname substituted + promote) ran
  clean end to end; `date -u -v+7d` (BSD) with GNU fallback and `hostname` both work.
- L1: a note WITHOUT `# Summary` raised `status` `kind_warnings: 1`; a conforming note did not.
- M2 grep: `holaxis-orchestrator` skill has no old-id reference; the two compaction hooks do (and
  call the legacy MCP tool).

## Related

- [task](../tasks/pre-compact-multi-session.md)
- [scout research](../context-notes/research-precompact-multisession.md)
- [skeptic review](../context-notes/review-precompact-multisession.md)
- [user-notices](../designs/user-notices.md)
