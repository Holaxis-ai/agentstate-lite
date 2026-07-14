---
type: Claim
title: >-
  769 tests pass across six workspaces (cli 390, core 223, worker 117, ui 30,
  server 5, viewer 4)
status: deprecated
reason: >-
  Superseded: the suite grew 769 -> 1,336 across the sync chain, bundle pages,
  and #39-#52; successor claims/repo-stats/test-count-6 carries the current
  total.
evidence_command: >-
  for w in agentstate-lite @agentstate-lite/core @agentstate-lite/server
  @agentstate-lite/worker @agentstate-lite/viewer; do npm test -w $w 2>&1 | grep
  -c '^✔'; done; npm test -w @agentstate-lite/ui 2>&1 | grep 'Tests '
evidence_commit: 6c33402
actor: brian
timestamp: '2026-07-14T17:22:59.330Z'
---
[supersedes](test-count-4.md)
