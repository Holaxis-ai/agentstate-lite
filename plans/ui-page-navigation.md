---
type: Plan
title: Bundle Page navigation — implementation design
actor: openai/codex
timestamp: '2026-07-12T00:56:24.351Z'
---
# Bundle Page navigation — implementation design

**Status:** Proposed design for independent review. Code base: `origin/main` at `be38280` after PR #39 and plugin 1.0.36 regeneration.

## Behavioral claim

A framed bundle Page may ask the trusted shell to navigate to another registered `type: Page` by concept id. It cannot provide a URL, blob key, or HTML; cannot read bundle data through this action; and cannot mutate the bundle. The target mounts through the ordinary Page route, so it receives its own registry resolution, nonce, sandbox, CSP, and `bridge` capability.

The action is available to `bridge: none` and `bridge: bundle-read` Pages. Existing document/body/frontmatter/blob data operations remain exclusive to `bundle-read`. Navigation validation is an explicit narrow exception: a source Page can learn whether one caller-supplied Page registry id is a usable target through navigation or failure, but receives none of that target's content or metadata.

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
  "reply": null,
  "openPageId": "pages-registry/architecture"
}
```

The embedded helper exposes `Bridge.openPage(pageId)` as a `void`, fire-and-forget action implemented separately from the reply-tracked `send()` helper. Navigation or trusted shell error state is the observable result; the source frame may unload immediately, so the contract must not create a Promise that can remain pending or encourage `await Bridge.openPage()`.

## Owning boundaries

### Bridge router

`packages/ui/src/pages/bridge.ts` remains the one protocol router.

- Recognize exactly `open-page` before the `bundle-read` capability gate. It is a shell action, not bundle-data access.
- Require a concept id accepted by the one neutral Page-registry grammar described below.
- Reject URLs, leading slash, `.md` paths, query/hash suffixes, percent escapes, backslashes, empty suffixes, sibling-prefix lookalikes, and dot/traversal segments before any dependency call.
- Resolve the target through one injected boolean/narrow result dependency; never return its document, frontmatter, body, entry key, bytes, or nonce to the source Page.
- Return `USAGE` for malformed ids and a stable not-found/invalid-target error for targets that are not usable registered Pages. Errors may be posted for diagnostics but are not a reliable caller Promise API.
- All existing data and mutation-shaped requests retain their current capability behavior.

### Neutral Page-registry authority

Create a pure neutral module such as `packages/ui/src/pages/registry.ts`. It owns `isPageRegistryId`, safe Page-entry grammar, `parseRegisteredPage`, and the `bridge` capability parser now living in `bridge.ts`. This avoids a dependency cycle (`api/pages.ts` already imports bridge capability parsing) and prevents the router, launcher, resolver, and direct Page load from duplicating the security definition.

Consume this module from `api/pages.ts`, `bridge.ts`, and `PageFrame`.

A target is registered only when:

- the exact id is strictly under `pages-registry/` and contains only non-empty, non-dot path segments; it contains no leading slash, backslash, percent escape, query/hash, URL syntax, or `.md` suffix;
- the document exists;
- `frontmatter.type === "Page"`;
- `entry` is a safe blob key strictly under `pages/` using the same conservative segment grammar.

The navigation resolver returns only success/failure. The newly mounted `PageFrame` re-reads the document and applies the same guard before minting, which closes time-of-check/time-of-use changes and also prevents a direct deep link to a non-Page document from framing a blob merely because it copied a valid Page's `entry`.

### PageFrame

`packages/ui/src/views/PageFrame.tsx` continues to own:

- postMessage source validation;
- source Page generation fencing;
- reply delivery;
- DOM/shell navigation.

After `handleBridgeRequest` resolves, first verify that the captured source generation still equals `loadSeqRef.current`. If stale, send no reply and do not navigate.

Navigation is at most once per source generation:

- If the target equals the current `pageId`, treat it as an idempotent no-op with no `pushState`.
- For the first accepted non-self target, synchronously advance/invalidate the source generation and reset its capability/subscription before calling `navigate({ view: "page", id })`.
- Any concurrently resolving outcomes captured under the old generation then drop before they can push additional history.

The existing router uses `history.pushState`; browser Back/Forward returns to the originating Page. No success acknowledgement is required before unmount.

No new route or direct URL construction is introduced.

## Capability behavior

| Source capability | `open-page` | `hello/query/read/edges/subscribe` | mutation-shaped/unknown requests |
| --- | --- | --- | --- |
| `none` | allowed after registered-target validation; bounded target-existence oracle | `FORBIDDEN`, no data deps | error, no mutation |
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
- literal traversal or any percent escape;
- arbitrary URLs and blob keys;
- nonexistent ids;
- existing non-Page documents;
- Page documents with missing or blank `entry`.

Nested ids under `pages-registry/` remain valid when they are valid concept ids.

If source Page reload/revocation occurs while target validation is in flight, the existing epoch fence drops both the reply and navigation. If multiple valid navigation requests resolve from one source generation, only the first non-self target may navigate. Self-navigation never grows history.

## Exact implementation surface

1. `packages/ui/src/pages/registry.ts` — one pure authority for registry-id grammar, entry grammar, registered-Page parsing, and bridge capability parsing.
2. `packages/ui/src/pages/bridge.ts` — request field, resolver dependency, navigation outcome, exact capability carveout, and errors.
3. `packages/ui/src/api/pages.ts` — consume the registry authority for launcher projection and narrow target resolution.
4. `packages/ui/src/views/PageFrame.tsx` — reuse the parser while loading, inject the resolver, and perform one-shot fenced shell navigation.
5. `packages/ui/src/pages/registry.test.ts` — grammar, type, entry, and capability parsing.
6. `packages/ui/src/pages/bridge.test.ts` — both capabilities, malformed ids with resolver-not-called, exact carveout, no data-dep regressions.
7. `packages/ui/src/api/pages.test.ts` — target resolution through the shared registered-Page definition.
8. `packages/ui/src/views/PageFrame.test.tsx` — successful navigation, concurrent one-shot behavior, self-navigation no-op, stale async suppression, validation-to-mount TOCTOU, and refusal to frame a non-Page deep link that reuses a valid entry.
9. `packages/ui/e2e/pages.spec.ts` and fixture as needed — real content Page opens a data Page; URL changes; target operates under its own capability; browser Back/Forward returns; invalid target stays put.
10. `examples/pages/BRIDGE.md` and embedded example clients — contract and void `openPage` helper.
11. `examples/pages/about.html` — content-page navigation demonstration; add it and its registry doc to the shipped reference manifest and distribution completeness tests.
12. `examples/pages/conventions/page.md` — `none` denies bundle data but permits registered Page validation/navigation.
13. Generated CLI skill/reference prose whose source currently says “five requests,” “every request forbidden,” or says a content Page has no use for the client. Regenerate PR-owned `packages/cli/SKILL.md`; do not touch bot-owned compiled plugin bundle or manifest versions.

## Non-goals

- Page embedding or nested iframes.
- Blob/HTML reads.
- Arbitrary URL navigation.
- New routes.
- Bundle mutation or review approval actions.
- Review Request Kind or UI implementation.
- Immediate navigation acknowledgement guarantees.

## Verification

- Root build first in the isolated worktree.
- Focused registry, bridge, Page API, PageFrame, routing, and browser tests, including malformed-id resolver-not-called, concurrent one-shot, self-navigation, TOCTOU revalidation, the `bridge:none` existence-oracle carveout, and target-owned capability.
- `npm run typecheck`.
- Full `npm run check` after independent review, on the exact reviewed SHA.
- `git diff --check` and inspection that bot-owned bundle/manifests are untouched.

[plan for](../tasks/ui-page-navigation.md)
