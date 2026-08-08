---
type: Context Note
title: Review portfolio bridge test research
actor: bridge-test-research
timestamp: '2026-08-08T17:40:26.880Z'
---
# Summary

Testing research complete. The smallest high-confidence architecture is four-layered: (1) pin core's opaque-ID contract, (2) extend the existing view-runtime parser/service test with a table-driven transport-and-correlation oracle, (3) create an exact-blob JSDOM harness that runs the real `BridgeService` for valid-path scale cases and a parser-validating fault broker for degraded responses, and (4) retain one real browser/scratch gate for exact-byte trust, sandbox/CSP, liveness, and portability. Source remained read-only; only this note was written.

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** design the smallest high-confidence parser/service/View test architecture and executable acceptance matrix for the Review portfolio bridge identity-and-scale repair; this serves the ultimate goal by making exact selector identity, correlated replies, complete graph aggregation, and fail-closed currentness mechanically testable before implementation.

## Confirmed baseline and gaps

The branch is `fix/review-portfolio-bridge-identity` at `56b5693d9aa205d9d65d8513ca07642fcbf596dc`, with a clean source worktree after inspection/build attempts.

1. `packages/view-runtime/src/bridge.ts:185-201` trims scalar and array entries, bounds the trimmed bytes, rejects empty arrays and arrays above 32, and preserves duplicates only after trimming. Direct built-authority probes showed `" reviews/x"` and `"reviews/x "` both parse as `"reviews/x"`; an all-whitespace scalar and a 33-item array return `null`; 32 items parse.
2. `BridgeService.handle` at `packages/view-runtime/src/bridge.ts:329-331` returns `USAGE` with `id: undefined` whenever full parsing fails. A direct service probe with valid v0 envelope/id `edge-33` plus 33 selectors returned an uncorrelated error exactly as reported.
3. Core owns a different, broader identity contract. `packages/core/src/paths.ts:65-89` uses `trim()` only to reject an all-whitespace ID; it otherwise retains boundary whitespace. Direct core probes accepted leading/trailing/internal spaces and rejected all-whitespace. Existing `packages/core/test/pure.test.ts:47-60,266-271` does not pin leading/trailing acceptance.
4. Core graph selection already preserves its input after canonical validation (`packages/core/src/bundle.ts:392-465`). Existing `packages/core/test/query-edges.test.ts:94-104,239-250` covers array union and alias rejection but not boundary-whitespace identity or literal duplicate selectors.
5. The only bridge parser test, `packages/view-runtime/test/bridge.test.mjs:17-86`, covers query and render-document grammar, not edges, byte boundaries, array cardinality, duplicates, parser-to-service agreement, or invalid-request correlation. The package test passes 25/25 after its dist was rebuilt.
6. Exact View `pages/reviews.html` is `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`, 50,182 bytes. At lines 204-233 it sends all Review ids in one outbound and one inbound array, validates only those two responses, then deduplicates exact `(from,to,text)` triples. The query cap is 500 (`:126`), so 33-500 records violate the parser bound. Currentness is correctly gated by `partial`, `rowsComplete`, and `edgesKnown` at `:379-426`, but there is no repository-owned exact-blob executable harness.
7. The shipped authoring reference says a blank selector is omitted, while current code rejects supplied blank/all-whitespace values and the system-model note says to reject them. The Task forbids changing v0 grammar. Acceptance should therefore preserve current grammar: an absent facet is omitted; a supplied empty/all-whitespace scalar or array entry is invalid. Update the canonical reference so it no longer promises omission, and document the existing maximum of 32 values. If the orchestrator instead chooses blank-as-omitted, that is a separate protocol-semantic change requiring explicit adjudication and new broad-query/security tests.

## Feedback infrastructure to add before implementation

### 1. Core identity pins

Extend `packages/core/test/pure.test.ts` with one table proving ordinary, internal-space, leading-space, trailing-space, quotes, option-like prefixes, and UTF-8 IDs are accepted exactly, while empty/all-whitespace remains rejected. Extend `packages/core/test/query-edges.test.ts` with a memory-bundle fixture containing distinct ordinary, leading-space, and trailing-space source IDs, each with a distinguishable edge. Assert scalar and array `from` selectors select only exact identities. Include duplicate exact selectors and an overlapping exact/prefix selector, proving matching remains set-like and never multiplies one literal edge.

These tests are upstream contract pins, not a new identity codec.

### 2. Parser/service table in the existing owning suite

Extend `packages/view-runtime/test/bridge.test.mjs`; do not create a parallel parser test package. Use the same case table for both `from` and `to`.

- Preserve exact nonblank scalars and array entries, including leading/trailing/internal spaces, quotes, option-looking strings, and newlines allowed by core.
- Supplied empty/all-whitespace scalars, empty arrays, or arrays containing an all-whitespace entry remain invalid; only an absent facet is omitted.
- Apply the 1,024-byte bound to the original exact UTF-8 string, not the trimmed form: 1,024 bytes pass unchanged; 1,025 fail. Include multibyte cases (`é`/emoji) and boundary spaces whose bytes count.
- Raw array cardinality remains 1-32. Thirty-two duplicates pass and remain present; 33 duplicates fail, so semantic dedup cannot bypass the transport bound.
- Add an actual `BridgeService` + `MemoryBackend` agreement fixture proving a leading/trailing-space selector reaches `queryEdges` unchanged and selects the distinct edge.
- Add invalid-envelope correlation rows: any invalid/unsupported v0 request with a valid bounded string `id` returns `USAGE` with the exact same `id`; missing/non-string/over-128-byte ids remain uncorrelatable. Assert no bundle/launch authority is touched merely to echo a client-supplied valid envelope id.

### 3. Exact View harness: real authority plus controlled faults

Before editing the blob, create a task-scoped Node/JSDOM test that accepts the pulled exact HTML path (for example through `REVIEW_PORTFOLIO_VIEW_HTML`) and runs that exact source, rather than reimplementing `makeReviewData` in the test.

Use two broker modes:

- **Real-authority mode:** every iframe message goes through the built `parseBridgeRequest`/`BridgeService` over a seeded `MemoryBackend`. Give every response a deadline so any lost correlation fails rather than hanging. This proves actual request grammar, exact identity, service semantics, and startup liveness for 0/1/32/33/500 Reviews.
- **Fault mode:** first require `parseBridgeRequest(message)` to succeed and preserve its `id`, then return deliberate batch rejection/partial/contradictory results. This proves View aggregation without inventing a permissive fake grammar.

Observe request logs and DOM output. Avoid a production-only test export or a second ID codec. A JSDOM broker is the fast iteration loop; the browser gate below remains the oracle for sandbox/CSP and real frame transport.

### 4. Real host/scratch gate

Add one small UI E2E row proving a data View that emits an invalid v0 request with a valid id receives a correlated error in the actual sandboxed frame broker, so the pending Promise rejects instead of hanging. The shared `BridgeService` owns semantics; this single projection check is enough unless review finds MCP-specific projection drift.

For exact View QA, copy the repaired HTML + unchanged registry + conventions into a new scratch bundle; seed at least the 33 boundary and a whitespace-bearing successor edge; approve exact bytes through trusted shell chrome; then verify CSP/sandbox, inert shared rendering, hostile metadata as text, live create/update/delete, selection removal, retry serialization, keyboard focus/actions, narrow layout, and exact-byte reapproval after a one-byte source change. Smoke the same registry id through the MCP View listing/launch surface without creating a second View implementation.

## Executable acceptance matrix

### Parser/core/service

| Case | Inputs | Required result |
| --- | --- | --- |
| Scalar exactness | ordinary plus leading/trailing/internal whitespace, quotes, `--x`, newline; test `from` and `to` | parsed/service selector is byte-for-byte identical; core selects only that identity |
| All-whitespace | `""`, spaces/tabs/newlines; scalar and array entry | supplied value rejected (`parseBridgeRequest === null`); absent facet alone is omitted |
| UTF-8 bound | exact raw values at 1,024 and 1,025 bytes, including multibyte and boundary spaces | 1,024 accepted unchanged; 1,025 rejected |
| Array cardinality | 1, 32, 33 values in both facets | 1/32 accepted; 33 rejected |
| Duplicate selectors | 32 identical selectors; 33 identical selectors | 32 preserved and service returns each literal edge once; 33 rejected |
| Query agreement | distinct `reviews/x`, ` reviews/x`, `reviews/x ` source docs | each selector returns only its matching edge; no normalization alias |
| Correlation | invalid params/extra field/33 array with valid v0 id | `error.code=USAGE`, reply id exactly equals request id, client settles/rejects before deadline |
| Malformed id | missing/non-string/>128-byte id | error stays uncorrelated and does not touch bundle state |

### Portfolio scale and aggregation

For N Reviews, assert exact per-direction batches and a bounded completion deadline:

| N | Outbound batches | Inbound batches | Required state |
| ---: | --- | --- | --- |
| 0 | none | none | empty graph synthesized as complete; no bridge edge call |
| 1 | `[1]` | `[1]` | complete, one call per direction |
| 32 | `[32]` | `[32]` | complete, one call per direction |
| 33 | `[32,1]` | `[32,1]` | complete only after all four calls settle |
| 500 | fifteen `32` + one `20` | same | 32 total calls, every Review id covered exactly once per direction, no hang |

Run the 33-record case with ordinary and boundary-whitespace IDs and assert logged arrays preserve each exact value.

### Degraded batches and dedup/currentness

Use at least two batches so the failure location is observable. In both directions, inject one case at a time: rejected Promise; missing/non-array `edges`; missing/non-numeric/negative/fractional/unsafe count; `count > rows.length` (partial/capped); `count < rows.length` (contradictory). Every case must keep visible safe data but set `edgesKnown:false`, `partial:true`, show the affected direction/batch, finish the refresh, and render **Effective conclusion not asserted**—never standalone/effective currentness.

Return the same exact `(from,to,text)` edge from outbound and inbound batches: it appears once after aggregation. Return the same `(from,to)` with different `text`: both remain, matching core per-literal-link semantics. Validate each batch before deduplication, so duplicate removal can never conceal a bad count. With all batches exact, one complete-line Review with no edges may still be standalone effective; a valid successor chain spanning batches must produce one historical predecessor and one effective terminus. A whitespace-bearing successor ID must participate in that chain under its exact identity.

After a complete snapshot, fail a later batch: last-good data may remain visible, but live status must be `not live`, currentness must be suppressed, retry must serialize with change events, and an obsolete detail generation must not overwrite a newer selection.

## Generated/distributed artifacts and commands

Source changes to view-runtime are built into ignored `packages/view-runtime/dist`, ignored UI/MCP generated modules, ignored CLI dist, and the npm tarball. The committed plugin bundle and plugin skill tree are bot-owned on merge; do not hand-edit/rebuild them or bump manifests in this PR.

If the authoring contract is corrected, edit canonical `examples/views/references/view-authoring-v0.md`, mechanically keep the two recipe reference sources byte-identical, and run only the npm-target generator:

```sh
npm run gen:skill -w @holaxis/aslite
npm run check:skill -w @holaxis/aslite
```

Do not run/commit `build:plugin-bundle` or the `--target skill` generator; CI's convergence bot owns those outputs.

Recommended focused sequence in a clean isolated worktree:

```sh
npm ci
npm run build
node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/pure.test.ts ./packages/core/test/query-edges.test.ts
npm test -w @agentstate-lite/view-runtime
REVIEW_PORTFOLIO_VIEW_HTML=/private/tmp/reviews-repaired.html node --test /private/tmp/review-portfolio-bridge-harness.test.mjs
npm run e2e:gate -w @agentstate-lite/ui
npm run check >/private/tmp/review-portfolio-check.log 2>&1
```

Check the final command's own exit code. The root `npm run check` covers build, typecheck, all workspace tests, scripts, exact npm-package proof, npm skill drift, MCP browser tests, and UI E2E. Mutation runs remain optional/on-demand. The committed plugin drift check is not a PR-side gate.

## Verification evidence and risks

- Current `npm test -w @agentstate-lite/view-runtime`: 25/25 pass after its dist build; this confirms the existing suite is green but does not reach the reported cases.
- A root `npm run build` attempt failed before a trustworthy full baseline because local `node_modules` lacks declared dev dependency `@types/js-yaml`; the resulting core TypeScript errors are environmental. `npm ls @types/js-yaml --depth=0` is empty while `packages/core/package.json` declares `3.12.10`. Run `npm ci` in the implementation/review worktree before trusting gates.
- The 32 constant is private to view-runtime and cannot be imported by bundle HTML. Document it and make the exact-blob harness route every emitted request through the real parser; that is the drift oracle.
- Do not assert aggregate completeness from summed counts alone. Every individual batch must pass shape/count equality first; only then combine and deduplicate.
- Service correlation must echo only the already client-supplied valid bounded id. It must not relax full parsing, authorize a malformed request, resolve a launch, or touch bundle data.
- Browser QA is still required because JSDOM cannot prove opaque origin, CSP enforcement, exact-byte approval/reapproval, or real postMessage source checks.

## Progress and confidence

Research objective complete. Next action is for the orchestrator to incorporate this matrix into the implementation plan, explicitly preserve/reconcile all-whitespace grammar, and require the red core/parser/service/View harness before Builder changes production source.

Confidence: **high** on source/test topology, reproduced defects, and the proposed fast feedback layers; **medium-high** on the exact placement/lifetime of the portfolio harness because the canonical View currently lives only in the shared bundle, not a code-branch source path.

## Exact evidence identities

- `packages/view-runtime/src/bridge.ts`: `1430be3af30e830ddd862ecfede9e7d9a494a5bdb63921c55641bff7fa941325`
- `packages/view-runtime/test/bridge.test.mjs`: `9877f915aa21df7d7c590962fd3ef1e885d9b413b1153abd702a1d74be95cd71`
- `packages/core/src/paths.ts`: `7915cc6962e0edfb5d5dbd97d1dd9df79206349ae8febc97ec1e13673945620e`
- `packages/core/test/pure.test.ts`: `8bb89878f41c04336733b3b4519f2fb55a6c7377c42651d9be69bf7ee0621d1d`
- `packages/core/test/query-edges.test.ts`: `dab00b3e174585ba4584bff797f19faebadc66d583f419d490f8c16983462e2e`
- exact portfolio View: `70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`
