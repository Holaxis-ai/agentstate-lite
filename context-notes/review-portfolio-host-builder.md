---
type: Context Note
title: Review portfolio host builder
actor: bridge-host-builder
timestamp: '2026-08-08T18:02:33.717Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** repair the owning v0 edge-selector parser and rejected-envelope liveness only after executable regressions expose both defects; this serves the ultimate goal by keeping opaque identity and transport termination in one host authority instead of relying on View-local workarounds.

## B1 red-gate boundary

Host/source B1 is complete. Tests were added first to `packages/core/test/pure.test.ts`, `packages/core/test/query-edges.test.ts`, and `packages/view-runtime/test/bridge.test.mjs`; no production source or reference prose had been edited when the red receipt was captured.

Commands and outcomes:

```sh
npm run build
node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/pure.test.ts ./packages/core/test/query-edges.test.ts
npm test -w @agentstate-lite/view-runtime
```

- Root build passed on unchanged production source.
- Core contract tests passed 35/35. They pin exact safe boundary IDs, relation-text exactness, `to: "reviews/ "` as an exact non-prefix selector, and duplicate-selector non-multiplication.
- View-runtime failed 3/28 at the intended boundaries: a leading-space selector was returned trimmed; the service disagreed with direct core rows for the same selector; and a rejected plain v0 envelope returned `id: undefined` instead of its valid bounded supplied id.
- Bounded combined receipt: `/private/tmp/review-portfolio-host-red.log`.

The first draft of the core fixture tried to derive an edge whose target ID itself ended in a space. That edge cannot be authored through the existing Markdown-link resolver, a separately acknowledged scope boundary. The fixture was corrected before the authoritative receipt: a `reviews/other` edge proves that exact `to: "reviews/ "` returns none while the buggy trimmed `reviews/` selector widens to the prefix. This tests the owning selector distinction without claiming broader link-emission parity.

## Next action and constraints

Claim B2, minimally preserve each raw nonblank `from`/`to`/`text` string within the existing byte/cardinality grammar, and recover an invalid request id only from a plain v0 record with string type through the existing `requestId` helper. The parse-failure path must remain before launch resolution and bundle work. Correct the three authoritative example references, regenerate only the npm target, and keep plugin-owned bytes/manifests untouched.

## B2 green boundary

B2 is complete. The production change is deliberately small: `selector` now returns each exact original nonblank string while applying the byte limit to that original string; `text` follows the same rule; and `invalidV0RequestId` reuses `isPlainRecord`, `BRIDGE_PROTOCOL`, and the existing `requestId` primitive. `BridgeService.handle` invokes that helper only after full parsing has failed and before any launch lookup. It emits the same generic v0 `USAGE` envelope and does not echo type, params, payload, parser detail, launch state, or bundle state.

The three authoritative example sources are byte-identical after correction. The npm generator projected only the two references declared in the npm distribution manifest; `packages/cli/SKILL.md` remained unchanged and the drift gate passed. Plugin-target generation and plugin-bundle build were not run.

Green commands and outcomes:

```sh
npm run build
node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/pure.test.ts ./packages/core/test/query-edges.test.ts
npm test -w @agentstate-lite/view-runtime
npm run gen:skill -w @holaxis/aslite
npm run check:skill -w @holaxis/aslite
```

- Root build: exit 0.
- Core focused suite: 35/35 passed.
- View-runtime suite: 28/28 passed, including all three new owning contract tests.
- Npm skill projection and drift check: exit 0; generated output current.
- Bounded receipt: `/private/tmp/review-portfolio-host-green.log`.

Residual risks are explicit. This repair does not change `query.prefix` normalization or Markdown link-emission whitespace behavior. A 500-Review portfolio still requires bounded repeated graph scans in the candidate View lane; this host lane only makes every admitted batch exact and every rejected valid-v0 request settle. Full-repository gates, independent exact-SHA review, adversarial QA, and host-first/View-second rollout remain downstream gates.
