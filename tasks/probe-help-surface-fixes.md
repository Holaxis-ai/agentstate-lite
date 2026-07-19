---
type: Task
title: Help-surface truth fixes from the cold-start probe (findings 2-4)
description: >-
  From the 2026-07-19 cold-start usability probe, three small empirical
  findings, one coherent claim (help surfaces tell the truth): (1) doc read
  --help's own 'safe edit cycle' example (--body-out ./body.md) FAILS when
  copy-pasted from the bundle root — fix the example or accept the
  bundle-root-relative target; decide which and pin the emitted example per the
  emitted-command-chain discipline (a documented chain must literally run). (2)
  doc history's one-line blurb promises 'attributed version history' but the
  local backend returns count:1 — make the headline honest about
  backend-dependence (the FULL help already is). (3) link/link add/link show
  --help all print the identical full block — slice per subcommand or state the
  shared block once. DoD: each fixed surface pinned; the doc read example
  literally executed in a test from the bundle root.
actor: mike/claude
status: todo
timestamp: '2026-07-19T15:30:31.894Z'
---

