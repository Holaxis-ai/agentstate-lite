---
type: Context Note
title: CLI architecture review empirical evidence
actor: codex-orchestrator
timestamp: '2026-08-07T14:44:16.390Z'
---
# Summary

Bounded empirical validation completed against the detached exact-SHA worktree `/private/tmp/aslite-cli-architecture-review.MPYvr9` at clean revision `81b3c39ff252013e318b1a714b63430a24074d70`. The main worktree remained on the same revision and no product source or tests were changed.

# Gate evidence

- The first sandboxed `npm run check` attempt failed because every loopback bind was denied with `EPERM`. This was classified as an environmental constraint, not a product failure.
- The identical full `npm run check` gate was rerun with loopback permission and exited 0. This covers build, typecheck, workspace tests, scripts tests, installed-tarball verification, skill drift checks, MCP browser tests, and UI end-to-end tests defined by the repository gate.
- The exact local-dev artifact remained `packages/cli/dist/agentstate-lite.mjs`, 4,559,755 bytes, SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583`.

# Coverage and test relevance evidence

Node test coverage over `packages/cli/src/**/*.ts` executed 1,299 tests with 0 failures in 41.9 seconds. Aggregate coverage was 95.49% lines, 87.76% branches, and 90.50% functions. These percentages are a map, not an assurance score.

Material lower-branch or lower-function areas named for review were:

- `commands/view.ts`: 82.14% lines, 27.27% branches, 66.67% functions.
- `commands/ui.ts`: 81.54% lines, 59.52% branches, 33.33% functions.
- `cli.ts`: 78.23% lines, 66.67% branches, 53.85% functions.
- `commands/mcp.ts`: 96.23% lines, 65.00% branches, 50.00% functions.
- `commands/bundle.ts`: 90.41% lines, 66.67% branches, 50.00% functions.
- `commands/serve.ts`: 96.13% lines, 70.83% branches, 60.00% functions.
- `update-orientation.ts`: 90.30% lines and 72.12% branches.

High-risk shared CLI authorities were materially stronger: `errors.ts`, `mutate.ts`, and `output.ts` reached 100% lines; `bundle.ts` reached 97% lines and 91.95% branches; `commands/link.ts` reached 96% lines and 94.79% branches; `commands/new.ts` reached 98% lines and 96.70% branches; and `commands/status.ts` reached 99% lines and 96.75% branches.

# Targeted runtime probes

- Command arity: the exact built artifact accepted `init unexpected --dir <fresh-temp-dir> --recipe none`, exited 0, and created `index.md`. This is E2 reproduction of silently ignored positional input before a mutating operation. The temporary bundle was removed after inspection.
- Signal lifecycle: the exact built `serve` command was started on loopback over a temporary bundle, reached its listening receipt, received SIGTERM, exited 0 without a signal code or stderr, and released the port for immediate rebinding. This refutes a present failure on the tested serve/Darwin/Node 25 path while leaving the untested `ui` and cross-platform boundary gap.
- `ui --open`: a source-level harness with an unavailable opener did not reproduce the predicted fatal exit, while an isolated direct Node `spawn` control did emit the expected unhandled ENOENT. The discrepancy is unresolved, so the static candidate remains E1 and must not be represented as empirically proven.

# Static architecture evidence and correction

A temporary TypeScript-AST inventory found 86 source files, 372 local import edges, central fan-in at `errors.ts`, `invocation.ts`, `output.ts`, `args.ts`, and `bundle.ts`, and several large decision-heavy modules. Its first cycle report included type-only imports and therefore over-counted runtime cycles. The corrected specialist analysis excluded type-only edges and found no runtime strongly connected component. File size and fan-in were treated as review signals only; neither became a finding without a causal failure trace.

# Dependency advisory limitation

A live `npm audit` query could not be performed because transmitting the repository dependency graph to the external advisory service was not authorized by the execution policy. No workaround was attempted. `npm audit --offline --json` exited 0 and reported zero cached vulnerabilities across 495 dependencies, but cache freshness is unknown; this is an explicit assessment gap, not evidence of current absence.

# Assessment impact

The full gate and current coverage support a strong-test-foundation conclusion. The arity finding is elevated to E2/high confidence. The serve signal candidate is narrowed rather than removed. The lack of a recurring branch map remains a low-priority feedback-infrastructure gap even though this review produced a one-time map. Current external dependency advisory status remains not assessed.

[tracks review](../tasks/cli-architecture-review.md)

[uses template](../reviews/architecture-review-template.md)
