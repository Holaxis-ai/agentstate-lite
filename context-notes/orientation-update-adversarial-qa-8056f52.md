---
type: Context Note
title: Orientation update adversarial QA at 8056f52
actor: codex-orientation-adversarial-qa
timestamp: '2026-08-05T22:42:01.796Z'
---
# Summary

**Independent functional-reliability QA verdict: PASS** for exact candidate `8056f525766551556dedb31928d09e821fc4a58e` only.

The approved cached update-orientation contract survived isolated hostile-state, concurrency, failure, output, timing, request-shape, and no-write probes. The next dependency is the final repository/package gate at this same SHA. Any source/test change invalidates this verdict.

## Goals and scope

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: determine whether the exact N4 candidate safely provides cached, nonblocking release orientation while preserving offline rendering, machine-output byte stability, request privacy, and the no-project-write boundary. Complete.

The candidate was tested from a fresh detached checkout at the exact SHA with isolated temporary HOME and cwd. The pre-change comparison artifact was built from detached base `164ba7edb89c31678856020ee794f80530e6c276`. No source, GitHub, PR, merge, or board-sync mutation was performed.

## Evidence

- Root build in the candidate checkout: PASS.
- Exact approved focused battery: PASS, 120/120. The first sandboxed attempt reached 117/120; its only failures were `listen EPERM 127.0.0.1`. The identical command with loopback permission passed all 120 tests.
- Independent external filesystem/privacy battery: PASS, 9/9. It covered cache and lease symlink/FIFO/directory/wrong-mode/oversize/corrupt states; a simulated wrong-owner uid; exact size bounds; future/expired/noncanonical times; running-version/track drift; command/verify injection; extra keys; live/stale/cooldown/expiry and token mismatch; old-cache preservation on interrupted commit; successor-token preservation; spawn throw/async error/nonclosing child/child exit; hung update check; exact suppression presence; and exact request shape.
- Real multi-process focused proofs passed: one winner among six simultaneous hard-link claims, continuously occupied stale-active-to-cooldown replacement, expired-cooldown ABA with only the successor worker, and paused-parent post-claim cache revalidation with zero worker starts.
- Worker/network failure proofs passed: timeout/offline/HTTP/malformed/oversize classifications, early stream cancellation/socket closure, cooldown on unavailable work, token revalidation before cache commit, and no render wait on a nonclosing child or hung injected check.
- Built-artifact parity against the pre-change base passed four exact-byte comparisons from the same executable path: bare home JSON, session-start JSON, default current-cache/no-notice TOON, and ordinary `list --json` output.
- Built notice projection passed: `update_notice` is immediately after the identity block and before `getting_started`; it has exactly five fields in order (`status`, `running_version`, `selected_version`, `checked_at`, `command`) with the exact version-pinned npm command.
- Built suppression/protocol/private-route matrix passed 18 probes: JSON, flag suppression, malformed sibling args, session-start suppression, ordinary version/list commands, invalid/no-authority hidden worker invocations, and all three environment suppressors with empty and `0` values. Invalid hidden routes were silent, exit 0, and created no update state.
- Cached actionable `session-start` completed in 199 ms, well inside the existing ten-second hook budget.
- Request capture was exactly the fixed HTTPS registry URL with `GET`, the install-v1 `Accept`, `redirect: manual`, an abort signal, and no body or cwd/bundle/actor/usage/running-version data.
- Recursive before/after snapshots across the full candidate checkout, isolated cwd, isolated HOME, npm prefix/cache, Claude, Codex, and OpenCode integration directories were byte/metadata identical across the suppressed/protocol/ordinary probe matrix. Candidate project snapshot: `c918eaa321e04b01a93636c432035b2806ba62a772fa1e0436a5b4d0f0195388`. Protocol-HOME snapshot: `b3a9e7a0e628c6dc11271a7c6380781db4220329785c57f85aef1dc7bc2266f8` before and after. The actionable cached-notice journey left only the declared private `~/.agentstate/update-check-v1.json`; no lock/temp/quarantine residue remained.
- Final candidate pin remained `8056f525766551556dedb31928d09e821fc4a58e`; detached checkout was clean and `git diff --check` passed.

## Calibration

The wrong-owner branch was exercised by temporarily presenting the process as a different uid because this unprivileged QA environment cannot create a genuinely foreign-owned file. All other file-type, permission, bound, corruption, lifecycle, concurrency, output, timing, and no-write claims above were exercised empirically.

Confidence: high (0.98).
