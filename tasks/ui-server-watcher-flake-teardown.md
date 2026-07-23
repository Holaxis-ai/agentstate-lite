---
type: Task
title: 'Flaky gate: ui-server watcher fetch rejects after tests pass, exits non-zero'
status: todo
actor: claude-main-watcher-flake
description: >-
  UNCLAIMED 2026-07-23 — my earlier claim on this task was a MISDIAGNOSIS,
  corrected here so the next reader is not misled.


  WHAT HAPPENED: PR #151's red gate (run 29967569606, node 22, head c1fa959) was
  attributed to this task because the log shows '# [ui watcher] fetch failed'
  shortly before the failure, and the ui-server suite reported 32/32 pass.
  Reading the FULL attempt-1 log disproves that: the failing step is the
  packages/ui vitest run (npm error workspace @agentstate-lite/ui, command
  'vitest run'), specifically src/views/markdown.test.tsx timing out at 5000ms.
  The ui-server suite passed and did NOT set the exit code.


  USEFUL RESIDUE FOR THIS TASK: '[ui watcher] fetch failed' on stderr is real
  but is NOT by itself a gate failure — it is bootWatcher's onError logging a
  best-effort watcher error, and the process exits 0 on it. So whoever picks
  this task up should FIRST establish that a failing exit code has ever actually
  been caused by the watcher, rather than assuming this line means what the
  title claims. The title's premise ('exits non-zero') is currently UNEVIDENCED;
  the one run cited for it was a different defect. Possible outcomes: reproduce
  it properly, or close this as a misfiled observation.


  The real PR #151 flake is tracked separately (markdown render-bounds tests
  against vitest's 5s default).
timestamp: '2026-07-23T00:41:04.759Z'
---
# Flaky gate: ui-server watcher rejects after tests pass

## Summary

The `packages/ui-server` node --test suite reports `# pass 32, # fail 0` and THEN the process
exits code 1, on a background `[ui watcher] fetch failed` async rejection that lands after the
tests complete. Node-version-timing-sensitive: observed on `gate (node 22)` while `gate (node 26)`
and the smoke passed the identical SHA (PR #149, run 29885088901). A `gh run rerun --failed` was
green, confirming a flake — no test assertion fails.

## Root-cause direction

`bootWatcher` (ui-server/src/server.ts) starts a best-effort change watcher whose fetch can reject
asynchronously; `onError` logs `[ui watcher] fetch failed`. In a test that boots a ui-server, if
that background fetch rejects AFTER the test body resolves and nothing awaits/cancels it, node --test
surfaces the unhandled rejection as a non-zero process exit despite 0 failed tests.

## Fix

Ensure ui-server tests deterministically tear down the watcher (await its shutdown / cancel the
in-flight fetch) so a post-completion rejection cannot trip the process exit code. Do NOT paper over
it by swallowing watcher errors in product code — the best-effort logging is correct; the test just
must own the watcher's lifetime. Add a deterministic teardown assertion.
