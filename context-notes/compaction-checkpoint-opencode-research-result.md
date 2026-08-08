---
type: Context Note
title: OpenCode compaction checkpoint research result
actor: codex-checkpoint-opencode-researcher
timestamp: '2026-08-08T17:27:16.845Z'
---
# Summary

Completed the version-scoped OpenCode research matrix for the compaction-checkpoint lifecycle. The durable research artifact is `research/compaction-checkpoint-opencode-capabilities` at version `sha256:42bae79aa4e990cc6c7bb714648d487d67500ba56392aca0c8fdb4d70b793744`.

Ultimate goal: preserve durable agent context across compaction and session boundaries without relying on human reminders.

Proximate goal achieved: establish current OpenCode runtime and adapter facts against all 17 rows of `designs/compaction-checkpoint-domain-model`, so the implementation plan can classify support honestly and turn unknowns into deterministic probes.

## Result

- Full automated lifecycle: unsupported on the established evidence.
- Capture-only under strict invariant S2: unsupported. OpenCode's hidden `compaction` agent summarizes serialized transcript with tools disabled; it is not the original bearer continuing once with unwritten understanding, and the result is not an OKF-bundle checkpoint.
- Restore-only: conditionally feasible. The awaited `experimental.chat.system.transform` hook is a pre-provider injection gate with `sessionID`, but the adapter must supply exact lineage/revision selection, bounded payload/error behavior, and causal delivery receipts.
- Inspectable/manual: supported and is the strongest honest present behavior.
- Current adapter: startup/orientation injection only. It caches `session-start` output by `sessionID`, uses a 10-second helper timeout, and does not observe compaction, capture, invalidate, select a confirmed revision, or acknowledge checkpoint delivery.

## Evidence scope

- Installed OpenCode 1.2.15 on macOS 26.6 arm64, isolated help/config/path probes, exact source commit `799b2623cbb1c0f19e045d87c2c8593e83678bc0`.
- Latest stable OpenCode 1.18.15, commit `d7b115f623760e68a4749d16508a9eca350f246f`, official current docs and exact source.
- Current dev/V2 specification at `fe82a1b6ca4f535beb973b0867017e3f639f85ed`; V2 currently must be separately gated because its spec marks relevant per-turn plugin transforms missing.
- Current `agentstate-lite` adapter at repository commit `56b5693d9aa205d9d65d8513ca07642fcbf596dc`.

## Important runtime facts

Named plugin hooks run sequentially and are awaited, but have no host timeout; rejecting can fail the boundary and never resolving can block it. Plugin event-handler promises are not awaited, so `session.compacted` is an invalidation hint, not a completion barrier. Root idle/status is post-loop and does not distinguish normal completion from interruption. Child agents use distinct persistent sessions linked by `parentID`, while fork creates a new session lineage. No carrier-execution identity is exposed.

## Design handoff

Keep the runtime-neutral protocol's S2 same-bearer requirement explicit. Model OpenCode as conditional pre-loss notification plus conditional pre-request restoration, not as full checkpoint capture. The plan should include pinned deterministic probes for: post-loss injection order; resolve/reject/hang and helper failure bounds; restart/fork/sibling-child/duplicate-resume identity; event races; install preservation; privacy/payload limits; and a future V2 re-probe.

No code, branch, live host configuration, authentication state, or board sync was changed. Bundle writes were limited to the assigned Research artifact, this Context Note, and the assigned Task closure.
