---
type: Context Note
title: Revision 3 R0 live-rail fixture skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic
timestamp: '2026-08-04T13:46:03.296Z'
---
# Summary

Status: complete; independent static review of the R0 fixture file set.

Verdict: **FAIL**. Confidence: **0.99**.

Live execution authorization: **NO**.

The implementation is inert as a unit-test helper: it injects a fake in-memory authority, performs no filesystem/process/network/tmux/lifecycle work, and exercises the production adapter mapping without creating a handoff generation. The reported four tests can legitimately prove four static adapter examples.

It is not an installed-Claude R0 fixture. No reviewed executable or settings command causes Claude to invoke `runR0Case`; the real CLI `hook run` constructs the default lifecycle authority. The runbook supplies no exact installation/configuration command, stdin capture wrapper, sentinel source, evidence directory, or cleanup procedure. Thus the reviewed bytes cannot produce either the claimed positive live evidence or the negative live block evidence.

The static receipts also manufacture facts: transcript/native-summary absence are hard-coded `false`, manual and automatic positive cases send the same synthetic SessionStart event, and the sentinel is one fixed short constant. The negative tests exercise only PreCompact `{decision:"block"}`, never the load-bearing SessionStart `{continue:false}` response.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  live_execution_authorization: false
  static_fixture_inert: true
  static_tests_truthful_if_labeled_static_only: true
  reviewed_files:
    - path: packages/cli/test/support/r0-live-rail.ts
      sha256: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
    - path: packages/cli/test/r0-live-rail.test.ts
      sha256: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
    - path: docs/r0-live-rail-runbook.md
      sha256: d52b40935550888a8c17dd77eb6463363c85d7a521fa4d514d56a9bc67482eda
  blockers:
    - id: NO_INSTALLED_HOOK_ENTRYPOINT_FOR_INERT_AUTHORITY
      severity: critical
    - id: STATIC_RECEIPT_MANUFACTURES_TRANSCRIPT_ABSENCE
      severity: critical
    - id: NO_SESSIONSTART_CONTINUE_FALSE_CASE
      severity: critical
    - id: FIXED_NON_FRESH_SENTINEL
      severity: high
    - id: MANUAL_AUTOMATIC_POSITIVES_ARE_IDENTICAL
      severity: high
    - id: RUNBOOK_NOT_EXECUTABLE_OR_EVIDENCE_COMPLETE
      severity: high
  note: context-notes/precompact-v3-r0-live-rail-skeptic
```

## Exact review boundary

Reviewed in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`:

- `packages/cli/test/support/r0-live-rail.ts@sha256:87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd`;
- `packages/cli/test/r0-live-rail.test.ts@sha256:384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8`; and
- `docs/r0-live-rail-runbook.md@sha256:d52b40935550888a8c17dd77eb6463363c85d7a521fa4d514d56a9bc67482eda`.

I also read the directly invoked adapter and CLI dispatch in `hook-lifecycle.ts`/`hook.ts` solely to establish reachability. I did not edit code, run tests or Claude, invoke tmux, use auth/network, or alter host/settings state. The targeted 4/4 result is builder-reported, not independently rerun.

## Critical blocker 1 — the reviewed fixture has no live invocation path

`runR0Case` is a TypeScript test-support function. It calls `runClaudeHookPayload` in-process with an injected fake `HandoffAuthorityPort`. The installed CLI `hook run` does not import or select this helper; it creates `createDefaultHandoffAuthorityPort()` unless a test-only dependency is injected programmatically.

Consequently, installing the normal hook and following the runbook would exercise production authority state, violating R0 inertness. Conversely, importing `runR0Case` exercises only a Node unit test and never crosses the Claude hook rail.

The runbook says “execute” but gives no exact reviewed executable, command vector, settings stanza, temporary root, environment allowlist, stdin/stdout capture wrapper, or restore procedure. There is no path from installed Claude settings to these exact fake-authority bytes.

Minimum repair: provide one frozen, executable R0 hook command that:

- is directly referenced by an isolated Claude test settings file;
- reads real hook JSON from stdin and writes only one documented JSON response to stdout;
- selects positive/negative behavior from a precreated immutable case manifest under a private temporary root, not from production journal state;
- never imports/constructs the production handoff authority;
- writes raw receipts only to the exact temporary evidence root, with bounded stderr and no other mutation;
- has an exact install/run/restore/cleanup runbook; and
- is independently reviewed before QA/live use.

The executable can reuse the pure adapter mapping, but the actual installed command must be among the reviewed bytes.

## Critical blocker 2 — transcript and native-summary absence are constants

`runR0Case` returns:

```ts
sentinelInTranscript: false,
sentinelInNativeSummary: false,
```

It never opens or hashes either artifact. The tests assert these constants. They can pass even when the sentinel already exists in the transcript or native summary, so the resulting `R0Receipt` looks causal while containing no observation.

Remove these fields from static receipts. Static tests may assert only the output mapping and label the result `STATIC_FIXTURE_ONLY`. Live acceptance must derive absence from retained exact pre-injection transcript/summary bytes or hashes plus a bounded search receipt produced by the reviewed evidence collector. A hard-coded false must never enter a live-shaped receipt.

## Critical blocker 3 — negative SessionStart is absent

Both negative cases construct `PreCompact` events and assert the internal adapter result `{decision:"block", reason:"HANDOFF_SCHEMA_INVALID"}`. They never construct `SessionStart` with `source:"compact"` and a halting authority, whose expected response is `{continue:false, stopReason:...}`.

R0 must statically and live-test both separate negative surfaces:

- PreCompact block prevents compaction; and
- SessionStart compact block prevents the first resumed response after compaction.

The real installed negative evidence must show host behavior, not merely object equality from `runClaudeHookPayload`.

## High blocker 4 — sentinel is fixed and low-entropy

`R0_SENTINEL_7f3c9a2e` is the same in every static/manual/automatic run and has only an eight-hex suffix. It is present in reviewed source before any pre-compaction absence snapshot. This cannot be the fresh random, injection-only sentinel required to disambiguate native summary retention from hook injection.

For each live case, generate at least 128 bits—preferably 256 bits—outside the conversation after the baseline snapshot; store it only in the private immutable case manifest and expected-output evidence. Manual and automatic cases must use distinct values. The reviewed executable should read, validate, and echo the manifest sentinel without logging it into the pre-compaction transcript.

Static unit tests can use deterministic placeholder values, but must not label them as live canaries.

## High blocker 5 — manual and automatic positives are labels, not different inputs

For positive cases, `trigger` affects only the returned receipt. Both iterations send the identical synthetic event:

```json
{"hook_event_name":"SessionStart","source":"compact", ...}
```

SessionStart contains no manual/automatic trigger, so a unit test cannot infer which compaction path produced it. The two test names create two apparent rail cases from one adapter case.

Keep one static SessionStart mapping test. Distinguish manual versus automatic only from retained real PreCompact trigger/event-order receipts tied to the corresponding SessionStart session/transcript identity and unique sentinel. A receipt label supplied by the caller is not provenance.

## High blocker 6 — runbook cannot yield auditable evidence

The runbook lists desired outcomes but lacks:

- exact commands and reviewed fixture digest checks;
- installed Claude executable/version/digest verification;
- isolated settings creation and restoration;
- exact manual and bounded automatic trigger procedures;
- private evidence-root creation/modes and file manifest;
- how raw stdin/stdout/stderr/exit/timing are captured without changing hook output;
- how native summary absence is located/proven;
- per-case random sentinel generation after baseline;
- SessionStart negative block procedure;
- prohibition on using static 4/4 as live verdict evidence;
- cleanup/readback and unchanged production journal/settings receipts; and
- final manifest/verdict algebra.

Add these steps mechanically. A live PASS must require all exact rows for four independent cases: positive manual, positive automatic, negative PreCompact, and negative SessionStart. The static unit suite remains a prerequisite only.

## What survived review

- The helper is inert in its current static execution: no lifecycle journal, process, tmux, auth, network, filesystem, or board mutation.
- It uses an in-memory fake authority and blank board orientation.
- Positive adapter mapping targets `hookSpecificOutput.hookEventName:"SessionStart"` and `additionalContext`.
- Negative PreCompact mapping is at least covered statically.
- The runbook correctly states that R0 is not lifecycle acceptance and names raw receipts, event order, host digest, transcript/native-summary hashes, and first-response canaries as desired evidence.
- It makes no tmux or detached-process claim.

## Final decision

**FAIL — static-only helper; not authorized for live R0 acceptance.**

Confidence: **0.99**.
