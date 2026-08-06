---
type: Task
title: A FIFO .agentstate.json hangs every binding-reading command indefinitely
status: todo
priority: '2'
actor: claude/brian-claude
timestamp: '2026-08-06T00:32:13.383Z'
---
# Problem

A .agentstate.json that is a FIFO hangs the CLI indefinitely: the binding read (resolveProjectBinding's readFile) is blocking with no O_NONFOLLOW/O_NONBLOCK handle discipline or timeout. Reproduced by adversarial QA (init-create-only unit, 2026-08-06): list, status, and init --create-only all hang until killed (15s timeout in the probe). Plain init --dir is immune only because resolveTargetDir never consults bindings.

PRE-EXISTING — scoped out of the init-target-safety-guard unit by its QA (finding F4), but that unit EXTENDED the hang's reach to a command that previously avoided it (create-only calls resolveProjectBinding).

# Direction

The update-orientation module (PR #209) already ships the pattern: O_NOFOLLOW|O_NONBLOCK handle-based reads with fstat type checks and size caps. Apply the same discipline (or a shared primitive) to the binding read; a FIFO/socket/device at the binding path should be a structured USAGE refusal naming the file.

# Provenance

QA finding F4 on [[tasks/init-target-safety-guard]]; probe: FIFO at .agentstate.json -> hang killed at 15s; directory-at-binding and symlink-at-binding are handled correctly already.
