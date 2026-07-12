---
type: Task
title: >-
  Skill resolver: cross-host CLI version selection (sort -V shadows by host
  prefix, not version)
status: todo
priority: '3'
description: >-
  From the cross-host resolver PR review (Finding 2, LOW). The generated skill
  resolver picks the CLI via 'ls -d <host globs> | sort -V | tail -1', which
  sorts WHOLE paths — so the host/prefix dominates the version, not the version
  itself. On a machine with installs under more than one host (~/.claude AND
  ~/.codex) or more than one install kind (direct ~/.<host>/skills/ vs
  marketplace ~/.<host>/plugins/cache/), the lexically-later path wins
  regardless of version: '.codex' > '.claude' and 'skills/' > 'plugins/'.
  Reviewer demo: Claude cache 1.0.40 + Codex cache 1.0.36 resolves the STALE
  Codex 1.0.36; a dual-host user on a freshly-updated Claude would run the older
  Codex CLI. Impact: stale-but-working CLI, not breakage (why this is LOW;
  within-host direct-beats-cache shadowing is pre-existing). FIX NEEDS A
  PRECEDENCE DECISION FIRST: when a machine has several installs, which wins —
  the current host, the globally-highest version, or PATH-then-newest? Direct
  installs have no version segment while cache installs do, so it's
  apples-to-oranges. Then implement version-correct selection (extract the
  version segment before sorting) or codify the chosen rule in the resolver. The
  'command -v' PATH probe stays the first short-circuit. The PR only softened
  the now-false 'highest version' prose; this task owns the actual selection
  logic.
actor: mike/claude
timestamp: '2026-07-12T17:33:39.642Z'
---

