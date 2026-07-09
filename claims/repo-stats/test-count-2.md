---
type: Claim
title: >-
  760 tests pass across six workspaces (cli 383, core 221, worker 117, ui 30,
  server 5, viewer 4)
status: deprecated
reason: >-
  Superseded by test-count-3: typed-edge reading v0 (e3c863f) added 5 cli tests
  (383→388)
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker; do npm test -w $w 2>&1 | grep -c '^✔'; done; npm test
  -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: 7a1fd65
timestamp: '2026-07-07T13:17:35.814Z'
---
[supersedes](test-count.md)
