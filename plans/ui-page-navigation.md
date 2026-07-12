---
type: Plan
title: Bundle Page navigation — implementation design
actor: openai/codex
timestamp: '2026-07-12T00:52:06.443Z'
---
# Bundle Page navigation — implementation design

**Status:** Proposed design for independent review. Code base: `origin/main` at `be38280` after PR #39 and plugin 1.0.36 regeneration.

## Behavioral claim

A framed bundle Page may ask the trusted shell to navigate to another registered `type: Page` by concept id. It cannot provide a URL, blob key, or HTML; cannot read bundle data through this action; and cannot mutate the bundle. The target mounts through the ordinary Page route, so it receives its own registry resolution, nonce, sandbox, CSP, and `bridge` capability.

The action is available to `bridge: none` and `bridge: bundle-read` Pages. Existing data operations remain exclusive to `bundle-read`.

## Protocol

Request:

```json
{
  "bridge": "v0",
  "id": "7",
  "type": "open-page",
  "pageId": "pages-registry/architecture"
}
```

Successful router outcome:

```json
{
  "reply": {
    "bridge": "v0",
    "id": "7",
    "type": "open-page:result",
    "result": { "pageId": "pages-registry/architecture" }
  },
  "openPageId": "pages-registry/architecture"
}
```

The embedded helper exposes `Bridge.openPage(pageId)`. Navigation is the observable success; callers should fire-and-forget because the source frame may unload before it observes the acknowledgement.

## Owning boundaries

### Bridge router

`packages/ui/src/pages/bridge.ts` remains the one protocol router.

- Recognize exactly `open-page` before the `bundle-read` capability gate. It is a shell action, not bundle-data access.
- Require a non-empty string concept id strictly under `pages-registry/`.
- Reject URLs, leading slash, `.md` paths, query/hash suffixes, backslashes, empty suffixes, sibling-prefix lookalikes, and traversal segments before any dependency call.
- Resolve the target through one injected boolean/narrow result dependency; never return its document, frontmatter, body, entry key, bytes, or nonce to the source Page.
- Return `USAGE` for malformed ids and a stable not-found/invalid-target error for targets that are not usable registered Pages.
- All existing data and mutation-shaped requests retain their current capability behavior.

### Registered Page resolver

Place one shared registered-Page parser/guard in `packages/ui/src/api/pages.ts` and consume it from launcher projection, target resolution, and `PageFrame.loadPage`. Today the launcher query supplies `type: Page`, but a direct Page route checks only `entry`; the shared guard prevents navigation and deep links from developing different definitions of “registered Page.”

A target is registered only when:

- the exact id is strictly under `pages-registry/` and passed syntactic validation;
- the document exists;
- `frontmatter.type === "Page"`;
- `entry` is a non-empty string.

The navigation resolver returns only success/failure. The newly mounted `PageFrame` re-reads the document and applies the same guard before minting, which closes time-of-check/time-of-use changes and also prevents a direct deep link to a non-Page document from framing a blob merely because it copied a valid Page's `entry`.

### PageFrame

`packages/ui/src/views/PageFrame.tsx` continues to own:

- postMessage source validation;
- source Page generation fencing;
- reply delivery;
- DOM/shell navigation.

After `handleBridgeRequest` resolves, first verify that the captured source generation still equals `loadSeqRef.current`. If stale, send no reply and do not navigate. Otherwise post the correlated reply and call the existing `navigate({ view: "page", id })`, which uses `history.pushState`; browser Back/Forward returns to the originating Page.

No new route or direct URL construction is introduced.

## Capability behavior

| Source capability | `open-page` | `hello/query/read/edges/subscribe` | mutation-shaped/unknown requests |
| --- | --- | --- | --- |
| `none` | allowed after registered-target validation | `FORBIDDEN`, no data deps | error, no mutation |
| `bundle-read` | allowed after registered-target validation | unchanged | error, no mutation |

Navigation does not cause capability inheritance. The target is opened as a new ordinary Page and receives only its own registry-declared capability.

## Adversarial contract

Reject without navigation:

- missing, non-string, or blank `pageId`;
- `pages-registry/` with no suffix;
- `pages-registryevil/x`;
- `docs/core` or another non-Page namespace;
- `/pages-registry/x`;
- `pages-registry/x.md`;
- query/hash suffixes;
- backslashes;
- literal or encoded traversal;
- arbitrary URLs and blob keys;
- nonexistent ids;
- existing non-Page documents;
- Page documents with missing or blank `entry`.

Nested ids under `pages-registry/` remain valid when they are valid concept ids.

If source Page reload/revocation occurs while target validation is in flight, the existing epoch fence drops both the reply and navigation.

## Exact implementation surface

1. `packages/ui/src/pages/bridge.ts` — request field, id validation, resolver dependency, navigation outcome, capability carveout, error reference.
2. `packages/ui/src/api/pages.ts` — one shared registered-Page parser/guard plus narrow navigation resolver.
3. `packages/ui/src/views/PageFrame.tsx` — reuse the guard while loading, inject the resolver, and perform fenced shell navigation.
4. `packages/ui/src/pages/bridge.test.ts` — both capabilities, malformed ids, exact carveout, no data-dep regressions.
5. `packages/ui/src/api/pages.test.ts` — id/type/entry resolution and the shared registered-Page definition.
6. `packages/ui/src/views/PageFrame.test.tsx` — successful navigation, stale async outcome suppression, and refusal to frame a non-Page deep link that reuses a valid entry.
7. `packages/ui/e2e/pages.spec.ts` and fixture as needed — real content Page opens a data Page; URL changes; target operates under its own capability; browser Back returns; invalid target stays put.
8. `examples/pages/BRIDGE.md` and embedded example clients — contract and `openPage` helper.
9. `examples/pages/about.html` — content-page navigation demonstration.
10. `examples/pages/conventions/page.md` — `none` denies bundle-data operations but permits registered Page navigation.
11. Generated CLI skill/reference prose whose source currently says “five request types” or says a content Page has no use for the client. Regenerate only PR-owned text outputs; do not touch bot-owned compiled plugin bundle or manifest versions.

## Non-goals

- Page embedding or nested iframes.
- Blob/HTML reads.
- Arbitrary URL navigation.
- New routes.
- Bundle mutation or review approval actions.
- Review Request Kind or UI implementation.

## Verification

- Root build first in the isolated worktree.
- Focused bridge, Page API, PageFrame, routing, and browser tests.
- `npm run typecheck`.
- Full `npm run check` after independent review, on the exact reviewed SHA.
- `git diff --check` and inspection that bot-owned bundle/manifests are untouched.

[plan for](../tasks/ui-page-navigation.md)
