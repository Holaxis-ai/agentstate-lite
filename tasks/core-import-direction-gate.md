---
type: Task
title: Enforce core production import direction
status: in_progress
priority: '3'
description: >-
  Add one production-only AST import gate for core's bottom-layer contract; no
  production refactor and no change to server-backed test fixtures.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T15:19:21.368Z'
---
# Objective

Make core's bottom-layer production dependency direction executable with one focused source-level
test, without changing production code or expanding the rule to test fixtures.

# Scope

- AST-walk only `packages/core/src` production modules.
- Allow Node builtins, relative modules resolving inside `core/src`, and exactly core's intentional
  declared runtime dependencies.
- Reject workspace imports, relative escapes, import-equals, non-literal dynamic imports, and
  `require`/`createRequire` channels.
- Pin peer/optional dependency posture so a new production dependency changes the executable
  contract in the same reviewed unit.

# Non-goals

- No restrictions on `packages/core/test` or its server devDependency.
- No reusable repository architecture framework, madge/jscpd gate, cycle metric, complexity gate,
  or production refactor.

# Proof

- Current core production source passes.
- Synthetic cases fail for a type-only upward workspace import, a relative escape, and a
  non-literal dynamic import; normal internal imports and both declared external dependencies pass.
- Core tests/typecheck and the repository gate remain green.

# Review tier

Low-risk test-only invariant contract. Author validation plus relevant automated checks is
sufficient unless implementation expands package policy or extracts shared machinery.

# Evidence

[Finding](../findings/core-import-direction-gate-investigation.md)

[Synthesis](../findings/architectural-smell-investigation-synthesis.md)
