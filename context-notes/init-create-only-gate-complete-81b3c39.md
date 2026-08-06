---
type: Context Note
title: >-
  init --create-only gate ledger — review PASS at 81b3c39; QA final battery
  pending
actor: claude/brian-claude
timestamp: '2026-08-06T00:49:53.770Z'
---
# Summary

Gate record for [[tasks/init-target-safety-guard]] — final SHA `81b3c39` on feat/init-create-only.
Review: PASS (5 rounds). QA: PASS at a5c0838 with the final F1 battery at 81b3c39 pending.
PR opens after that battery; Brian owns the merge gate.

# Complete round ledger (find-rates for the ladder's epistemics)

- Builder e84a66e -> Review r1: pass-with-caveats — 1 MEDIUM (symlink family misrouted to raw
  exit 1), 6 LOW.
- Fix a438c5f -> Review r2: PASS, 2 new LOW (through-a-file raw error; race-loser wording).
- Fix b42a4ae -> Review r3 (delta): CONFIRMED, no findings. -> QA r1: pass-with-caveats —
  2 MEDIUM (F1 parent/child nested-pair race, the guard's own headline invariant TOCTOU-only;
  F2 recipe typo creates the bundle and wedges retry), 1 LOW (F3), 2 pre-existing filed as
  [[tasks/binding-fifo-read-hang]] and [[tasks/crash-leftover-lock-no-owner]].
- Fix a5c0838 (post-CAS bidirectional isolation verify + own-writes rollback; recipe-resolution
  hoist; mkdir symmetry) -> Review r4: pass-with-caveats — 1 MEDIUM (self-exclusion STOPPED the
  up-walk, blinding ancestors above the parent for the DEFAULT .agentstate-lite target shape;
  the impossibility argument collapsed to one direction there), 2 LOW handled as disclosure.
  -> QA delta at a5c0838: PASS upgraded — F1/F2/F3 closed empirically against built CLI and
  installed tarball; 56 fresh rounds attacking the rollback's rmdir loop, zero user-content loss,
  structural bounding argument recorded as survived (tripwire: a future recursive remove breaks it).
- Fix 81b3c39 (up-walk RESUMES past a conventional self-match; visibility assumption documented;
  conventional-shape tests both directions) -> Review r5 (delta): CONFIRMED PASS — previously
  MISSED grandparent/great-grandparent inputs now DETECTED, +5-level probe, false-positive sweep
  0/5, 30-round live battery with one clean double-yield observed.

Every review round through r4 found something real; QA found what review could not (live races,
interruption, installed tarball); review found what QA could not (the construction-level blind
spot in QA's own fix). The two-stage gate demonstrably earned its cost on this unit.

# Known accepted residuals (deliberate, recorded)

- Degenerate shape: a target at the filesystem ROOT's conventional folder (/.agentstate-lite)
  would self-match on the resumed walk and refuse a legitimate lone create. Root-only, reasoned,
  untested. If verifyCreateOnlyIsolation is ever touched again: re-add `&& enclosing !== target`
  to the final condition — it cannot mask a real conflict (the resumed walk cannot otherwise
  return the target).
- Double-yield under a tight race: both creators may roll back and exit 5 with a clean disk
  (observed 1/30) — honest failure preferred over a silent nested pair.
- Isolation-verify visibility assumes same-machine writes (local-first invariant; NFS attribute
  caching would break it) — documented in the primitive.
- Rollback bounding depends on rmdir being NON-recursive; changing it to a recursive remove
  breaks the survived-attack argument (QA 5g/5h).

# Disclosure items for the PR description (review r4 issues 2-3)

- The recipe-resolution hoist covers PLAIN init too: a recipe typo now creates nothing in either
  mode (previously: bundle created, then exit 2). Nothing pinned the old ordering.
- Error precedence: bad recipe (exit 2) now wins over unsafe target (exit 5) when both apply.

# Criterion-9 adjudication (carried from [[init-create-only-fix-a438c5f]])

Orientation surfaces deliberately keep suggesting plain `init`; reviewer r4 concurred with
reasoning ("a user at 'no bundle found' wants create-or-join; --create-only would refuse a
non-empty project root — the common case there").

[reviews](../tasks/init-target-safety-guard.md)
