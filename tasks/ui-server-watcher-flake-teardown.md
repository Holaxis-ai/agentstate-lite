---
type: Task
title: 'Flaky gate: ui-server watcher fetch rejects after tests pass, exits non-zero'
status: todo
actor: mike/claude
timestamp: '2026-07-22T02:22:56.654Z'
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
