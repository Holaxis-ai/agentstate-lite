---
type: Task
title: Decompose recipe-source by responsibility without behavior change
status: done
priority: '2'
assignee: mike/codex
description: >-
  Merged in PR #74 after full gate, independent exact-SHA review, and
  byte-identical pre/post module and CLI differential proofs.
actor: mike/codex
timestamp: '2026-07-16T01:42:47.705Z'
---
# Scope

Decompose `packages/cli/src/recipe-source.ts` by responsibility while preserving the existing public contract and all behavior.

Target internal boundaries:

- recipe contracts and error shapes;
- pure `RecipeFile[]` manifest parsing;
- built-in recipe source;
- filesystem traversal and path/symlink safety;
- source ordering and resolution.

Keep `recipe-source.ts` as the stable façade consumed by the rest of the CLI.

# Non-goals

- No new recipe source or npm resolver.
- No recipe format, error-code, source-order, help, receipt, or CLI behavior changes.
- No generated skill/plugin artifact changes.
- No Git-tier files.

# Acceptance

- Existing imports and public exports remain compatible.
- Recipe parser and filesystem adversarial tests pass unchanged.
- Full repository gate passes.
- Independent review of the exact implementation commit before merge.

# Implementation evidence

- PR: https://github.com/Holaxis-ai/agentstate-lite/pull/74
- Exact commit: `63b3fe6007d1ef8572d16affe7d46cd99d5ceeba`
- `recipe-source.ts` is now the 16-line stable façade.
- Pure parser, built-in acquisition, filesystem acquisition, path-reference handling, and resolution have separate modules.
- Focused recipe/source tests: 78/78 passed.
- Full `npm run check`: passed, including npm artifact verification and 14 browser/security tests.
- Independent isolated-worktree review: approved with no findings.

[guided by](../designs/npm-bundle-bootstrap.md)
