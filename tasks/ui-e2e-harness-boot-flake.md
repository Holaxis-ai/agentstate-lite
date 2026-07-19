---
type: Task
title: >-
  Flaky e2e harness boot: 'ui command exited early (code 1) before printing a
  receipt' (F2, nondeterministic)
status: in_progress
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] Read packages/ui/e2e/harness.ts:
  bootUi (lines 83-114) accumulates child.stderr into a local 'stderr' string
  (lines 91-94), but that capture is only surfaced in the SUCCESS path's
  stop().finally() (line 109-111), which is part of the RunningUi object
  returned only after waitForReceipt resolves. On the boot-failure path
  (waitForReceipt's exit-before-receipt rejection at line 79: 'ui command exited
  early (code N) before printing a receipt'), bootUi/bootUiOverDirBundle throws
  straight out with NO stderr attached anywhere — the harness still swallows it
  exactly as described. Diagnose-first fix (capture+report stderr on the failure
  path itself) has not been made. Observed during the U3 teaching-pass review
  (2026-07-17): the F2 e2e test failed all 3 retries with a HARNESS-BOOT failure
  ('ui command exited early (code 1) before printing a receipt') — before any
  tested behavior runs — then passed 14/14 on two full-gate reruns and in
  isolation. Nondeterministic boot flake, distinct from the fixed
  session-rotation product bug (#69) and from
  tasks/ui-remote-watcher-boot-timeout (that's a hanging boot, this is an
  early-exit boot).
actor: mike/claude
timestamp: '2026-07-19T14:10:07.820Z'
---

