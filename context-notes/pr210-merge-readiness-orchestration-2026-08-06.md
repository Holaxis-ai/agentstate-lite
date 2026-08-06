---
type: Context Note
title: PR 210 merge-readiness orchestration start
description: >-
  Bounded two-blocker repair pipeline with reproduced red baseline from 4e394db
  through review, QA, and CI; stop before merge.
tags:
  - pr210
  - orchestration
  - hook-ownership
actor: codex-pr210-orchestrator
timestamp: '2026-08-06T18:55:07.962Z'
---
# Summary

PR #210 merge-readiness orchestration started from exact changes-requested head `4e394db65346d957676e590d7ca287d20b39dafb` on branch `fix/pr207-hook-ownership-housekeeping`.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: close the two exact PR #210 blockers and carry one repaired SHA through independent review, adversarial QA, and repository/CI gates. This serves the ultimate goal by making the hook ownership boundary provably fail-closed without reopening previously rejected generic fallbacks.

## Repair contract

1. Reject noncanonical npm runtime/package path tokens, including dot segments and duplicate separators, before granting ownership. Add pure classification and freshly built Claude/Codex/OpenCode lifecycle tests proving byte-identical preservation.
2. Reconcile the supported local-dev installed-tarball authority with the writer/recognizer contract without restoring the unsafe generic npm fallback. Restore the complete installed-package proof and Node 22/26 repository gates.

The public review record is https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208268039.

## Pipeline and boundaries

Backbone: bounded sequential pipeline with Generator-Critic gates.

1. Independent implementation-plan and skeptic passes.
2. Fresh builder in isolated worktree `/private/tmp/aslite-pr210-repair.miXzoW/repo`.
3. Fresh exact-SHA reviewer; any blocker returns to a bounded repair loop.
4. Fresh adversarial QA only after review PASS.
5. Exact repository gate plus GitHub Node 20/22/26 checks.
6. Record merge-ready SHA and evidence; stop before merge.

Do not modify or merge `main`, broaden scope into unrelated hook design, weaken foreign-state preservation, or treat a focused green suite as a substitute for the installed-package and repository gates.

## Reproduced diagnostic baseline

In the isolated clean worktree, `npm ci` and the prerequisite `npm run build` pass. The subsequent `npm run verify:npm-package` fails at the installed package's `aslite hook install --scope project --json`, reproducing blocker 2 independently of CI.

An ad-hoc source probe at the same SHA proves that same-prefix npm pairs containing `/./`, `//`, or `/a/../` all classify as `current`. The independent skeptic found the same normalization-before-proof flaw in direct npm/local-dev/marketplace executable recognition and in Node launches for local-dev/marketplace entries. The repair invariant is therefore one bounded shared rule: every absolute runtime or executable token admitted as generated must already be in canonical lexical path form. This is a string-provenance check, not filesystem existence or `realpath` resolution; symlink policy remains unchanged. Any legitimate historical noncanonical spelling must be explicitly proven as writer output rather than accepted through normalization.

The local installed-tarball repair must preserve ordinary repository local-dev launches while using stable same-prefix npm evidence when a local-dev artifact is physically installed into the supported npm-global layout. It must not add a generic cross-prefix npm exception to the command recognizer.

[tracks](../tasks/hook-compatibility-ownership.md)
