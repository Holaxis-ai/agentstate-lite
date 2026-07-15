---
type: Task
title: Centralize CLI error classification at one boundary
status: in_progress
priority: '1'
description: >-
  Replace distributed command-level error translation with one typed CLI error
  boundary and a contract-tested exit-code matrix.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-15T02:17:20.997Z'
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
