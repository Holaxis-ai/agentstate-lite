---
type: Plan
title: >-
  Plan: capability-awareness hints — surface hook / UI / MCP Views server when
  helpful-but-absent
actor: anthropic/claude
timestamp: '2026-07-31T15:36:21.828Z'
---
# Goal

Make the aslite skill + CLI **proactively surface three optional-but-experience-improving
surfaces** — the SessionStart hook, the local UI, and the MCP Views server — telling the user
when each would help but isn't set up, with the exact enable command. Today they are only
listed passively in the command reference; the agent never notices the gap or offers the fix.
Serves the ultimate goal (aslite as frictionless shared memory) by closing the distance between
"the capability exists" and "the user knows to turn it on."

Proximate goal: ship capability-awareness that is helpful, not naggy, and cannot drift from the
real command surface.

# The three surfaces (taxonomy — the design turns on their differences)

| Surface | Improved experience | What "on" means | Enable command | CLI-detectable? |
|---|---|---|---|---|
| **SessionStart hook** | New sessions auto-orient (board pull + home render) with no manual `status` | A managed SessionStart hook in host settings | `aslite hook install` (`--scope global` = all projects) | **YES**, cheap fs-only |
| **Local UI** (`aslite ui`) | Human browses the bundle + Views in a browser | Nothing persistent — an on-demand loopback server | `aslite ui` (just run it) | **N/A** (ephemeral) |
| **MCP Views server** (`aslite mcp`) | Client renders bundle Views inline as MCP Apps (richer than text) | Registered as an MCP server in the **client** | `claude mcp add aslite -- aslite mcp` (Claude Code; Codex has its own) | **HARD** (client-side, host-specific config) |

The detectability column drives the whole split: only the hook is cheaply, reliably detectable
by the CLI, so only it gets a machine-emitted runtime hint. The UI is never "installed" (you
just start it), and MCP registration lives in host client config the CLI can't reliably read —
so those are agent-behavioral offers carried in skill text, not runtime detection.

# Design principles

1. **Suggest only when it would actually help (anti-nag).**
   - Hook hint fires only when a managed hook is ABSENT *and* the render was NOT produced by
     session-start. (If the hook rendered this home view, the hook is obviously installed —
     detectable via `deps.boardPull === undefined`, confirmed present in home.ts, and there is
     already a `boardPull === undefined` guard to follow.) So the nudge appears exactly where it
     helps: a manual `aslite`/`aslite status` during orientation, which is what an agent runs
     *because* there's no hook.
   - UI / MCP guidance is gated on the bundle having something worth showing — registered
     `type: View` docs — or the user signalling they want a visual/rich surface. A Views-free
     bundle never gets "start the UI to see Views."
2. **Detectable → runtime hint; behavioral → skill text.** The agent only acts on what it sees,
   so the one genuinely-detectable high-value gap (the hook) is emitted as a `hints:` block in
   home + status. Context-dependent offers (UI, MCP) live in the skill as "when X, offer Y."
3. **One line, actionable, copy-pasteable.** Each hint = what's missing + one clause of why +
   the exact command. No paragraphs.
4. **Silenceable.** `AGENTSTATE_LITE_NO_HINTS` (any non-empty value) suppresses the runtime
   hints block — mirrors the existing `AGENTSTATE_LITE_NO_AUTOPULL` switch — for CI/scripts.
5. **Offline, cheap, never-fail.** Hint detection is fs-only (hook) and must never break home's
   render-always contract. No network, no new slow path on the session-start hot path.
6. **Single source of truth.** The "when helpful + enable command" copy lives in ONE capabilities
   table (in/next to reference.ts). BOTH the runtime hint text and the generated skill prose
   derive from it, so they can't drift — same discipline the command reference already enforces.

# Runtime hints (home.ts + status.ts)

- **home.ts**: after the existing fields, emit an optional capped `hints[]:` block. Reuse the
  fs-only `hookInstalled()` (home already imports its sibling `hookNeedsUpdate`). Emit the hook
  hint when `!hookInstalled(...)` AND `deps.boardPull === undefined`. Whole block gated behind
  `AGENTSTATE_LITE_NO_HINTS`. Additive field — existing output contract unchanged.
- **status.ts**: surface the same absent-hook advisory as a findings-style row (status is the
  *other* orientation entry point — the global CLAUDE.md says "Otherwise run `aslite status`").
- Both stay AXI-clean: a minimal, capped list; no full prose dumped into machine output.
- The MCP/UI surfaces are NOT runtime-detected in v1 (see scope) — but if the bundle has
  registered Views, home MAY carry a single soft line ("this bundle has Views — `aslite ui` to
  browse them"), since Views presence IS cheaply detectable and is the one context where the UI
  is unambiguously useful. (Open question 3.)

# Skill text (generated, skill-render.ts)

- A new short section — working title **"## Optional surfaces — when to turn them on"** —
  rendered from the capabilities table, covering all three: one line on the improved experience,
  when to offer it, the exact enable command. This is what makes the agent proactively explain
  the hook and OFFER the UI / MCP registration in context (the parts that can't be a runtime
  hint).
- Both the npm and skill channels regenerate from the same table; `check:skill` gates drift.

# Scope decisions / non-goals

- **MCP-registration auto-detection is NOT in v1.** Reliable cross-host detection of whether
  `aslite mcp` is registered as a client MCP server is a rabbit hole (Claude `.mcp.json` +
  `~/.claude.json`, Codex config, others). v1 ships skill-text guidance + the exact
  `claude mcp add aslite -- aslite mcp` command, offered by the agent when Views exist and the
  client supports MCP Apps. A best-effort project-`.mcp.json` presence check is a possible
  fast-follow, explicitly deferred.
- **No new "install everything" convenience command.** (`aslite setup` remains a non-goal per
  `designs/npm-bundle-bootstrap`.)
- **The hook/ui/mcp mechanics themselves are untouched** — this unit is purely additive
  awareness over existing commands.

# Risk tier & assurance

Additive, read-only detection + generated prose + one env-gated output block; no destructive
boundary, no network. **Ordinary-code tier**: Builder → one independent review of the exact SHA.
QA is light and deterministic — the only real risk is "does the hint fire in exactly the right
cases": a truth table over {hook installed?} × {boardPull defined (hook-driven) vs undefined
(manual)} × {NO_HINTS set?}, plus a Views-present vs Views-absent case for the UI line, plus the
`check:skill` regeneration and a skill-distribution assertion that the new prose ships. Gates:
build / typecheck / test / check, all unpiped. The risky bit (the fire/suppress matrix) and its
tests ship in the same commit.

# Open questions for you

1. **Nagginess:** OK to show the hook hint on every manual `aslite`/`status` while absent (it's
   one line, only when genuinely absent + manual)? Or rate-limit to once-per-session? (I lean:
   always — the guard already makes it rare and relevant.)
2. **Hook scope in the hint:** recommend `aslite hook install` (this project) or
   `--scope global` (all projects)? (I lean: lead with `--scope global`, since auto-orient
   everywhere is the point, and mention project scope as the narrower option.)
3. **UI line:** include the soft "this bundle has Views — `aslite ui`" runtime line when Views
   exist (cheap, high-signal), or keep the UI purely as skill-text guidance? (I lean: include
   it — Views presence is the one unambiguous "the UI would help right now" signal.)
4. **MCP detection:** confirm deferring auto-detection to a fast-follow and shipping skill-text
   guidance + command in v1 is acceptable.

[implements](../tasks/capability-awareness-hints.md)

# Review amendments (independent code-review, 2026-07-31 — all VERIFIED against the tree)

Both load-bearing mechanics confirmed real: fs-only `hookInstalled()` (hook.ts:608, zero-arg
default already covers project+global scope) is reusable from home; `deps.boardPull === undefined`
is a confirmed manual-vs-hook signal (session-start.ts:326 always sets it; home.ts:775 already
guards on it). MCP deferral confirmed correct — grep found NO existing cross-host MCP-config
reader anywhere in the repo. Amendments to fold into the build:

1. **status advisory is a TOP-LEVEL note, not a finding row.** status is strictly a bundle lint
   (one loadKinds + one query); a host-config hook read is not bundle-derived. Surface it in the
   shape of the existing `legacy_naming.note` (status.ts:555-578), and gate on `!remote` (a
   local-hook hint is meaningless against `--remote`).
2. **The Views check is FREE.** Don't add a scan — home already computes `summary.byType`
   (home.ts:280-284). `summary.byType["View"] > 0` gates the UI line at zero I/O cost. (Caveat:
   catches `type: View`, not legacy `type: Page` nor registration validity — fine for a soft line.)
3. **Prefer the `hook_update` single-field shape over a general `hints[]` array.** home already
   carries one advisory string field, `hook_update` (home.ts:697), inserted additively/omit-when-
   absent. Reuse that exact shape for the hook hint (flatter schema, avoids a "capped list of 1");
   add the Views line as a second optional string only when it lands. Compute in `home()` (where
   boardPull + env live) and thread into the pure `buildHomeView` as a new param, like hookUpdate.
4. **Re-baseline the byte-identity test pins deliberately.** The hook hint fires by DEFAULT
   (absent hook is the common new-user state), so it changes home's + status's default output and
   will break existing byte-identity pins (status.ts:510-518 and the home analogues). Treat the
   `NO_HINTS`-set output as the pinned-stable CI path; update the default-output baselines as an
   explicit, reviewed step — not incidental churn.
5. **Enable commands are invocation-parameterized fragments** (`aslite` / `$ASLITE` / `npx -y
   @holaxis/aslite`), projected with the prefix at render time like `CommandRef.usage` — not baked
   strings — so the one capabilities table serves home, status, and both skill channels.
6. **NO_HINTS env plumbing**: home reads no `process.env` today (autopull owns NO_AUTOPULL). Add
   the `AGENTSTATE_LITE_NO_HINTS` read inside the never-throw envelope, mirroring the documented
   "any non-empty value, even 0" semantics (skill-render.ts:454-459).

Verdict: sound to build with these scoping corrections; ordinary-code review tier confirmed.

[implements](../tasks/capability-awareness-hints.md)
