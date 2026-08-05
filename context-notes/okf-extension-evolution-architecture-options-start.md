---
type: Context Note
title: Architecture options phase start
description: >-
  Independent divergent analysis of OKF core-versus-extension identity and
  evolution
actor: codex-okf-architect
timestamp: '2026-08-05T22:37:59.863Z'
---
# Summary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: develop a grounded, comparable set of extension-evolution architecture options so the parent review can choose a collision-safe policy that advances the ultimate goal by keeping bundle memory portable, locally operable, and maintainable without founder intervention.

Current system model: OKF is the portable serialization boundary; bundle Kind conventions add product-level semantics through one core registry loaded once by command adapters; all writes flow through core mutateDocument with CAS. The known risk is that open producer-defined metadata can later collide with newly standardized OKF fields. This phase will test structural identity, collision diagnostics, and migration control-plane options against C1-C14 while preserving one parser, one registry, one mutation authority, offline resolution, and no indefinite dual truth.

Unverified assumptions at start: whether current Kind declarations distinguish field ownership; whether recipe parsing can carry mapping/profile metadata without a parallel registry; whether all status/query/new/update surfaces obtain semantics only from loadKinds; and whether the current OKF v0.2 text defines profiles or extension ownership strongly enough for a generic consumer.
