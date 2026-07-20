---
type: Task
title: 'CANDIDATE: appending a note to a record is a full read-modify-write'
description: >-
  RE-OPENED 2026-07-19 with the validation the original close required. The
  revisit trigger I recorded on close ('a second line independently reporting
  accretion friction, or the convention being declared canonical') is now MET:
  sustained ledger-accretion use (the complexity-audit adjudications) hit the
  replace-only wall ~4x in one session. VERIFIED against doc update --help:
  every content field (--description/--body/--tag/--title/--type) is
  REPLACE-only; there is NO one-command append. IMPORTANT SCOPING (keeps this
  honest, not over-built): a WORKING path already exists — the body
  read-edit-update cycle (doc read --body-out -> append -> doc update
  --body-file --expected-version), CAS-safe. So an --append/--prepend affordance
  is CONVENIENCE over that path, not a missing capability -> LOW priority. AND
  the primary fix is BEHAVIORAL, not tooling: accreting ledgers belong in the
  BODY or a dedicated research/ doc, NOT in --description (a bounded
  summary/record field per CLAUDE.md). Candidate shape if built:
  --append-note/--prepend-note on doc update, engine-side read-CAS-write with
  bounded retry (the appendLog pattern, minus appendLog's dead markdown-splice
  baggage), dated-block formatting optional. Do NOT build ahead of the
  behavioral fix landing first.
actor: mike/claude
status: todo
timestamp: '2026-07-20T01:33:44.029Z'
---

