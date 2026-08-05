---
type: Task
title: Define an evolution-safe OKF extension architecture
status: done
priority: '1'
actor: codex-main
timestamp: '2026-08-05T23:06:19.279Z'
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

# Outcome

Complete. The final recommendation is `designs/okf-extension-evolution-recommendation` at exact version `sha256:efa470dccbe2fe1aa8d5c06f17603e9ae6cd1a520715159c2a562e6507fde378`.

The design makes core, portable producer, and bundle-local definitions different authority classes; assigns portable semantic IDs independently of versions, aliases, and wire coordinates; isolates custom values from core coordinates; uses profiles for composition rather than safety; compiles operation-specific capabilities and mappings into one registry; and handles C1-C14 through matched detection, mapping, invariant, and migration responses.

Immediate posture is honest v0.1 authoring, an unsupported-writer guard, and a collision/capability ledger—without eager `status` renames. Durable target syntax remains provisional until tooling tests and upstream direction. Migration requires dual-read/single-write, a bundle epoch/fence or truthful direct-file quiescence, a protected complete revision set through root activation, final audit, and rollback/resume state.

The first exact adversarial review was CONDITIONAL at `sha256:48d08834cd9976f69f73b5395807ca14617f7b71a74ff4cf7cfb99c0a9713ca2`; its migration-fence and upstream-outcome findings were repaired. Exact re-review passed at `sha256:fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5` with no regression and no further re-review required unless the design changes.

No implementation, data rewrite, or OKF version migration was performed.

[contains domain model](okf-extension-evolution-domain-model.md)

[contains standards research](okf-extension-evolution-standards-research.md)

[contains architecture options](okf-extension-evolution-architecture-options.md)

[contains standards cross-review](okf-extension-evolution-standards-cross-review.md)

[contains architecture cross-review](okf-extension-evolution-architecture-cross-review.md)

[contains adversarial review](okf-extension-evolution-adversarial-review.md)

[contains exact re-review](okf-extension-evolution-adversarial-rereview.md)

[produces recommendation](../designs/okf-extension-evolution-recommendation.md)

[validated by exact re-review](../reviews/okf-extension-evolution-recommendation-rereview.md)
