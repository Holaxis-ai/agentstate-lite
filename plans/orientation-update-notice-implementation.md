---
type: Plan
title: Implementation plan — cached nonblocking update orientation
actor: codex-orientation-orchestrator
timestamp: '2026-08-05T20:53:36.547Z'
---
# Purpose

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: add cached, nonblocking default release orientation without adding registry latency or changing machine/protocol output. This removes founder-mediated release awareness while preserving the CLI's offline-first render contract.

# Product boundary

Eligible surfaces are only bare invocation, explicit `home`, and `session-start` in default TOON mode. The feature displays a previously validated cached result and opportunistically launches a detached `latest`-track refresh. It never auto-installs, changes npm state, mutates integrations/bundles/preferences, retries, reports usage, or advertises `next`.

`home --json`, `session-start --json`, ordinary commands, unrelated errors, and MCP must perform no passive cache/lease/process work and remain byte-identical. The narrow `home`/`session-start` help and generated-skill bytes may change only to document the new flag and privacy contract. `--no-update-check` and presence (including empty or `0`) of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` suppress both display and refresh. Explicit `version --check` is unaffected.

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

The nested `check` is the complete successful U3 result with recursively exact keys and cross-field invariants. Times must equal canonical `Date.toISOString()` output and round-trip exactly. Both reader and serializer enforce 65,536 bytes. Reads use a no-follow/nonblocking handle, fstat that same handle, then read at most limit+1 bytes; pathname lstat plus unbounded read is insufficient. The reader treats the cache as hostile, validates/recomputes the displayed command, and rejects extra keys. Missing or safe ordinary invalid/expired cache may refresh; unsafe directory/file type, symlink, owner, or permissions fail closed without display, replacement, or launch. Fresh `current` is silent and prevents refresh. Actionable `update_notice` has exactly `status`, `running_version`, `selected_version`, `checked_at`, and nullable `command`, inserted immediately after the `agentstate-lite` identity block and before all existing bundle/board/orientation/manual fields.

The coordination path is `~/.agentstate/update-check-v1.lock`, maximum 4,096 bytes, mode 0600 in the same safe directory. Its exact schema is a union:

```json
{
  "schema": "aslite.update-lease.v1",
  "state": "active",
  "token": "32 random bytes as 64 lowercase hex characters",
  "started_at": "canonical instant",
  "lease_expires_at": "started_at + 30000 ms",
  "cooldown_expires_at": "started_at + 86400000 ms"
}
```

or:

```json
{
  "schema": "aslite.update-lease.v1",
  "state": "cooldown",
  "token": "the originating active token",
  "started_at": "canonical instant",
  "expires_at": "started_at + 86400000 ms"
}
```

A complete active record is written/fsynced to a unique O_EXCL 0600 temp, then published at the absent fixed path with an atomic no-replace hard-link claim; the fixed path is therefore absent or complete even if the parent is killed. Reader and serializer symmetrically enforce 4,096 bytes and the same handle-based safety rules as cache reads. A missing state directory is created 0700 and then verified as a real directory/current uid/exact mode; existing unsafe state is never chmod'd, followed, or mutated by passive work.

A live active record or unexpired cooldown causes immediate render-only fallback. An unavailable/failed worker converts only its matching unexpired active record into cooldown; a successful worker writes cache and removes only its matching active record. A recognized stale active record becomes its original 24-hour cooldown, so even interruption preserves the one-start-per-attempt-window bound. An expired cooldown is removed in a cleanup-only visit; a later eligible visit acquires. Malformed, foreign, symlinked, non-regular, wrong-owner, wrong-mode, or oversized coordination state is never removed.

No code performs read/compare/unlink on the fixed path. Token-scoped release/recovery atomically renames the fixed entry to a unique quarantine path, validates what was captured, and restores a mismatched capture when possible; any worker whose token is no longer the matching fixed unexpired active record aborts before network and again before cache commit. The controlled race tests pin the accepted residual: a successor captured during quarantine must lose authority and perform no U3/cache work, while a later fixed-path winner remains authoritative.

# Architecture

One new private `update-orientation.ts` module owns schemas, safe path checks, hostile parsing, notice projection, exclusive lease acquisition/release, detached launch, and worker behavior. It reuses `checkSupportedRelease`, `writeFileAtomic0600`, `credentialsDir`, `currentExecutableRealPath`, and the baked running identity; it does not duplicate release selection, transport, rendering, or command identity.

`home` owns eligibility and calls an injected orientation seam before its pure final projection; it passes an already-sanitized optional notice to `buildHomeView`. JSON and suppressors bypass the seam entirely. Exact-token suppression is pre-scanned before forgiving home parsing so malformed sibling args cannot accidentally enable work; near-matches do not suppress. Bare/global-only routing recognizes the flag. `session-start` parses/forwards `--no-update-check`; its existing pull budget is unchanged. The exact registered entry pre-routes hidden `__update-refresh-v1 <token>` after executable registration and before public dispatch, while the private route remains absent from `KNOWN_COMMANDS`, help, reference groups, and generated skill command lists. Missing/malformed private tokens exit silently with zero cache/lease/network/public-render work.

The parent synchronously performs only bounded local state checks and the complete atomic claim above, then spawns `process.execPath` with the exact current entry, ignored stdio, detached mode, an error handler, and `unref()`. It never awaits network, child close, or lease release. Synchronous spawn throw and asynchronous spawn `error` best-effort release only the matching active token. The worker derives its own current package identity, revalidates its matching unexpired active lease before U3 and immediately before any cache commit, calls the existing two-second/one-MiB latest check, writes only successful cache results atomically, and otherwise transitions its still-matching active record to cooldown.

# Test-first implementation sequence

1. Builder adds red pure tables for recursively exact schemas, U3 cross-field validation, canonical fake time, command-injection rejection, exact notice placement/projection, exact cache/attempt TTLs, and suppressor presence.
2. Builder adds temp-HOME handle-based filesystem/process-edge tests for missing/safe-invalid/expired cache, exact 65,536/65,537 and 4,096/4,097 boundaries, modes/owner/types/symlinks/FIFO, atomic old-or-new writes, live/stale/cooldown/foreign records, fixed-path publication interruption, token/quarantine cleanup, spawn throw/error/nonclosing child, and exact launch argv/options.
3. Builder adds a bounded barrier/IPC multi-process fixture proving one atomic claim winner and the stale-read/replacement race without sleeps/shared append logs. It also adds deterministic in-process worker tests and built-entry probes proving valid/invalid hidden routing, zero work in JSON/suppressed paths, and no public registration without live npm.
4. Builder captures literal pre-change output fixtures from the base SHA with injected identity/HOME/cwd/bundle/board/workspace/hook/time, then proves bare/home/session-start JSON and default no-notice bytes. Builder implements the private module and narrow `home`/`session-start`/entry/reference/generated-skill wiring until the focused battery passes; then runs build/typecheck/generated/package checks, output parity probes, and a clean diff before commit/push.

# Roles, dependencies, and gates

- Product architect and test scout: complete; their notes define the boundary and adversarial matrix.
- Plan critics: independently cross-review this frozen plan and each other's notes. Builder is blocked until both approve or revisions are incorporated.
- Builder: one agent owns the overlapping source/test integration in the isolated `feat/orientation-update-notice` worktree.
- Independent exact-SHA Reviewer: hard dependency after Builder commit; audits hostile-state/command/token semantics, exact-executable launch, no eager effects, suppression, and byte agreement, and samples the focused suite.
- Adversarial QA: hard dependency after Review passes; uses isolated homes, real concurrent processes, unsafe filesystem states, interruption/hung-network probes, request/privacy capture, no-write snapshots, and session render budget.
- Repository/package gate: hard dependency after QA; root `npm run check`, npm package proof, exact-SHA CI. Brian owns PR creation and merge.

The task stays `in_progress` through merge evidence. Review precedes QA; QA precedes the full gate. Any source/test change after exact-SHA Review invalidates that verdict and returns the new SHA to Review before QA; QA or repository-gate repairs do the same. The separate `init-target-safety-guard` lane is out of scope and must not be touched.

# Focused acceptance battery

Run after a root build:

`AGENTSTATE_LITE_NO_AUTOPULL=1 ASLITE_NO_UPDATE_CHECK=1 node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/update-orientation.test.ts ./packages/cli/test/home.test.ts ./packages/cli/test/session-start.test.ts ./packages/cli/test/update-check.test.ts ./packages/cli/test/version-check.test.ts`

The CLI workspace test script and ordinary subprocess/package harnesses globally set `ASLITE_NO_UPDATE_CHECK=1`; N4 cases opt in only through injected env objects or isolated children/temp homes, never process-global mutation during concurrent tests. Privacy probes must confirm the registry request remains the fixed U3 GET/Accept/no-body request and contains no cwd, bundle, actor, usage, or extra installed-version data; only the declared cache/coordination paths and same-directory atomic temp/quarantine residues under forced-crash tests may change.

[implements](../tasks/orientation-update-notice.md)

[informed by](../context-notes/orientation-update-product-architecture-2026-08-05.md)

[informed by](../context-notes/orientation-update-test-scout-2026-08-05.md)
