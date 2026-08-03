---
type: Design
title: Multi-session-safe pre-compaction handoff notes
actor: claude-precompact-designer
timestamp: '2026-08-03T15:19:08.968Z'
---
# Multi-session-safe pre-compaction handoff notes

**Status:** Vetted design for `tasks/pre-compact-multi-session`, 2026-08-03
(claude-precompact-designer). A Skeptic reviews next.

Builds directly on `context-notes/research-precompact-multisession` (Scout ground truth) and
stays consistent with `designs/user-notices` (shared identity prerequisite + expiry/self-cleaning
stance). Do not re-derive the Scout's findings; they are cited, not repeated.

## The one load-bearing assumption (state it, then survive it being false)

**ASSUMPTION:** the harness scratchpad-path UUID (`.../<UUID>/scratchpad`) that a session reads
from its own system prompt is STABLE across a compaction and across a `--resume`/`--continue` in a
fresh process. This is UNVERIFIED (Scout [U]) and is Claude-Code-specific; Codex/OpenCode
equivalents are unknown.

**The design does not bet on it.** Identity (the id) uses the UUID only as a cheap unique slot for
the WRITE. Correctness of the RESUME lives entirely in a QUERY over self-describing frontmatter, so
a resuming session that has been handed a BRAND-NEW UUID (or no reachable UUID at all) still finds
the right handoff by `(actor, machine, role, recency)` without ever knowing its prior id. If the
assumption holds, the fast path is a single direct read; if it is false, the fallback query is the
correctness guarantee. Either way the handoff is found. This is the pivot the Skeptic should attack
hardest.

## Decision resolutions (one recommendation each)

### (a) Note identity scheme — ONE shape for main AND sub-agent

**RECOMMEND:** `context-notes/pre-compact-{id8}`, where `{id8}` = the first 8 hex characters of
the writer's OWN scratchpad-path UUID (e.g. `6cc651d1`). The SAME primitive identifies a main
session and a sub-agent (Scout [E]: each agent invocation gets its own scratchpad dir), so main and
sub-agent share ONE pattern — the main-vs-sub distinction moves OUT of the id and INTO a
frontmatter `role` field (see (d)). The `main` / `sub` infix in today's ids is dropped.

The id is only a "unique-enough slot"; the authoritative identity lives in frontmatter. Every
pre-compact note carries:

| field | purpose | required |
|---|---|---|
| `type: Context Note` | reuse the existing kind; NO new kind, NO codec (gate 3) | yes |
| `session_id` | FULL scratchpad UUID (self-describing; the id8 collision tiebreaker) | yes |
| `actor` | person/tool label, existing `--actor` mechanism | yes |
| `role` | `orchestrator` \| `main` \| `sub-agent` (see (d)) | yes |
| `machine` | `hostname` output; scopes discovery to the host the transcript is on | yes |
| `expires` | ISO date; mandatory GC + stop-condition (see (c)) | yes |
| `consumed` | ISO timestamp set on resume-restore; absent = live (see (c)) | no |
| `cwd` / `project` | absolute cwd; human/agent disambiguation aid | optional |
| `timestamp` | existing freshness field; drives most-recent pick | yes (auto) |

Why `id8` and not the full UUID in the id: 8 hex = 32 bits, and concurrent-session cardinality
here is single-digit, so a same-id collision between two DIFFERENT sessions is ~1e-6 even at 100
concurrent sessions; if it ever happened, the full `session_id` in frontmatter detects it. It also
matches existing practice (`pre-compact-main-6cc651d1`) and stays human-readable. A same-session
re-write to the same id8 across successive compactions is a single-writer idempotent overwrite, not
a collision — the collision the task is about is strictly ACROSS sessions, which distinct id8s
already avoid.

### (b) Resume-time discovery that degrades gracefully

**RECOMMEND a two-tier lookup that NEVER requires knowing your prior id:**

1. **Fast path (used only if the UUID happens to be stable):** compute my own `{id8}` from my
   current scratchpad path and `doc read context-notes/pre-compact-{id8}`. If it exists, is
   unexpired, and its `actor`/`machine` match mine, restore from it. This is a pure optimization.
2. **Fallback (the correctness guarantee — assumes my id may have CHANGED or be unreachable):**

   ```sh
   aslite list --type "Context Note" --prefix context-notes/pre-compact- \
     --field actor=<me> --field machine=<hostname> \
     --fields id,role,session_id,expires,consumed,timestamp
   ```
   then, deterministically: drop rows where `consumed` is set or `expires` is in the past; if
   resuming as the orchestrator, keep only `role=orchestrator`; **pick the row with the newest
   `timestamp`.** That row is my handoff regardless of whether my id changed. Read it, restore,
   then consume it (see (c)).

The pick rule is total and deterministic (recency breaks any residual tie). Because `--field`
filters and `--fields` projects arbitrary frontmatter (verified against the built CLI this
session), the ENTIRE discovery is expressible with today's `list` — no new command required.

Degradation ladder, explicit:
- UUID stable -> fast path hits, one read.
- UUID changed on resume -> fast path misses, fallback query finds it by (actor, machine, role,
  recency). CORRECT.
- UUID unreachable entirely (a non-Claude runtime with no scratchpad path) -> the session cannot
  compute an id8 to WRITE under, so it falls back to a documented id form (`pre-compact-{actor}-
  {hostname}` as the degenerate slot) and the SAME frontmatter-query discovery still works. The
  scheme therefore never hard-depends on the harness primitive existing; it only gets more precise
  slotting when it does.

### (c) Cleanup / staleness — reuse the user-notices stance verbatim

**RECOMMEND:** mandatory `expires` + a `consumed` early-out, exactly mirroring `designs/user-notices`
("expiry does double duty: stop-condition AND garbage collection; make it MANDATORY").

- `expires` is REQUIRED, default **now + 7 days**. Rationale: a handoff must survive a
  weekend/PTO gap between the compaction that wrote it and the resume that reads it; expiry is only
  GC, since correctness comes from most-recent-unconsumed, so err generous. (Horizon is a tunable;
  flagged for the Skeptic.)
- On resume-restore, the session marks ITS note `consumed: <ISO>` (`doc update <id> --consumed
  <ts>`). Discovery filters out `consumed` and expired notes, so a consumed handoff never re-nags
  and never wins the most-recent pick.
- Hard `doc delete` of a consumed note is OPTIONAL and discouraged as the default: mark-consumed +
  expiry-GC matches user-notices' "sparse, opt-in per-person state" reasoning and keeps a brief
  audit trail. The board never silts up because everything ages out on `expires`.

### (d) Orchestrator distinguishability — make it a QUERY

**RECOMMEND:** an explicit `role` frontmatter field with a small closed vocabulary:
`orchestrator` | `main` | `sub-agent`. The interactive main session that is coordinating sets
`role: orchestrator`; a plain non-coordinating interactive session sets `role: main`; a dispatched
worker sets `role: sub-agent`. "Which live session is THE orchestrator?" becomes exactly the query
Brian hit this session:

```sh
aslite list --type "Context Note" --prefix context-notes/pre-compact- \
  --field role=orchestrator --fields id,session_id,machine,timestamp
```

(filter unexpired/unconsumed, newest wins). No guesswork, no scanning bodies.

### (e) Convention-only vs thin tooling

**RECOMMEND: convention-only is the shipped fix.** A thin helper is specified below as an OPTIONAL,
explicitly-deferred fast-follow, NOT a blocker — the design is complete and correct without it.

Rationale for convention-only as the decision:
1. **Gate 3 precedent is directly on point.** The former `note` command and its core codec were
   DELETED with the explicit ruling "context notes are a plain default recipe authored via the
   generic path." A dedicated `pre-compact` verb would re-introduce exactly what was removed.
2. **A tool cannot obtain the leverage that would justify it.** The session UUID is injected into
   the AGENT's system prompt by the harness; the CLI process cannot read it (Scout [E]:
   `session-start.ts` does not even read the SessionStart stdin payload). So a helper could not
   compute the id autonomously — the agent would have to pass it in — which strips most of a tool's
   value: the agent already knows its id, and the write is one `doc write` line.
3. **The fiddly part is already a one-liner in the existing CLI.** Discovery is a single
   `list --field ... --fields ...` + a documented pick rule, both verified against the built CLI.
   Nothing here needs new code to be correct or mechanical.

Because the convention must not rely on instinct (Brian's stated working style), it ships as
COPY-PASTE-EXACT command templates in the CLAUDE.md diff below, not as prose to improvise from.

**Optional deferred helper (fully specified so the option is on record, not waved at):**
`aslite handoff` in `packages/cli/src/commands/handoff.ts`, a pure ergonomic wrapper over the
generic `doc write` / `list` / `doc update` path (no new kind, no codec, gate-3-clean):
- `aslite handoff write --session-id <uuid> --role <role> [--expires-in 7d] [--actor <me>] --body-file <f>`
  — computes `id8`, stamps `session_id`/`role`/`machine`/`expires`, writes the note. The agent
  passes `--session-id` (the CLI cannot read it); if omitted, it falls back to the
  `pre-compact-{actor}-{hostname}` degenerate slot from (b).
- `aslite handoff resume [--role orchestrator]` — runs the (b) fallback query, prints the winning
  note id (and can `--consume` it in the same call).
This is the ONE place tooling would live if a later decision judges the discovery ergonomics worth
it. Recommended posture: ship convention first; build `handoff` only if dogfooding shows agents
getting the query wrong.

### (f) Reconcile with the `pre-compact-{agent_id}` sub-agent scheme

**RECOMMEND: collapse all three current patterns into the ONE shape from (a).** Today there are
effectively three: `pre-compact-main` (documented), `pre-compact-main-{id8}` (drifted practice),
and `pre-compact-{agent_id}` (sub-agents, with `{agent_id}` never formally defined — Scout [U]).
Unify:
- Both main and sub-agent write `context-notes/pre-compact-{id8}` where `{id8}` derives from the
  writer's OWN scratchpad UUID (the same primitive for both — Scout [E]). This DEFINES the
  previously-undefined `{agent_id}` source canonically as the scratchpad UUID id8, closing the gap.
- The main-vs-sub distinction is now the `role` field, not the id. An orchestrator dispatching a
  sub-agent tells it `role: sub-agent` in the dispatch instruction (the orchestrator already hands
  sub-agents their bundle location and `--actor`; role rides the same channel).
- `context-notes/pre-compact-main` (the fixed-id outlier) is retired; it is already marked
  DEPRECATED on the board and points here.

## Proposed CLAUDE.md convention update

The fix is 90% documentation. This edits the global CLAUDE.md `Session setup` section (line 13's
read/discovery sentence) and adds a write-side convention. **PROPOSED — for Brian to apply** (do
NOT let an agent edit the global instructions):

```
PROPOSED - for Brian to apply
=============================

--- REPLACE, in the "Session setup for technical work" section, the sentence that currently reads:

  Specifically, check for a note at `context-notes/pre-compact-main` (main agent) or
  `context-notes/pre-compact-{agent_id}` (sub-agents) - if one exists, it was written immediately
  before the last compaction and contains the skill set and work state from that moment; use it to
  restore your context and reload any skills listed in it.

--- WITH:

  Specifically, find YOUR pre-compaction handoff. All handoffs (main OR sub-agent) live under one
  pattern: `context-notes/pre-compact-{id8}`, where {id8} is the first 8 hex chars of your own
  scratchpad-path UUID (.../<UUID>/scratchpad). Do NOT assume your id survived the resume - find
  the note by QUERY, not by id:

      aslite list --type "Context Note" --prefix context-notes/pre-compact- \
        --field actor=<you> --field machine=<hostname> \
        --fields id,role,session_id,expires,consumed,timestamp

  From the result, drop rows whose `consumed` is set or whose `expires` is past; if you are resuming
  as the orchestrator add `--field role=orchestrator`; then pick the NEWEST `timestamp`. That is
  your handoff - `doc read` it, reload the skills it lists, restore your work state, then mark it
  consumed:

      aslite doc update <that-id> --consumed <now-ISO>

  To find which live session is THE orchestrator, query `--field role=orchestrator` the same way.

--- ADD a new bullet in the same section (the WRITE side, before compaction):

  Before a compaction, write your handoff as `context-notes/pre-compact-{id8}` ({id8} = first 8 hex
  of your scratchpad UUID; if no scratchpad UUID is reachable in your runtime, use
  `pre-compact-{actor}-{hostname}`). It is a plain `type: Context Note` written through the generic
  path - NO special command. Stamp these frontmatter fields so a resuming session can find it
  without knowing your id:
      session_id: <full scratchpad UUID>
      role: orchestrator | main | sub-agent    (a dispatched sub-agent uses `sub-agent`)
      machine: <hostname>
      expires: <now + 7 days, ISO date>        (mandatory; ages the note out - GC)
      actor: <you>                              (via --actor / AGENTSTATE_LITE_ACTOR)
  Overwriting your OWN same-id note across successive compactions is fine (single writer). Never use
  the old fixed id `context-notes/pre-compact-main` - concurrent sessions clobber it silently.

--- (Orchestrator dispatch section) when giving a sub-agent its bundle setup, also tell it its
    handoff role: it writes `role: sub-agent` on its pre-compact note.
```

## Non-goals / boundaries

- No new kind, no core codec, no engine change (gate 3): `type: Context Note` + frontmatter only.
- No push channel and no cross-machine resume: a handoff is host-local (the transcript resumes on
  the machine that wrote it), which is why `machine` scopes discovery - matches user-notices'
  local-first, pull-on-interaction stance.
- No security identity: `actor`/`role`/`machine` are advisory, self-asserted metadata (identical
  posture to user-notices). Attribution here is convenience, not a trust boundary.
- Discovery does NOT depend on the session UUID being stable - that is the whole point of (b).

## Related

- [task](../tasks/pre-compact-multi-session.md) - the 6 decision points this resolves
- [scout research](../context-notes/research-precompact-multisession.md) - ground truth built on
- [user-notices](../designs/user-notices.md) - shared identity prerequisite + expiry/self-cleaning stance

[tasks/pre-compact-multi-session](../tasks/pre-compact-multi-session.md)

[context-notes/research-precompact-multisession](../context-notes/research-precompact-multisession.md)

[designs/user-notices](user-notices.md)
