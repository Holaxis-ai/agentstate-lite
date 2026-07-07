---
type: Claim
title: >-
  765 tests pass across six workspaces (cli 388, core 221, worker 117, ui 30,
  server 5, viewer 4)
status: deprecated
reason: >-
  Superseded by test-count-4: PR #3 merge added the near-miss-hint test (cli
  388→389); also its evidence commit e3c863f was reverted/re-landed via PR #3
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker @agentstate-lite/viewer; do npm test -w $w 2>&1 | grep
  -c '^✔'; done; npm test -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: e3c863f
timestamp: '2026-07-07T14:45:56.988Z'
---
[supersedes](test-count-2.md)
