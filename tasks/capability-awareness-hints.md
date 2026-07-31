---
type: Task
title: >-
  Capability-awareness: surface hook / UI / MCP Views server when
  helpful-but-absent
status: todo
priority: '3'
actor: anthropic/claude
timestamp: '2026-07-31T18:47:12.807Z'
---
# Problem

The aslite skill/CLI lists three optional-but-experience-improving surfaces — the SessionStart
hook, the local UI (`aslite ui`), and the MCP Views server (`aslite mcp`) — only PASSIVELY in the
command reference. It never notices when one of these would help but isn't set up, and never gives
the user the command to enable it. Two user states are specifically underserved:

1. A solo user who has never created a View and doesn't know Views exist — gating any nudge on
   "the bundle already has Views" keeps this user in the dark forever.
2. A team user whose teammates authored Views (arriving via the shared board) but who has not
   registered the MCP Views server, so they never get inline View rendering in their client.

# Solution (finalized 2026-07-31)

Additive capability-awareness across generated skill text + runtime hints, driven from ONE
capabilities table (so hint text and skill prose cannot drift), and silenceable via
`AGENTSTATE_LITE_NO_HINTS`:

- **Runtime hint (home + status):** absent SessionStart hook -> `aslite hook install --scope
  global`, shown only on a MANUAL render (guarded by `deps.boardPull === undefined`, so it never
  fires when the hook itself rendered the view).
- **Discovery, ungated on Views existing (serves state 1):** skill guidance instructs the agent to
  proactively surface the Views/UI capability when a user is organizing/tracking/accumulating data
  or wants to "see" something — even with zero Views — PLUS a one-time tip at `aslite init`.
- **Views present (serves state 2):** nudge `aslite ui` to browse; best-effort Claude-Code
  detection (`.mcp.json` / `~/.claude.json`) of an unregistered MCP server ->
  `claude mcp add aslite -- aslite mcp`. Quiet when already registered.
- **Deferred (fast-follow):** MCP-registration detection for Codex and other hosts (skill guidance
  covers them for now).

Full design, verified code integration points (home.ts boardPull signal, fs-only `hookInstalled`,
free `summary.byType["View"]` check, skill-render section, byte-fixture re-baseline), the
independent plan review, and the finalized decisions are in the plan.

Risk tier: ordinary-code (additive, read-only detection + generated prose + one env-gated output
block; no destructive boundary, no network). NOT YET BUILT — filed for later; plan is build-ready.

[detailed in](../plans/capability-awareness-hints.md)
