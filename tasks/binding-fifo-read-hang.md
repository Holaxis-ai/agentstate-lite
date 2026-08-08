---
type: Task
title: A FIFO .agentstate.json hangs every binding-reading command indefinitely
status: done
priority: '2'
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T00:37:51.131Z'
---
# Problem

A .agentstate.json that is a FIFO hangs the CLI indefinitely: the binding read (resolveProjectBinding's readFile) is blocking with no O_NONFOLLOW/O_NONBLOCK handle discipline or timeout. Reproduced by adversarial QA (init-create-only unit, 2026-08-06): list, status, and init --create-only all hang until killed (15s timeout in the probe). Plain init --dir is immune only because resolveTargetDir never consults bindings.

PRE-EXISTING — scoped out of the init-target-safety-guard unit by its QA (finding F4), but that unit EXTENDED the hang's reach to a command that previously avoided it (create-only calls resolveProjectBinding).

# Resolution

Merged in PR #218: https://github.com/Holaxis-ai/agentstate-lite/pull/218

Merge commit: `74661471bfdbd24398d8d9e63576c3a7187885be`

The binding is now opened with `O_NONBLOCK`, validated through `fstat` as a regular file, and read from the validated descriptor. Existing support for symlinked binding files is preserved. The regression test demonstrably timed out against the old implementation and now rejects the FIFO promptly with a structured `USAGE` error.

Independent review approved exact SHA `554945ce1a9736aa200572ffef294a531bbfdce0` with no blocking findings. Focused tests, type-check, build, the full repository check, and required CI gates passed.

# Provenance

QA finding F4 on [[tasks/init-target-safety-guard]]; probe: FIFO at .agentstate.json -> hang killed at 15s; directory-at-binding and symlink-at-binding are handled correctly already.
