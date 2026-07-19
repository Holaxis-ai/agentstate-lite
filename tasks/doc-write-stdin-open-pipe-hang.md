---
type: Task
title: >-
  doc write hangs forever when stdin is an open-but-silent pipe (agent-harness
  shape)
description: >-
  Discovered live 2026-07-19 (two hung processes, ps-verified, during board
  writes from a Claude Code session): doc write with no --body/--body-file falls
  back to probing piped stdin for a body; when stdin is an OPEN pipe that never
  sends data or EOF — exactly how agent harnesses and some CI runners wire
  background commands — the probe blocks FOREVER. A silent infinite hang is the
  worst AXI failure class (unpriceable in tokens; the agent just stalls).
  Foreground runs are unaffected (stdin closes instantly → 'nothing given'
  path). PROPOSED FIX (decide at build): bound the stdin probe — read with a
  short timeout when stdin is a pipe with no data yet (e.g. poll ~200ms;
  empty-so-far → 'nothing given', matching the documented empty-pipe semantics),
  never an unbounded blocking read; document that an agent passing a real piped
  body must deliver it promptly. DoD: a test spawning the CLI with an
  open-never-written pipe on stdin asserting prompt successful write (the hang
  red-proofs trivially: revert → test times out); pin the legit piped-body path
  still works. Priority: HIGH for agent ergonomics — the primary consumer hits
  this shape.
actor: mike/claude
status: todo
timestamp: '2026-07-19T02:55:13.691Z'
---
Evidence: this session's ps output showed two doc write processes sleeping 3+ minutes on the stdin probe; killing them unblocked. Workaround until fixed: append </dev/null or pass --body explicitly.
