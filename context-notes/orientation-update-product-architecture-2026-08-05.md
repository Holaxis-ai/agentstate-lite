---
type: Context Note
title: N4 product architecture and implementation contract
actor: codex-orientation-product-architect
timestamp: '2026-08-05T20:42:37.955Z'
---
# Summary

Verdict: N4 is product-ready and can be implemented as one coherent high-risk timing/cache/process unit. The desired behavior is narrow: an agent beginning a session should see a previously proven supported-release action immediately, while a slow, absent, hostile, or offline registry remains invisible to that session's latency and exit behavior.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: make the npm-installed CLI self-orient to supported upgrades/rollbacks across sessions without adding registry latency, output drift, or silent mutation. This serves the ultimate goal by removing founder-mediated release awareness from normal first use and return use.

The implementation should reuse U3's fixed registry client and result semantics, the existing `~/.agentstate` atomic writer, the current-executable identity owner, and home's pure view builder. It must not create a second release selector, network client, output renderer, or general notifier framework.

# Product problem and desired outcome

Today `version --check` can answer “what release does npm policy support?” only when a user or agent thinks to ask. Return sessions therefore may keep using unsupported bytes until a founder tells them to check. Making every session await npm would damage the product's offline-first and render-always contract.

The solution is cached orientation, not automatic updating: eligible human/agent orientation reads one private local cache synchronously, shows only an actionable previously validated result, and opportunistically launches one detached refresh. The CLI never installs, changes a release track, rewrites an integration, edits a bundle, or waits for registry work.

# Domain terms

- **Eligible orientation:** bare invocation, explicit `home`, or `session-start`, in default TOON mode, with no suppressor present.
- **Machine/protocol orientation:** `home --json` or `session-start --json`; byte-stable and passive-work-free.
- **Passive track:** `latest` only. `next` remains an explicit `version --check --tag next` choice.
- **Successful cached check:** a U3 result with `unavailable: null` and status `current`, `upgrade_available`, `rollback_available`, or `deprecated`. `unavailable` is never cached.
- **Actionable notice:** the projection shown only for `upgrade_available`, `rollback_available`, or `deprecated`; `current` is fresh silence.
- **Fresh cache:** a strict, privately stored cache for this exact package, running version, and `latest` track whose `checked_at <= now < expires_at` and whose expiration is exactly 24 hours after checking.
- **Lease:** a no-wait, exclusive local claim that permits one parent to launch one refresh worker. It is coordination state, not a render dependency.
- **Worker:** hidden `__update-refresh-v1` execution of the exact current artifact. It performs U3's one bounded request, writes only a successful cache, and removes only the lease token it received.

# Independently actionable acceptance criteria

## Eligibility and suppression

1. Bare/home/session-start default TOON may read/display/refresh. JSON modes perform none of those operations and remain byte-identical. Ordinary commands and MCP never import an eager side effect or gain output/work.
2. `--no-update-check` works for bare-home routing, explicit `home`, and `session-start`. Presence, including an empty value, of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` disables both display and refresh. Explicit `version --check` ignores these passive suppressors.
3. The public reference/session-start help documents the flag, 24-hour cached/nonblocking behavior, opt-outs, exact public package request, and that npm sees the package coordinate plus ordinary network metadata—not installed version, cwd, bundle, actor, or usage data. Generated npm-target `SKILL.md` agrees; broad npm-primary documentation remains D8.

## Private cache contract

The protocol names the semantic fields but does not give a literal JSON example. Pin this exact private v1 grammar in source and fixtures before behavior code:

```json
{
  "schema": "aslite.update-cache.v1",
  "package": "@holaxis/aslite",
  "running_version": "0.1.0-pre.N",
  "track": "latest",
  "check": { "schema": "aslite.update-check.v1", "...": "the complete U3 result" },
  "checked_at": "ISO-8601 instant",
  "expires_at": "ISO-8601 instant exactly 86400000 ms later"
}
```

4. The reader treats the cache as hostile: bound file size; `lstat` before read; regular file only; private owner/mode on supported POSIX; strict exact keys/schema/types; strict SemVer; finite parseable instants; top-level/check package-version-track/timestamp agreement; U3 status/relation/version/deprecation/integrity/verify invariants; and exact recomputation of any displayed install command. Never display an arbitrary command merely because JSON parsed.
5. Missing, future-dated, expired, other-version, other-track, malformed, corrupt, oversized, symlinked, non-regular, or unsafe-permission cache yields no notice and cannot fail orientation. A valid `current` cache yields no notice but suppresses refresh until expiration.
6. `update_notice` is inserted before the compact command manual and contains exactly `status`, `running_version`, `selected_version`, `checked_at`, and `command`. Upgrade/rollback commands equal `npm install --global @holaxis/aslite@<validated-selected-version>`; deprecated/equal has `command: null`. No cache or non-actionable result means existing TOON bytes remain unchanged.

## Lease and detached refresh

The protocol also names a random-token 30-second lease without literal fields. Recommended exact private grammar:

```json
{
  "schema": "aslite.update-lease.v1",
  "token": "cryptographically random lowercase hex",
  "created_at": "ISO-8601 instant",
  "expires_at": "ISO-8601 instant exactly 30000 ms later"
}
```

7. Lease acquisition uses exclusive create at `~/.agentstate/update-check-v1.lock`, mode 0600 in a safe 0700 `~/.agentstate` directory, never waits/polls, and launches only after a complete lease record is durable. Any live, malformed, foreign, symlinked, non-regular, or unsafe lease causes immediate render-only fallback.
8. To reconcile “30-second stale lease” with fail-closed safety and crash recovery: a structurally valid, private, expired lease may be token-compared and removed, but that invocation does not also launch. A later eligible orientation acquires normally. Foreign/malformed/unsafe stale files are never removed automatically. This two-visit recovery is the safest concrete interpretation of the normative wording; policy review should explicitly affirm it before Builder proceeds.
9. The parent invokes exactly the current executable's hidden `__update-refresh-v1` route, with only its lease token as private coordination input, `detached: true`, ignored stdio, and `unref()`. It awaits neither network, child close, nor lease release. Spawn throw/error is swallowed and cleans up only the matching token when possible.
10. The worker derives package/running identity itself, accepts only `latest`, calls the existing U3 primitive unchanged (2 s, 1 MiB, no redirect/retry), writes through the one atomic 0600 writer only for successful results, and removes only a still-matching lease on every normal/error path. A killed worker may leave only the recoverable lease above.
11. Parent and worker never touch npm state, integrations, project/bundle content, release preferences, or telemetry. Unsafe private-state targets fail closed rather than being followed or overwritten.

## Executable evidence

12. Fake-time/parser tests cover every cache status plus missing, expired, future, mismatched, corrupt, extra-key, oversized, malicious-command, link, type, owner/mode, and interrupted atomic-write state.
13. Process tests cover simultaneous eligible parents (one worker), live lease, valid stale recovery, foreign stale preservation, token-mismatch release, spawn throw/error, child failure, killed/interrupted worker, hung registry, and parent completion before child/network completion.
14. Output agreement tests pin default home/session-start with and without each notice; exact pre-change JSON bytes; exact ordinary-command and MCP bytes/work; bare/global flag routing; empty-valued env suppression; and the existing 10-second hook contract. Tests globally set `ASLITE_NO_UPDATE_CHECK` unless exercising N4 explicitly.
15. Privacy/no-write QA captures the worker's request and recursive before/after snapshots. Request remains U3's fixed GET/Accept with no body; args/request contain no cwd, bundle, actor, installed version, or usage data. Project bundle, npm state, host integrations, and preferences remain byte-identical; only the two declared private cache/lease paths may change.

# Architecture and file ownership

- Add one focused module (suggested `packages/cli/src/update-notice.ts`) owning cache/lease schemas, hostile parsing, notice projection, acquisition/release, spawn, and worker behavior.
- Reuse `checkSupportedRelease`/U3 result types; if validation is shared, move it into one exported pure validator rather than reconstructing release rules in home.
- Reuse `credentialsDir`/`writeFileAtomic0600`, but put safe `lstat`/permission preflights around passive reads and replacement. Do not weaken the generic writer or silently follow unsafe state.
- Reuse `currentExecutableRealPath` for exact-artifact launch. Add the hidden worker as a pre-router branch in `cli.ts`, absent from `KNOWN_COMMANDS` and help.
- Keep `buildHomeView` pure by passing an optional already-validated notice. `home` owns eligibility/cache read/spawn orchestration; `session-start` parses/forwards its suppression flag and JSON state while leaving the board-pull budget unchanged.
- Update `reference.ts` and regenerate only the npm-target `packages/cli/SKILL.md`; marketplace manifests/bundle remain bot-owned.

# Implementation plan and gates

1. **Product/architecture (complete in this note):** freeze the problem, taxonomy, boundaries, schemas, and stale-lease interpretation.
2. **Plan critic + QA designer (safe parallel, read-only):** independently challenge hostile-cache/lease assumptions and draft the red test matrix. Converge explicitly; affirm or revise criterion 8 before source work.
3. **Builder:** first land pure parser/state-machine red tests, then the owning module, home/session/CLI wiring, and generated reference update in one branch. One Builder should integrate overlapping source; a parallel agent may audit fixtures/tests read-only but should not edit the same worktree.
4. **Builder self-verification:** focused unit/subprocess tests, root build/typecheck, generated-skill check, exact output snapshots, and clean diff. Commit/push one review unit.
5. **Independent exact-SHA Review (hard dependency):** audit schema/command validation, symlink/permission/token semantics, exact-executable launch, no eager side effects, suppression and output agreement; sample the Builder battery and force one gate red.
6. **Adversarial QA only after Review passes:** isolated homes and concurrent real processes; hostile filesystem types/permissions; crash/interruption/hung-network; recursive no-write/privacy snapshots; session render budget and JSON/MCP parity. QA may reject.
7. **Repository/package gate only after QA:** root `npm run check`, exact-SHA CI, generated-skill/package proof. Then Brian owns PR/merge; task remains `in_progress` until merge receipt.

Safe parallelism is deliberately front-loaded into independent plan criticism and QA design. Review, adversarial QA, and the repository gate are sequential because each consumes the exact artifact and the prior gate's verdict.

# Assumptions and questions

- High confidence in product boundary, eligible surfaces, reuse points, and test/gate sequence.
- Medium confidence in the proposed literal private schemas because the normative protocol specifies their semantic contents but not exact key grammar.
- Criterion 8 is the only material design question: affirm two-visit stale-lease recovery, or amend the normative text with a different recoverable fail-closed algorithm. Literal “never remove stale” would let one killed worker disable passive refresh forever.
- Ownership/mode checks assume the documented macOS/Linux/npm-global support boundary; other platforms remain outside the initial promise.
