---
type: Context Note
title: Revision 3 T1 private authority builder
actor: codex-precompact-v3-t1-builder
timestamp: '2026-08-03T19:40:36.697Z'
---
# Summary

Revision-3 T1 private lifecycle authority is implemented and verified in its isolated worktree.

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
- Private 0700 journal tree and 0600 files, symlink refusal at owned boundaries, immutable-addressed generations, and a CAS-selected mutable head.
- Prepare create/refresh, compact/resume delivery, PostCompact audit, response observation, diagnosis, exact-version recovery, quarantine, and event-driven GC in one authority.
- Head rechecks and byte-exact rollback protect refresh, delivery, and Stop response observation from stale-generation races; interrupted create/delivery/recovery remain safely recoverable.
- Deterministic GC deletes at most 25 records, detaches a final expired head before deletion, and preserves corruption in quarantine.
- Frozen T1 rejection probes now exercise production boundaries; the two T2 hook-policy probes remain deliberately red.

## Verification

- `npm run typecheck -w @holaxis/aslite`: pass.
- Focused identity/schema/transcript/authority/process/contracts lane: 28 pass, 0 fail, 13 T2-red probes skipped.
- True multi-process CAS test: pass; two processes created distinct generations and exactly one won expect-absent head publication.
- `npm run build`: pass for all workspaces.
- `git diff --check`: pass.
- Opt-in frozen red lane: 14 pass, exactly 2 expected failures owned by T2: `unsupported-pre-post-context` and `substring-hook-ownership`.

## Handoff

No T2 public command, hook installation policy, or live-host integration was implemented here. Those remain downstream work. The code is ready to commit on the isolated T1 branch and hand to the orchestrator for review/cherry-pick.
