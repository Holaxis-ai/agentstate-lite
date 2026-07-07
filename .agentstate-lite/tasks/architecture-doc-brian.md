---
type: Task
title: >-
  Architecture doc for Brian: how lite is built + the ontology mapping + honest
  gaps
status: done
priority: '1'
description: >-
  SHIPPED 2026-07-06: docs/architecture-brief.html (rev 5, committed) — a
  STANDALONE architecture document (scope evolved from the original
  repo-markdown plan by human direction: beautiful self-contained HTML, no
  canonical comparison, no conversation anchors). Contents: design thesis
  (structure is data; the engine provides the binding moments), six principles,
  typed-document data model + anatomy figure, glossary, versioning/CAS with
  per-backend enforcement honesty, engine/seam/backends stack, conventions
  OWNERSHIP semantics (seed-then-own, expect-absent, warn-by-default), recipes +
  cookbook composition model (design intent; two-levels-only; glue = typed link
  conventions), agent/human/setup journeys with real command receipts, open
  questions led by first-class relationships. Independently reviewed by a
  delegated Sonnet agent code-first (6 findings folded: UI pause honesty, CAS
  enforcement variance, SessionStart hook, wire byte-fidelity caveat,
  single-bundle hardening, external recipe folders; verified-accurate list
  confirmed LOC/750 tests/seam parity/ui security). PROMOTED byte-identical to
  canonical AgentState workspace 'agentstate-lite' as
  docs/architecture-brief.html (doc-1afa8618a112, head_seq 1) for Brian's review
  — his borrow/translate analysis is his side's task.
timestamp: '2026-07-06T19:13:10.734Z'
---

