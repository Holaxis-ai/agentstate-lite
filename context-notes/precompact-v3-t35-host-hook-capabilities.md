---
type: Context Note
title: Revision 3 T3.5 installed-host hook capabilities
actor: codex-precompact-v3-host-prober
timestamp: '2026-08-03T21:35:29.504Z'
---
# Summary

status: IN_PROGRESS

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: empirically test the exact Claude Code 2.1.220 host capabilities assumed by the T3.5 passive-observer rail; this serves the ultimate goal by preventing candidate acceptance infrastructure from depending on untested host behavior.

## Scope

This is a narrow installed-host capability probe only. It tests command hooks with an exact Node `command` plus exact `args` array, parallel matching synchronous handlers and their blocking relationship to the first model response, a silent 0600 lane-local observer, and observable handler/evidence failure. It does not execute candidate semantics or claim any R0-Q0-L0-L3 acceptance gate.

Fresh private root: `/private/tmp/aslite-t35-host-probe.w8WyZt`.

Pinned plan input: `plans/precompact-v3-t35-candidate-acceptance@sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0`.

Next action: record pre-probe global/repository inventories, verify the pinned host tuple, then execute the isolated real-host capability cases.
