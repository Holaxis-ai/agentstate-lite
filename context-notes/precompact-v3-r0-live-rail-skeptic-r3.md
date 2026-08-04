---
type: Context Note
title: Revision 3 latest R0 live-rail skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic-r3
timestamp: '2026-08-04T16:42:01.468Z'
---
# Summary

Status: complete; independent static review of latest R0 repair.

Verdict: **FAIL**. Confidence: **0.999**.

Live R0 authorization: **NO**.

The ambient mode override is removed and the manifest now carries `case_mode`, but the reviewed path still cannot run successfully through installed Claude. The preparer fabricates a complete future event, while the hook requires parsed `JSON.stringify` equality with real stdin. Real session/transcript identity and full input keys cannot be known before Claude invokes the hook. Positive settings also point both PreCompact and SessionStart at one SessionStart manifest, so PreCompact necessarily fails the equality check before compaction.

No raw live collector or post-live adjudicator exists. The runbook describes them in future tense. `r0-rail-collector.mjs` remains a STATIC manifest generator whose exported verdict checks only that five caller-supplied strings exist. It neither reads retained files nor proves sentinel absence/presence, event order, host identity, or negative effects.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.999
  live_r0_authorization: false
  reviewed_files:
    scripts/r0-run-case.mjs: ef0c6ce2524c278b46046ecbf50742898bf4cd97c362828cb4a6b98b597f0f2e
    scripts/r0-inert-hook.mjs: 9fe7c3e39760f61b0c75d2f31c02d24a63612493e780146a8efa0794376cb58d
    scripts/r0-rail-collector.mjs: 1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0
    packages/cli/test/r0-collector.test.ts: e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe
    packages/cli/test/r0-live-rail.test.ts: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
    packages/cli/test/support/r0-live-rail.ts: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
    docs/r0-live-rail-runbook.md: 62b6fab48852b05a191f5e7470730c140d232f8b1cc5f0125e83d55e5a1d7235
  blockers:
    - LIVE_EVENT_CANNOT_MATCH_PREFABRICATED_EXACT_EVENT
    - POSITIVE_PRECOMPACT_USES_SESSIONSTART_MANIFEST
    - RUNNER_IS_SYNTHETIC_NOT_A_CLAUDE_HOOK
    - RAW_LIVE_COLLECTOR_AND_ADJUDICATOR_DO_NOT_EXIST
    - RUNBOOK_STDOUT_REDIRECTION_BREAKS_HOOK_RESPONSE
    - NEGATIVE_EFFECTS_AND_AUTOMATIC_PROVENANCE_NOT_COLLECTED
    - STATIC_RECEIPTS_REMAIN_LIVE_SHAPED
  note: context-notes/precompact-v3-r0-live-rail-skeptic-r3
```

## Exact review boundary

Reviewed the exact files and current generated `.r0-live` examples in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`. I did not edit, execute tests, invoke Claude/tmux, alter settings, or use auth/network. The 6/6 result is builder-reported.

## Concrete blockers

### 1. Prefabricated exact event cannot match installed Claude

`r0-run-case.mjs` writes a manifest event containing a fabricated `session_id`, repository-local transcript path, cwd, and minimal key set. `r0-inert-hook.mjs` requires:

```js
JSON.stringify(input) === JSON.stringify(manifest.event)
```

This is parsed-object insertion-order equality, not raw-byte binding or canonical schema validation. A real Claude event has host-assigned session/transcript identity and may include additional keys/order. The operator cannot know those exact bytes before creating the manifest. The live hook therefore rejects legitimate stdin.

Required repair: the immutable case manifest may bind only facts knowable before invocation—closed case kind, expected event name/source/trigger, expected project root, sentinel, and fixture digests. The hook must validate the documented schema, then create-only capture the actual raw event and full identity. A later paired event is correlated by validated actual session/transcript identity. Unknown/extra-key policy must be explicit rather than accidental stringify equality.

### 2. One positive manifest cannot serve PreCompact and SessionStart

For both positive modes, the preparer puts only a SessionStart/source compact event in the manifest. The runbook instructs configuring both PreCompact and SessionStart commands to that same manifest. A real positive PreCompact event fails event equality, so compaction cannot reach SessionStart.

Required repair: the hook/case schema must support the positive ordered pair: exact manual/auto PreCompact pass-through and subsequent SessionStart compact injection, with actual identity correlation. Separate event-specific manifests are acceptable only if they share one immutable case id/sentinel and ordering contract.

### 3. `r0-run-case` is still a synthetic runner, not the installed hook

The runner never reads stdin. It manufactures an event, locally spawns the hook, and prints/writes evidence JSON. Claude cannot invoke it as a hook because Claude would receive evidence JSON rather than an event-valid response.

The runner still labels the manifest `mode:"LIVE"` despite its STATIC source comment and synthetic execution. Remove live classification from this path. Synthetic outputs must be structurally excluded from live verdict input.

### 4. Claimed raw collector/adjudicator is not implemented

The runbook says “The live collector must capture” and “A post-live adjudicator compares,” but no reviewed executable performs either role.

`r0-rail-collector.mjs`:

- generates a separate STATIC manifest unrelated to the runner manifest;
- does not capture stdin/stdout/stderr, transcript, summary, first response, settings, host, or timing;
- exports a verdict that accepts any object containing five strings and nonempty stdout;
- does not check sentinel absence or presence;
- does not check manual/automatic event pairs or negative effects;
- is not invoked as an adjudicator by its CLI body; and
- still prints a digest of JSON without the newline written to `manifest.json`.

Required repair: implement and test a post-live CLI that reads exact retained files, recomputes their digests/searches/schema/order, and emits PASS only for the complete case matrix. Naked booleans/strings cannot satisfy it.

### 5. Runbook output redirection would prevent Claude receiving the response

The runbook says configure hook output “redirected only to `.r0-live/<case>/raw/`.” Shell redirection of stdout means Claude does not receive the hook JSON. No reviewed tee/wrapper both preserves exact stdout and records an identical bounded copy.

Required repair: the installed hook itself must create-only record the exact output bytes while writing the same sole JSON document to stdout, or use a reviewed wrapper with proven passthrough. The runbook must provide the exact settings stanza and commands.

### 6. Negative and automatic live claims are not captured

The runbook still lacks an executable negative SessionStart procedure even though source has a branch. It asks for negative PreCompact “both triggers,” but the mode list has only `negative-precompact`, whose synthetic event always uses `trigger:"manual"`.

Positive manual/automatic runners both synthesize the same SessionStart event and no preceding PreCompact event. Mode labels are not trigger provenance. No code observes first-response suppression.

Required repair: distinct installed-host cases with raw PreCompact trigger and paired SessionStart identity/order, plus a negative SessionStart case that retains proof no first resumed response occurred within the declared bound.

### 7. Static tests remain misleading and incomplete

The old four tests still use a fixed sentinel and hard-code transcript/native-summary absence. The new runner test is named “rejects manifest/event mismatch” but never supplies a mismatch. No test invokes a genuine input mismatch, positive PreCompact pass-through, automatic trigger, collector verdict from files, settings restoration, or live/synthetic classification rejection.

The 6/6 suite therefore remains adapter scaffolding, not the R0 gate.

## Final decision

**FAIL — live R0 authorization CLOSED.**

Confidence: **0.999**.
