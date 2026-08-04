---
type: Design
title: Revision 3 inert compaction proof-rail system model
actor: codex-takeover-main
description: >-
  REJECTED at exact head a2876766: false phase premise and duplicate authority;
  see context-notes/precompact-v3-r0-system-model-skeptic. Do not plan or
  implement.
timestamp: '2026-08-04T17:47:29.175Z'
---
# Purpose and scope

This document models the pre-implementation R0 **live-rail proof fixture** currently staged in the revision-3 worktree. It is not the later `R0 Exact-artifact Review` stage named in `plans/pre-compact-multi-session-v3`; reusing the label has caused ambiguity and should be corrected in the repair plan.

The fixture's purpose is narrow: before lifecycle-authority implementation or a frozen candidate exists, prove that the installed Claude host can execute an isolated, inert PreCompact/SessionStart rail with trustworthy input/output/effect evidence. It must not write a handoff generation, invoke production handoff authority, use tmux or detached execution, mutate real user configuration, contact the network, or claim lifecycle acceptance.

# Goals

Ultimate goal: agentstate-lite is durable, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make the inert host rail mechanically capable of producing reviewable evidence for manual and automatic compaction plus negative hook behavior, so lifecycle work rests on observed host contracts rather than fabricated events.

# Domain taxonomy

- **rail** — the complete inert proof mechanism: preparation, isolated settings installation, Claude invocation, hook observation, evidence retention, adjudication, and restoration.
- **campaign** — one immutable proof attempt over one exact source/host/settings tuple. A campaign owns case directories and cannot mix STATIC and LIVE evidence.
- **case** — one named journey with a fresh sentinel, isolated evidence directory, exact expected event sequence, and closed verdict.
- **STATIC case** — a deterministic local simulation used to test the rail's own codecs, path safety, response shapes, and adjudicator. It can never satisfy a LIVE predicate.
- **LIVE case** — events emitted by the exact installed Claude executable under an isolated `CLAUDE_CONFIG_DIR`, with raw receipts and observed host effects. Only the live orchestrator may create its namespace.
- **manifest** — create-only, case-scoped declaration binding schema, evidence mode, case kind, sentinel commitment, expected input event(s), exact hook command vector, source digests, and campaign identity.
- **hook** — inert executable that validates one exact event against its manifest, records bounded raw evidence without corrupting the protocol channel, and emits only the response shape authorized for that event/case.
- **settings overlay** — isolated settings document created by a helper that preserves existing isolated foreign hooks, installs exact absolute hook commands, verifies its own bytes, and can restore the pre-run bytes exactly.
- **raw receipt** — bounded byte evidence for hook stdin, protocol stdout, diagnostic stderr, exit/timeout, monotonic/UTC time, and executable/manifest identity. Protocol stdout must still reach Claude unchanged.
- **effect evidence** — transcript/native-summary hashes and bounded observations proving or disproving compaction, sentinel absence before injection, sentinel delivery after compact SessionStart, and response suppression/block behavior.
- **adjudicator** — a separate read-only verifier that derives PASS/FAIL from raw receipts, manifests, settings/source digests, event order, and effects. It rejects missing, duplicated, reordered, stale, synthetic, or hardcoded observations.
- **restoration receipt** — proof that isolated settings and every protected external path are byte-identical before/after and that no managed process remains.

# Components and ownership

## 1. Campaign preparer

Owns a fresh private root with restrictive mode, rejects existing/symlinked/unsafe paths, selects the closed case set, generates independent high-entropy sentinels, resolves exact absolute executable/script/manifest paths, captures source/host digests, and writes create-only manifests/settings inputs. It does not invoke Claude and cannot emit a verdict.

Current implementation: `scripts/r0-prepare.mjs`. Current defect: it writes two generic STATIC manifests whose paths align with the fixture only under an implicit cwd/root choice and omit the case behavior needed by the hook.

## 2. Settings installer/restorer

Owns backup, structural merge, exact command installation, foreign-hook preservation, read-back verification, and byte-for-byte restoration inside a dedicated temporary `CLAUDE_CONFIG_DIR`. It never reads or writes real user settings.

Current implementation: prose plus `packages/cli/test/fixtures/r0/isolated-settings.json`. Current defect: no executable owner exists; copying the fixture overwrites settings and commands are PATH/cwd-dependent.

## 3. Inert hook

Owns strict manifest/input validation and the one allowed protocol response for a case:

- positive PreCompact: successful pass-through response accepted by the installed host, with no SessionStart-only fields;
- positive compact SessionStart: `hookSpecificOutput.hookEventName=SessionStart` with the fresh sentinel in `additionalContext`;
- negative PreCompact: the exact installed-host block/continue response shape under test;
- negative compact SessionStart: `continue:false`/stop response under test.

It never imports production lifecycle or handoff authority. Its stdout is exclusively the hook protocol response. Evidence capture must occur through an owning wrapper or separate file descriptor/path, not by changing stdout bytes.

Current implementation: `scripts/r0-inert-hook.mjs`. Current defect: a prepared positive PreCompact defaults to a SessionStart response, accepts STATIC and LIVE interchangeably, and retains no raw receipt.

## 4. Case runner / live orchestrator

STATIC runner owns deterministic child execution and fixtures only. LIVE orchestrator owns the exact Claude command vector, isolated environment, bounded timeout/termination, user-action protocol, transcript/native-summary discovery, event correlation, and restoration. These are distinct authorities and distinct namespaces.

Current implementation: `scripts/r0-run-case.mjs` plus runbook prose. Current defect: the static runner synthesizes events, writes inside the repository, uses cwd-derived paths, and produces live-shaped evidence; no executable live orchestrator exists.

## 5. Evidence recorder

Owns create-only, case-scoped raw receipts and digests. It binds each event to campaign/case/session/transcript/cwd identity and preserves chronological order. It cannot decide PASS.

Current implementation: absent. `scripts/r0-rail-collector.mjs` only creates a STATIC manifest and exports an unused, weak `verdict` function.

## 6. Adjudicator

Owns the closed evidence schema and verdict. It validates exact source/host/settings/manifest identities, all required event receipts, event order, sentinel provenance/absence/delivery, transcript/native-summary observations, response schema/effects, timeout/exit state, restoration, and namespace mode. It must fail closed and produce a bounded content-free report.

Current implementation: absent.

## 7. Tests

Own fast feedback for every contract above from both repository-root and package-test cwd. Tests use only temporary directories, create no `.r0-live` repository artifact, execute emitted command vectors character-for-character, prove a red sample, and cover path/symlink/existing-root/stale/mode/order/schema/restoration attacks.

Current implementation: `packages/cli/test/r0-collector.test.ts`, `packages/cli/test/r0-live-rail.test.ts`, and `packages/cli/test/support/r0-live-rail.ts`. Current defect: one suite invokes scripts through cwd-relative paths; the other exercises the production adapter with a fake authority and hardcodes transcript/native-summary absence, so neither tests the claimed rail.

# Interaction and ordering model

1. Reviewer pins exact source files and host executable identities.
2. Preparer atomically creates a fresh campaign root outside the repository and creates case manifests/settings inputs.
3. Settings installer snapshots the isolated settings bytes, merges exact absolute hook commands, verifies foreign-hook preservation and installed bytes, and emits an installation receipt.
4. For each case, the live orchestrator launches the exact Claude executable with exact cwd/environment and a bounded termination policy.
5. Claude invokes the inert hook. The hook validates its one manifest/event, the recorder captures raw bytes/timing/identity, and the hook's sole stdout response reaches Claude unchanged.
6. The live orchestrator records transcript/native-summary/effect evidence and closes the case.
7. The settings restorer restores the isolated configuration and verifies protected state/process cleanup.
8. Only after restoration does the adjudicator read the immutable evidence set and derive the closed verdict.
9. Product and skeptic reviewers inspect exact bytes and deterministic tests. LIVE execution is allowed only after both review gates pass.

# Timing and correlation invariants

- A positive case requires one correlated real session with observed PreCompact preceding compact SessionStart; a directly synthesized SessionStart is not evidence of compaction.
- Manual and automatic positives are distinguished by observed host trigger/effect provenance, not a caller label.
- Negative PreCompact proves the host accepts the exact block response and compaction does not proceed.
- Negative SessionStart proves `continue:false` suppresses the first resumed model response; local JSON shape alone is insufficient.
- Every receipt is create-only and ordered by an event sequence plus monotonic timestamp. Missing, duplicate, reordered, cross-case, or cross-session receipts fail.
- Each case has a distinct sentinel generated before launch. The sentinel must be absent from pre-injection transcript/native-summary evidence and present only through the authorized compact SessionStart response.

# Safety and external-state invariants

- Real `~/.claude`, `~/.claude.json`, global hooks, auth material, production journals, project bundles, board state, and network are untouched.
- All writable proof state lives under a newly absent private temporary root, mode 0700; files are mode 0600 and created without following links or overwriting prior evidence.
- Exact absolute command vectors pin Node, Claude, script, manifest, cwd, and environment. PATH and implicit cwd are not authorities.
- STATIC and LIVE use different schemas or mechanically disjoint roots, and the adjudicator rejects STATIC evidence for LIVE predicates.
- No fixture writes `.r0-live` in the repository. Stale evidence cannot be silently reused.
- Cleanup/restoration failures are FAIL and cannot be downgraded to PASS/BLOCKED.

# Closed proof cases needing product confirmation

The current handoff names four cases: manual positive, automatic positive, automatic PreCompact negative, and compact SessionStart `continue:false` negative. The current runbook additionally asks for both manual and automatic negative PreCompact, while the accepted later lifecycle plan's L0 stage has both. Product review must resolve whether this prerequisite fixture has four or five cases; the implementation must encode one closed set rather than prose variants.

# Acceptance boundary

The repaired rail is ready for exact review when deterministic tests prove all component contracts from both supported cwd contexts, one oracle is deliberately made red and observed failing, the worktree contains no generated evidence, and the runbook is an exact transcript of executable commands rather than an authority of its own. Passing review authorizes only the inert isolated host matrix; it does not authorize lifecycle authority, tmux, candidate freeze, or final revision-3 acceptance.

# Current evidence and confidence

Source: exact r7-reviewed bytes in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, verified by SHA-256 on 2026-08-04, plus `context-notes/precompact-v3-r0-live-rail-skeptic-r7`.

Confidence: high on the component/ownership diagnosis; medium on the final case count and installed-host response semantics until product review and exact Claude documentation/observations resolve them.

[supports](../tasks/pre-compact-multi-session.md)
