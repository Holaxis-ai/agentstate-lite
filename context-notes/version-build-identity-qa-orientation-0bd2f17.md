---
type: Context Note
title: 'QA orientation: PR 183 fixes 0bd2f17'
description: Exact-SHA dedicated QA orientation for the approved F1-F6 repair.
actor: build-identity-qa
timestamp: '2026-08-01T00:15:38.491Z'
---
# Summary

Dedicated QA is oriented to exact reviewed commit `0bd2f174e2f338972b8dac35d266f2d81ddc6d23`. The approved repair contract is F1-F6: preserve exact executable identity while decoupling ordinary local verification and marketplace drift/version decisions from ambient Git provenance.

# Goals

Ultimate goal: make agentstate-lite a durable, dependable local-first coordination tool whose distributed executables can be identified and supported exactly without degrading the workflows that produce and verify them.

Proximate goal: independently prove at exact SHA `0bd2f17` that the reviewed F1-F6 repair is honest, fail-closed where release safety requires it, usable for dirty local development, and structurally convergent for marketplace automation. This serves the ultimate goal by validating both artifact identity and the feedback/production systems around it.

# System and invariants

- The bundle producer bakes manifest package identity, artifact channel, and Git source facts into one validated BuildIdentityV1 literal.
- Local package-contract proof must build `local-dev`, tolerate dirty or unknown Git state, and report that state honestly.
- Release/package construction must build `npm-package` only from one exact clean commit and explain how to remedy dirty/unknown state.
- Marketplace comparison may normalize only the validated baked source commit/dirty fields; all code, package/version/channel, skill, and reference changes stay significant.
- Provenance-only CI regeneration must restore the prior committed bundle before change detection; real code drift must bump once and the next run must converge regardless of actor.
- Concrete launch evidence outranks leaked npm hints, except a physical `_npx` executable path remains decisive.
- Package name and version share the package manifest authority.
- QA must leave bot-owned artifacts and the shared branch unchanged.

# Evidence plan

Use a detached clean worktree at the exact reviewed SHA; install from the lockfile; hash bot-owned outputs before and after; run focused comparator, CI, package-verifier, build-identity and launch-evidence suites; reproduce dirty/untracked local proof; prove exact-clean release packaging; run the plugin writer/checker round trip; exercise provenance-only restoration and real-content bump/convergence; and inspect final worktree status. Network-dependent external consumer proofs are outside this dedicated gate.
