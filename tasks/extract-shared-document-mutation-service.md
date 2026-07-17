---
type: Task
title: Extract the shared document mutation service below the CLI
status: in_progress
priority: '2'
description: >-
  PR #85 extracts the shared document mutation service below the CLI with no
  intended behavior change. Fable's review nits were addressed: ownership
  comments now match core, strict-kind CLI error translation has one source, and
  the timestamp-mutating helper is named explicitly. Full repository gate
  passed; independent exact-SHA review approved
  95d063e86e542e6f0e50ba8c33d992e06b633d30 with no findings. Awaiting merge.
actor: mike/codex
timestamp: '2026-07-17T03:03:39.126Z'
---
# Behavioral claim

Existing CLI document mutations delegate to one CLI-neutral service below the command layer, with no user-visible behavior change. The extraction creates the reusable execution boundary required by future trusted UI actions without granting Pages any mutation capability.

# Scope

- Consume the completed mutation-boundary audit before fixing the destination API.
- Extract create-only, overwrite, and patch document mutation policy from the CLI-specific module.
- Preserve fresh-read/decision/CAS coupling, hard-CAS behavior, bounded retry, no-op detection, timestamp-before-kind-validation ordering, actor propagation, typed conflicts, and final-version receipts.
- Keep CLI parsing, help, `CliError`, exit codes, remote hints, and rendering in the CLI adapter.
- Switch all current CLI document-mutation callers to the shared service.
- Delete the superseded implementation rather than retaining parallel paths.

# Verification

- Existing CLI mutation tests pass without weakened assertions.
- Add focused core/service tests for create races, stale hard CAS, benign retry, semantic no-op, kind rejection, actor propagation, and final receipts.
- Run the repository build, typecheck, tests, and installed-package verification appropriate to the package boundary.
- Independently review the exact SHA; treat any changed mutation semantics as a blocker rather than part of the refactor.

# Non-goals

- No Page bridge mutation messages.
- No browser confirmation UI.
- No new HTTP endpoint.
- No delete, link, reserved-file, or remote-product behavior change.
- No forced migration of domain operations that correctly compose `versionedMutation` directly.

[depends on](mutation-boundary-audit.md)

[design](../designs/trusted-page-actions-and-shared-mutation-boundary.md)
