---
type: Context Note
title: Review portfolio command-rendering system model
actor: codex-orchestrator
timestamp: '2026-08-08T16:06:56.804Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions are easy to find and whose guidance is safe across flexible OKF content.

**Proximate goal:** correct the Review portfolio's complete-evidence guidance at the representation boundary rather than applying another string-specific patch; this serves the ultimate goal by preserving open-world document identity all the way from bundle data to human action.

## Whole-system description

The system has six relevant components. The OKF bundle stores document IDs and graph edges; IDs are opaque identity values rather than filename slugs or shell tokens. The trusted bundle shell exposes those values to an approved, read-only View through the postMessage bridge. Before any bundle operation, the bridge parser validates each request against the shipped v0 message grammar; `query` and `edges` deliberately accept different parameter sets. The View queries records and bidirectional edge sets, classifies completeness from returned arrays and counts, and renders incomplete evidence as non-authoritative. When live evidence remains partial, the View presents a human-operated CLI recovery subcommand. The human combines that subcommand with the agentstate-lite invocation available in the current installation channel and may enter it in a POSIX shell, where tokenization and option parsing are governed by the shell and the CLI parser rather than by OKF.

The interaction order is: subscribe before the initial snapshot; query capped Review/Review Request rows; request only v0-valid outbound and inbound edge facets for the returned Reviews; validate every result shape and exact array/count agreement before asserting graph completeness; select a Review or Review Request; start a detail generation; request only v0-valid outbound and inbound edge facets; discard responses for obsolete generations; classify rejection, invalid/unknown/contradictory count, bridge truncation, or local display truncation; render accurate counts plus a retry; and, if completeness is still unavailable, offer an uncapped CLI subcommand for the selected ID. External state includes the current bundle head, the shipped parser/service contract, bridge response arrays and counts, a potentially changing selection/generation, the installation-specific CLI invocation, the CLI's argument parser, and the operator's shell.

## Invariants

- An OKF ID remains opaque data. It is never inferred from path/title and never assumed to be a shell-safe token.
- A displayed subcommand must preserve one exact ID argument even when the ID contains whitespace, quotes, or option-like prefixes; it must not claim that a bare executable name is portable across installation channels.
- CLI options precede an explicit option terminator; the ID follows as data and is POSIX-shell quoted with embedded quotes escaped.
- Command construction is centralized in a small pure helper whose behavior is exercised with representative open-world IDs.
- Bridge requests contain only fields admitted by the shipped contract. Fake bridge fixtures do not substitute for a real `parseBridgeRequest`/service-contract probe.
- A result count is usable only when it is a finite nonnegative integer and exactly equals the returned array length. Missing, overreported, underreported, fractional, infinite, negative, or otherwise contradictory counts fail closed.
- All user-controlled values enter the DOM through text nodes or `textContent`; the View does not execute the displayed command.
- Retry remains read-only, generation-guarded, and incapable of turning partial evidence into currentness.
- The relation completeness warning and accurate counts remain unchanged; recovery guidance appears for every rejected, missing-count, bridge-truncated, or locally truncated result.

## Diagnosis and next action

The previous repair correctly modeled several evidence-completeness cases but its fake bridge accepted a request field that the real v0 parser rejects, its shared count predicate treated some contradictory results as complete, and its recovery string crossed two representation boundaries incorrectly: it assumed one executable-discovery channel and concatenated an opaque OKF ID into shell syntax. These are model defects, not isolated formatting defects. The next repair must remove unsupported edge fields, centralize strict count/array agreement, add one shell-quoting/subcommand-construction primitive, use the parser-safe option order and terminator, and run a real host-contract probe plus all prior transformed-source, security, and open-world fixtures before exact re-review. No schema restriction on IDs and no expansion of the bridge protocol is an acceptable fix.

## Final independent-gate discovery and scope boundary

The exact `70ee30c9…` View closes the unsupported-field, count-integrity, and recovery-command defects, and the portability and provenance reviewers approve it. The security reviewer reproduced two remaining cross-layer failures that the current bundle contains too few Reviews to expose:

- the portfolio may query up to 500 Review rows, but one v0 edge selector admits at most 32 values; a 33-value request is rejected before a correlatable response and can leave the initial snapshot pending; and
- the owning v0 selector parser trims leading/trailing whitespace from core-valid opaque concept IDs. A numerically complete response can therefore describe a different identity and permit a false standalone-currentness conclusion.

The first failure requires bounded batching and aggregate validation in the View. The second is not honestly solved by restricting Review IDs or duplicating an identity codec in bundle HTML; the owning parser must use trimming only to reject all-whitespace selectors while preserving the exact nonblank string. That is a source-code/protocol-implementation change outside the accepted bundle-only implementation contract. It requires a feature branch, core/view-runtime regression tests, independent code review before QA, and then renewed exact View review and scratch/browser QA. Until the user authorizes that scope expansion, the implementation-review and umbrella Tasks are blocked; no approval Review or QA addendum may be recorded.
