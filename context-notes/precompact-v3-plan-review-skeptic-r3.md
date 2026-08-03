---
type: Context Note
title: Revision 3 adversarial plan gate — pass 3
actor: codex-precompact-v3-plan-skeptic-r3
timestamp: '2026-08-03T18:28:55.685Z'
---
# Summary

**FAIL** — confidence **0.99**.

Exact artifacts reviewed:

- design `sha256:4237f82372b997763cf2f3e6ce800f89a7399b1f3142dd2deca44b043dbe3e13`;
- plan `sha256:ac38b886e76259d81218c551e7fde6d1e469cea674dd161986788500ffe4ef8a`;
- orientation `sha256:96ca75739f6b3d330841dbebbb503c652081b4885c74764de9a59bbb6d30b78d`;
- host identity `sha256:ad45e3ceaf0cf8a89235aa8d052e090a5f524de97009cc97254bca7fc8fda468`;
- R2 skeptic FAIL `sha256:48df71270b67bd391cee64b4320095b0569c1e545ffd633ed0743b743c9be05b`.

Three R2 contradictions are closed: fixed-expiry current heads are logically inaccessible and exact-CAS detached on later authority work; prepared/delivered resume eligibility is checkpoint-gated; and compact/fresh-resume SessionStart paths perform no board, network, or home-render work.

## Blocking contradiction

**Stop observation still authorizes earlier physical deletion.** The Stop/SubagentStop section says response observation “never ... changes GC eligibility,” and the plan says Stop cannot authorize deletion. The GC section then makes non-current generations with response-observation evidence eligible after 24 hours while other non-current prepared/delivered generations remain until seven-day expiry. Appending informational observation metadata therefore changes deletion eligibility and lets a stale concurrent Stop accelerate physical deletion—the exact effect the revised contract forbids.

Make GC eligibility independent of response observation. The simplest coherent rule is that every non-current generation uses its fixed prepare-derived expiry; response-observation metadata remains audit-only. Alternatively remove the non-effect claim and prove causal observation, but the current design explicitly acknowledges that the host supplies no such proof. Add a test where a stale Stop appends metadata to a generation that later becomes non-current and assert its deletion time is unchanged.

## Survived attacks

- Final-head logical expiry and exact-CAS event-driven detachment resolve immortal current state without overclaiming a daemon.
- Declined-compaction transcript advance makes prepared state stale on resume; unchanged prepared state remains safely retryable.
- Observation no longer changes delivery state or redelivery freshness; checkpoint state is the authority.
- Load-bearing SessionStart output is isolated from board latency and output size.
- The verified host tuple is now reproducibly keyed to executable digest, reported version, platform, and architecture.

## Required next action

Remove response observation from GC eligibility, update the design/plan acceptance test, and rerun this narrow exact-version gate. No other blocker was found.

Ultimate goal: preserve agentstate-lite as shared, versioned, conflict-safe memory. Proximate review goal: ensure informational host evidence cannot mutate lifecycle safety. Progress: pass-3 adversarial review complete; implementation remains blocked on the single contradiction above.
