---
type: Task
title: Centralize document meaningful-change time lookup
status: todo
priority: '2'
actor: openai/codex
timestamp: '2026-08-08T02:28:30.133Z'
---
# Objective

Give semantic document-time consumers one browser-safe, pure lookup authority while preserving current v0.1 behavior exactly.

# Scope

- Add one internal core accessor for the raw document meaningful-change-time value.
- In this unit, the accessor returns exactly the existing top-level timestamp value. It performs no generated.at preference, date parsing, normalization, or bundle-version inference.
- Route semantic consumers through it: core freshness, CLI home recent-document ordering, UI activity/browse/document recency display, and View catalog metadata where applicable.
- Keep the helper browser-safe so the UI can consume it through a narrow core subpath without importing Node-backed core modules.
- Preserve each consumers current treatment of missing, blank, malformed, and tied timestamps and preserve every public output shape.

# Explicit exclusions

- Do not change writes, mutation clocks, the frontmatter parser, raw CLI list/query timestamp fields, server wire projections, or v0.2 authoring claims.
- Do not route StorageBackend VersionInfo timestamps through this accessor. VersionInfo.timestamp means when a revision was recorded; document meaningful-change time is a different clock. The FilesystemBackend fallback behavior requires separate adjudication rather than being entrenched here.
- Do not decide whether future generated.at preference is edition-aware or shape-based. Current document/head values do not carry bundle edition, so that policy belongs with the v0.2 contract.

# Acceptance

- All selected consumers produce byte-, ordering-, label-, and verdict-identical v0.1 results.
- One executable agreement table covers missing, blank, malformed, tied, and valid timestamps across the semantic projections where practical.
- The accessor is pure, internal, and narrow; no policy registry or version-dispatch framework is introduced.
- A future v0.2 unit can change field selection in this authority once edition context is decided, without duplicating generated.at traversal in each consumer.
