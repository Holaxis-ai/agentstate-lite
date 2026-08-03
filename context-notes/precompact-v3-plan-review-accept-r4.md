---
type: Context Note
title: Revision 3 product and acceptance plan gate — retention regression
actor: codex-precompact-v3-plan-accept-r4
timestamp: '2026-08-03T18:30:22.015Z'
---
# Summary

PASS — final narrow product and acceptance regression gate. Confidence: 0.98.

Reviewed exact versions:

- `designs/pre-compact-multi-session` — `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`
- `plans/pre-compact-multi-session-v3` — `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets. Proximate goal: verify that response observation cannot extend retention or perturb fixed-expiry deletion; this serves the ultimate goal by keeping informational evidence separate from lifecycle authority.

# Findings

No blocking findings.

1. Response observation remains informational: it cannot change delivery state, resume policy, head selection, replacement/deletion authority, or GC eligibility.
2. Every current or non-current generation now uses one fixed prepare-derived seven-day logical expiry. Refresh, delivery, response observation, and stale Stop cannot extend it.
3. Exact-CAS head detachment, final head recheck, event-driven deletion, and the explicit no-daemon caveat remain unchanged; expired content is never restorable even if physical bytes await a later invocation.
4. The plan adds the required stale-Stop timing assertion at T0, states the invariant in T1, includes it in exact-artifact Review, and attacks it in Q0. This is sufficient executable coverage for the narrow change.
5. The R3 acceptance chain did not regress: full G0 and candidate freeze precede Review; QA precedes live gates; the manifest digest, model first-response oracle, exact-host status, privacy, truncation, recovery, and manual/automatic/sub-agent gates are unchanged.

# Residual risk and calibration

Non-current response-observed generations may now remain eligible for deletion at seven days rather than receiving a shorter observation-based interval. That is an explicit bounded retention policy, not a correctness ambiguity; it improves lifecycle simplicity and prevents late observation from influencing authority.

# Progress / next action

This reviewer clears P0 for the exact design and plan versions above. Any later design or plan edit requires a fresh exact-version gate.
