---
type: Research
title: OKF v0.2 compatibility audit
actor: openai/codex
timestamp: '2026-08-05T02:15:27.061Z'
---
# Verdict

AgentState Lite is an honest OKF v0.1 producer and a useful, permissive OKF v0.2 reader and
transporter. It is not yet a safe v0.2 author or mutator. The product should not change its default
version or public write-conformance claim until the v0.2 write contract is explicit.

This is not a broad rewrite. The generic document, link, and backend architecture already carries
most v0.2 data. The remaining work is concentrated at the semantic write boundary.

# Compatibility matrix

| Operation | v0.1 | v0.2 | Evidence |
| --- | --- | --- | --- |
| Read/list ordinary documents | Supported | Supported with semantic caveats | Upstream `acme_retail` bundle listed 9 documents with 0 malformed records |
| Preserve unknown frontmatter | Supported | Mostly supported | `generated`, `verified`, `sources`, `stale_after`, and Attested Computation fields parse and survive generic reads |
| Resolve body links | Supported | Supported | 15 upstream links resolved through the existing graph path |
| Local/remote backend agreement | Supported | Supported for reads | Local and reference-server JSON for the same v0.2 document were identical |
| Create a version-declared bundle | Supported | Unsafe claim | `init --okf-version 0.2` succeeds even though generated documents use v0.1 timestamps and AgentState workflow statuses |
| Mutate current content | Supported | Not safe | A title update left `generated.at` stale, preserved earlier verification, rewrote date scalars, and added legacy `timestamp`/`actor` fields |
| Freshness and recent-document behavior | Supported | Partial | Current freshness, home, and filesystem-history paths consult top-level `timestamp`, not `generated.at` |
| v0.2 lifecycle `status` | N/A | Semantically incompatible with current Kinds | v0.2 reserves `draft`, `stable`, and `deprecated`; AgentState uses `status` for task, roadmap, review, and claim lifecycles |

# Empirical probes

The audit ran against upstream `GoogleCloudPlatform/knowledge-catalog` commit
`599a24029400b32436bc58c425d722e8ad8d221f` and AgentState Lite commit
`8d0253a40bc00f9c7997e177a70b21f829769e8e`.

- The upstream `acme_retail` v0.2 bundle produced 9 readable documents, 0 malformed documents, 0
  unresolved links, and 15 resolved body-link edges.
- A local read and the reference wire-protocol server returned byte-identical JSON for
  `metrics/revenue`.
- Updating that document's title preserved the unknown v0.2 structures, but it did not update
  `generated.at`. It also changed `stale_after: 2026-12-31` into an ISO datetime, changed a source's
  `last_modified` date into a datetime, and appended AgentState's top-level `actor` and `timestamp`.
- Initializing with `--okf-version 0.2` and creating a Task yielded a root that declared v0.2 while
  the document used `status: todo` and a top-level `timestamp`.
- The current AgentState board contained 826 timestamped documents. 336 had a `status`; only 5 used
  one of v0.2's lifecycle values. The rest used product workflow values such as `todo`,
  `in_progress`, `done`, `queued`, and `active`.
- The repository build passed after the probes. No production code was changed by the audit.

# Semantic findings

## `generated.at` is the new meaningful-change clock

AgentState's `timestamp` already has nearly the same intended meaning, but the implementation writes
only the legacy top-level field. A v0.2 mutation must update `generated.at` so consumers can tell
whether verification applies to current content. It must not manufacture `generated.by` from the
CLI actor: mutation attribution and provenance identity are related but not equivalent claims.

The open upstream PR [#247](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/247)
reinforces this distinction by deriving trust only from verification events that apply to the
current `generated.at`.

## Date scalar preservation is an upstream and local concern

The current YAML parser resolves unquoted dates into JavaScript Date objects. Top-level normalization
then turns `stale_after` into a datetime, while nested values serialize as datetimes through JSON.
The upstream spec and its own example bundles are inconsistent about quoted date scalars. Upstream
issue [#240](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/240) already documents
the ambiguity. AgentState should avoid lossy mutation regardless of the upstream resolution.

## Global `status` is the decisive collision

OKF v0.2 gives `status` a global document-lifecycle meaning. AgentState Kinds already give the same
field type-specific workflow meanings. Unknown extension fields are allowed, but a conforming v0.2
consumer will not know that `status: todo` means Task workflow rather than document stability.

Silently renaming the AgentState field would break recipes and user data. Silently declaring v0.2
would mislead generic consumers. This should be reported upstream as concrete producer evidence and
resolved through a documented profile/namespacing decision before v0.2 authoring is enabled.

## Optional families mostly fit the existing architecture

`sources`, `verified`, Attested Computation, and path-valued resource fields can initially be
preserved as ordinary frontmatter. Body links already work. Richer path-edge discovery and trust
presentation are useful later consumer features, not prerequisites for honest minimal reading.

# Recommended policy

1. Keep the default and public authoring claim at OKF v0.1.
2. Describe current v0.2 support as permissive read/transport compatibility, not write conformance.
3. Reject unsupported `--okf-version` authoring claims until a version-specific writer exists.
4. Preserve legacy `timestamp` and `# Citations` when reading; do not force eager migration.
5. Resolve the `status` collision and provenance policy before implementing v0.2 writes.
6. Pin the eventual writer with local, memory, and reference-server agreement fixtures.
7. Publish the status/date/provenance findings upstream before proposing a broad format patch.

# Sources

- [OKF v0.2 specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [OKF v0.2 release announcement](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals/)
- [Date scalar ambiguity issue](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/240)
- [Minor-version compatibility issue](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/239)
- [Current-content trust PR](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/247)
- [Typed relationships issue](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/148)
