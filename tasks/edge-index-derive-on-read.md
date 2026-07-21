---
type: Task
title: 'Persistent edge index: stop re-parsing the whole bundle on every edge read'
status: todo
priority: '3'
actor: mike/claude
timestamp: '2026-07-21T21:31:04.539Z'
---
# Behavioral claim

The bundle's derived edge list is served without re-parsing every document on every read. Today
`queryEdges` (core/src/bundle.ts) walks the WHOLE bundle — `query(bundle)` parses every doc's
frontmatter+body to extract links — on each call, so a graph-consuming read is O(bundle). This
task introduces a persistent (or memoized) edge index so edge reads are sub-linear in bundle
size, WITHOUT changing the derived-not-stored contract (backlinks stay derived; §3 gate 2).

# Why (recorded, not yet urgent)

Surfaced in the relationship-reader retrospective (context-notes/relreader-code-review): a doc
reader page render now calls `queryEdges` TWICE (outbound `{from}` + backlinks `{to}`), each a
full-bundle walk. Fine at the current ~372 docs (tens of ms), explicitly adjudicated acceptable
by the design review — but it is an O(bundle) cost per page render, and the shell's home/browse
surfaces (designs/document-discovery) will lean on edges more. This is the derive-on-read edge
model's real scaling ceiling. Deliberately DEFERRED at the retrospective: premature to build a
caching/invalidation subsystem against a non-problem at this size. Wake it when a real bundle's
edge reads are measurably slow, or when the browse/containment-outline work (designs/
document-discovery Idea 3) multiplies edge queries per render.

# Scope (when woken)

- An edge index keyed to content-addressed versions, invalidated per-doc on write (the
  FilesystemBackend/MemoryBackend version tokens are the natural cache key — a doc's edges change
  iff its bytes change). Reused by `queryEdges`, backlinks, and the `status` graph lints.
- Must preserve: backlinks DERIVED never stored (gate 2); per-literal-link counts (the pinned
  duplicate-edge semantics the relationship reader depends on for dedupe); the one edge-derivation
  path (no second link parser — gate 3).
- Remote/wire consideration: a capable remote backend may serve edges directly (queryEdges rides
  query+readMany today); the index belongs BELOW the seam so remote adapters can implement their
  own, mirroring how heads projection works.

# Non-goals

- Do NOT change the edge model's semantics (still `{from,to,text}` per-literal-link, broken links
  are valid edges).
- Not a graph database; the simplest correct memoization that removes the per-read full walk.

# Trigger

Measured slowness on a real bundle, OR the browse/outline work in designs/document-discovery
pushing edge queries per render high enough to matter. Until then: recorded, parked.

[the retrospective that filed this](../context-notes/relreader-code-review.md)

[the surfaces that will lean on edges](../designs/document-discovery.md)
