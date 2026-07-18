---
type: Context Note
title: 'Recommendation: bounded codebase simplification audit'
actor: mike/codex
timestamp: '2026-07-18T02:52:30.203Z'
---
# Summary

A bounded, read-only codebase-wide simplification audit would be valuable after the active Page-to-View sequence settles. A generalized cleanup campaign would not. The audit should not delay the trusted human-action proof or put the product into broad refactoring mode.

The mutation-testing baseline does not indicate bad coverage: the scoped core paths and CLI actor runs killed roughly three quarters of plausible mutants. It does show uneven behavioral specification. Survivors are useful inputs for distinguishing consequential test gaps from cosmetic mutations and branches that may be redundant, but survival alone is not proof that code can be removed.

Run the audit against a fixed main SHA and constrain it to roughly one day. Produce no code changes. Return at most five ranked opportunities, each identifying the duplicated authority or mixed responsibility, what could be deleted or consolidated, the behavioral tests that would prove parity, expected net reduction, risk, and a sensible one-claim PR size.

Prioritize transitional compatibility logic after Page-to-View, duplicated policy across adapters, oversized modules mixing orchestration with domain decisions, obsolete migration or non-default remote paths, unclear generated/reference ownership, and mutation survivors that suggest redundant conditions. Explicitly exclude style or naming churn, speculative package extraction, and rearrangement without net deletion or stronger invariant ownership.

If the audit finds worthwhile work, execute candidates separately. Prefer units that delete superseded logic or collapse an invariant into one authority. Do not approve a broad cleanup branch.
