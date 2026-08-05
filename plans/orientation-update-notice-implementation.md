---
type: Plan
title: Implementation plan — cached nonblocking update orientation
actor: codex-orientation-orchestrator
timestamp: '2026-08-05T20:44:42.972Z'
---
# Purpose

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: add cached, nonblocking default release orientation without adding registry latency or changing machine/protocol output. This removes founder-mediated release awareness while preserving the CLI's offline-first render contract.

# Product boundary

Eligible surfaces are only bare invocation, explicit `home`, and `session-start` in default TOON mode. The feature displays a previously validated cached result and opportunistically launches a detached `latest`-track refresh. It never auto-installs, changes npm state, mutates integrations/bundles/preferences, retries, reports usage, or advertises `next`.

`home --json`, `session-start --json`, ordinary commands, help/errors, and MCP must perform no passive cache/lease/process work and remain byte-identical. `--no-update-check` and presence (including empty or `0`) of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` suppress both display and refresh. Explicit `version --check` is unaffected.

# Frozen private contracts

The cache path is `~/.agentstate/update-check-v1.json`, maximum 65,536 bytes, exact mode 0600 under an exact-mode 0700 real directory owned by the current uid on POSIX. Exact JSON keys are:

```json
{
  "schema": "aslite.update-cache.v1",
  "package": "@holaxis/aslite",
  "running_version": "0.1.0-pre.N",
  "track": "latest",
  "check": { "schema": "aslite.update-check.v1" },
  "checked_at": "ISO-8601 instant",
  "expires_at": "checked_at + 86400000 ms"
}
```

The nested `check` is the complete successful U3 result with exact keys and cross-field invariants. The reader treats it as hostile, validates/recomputes the displayed command, and rejects extra keys. Missing or safe ordinary invalid/expired cache may refresh; unsafe directory/file type, symlink, owner, or permissions fail closed without display, replacement, or launch. Fresh `current` is silent and prevents refresh. Actionable `update_notice` has exactly `status`, `running_version`, `selected_version`, `checked_at`, and nullable `command`.

The lease path is `~/.agentstate/update-check-v1.lock`, maximum 4,096 bytes, exclusive-create mode 0600 in the same safe directory. Exact JSON keys are:

```json
{
  "schema": "aslite.update-lease.v1",
  "token": "32 random bytes as 64 lowercase hex characters",
  "created_at": "ISO-8601 instant",
  "expires_at": "created_at + 30000 ms"
}
```

A live, malformed, foreign, symlinked, non-regular, wrong-owner, or wrong-mode lock causes immediate render-only fallback. A valid expired private lease uses two-visit recovery: the first eligible run re-reads and token-compares before removing it, but does not spawn; a later run may acquire normally. Unsafe or foreign locks are never removed. This makes stale recovery fail closed in the cleanup run and prevents a killed worker from disabling refresh forever.

# Architecture

One new private `update-orientation.ts` module owns schemas, safe path checks, hostile parsing, notice projection, exclusive lease acquisition/release, detached launch, and worker behavior. It reuses `checkSupportedRelease`, `writeFileAtomic0600`, `credentialsDir`, `currentExecutableRealPath`, and the baked running identity; it does not duplicate release selection, transport, rendering, or command identity.

`home` owns eligibility and calls an injected orientation seam before its pure final projection; it passes an already-sanitized optional notice to `buildHomeView`. JSON and suppressors bypass the seam entirely. `session-start` only parses/forwards `--no-update-check`; its existing pull budget is unchanged. The exact registered entry pre-routes hidden `__update-refresh-v1 <token>` after executable registration and before public dispatch, while the private route remains absent from `KNOWN_COMMANDS`, help, reference groups, and generated skill command lists.

The parent synchronously performs only bounded local state checks and an O_EXCL lease write, then spawns `process.execPath` with the exact current entry, ignored stdio, detached mode, an error handler, and `unref()`. It never awaits network, child close, or lease release. The worker derives its own current package identity, verifies its matching lease token, calls the existing two-second/one-MiB latest check, writes only successful results atomically, and removes only a still-matching lease on every normal/error path.

# Test-first implementation sequence

1. Builder adds red pure tables for exact schemas, U3 cross-field validation, fake time, command-injection rejection, notice projection, exact TTL, and suppressor presence.
2. Builder adds temp-HOME filesystem/process-edge tests for missing/safe-invalid/expired cache, modes/owner/types/symlinks/oversize, atomic old-or-new writes, live/stale/foreign leases, token-matched cleanup, spawn throw/error/nonclosing child, and exact launch argv/options.
3. Builder adds a bounded real multi-process fixture proving one O_EXCL winner and a built-entry probe proving the hidden silent route, zero work in JSON/suppressed paths, and no public registration.
4. Builder implements the private module and narrow `home`/`session-start`/entry/reference/generated-skill wiring until the focused battery passes; then runs build/typecheck/generated/package checks, output parity probes, and a clean diff before commit/push.

# Roles, dependencies, and gates

- Product architect and test scout: complete; their notes define the boundary and adversarial matrix.
- Plan critics: independently cross-review this frozen plan and each other's notes. Builder is blocked until both approve or revisions are incorporated.
- Builder: one agent owns the overlapping source/test integration in the isolated `feat/orientation-update-notice` worktree.
- Independent exact-SHA Reviewer: hard dependency after Builder commit; audits hostile-state/command/token semantics, exact-executable launch, no eager effects, suppression, and byte agreement, and samples the focused suite.
- Adversarial QA: hard dependency after Review passes; uses isolated homes, real concurrent processes, unsafe filesystem states, interruption/hung-network probes, request/privacy capture, no-write snapshots, and session render budget.
- Repository/package gate: hard dependency after QA; root `npm run check`, npm package proof, exact-SHA CI. Brian owns PR creation and merge.

The task stays `in_progress` through merge evidence. Review precedes QA; QA precedes the full gate. The separate `init-target-safety-guard` lane is out of scope and must not be touched.

# Focused acceptance battery

Run after a root build:

`AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/update-orientation.test.ts ./packages/cli/test/home.test.ts ./packages/cli/test/session-start.test.ts ./packages/cli/test/update-check.test.ts ./packages/cli/test/version-check.test.ts`

Tests globally suppress passive checks except cases explicitly exercising N4. Privacy probes must confirm the registry request remains the fixed U3 GET/Accept/no-body request and contains no cwd, bundle, actor, usage, or extra installed-version data; only the declared cache/lease paths may change.

[implements](../tasks/orientation-update-notice.md)

[informed by](../context-notes/orientation-update-product-architecture-2026-08-05.md)

[informed by](../context-notes/orientation-update-test-scout-2026-08-05.md)
