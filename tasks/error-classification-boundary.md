---
type: Task
title: Centralize CLI error classification at one boundary
status: done
priority: '1'
description: >-
  DONE — merged as PR #61 (2026-07-15). One typed boundary (classifyBundleError;
  toExit/asHandled delegate); core InvalidInputError; USAGE never a fallback
  (plain errors + fs errnos -> RUNTIME/1; escaped VersionConflict ->
  STALE_HEAD/5). Three review rounds: internal cold review (promote source-read
  fallback fixed), external review on the PR (P1: status-blind
  unknown-RemoteError fallback — 429 RATE_LIMITED landed USAGE/2; fixed
  status-aware: 429->TRANSIENT retryable, unknown 5xx->RUNTIME, unknown
  4xx->USAGE as the explicit adjudicated rule agreeing with the wire client's
  own fallback; proven PRE-EXISTING on main, not a branch regression). 32-test
  boundary contract suite + 11 fake-wire probes through real commands.
  Follow-ups filed: tasks/wire-error-classification (same class at server/worker
  boundary), edge-polish items 13-14, tasks/ui-e2e-session-rotation-flake (gate
  flake, evidence recorded).
actor: brian
assignee: brian-claude
timestamp: '2026-07-15T15:55:35.594Z'
---
# Goal

Make the CLI error taxonomy an executable invariant owned by one boundary, so individual command call sites cannot accidentally turn storage, transport, or programming failures into user-input errors.

# Architectural contract

- Core and storage layers throw typed errors without rendering CLI envelopes.
- Remote failures retain their typed remote code and status.
- Domain commands throw typed domain errors for expected conditions such as not found, conflict, or invalid input.
- One CLI boundary maps typed failures to public error envelopes and exit codes.
- Command-level catches may add context or translate an expected domain condition, but must not classify arbitrary plain errors as USAGE.

# Required error matrix

- Invalid input -> USAGE, exit 2.
- Missing document -> NOT_FOUND, exit 6.
- CAS conflict -> STALE_HEAD or the documented conflict code, exit 5.
- Authentication failure -> AUTH_REQUIRED, exit 4.
- Remote 5xx -> RUNTIME, exit 1.
- Local I/O failures such as ENOSPC, EACCES, and unexpected backend errors -> RUNTIME, exit 1.

# Scope

1. Inventory every classifyBundleError call site and group it by the condition it is translating.
2. Establish the single normalization boundary, preserving typed context needed for actionable help.
3. Remove redundant command-level catch-and-reclassify blocks.
4. Keep existing documented public codes stable unless an existing mapping is demonstrably wrong.
5. Add one table-driven contract suite for the public error matrix plus command-level regression probes for sensitive paths.

# Acceptance criteria

- There is one authoritative mapping from typed failures to CLI envelopes and exit codes.
- A deterministic link-add write failure proves ENOSPC remains RUNTIME rather than USAGE.
- Remote AUTH_REQUIRED, FORBIDDEN, NOT_FOUND, LAST_ADMIN, VERSION_MISSING, and 5xx behavior remain pinned.
- No command catches an arbitrary plain Error and silently maps it to USAGE.
- Existing output and exit-code contracts remain green except for explicitly corrected misclassifications.
- npm run check passes from the repository root.

# Delivery discipline

Ship as one focused behavioral PR. Treat any repeated classification exception discovered during the work as evidence that the typed error model is missing a domain error, rather than adding another call-site special case.

- Fix round (review finding, minor): promote source-read fallback USAGE -> boundary
  (EISDIR/EACCES now RUNTIME/1, empirically verified vs main; missing-source USAGE
  naming the file KEPT — the review-ratified call-site design); probe added; suite 26
  tests; final sha 0b0a4a9.
