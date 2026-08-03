---
type: Context Note
title: Revision 3 product and acceptance plan gate — round 2
actor: codex-precompact-v3-plan-accept-r2
timestamp: '2026-08-03T18:19:15.265Z'
---
# Summary

PASS — independent product and acceptance plan gate. Confidence: 0.95.

Reviewed exact versions:

- `designs/pre-compact-multi-session` — `sha256:7d9c8643c701d346ca672336798ab1a769d739ec3dadb113e7093c4c9369ab6f`
- `plans/pre-compact-multi-session-v3` — `sha256:36fcaba4a3f9ce5156d58edcd873c302d7c41b62309866dd7404076f128b79d1`
- `context-notes/precompact-v3-orientation` — `sha256:6a5a02140842cc24730814c620c74d73fa36fe590d3212cfbc56970828e1932b`
- `context-notes/precompact-v3-live-rail-probe` — `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`
- prior acceptance FAIL `context-notes/precompact-v3-plan-review-accept-fast` — `sha256:1fe0979d639741fb36d8db5a266fed2e336df4ee72066620d53c6e957f54e863`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets. Proximate goal: determine whether the revised plan can prove a useful, private handoff reaches the correct model on one reviewed artifact; this serves the ultimate goal by preventing false-green session-boundary infrastructure.

# Findings

No blocking findings.

1. **Product oracle passes.** Manual, automatic, and real sub-agent journeys require pre-compaction-only values spanning goal/task, constraint, evidence-backed decision, deliberate unknown, current prompt, and exact next command. The first post-compaction response must reproduce those values and use the next action. Hook output or receipt inspection alone cannot satisfy the gate.

2. **Ordering passes.** G0 runs the complete `npm run check`, package proof, and candidate freeze before independent exact-artifact Review. QA is a hard successor of Review, and every negative/manual/automatic/sub-agent live gate is a hard successor of QA. Any relevant change restarts the whole G0 -> R0 -> Q0 -> live chain.

3. **Artifact continuity passes.** The candidate source commit, packed bytes, CLI/helper identity, harness revision, and exact Claude artifact are frozen under one manifest digest. Later stages install the already-packed artifact, compare the same digest, and abort on rebuild or drift.

4. **Support truth passes.** The design limits proven support to Claude Code `2.1.220` commit `4073f59596e2`, distinguishes verified/unverified/not-installed/unsupported states, and requires a healthy exact helper before `rail_ready:true`. Launch and timeout behavior are explicitly host-bound rather than misreported as executable fail-closed behavior.

5. **Recovery and operator burden pass.** Healthy delivery no longer blocks a later generation. Content-free diagnosis provides exact identities and versions; recovery is restricted to corrupt/unsafe/expired state, uses expected versions, quarantines privately, and cannot detach healthy current state. Ordinary operation requires no cleanup.

6. **Truncation/usefulness passes.** Required card slots include observed and unknown evidence, preserve current prompt and exact next action first, disclose truncation, and stay below 8,000 characters. Automated boundary cases and at least one oversized live journey prove the behavior.

7. **Privacy passes at plan level.** The journal/quarantine remain outside bundle, git, sync, catalog, home, logs, receipts, status, and manifests; live gates use isolated configuration and before/after inventories, with 0700/symlink/ownership checks.

# Residual risk and calibration

The real negative hook behaviors and sub-agent compaction remain empirically unverified, but the plan names them as mandatory live gates and assigns `BLOCKED-PENDING-VERIFICATION` if the host cannot exercise them. That is correct calibration, not a plan blocker.

# Progress / next action

This acceptance reviewer clears P0 for the exact design and plan versions above. Preserve those versions in the builder handoff; any design/plan change requires a fresh gate review.
