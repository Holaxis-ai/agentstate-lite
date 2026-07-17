---
type: Task
title: >-
  Flaky e2e harness boot: 'ui command exited early (code 1) before printing a
  receipt' (F2, nondeterministic)
status: todo
priority: '3'
description: >-
  Observed during the U3 teaching-pass review (2026-07-17): the F2 e2e test
  failed all 3 retries with a HARNESS-BOOT failure ('ui command exited early
  (code 1) before printing a receipt') — before any tested behavior runs — then
  passed 14/14 on two full-gate reruns and in isolation. Nondeterministic boot
  flake, distinct from the fixed session-rotation product bug (#69) and from
  tasks/ui-remote-watcher-boot-timeout (that's a hanging boot, this is an
  early-exit boot). Diagnose: capture the ui command's stderr on boot failure in
  the harness so the next occurrence self-explains (the current harness swallows
  it); suspects: port acquisition race, temp-dir collision under parallel
  suites. Same treatment as the session-rotation task: diagnose-first, fix at
  the right layer.
actor: brian-claude
timestamp: '2026-07-17T20:54:24.578Z'
---

