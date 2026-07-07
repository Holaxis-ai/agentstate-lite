---
type: Research
title: UI walking-skeleton spike — findings
timestamp: '2026-07-06T16:48:36.282Z'
---
# UI walking-skeleton spike — findings

**2026-07-05. Disposable spike (`research/ui-spike/index.html` — one self-contained HTML page,
no framework, no build, no external resources) run against a local `serve()` bundle and probed
against the production Worker. Feeds `plans/ui-v1.md`. The page: renders `/v0/capabilities`,
`whoami` (degrading on the reference server, which has no auth routes), the task board via the
push-down list, a CAS status-toggle per row, and a deliberate cross-origin probe.**

## Findings

1. **Same-origin "UI as promoted artifact" WORKS end to end on the reference server.**
   `promote index.html --doc-key ui/index.html` → `GET /v0/bundles/default/blobs/ui/index.html`
   serves `text/html; charset=utf-8`; the page's fetches hit the same origin, so CORS never
   exists as a concept. Board renders from `GET /docs?fields=frontmatter&type=Task` (thin rows —
   the item-38/39 path is exactly the board query).

2. **Production's fail-closed gate blocks this model twice over — the load-bearing serving
   finding.** (a) The UI shell itself cannot be served from the gated Worker today: every route
   401s without a key, including the blob route, so a login page cannot bootstrap from behind
   the login. (b) Cross-origin hosting is structurally out, not just unconfigured: the Worker
   sends ZERO `Access-Control-*` headers, and — decisive — an `OPTIONS` preflight (which
   browsers send WITHOUT credentials) is 401'd by the gate before any CORS layer could answer.
   Adding CORS therefore means re-ordering the auth gate; serving the UI SAME-ORIGIN via an
   unauthenticated wrangler static-assets binding (assets are served before the fetch handler)
   is the clean answer. **Recommendation: assets binding, same origin, no CORS ever.**

3. **The CAS loop is browser-shaped and honest.** The page's exact sequence — `GET /docs/{id}`
   (capture `X-Version`) → mutate → `PUT` with `If-Match` — verified byte-for-byte: fresh token
   → `200` + new `X-Version`; stale token → `412`. A UI can do optimistic concurrency with real
   conflict surfacing (refresh-and-retry) using nothing but the existing wire contract.
   `X-Version` is readable same-origin without any `Expose-Headers` configuration — one more
   point for same-origin.

4. **Endpoint gaps for UI v1 (all tolerable, none blocking):** no server-side backlinks (a graph
   view client-derives from full docs — fine at current scale, revisit with the deferred
   `GET /docs/{id}/backlinks`); no change feed (poll; the deferred watch/feed item stands);
   `whoami`/admin routes exist only on the Worker (the reference server 404s them — a UI dev
   loop against local `serve()` must degrade, as the spike page does).

5. **v0 auth ergonomics:** a pasted API key in `localStorage` against the real gate is workable
   for a small-team admin v1 (401 → key prompt). The real browser login is the recorded
   OIDC/JWKS verifier behind the `IdentityVerifier` seam (`docs/UI-CONTRACT.md`) — sequence it
   as its own unit alongside UI v1, not before it.

6. **Caveat:** the in-browser click-through ran as protocol-level verification (curl of the
   page's exact fetch sequences) — the Chrome extension was not connected in the spike session;
   the served page is a one-URL manual check
   (`http://127.0.0.1:4818/v0/bundles/default/blobs/ui/index.html` over a spike bundle).

## What the plan must settle (decision owners)

- **Serving:** wrangler assets binding on the existing Worker (recommended above) — needs a
  human-gated deploy when it lands.
- **Stack (Mike):** spike demonstrates a no-build page is viable; v1 could stay no-build/
  minimal-build to match the repo's zero-dep ethos, or adopt a framework.
- **IdP for OIDC (Mike):** Clerk/Auth0/Supabase/self-hosted — owner-account decision.
- **v1 scope (Mike):** recommended read-heavy: board + doc detail + graph; writes limited to
  status transitions (CAS toggle proven) + invite/member admin. Not a document editor.
- **Single-bundle v1:** yes — matches the deployment's honest single-bundle posture;
  information architecture stays workspace-ready without building multi-bundle.
