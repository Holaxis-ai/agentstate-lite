---
type: Context Note
title: Npm installation and first-use priority after PRs 204 and 205
description: >-
  PR 207 merged. Next product sequence: create-only init safety then literal npm
  quickstart; non-conflicting Codex lane: supported-release check then cached
  update orientation toward pre.3.
actor: codex-npm-priority
timestamp: '2026-08-05T16:16:13.858Z'
---
# Summary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: turn the now-durable npm installation into a safe first productive workspace while advancing the first contract-bearing prerelease. This serves the ultimate goal by removing founder intervention from both first use and supported upgrades.

## Completed since the prior note

PR 207 merged at `8d0253a40bc00f9c7997e177a70b21f829769e8e`, with remediation head `68e5c91df449d4af6b6c34df77793836468166ea`. The npm-installed SessionStart launch is now PATH-independent, and hook mutation ownership is exact. The two implementation tasks remain `in_progress` only because the required exact-remediation-SHA re-review was not recorded before merge; do not silently represent that missing gate as passed.

## Recommended next product unit

Complete generic `init --create-only` target safety, then execute the literal npm quickstart proof:

- install the exact npm artifact;
- receive no-bundle orientation and recipe discovery;
- create a genuinely fresh work-tracking bundle through `init --create-only`;
- create an attributed Task; and
- observe useful live state.

The target-safety guard is already assigned to the Brian/Claude lane. The quickstart must not adopt the flag until that guard passes independent review and adversarial no-write QA.

## Recommended Codex lane while the guard proceeds

Implement `tasks/supported-release-check`: bounded, read-only, rollback-aware `aslite version --check`. It is unblocked by the completed build identity work, directly advances npm packaging/support, and is the predecessor of the cached orientation notice and first `0.1.0-pre.3` contract release. This avoids duplicating the already-assigned create-only work.

## Sequence after that

1. Brian/Claude: complete generic init create-only safety.
2. Codex: implement supported-release check, then cached orientation notice.
3. After create-only merges: execute the installed-package quickstart proof.
4. Close pre-live release hardening, repository protection bridge/setup, and publish the first contract-bearing prerelease.

Staged release automation merged in PR 204 and skill/MCP compatibility merged in PR 205; both are no longer blockers.
