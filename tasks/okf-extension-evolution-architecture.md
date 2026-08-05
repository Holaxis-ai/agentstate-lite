---
type: Task
title: Define an evolution-safe OKF extension architecture
status: in_progress
priority: '1'
actor: codex-main
timestamp: '2026-08-05T22:58:25.730Z'
---
# Objective

Recommend how agentstate-lite should distinguish producer Kind conventions from core OKF conventions and systematically handle collisions as OKF evolves.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish an evolution-safe extension and migration policy so upstream OKF changes cannot silently change the meaning of agentstate-lite data.

# Acceptance

- A shared domain model distinguishes core conventions, producer extensions, Kind conventions, profiles, namespaces, serialized keys, logical fields, version claims, and migration mechanisms.
- Standards research covers FHIR and additional mature evolving standards, separating normative mechanisms from project-specific inference.
- The recommendation classifies collision patterns and maps each class to a handling strategy.
- Architecture options explicitly compare namespacing, profiling, registries, logical-to-serialized field mapping, and version-aware migration.
- The final proposal includes invariants, tradeoffs, phased adoption, upstream asks, risks, non-goals, and a decision procedure implementers can follow.
- An independent adversarial review evaluates the exact synthesized design before acceptance.

# Progress

Domain model, research plan, independent standards research, independent architecture options, and reciprocal exact-version cross-reviews are complete. The two branches converged on authority-qualified identities, isolated custom wire space, profiles for composition rather than isolation, logical-to-wire mappings, operation-specific capabilities, and explicit write-gated CAS migration.

The synthesized recommendation is frozen at `designs/okf-extension-evolution-recommendation` version `sha256:226214f3ab5d302cffa4ceb57d9fa3965cf1aaf4d2bce065348949cd376cc600`. Independent adversarial review of that exact head is in progress. No implementation or data migration has been performed.

[depends on](okf-extension-evolution-domain-model.md)

[depends on](okf-extension-evolution-standards-research.md)

[depends on](okf-extension-evolution-architecture-options.md)

[depends on](okf-extension-evolution-adversarial-review.md)

[depends on](okf-extension-evolution-standards-cross-review.md)

[depends on](okf-extension-evolution-architecture-cross-review.md)

[produces recommendation](../designs/okf-extension-evolution-recommendation.md)
