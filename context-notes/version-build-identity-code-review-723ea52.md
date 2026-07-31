---
type: Context Note
title: 'Independent code review: executable-entry authority 723ea52 — approved'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T22:23:00.470Z'
---
# Summary

Independent review approves exact SHA `723ea5234b0677a55e81e8f68d83628cf2390694` with 0 blockers, 0 majors, and 0 minors. The actual source entry is now explicitly registered before command execution, and both source and packaged paths passed focused verification. Dedicated adversarial QA is the next required gate.

## Verdict

APPROVED for exact SHA `723ea5234b0677a55e81e8f68d83628cf2390694`.

Severity count: 0 blockers, 0 majors, 0 minors. No code edits were made during review.

This review covers the cumulative I1 implementation and the focused repair from `677b507` to `723ea52`. Dedicated adversarial QA must rerun after this approval; broad QA was deliberately not substituted for the independent Review gate.

## Previously rejected behavior is closed

The earlier QA rejection showed that a real source invocation identified and hashed `src/invocation.ts` rather than the launched `src/index.ts`.

At `723ea52`:

- `packages/cli/src/index.ts` registers `fileURLToPath(import.meta.url)` before calling `main`.
- `packages/cli/src/invocation.ts` makes that registered, canonical realpath the highest-authority executable entry. Re-registering the same path is idempotent; registering a different valid path fails closed. The prior helper-module and argv mechanisms remain fallbacks only when production ent
