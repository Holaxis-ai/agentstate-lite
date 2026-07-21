---
type: Context Note
title: >-
  PR #137 Fable review record — APPROVE after one fix round (truth table
  hardened)
actor: fable-reviewer
timestamp: '2026-07-21T17:18:33.779Z'
---
# Summary

Independent Fable review of PR #137: APPROVE-WITH-CHANGES at b3b10ee, all four changes implemented same-session, delta CONFIRMED at 66477a0 with a fired red-probe (containment-check bypass → the F-1 fabrication guard failed exactly), merged as affecd8 after CI green (node 20/22/26, run 29851994818).

The round's substance: TWO truth-table rows could still fabricate 'shared' — both inherited from the PLAN's row wording. F-1: shared_intree fired for never-pushed in-tree commits; now EVIDENCE-GATED via intree.ts's resolveInTreeUpstream decision table + local cat-file containment, names the TRACKING remote, and never-pushed reads the new private_intree_not_pushed state (adjudication: the design's own meta-rule — a wrong shared equals a wrong private — decided evidence-gating over the intent reading). F-2: untracked folder + fetched origin/board is provisioning's foreign-dir zone; now unavailable-with-reason, never shared. Plus F-3 detail-arm honesty and F-7's real-worktree battery row. Deviation ADJUDICATED ACCEPT empirically: sync runGit measured ~63ms per >=30s TTL expiry; async alternative buys nothing and violates one-porcelain reuse.

# Accepted residuals (recorded boundaries, non-blocking)

1. A repo whose ONLY remote is not named origin (clone -o upstream) with a genuinely pushed in-tree bundle reads private_intree_no_remote — wrong-private with wrong detail. Accepted for now: the classifier is origin-keyed by product convention (BOARD_REMOTE) and this is strictly better than the wrong-shared it replaced. Consistent fix if wanted: consult the decision table before the origin check, no_remote only when git remote lists nothing.
2. F-2's reason phrase mildly overclaims ('exists on origin') in the stale-evidence-no-origin variant — state honest, wording take-or-leave.
3. From round 1: foreign worktree parked at the conventional path (exotic, sync refuses it) worth a battery row eventually; residual chip staleness between SSE events is bounded by as_of.

# Survived attacks (round 1 + delta)

macOS /tmp-symlink + real linked-worktree probe (wrong-target guard held), layering (AST import-direction green over the new shapes; type-only into the browser), config contract (throwing loader → unavailable never private), decision-table contract re-read arm by arm (fail-closed on detached/no-tracking/dot-target/unresolvable), catalog untouched (no schema drift), both fabrication guards red-pinned.
