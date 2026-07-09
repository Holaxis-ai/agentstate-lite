---
type: Claim
title: >-
  759 tests pass across six workspaces (cli 382, core 221, worker 117, ui 30,
  server 5, viewer 4)
status: deprecated
reason: >-
  Superseded: commit 7a1fd65 added the shipped-recipe drift-gate test, moving
  the cli count 382->383; successor claim carries the new total
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker; do npm test -w $w 2>&1 | grep -c '^✔'; done; npm test
  -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: 1463bbd
timestamp: '2026-07-06T21:04:58.454Z'
---

