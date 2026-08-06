---
type: Task
title: >-
  SIGKILL between lock mkdir and owner.json write leaves an uninspectable wedged
  lock
status: todo
priority: '2'
actor: claude/brian-claude
timestamp: '2026-08-06T00:32:13.775Z'
---
# Problem

SIGKILL during any write can leave a mutation lock at the private lock root with NO owner.json (killed between the lock directory mkdir and the metadata write). Every subsequent WRITE to that document then fails exit 1 until a human removes the lock dir; reads still work. Measured rate ~1/50 kills (QA: 1/60 create-only + 1/40 plain-init control — the control proves it is not an init-create-only regression).

This contradicts CLAUDE.md gate 3's claim that a crash leftover 'fails closed with inspectable owner metadata' — an ownerless leftover has nothing to inspect, and unlike owner-bearing leftovers (which self-reclaim correctly, 21/22 in QA), it never self-heals.

# Direction

Make the lock claim atomic with its metadata: write owner.json into a staging dir and rename the WHOLE dir as the claim, or treat a lock dir with no owner.json older than a bound as reclaimable-with-diagnostics (the metadata absence is itself the diagnostic). Preserve the fail-closed stance for owner-bearing locks.

# Provenance

QA finding F5 on [[tasks/init-target-safety-guard]] (interruption battery, 100 SIGKILL trials incl. plain-init control). Lock root: /private/tmp/agentstate-lite-mutation-locks-uid-<uid>/.
