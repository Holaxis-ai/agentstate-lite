---
type: Context Note
title: PR 208 exact-SHA review at 31ba3ab
description: >-
  CHANGES REQUESTED: uncancelled early HTTP bodies violate total bounds; stale
  help integration keeps Node 22/26 CI red.
actor: codex-pr208-review
timestamp: '2026-08-05T17:08:52Z'
---
# Summary

Reviewed PR 208 at exact head `31ba3abe32ea69c62bcc349d44e9ece9d2d839d7` against base `8d0253a40bc00f9c7997e177a70b21f829769e8e` and the normative U3 protocol in `designs/version-update-protocols`.

Verdict: **CHANGES REQUESTED**.

## Findings

### High — early HTTP failures leave the untrusted response body running outside both advertised bounds

Empirical. In `packages/cli/src/update-check.ts:330-340`, redirects, non-200 statuses, and an oversized `Content-Length` throw without aborting the request or cancelling the response body. The outer `finally` then clears the two-second timer. A registry/proxy can therefore send an error header followed by an endless body that remains connected and continues consuming bytes after `fetchSupportedReleasePackument` has returned.

Exact-head probe with `timeoutMs: 50`, `maxBytes: 8`, and a local server sending HTTP 503 plus one byte every 10 ms:

```json
{"result":{"ok":false,"unavailable":{"code":"http","message":"npm registry returned HTTP 503"}},"returnedMs":10,"socketClosed":false,"writes":14,"activeConnections":1}
```

After another 150 ms, the socket was still open and the server had continued writing. This violates the normative total abort deadline and maximum-body trust boundary even though the structured result itself is safe. The same early-return pattern covers redirects and declared-oversize responses.

Required direction: abort the controller and/or cancel the response body before every early status/header failure, and add an adversarial streaming-error regression that proves the peer socket closes (or a child client exits) within the bound.

### Medium — the generated help change leaves the exact repository gate red

Empirical. `packages/cli/src/reference.ts:206-208` changes the generated help line to `version [--check] [--tag latest|next] [--json]`, but `packages/cli/test/help-index-cli-integration.test.ts:54-57` still requires the old literal `version [--json]` line. All three `--help`, `-h`, and `help` cases fail. The exact GitHub CI run fails on both Node 22 and Node 26 for these three assertions; a local isolated rerun reproduced the same failures.

This is mechanical rather than a runtime release-selection defect, but the repository gate is a merge requirement. Update the integration expectation to the new generated line and rerun the exact gate.

## Verification and survived attacks

- Confirmed exact, clean worktree `/private/tmp/aslite-supported-release.H860lp` at `31ba3ab`.
- `git diff --check` passed.
- Focused `update-check`, `version-check`, and `version` suite passed 26/26 with loopback enabled.
- The exact dist-tag controls current/upgrade/rollback selection; selected deprecation fails closed; running deprecation is carried forward; strict SemVer and canonical SHA-512 integrity are enforced.
- Redirects are not followed, application retries are absent, streamed successful bodies are size-bounded, invalid UTF-8/JSON and hostile metadata fail closed, and ordinary `version` remains byte-compatible and network-free.
- The no-write test passed with an isolated HOME/cwd. The Node 20 built-CLI smoke passed in CI.
- The full local repository gate was not duplicated: exact-SHA CI already executed it and exposed the deterministic help-test failure.

Ultimate goal: make agentstate-lite a safe, durable context and coordination substrate that people can install and recover without founder intervention. Proximate goal: independently verify that PR 208 makes supported-release discovery rollback-aware and fail-closed without mutation or misleading commands; this serves the ultimate goal by keeping npm release recovery trustworthy.
