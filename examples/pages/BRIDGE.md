---
type: Reference
title: Bundle Pages — the postMessage bridge (v0)
timestamp: "2026-07-09T00:00:00.000Z"
---

# Bundle Pages & the postMessage bridge (protocol `v0`)

A **bundle page** is a self-contained HTML file promoted into an agentstate-lite bundle as a
blob under `pages/…`, declared by a `type: Page` registry doc, and rendered by
`agentstate-lite ui` inside a **sandboxed iframe**. This is the gate-4 rethink direction
(`tasks/ui-pages-spike`): pages are bundle *content* — authored, versioned, attributed, and
synced like any other doc — and the shell is just a launcher + a data broker.

## Trust model (why a page can never touch a credential)

The `ui` server serves two privilege tiers on one loopback origin:

- **Data API** (`/v0/*`): reachable ONLY with the shell's per-run session token/cookie.
- **Page bytes** (`/__page/<nonce>`): a page's static HTML, served for a short-lived **nonce**
  the session-authed shell mints (`POST /__page/mint`) for that page's one blob key. The nonce
  is not the session token, so it is rejected by every data route; the session token does not
  open the page route to arbitrary keys.

The iframe is `sandbox="allow-scripts"` with **no** `allow-same-origin`, so the page runs at an
**opaque origin**. Combined with a strict per-page CSP (`connect-src 'none'`), the page **cannot
open any network request at all** — no fetch, XHR, WebSocket, or EventSource. Its only channel to
the outside is `postMessage` to the shell, which brokers a narrow, **read-only** request set on
its behalf. A leaked token would still be useless: there is no code path from the page to the API.

## Message shapes

Every message carries `bridge: "v0"`. A request carries an `id`; the reply echoes it as
`"<type>:result"` (or `"error"`). The shell drops any message whose `event.source` is not the
page's own iframe; the page drops any message whose `event.source` is not `window.parent`.

### Page → shell (requests)

| type        | payload                                                    | reply `result`                                             |
| ----------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `hello`     | —                                                          | `{ bundle: { root, name }, mode, protocol: "v0", grant: "read" }` |
| `query`     | `{ params: { type?, prefix?, field?, open?, limit? } }`    | `{ rows: DocHead[], count }`                               |
| `read`      | `{ docId }`                                                | `{ id, frontmatter, body }`                                |
| `edges`     | `{ params: { from?, to?, text? } }`                        | `{ edges: { from, to, text }[], count }`                   |
| `subscribe` | —                                                          | `{ ok: true }`, then a stream of `change` events          |

`DocHead` is `{ id, version, frontmatter }` — the same **head projection** `list` uses (full
frontmatter, never a body). `query` params:

- `type` / `prefix` — server-side facets (a bundle-relative id prefix, a frontmatter `type`).
- `field` — a client-side `key=value` filter; comma-separated values are OR (`status=todo,blocked`).
- `open` — drop terminal rows, derived from the BUNDLE'S OWN kind conventions exactly like
  `list --open`: a row is dropped iff the convention governing its `type` declares the row's
  current field value(s) terminal (`fields.terminal`, e.g. the Task kind's `done`/`canceled`).
  A row with no governing kind is kept; a bundle where no kind declares a terminal set filters
  nothing. (The shell loads the registry once per change from the server, which builds it with
  core's `loadKinds` — one registry, no bridge-side schema.)
- `limit` — cap the row count after filtering.

`edges` is the general graph query — the ONE primitive every edge-shaped question reduces to
(the same `queryEdges` atom `link list` is a CLI face over). `params`:

- `from` / `to` — each an exact concept id, a bundle-relative `prefix/` (trailing slash), or an
  array of either (union within the facet; giving both ANDs them). Omit a facet for "no
  restriction" — an empty/blank value is treated as omitted, not "match nothing".
- `text` — exact-match on the link's display text (never substring/regex).

Backlinks are `edges({ to: docId })`; a container's contents are `edges({ from: itemId, text:
"contains" })` (or whatever link text a bundle's convention uses) — there is no separate
backlinks-only bridge call. A source linking to the same target twice with different text yields
two rows (no dedup), matching `queryEdges`'s own granularity.

### Shell → page (server-initiated)

| type     | payload                                              |
| -------- | --------------------------------------------------- |
| `change` | `{ event: { changes: [{ id, version }], removed: [id] } }` |

`change` is pushed only to a page that has `subscribe`d. It is a **delta signal** — refetch with
`query` against it rather than trusting it as a full state. Removed ids have been deleted.

**There are no mutation messages in v0.** Read-only is enforced *by construction*: the shell
defines no write/delete/update handler, so any such request returns an `error` reply.

## Live updates

The shell (only) holds one `EventSource('/events')`. The server watches the bundle — `fs.watch`
in `--dir` mode, a poll in `--remote` mode — diffs content-addressed **version tokens**, and pushes
a change delta. The shell fans doc changes into subscribed pages as `change` events, and
**hot-reloads** a page's iframe (with a fresh nonce) when the page's own HTML blob changes. (Remote
page-blob hot-reload is a labeled follow-up; live doc updates work in both modes.)

## `bridge` — the enforced data/content split

The registry doc's `bridge` field decides whether the shell will answer THIS page's bridge
requests at all — and the shell, not the page, is what enforces it:

- `bridge: bundle-read` — a **data page**. The shell answers `hello`/`query`/`read`/`edges`/
  `subscribe` as described above.
- `bridge: none` — a **content page**. The shell replies to EVERY request type with a `FORBIDDEN`
  error, before touching any bundle data. Arbitrary self-contained HTML with no live data at all.
- The `Page` convention declares `bridge` REQUIRED — every page is an intentional
  classification, not a silent default. At runtime the shell still fails closed for a doc this
  convention didn't govern (an external bundle, a hand-edited file that skipped the lint): absent,
  malformed, or any other value is treated as `bridge: none`. A page only gets bundle access by
  declaring exactly `bundle-read`.

The launcher groups pages by this same field: "Dashboards" for `bundle-read`, "Documents" for
`none`.

## Authoring a page

1. Write a self-contained `.html` (inline CSS/JS, no external hosts). A data page embeds a copy of
   the ~30-line bridge client below; a content page (`bridge: none`) has no use for it — every
   call it made would come back `FORBIDDEN`.
2. Promote it as a blob: `agentstate-lite promote my-page.html --doc-key pages/my-page.html`.
3. Declare a registry doc: a `type: Page` doc with `title`, `entry: pages/my-page.html`, either
   `bridge: none` or `bridge: bundle-read` (required), and an optional `description`. Promote it:
   `--doc-key pages-registry/my-page.md`.
4. Declare the `Page` convention once per bundle (`conventions/page.md`, `governs: Page`).

The seed pages here are working examples: `pulse.html`/`roadmap.html` are `bridge: bundle-read`
data pages — `roadmap.html` is the one that exercises the `edges` request end-to-end (a live graph
view of Roadmap Items and the tasks each one `contains`) — and `about.html` is a `bridge: none`
content page (no bridge calls at all). `demo.sh` (repo only) wires all of this over a scratch copy
of this repo's own board.

## The bridge client (embedded copy)

```js
(function () {
  var PROTO = "v0", seq = 0, pending = {}, subs = [];
  function send(type, extra) {
    return new Promise(function (resolve, reject) {
      var id = String(++seq);
      pending[id] = { resolve: resolve, reject: reject };
      var msg = { bridge: PROTO, id: id, type: type };
      if (extra) for (var k in extra) msg[k] = extra[k];
      parent.postMessage(msg, "*"); // parent origin is opaque to us; the shell validates by source
    });
  }
  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return; // only trust the shell
    var m = e.data;
    if (!m || m.bridge !== PROTO) return;
    if (m.type === "change") { subs.forEach(function (cb) { cb(m.event); }); return; }
    var p = pending[m.id];
    if (!p) return;
    delete pending[m.id];
    if (m.type === "error") p.reject(new Error((m.error && m.error.message) || "bridge error"));
    else p.resolve(m.result);
  });
  window.Bridge = {
    hello: function () { return send("hello"); },
    query: function (params) { return send("query", { params: params }); },
    read: function (docId) { return send("read", { docId: docId }); },
    edges: function (params) { return send("edges", { params: params }); },
    subscribe: function (cb) { subs.push(cb); return send("subscribe"); }
  };
})();
```
