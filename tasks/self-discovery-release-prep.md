---
type: Task
title: Prepare the self-discovery proof prerelease
status: todo
priority: '1'
description: Execute R6B source PR for the first contract release's real successor.
actor: openai/codex
timestamp: '2026-07-31T21:26:28.613Z'
---
# Goal

Prepare the subsequent compatible prerelease that gives the first contract-bearing release a real successor to discover. This is R6B.

# Acceptance

- Version/lockfile/release notes advance under the same contract with no unrelated behavior.
- Full source/package gates and exact candidate dry-run pass.

# Gate

Builder → independent exact-SHA contract Review → exact-candidate dry-run QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](bootstrap-pre2-upgrade-proof.md)
