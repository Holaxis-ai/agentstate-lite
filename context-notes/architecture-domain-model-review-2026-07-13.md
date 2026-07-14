---
type: Context Note
title: 'Architecture review: stable model vs bundle state'
actor: codex-main
timestamp: '2026-07-13T18:49:21.650Z'
---
# Summary

Final review of current main c92497a: the implemented architecture mostly establishes the intended semantic boundary. Convention docs under conventions/ with type Convention are parsed into one KindRegistry containing governed types, fields, paths, terminal/freshness rules, links, relationship descriptions, and inbound expectations. Ordinary documents remain versioned OkfDocuments whose arbitrary frontmatter carries changing field values; links remain Markdown bytes in document bodies and are derived into Link rows/backlinks; blobs remain disjoint opaque versioned byte state behind StorageBackend. Backends do not own kind semantics. Conventions are physically ordinary versioned bundle documents and can be CAS-mutated, so 'relatively stable' is governance/usage semantics, not immutability or a separate persistence tier; schema edits immediately re-interpret existing documents.

Correctness finding 1: relationship instance identity conflicts with the declared type carrier. Core queryEdges deliberately treats differently worded links between the same source and target as distinct edges, because display text is the relationship-type signal. CLI addLink declares any existing target link idempotent regardless of text. Empirical scratch result: with a citation link from document A to document B already present, asking link add to add a depends-on link between the same documents returned changed:false and link list still exposed only citation. This prevents adding a declared typed relation where an untyped or differently typed link to the target exists. Recommended invariant: link-add idempotency should be keyed by resolved target plus exact text, with a regression test.

Correctness finding 2 (lower risk): newCommand loads KindRegistry once for instance validation/help, then every --link calls addLink, whose lintLinkType loads the registry again. Multiple --link entries can therefore be evaluated against different convention snapshots and this contradicts CLAUDE.md's one-registry-per-invocation rule. Recommended seam: pass the already loaded registry (or a precomputed relationship declaration index) into addLink/lintLinkType.

Qualification, not necessarily a defect: relationship vocabulary is open-world/advisory. link add writes before linting and never blocks; new --link warns but persists undeclared types. This is consistent with permissive OKF and the ratified typed-links carrier decision's lint posture, but it should not be described as closed-world schema enforcement. If strict relation conformance is wanted, validation must happen before the write and the decision/docs/tests should be aligned.

Evidence: core targeted architecture suite passed 143/143; CLI targeted suite passed 138/138 after loopback binding was allowed (initial sandbox failures were all EPERM on 127.0.0.1, not test assertions). No implementation files changed. This note remains local/unsynced because the user requested a review, not publication.
## Review document update

The existing bundle Review Request `review-requests/kinds-and-descriptions-architecture` is now
finalized as `changes_requested` at version
`sha256:f4c25aa228a37fda4a2fa170f1d2902061394260dabd723fbe8808cad43b7c9f`.
Its original Context, Requested decision, and Acceptance criteria were preserved unchanged. The
Reviewer response contains the six required judgments, label and diagram audits,
blocking-versus-optional classification, completion checklist, and plain-language explanations for
each technically dense section. All completion items are checked, and the metadata includes the final
status and concise `decision_summary`. Approval can be reconsidered after the typed-link
materialization mismatch and stale explainer labels are corrected.
## Browser-rendering environment diagnosis

- discovery: Browser startup fails before executing Page or browser code with
  `codex/sandbox-state-meta: missing field sandboxPolicy`.
- type: environment
- context: The active Homebrew Codex CLI is `0.144.3`, while `.codex/config.toml` starts
  `/Applications/Codex.app/Contents/Resources/node_repl` and points it to the app-bundled Codex
  `0.133.0-alpha.1`. The newer host supports named `permissionProfile` metadata; strings in the older
  node-repl binary show that its sandbox-state contract requires legacy `sandboxPolicy`.
- implication: Update the macOS Codex/ChatGPT desktop app so its bundled `node_repl` and `codex` are
  compatible with the active CLI, then fully restart Codex sessions. Merely changing
  `CODEX_CLI_PATH` is insufficient because the old node-repl binary rejects the request before
  running JavaScript. A legacy-sandbox session may be a temporary workaround where policy permits.
