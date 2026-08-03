---
type: Plan
title: 'Revision 3 implementation plan: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:00:54.369Z'
---
# Revision 3 implementation plan — compaction handoffs

**Status:** draft for independent team review. No production code begins until this plan and `designs/pre-compact-multi-session` revision 3 pass review.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: implement and independently prove the revision-3 Claude Code pilot on a feature branch; this serves the ultimate goal by making compaction recovery executable, identity-safe, private, and self-cleaning.

## Frozen domain model

The shared terms and invariants are in `context-notes/precompact-v3-orientation` and revision 3 of `designs/pre-compact-multi-session`. All builders must read both plus `context-notes/precompact-v3-live-rail-probe` before editing. The live probe, not assumed documentation ordering, is the host contract.

## Roles and dependency graph

| Unit | Owner role | Depends on | May run in parallel with | Deliverable / gate |
|---|---|---|---|---|
| P0 Plan review | product/acceptance reviewer, lifecycle reviewer, adversarial skeptic | design + plan drafts | reviewers run independently | unanimous PASS or all blocking findings resolved |
| T0 Feedback harness | QA-infrastructure builder | P0 | none; first implementation unit | event simulator, fake clock, transcript fixtures, multi-process/killpoint harness, revision-2 red probes |
| T1 Authority/store | core builder | T0, frozen interfaces | T2 after interface freeze, in isolated worktree | identity, schema, private journal, state machine, receipts, GC + unit/concurrency tests |
| T2 Claude adapter/install | runtime builder | T0, frozen authority interface | T1, in isolated worktree | hidden `hook run`, SessionStart composition, five-event install/status/uninstall + tests |
| T3 Integration | integrator | T1 + T2 | none | merge builders, resolve only interface seams, integration/package/privacy tests |
| T4 Docs/generated surfaces | docs builder | T2 behavior frozen | late T3 tests | reference/help/skill source updates and generated-artifact checks |
| G0 Builder verification | integrator | T3 + T4 | none | targeted suites, build/typecheck, package proof, clean worktree |
| R0 Exact-SHA Review | independent reviewer who did not build the reviewed unit | G0 candidate commit | none | review exact commit; any fix creates a new SHA and repeats R0 |
| Q0 Adversarial QA | independent QA | R0 PASS | none | exact reviewed SHA only; any repair returns to R0 |
| L0 Manual live gate | live verifier | Q0 PASS | none | isolated installed manual-compaction manifest |
| L1 Automatic live gate | live verifier | L0 PASS | none | separate real auto-compaction manifest |
| S0 Ship handoff | orchestrator | L1 PASS + full `npm run check` | none | commit/push branch, bundle sync, paste-ready PR title/body; user opens PR |

Review is a hard dependency before QA. QA is a hard dependency before either live acceptance journey. No merge/deploy occurs in this workflow.

## Implementation units and acceptance

### T0 — feedback infrastructure first

Create tests before the production loop:

- event-sequence simulator using exact installed payload fixtures for PreCompact, SessionStart startup/resume/compact, PostCompact, Stop, and SubagentStop;
- transcript fixtures with current prompt, labelled and missing decision-card fields, large tool output, Skill calls, malformed JSONL, controls, and truncation boundaries;
- injectable clock/UUID/home/state-root and a receipt-chain validator;
- multi-process contention workers plus killpoints after every read/write/read-back/delivery/ack transition;
- red probes that reproduce revision 2: unsupported Pre/Post context, id8 collision, repeated create-only failure, stale deletion, no-ID fallback, unvalidated schema, and no GC;
- an opt-in live harness that writes only below a fresh `/private/tmp` root and records sanitized manifests.

Gate: every red probe fails against the old design for the intended reason, and the new unit fixtures run without touching user-global settings or the shared board.

### T1 — private authority and journal

Primary files (exact split may change only in plan review):

- `packages/cli/src/handoff/identity.ts`
- `packages/cli/src/handoff/schema.ts`
- `packages/cli/src/handoff/transcript.ts`
- `packages/cli/src/handoff/store.ts`
- `packages/cli/src/handoff/authority.ts`
- focused tests under `packages/cli/test/` and process fixtures under `packages/cli/test/fixtures/`

Reuse `initBundle`, kind loading/validation, versioned document reads/writes/deletes, and the existing filesystem CAS lock; do not implement a second YAML parser or CAS engine. Initialize the internal journal under `credentialsDir()/handoffs/v1`, force the private directory boundary, and keep it out of project discovery/catalog/sync.

Implement exact identity/full-hash verification; strict fixed schema; known-or-unknown evidence slots; deterministic transcript extraction and bounded render; prepared refresh/new-generation rules; delivery, PostCompact audit, acknowledgement, and capped GC. All service calls return content-free structured receipts.

Gate: tri-backend/domain tests as applicable, true cross-process contention, modes/privacy checks, mutation survivors for collision/stale-ack/GC logic, and no unreviewed public command surface.

### T2 — Claude adapter and managed hooks

Extend `packages/cli/src/commands/hook.ts` with the hidden run path and pure multi-event settings transforms. Compose Claude SessionStart board orientation and handoff delivery through one managed command. Preserve Codex/OpenCode SessionStart behavior while reporting compaction unsupported.

Update status/install/uninstall truthfully; migrate existing managed SessionStart entries; deduplicate only managed commands; preserve foreign groups and fail-loud malformed-file behavior. Never remove the user's legacy pre/post scripts automatically.

Map authority outcomes only to event-valid Claude output: PreCompact block; SessionStart additionalContext or `continue:false`; PostCompact/Stop/SubagentStop side-effect-safe JSON. No shell/jq/date/hostname dependency.

Gate: pure golden settings tables, on-disk idempotency/migration/uninstall tests, moved executable and minimal-PATH packaging tests, and exact command writer/recognizer agreement.

### T3/T4 — integration, docs, and packaging

Integrate builder branches in the isolated feature worktree. Tests must prove the observed real order, including prepared refresh when a host declines compaction and PostCompact occurring only after SessionStart returns. Add privacy scans showing no journal record in `.agentstate-lite`, git, sync, stdout, or receipts.

Update source-owned help/reference/skill text. Regenerate only through repository generators; do not hand-edit bot-owned plugin bundles or version fields.

Gate: targeted CLI/core tests, typecheck, package verification, generated-artifact checks, and clean git status except intended source/test changes.

## Review rubric (R0)

The reviewer checks a detached clean worktree at the exact candidate SHA and reports file/line evidence. At minimum:

- one lifecycle authority; adapters contain no hidden identity/CAS/selection policy;
- exact stored full identity comparison after every read and full 64-hex key;
- prepared retry cannot strand "not enough messages"; delivered state cannot be overwritten;
- SessionStart never relies on PostCompact ordering or imports unverified content;
- PostCompact mutation cannot invalidate later acknowledgement;
- Stop/SubagentStop acknowledgement and GC are generation/version safe;
- decision slots distinguish observed evidence from unknown and stay under output limits;
- private placement, permissions, redaction, and path/symlink handling;
- truthful Claude-only support and safe legacy/foreign-hook behavior;
- one sampled load-bearing test is made red to prove it can fail.

Any blocking finding returns to the responsible builder; the repaired SHA must be re-reviewed before QA.

## Adversarial QA rubric (Q0)

Attack concurrent main sessions, sibling subagents, old-prefix collisions, hostile identities, corrupt journal/convention/record bytes, malformed/truncated transcripts, huge summaries, stale delivery/ack/GC workers, disk-full/unwritable/moved executable, clock skew, symlink targets, partial legacy installs, interruption at every transition, declined compaction, repeated compaction, resume redelivery, and privacy leakage. Run network/listener tests with the required execution permission rather than accepting sandbox `EPERM` as a product result.

QA rejects on any silent continuation without a prepared record, wrong-generation restore/mutation, non-event-valid hook JSON, unbounded context, board/global leakage, or unsupported-runtime ambiguity.

## Live acceptance and stop conditions

Use the opt-in harness with the exact reviewed package artifact and installed Claude Code version. Both journeys use unique canaries and full session IDs, capture sanitized event/authority receipts, and audit all temporary/global/project paths before and after.

- Manual: real `/compact`, prepared card canary restored through SessionStart, first later Stop acknowledgement, then a second compaction proving a new generation.
- Automatic: bounded real context pressure using documented auto-compact environment controls, `trigger:auto`, card canary restored without manual preparation, first response acknowledgement.
- Concurrency supplement: two simultaneous main sessions with old-prefix-colliding fixtures plus one subagent identity, each restoring only its own canary.

Verdicts:

- PASS only if all automated, Review, QA, manual, automatic, identity, privacy, and receipt gates pass on the same artifact.
- BLOCKED-PENDING-VERIFICATION only for an external host condition that prevents a live journey without showing a rail failure; it blocks shipping.
- FAIL for rejected hook output, missing/out-of-order authority transition, fail-open prepare/restore, canary loss, wrong identity/generation, stale mutation, or privacy leak.

## Branch and release discipline

Work remains on `feat/precompact-handoff-v3`, based on `origin/main` `138a3c7c756e5fdb883a84b3c10611f92253033e`. Builders use isolated worktrees and descriptive commits without AI attribution. The orchestrator never commits board/bundle writes; those go through `aslite sync`. After all gates, push only the feature branch and provide paste-ready PR title/body. The user owns PR creation and merge.
