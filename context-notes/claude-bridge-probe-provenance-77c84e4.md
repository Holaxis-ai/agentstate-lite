---
type: Context Note
title: Claude bridge diagnostic probe provenance at 77c84e4
actor: codex-pr177-followup
timestamp: '2026-07-29T21:43:04.412Z'
---
# Summary

A throwaway Claude Desktop diagnostic build is prepared to distinguish the first missing registered-View bridge boundary. It is based on clean `origin/main` at `77c84e4827f332cd8a84079d239dc76398b88959`, which contains merged PR #177 (`13fcc2c`), and is intentionally isolated from the production feature branch.

The build advertises the unique MCP App resource URI `ui://agentstate/view-host/claude-bridge-probe-2026-07-29.html`, displays the fingerprint `origin-main-77c84e4/claude-bridge-probe-2026-07-29`, and emits an ordered on-card trace of shell boot, App connection, tool-result receipt, authorized mount, child boot/reply, raw outer message receipt, exclusive outer classification, forwarding entry, SDK tool-call start/settle, and post-to-child reply.

# Provenance

- Diagnostic worktree: `/private/tmp/aslite-claude-bridge-probe`
- Baseline commit: `77c84e4827f332cd8a84079d239dc76398b88959`
- Diagnostic diff object: `19d50fc2c3acc468390b6467ac8720e3e58dcc75`
- Generated App HTML: 744,338 bytes
- Generated App HTML SHA-256: `0d7621d193a7d4167910792504925bc332602c9851582491ce8840cddda039f8`
- Built CLI SHA-256: `e4632c31961ce0d50dc2779ed45e85673224fdd63434e97dc0481c71b4c117ab`
- Built CLI: `/private/tmp/aslite-claude-bridge-probe/packages/cli/dist/agentstate-lite.mjs`
- Claude server name: `agentstate-lite-claude-bridge-probe`
- Bundle: `/Users/brian/GitHub/agentstate-lite/.agentstate-lite`
- Actor: `brian-claude-bridge-probe`
- Prior Claude config backup: `/private/tmp/claude_desktop_config.before-bridge-probe.json`

# Interpretation

- No shell fingerprint: Claude did not load the unique diagnostic resource.
- Shell trace but no child boot: registered child/CSP/mount failure.
- Child boot/raw message followed by `classified=hidden`: initially hidden lifecycle gate owns the dropped one-shot bridge start.
- Raw message followed by source mismatch or another classification: repair that owning boundary without weakening other gates.
- Accepted/forward entry with no SDK start: outer control-flow defect.
- SDK start with no settle and no server receipt: host forwarding/hang.
- Server receipt with no child reply: inspect the response/return path.

# Goals and status

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in supported MCP hosts.

Proximate goal: establish Claude Desktop's exact first-failing bridge boundary before selecting the lifecycle repair. This serves the ultimate goal by keeping the correction tied to observed host behavior and preserving authorization/source/epoch invariants.

Status: diagnostic build and config are ready; real-host trace pending a full Claude Desktop restart and one exact `show_view` invocation.

[tracks](../tasks/claude-desktop-durable-bridge-initialization.md)

[test model](claude-bridge-test-model-13fcc2c.md)

[architecture](claude-bridge-architecture-diagnosis-13fcc2c.md)
