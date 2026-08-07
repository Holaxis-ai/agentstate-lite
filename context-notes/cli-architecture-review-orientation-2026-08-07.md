---
type: Context Note
title: CLI architecture review orientation and current system model
description: >-
  Purpose, scope, current branch, coordination model, and unverified assumptions
  for the targeted packages/cli architecture review.
actor: codex-orchestrator
timestamp: '2026-08-07T13:59:51.416Z'
---
# Summary

Ultimate goal: agentstate-lite is a markdown knowledge bundle plus an agent-oriented CLI that makes durable knowledge human-visible, conflict-safe, local-first, and user-owned.

Proximate goal: create a specialist-vetted reusable architecture review template, apply it to packages/cli, and publish prioritized evidence-backed findings under reviews/. This serves the ultimate goal by improving the product CLI boundary without creating another authority or workflow.

Current state: the shared board is up to date; the code checkout is clean on branch feat/init-create-only tracking origin/feat/init-create-only. packages/cli contains about 87 source files and 82 test files. Existing standing gates in CLAUDE.md include build, typecheck, workspace tests, package verification, import-direction agreements, security-boundary adversarial tests, and on-demand mutation testing.

System model: packages/cli is the publishable product adapter over core, board-git, server, view-runtime, and embedded UI assets. It owns command parsing, output/error envelopes, local/remote target selection, install/hook/skill compatibility, sync UX/orchestration, local UI/MCP host adapters, package/distribution resources, and credential/invocation policy. Core must retain canonical document semantics, mutation policy, parsing, and storage abstractions; CLI should remain an adapter and policy surface rather than a second engine.

Review workflow: independent security, testing/testability, and architecture/reliability-skeptic agents propose criteria in isolation; the orchestrator synthesizes a template; all specialists vet the exact template; only then do they review packages/cli; material findings are cross-reviewed and QA-verified before publication.

Unverified assumptions: the current branch is the intended review basis; existing tests may provide broad surface coverage but coverage quality and branch depth are not yet measured; some existing bundle notes may describe prior gaps that current code has since closed; and any apparent security issue on main must be handled under the private disclosure rule rather than published to the public board.
