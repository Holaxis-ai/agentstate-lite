---
type: Task
title: >-
  MCP stdio server writes its error envelope onto the JSON-RPC channel (stdout),
  leaving stderr empty
status: in_progress
priority: '2'
description: >-
  CLAIMED 2026-07-27 by openai/codex — fixing the live Claude Desktop failure by
  reserving MCP stdout for JSON-RPC across every pre-initialize error path.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-27T15:24:38.979Z'
---
# Defect

Every startup failure of `aslite mcp` writes its structured error envelope to **stdout** and
nothing to stderr, then exits. On an MCP stdio server, stdout IS the JSON-RPC channel, so the host
receives a TOON blob on the protocol stream — malformed JSON-RPC — followed by EOF, while the
channel a host actually reads for diagnostics stays empty.

The observable result is a server that fails to start for reasons the user cannot see.

# Evidence (2026-07-26, dist built from main @ 54e39e5)

Each invocation run with stdin at `/dev/null`, stdout and stderr captured separately:

| Invocation | Exit | stdout | stderr |
|---|---|---|---|
| `mcp` in a bundle-less dir | 6 | 208 B `NOT_FOUND` envelope | **0 B** |
| `mcp --dir <non-bundle path>` | 6 | 367 B `NOT_FOUND` envelope | **0 B** |
| `mcp --nope` | 2 | 98 B `USAGE` envelope | **0 B** |
| `mcp --remote https://…` | 2 | 100 B `USAGE` envelope | **0 B** |
| `mcp --actor ""` (inside a bundle) | 2 | 130 B `USAGE` envelope | **0 B** |

This is the whole error boundary, not one path: both the `USAGE` (exit 2) and `NOT_FOUND`
(exit 6) classes behave identically. A protocol-level probe confirms the process exits before
`initialize` ever completes — a client's `initialize` request simply times out.

# Why it is the existing exception, unextended

AXI principle: errors render as TOON on stdout with a capped exit-code taxonomy. CLAUDE.md gate 1
already records one carve-out — `doc read --out -` routes its envelope to STDERR because stdout is
reserved for raw bytes.

The MCP stdio server is the second surface where stdout is reserved, and the carve-out did not
follow it there. The convention is right; its exception list is one entry short.

# Scope

1. Route the `mcp` command's error envelope to stderr, on the same grounds and in the same shape
   as the `doc read --out -` exception. Preserve the exit-code taxonomy unchanged.
2. Cover the whole boundary — argument validation, bundle resolution, and any other pre-`initialize`
   failure — not only the `NOT_FOUND` case that surfaced this.
3. Pin it with a test that asserts stdout stays byte-empty on a failed `mcp` start while stderr
   carries the envelope. stdout purity is the actual contract; asserting only "stderr is non-empty"
   would not catch a regression that writes to both.
4. Record the carve-out in CLAUDE.md gate 1 alongside the existing `doc read --out -` sentence, so
   the next stdout-reserving surface inherits the rule instead of rediscovering it.

# Priority note

Raised by unpinning `--dir` from a user-scoped MCP entry, which makes the server load in every
project rather than one. On a machine with 81 project entries, the bundle-less case is the common
case, not the exotic one. Impact is a dead server entry and an invisible cause rather than data
loss, but it fires on ordinary use of an experimental surface we are actively asking people to try.
