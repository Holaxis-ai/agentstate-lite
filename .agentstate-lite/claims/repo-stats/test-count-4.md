---
type: Claim
title: >-
  766 tests pass across six workspaces (cli 389, core 221, worker 117, ui 30,
  server 5, viewer 4)
status: deprecated
reason: 'Superseded by test-count-5: PR #4 added 3 tests (766→769)'
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker @agentstate-lite/viewer; do npm test -w $w 2>&1 | grep
  -c '^✔'; done; npm test -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: f64090f
timestamp: '2026-07-07T17:21:46.513Z'
---
[supersedes](test-count-3.md)
