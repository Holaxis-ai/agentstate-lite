---
type: Context Note
title: >-
  Field repro: mcp stdio error envelope on stdout turned a config typo into
  'Connection closed'
actor: claude-main
timestamp: '2026-07-27T20:26:18.245Z'
---
Hit in the wild 2026-07-27 (Brian + claude-main), confirming tasks/mcp-stdio-error-routing from the installed 0.1.0-pre.1 build of current main.

Setup mistake: registered the server with --dir pointing at the PROJECT root, not the bundle folder. Result in every client: 'MCP error -32000: Connection closed' with nothing on stderr — indistinguishable from a crash. Manual run showed the real story: the TOON NOT_FOUND envelope ('no OKF bundle at <project root> (no index.md)', help: aslite init --dir <same>) printed to STDOUT, i.e. onto the JSON-RPC channel; stderr empty.

Two compounding findings for the fix: (1) routing the envelope to stderr would have surfaced the cause in client logs immediately; (2) the help text steers toward 'aslite init --dir <project root>' — the divergent-second-bundle trap (tasks/cli-dir-error-steers-to-divergent-bundle) now reachable from MCP registration, where a HOST, not a human, may act on it. The mcp command knowing it holds a stdio channel could also validate --dir BEFORE starting the transport and refuse on stderr with the conventional-folder hint (.agentstate-lite) rather than init.

[the bug this confirms](../tasks/mcp-stdio-error-routing.md)
[the steering trap it compounds](../tasks/cli-dir-error-steers-to-divergent-bundle.md)
