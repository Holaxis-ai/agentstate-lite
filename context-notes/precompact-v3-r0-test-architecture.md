---
type: Context Note
title: Revision 3 R0 executable test architecture
actor: codex-r0-test-architect
timestamp: '2026-08-04T17:40:59.737Z'
---
# Summary

Ultimate goal: make agentstate-lite durable, versioned, conflict-safe memory for concurrent agent fleets. Proximate goal: close the revision-3 inert host-proof gap with one executable, red-first rail so later lifecycle acceptance rests on observed Claude behavior.

Smallest correct next unit: **retire the staged parallel R0 stack and extend the existing T0 owner, `packages/cli/test/fixtures/handoff/live-harness.mjs`, with one bounded `r0` probe codec/driver plus one black-box agreement suite.** Do not repair `scripts/r0-prepare.mjs`, `r0-inert-hook.mjs`, `r0-run-case.mjs`, or `r0-rail-collector.mjs` independently. The existing harness already owns fresh private roots, isolated HOME/`CLAUDE_CONFIG_DIR`, exact launch environment, outside-state canaries, PTY/auth/absolute-host preflight, and the L0 fault vocabulary. A second preparer/settings/live namespace would recreate r7 blockers 2, 3, 4, 6, and 7.

The prior installed-host probe (`context-notes/precompact-v3-live-rail-probe`) is valid primary observational input: pinned Claude 2.1.220 already demonstrated real manual and automatic `PreCompact -> SessionStart(compact) -> PostCompact` ordering and SessionStart context injection. It is not itself a reusable PASS because it lacks the closed raw receipt set r7 requires. The repair therefore adds only the missing reproducible host-contract probe and adjudication boundary to the existing harness; it does not add a second lifecycle or candidate-acceptance authority.

Sources pinned for this design: system model `designs/precompact-v3-r0-proof-rail-system-model@sha256:a2876766102f6db0f041c7caff1b526a6ad0be0353286f6c4615d1c5867cd4cb` (substantive bytes equal the requested 57b3 version; only a link append changed the head), skeptic r7 `@sha256:3f6b6fb48ebd74e0f98b519cf20d44890083e268efd00ed03e74ede21f62ad43`, official-hook note `@sha256:610f93e8c6b1389ff83e0dec44f02eef49902eb183e82d40a1753499a240e6b8`, and the current R0/T0 files at branch SHA `36c741a8173832d75d61a7ab138b5219c4415c66`.

# Recommended component collapse

## One executable owner

Extend existing `packages/cli/test/fixtures/handoff/live-harness.mjs`; do not add another preparer, collector, or runbook authority. Its bounded R0 subcommands are:

- `r0-prepare --mode static|live`: extend the existing absent-root T0 preparation with one immutable campaign and the closed case catalog.
- `r0-install <root> <case>` / `r0-restore <root> <case>`: snapshot, structurally merge, verify, CAS-restore, and prove isolated settings bytes. These commands only accept the harness-owned `claude_config_dir`; real user settings are structurally unreachable.
- `r0-hook <case-manifest>`: the exact command installed for PreCompact, compact SessionStart, and evidence-only PostCompact. The same response codec owns every event shape.
- `r0-run-static <root> <case>`: deterministic self-test only, under a STATIC-only root and schema.
- `r0-run-live <root> <case>`: launch the exact reviewed Claude artifact and cwd/environment already owned by T0, with bounded termination and a `finally` restoration path. It creates LIVE evidence only after opt-in, PTY/auth, path, version, and digest preflight.
- `r0-adjudicate <root> [--expect static|live]`: read-only closed verdict derivation after restoration.

The executable may internally factor pure functions, but there is one schema/response/path/settings implementation. Tests invoke its emitted commands; test support must not reproduce them.

## Delete the superseded surface in the same unit

Remove `scripts/r0-prepare.mjs`, `scripts/r0-inert-hook.mjs`, `scripts/r0-run-case.mjs`, `scripts/r0-rail-collector.mjs`, `packages/cli/test/fixtures/r0/isolated-settings.json`, `packages/cli/test/support/r0-live-rail.ts`, `packages/cli/test/r0-live-rail.test.ts`, `packages/cli/test/r0-collector.test.ts`, `docs/r0-live-rail-runbook.md`, and every repository `.r0-live/` artifact. Replace them with one `packages/cli/test/handoff-r0-proof.test.ts`. Executable `--help`/receipts, not prose, own exact commands and ordering.

## Closed prerequisite cases

Encode one constant table, mechanically asserted by tests:

1. `manual-positive`: manual PreCompact empty success; correlated compact SessionStart returns the fresh sentinel as SessionStart `additionalContext`; positive PostCompact is evidence-only and returns empty success.
2. `auto-positive`: same, with observed `trigger=auto`.
3. `auto-precompact-block`: structured PreCompact block; no compact SessionStart, PostCompact, or first post-compaction assistant response.
4. `compact-session-stop`: PreCompact empty success; correlated compact SessionStart returns `continue:false`; no first resumed assistant response.

If product review selects a fifth manual-block case, change this one table and its exact-table test. No runbook may carry a different case list. Positive PreCompact is **zero stdout bytes**, not `{}` and never SessionStart-shaped. Positive compact SessionStart is the sole context response. PostCompact is evidence-only, never lifecycle authority.

# Data and evidence schemas

All files below are 0600 (immutable declarations become 0400); directories are 0700. Manifests and receipts use exclusive, no-follow creation. Each receipt references raw `.bin` files by path, byte length, and SHA-256; the bounded verdict contains no sentinel or transcript content.

## Campaign manifest: `agentstate-lite-r0-campaign/v1`

Fields: `evidence_mode`, random `campaign_id`, canonical harness root/layout, exact four-case IDs, creation time, `node` realpath/version/SHA-256, harness realpath/SHA-256, reviewed source SHA, exact Claude artifact realpath/version/SHA-256, capability-probe result, launch cwd, non-secret environment, secret environment **names only**, base-settings path/SHA-256, outside-canary before hashes, and each case-manifest SHA-256. LIVE requires `/private/tmp/aslite-handoff-live.*`, `AGENTSTATE_LITE_HANDOFF_LIVE=1`, PTY/auth presence, and the pinned artifact. STATIC requires a mechanically disjoint `/private/tmp/aslite-handoff-static.*` root and has no Claude/auth path.

For the accepted revision-3 tuple, the LIVE host is the immutable artifact `/Users/brian/.local/share/claude/versions/2.1.220` with the accepted `8add...` digest, not the moving `/Users/brian/.local/bin/claude` launcher now resolving to 2.1.221. Preparation fails closed on any path/version/digest mismatch. Current documentation's `--include-hook-events` is used only if an exact 2.1.220 capability probe records support; hook receipts remain the primary evidence channel.

## Case manifest: `agentstate-lite-r0-case/v1`

Fields: campaign ID/SHA, case ID/kind, fresh 256-bit sentinel and its commitment, exact expected event rows (`sequence`, event, trigger/source, response kind), exact shell command plus argv vector, exact case cwd/environment identity, source/settings digests, timeout, and expected host effects. The same manifest routes all events for one case. The first receipt binds `session_id`, `transcript_path`, and `cwd`; every later event must match all three.

## Raw event receipt: `agentstate-lite-r0-event/v1`

Fields: mode/campaign/case/sequence, full correlated event identity, start/end UTC plus monotonic timestamps, manifest/harness/Node digests, raw stdin/stdout/stderr file descriptors (`path`, bytes, SHA-256), exit/signal/timeout, transcript snapshot descriptor at that boundary, and prior-receipt SHA. Receipt filenames are expected-sequence slots created with exclusive/no-follow open; missing, duplicate, stale, reordered, cross-case, or cross-session events cannot be appended as valid evidence.

`r0-hook` reads bounded stdin bytes, computes the sole protocol response through the one codec, durably creates raw stdin/stdout/stderr and the receipt, then writes **exactly the recorded stdout buffer** to `process.stdout`; diagnostics use only the recorded stderr buffer. Empty-success creates a zero-byte stdout artifact and writes no stdout. A recording failure fails the host case closed and can never yield PASS. Tests byte-compare caller-observed stdout/stderr to the receipt files.

## Settings/restoration receipt: `agentstate-lite-r0-settings/v1`

Fields: isolated settings realpath, before/installed/restored byte descriptors, structural hashes of every pre-existing foreign hook group, exact installed command/argv digest, case manifest digest, atomic-write result, restore expected-version digest, outside-canary hashes, and managed-process cleanup. Install parses and structurally appends only this case's groups; it never copies a whole fixture over settings. Restore is CAS-like: it overwrites only when current bytes equal the recorded installed digest, then byte-compares the result to before. A foreign-hook change, concurrent settings change, restoration mismatch, or surviving process is FAIL.

## Effect receipt and verdict

The live driver records the exact Claude argv/env/cwd, process exit/signal/timeout, raw host stream when the pinned artifact supports it, pre-compact transcript bytes/hash, final isolated transcript bytes/hash, PostCompact raw `compact_summary`, event-chain head, and outside-state verification. The read-only verdict validates:

- source/host/settings/manifest identity and LIVE/STATIC namespace;
- exact response schema and byte purity;
- expected event order and one session/transcript/cwd binding;
- sentinel absence from pre-injection transcript and PostCompact native summary;
- sentinel presence only in positive compact SessionStart stdout and the first resumed positive response;
- compaction suppression for PreCompact block and first-response suppression for `continue:false`;
- all timeouts/exits, settings restoration, outside canaries, and process cleanup.

Verdict schema: `agentstate-lite-r0-verdict/v1`, `PASS|FAIL`, mode, campaign/case IDs, reason-code array, evidence-chain head, and boolean facts only. `--expect live` categorically rejects STATIC schemas/roots/receipts.

# Dependency order

1. **Red contract first:** add the black-box agreement rows below against the existing harness; current bytes must fail on missing R0 commands, wrong positive PreCompact output, settings ownership, cwd independence, and absent adjudication.
2. **Collapse ownership:** add the campaign/case schema, module-relative path resolver, exact host/source pinning, and STATIC/LIVE root gate to `live-harness.mjs`.
3. **Response/evidence primitive:** add `r0-hook` with raw-byte preservation and strict sequence/session correlation; make codec rows green.
4. **Settings safety:** add structural install/read-back/CAS restore and outside-canary agreement; make path/symlink/foreign-hook rows green.
5. **Bounded driver/adjudicator:** add static execution, exact live argv emission/launch, effect collection, and fail-closed verdict. This is only the inert host-contract probe.
6. **Consolidate:** delete every staged R0 duplicate and repository evidence namespace; the absence test must turn green.
7. **Verify:** run the test from package cwd through the package `npm test` path and from repository root; execute the red-probe command and record its nonzero result; then independent exact review. Only review PASS authorizes a fresh isolated LIVE campaign. LIVE completion does not accept lifecycle code.

# Red-first test matrix

| ID | Executable agreement | Required observation |
|---|---|---|
| T1 | exact case catalog | only the four IDs/expected event rows above; no prose variant |
| T2 | response table over every case/event | positive PreCompact/PostCompact are zero bytes; SessionStart context, PreCompact block, and SessionStart stop are exact JSON bytes |
| T3 | protocol/raw-byte agreement | shell-observed stdout/stderr equal raw receipt bytes, including zero-byte success; no debug prefix/suffix |
| T4 | emitted-command agreement | execute the emitted settings command character-for-character from repo root, `packages/cli`, and a copied harness path containing spaces/quotes; identical result |
| T5 | settings round trip | seeded foreign groups survive install and restore structurally; restored file is byte-identical; a concurrent edit causes refusal, not overwrite |
| T6 | unsafe/stale paths | reject existing campaign/case/evidence files, symlinked roots/components, escaping manifest/transcript paths, wrong modes, and stale source/settings/host digests |
| T7 | mode firewall | complete STATIC fixture is rejected by `--expect live`; static driver cannot create the live prefix or LIVE schema; repository `.r0-live` remains absent |
| T8 | event correlation table | reject missing, duplicate, reordered, wrong trigger/source, cross-case, cross-session, transcript mismatch, cwd mismatch, and unexpected PostCompact rows |
| T9 | effect table | reject sentinel in pre-transcript/native summary, missing sentinel delivery, absent first positive resumed response, or a resumed response after either negative effect |
| T10 | exact host pin | reject the moving 2.1.221 launcher, wrong 2.1.220 digest, unsupported assumed flag, absent PTY/auth, and any launch-vector drift |
| T11 | cleanup/restoration | child timeout/signal, surviving child, outside-canary drift, restore mismatch, or missing restoration receipt forces FAIL |
| T12 | consolidation | assert all nine superseded R0 files and repository-generated evidence paths are absent |
| T13 | real red probe | a test-only evidence factory creates an otherwise complete positive case but substitutes SessionStart JSON for positive PreCompact; the normal PASS oracle must fail with `PRECOMPACT_STDOUT_NOT_EMPTY`. A parent meta-test spawns that exact test with `AGENTSTATE_LITE_R0_RED_PROBE=precompact-sessionstart-shape`, requires nonzero exit, and asserts the named reason. No bypass exists in production code. |

T4 runs through `/bin/sh -c` because Claude settings store a command string; the manifest also records the argv projection so review can see exactly what the string denotes. All source resolution derives from `import.meta.url`, never `process.cwd()`.

# r7 blocker mapping

| r7 blocker | Owning primitive | Executable closure |
|---|---|---|
| 1 wrong positive PreCompact response | one R0 response codec in existing harness | T1, T2, T13 |
| 2 preparer/settings paths uncoupled | harness-owned canonical layout + emitted absolute command/manifest paths | T4, T6 |
| 3 prose-only install/restore and overwrite | structural settings install/read-back/CAS restore receipt | T5, T11 |
| 4 PATH/cwd-selected invocation | exact realpaths/digests and emitted command+argv; module-relative resolution | T4, T10 |
| 5 no raw evidence/adjudication | raw event chain + effect receipt + read-only closed verdict | T3, T8, T9, T11 |
| 6 STATIC/LIVE only a label | disjoint root/schema/opt-in authorities and `--expect live` rejection | T6, T7, T10 |
| 7 6/6 cwd-dependent and incomplete | one package-discovered black-box agreement suite run from both cwd contexts | T2-T13, especially T4 |
| 8 four-case matrix not executable/correlated | one constant case table, per-case manifests, session/transcript/cwd sequence binding, exact live driver | T1, T8, T9, T10 |

Every blocker has executable ownership; the deleted runbook carries no authority.

# Risks and non-goals

- The installed 2.1.220 artifact must feature-probe any current-doc flag; documentation newer than the artifact is not an oracle. Unsupported `--include-hook-events` narrows complementary host-stream evidence but cannot be silently assumed.
- The exact negative compact-SessionStart PostCompact behavior must be frozen by the first pinned-host probe. Until frozen, adjudication fails rather than accepting either event order.
- Raw isolated transcripts may contain proof prompts; they remain inside the private temporary root and are never written to the public bundle. Verdicts are content-free.
- This unit does **not** own production settings installation, the lifecycle authority, identity extraction, CAS journal transitions, work/resume claims, acknowledgement, recovery, GC, candidate freeze, tmux, detached processes, or final revision-3 acceptance. Existing later L0-L3/candidate gates retain those responsibilities.
- The prior positive probe guides the contract but does not waive the fresh reviewed LIVE rerun, because its prose note cannot satisfy raw-evidence provenance.

# Confidence

High (0.94) on ownership collapse, response/stdout contract, cwd/path/restoration architecture, blocker coverage, and deletion of the parallel staged surface. Medium-high (0.82) on the final negative SessionStart event tail until exact Claude 2.1.220 behavior is feature-probed and frozen. Overall confidence: **0.91**.

[delivers](../tasks/precompact-v3-r0-proof-test-architecture.md)
