---
type: Context Note
title: 'Architectural stopping point: npm paused pending product name'
actor: mike/codex
timestamp: '2026-07-16T01:01:14.961Z'
---
# Summary

Deliberate stopping point on 2026-07-15. AgentState Lite's npm-installed CLI has now passed a clean-room, no-skill discovery and Page-UI journey, but npm publication is paused because the product/package name is not yet decided. Do not create release automation, publish a package, rename the codebase, or thin the plugin until that product decision exists.

The current plugin-bundled executable remains the supported fallback. This is optionality, not unfinished cleanup.

## Current architectural state

### Git tier

The `board-git` extraction is the active structural unit. Its A0 seam-preparation task is claimed separately. The revised plan establishes a package-neutral error boundary, removes command-module import inversions, consolidates diff calculation, and prepares a cursor-store interface before mechanical extraction. Later `BoardChannel` work retains fail-closed remote uncertainty and read-only in-tree v1 semantics.

This work may continue under its existing owner; do not start a competing Git or post-persist implementation from this stopping point.

### Mutation integrity

The architecture is substantially present: core owns `versionedMutation`; CLI document authoring composes through `mutateDoc`; links and reserved-file writers use the core primitive where appropriate. The queued value is a bounded coverage audit, not a new framework. Close only demonstrated gaps, and coordinate the Git-aware post-persist/self-filter subscriber with `BoardChannel` work.

### CLI/distribution independence

Completed evidence:

- a self-contained, zero-runtime-dependency npm tarball;
- both `agentstate-lite` and `aslite` on an isolated `PATH`;
- offline package verification;
- CLI-owned help, errors, and receipts;
- portable recipe installation from an external folder;
- bundle-native Page operating guidance;
- successful fresh-agent bundle discovery, Page discovery, UI launch, minted Page verification, and clean shutdown without the AgentState skill or repository source.

Publication remains a product decision. When a name exists, the next sequence is: choose package identity → publish a human-triggered prerelease → use it in one ordinary founder session → only then make npm primary and thin the plugin.

### Kinds and portable operating models

Kind, field, relationship, and enum-value descriptions have established the semantic foundation. Additional section examples, lifecycle constraints, or semantic reference rules should remain demand-driven by real recipe adoption. Avoid growing a general schema language speculatively.

### Pages and live behavior

The Page bridge, canonical live helper, navigation, sandbox boundary, and bundle-native authoring reference are sufficient for current use. Introduce a compatibility declaration when independently distributed Pages actually need to distinguish bridge/runtime versions; do not build a migration framework now.

### Ordered event backbone

Keep the ordered, recoverable event backbone queued as a candidate. It becomes active only when multiple consumers require durable ordering/replay or the founders explicitly commit to it. Current SSE/live refresh is not represented as durable replay.

## Remaining architectural opportunities

The valuable opportunities are preserved, but none is an urgent new build at this stopping point:

1. Finish the Git package boundary already in progress.
2. Run the bounded mutation coverage audit after Git seam preparation settles.
3. Add minimal package/recipe/Page compatibility metadata at the first real external distribution need.
4. Prove founder-to-founder transfer of a portable operating model through the chosen future distribution channel.
5. Ratify or park the event backbone when real-time consumers create the need.

There is no evidence that AgentState Lite currently needs a rewrite, a second mutation system, a new schema language, or more hosted infrastructure. The highest-value work after the current Git unit is product use, naming/positioning, and observing where independently transferred recipes or Pages actually fail.

## Wake conditions

- **npm lane:** product/package name selected.
- **plugin thinning:** npm prerelease survives an ordinary founder session with rollback understood.
- **compatibility metadata:** an external recipe or Page has a real runtime-version dependency.
- **mutation implementation:** the audit identifies a concrete unowned read-dependent decision or dishonest receipt.
- **event backbone:** at least two live consumers need durable cursor replay, or Mike and Brian explicitly activate the candidate roadmap.

[distribution state](../roadmap-items/distribution-neutral-resources.md)

[clean-room evidence](npm-no-skill-dogfood-2026-07-15.md)

[Git architecture](../roadmap-items/board-git-package.md)

[mutation integrity](../roadmap-items/mutation-integrity.md)

[domain semantics](../roadmap-items/self-describing-domain-models.md)

[event candidate](../roadmap-items/real-time-event-backbone.md)
