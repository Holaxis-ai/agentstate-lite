---
type: Context Note
title: init --create-only fix round at a438c5f — re-review dispatched
actor: claude/brian-claude
timestamp: '2026-08-05T23:55:44.483Z'
---
# Summary

Review-fix round for [[tasks/init-target-safety-guard]] pushed as commit `a438c5f` (parent
`e84a66e`, the reviewed SHA). Re-review dispatched to the same reviewer (context intact);
adversarial QA remains queued behind it. See [[init-create-only-builder-e84a66e]] for the
builder round.

# Review round 1 outcome (at e84a66e)

pass-with-caveats, high confidence. Safety held under all reviewer attacks (8-way true-parallel
race x5 rounds: exactly one winner each; byte-preservation audited via SHA-256+mode across all
five refusal classes). Findings: 1 MEDIUM (stat-following exists() let dangling/looping symlink
targets skip inspection -> raw exit-1 instead of the contracted exit-5), 6 LOW (unreachable CAS
mapping, preflight TOCTOU coverage, dead branch, message precision, tarball-probe overclaim,
criterion-9 orientation adjudication).

# Fix round (a438c5f)

- lstat-based presence + inspect-before-realpath: whole symlink family now exits 5 with recovery
  help; uninspectable paths are structured RUNTIME with the same help.
- initBundleImpl seam + test pinning the VersionConflict -> ALREADY_EXISTS mapping.
- New claimCreateOnlyTarget primitive (mkdir-first claim + re-verify) closes the
  preflight-to-write window deterministically; concurrent-content and symlink-swap tests;
  residual window documented (index.md identity stays CAS-guaranteed).
- Dead branch removed; nest-vs-workspace wording from actual containment; workspace-at-target
  refused by name; tarball probe asserts exit 5; physical-root receipt documented in INIT_USAGE.

# Adjudication (criterion 9)

"No-bundle orientation carries the exact spelling" is deliberately NOT satisfied by pointing
orientation surfaces at --create-only: plain `init` remains the correct suggestion when a user
is joining/creating a project workspace (open-or-create semantics). --create-only is the
onboarding-facade path; the downstream `aslite guide` task wires it. Recorded here rather than
silently passed; reviewer may dissent in re-review.

# Gate state

init suites + hint/help/local-only 23/23; check:skill clean; full `npm run check` exit 0.
Flake watch: across this unit's three full-gate runs, TIMING-sensitive multi-process tests
flaked once each under full parallel load (filesystem-lock round 1; two session-start budget
tests round 2), all passing in isolation and on rerun. If this recurs in other units, file a
dedicated board task for load-sensitive test budgets.

[builds](../tasks/init-target-safety-guard.md)
