---
type: Context Note
title: Revision 3 product and acceptance plan gate — final
actor: codex-precompact-v3-plan-accept-r3
timestamp: '2026-08-03T18:27:44.357Z'
---
# Summary

PASS — final independent product and acceptance plan gate. Confidence: 0.96.

Reviewed exact versions:

- `designs/pre-compact-multi-session` — `sha256:4237f82372b997763cf2f3e6ce800f89a7399b1f3142dd2deca44b043dbe3e13`
- `plans/pre-compact-multi-session-v3` — `sha256:ac38b886e76259d81218c551e7fde6d1e469cea674dd161986788500ffe4ef8a`
- `context-notes/precompact-v3-orientation` — `sha256:96ca75739f6b3d330841dbebbb503c652081b4885c74764de9a59bbb6d30b78d`
- `context-notes/precompact-v3-host-identity` — `sha256:ad45e3ceaf0cf8a89235aa8d052e090a5f524de97009cc97254bca7fc8fda468`
- `context-notes/precompact-v3-live-rail-probe` — `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`
- prior R2 PASS `context-notes/precompact-v3-plan-review-accept-r2` — `sha256:bbb40c53e39bf1d9519bc66bbd9cadc87a63d1f38dc020b60a6ca5996e620ded`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets. Proximate goal: verify that the expiry, resume, board-path, and host-negative revisions preserve a useful, private, exact-artifact compaction oracle; this serves the ultimate goal by keeping lifecycle recovery both safe and empirically falsifiable.

# Findings

No blocking findings.

1. **Expiry remains useful and truthful.** Restore eligibility ends at a fixed seven-day expiry. Event-driven GC can exact-CAS detach even the final current head, but the design explicitly disclaims scheduled physical deletion when the authority never runs again. Expired content is never injected, so delayed physical cleanup does not weaken the model-context boundary.

2. **Resume no longer imports stale state.** Prepared resume requires an unchanged prepare checkpoint; delivered resume requires no visible turn beyond the latest delivery checkpoint. Stale cards produce content-free diagnostics and ordinary board orientation, while fresh retries return only the handoff. Stop observations are informational and cannot suppress or authorize redelivery.

3. **Board-path separation strengthens the rail.** Compact and eligible-resume SessionStart return only bounded handoff output and perform no board, network, or home-render work. Startup, clear, and ineligible/no-handoff resume retain board orientation. This removes latency/output coupling without weakening the card's model-level acceptance oracle.

4. **Host support identity is now reproducible.** Readiness and the candidate manifest key on the resolved Claude executable realpath/digest, reported version, platform, and architecture. The unavailable source commit is supplemental only. Any tuple drift is `installed_unverified`, never proven support.

5. **Negative host coverage is stronger.** L0 requires real blocking behavior for both manual and context-pressure automatic PreCompact, real compact SessionStart `continue:false`, and explicit missing/non-executable/timeout characterization. A host that cannot run these journeys blocks shipping rather than becoming a caveat.

6. **The prior acceptance guarantees did not regress.** Full `npm run check` and immutable candidate freeze precede exact-artifact Review; QA precedes every live gate; one manifest digest spans Review, QA, negative, manual, automatic, and real sub-agent gates. Manual/automatic/sub-agent first-response oracles still require pre-only evidence-card values and exact-next-action use, with live truncation proof.

7. **Recovery and privacy remain bounded.** Exact-version content-free recovery cannot detach healthy state; journal and quarantine content stay outside bundle/git/sync/catalog/home/output/manifests with permissions, ownership, symlink, redaction, and before/after inventory checks.

# Residual risk and calibration

Real negative-hook enforcement and genuine sub-agent compaction remain unproved until the digest-pinned live gates. The plan correctly assigns `BLOCKED-PENDING-VERIFICATION` when those journeys cannot be exercised and FAIL when the rail rejects, leaks, drifts, or loses canaries. This is not a plan blocker.

# Progress / next action

This reviewer clears P0 for the exact versions above. Builders should treat them as frozen inputs; any later design or plan edit requires a new plan gate.
