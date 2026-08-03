---
type: Context Note
title: Revision 3 T1 private authority builder
actor: codex-precompact-v3-t1-builder
timestamp: '2026-08-03T20:13:15.592Z'
---
# Summary

Revision-3 T1 private lifecycle authority is implemented and its independent-review FAIL is repaired and verified in its isolated worktree.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: deliver one private, project- and execution-bound compaction authority against the frozen T0 contracts; this serves the ultimate goal by making continuity exact, private, CAS-safe, and testable.

## Workspace and accepted inputs

- worktree: `/private/tmp/aslite-precompact-v3-t1.VV21hQ/repo`
- branch: `feat/precompact-v3-t1`
- frozen base: `ebfd190a8fb01525eb9a9cd2bcca6570bb3d2c61`
- accepted design: `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`
- accepted plan: `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`

## Implemented model

- Exact canonical project identity and complete execution tuple, each addressed by full SHA-256 and byte-compared on every structured read.
- Strict v1 head, generation, checkpoint, decision-card, delivery, audit, and quarantine schemas; no persisted storage self-version; fixed seven-day prepare-derived expiry.
- Deterministic transcript checkpointing and exact-identity extraction into all eight decision slots, with explicit unknowns and a render strictly below 8,000 characters.
- Private 0700 journal tree and final 0600 files, symlink refusal across the configured root's lexical ancestors and owned descendants, immutable-addressed generations, and a CAS-selected mutable head.
- Prepare create/refresh, compact/resume delivery, PostCompact audit, response observation, diagnosis, exact-version recovery, quarantine, and event-driven GC in one authority.
- Head rechecks and byte-exact rollback protect refresh, delivery, and Stop response observation from stale-generation races; interrupted create/delivery/recovery remain safely recoverable.
- Deterministic GC independently caps generation and quarantine deletion at 25, accurately receipts both, detaches a final expired head before deletion, and preserves corruption in quarantine.
- Frozen T1 rejection probes now exercise production boundaries; the two T2 hook-policy probes remain deliberately red.

## Verification

- `npm run typecheck -w @holaxis/aslite`: pass.
- Focused identity/schema/transcript/authority/process/contracts lane after repair: 32 pass, 0 fail, 13 T2-red probes skipped.
- True multi-process CAS test: pass; two processes created distinct generations and exactly one won expect-absent head publication.
- `npm run build`: pass for all workspaces.
- `git diff --check`: pass.
- Opt-in frozen red lane: 14 pass, exactly 2 expected failures owned by T2: `unsupported-pre-post-context` and `substring-hook-ownership`.

## Handoff

Independent review `context-notes/precompact-v3-t1-review` at `sha256:df58723f3e78891bf1cc400572a409d20dcd2cb42fe4eaa3303876e48d393c16` failed commit `a5a5efc269336abb2c76fb54d78d84d74abcfe9e` on five reproduced blockers. Repair commit `12ec093` adds regression-first fixes for all five:

1. Reject every symlink ancestor of the configured journal root before and after root creation.
2. Compact restoration requires the exact canonical prepare transcript and a byte-hash-proven strict append before mutation or injection.
3. Exact recovery uses an explicit `null` generation version to CAS-guard a valid head selecting an absent generation.
4. Quarantine GC has its own deterministic 25-record cap and accurate total/per-class receipt counts.
5. Stop response observation proves the full delivery-checkpoint prefix by byte length and SHA-256 before mutation.

Final 0600 record modes are asserted, prepared-state Post/Stop metadata is rejected by schema, premature PostCompact audit is ignored, and the true multi-process core-backend CAS probe remains green.

No T2 public command, hook installation policy, or live-host integration was implemented here. Those remain downstream work.

## Independent review R2 repair

Review `context-notes/precompact-v3-t1-review-r2` at `sha256:8018384072ece7751ab0812b259c04399c52c47c3df71ae1a4a41ec2b5be30dd` found one remaining TOCTOU: recovery quarantined the observed generation premise, then detached the head without keeping the generation version/absence premise stable.

Repair `a6af67738a1750b02a201ce4ea51cfdc84a3e23f` adds a real core-backend CAS fence at the selected generation key after quarantine and before head detachment. The fence is installed with the caller's exact generation version or expect-absent premise. Existing authority mutations either lose their old-version CAS or reject the fenced record; GC recognizes and preserves the short-lived fence. Recovery then CAS-detaches the exact head and restores the prior generation bytes byte-exact, or removes the expect-absent fence. Premise/head conflicts clean up the quarantine/fence and preserve current head and generation bytes. No second lock was added.

Two killpoint regressions now prove:

- an absent selected generation recreated during quarantine makes recovery conflict without changing the recreated generation or head;
- a production PostCompact mutation advancing the selected generation during quarantine makes recovery conflict without changing that updated generation or head.

Final R2 verification: focused identity/schema/transcript/authority/true-process/contracts lane 34 pass, 0 fail, 13 expected T2 skips; opt-in red lane 14 pass with exactly the two deferred T2 failures; CLI typecheck, full monorepo build, and diff check pass. Exact T1 review commit: `a6af67738a1750b02a201ce4ea51cfdc84a3e23f`.
