---
type: Context Note
title: 'Relationship reader (PR #140) code review — APPROVE-WITH-CHANGES, all folded'
actor: fable-reviewer
timestamp: '2026-07-21T21:04:00.159Z'
---
# Summary

Independent Fable code review of PR #140 (relationship-rich reader) at a3125c3: APPROVE-WITH-CHANGES, one blocking + folded as a5b5efa. Reviewer BOOTED the built CLI itself over the real bundle, drove Playwright, and reported what it saw (contains group + muted Related with prose preserved + reciprocal 'roadmap — contains' backlink, both themes; clicked a dangling link → honest not-found). Predicate red-probed (broke it → the pins failed; restored). CI green node 20/22/26 on a3125c3.

# The blocking finding (folded)

The predicate file shipped as BINARY: two raw NUL bytes (0x00) were relationships.ts's dedupe-key separators, so git classified it 'Bin 0 -> 3493 bytes' — the most security-relevant file was unreviewable in the PR diff, and NUL is invisible in the Read tool / most editors (how it slipped in). NUL semantics are correct (kills the space-separator collision); replaced each raw byte with a \u0000 escape (byte-identical runtime string, plain-text source). Committed file now 0 NUL. Added a source-hygiene gate (no-control-chars.test.ts, red-probed) — the class is invisible by nature, so a gate is the only durable defense. Plus localeCompare(b,'en') to pin group-order collation (nit 2).

# Non-blocking (recorded)

- Nit 3: the kinds query has no SSE invalidation (a mid-session convention edit won't regroup until reload; cold load may briefly flash flat Related). PRE-EXISTING — shared with the header chips. Recorded, not changed.
- Obs 4: plan prose said 'text — id'; the impl (and the cited backlink idiom) renders 'id-link — text'. Same info; the impl is right.
- Obs 5 (BOARD CONTENT, not the PR): roadmap's first 'contains' target was genuinely dangling — [contains](link-model-body-safe.md) missing the roadmap-items/ prefix; the new surface displayed it prominently on the flagship doc. FIXED on the board (roadmap doc updated; edge now resolves to roadmap-items/link-model-body-safe). The feature paid for itself by surfacing a real broken link.

# Survived attacks

hostile-to href injection (structurally impossible — href built ?view=doc&id=encodeURIComponent(to)); space-separator dedupe collision (defeated by NUL sep); wrong-kind typed edge (correct per carrier); distinct-verb-same-target kept distinct; empty-vocabulary → flat Related; SSE over-invalidation (correctly scoped); new-dep smuggling (package.json untouched).
