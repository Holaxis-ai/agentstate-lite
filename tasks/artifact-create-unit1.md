---
type: Task
title: >-
  Ship Unit 1 of the Artifact runtime — the 'artifact create' command (type:
  Artifact product kind)
status: done
priority: '2'
assignee: mike/claude
description: >-
  Shipped via PR #150 (commit 482ff0a, merged as 79f2dbc on 2026-07-21): the
  'artifact create' command + type:Artifact product kind — one command owns
  derive-id → promote → record; --supersedes flips + links;
  convention-independent. Independent fable review returned APPROVE on the fix
  (all four partial-failure findings resolved, adversarial pass survived);
  repository gate + CI green. Unit 2 (sandboxed ?view=artifact viewer) HELD
  pending the codex-lane decision.
actor: mike/claude
timestamp: '2026-07-22T03:57:11.303Z'
---
Unit 1 of designs/artifact-runtime: the `type: Artifact` product kind + the `artifact create`
command — the low-risk half (the command that owns the produced-output sequence). Unit 2 (the
sandboxed `?view=artifact` viewer + an Outputs section on the launcher) is HELD pending a decision on
whether it belongs to this lane or codex's.

## What shipped (PR #150, commit 482ff0a, merged as 79f2dbc, 2026-07-21)

`artifact create <file> --title <t>` owns the whole sequence: derive a collision-safe id → promote
the bytes to `artifacts/<id>.html` (version captured in-process — no hash for the agent to copy) →
create-only the `type: Artifact` record (`entry`, `entry_version`, `status: active`). It works
whether or not a bundle declares an Artifact convention (product kind, convention-independent).
`--supersedes <id>` flips the prior artifact to `superseded` and links this one `supersedes` it.

## Review round (fable) — CHANGES-REQUIRED then APPROVE on the fix

The first review found the unit's own partial-failure contract empirically false. The fix (482ff0a)
made it true and was re-reviewed APPROVE:

- F1: a record-create failure now NAMES the orphaned blob (the old wrapper was dead code — mutateDoc
  always throws a CliError, which it rethrew untouched); the catch now preserves the error's code
  and appends the orphan context plus a `delete --doc-key` recovery.
- F2: the collision-safe id considers existing blob keys, not just record ids, so a re-run after an
  orphaned blob picks a fresh id instead of bricking on the stray blob's expect-absent conflict; the
  false "re-run to adopt" advice is gone (adoption was never implemented).
- F3/F5: `--supersedes` is validated UPFRONT (must be an existing `artifacts/` Artifact), so a
  cross-dir or non-Artifact target is rejected before any write rather than writing a dangling edge
  or flipping a non-Artifact.
- F4: the success receipt no longer advertises the `?view=artifact` route (the in-shell viewer ships
  in Unit 2); help offers the byte-pull workaround instead.

Adversarial QA survived: path traversal (`artifacts/../docs/fake`), bare-blob supersede targets,
concurrent same-title double-create (loser writes nothing — no orphan, no clobber), and
strict-rejection-plus-supersedes ordering. Gates green: 1142 cli tests, typecheck 0, check:skill 0,
repository CI green on 482ff0a.

## Known non-blocking follow-up

The upfront `--supersedes` validation swallows ALL `readDoc` errors into "does not exist" — on a
`--remote` bundle a transport failure (5xx/timeout) would misreport as a nonexistent target (exit 2,
though no write occurs). Low severity; a proper fix needs backend-specific not-found detection (a
local ENOENT is context-free and classifies to RUNTIME, indistinguishable from other fs errors), so
it is deferred rather than forced into this unit.
