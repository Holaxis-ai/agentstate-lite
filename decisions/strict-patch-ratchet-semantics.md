---
type: Decision
title: >-
  Strict patch enforces WHOLE-doc conformance on touch (aggressive ratchet) —
  deliberate
description: >-
  DECIDED 2026-07-19 (Mike + claude line, from the conformance-ergonomics
  analysis): doc update validates the RESULTING document against its kind and
  refuses on ANY violation — including pre-existing debt unrelated to the delta.
  This is chosen, not incidental.
actor: mike/claude
timestamp: '2026-07-19T02:56:12.272Z'
---
The alternative considered and REJECTED for now: delta-scoped strictness (refuse only violations the change introduces or worsens; pre-existing gaps warn loudly). Rationale for aggressive: opportunistic debt payment — whoever touches a doc pays down its debt — keeps bundles converging toward conformance without any sweep process, and the cost is acceptable BECAUSE remediation is delta-priced (field-level patches; and cheaper still once refusals carry a completing argv, tasks/kind-error-completing-command). The create side stays lenient (doc write warns, never refuses without --strict) so payloads are never hostages to metadata; the invariant is 'updates never leave a governed doc nonconforming', deliberately NOT 'all docs conform'.\n\nREVISIT TRIGGER: recorded evidence of sweep-style automation (multi-doc field updates) repeatedly dying on unrelated pre-existing debt — that failure shape recreates the hostage problem one level up and would justify delta-scoped strictness plus an explicit --conform opt-in for full enforcement.\n\nRelated: [[roadmap-items/conformance-ergonomics]], tasks/ratchet-semantics-decision, tasks/overwrite-ratchet-survey (the overwrite path is OUTSIDE this invariant today — that hole is under empirical survey before any change).
