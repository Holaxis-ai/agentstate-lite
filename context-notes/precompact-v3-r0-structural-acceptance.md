---
type: Context Note
title: Revision 3 R0 structural acceptance review
description: >-
  FAIL: R0 fixture cannot produce trustworthy installed-Claude evidence; live
  execution denied pending structural repair.
tags:
  - precompact-v3
  - r0
  - acceptance-gate
actor: codex-precompact-v3-r0-structural-acceptance
timestamp: '2026-08-04T16:53:31.024Z'
---
# Summary

Revision 3 R0 structural acceptance is **FAIL** with confidence 0.99. The fixture cannot currently produce trustworthy installed-Claude evidence, so live Claude execution is not authorized until the blockers below are repaired and the exact new bytes pass a fresh structural review.

# Revision 3 R0 structural acceptance review

## Orientation

- Ultimate goal: make pre-compaction handoff reliable across concurrent Claude Code sessions without corrupting, leaking, or silently losing state.
- Proximate goal: determine whether the R0 live-rail fixture is structurally capable of producing trustworthy installed-Claude evidence before any live Claude run is authorized.
- Reviewed workspace: `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`
- Reviewed repository HEAD: `36c741a8173832d75d61a7ab138b5219c4415c66`
- Scope: the untracked R0 fixture only; no fixture files were edited and no Claude process was launched.

## Verdict

**FAIL — confidence 0.99.**

**Live authorization: NO. Do not run installed Claude from these fixture bytes.**

The fixture can unit-exercise fragments of the intended hook schemas, but it cannot execute the claimed manual/automatic journeys through the installed Claude hook rail, and its current evidence model can manufacture the central acceptance claims.

## Exact files reviewed

- `scripts/r0-inert-hook.mjs` — SHA-256 `8b037ab46a5002e035db229467668c35fcf2f492f177a988bf56b646336f33d9`
- `scripts/r0-rail-collector.mjs` — SHA-256 `1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0`
- `scripts/r0-run-case.mjs` — SHA-256 `7b5e981d08245d33d0ef7011cc6d4f8ca255349c3676dbf87245dfdbdb66dd2c`
- `packages/cli/test/support/r0-live-rail.ts` — SHA-256 `87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd`
- `packages/cli/test/r0-collector.test.ts` — SHA-256 `e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe`
- `packages/cli/test/r0-live-rail.test.ts` — SHA-256 `384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8`

All six files were mode `0644`, not executable. No package script, settings fixture, or runbook references the R0 fixture.

## Blocking findings

### 1. The hook is not callable from an unmodified installed-Claude payload

`r0-inert-hook.mjs` requires `input.r0_case_token === manifest.case`. `r0_case_token` is a fixture-invented input field; installed Claude will not add it to hook stdin. The direct runner succeeds only because `r0-run-case.mjs` manufactures that field before spawning Node. This tests the fixture's private protocol, not Claude's hook protocol.

There is also no isolated temporary Claude settings file, no exact absolute Node/script/manifest command, and no installation/restoration procedure. Because the scripts are `0644`, a settings command could only work if it explicitly invokes a known Node executable; no such command is specified.

One manifest accepts one event name, so the same installed session cannot establish the load-bearing `PreCompact -> SessionStart(source=compact)` sequence using the current manifest contract.

### 2. The claimed journey coverage is label-only

`positive-manual` and `positive-automatic` both directly spawn the same synthesized `SessionStart` event with `source: "compact"`. They have no preceding PreCompact event, no manual/automatic trigger provenance, and no event-order evidence. Their only distinction is the caller-supplied mode label.

The negative PreCompact runner always synthesizes `trigger: "manual"`; there is no negative automatic-PreCompact case. The negative SessionStart path is also a direct script invocation and cannot prove that installed Claude suppresses the first response after compaction.

### 3. The central evidence claims can be manufactured

`packages/cli/test/support/r0-live-rail.ts` hardcodes `sentinelInTranscript: false` and `sentinelInNativeSummary: false` without reading transcript or native-summary bytes. Those are assertions disguised as observations.

`r0-run-case.mjs` records a parsed, fixture-created event plus stdout/stderr/exit code. It does not capture exact raw hook stdin bytes, a real Claude transcript, a real native summary, event timing/order, first-response behavior, timeout/signal/EOF, installed-Claude identity, settings identity, or source/script/manifest digests.

`r0-rail-collector.mjs` defines a separate evidence shape containing `stdin_raw`, `claude_transcript`, and `native_summary`, but the runner never produces that shape and no code invokes its `verdict` function. Even if invoked, the verdict only checks type/non-emptiness; it does not verify sentinel presence/absence, hook schema, blocking behavior, ordering, process completion, or digest binding.

Existing `.r0-live` artifacts are direct-runner artifacts, not installed-Claude artifacts. Some manifests omit fields that the current hook requires, while their evidence claims outputs inconsistent with the current bytes. They therefore cannot establish provenance or reproducibility.

### 4. Isolation is only partial

The standalone hook's strongest property survives: it does not import or invoke the production handoff authority and, by itself, only reads a manifest and writes hook JSON to stdout. The fixture also requests restrictive case-directory/file modes.

However, the runner writes `.r0-live` inside the repository, has no child timeout/kill policy, and provides no isolated-settings lifecycle, restoration receipt, foreign-hook preservation check, or proof that production journals/bundles/network were untouched. The TypeScript support fixture imports the production lifecycle adapter and substitutes a fake authority; it is a unit adapter, not inert live-rail proof.

## What survived structural review

- Positive output uses the intended `SessionStart` `hookSpecificOutput.additionalContext` shape.
- The standalone negative outputs use plausible top-level shapes: PreCompact `decision: "block"` and SessionStart `continue: false`/`stopReason`. These still require validation on the installed Claude version.
- The sentinel is high entropy.
- The standalone hook does not import production lifecycle code.
- The standalone hook emits JSON on stdout and contains no production-journal writer.

These are useful pieces, but none proves the delivery rail.

## Minimum repair before reconsidering live authorization

1. Specify installed-Claude journeys, not direct-node labels:
   - positive manual: observed PreCompact manual, then observed SessionStart `source: "compact"`, sentinel injected;
   - positive automatic: observed PreCompact auto, then observed SessionStart `source: "compact"`, sentinel injected;
   - negative manual PreCompact block;
   - negative automatic PreCompact block;
   - negative compact SessionStart `continue:false`, with absence of the first assistant response demonstrated.
2. Remove invented stdin fields. Correlate through an isolated case directory/manifest embedded in the exact settings command; treat documented `session_id` as evidence, not as a fixture-controlled secret.
3. Provide one event-aware inert collector/handler capable of recording the multi-event sequence, or explicit event-specific handlers with a shared append-only case log.
4. Generate an isolated temporary Claude settings file containing the exact absolute Node, script, and manifest paths. Capture before/install/after state and prove restoration without disturbing foreign hooks.
5. Capture, without parsing away provenance: exact stdin bytes, stdout/stderr bytes, exit/signal/timeout/EOF, monotonic event sequence/timestamps, actual transcript bytes/hash, actual native-summary bytes/hash, first-response/no-response evidence, installed Claude executable/version/config tuple, settings bytes/hash, and source/script/manifest digests.
6. Compute sentinel presence/absence from captured bytes. Never accept precomputed boolean claims as evidence.
7. Run in isolated temporary state, clean it after capture, and prove no production journal/bundle/network side effects and no writes outside named evidence/settings roots.
8. Keep unit tests for fixture parsing and verdict logic, but do not count them as live evidence. Require independent review of exact fixture bytes before live execution, then QA review of immutable evidence.

## Acceptance disposition

- Structural acceptance: **FAIL**.
- Permission to launch installed Claude: **DENIED for these bytes**.
- Next gate: repair the fixture and obtain a fresh exact-byte structural review. Only a PASS on that new revision may authorize the live manual/automatic runs.
