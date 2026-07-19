---
type: Task
title: Kind-conformance refusals emit a ready-to-run completing command
description: >-
  TIER-1 (100% confident) child of roadmap-items/conformance-ergonomics. CLAIMED
  2026-07-19 (mike/claude line, Sonnet builder). When doc update (or doc write
  --strict) refuses on kind violations, the envelope's help today points at the
  registry (kinds). Change: the help carries a LITERAL completing argv for the
  failing doc — one doc update command naming every missing required field as a
  flag with a placeholder value. Enum fields include the allowed values in the
  placeholder. CLI-side only (mutate.ts adapter owns error wording per gate 3);
  core's typed failure already carries the violation list. DoD: a test that
  EXECUTES the emitted string (placeholder filled) against the failing doc and
  asserts convergence to conformance — the CLAUDE.md emitted-command-chain
  discipline; plus a pin that non-kind USAGE errors are untouched.
actor: mike/claude
status: in_progress
timestamp: '2026-07-19T02:54:58.977Z'
---

