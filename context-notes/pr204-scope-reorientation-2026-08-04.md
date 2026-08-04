---
type: Context Note
title: 'Scope reorientation: PR 204 versus compaction T3.5'
description: >-
  Scope audit finds the inherited compaction probe unrelated to PR 204 and
  disproportionate; builder paused before source creation.
actor: codex-pr204-scope-auditor
timestamp: '2026-08-04T18:55:00.000Z'
---
# Summary

The inherited T3.5 compaction-handoff work is paused after a user-requested scope audit. It is not a repair of PR 204.

## Evidence

- PR 204 is `feat/npm-staged-release-automation` at `c1f7937c4231087956d7a6cd881671ca7f057491`, titled “P5A: retained-artifact staged npm release automation (code-only, no live release).” GitHub reports it OPEN, non-draft, `mergeStateStatus:CLEAN`; its three reported CI jobs succeeded.
- The inherited worktree is `/private/tmp/aslite-precompact-v3.RLDTIZ/repo` on unrelated branch `feat/precompact-handoff-v3` at `36c741a8173832d75d61a7ab138b5219c4415c66`. It changes 43 files by +8,305/-105 and has no GitHub pull request.
- Existing durable C2S records explicitly say PR 204 release-receipt/exact-retained-artifact integration is intentionally excluded and should be consumed only after PR 204 lands.
- The T3.5 validation path had already reached five boundary revisions and was about to authorize a bespoke probe of up to 800 nonblank/noncomment lines. That validation mechanism had become disproportionate to the stated goal of fixing PR 204.
- The clean-room builder was interrupted before writing source. `/private/tmp/aslite-t35-h2-h5-source-r5` remains an empty 0700 directory. No probe, Node parse/check/import, tmux action, Git helper, execution admission, or feature-code mutation occurred in the builder phase.

## Diagnostic conclusion

This is both scope drift and over-engineering. The compaction feature may be independently valuable, but it cannot honestly be represented as fixing PR 204. Continuing it without a separate explicit product decision would optimize an unrelated proof system while the named pull request is already green and mergeable.

## Goals and next dependency

Ultimate goal: agentstate-lite is durable, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: re-establish the user's intended PR 204 outcome and perform only the smallest evidence-backed merge-readiness or defect-repair work needed for that pull request; this serves the ultimate goal by restoring scope discipline and shortening the path to a shippable release rail.

The T3.5 builder and parent compaction task are blocked pending an explicit decision to resume that separate feature. Recommended next action: perform a focused PR 204 review against its stated P5A acceptance boundary and current green head, then fix only concrete findings.
