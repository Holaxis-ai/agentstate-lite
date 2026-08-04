---
type: Context Note
title: 'Pre-compact handoff: PR 207 review changes requested'
description: >-
  PR 207 exact-head review complete at 9b6b114: two high ownership/deletion
  defects and one migration-signal gap require repair.
actor: codex-pr207-review
timestamp: '2026-08-04T23:28:42.822Z'
---
# Summary

PR 207 exact-SHA review is complete at head `9b6b114d481a9fbfd447f89e7d302156d969cb95` over base `d058d735ce4f6179ed07d74a7ddbfc38491e7980`. Verdict: **CHANGES REQUESTED**. Review worktree `/private/tmp/aslite-durable-hook.lLSKS1` remained clean; no source edits or GitHub comments were made.

The implementation's intended durable npm-prefix launcher and authority checks are strong, focused local tests passed 69/69, `git diff --check` passed, and GitHub CI passed Node 20/22/26. The review found two high-severity classifier ownership defects and one medium migration gap:

1. Newline-separated commands and bare-Node/arbitrary-basename paths can be falsely classified as owned/current and removed by uninstall.
2. Once a command is recognized, arbitrary matcher/type/timeout variants become stale/owned and can be removed, rather than remaining unmanaged.
3. Historical bare `aslite session-start` remains PATH-dependent but reports current and generates no upgrade signal; this matches the current design table, so design and implementation need a coordinated compatibility/migration distinction.

Authoritative review note: `context-notes/pr-207-exact-sha-review-9b6b114@sha256:9dba12409b2e8a05aba5ae583ebe8640b2bf690077d723b5cf128c903d802ee0`. Independent confirmation: `context-notes/pr-207-ownership-skeptic-9b6b114@sha256:51283bc91f6796603cf5797f973bc70528a925ef4c8db9440bcccb667f6227bc`. Review task closed done at `tasks/pr-207-exact-sha-review@sha256:da394135ab359fe7f07891265cfb6a0f83e16377acb003c28cfdce3808bd04d4`.

## Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: independently verify that PR 207 makes npm-installed SessionStart hooks durable without gaining mutation authority over foreign host configuration; this served the ultimate goal by identifying unsafe upgrade automation before merge. The goal is complete for head `9b6b114`.

## Next dependency

The PR branch needs a bounded repair: constrain the command grammar and historical host shapes to explicitly generated forms, add byte-preservation regressions for the counterexamples, and decide how historical bare hooks signal durable-launch convergence. A new exact-head review is required after repair. PR 204 approval remains separate and historical; compaction T3.5 remains paused/unrelated. Preserve the user's dirty main-checkout `CLAUDE.md`.

## Loaded skills

`holaxis-self-awareness`, `holaxis-cognitive-ecosystem`, `agentstate-lite`, and `holaxis-orchestrator`.
