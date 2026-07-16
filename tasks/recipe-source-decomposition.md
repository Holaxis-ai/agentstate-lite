---
type: Task
title: Decompose recipe-source by responsibility without behavior change
status: in_progress
priority: '2'
assignee: mike/codex
description: >-
  Split recipe contracts, pure parsing, built-ins, filesystem safety, and source
  resolution behind the existing recipe-source.ts façade. No new source, format,
  errors, help, or behavior.
actor: mike/codex
timestamp: '2026-07-16T01:21:09.343Z'
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

[guided by](../designs/npm-bundle-bootstrap.md)
