---
type: Context Note
title: Revision 3 unified R0 live-rail skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic-r2
timestamp: '2026-08-04T16:29:05.654Z'
---
# Summary

Status: complete; independent static review of latest unified R0 implementation.

Verdict: **FAIL**. Confidence: **0.999**.

Live R0 authorization: **NO**.

The new runner creates one manifest → child-hook → evidence path, but it is entirely synthetic. It never reads stdin from installed Claude, never installs itself as a hook, never observes compaction, and never captures a model response. It invents the event and hard-codes transcript/native-summary absence to true. Its source comment says STATIC while its manifest says `mode:"LIVE"`; generated files therefore look like live evidence for facts never observed.

Event binding is partial and overrideable. The manifest does not bind the case mode, `R0_MODE` from ambient environment controls the response, and the hook compares only event name plus SessionStart source—not session, transcript, cwd, trigger, complete bytes, or manifest digest. Positive manual/automatic modes synthesize identical SessionStart events and no PreCompact event. Negative automatic PreCompact is not representable.

The runbook still does not provide an isolated Claude settings stanza or a command that can serve as a real hook. `r0-run-case.mjs` cannot be that command: it ignores Claude stdin and manufactures its own event. The targeted sixth test only runs this synthetic path and its name claims mismatch rejection that it never tests.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.999
  live_r0_authorization: false
  static_only: true
  reviewed_files:
    - path: scripts/r0-run-case.mjs
      sha256: a2e2e762639dc6d65b83202b321c6e5cb13634b07854948a052d82b2bd11deff
    - path: scripts/r0-inert-hook.mjs
      sha256: c393fddefc6bbcc12a3ebb47da35655752d8e7327cbf9c7e83be5772af7549c2
    - path: scripts/r0-rail-collector.mjs
      sha256: 5003e7ad6a70c19f8a1a5f47bf47c01b091e65ce31a301eaca00b9691282eae7
    - path: packages/cli/test/r0-collector.test.ts
      sha256: e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe
    - path: packages/cli/test/r0-live-rail.test.ts
      sha256: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
    - path: packages/cli/test/support/r0-live-rail.ts
      sha256: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
    - path: docs/r0-live-rail-runbook.md
      sha256: 3748fe66d8188db6e665695389ce9e994214cd2e88fa8ad48de52e62b770ac7f
  blockers:
    - id: SYNTHETIC_RUNNER_LABELS_MANUFACTURED_EVIDENCE_LIVE
      severity: critical
    - id: RUNNER_CANNOT_BE_INVOKED_AS_CLAUDE_HOOK
      severity: critical
    - id: EVENT_AND_MODE_NOT_EXACTLY_MANIFEST_BOUND
      severity: critical
    - id: ABSENCE_AND_OUTPUT_RECEIPTS_ARE_HARD_CODED
      severity: critical
    - id: NEGATIVE_AND_AUTOMATIC_RAILS_NOT_OBSERVED
      severity: critical
    - id: SETTINGS_ISOLATION_AND_RESTORE_NOT_EXECUTABLE
      severity: critical
    - id: PATH_TRAVERSAL_OVERWRITE_AND_REPO_POLLUTION
      severity: high
    - id: TEST_NAMES_ASSERT_UNTESTED_PROPERTIES
      severity: high
  note: context-notes/precompact-v3-r0-live-rail-skeptic-r2
```

## Exact review boundary

Reviewed all exact files named in the envelope in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, plus the generated `.r0-live/*/{manifest,evidence}.json` files as retained examples of the tool's output. I did not edit, delete, execute tests, invoke Claude/tmux, alter settings, or use auth/network. The 6/6 result is builder-reported.

The worktree currently contains untracked `.r0-live/` evidence created by the runner/tests, in addition to the reviewed untracked source/test files.

## Critical blocker 1 — synthetic facts are labeled LIVE

`r0-run-case.mjs` begins:

```js
// One STATIC command ...
```

but writes:

```json
{"schema":"r0-inert/v1","mode":"LIVE", ...}
```

It then creates its own event object and writes:

```js
transcript_sentinel_absent: true,
native_summary_sentinel_absent: true
```

without creating or reading either file. `output_received` means only that the locally spawned Node child wrote any stdout. No Claude process, hook dispatch, compaction, native summary, or model response participates.

This is more dangerous than a missing field: the retained `.r0-live` examples are live-shaped evidence with cryptographic sentinels and plausible paths, while their causal claims are manufactured. They can be mistaken for the hard gate the fixture is supposed to protect.

Minimum repair: every synthetic runner/receipt must say `evidence_class:"synthetic_adapter_test"` and be structurally incapable of satisfying live verdict algebra. Remove all transcript/summary/model-response booleans from synthetic evidence. Only a separate installed-host collector may emit `evidence_class:"installed_claude_live"`, and only from retained raw artifacts it actually reads/hashes.

## Critical blocker 2 — the runner cannot be installed as the hook under test

A Claude hook command receives real event JSON on stdin. `r0-run-case.mjs` never reads stdin. It takes case/mode argv, invents event JSON, and spawns `r0-inert-hook.mjs` locally. Configuring Claude to call the runner would discard the real host event and return the runner's evidence JSON, not the hook response JSON.

The runbook's “single static/live fixture command” is therefore not a live hook command. It provides no exact settings stanza invoking `r0-inert-hook.mjs` with a case manifest, no per-event configuration, and no independent sidecar/wrapper for capturing real stdin/stdout while preserving exact stdout to Claude.

Minimum architecture:

- **case preparer**: creates/locks one private manifest and baseline evidence outside the repo;
- **installed inert hook executable**: reads real stdin, validates it against the immutable manifest, writes the exact supported response to stdout, and append/create-only records raw stdin/output/timing without adding stdout noise;
- **post-case adjudicator**: after operator/manual/automatic interaction, reads retained transcript/summary/first-response/host/settings artifacts and recomputes verdict; and
- exact isolated project settings mapping the reviewed hook command to the intended event.

Synthetic adapter tests may invoke the same hook executable directly, but cannot substitute for installed dispatch.

## Critical blocker 3 — manifest and event identity do not control the result

The manifest stores `mode:"LIVE"`, not the requested case mode. Mode is supplied separately through ambient `R0_MODE`, which overrides inference. Thus manifest bytes do not determine whether the hook injects, blocks PreCompact, or blocks SessionStart.

The hook checks only:

- `hook_event_name`; and
- `source` when the manifest happens to contain one.

It does not compare `session_id`, `transcript_path`, `cwd`, PreCompact `trigger`, key set, scalar types, or canonical full input digest. It does not bind the manifest file digest supplied by settings. An event for a different session/workspace can consume the same case.

Unknown mode falls through to positive; missing/invalid sentinel is not exact-length/hex checked. Positive and negative response branches are therefore controlled by unreviewed ambient state rather than immutable case authority.

Minimum repair: put a closed case kind and exact expected-event schema/digest in the create-only manifest; prohibit mode/sentinel environment overrides; lstat/owner/mode/type/link-check the manifest; canonical-compare every required identity field; reject unknown/extra/mismatched input; and bind raw receipt rows to manifest and hook-source digests.

## Critical blocker 4 — raw evidence is neither raw nor sufficient

The runner records its synthetic event object twice, child stdout/stderr, exit code and caller-supplied mode. It does not record or verify:

- actual Claude stdin bytes;
- installed Claude executable/version/digest;
- actual hook command/settings bytes;
- monotonic start/end/timeout;
- pre-compaction transcript bytes/hash and sentinel search;
- native summary bytes/hash and sentinel search;
- first resumed response bytes/hash and exact sentinel occurrence;
- paired PreCompact→SessionStart event identity/order;
- compaction/manual/automatic trigger evidence;
- settings/production journal before-after continuity; or
- output schema/effect beyond nonempty stdout.

It has no timeout or output cap, does not parse/validate stdout before declaring received, and writes no readback/digest manifest. A nonzero exit still produces an evidence file.

The unchanged `r0-rail-collector` remains disconnected and its verdict trusts three naked booleans. Its printed manifest digest still excludes the newline written to disk.

## Critical blocker 5 — required rail cases are synthesized incorrectly

- `positive-manual` and `positive-automatic` both create identical SessionStart events. There is no preceding manual/auto PreCompact event and no installed event order.
- `negative-precompact` always uses trigger `manual`. There is no negative automatic PreCompact mode despite the runbook requiring both triggers.
- `negative-session` creates a synthetic SessionStart and observes only local JSON output. It cannot prove Claude suppresses the first resumed response.
- The hook positive mode would emit SessionStart `hookSpecificOutput` if invoked for positive PreCompact, because it does not implement event-correct pass-through.

Live PASS requires distinct retained installed-host cases: positive manual pair, positive automatic pair, negative manual/automatic PreCompact as selected by the approved Plan, and negative SessionStart compact effect. A receipt label is not trigger provenance.

## Critical blocker 6 — runbook still lacks settings isolation and live collection

The revised runbook names the runner and modes but still provides no:

- exact settings file/path/stanza and reviewed Node/hook vectors;
- backup digest, install readback, host digest, or byte-for-byte restore commands;
- command separating preparer, installed hook, and post-case adjudicator;
- manifest-to-event selection for real manual/automatic sessions;
- automatic compaction trigger/bound;
- negative SessionStart execution/effect procedure;
- transcript/native-summary/first-response location and hashing/search commands;
- output/evidence caps, timeouts, permissions checks, or verdict algebra;
- production journal/settings continuity checks; or
- durable copy/readback before removing temporary `.r0-live` state.

It still says “negative PreCompact ... for both triggers” although the runner exposes one manual-only mode, and does not instruct execution of negative-session.

## High blocker 7 — path safety and test isolation fail

`caseName` is inserted into `path.resolve(cwd, ".r0-live", caseName)` without validation. `../` can escape the intended root. `mkdir(...recursive)` accepts existing/symlinked roots; `writeFile` follows/truncates existing manifest/evidence paths rather than create-only. No lstat/UID/mode/link checks occur.

The test creates a temp basename but runs the runner with repository cwd, so it leaves `.r0-live/<basename>` in the shared worktree. Current `git status` confirms `.r0-live/` pollution. Passing tests should clean their own private temp root and must not leave live-shaped receipts in the source tree.

## High blocker 8 — tests claim properties they do not assert

The new test is named:

> standalone runner emits negative SessionStart and rejects manifest/event mismatch

It only checks that stdout contains `R0_NEGATIVE_SESSION`. It never supplies a mismatched event or asserts rejection. No test directly invokes `r0-inert-hook.mjs`, checks full JSON equality/exit/stderr, exercises positive integration, validates automatic provenance, verifies digest/readback, or checks path/symlink/mode failures.

The prior four tests remain unchanged with a fixed sentinel, hard-coded absence booleans, identical positive events and PreCompact-only negatives. The 6/6 result is not a six-case rail matrix.

## What survived review

- There is now one local manifest→hook→evidence path for synthetic adapter development.
- Sentinel generation uses 256 bits of cryptographic randomness per runner call.
- Negative SessionStart JSON exists and is exercised synthetically once.
- Hook code remains free of production authority, tmux, detached work, auth and network.
- The intended four mode names and raw stdout/stderr capture are useful scaffolding.
- Runbook still labels R0 a prerequisite rather than lifecycle acceptance.

## Minimum next architecture

Do not add more booleans to the synthetic runner. Split it into the three roles above—private case preparer, real installed inert hook, post-live adjudicator—and make `evidence_class` unforgeable by the synthetic path. Freeze exact settings and runbook commands, then repeat exact static Review before QA or Claude invocation.

## Final decision

**FAIL — live R0 authorization CLOSED.**

Confidence: **0.999**.
