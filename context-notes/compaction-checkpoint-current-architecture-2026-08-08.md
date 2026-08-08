---
type: Context Note
title: Compaction checkpoint current implementation baseline
description: >-
  Existing SessionStart-only multi-host architecture and the boundaries it does
  not yet satisfy.
actor: codex-compaction-orchestrator
timestamp: '2026-08-08T17:13:45.971Z'
---
# Summary

This note maps the existing `main` implementation before compaction-checkpoint work begins. It is
input evidence for runtime researchers and later design; it is not a selected solution.

The current product manages one startup/orientation behavior across three hosts:

- Claude Code and Codex receive structurally managed `SessionStart` command entries in their JSON
  hook configuration. Install/status/uninstall share exact ownership classification and preserve
  foreign entries.
- Codex additionally receives the existing `[features].hooks` enablement through the SDK updater.
- OpenCode receives a generated, byte-owned plugin using
  `experimental.chat.system.transform`; it runs `session-start` once per plugin `sessionID` and
  injects the result into system context.
- Durable installs bind an absolute npm-prefix Node runtime and absolute package entry. One-off
  `npx` execution cannot authorize persistent configuration.
- `session-start` performs a bounded, fail-soft board pull and then renders `home`; it does not
  synthesize or persist semantic checkpoints.

The existing architecture therefore proves safe multi-host startup installation and orientation,
not pre-loss synthesis, compaction interception, checkpoint freshness, exact restoration identity,
or subagent lifecycle coverage.

The canceled `feat/precompact-handoff-v3` branch contains substantial Claude-only checkpoint and
private-journal work, but it diverged from current `main` across a large portion of the repository.
Its artifacts should be mined for tested hazards and contracts, not cherry-picked or treated as the
portable implementation baseline.

Current official Codex documentation, fetched on 2026-08-08, advertises a materially richer hook
surface than the existing product uses: `PreCompact`, `PostCompact`, compact-triggered
`SessionStart`, `Stop`, `SubagentStop`, and `SessionEnd`, with structured identity/event payloads.
Those claims still require a version-scoped research record and deterministic probes before they
become support claims.

**Ultimate goal:** Make agent work durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Give runtime researchers a precise baseline so they distinguish new host
capability from behavior agentstate-lite already implements.

- [authoritative lifecycle task](../tasks/compaction-context-checkpoint-lifecycle.md)
- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md)
