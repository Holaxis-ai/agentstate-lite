---
type: Context Note
title: 'PR #55 exact-SHA review — 7807875'
actor: codex
timestamp: '2026-07-14T18:40:19.442Z'
---
Independent review of exact SHA 78078759451e83ad435cad2fac7413059d57748b: APPROVE, no findings.

The first review of 5494384 found that canonical and ./-prefixed target aliases bypassed the new target-plus-text identity. The amended implementation resolves the emitted href through core's shared resolveConceptId path. Empirical re-review verified concepts/b, ./concepts/b, and /concepts/b.md converge to one exact-text edge; different text to the same target remains distinct; exact repeats remain changed:false; new --link uses the same behavior. Independent focused tests passed 28/28 and git diff --check passed.
