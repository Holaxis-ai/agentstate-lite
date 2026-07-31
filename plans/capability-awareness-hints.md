---
type: Plan
title: >-
  Plan: capability-awareness hints — surface hook / UI / MCP Views server when
  helpful-but-absent
actor: anthropic/claude
timestamp: '2026-07-31T18:44:25.126Z'
---

# FINALIZED decisions (Brian, 2026-07-31) — supersede the open questions above

1. Hook hint: show ALWAYS when absent + manual render (not rate-limited). Lead the command with
   `aslite hook install --scope global`, mention project scope as the narrower option.
2. **Discovery is decoupled from Views existence** (Brian's state-1 correction: gating on Views
   keeps Views-unaware solo users in the dark). Two vehicles, neither gated on Views:
   a. SKILL guidance (ungated): instruct the agent to proactively surface the Views/UI capability
      when a user is organizing/tracking/accumulating structured data or wants to *see* something —
      EVEN with zero Views in the bundle.
   b. A ONE-TIME tip at `aslite init`: a line noting you can author live Views and browse with
      `aslite ui`. First-run only; not a per-render nag.
3. **MCP detection is IN v1 for Claude Code** (Brian's state-2 case: teammate Views present, user
   hasn't registered the MCP server). Best-effort read of project `.mcp.json` / `~/.claude.json`;
   when Views exist AND no `aslite mcp` server is registered, emit a concrete runtime hint:
   `claude mcp add aslite -- aslite mcp` (inline View rendering), alongside `aslite ui` (browser).
   Other hosts (Codex/etc.): skill guidance now, detection a fast-follow.
4. Runtime hints block (home + status, NO_HINTS-silenceable) therefore carries: (a) absent-hook
   hint; (b) when Views exist — a browse/inline-render nudge, with the MCP `claude mcp add` line
   shown only when detection says it's not yet registered. Quiet when Views exist and MCP is
   already registered (no nag).

Net scope delta vs the original plan: discovery moved OUT of a Views-gated runtime line into
ungated skill guidance + a one-time init tip; Claude-Code MCP-registration detection moved from
"deferred" INTO v1. Both additive, both low-risk. Ready to build (ordinary-code review tier).
