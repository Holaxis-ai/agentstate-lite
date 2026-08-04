---
type: Context Note
title: Revision 3 latest R0 repair skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic-r5
timestamp: '2026-08-04T17:09:39.590Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **1.00**.

Live R0 authorization: **NO**.

## Exact reviewed bytes

```yaml
scripts/r0-run-case.mjs: ef0c6ce2524c278b46046ecbf50742898bf4cd97c362828cb4a6b98b597f0f2e
scripts/r0-inert-hook.mjs: 0abed1959b9a3e6eb3b4fc64028e20d5e81a9201f0a33dac57f8a22b8a3a4621
scripts/r0-rail-collector.mjs: 1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0
packages/cli/test/r0-collector.test.ts: e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe
packages/cli/test/r0-live-rail.test.ts: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
packages/cli/test/support/r0-live-rail.ts: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
docs/r0-live-rail-runbook.md: 62b6fab48852b05a191f5e7470730c140d232f8b1cc5f0125e83d55e5a1d7235
```

I did not edit or execute code, invoke Claude/tmux, alter settings, or use auth/network.

## Concrete blockers

1. **Distinct event manifests are absent.** `r0-run-case.mjs` creates one manifest. Positive modes put a SessionStart event in it. The runbook configures both PreCompact and SessionStart to that manifest, so real positive PreCompact fails `hook_event_name` validation and compaction cannot reach SessionStart.

2. **Private correlation is incomplete.** The hook accepts any real event with matching name/source or trigger. It does not bind actual session, transcript, cwd, paired-event identity/order, manifest digest, or case ownership. Removing the invented token was correct, but no replacement correlation protocol was implemented.

3. **The runner remains synthetic.** It does not read Claude stdin. It invents an event, locally invokes the hook, labels the manifest `LIVE`, and writes synthetic evidence. It cannot serve as the installed hook or live collector.

4. **Stale artifacts were not cleaned.** `.r0-live/` remains an untracked worktree directory containing prior live-shaped synthetic manifests/evidence. Current tests also write new cases under repository `.r0-live` and do not remove them. These artifacts can contaminate later adjudication.

5. **No isolated settings artifact exists.** The reviewed file set contains no exact settings stanza/copy, Node/hook absolute vector, event-specific manifest selection, backup/install/readback/restore commands, or verification that Claude actually uses the isolated settings.

6. **Stdout passthrough is absent.** The hook writes the response to stdout but records no identical raw copy. The runbook instructs redirecting stdout into a raw directory, which prevents Claude from receiving the response. No reviewed tee/passthrough wrapper exists.

7. **No raw live collector exists.** `r0-rail-collector.mjs` only creates a separate STATIC manifest. It does not capture actual hook stdin/stdout/stderr/timing, host/settings, transcript, native summary, first response, event order, or unchanged state.

8. **No live adjudicator exists.** The exported `verdict` accepts five strings and nonempty stdout. It does not read retained files, recompute digests, search the sentinel, validate schema/order/case, or verify negative effects. Its CLI does not invoke the verdict.

9. **All four real paths are not represented.** Positive manual/automatic synthesize identical SessionStart events without paired PreCompact receipts. `negative-precompact` is manual-only. Negative SessionStart observes only local JSON, not suppression of the first resumed response.

10. **STATIC/LIVE separation remains false.** The runner's comment says STATIC while it emits `mode:"LIVE"` manifests and live-shaped evidence with no structural exclusion from a live verdict.

11. **Tests do not prove the claimed repair.** The mismatch-rejection test supplies no mismatch. Old tests still hard-code transcript/native-summary absence. No test covers paired manifests, real-shape event correlation, passthrough, settings restoration, collector/adjudicator files, stale artifact rejection, or four-case verdicts.

12. **Path safety remains open.** Unvalidated case names can escape `.r0-live`; existing/symlinked roots are accepted; manifest/evidence files are overwritten/followed; no lstat/UID/mode/link/create-only/readback checks occur.

## Repaired item

The custom `r0_case_token` requirement was removed, so real Claude stdin is no longer rejected solely for lacking an invented field. That repair does not close the live evidence path.

## Final decision

**FAIL — live R0 authorization CLOSED.**

Note: `context-notes/precompact-v3-r0-live-rail-skeptic-r5`.
