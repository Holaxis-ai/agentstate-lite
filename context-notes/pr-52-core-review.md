---
type: Context Note
title: 'PR #52 core parser review'
actor: codex-core-reviewer
timestamp: '2026-07-13T17:11:50.862Z'
---
# Summary

status: complete
verdict: fail
issues:
  - severity: high
    locations:
      - packages/core/src/kinds.ts:661
      - packages/core/src/kinds.ts:672
      - packages/core/src/kinds.ts:738
      - packages/cli/src/commands/new.ts:468
    title: Prototype-chain properties satisfy required fields and enum validation
    evidence: >-
      Empirical at exact head: parsing a convention with required fields `toString` and
      `constructor`, then validating an instance whose frontmatter is only `{type:
      "Adversarial"}`, returns zero warnings. An enum on `toString` whose allowed value is
      `String(Object.prototype.toString)` also validates the missing field with zero warnings.
      The new parser/help tests establish own-key handling for declarations, but never carry
      those names through `validateAgainstKind`. `isTerminal` has the same inherited lookup,
      and `new` assigns `__proto__` through the legacy setter instead of defining an own key.
    impact: >-
      Strict mutation paths can persist instances that do not own a convention-required field;
      adversarial enum declarations can accept inherited JavaScript values, and terminal
      classification can consume inherited state. This violates the PR's own-key and
      prototype-chain-safety invariants and means the passing adversarial tests do not prove the
      claimed end-to-end boundary.
  - severity: medium
    locations:
      - packages/core/src/kinds.ts:375
      - packages/core/src/kinds.ts:769
    title: Valid value-description text is trimmed during parse and serialization
    evidence: >-
      Empirical at exact head: the valid description `"  first line\n    indented
      detail\nlast line  \n"` becomes `"first line\n    indented detail\nlast line"`
      after `parseConventionDoc`, and `kindConventionDoc` preserves only that lossy form. The
      parser test at packages/core/test/kinds.test.ts:324 explicitly expects this mutation.
    impact: >-
      Registry discovery and the canonical programmatic recipe/serializer path do not round-trip
      valid metadata exactly. This contradicts the stated invariant that whitespace normalization
      is help-only; `renderKindHelp` already has a separate one-line normalization boundary.
suggestions:
  - >-
    Centralize own-value lookup for instance frontmatter: missing own keys must be absent for
    required, enum, terminal, and related derivations. Define dynamic frontmatter keys with a
    prototype-safe helper (or a null-prototype record), especially for `__proto__`. Add raw-YAML
    plus strict-CLI regression tests for `toString`, `constructor`, and `__proto__`, covering both
    missing and explicitly supplied fields.
  - >-
    Use `trim()` only to test whether a description is empty; retain the original non-empty string
    in `KindConvention` and `kindConventionDoc`. Keep whitespace collapsing solely in help
    rendering, and add a YAML/stringify/load recipe round-trip test with multiline and
    leading/trailing whitespace.
confidence: high
notes:
  - Exact identities verified: head `6e4c7bf07b6f918aae4cae48c585d71782ad98b8`; `origin/main` and merge-base `c92497ae9d9761752a34f9dad9966666f73b5d93`.
  - `git diff --check origin/main...HEAD` passed.
  - The user reported isolated `npm run build` passing after dependency repair; no result from the superseded symlink setup was used.
  - Root `npm run typecheck` passed.
  - Focused suites passed: core kinds 44/44; CLI kinds/help 37/37; recipes 36/36; CLI UI/listener 25/25; UI bridge 34/34.
  - `npm run test:scripts` passed 17/17, including the packed-core external proof; `npm run check:skill -w agentstate-lite` passed.
  - The full `npm run check` was not rerun; review used focused tests as authorized. The confirmed behavioral failures are outside the committed positive-path assertions.
  - The repaired build left `plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs` dirty outside the PR diff; it was excluded from evidence and not reverted.
