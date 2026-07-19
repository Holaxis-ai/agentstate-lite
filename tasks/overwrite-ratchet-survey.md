---
type: Task
title: 'Overwrite hole in the conformance ratchet: empirical survey before any change'
description: >-
  DONE 2026-07-19 — both halves delivered, verdict: GREEN LIGHT with evidence.
  SURVEY (grep-verified map): exactly TWO paths can overwrite an existing doc —
  doc write (the one mutateDocument mode:overwrite consumer, lenient) and
  promote with an explicit --expected-version CAS token (direct
  writeDocVersioned, lenient by default, --strict opt-in); everything else is
  patch-mode (strict already: doc update, kind field, trusted View actions),
  expect-absent create-only (new, recipes), or git-level (sync). PROBE
  (empirical): implemented the monotone rule in a scratch worktree at 6f00144 —
  overwrite refuses iff !strict AND the existing doc conforms to its kind AND
  the candidate violates ITS OWN (possibly retyped) kind — and ran the FULL
  suite: 1494 pass, ONE fails, and that one is doc.test.ts 'doc write over an
  existing doc WARNS about dropped frontmatter fields' — the exact contract the
  rule is DESIGNED to upgrade (dropping a REQUIRED field from a conforming Task:
  warn becomes refuse; dropping an OPTIONAL field still only warns since
  conformance survives). No recipe, sync, promote, board-attribution,
  kind-command, or e2e flow regressed. Retype edge: zero flows retype
  (consistent with the no-model-retyping convention); governed-to-ungoverned
  retype remains a visible escape by design. IMPLEMENTATION is the separate
  decided follow-up tasks/overwrite-monotone-ratchet — sequence AFTER
  tasks/kind-error-completing-command merges (the refusal should arrive already
  carrying the completing argv) and rewrite that one test as the new contract's
  pin.
actor: mike/claude
status: done
timestamp: '2026-07-19T02:59:55.433Z'
---

