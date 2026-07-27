---
type: Task
title: >-
  MCP stdio server writes its error envelope onto the JSON-RPC channel (stdout),
  leaving stderr empty
status: done
priority: '2'
description: >-
  Shipped in PR #176: MCP errors now go to stderr and stdout remains a pristine
  JSON-RPC channel.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-27T18:54:07.341Z'
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

# Implementation (2026-07-27)

PR [#176](https://github.com/Holaxis-ai/agentstate-lite/pull/176), commit `6b94195`, puts the
exception at the public `mcp` command boundary. It renders any unhandled parse, bundle-resolution,
or server-startup failure once to stderr, marks the error handled, and rethrows it so the outer AXI
boundary preserves the existing exit code without rendering a second envelope to stdout.

The change deliberately does not hide the underlying configuration error. A Claude Desktop entry
that cannot resolve a bundle still reports `NOT_FOUND`, but now reports it as a useful diagnostic
instead of corrupting the JSON-RPC transport.

# Verification

- Focused MCP command and built-stdio tests: 6/6 pass.
- Built subprocess assertions pin stdout as exactly zero bytes for both `USAGE` and `NOT_FOUND`.
- Direct boundary assertions cover argument parsing, bundle resolution, and server startup.
- Full repository `npm run check` passes, including build, typecheck, all workspace/script tests,
  installed-package proof, skill check, and 19 Playwright end-to-end tests.

Independent review found no blocking or non-blocking issues and added adversarial subprocess
coverage for an unexpected positional argument, a blank actor, ambient discovery from a
bundle-less directory, and an already-handled runtime rejection. PR #176 merged to `main` as
`03a07dd7ab1f26f49b7410666a7179e6bee3219e` on 2026-07-27.
