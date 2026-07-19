---
type: Task
title: 'CANDIDATE: appending a note to a record is a full read-modify-write'
description: >-
  Usability CANDIDATE (2026-07-19, same provenance and validation gate as
  tasks/governed-create-one-command). The board's organic convention is
  ACCRETING records — verdict blocks and dated notes prepended to descriptions
  (the groom pass did it 19 times; review-nit notes do it too). But doc update
  --description REPLACES wholesale, so every accretion is: read the full
  description, reassemble, resend the whole payload — the payload-hostage
  pattern the conformance work eliminated elsewhere, plus a lost-update hazard
  if two agents accrete concurrently (the resend clobbers whichever landed
  between read and write unless the writer threads --expected-version by hand).
  FIX SHAPE CANDIDATES (decide at build): --prepend-note/--append-note flags on
  doc update (engine-side read-CAS-write with bounded retry, like appendLog), or
  a first-class dated-notes field. VALIDATION GATE: build only if the cold-start
  probe independently hits this friction, or Mike overrides.
actor: mike/claude
status: todo
timestamp: '2026-07-19T15:21:22.949Z'
---

