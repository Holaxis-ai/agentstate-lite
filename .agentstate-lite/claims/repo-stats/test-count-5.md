---
type: Claim
title: >-
  769 tests pass across six workspaces (cli 390, core 223, worker 117, ui 30,
  server 5, viewer 4)
status: active
reason: >-
  Re-counted after PR #4 merge (kinds link-vocabulary discovery): +2 core, +1
  cli; supersedes the 766 claim
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker @agentstate-lite/viewer; do npm test -w $w 2>&1 | grep
  -c '^✔'; done; npm test -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: 6c33402
timestamp: '2026-07-07T17:21:46.405Z'
---
[supersedes](test-count-4.md)
