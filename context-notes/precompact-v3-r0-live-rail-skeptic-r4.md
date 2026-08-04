---
type: Context Note
title: Revision 3 R0 structural repair skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic-r4
timestamp: '2026-08-04T16:51:14.582Z'
---
# Summary

Status: complete; exact static review of latest R0 structural repair.

Verdict: **FAIL**. Confidence: **1.00**.

Live R0 authorization: **NO**.

## Exact files

```yaml
scripts/r0-run-case.mjs: 7b5e981d08245d33d0ef7011cc6d4f8ca255349c3676dbf87245dfdbdb66dd2c
scripts/r0-inert-hook.mjs: 8b037ab46a5002e035db229467668c35fcf2f492f177a988bf56b646336f33d9
scripts/r0-rail-collector.mjs: 1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0
packages/cli/test/r0-collector.test.ts: e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe
packages/cli/test/r0-live-rail.test.ts: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
packages/cli/test/support/r0-live-rail.ts: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
docs/r0-live-rail-runbook.md: 62b6fab48852b05a191f5e7470730c140d232f8b1cc5f0125e83d55e5a1d7235
```

I did not edit or execute code, invoke Claude/tmux, alter settings, or use auth/network. The 6/6 result is builder-reported.

## Concrete blockers

1. **Correlation token cannot exist in real Claude stdin.** The hook requires `input.r0_case_token === manifest.case`. `r0_case_token` is a private synthetic field added only by `r0-run-case.mjs`; installed Claude does not emit it. No reviewed stdin-preserving wrapper injects it. Every real event therefore throws `correlation mismatch` before producing a legal response.

2. **Distinct PreCompact/SessionStart manifests do not exist.** Each case has one `manifest.json`. Positive modes put a SessionStart event in it. The runbook points both PreCompact and SessionStart entries at that manifest. Positive PreCompact fails `hook_event_name` matching, so compaction never reaches SessionStart.

3. **The preparer is still a synthetic runner.** `r0-run-case.mjs` never reads Claude stdin. It invents an event, calls the hook locally, and writes evidence. It cannot be configured as the installed hook because its stdout is evidence JSON, not the event-valid hook response.

4. **STATIC/LIVE separation is false.** The runner's source comment says STATIC, but it writes `manifest.mode:"LIVE"` and `.r0-live/*/evidence.json`. Those files contain synthetic events/output and can be mistaken for live receipts. No `evidence_class` or verdict exclusion separates them.

5. **Stdout passthrough is not implemented.** The runbook proposes redirecting hook output to a raw directory. Redirection prevents Claude from receiving the JSON. No reviewed tee/wrapper records identical bounded bytes while preserving the sole stdout response.

6. **No raw live collector exists.** `r0-rail-collector.mjs` creates an unrelated STATIC manifest. It does not capture actual stdin/stdout/stderr, timing, Claude host/settings, transcript, native summary, first response, event order, or unchanged state.

7. **No post-live adjudicator exists.** The exported `verdict` accepts five caller-supplied strings and nonempty stdout. It does not read files, recompute digests, search the sentinel, validate event order/schema, distinguish case kinds, or verify negative effects. The CLI never calls it.

8. **Automatic and negative provenance remain synthetic/incomplete.** Positive manual and automatic modes invent the same SessionStart event and no preceding PreCompact. `negative-precompact` always fabricates trigger `manual`; no automatic negative mode exists. Negative SessionStart only proves a local JSON branch, not suppression of the first resumed response.

9. **Settings isolation is prose only.** No exact settings artifact/stanza, path, backup/install/readback/restore command, host digest gate, per-event manifest selection, or isolation verification is present. “Isolated settings copy” is not connected to a demonstrated Claude invocation mechanism.

10. **Tests do not cover the claimed repairs.** The new test name says event mismatch is rejected but supplies no mismatch. No test covers real-shape stdin without the synthetic token, positive PreCompact pass-through, distinct manifests, stdout passthrough, collector/adjudicator file inputs, automatic trigger provenance, settings restoration, or rejection of synthetic evidence as LIVE. The old tests still hard-code transcript/native-summary absence.

11. **Path and overwrite safety remain open.** Unvalidated `caseName` can escape `.r0-live`; recursive mkdir accepts existing/symlinked roots; writeFile truncates/follows existing paths; no lstat/UID/mode/link/create-only/readback checks occur. The current test suite leaves untracked `.r0-live/` inside the worktree.

## Required shape before another live-authorization review

- A private case preparer that creates distinct event manifests and cannot emit LIVE evidence.
- A real installed hook command that reads Claude stdin, validates only knowable manifest expectations, create-only records actual identity/raw bytes, and writes the legal response unchanged to stdout.
- A post-live adjudicator that derives all positive/negative verdicts from retained raw files.
- Exact isolated settings and restoration commands.
- Static tests that exercise those exact boundaries and structurally reject synthetic receipts as live authority.

## Final decision

**FAIL — live authorization CLOSED.**

Note: `context-notes/precompact-v3-r0-live-rail-skeptic-r4`.
