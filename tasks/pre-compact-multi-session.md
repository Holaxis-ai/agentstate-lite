---
type: Task
title: Implement and live-prove revision 3 multi-session compaction handoffs
status: in_progress
priority: '2'
description: >-
  T0-T4 passed exact review. R5 remains rejected. Team unanimously passes a
  strict five-question host-only R6 probe boundary; a clean-room <=800-line
  replacement script, exact dual static review, and evidence audit now gate any
  new Plan or code.
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T00:35:52.224Z'
---
# Revision 3 multi-session compaction handoffs

## Ultimate and proximate goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently adjudicate the exact-host-proven T3.5 launch/reap mechanism, then synthesize and exact-review one replacement candidate/live-acceptance Plan before implementation; this serves the ultimate goal by preventing an unowned late process or an unsupported lifecycle assumption from entering the compaction-memory rail.

## Problem

The old fixed `context-notes/pre-compact-main` convention collides across concurrent main sessions. Revision 2 was correctly rejected because its PreCompact/PostCompact model-context rail was unsupported, ids were shortened, repeated promotion failed, consume was generation-unsafe, schema was unvalidated, and expiry had no real owner.

## Accepted revision-3 direction

Revision 3 is a Claude-only exact-host pilot with:

- canonical project identity plus full `(runtime, session_id, agent_id|null)` execution identity;
- one private executable authority and host-local 0700 journal outside bundle/board/sync;
- a CAS head plus generation-addressed records, strict schema, deterministic bounded evidence card, fixed logical expiry, event-driven GC, and content-free exact-version recovery;
- PreCompact preparation, compact SessionStart-only restoration, PostCompact audit, and informational Stop/SubagentStop observation;
- structural managed-hook ownership that preserves foreign hooks exactly;
- one artifact manifest pinned through full checks, independent Review, QA, negative rail, manual main, automatic main, and real sub-agent acceptance.

The exact accepted design/plan and unanimous independent gate are recorded in `reviews/pre-compact-multi-session-v3-plan-2026-08-03`.

## Progress

- Revision 2 rejection retained as historical evidence; none of its proposed global changes are authorized.
- Installed Claude lifecycle and automatic compaction rail probed successfully in isolated configuration.
- Revision-3 design/plan passed final lifecycle, product/acceptance, and adversarial-skeptic review.
- Feature branch/worktree: `feat/precompact-handoff-v3` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, based on `origin/main` `138a3c7c756e5fdb883a84b3c10611f92253033e`.
- T0 feedback infrastructure was committed at `ebfd190a8fb01525eb9a9cd2bcca6570bb3d2c61` after an independent FAIL-and-repair cycle. Its final review `context-notes/precompact-v3-t0-review-r2` passed at 0.97 confidence with 19 executable checks and 14 boundary-driven red contracts.
- A real isolated Claude subagent supplied the exact installed SubagentStop fixture; global configuration was byte-identical before/after.
- T1 private authority/journal passed independent exact-SHA review at `a77ef92fa009ee424497317c129c6a6f88f122ef` (`context-notes/precompact-v3-t1-review-r4`, confidence 0.98) after three FAIL-and-repair rounds.
- T2 Claude adapter/install passed independent exact-SHA review at `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` (`context-notes/precompact-v3-t2-review-r4`, confidence 0.99) after three FAIL-and-repair rounds.
- T3 integration passed independent exact-SHA re-review at `579de4df5076f042282d0292db6ead0839f97ef3` (`context-notes/precompact-v3-t3-review-r2`, confidence 0.99). The authority owns health/readiness, install/status and live execution agree on journal-root failures, and only `AGENTSTATE_LITE_HANDOFF_ROOT` remains as the test/host seam.
- T4 source-owned help/reference/skill documentation passed independent exact-SHA re-review at repaired, rebased integration SHA `36c741a8173832d75d61a7ab138b5219c4415c66` (`context-notes/precompact-v3-t4-review-r2`, confidence 0.99).
- The branch now contains current `origin/main` and package identity `0.1.0-pre.3`.
- A pre-G0 readiness audit blocked freeze because the live harness is still T0-isolation-only and the existing package verifier always rebuilds/deletes a scratch artifact. Its first T3.5 prescription retained a sound `freeze`/`verify-existing` split but failed independent acceptance and skeptic review: it did not yet own real-Claude PTY invocation, deterministic L0-L3 oracles/event evidence, exact reviewed-SHA transactional freeze, immutable filesystem/postflight checks, R0/Q0 continuity/replay resistance, or explicit auth/global privacy snapshots.
- Revised T3.5 plan `plans/precompact-v3-t35-candidate-acceptance@sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0` now names one executable authority, transactional freeze, factored existing-tarball verification, immutable/pre-post checks, replay-resistant attestations, repo-owned tmux/event/fault/canary oracles, and protected-state privacy scans.
- The revised Plan failed its second exact acceptance/skeptic review. Static candidate integrity largely survived, but the load-bearing SessionStart corruption lane races the managed PreCompact final read-back; R0/Q0 findings and campaign replay state are under-bound; tmux auth/crash cleanup is contradictory; and real-npm/root-newness claims need enforceable boundaries.
- The exact-host probe overall failed because a normal-auth fallback changed real `~/.claude.json`; no content was inspected or reverted. Its isolated primitive component did prove exec-form hooks, independent stdin, parallel start/join, passive evidence, failure observability, and a pre-join completion record, while first model response remained `BLOCKED_AUTH`. A read-only addendum proved silent handlers cannot be mapped to command/args, so R3 forbids that inference and bans real-HOME/global-auth fallback.
- Plan R3 `plans/precompact-v3-t35-candidate-acceptance@sha256:45c9862ba1e4a1686bb68d326530fc6f3ae51efa529caa6a3a29b59965c73b0d` replaced the racy fault with a deterministic sequential wrapper, added a CAS campaign ledger and challenge-bound authority-written R0/Q0 assertions, atomic absent-root freeze, enforceable npm proof, honest API-key/tmux possession, idempotent reaping, and closed fault terminal states.
- Exact acceptance and skeptic review both rejected R3. The candidate architecture survived, but crash-atomic campaign ownership/tmux recovery, child close-plus-EOF success, fresh-generation causation and guarded corruption, hook-tree auth inheritance, serial L0 cleanup, and install-time versus publish-only npm lifecycle semantics remained open.
- Plan R4 `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812` closes those contracts with immutable owner-file-to-hard-link acquisition, pinned Darwin ps identity, history-before-current publication, socket-first tmux recovery, exact close-plus-EOF/fresh-generation wrapper predicates, serialized L0, honest full hook-tree auth possession, and a pinned install-triggered npm script boundary.
- Exact product/acceptance and adversarial-skeptic review both rejected Plan R4. The sole shared load-bearing defect is the tmux launch/reap gap: cleanup may observe a reserved socket absent and publish proof while a live or already-OS-spawned launcher can still bind it later. The skeptic also empirically showed the pinned Darwin `/bin/ps` grammar rejects a valid row with no leading PID whitespace.
- The circuit-breaker analysis is recorded independently in `research/precompact-v3-t35-launch-reaper-architect@sha256:60018b553f55944a78f1631718e0f5c225eef4c72d85a423b76234acc4a19c43`, `research/precompact-v3-t35-launch-reaper-acceptance@sha256:4e05e1e5f39a1fe75d6caf5ad494092587ac490a73c61f4953f02e8d68a012ce`, and `research/precompact-v3-t35-launch-reaper-skeptic@sha256:ceba46d2a33f1d1bc4782077a546e043af8d7163ed70d807233c88e8cab07143`. All three agree on a no-auth gated broker, durable release/reap fence, foreground commandless `tmux -D`, separately fenced `-N` session client, creator-before-creation cleanup, and exact descendant proof. The skeptic retains an explicit Darwin PID/start-to-kill TOCTOU limitation.
- The selected no-auth exact-host primitive campaign is recorded at `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`. Exact script/evidence/summary hashes are retained under `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`. It proved explicit-argv0 same-PID Node->foreground-tmux exec, a zero-session server, separate `-N` no-autostart client, pipe-only random-canary delivery, FD closure, exact server/pane group enumeration, kill-server/TERM/KILL teardown, and protected-state continuity. It also proved `sess=0` is unusable and `kill-server` may leave a validated stale socket that is removed only after every owned process/group is absent.
- Current phase: acceptance and skeptic roles independently inspect the exact host probe and decide whether the direct gated-broker architecture is eligible for replacement Plan synthesis, including an explicit disposition of sampled-PID signaling risk, pre-record quarantine, client fencing, stale-socket cleanup, and real-Claude descendant limits. No T3.5 code, API key, Claude, or G0 freeze is authorized before their disposition and an exact replacement-Plan PASS.

## Required gate order

T0 harness → T1/T2 implementation → T3 integration review → T4 docs/rebase review → T3.5 candidate/live-rail plan review → T3.5 test-first implementation/exact review → full `npm run check` and candidate freeze → exact-artifact Review → adversarial QA → real negative rail → manual main → automatic main → real sub-agent. Any artifact change after freeze restarts Review.

## Next action

Have the independent acceptance and skeptic roles audit `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf` plus the exact retained v5 evidence. If both accept Plan eligibility, synthesize a replacement Plan from the survived R4 architecture and host corrections, then obtain exact acceptance and skeptic PASS before test-first T3.5 implementation. If either rejects, preserve the evidence and reopen only the named architectural blocker.

## Related

- [user-notices](../designs/user-notices.md)
- [pre-compact-main](../context-notes/pre-compact-main.md)
- [revision-3 design](../designs/pre-compact-multi-session.md)
- [revision-3 plan](../plans/pre-compact-multi-session-v3.md)
- [plan-gate review](../reviews/pre-compact-multi-session-v3-plan-2026-08-03.md)

[related](../designs/user-notices.md)

[related](../context-notes/pre-compact-main.md)
