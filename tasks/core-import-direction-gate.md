---
type: Task
title: Enforce core production import direction
status: done
priority: '3'
description: >-
  Add one production-only AST import gate for core's bottom-layer contract; no
  production refactor and no change to server-backed test fixtures.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T15:32:05.794Z'
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

# Outcome

Shipped in [PR #228](https://github.com/Holaxis-ai/agentstate-lite/pull/228), merge commit
`56b5693d9aa205d9d65d8513ca07642fcbf596dc`. The added production-only TypeScript-AST gate pins
core's allowed source imports and manifest dependency posture. Its adversarial fixture covers
workspace imports, relative escapes, non-literal dynamic imports, import-equals, `require`, and
`createRequire`. No production code or runtime behavior changed.

Author validation passed: focused gate 3/3, core suite 412/412, core typecheck, local repository
gate, and exact-SHA GitHub gates on Node 20, 22, and 26 plus the release-policy audit.

# Evidence

[Finding](../findings/core-import-direction-gate-investigation.md)

[Synthesis](../findings/architectural-smell-investigation-synthesis.md)
