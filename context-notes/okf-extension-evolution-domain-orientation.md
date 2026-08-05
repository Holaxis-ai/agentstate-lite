---
type: Context Note
title: OKF extension-evolution domain-model orientation
actor: codex-standards-po
timestamp: '2026-08-05T22:31:11.769Z'
---
# Summary

Role: standards/product lead for the OKF extension-evolution architecture review. The project bundle is present and shared; no legacy Holaxis task or vault state is being used. The child task is claimed by `codex-standards-po`.

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish a neutral domain model and independently executable research/design contract so the team can recommend an evolution-safe OKF extension policy without silently assuming namespacing, profiles, or a migration mechanism. This serves the ultimate goal by moving compatibility decisions from founder judgment into durable, repeatable architecture scaffolding.

Current system model: OKF is the portable serialization boundary; agentstate-lite Kinds, recipes, Views, CAS, and workflow semantics are product extensions. agentstate-lite writes OKF v0.1, reads/transports v0.2 permissively, and does not yet safely author v0.2. The immediate concrete collision is top-level `status`: OKF v0.2 assigns document-lifecycle meaning while existing Kind conventions assign workflow meaning. Existing design already forbids dishonest version claims and implicit/eager migration, but the durable extension ownership model and collision playbook remain undecided.

Verified assumptions: existing audit evidence is empirical at pinned upstream and local commits; the upstream producer issue is #272; later work must separate normative standards mechanisms from local inference. Unverified assumptions to preserve for research: whether OKF intends global reservation of standardized keys, whether profiles can disambiguate unaware consumers, whether namespace syntax belongs in YAML keys or another layer, and whether one mapping strategy can cover all collision classes.

Next: persist the shared taxonomy and a plan with independent standards-research, architecture-options, synthesis, and adversarial-review contracts.
