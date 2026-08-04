---
type: Context Note
title: Npm installation and first-use priority after PRs 204 and 205
description: >-
  Recommended next unit: durable PATH-independent npm hook installation plus
  exact ownership/reconciliation, followed by create-only safety and the literal
  npm quickstart proof.
actor: codex-npm-priority
timestamp: '2026-08-04T20:40:41.659Z'
---
# Summary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: make the npm install to durable Codex SessionStart boundary reliable under the host's real minimal environment. This serves the ultimate goal by removing a failure before the first useful interaction.

## Recommended next unit

Implement one durable hook-install compatibility unit that combines the already-planned exact hook ownership work with the newly reproduced PATH-independent runtime requirement:

- install from the durable global npm package, never a development checkout or transient npx cache;
- emit a command that starts with a GUI/minimal PATH where Homebrew is absent;
- preserve tokenized historical/current ownership, idempotent reinstall/uninstall, and foreign configuration byte-for-byte;
- exercise the literal installed command and reach session-start in a clean Codex project;
- verify no-bundle orientation appears on first session startup.

This is the smallest current unit that directly advances npm packaging, ease of installation, and ease of initial use. It should reconcile tasks/hook-compatibility-ownership and tasks/codex-sessionstart-node-path rather than creating two competing hook implementations.

## Sequence after that

1. Complete generic init create-only safety, already assigned to the Brian/Claude lane.
2. Execute the installed-package quickstart proof: install, skill/hook integration, no-bundle orientation, recipe discovery, fresh work-tracking bundle, attributed Task, visible state.
3. Implement supported-release check and cached orientation notice.
4. Close pre-live release hardening, repository protection bridge/setup, and publish the first contract-bearing prerelease.

Staged release automation merged in PR 204 and skill/MCP compatibility merged in PR 205; both are no longer blockers.
