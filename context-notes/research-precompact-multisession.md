---
type: Context Note
title: 'Scout research: multi-session-safe pre-compaction notes'
actor: claude-precompact-scout
timestamp: '2026-08-03T15:13:13.797Z'
---
# Summary

SCOUT ground-truth for `tasks/pre-compact-multi-session` (the Designer builds on this; I do
NOT propose the design). Each finding is labeled [E]=empirical-from-code/docs, [R]=reasoned,
[U]=uncertain/gap.

The crux: the fix is a CONVENTION problem, not a code problem. There is no aslite machinery
for session identity or pre-compact notes at all; notes are written through the generic
`doc write` / `new "Context Note"` path. The one hard unknown is what STABLE per-session
identifier an agent can actually read at runtime to scope its note id.

## 1. IDENTITY — what a session can read to scope a note id

- [E] NOTHING in the repo captures, derives, or exposes a session_id / agent_id to the agent.
  The only `sessionID` in the whole source is in the OpenCode ambient-context plugin
  (`packages/cli/src/commands/hook.ts:561`), used purely to cache the home render per session
  inside that plugin — it is never surfaced to the agent, never written to a doc, never passed
  to any command.
- [E] `session-start.ts` does NOT read the SessionStart hook's stdin payload at all. Claude
  Code's SessionStart input carries `session_id`, `transcript_path`, `cwd`, but aslite ignores
  it — it just runs a board pull + home render. So aslite gives the agent no session handle.
- [E] The ONLY runtime session identifier available today comes from the HARNESS via the
  system prompt, not from aslite: the scratchpad directory path embeds a session/agent UUID.
  Observed this session: `/private/tmp/claude-501/-Users-brian-GitHub-agentstate-lite/<UUID>/scratchpad`.
  Confirmed empirically — the filesystem holds one such dir per session, INCLUDING
  `6cc651d1-a193-4944-9520-a14f2234d0cf` (the id the current handoff notes use; the note keys
  on its first 8 hex chars `6cc651d1`).
- [E] IMPORTANT nuance: the scratchpad UUID is per-AGENT-INVOCATION, not per-human. This SCOUT
  sub-agent has its OWN distinct dir (`0baf5bd2-...`), separate from the main session's
  `6cc651d1-...`. So the same primitive (my own scratchpad UUID) identifies BOTH a main
  session and a sub-agent — which is why it could unify the two schemes rather than fork them
  (design call, not mine).
- [R] Reachability is Claude-Code-specific. The scratchpad-path convention is injected by the
  Claude Code harness system prompt. Whether Codex and OpenCode expose an equivalent stable
  per-session path/UUID in their prompts is NOT determinable from this repo — treat as
  per-runtime and unverified. [U]
- [U] KEY UNVERIFIED ASSUMPTION for the whole design: is the scratchpad UUID STABLE across a
  compaction (the moment the note is written vs. read)? A compaction does not end the process,
  so [R] it very likely persists — but I cannot prove it from the repo, and a genuine
  `--resume`/`--continue` of a transcript in a fresh process may mint a NEW UUID, which would
  break "resuming session finds its own note by id." The Designer must either verify this
  empirically or design discovery to tolerate a changed id (fall back to most-recent + actor
  match).
- [E] The other identity aslite already has is `actor` (`packages/cli/src/actor.ts`):
  `--actor` > `AGENTSTATE_LITE_ACTOR` env > absent. Advisory, unverified, stored per-doc in
  frontmatter. It identifies a PERSON/tool label (e.g. `brian-claude`), NOT a session — many
  concurrent sessions share one actor, so actor alone cannot disambiguate them. `designs/user-notices`
  proposes seeding a default actor from `git config user.email`; same identity root, still not
  session-granular.

## 2. SUB-AGENT SCHEME (`pre-compact-{agent_id}`) as documented today

- [E] The convention lives ONLY in the global CLAUDE.md (Session-setup section): on resume,
  "check for a note at `context-notes/pre-compact-main` (main agent) or
  `context-notes/pre-compact-{agent_id}` (sub-agents)." It is prose convention — no code, no
  command enforces or generates it.
- [U] CLAUDE.md never DEFINES where `{agent_id}` comes from or its format. In practice it is
  whatever identity the orchestrator hands a sub-agent (an assigned role/name) or the
  sub-agent's own scratchpad UUID. This is the gap the main-agent scheme must align to: pick
  ONE identifier source so main and sub-agent notes are the same pattern
  (`pre-compact-{id}`), not three.
- [E] Sub-agents already avoid the collision the main agent suffers precisely because their id
  is scoped; the main agent is the lone fixed-id outlier (`pre-compact-main`).

## 3. CONVERGENCE / SILENT LOSS — exact mechanism when two sessions write the same id

- [E] Board writes share one `board` branch via `aslite sync`. Two concurrent main sessions
  each write `context-notes/pre-compact-main` into their own board worktree, then sync.
- [E] `sync` = commit local board changes, then `fetchRebaseResolving`
  (`packages/board-git/src/porcelain.ts:1422`) replays local commits onto `origin/board`.
  When the SAME doc path changed on both sides, git reports a conflict and the CONVERGING
  resolver runs (porcelain.ts:1466+):
  1. EXPORT yours FIRST: `git show :3:<path>` (rebase inverts ours/theirs; `:3:` = YOUR local
     version) is written to an export file, plus a `.body.md` companion that is a runnable
     `doc update --body-file` input.
  2. KEEP the UPSTREAM (teammate's / the other session's) version on the board — explicit ref,
     never `--ours/--theirs`.
  The run exits 5 with one row per conflicted doc; the CLI surfaces the export path.
- [E] So "silent loss" concretely: of two same-id pre-compact notes, exactly ONE survives on
  the board; the loser's content is dumped to a local export file and its board slot holds the
  winner's bytes. If the same id changed on only ONE side since the base (the other session
  hadn't touched it), there is NO conflict at all — the later write simply fast-forwards on top
  and becomes HEAD, overwriting the earlier content with zero signal.
- [R] Why this is worse than an ordinary converge: reconciliation requires a human/agent to
  notice the exit-5 receipt and merge the export file. An agent that is ABOUT TO COMPACT (or a
  fresh session reading the note) will not do that — the export file is silently abandoned and
  the handoff it existed to carry is lost. This is the exact failure the task calls out.
- [E] `sync --show-incoming <id>` prints the kept version; reconciliation is `doc update
  <id> --body-file <export>` then `sync`. Fine for a human decision, useless for an
  unattended pre-compact handoff. Per-session ids sidestep the collision entirely (distinct
  paths never converge).

## 4. EXISTING TOOLING — is there any pre-compact / context-note / session-identity command?

- [E] NO. Full command set (`packages/cli/src/commands/`): bundle, catalog, init, index,
  status, doc (write/update/read/history/delete), list/query, link, artifact, promote, pull,
  blobs, delete, new, kinds, kind field, recipes, recipe add, serve, ui, mcp, version,
  session-start, hook, skill, sync. There is no `note`, `context-note`, `pre-compact`, or any
  session-identity verb.
- [E] The former `note` command and its core codec were deliberately DELETED (CLAUDE.md gate 3):
  "context notes are a plain default recipe authored via the generic path." Context Note is a
  KIND supplied by the built-in `context-notes` recipe; instances are created with
  `new "Context Note" <id>` / `doc write` / `doc update`.
- [R] A thin helper (e.g. `aslite session-start`-adjacent, or a new `pre-compact`/`handoff`
  verb) would have a natural home in `packages/cli/src/commands/` — it could compute the
  scoped id, set an expiry field, and locate-on-resume — IF the Designer decides tooling beats
  convention-only. That is a decision point (task AC #5), not a scout finding.

## 5. DOMAIN MODEL (taxonomy for the Designer)

- session — one live agent run (main or sub-agent). Concurrent sessions are NORMAL here
  (filesystem shows many live scratchpad dirs).
- session_id — a per-session/per-agent UUID. Today only reachable via the harness-injected
  scratchpad path (`.../<UUID>/scratchpad`); NOT provided by aslite. Claude-Code-confirmed;
  Codex/OpenCode unverified.
- main-agent vs sub-agent — main = orchestrator/interactive session; sub-agent = dispatched
  worker. Both get their OWN scratchpad UUID (same identity primitive).
- agent_id — the sub-agent scheme's scoping token; format/source undefined in CLAUDE.md
  (orchestrator-assigned name or own UUID).
- actor — advisory person/tool label (`--actor` / env), per-doc frontmatter. Identifies a
  human/tool, NOT a session; shared across a person's concurrent sessions.
- pre-compact note — a `type: Context Note` doc written just before compaction to hand off
  skill set + work state; read on resume to restore context.
- fixed-id collision — the bug: main agent uses the single fixed id
  `context-notes/pre-compact-main`; concurrent mains clobber it.
- sync convergence — the board's two-sided-write resolution: teammate/other-session version
  kept, yours exported to a file, exit 5 (silent loss for an unattended handoff).
- orchestrator role — "which live session is THE main orchestrator?" (Brian designated
  `6cc651d1` on 2026-07-30). Currently guesswork; task AC #4 wants an explicit role marker so
  it becomes a QUERY (a frontmatter field on the note, e.g. role=orchestrator).
- expiry / consume — per-session notes accumulate; task AC #3 wants expiry + a "consumed"
  mark, mirroring `designs/user-notices`' mandatory-expiry + optional-ack self-cleaning stance.

## Gaps the Designer must close (honest)

- Scratchpad-UUID stability across compaction and across `--resume` in a fresh process. [U]
- Whether Codex/OpenCode expose any stable per-session identifier at runtime. [U]
- The canonical source/format of sub-agent `agent_id` (never defined). [U]
- Whether the fix is convention-only or warrants a thin `aslite` helper (decision, not fact).

## Related

[related](../tasks/pre-compact-multi-session.md)
[related](../designs/user-notices.md)
[related](../context-notes/pre-compact-main-6cc651d1.md)
