---
type: Context Note
title: Orientation update notice test architecture and adversarial matrix
actor: codex-orientation-test-scout
timestamp: '2026-08-05T20:41:17.613Z'
---
# Summary

Orientation update notice: code seams and red-test architecture.

## Goal and scope

Ultimate goal: make agentstate-lite a shared, versioned, conflict-safe markdown memory that agents and humans can install and use without founder intervention.

Proximate goal: define the smallest dependable feedback harness for `tasks/orientation-update-notice` so cached update guidance is useful across sessions without adding registry latency, output drift, or fragile local process state. This serves the ultimate goal by making the npm-installed CLI self-orienting while preserving its offline-first command contract.

This was read-only code inspection in isolated worktree `/private/tmp/aslite-orientation-update.QiuhqB`; no source files, git state, GitHub state, npm state, or external services were changed.

## Current system model

- `packages/cli/src/commands/home.ts` owns both zero-arg and explicit `home` rendering. It assembles one ordered object, calls `render()` once, and already has injected seams for bundle, board, workspace, hook, clock-adjacent budgets, and stdout. `session-start` delegates its final render to this same function, so the notice should enter at this one owning projection rather than be duplicated.
- `packages/cli/src/commands/session-start.ts` owns the existing pull race (7 seconds under the 10-second installed hook timeout), then calls `home` in-process. It always passes a defined `boardPull` so home does not start a second board refresh. N4 must not add a network/child-close/lease wait to this sequence.
- `packages/cli/src/update-check.ts` is the sole registry/selection primitive: fixed GET, no body/redirect/retry, 2-second total bound, 1 MiB bound, strict SemVer, rollback-aware latest/next selection, exact pinned command, and sanitized failures. The private worker should call `checkSupportedRelease({runningVersion, track:"latest"})`; it must not duplicate selection or request construction.
- `packages/cli/src/credentials.ts::writeFileAtomic0600` is the required state writer: `~/.agentstate` 0700, exclusive same-directory 0600 temp, atomic rename, cleanup. Reuse it for the cache. Its writer guarantees do not by themselves make cache/lock reads safe: N4 still needs no-follow, regular-file, exact-mode, bounded-size validation before reading untrusted fixed paths.
- `packages/cli/src/invocation.ts::currentExecutableRealPath()` is the exact registered `.mjs`/source entry. A detached launch should use the exact Node runtime plus this exact path and a private worker argv, with `stdio:"ignore"`, `detached:true`, an error listener, and `unref()`; never a PATH/npx command.
- `packages/cli/src/index.ts` is the thinnest private-worker dispatch point after executable registration and before public `main()`. The worker must remain absent from `KNOWN_COMMANDS`, help, reference, and generated skill.
- Output order is semantic because TOON preserves object insertion order. The smallest progressive-disclosure placement is `agentstate-lite`, optional `update_notice`, then the existing bundle/board/help blocks. JSON paths must bypass both cache read/display and refresh launch, preserving exact previous bytes.

## Recommended implementation seams

Add one private module (suggested `packages/cli/src/update-orientation.ts`) owning cache schema validation, safe cache read/write, lease acquisition/release, suppressor policy, notice projection, detached launch, and worker execution. Keep pure policy functions exported for tests and inject `home`, `now`, `spawn`, executable path, and `checkSupportedRelease` at the I/O edge. Extend `HomeDeps` with one orientation dependency returning an immediate optional notice after initiating refresh; pass the sanitized notice into `buildHomeView`. Add `--no-update-check` to `home` and `session-start`, with session-start forwarding it.

The cached check is untrusted JSON. Do not merely cast it to `UpdateCheckResult`: either add one owning runtime validator/sanitizer beside `update-check.ts`, or validate the complete result and recompute the only displayed command from the selected version. Otherwise a planted cache can inject an arbitrary command into every session. Validate package, schema, latest track, running version, checked/expires timestamps and exact 24-hour relationship, successful status, result timestamp/track/version agreement, strict SemVer, relation/status agreement, and exact command/nullability before projection.

Suppression is by environment-key **presence**, including empty string and `"0"`: `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI`. It must be checked before any cache/lease I/O. Explicit `version --check` remains unaffected. Because `home` intentionally swallows argv parse errors, pre-scan the exact `--no-update-check` token (or otherwise retain suppression on parse failure) so `home --no-update-check --bogus` cannot accidentally enable background work.

## Smallest dependable feedback harness

Create one focused `packages/cli/test/update-orientation.test.ts` plus, only for real cross-process races, a tiny `packages/cli/test/fixtures/update-orientation-child.ts`. Reuse the existing Node test loader and built-CLI path patterns. Three layers are sufficient:

1. **Pure schema/time/projection table:** no processes or real network. Fake time and `UpdateCheckResult` fixtures cover cache acceptance and the exact optional notice.
2. **Real filesystem + injected process edge:** temp HOME, real modes/symlinks/FIFO/atomic writer/lock, injected registry check and spawn. This proves fail-soft safety without contacting npm.
3. **Real multi-process/built-route probes:** simultaneous fixture children exercise O_EXCL lease ownership; a built CLI probe proves the private command is silent/hidden and JSON/suppression paths create no state. Use bounded child timers and always kill/reap children in teardown.

Focused builder command after a root build:

`AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/update-orientation.test.ts ./packages/cli/test/home.test.ts ./packages/cli/test/session-start.test.ts ./packages/cli/test/update-check.test.ts ./packages/cli/test/version-check.test.ts`

Loopback/fake-process tests may require the already-established sandbox escalation. Full repository/package gates remain after independent exact-SHA review per the task.

## Red-test matrix

### Cache and notice

- absent cache: baseline render immediately; exactly one refresh launch after lease acquisition.
- fresh `current`: no notice, no launch; fresh actionable upgrade/rollback: one exact five-key notice; fresh equal `deprecated`: notice with `command:null`.
- expired, future-skewed, forged far-future `expires_at`, wrong running version, wrong package/track/schema, unavailable result, malformed JSON, missing/extra/retyped fields, invalid SemVer/relation, and arbitrary command injection: no notice. Recoverable ordinary corruption may refresh; unsafe path states must not be overwritten.
- writer receipt: cache and directory modes 0600/0700, trailing complete JSON, no temp residue, interrupted pre-rename write leaves the old complete cache.
- file boundary: symlink (including dangling), directory, FIFO/socket/device, overlarge regular file, loose file mode, loose/symlinked state directory, unreadable file. None may block, leak bytes, display a notice, or cause unsafe mutation.

### Lease and detached worker

- N simultaneous eligible processes behind a barrier: exactly one worker-launch record; other parents return without polling/waiting.
- live valid lock, malformed/foreign lock, symlink lock, permission error: no launch and render unchanged.
- stale/crash-leftover lock at 29,999 vs 30,000 ms; token-matched cleanup only; an old worker can never unlink a successor's lock.
- synchronous spawn throw, asynchronous child `error`, immediate nonzero child exit, child never closes, and parent exit immediately after spawn: no stderr/stdout contamination, no failed render, no unhandled event.
- worker success writes only a successful latest result, then removes only its matching lease. timeout/offline/http/malformed/selected-deprecated/throw writes no cache. Kill between check, temp write, rename, and cleanup leaves either old/new complete cache and safely recoverable coordination state.
- launch contract records exact `process.execPath`, exact `currentExecutableRealPath()`, private argv, `stdio:"ignore"`, `detached:true`, `unref`; no shell, PATH, npx, bundle path/id, cwd-derived data, registry override, body, or custom usage metadata.

### Output, suppression, and budget

- exact pre-change JSON bytes for bare/home/session-start remain identical, and the orientation dependency is not called at all under `--json`.
- default TOON with no/fresh-current/invalid cache remains byte-identical to baseline; actionable cache adds exactly one `update_notice` in the agreed location and no other field changes.
- ordinary `version`, list/query, errors, help, and MCP stdio do not call orientation code and remain byte-stable; private worker emits no output.
- each suppressor table row (present as `"1"`, `"0"`, and empty) plus `--no-update-check` disables cache display and refresh; explicit `version --check` still invokes its injected check.
- session-start with a never-closing spawned child and a hung injected registry check still renders inside its existing budget; hook timeout remains 10 seconds and no production timeout is extended.

## Risks and unresolved protocol interpretations

1. The normative section names `aslite.update-cache.v1` and required bindings but does not spell a canonical JSON object/key order or maximum local cache byte size. The team should record that exact internal schema before implementation and then pin it literally; builders should not improvise multiple shapes.
2. The protocol simultaneously calls the lock a 30-second stale lease and says stale locks fail closed, while interruption acceptance implies crash-leftover recovery. Record the exact state transition: whether a safely recognized owned stale lock is quarantined/removed for a later acquisition, or remains a permanent manual-recovery stop. Token matching and symlink/foreign refusal are clear; stale recovery is not.
3. `writeFileAtomic0600` safely creates/replaces files but follows ancestor directory symlinks and does not validate an existing target before replacement. The N4 wrapper must establish the safe-path invariant before using it; do not broaden the shared credentials writer in this unit unless all existing consumers are deliberately re-reviewed.

## Likely files

- new `packages/cli/src/update-orientation.ts`
- `packages/cli/src/index.ts`
- `packages/cli/src/commands/home.ts`
- `packages/cli/src/commands/session-start.ts`
- possibly a small exported cached-result validator in `packages/cli/src/update-check.ts`
- new focused test/fixture plus narrow additions to `home.test.ts` and `session-start.test.ts`
- `packages/cli/src/reference.ts` and generated `packages/cli/SKILL.md` only if `--no-update-check` is part of their command syntax/summary

## Confidence and gaps

Confidence: high (0.90) in the ownership seams, byte-stability requirements, and test layers; medium (0.65) in stale-lease recovery and exact cache shape because the normative document does not make those two transitions literal. No code was executed against a prototype, and no prior N4-specific team artifact existed in the shared bundle at inspection time.
