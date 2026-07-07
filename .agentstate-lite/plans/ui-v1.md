---
type: Plan
title: UI v1 — binding plan
timestamp: '2026-07-06T16:48:33.252Z'
---
# UI v1 — binding plan

**Status: rev 3 — DIRECTION PIVOT (2026-07-05). The Cloudflare Access approach (rev 2 below)
was BUILT, deployed, reached the edge, and then RETIRED on the merits — see STATUS item 44
for the full rationale. The rev-2 body below is kept for history but is SUPERSEDED; do not
build it. The Access-specific code, apps, and setup script were removed and prod redeployed
clean this pass.**

## Rev 3 direction (the live plan)

**Product goal (human decision, 2026-07-05): self-hostable OSS.** An adopter should stand up
the whole stack with minimal setup. That reshapes three things:

1. **Local UI FIRST — `agentstate-lite ui`.** The CLI boots a tiny local server that serves
   the SPA and proxies `/v0/*` to a remote (or a local `serve()` bundle) with the Bearer key
   it already stores. Zero cloud, offline, local-first (honors gate 5); trust boundary = the
   local machine, identical to the CLI. This is the first deliverable and it commits us to no
   auth/distribution choice — the SPA calls same-origin `/v0` either way, so the React work is
   byte-identical to any hosted variant. Precedent: `git instaweb`, Jupyter, k9s.
2. **Hosted browser login = GitHub OAuth device flow** (when a shared URL matters). Auth moves
   INTO the worker (no edge wall, so workers.dev is fine and there is nothing to bypass). Device
   flow needs no callback URL and no `client_secret`, so a single `client_id` shipped in source
   makes per-deployment registration unnecessary — an adopter's login works after `wrangler
   deploy`. A `GitHubDeviceVerifier` + an HttpOnly signed session cookie sit on the existing
   `IdentityVerifier` chain; `member set-github` self-binds the GitHub identity to a lite user
   (the same self-bind shape the retired `set-email` had — B2 impersonation stays structurally
   impossible); an unmapped GitHub user hits a structured-403 onboarding channel. Needs a CSRF
   guard (SameSite + custom-header check on mutations). Optional `GITHUB_CLIENT_ID` override +
   the manifest one-click flow is the escape hatch for adopters who want their own app.
3. **Distribution = the skill/marketplace channel (item 25), EXTENDED to carry the worker
   deploy kit.** A skill is a directory, not the CLI esbuild bundle, so it can ship the built
   worker + migrations + a wrangler template alongside the committed CLI `.mjs` without touching
   the "worker never in the CLI bundle" gate. Adopter setup collapses to `skills add` (or a
   marketplace install) + a deterministic `aslite deploy` command that encodes the load-bearing
   migrate-before-deploy ordering (never agent-improvised steps).

**Reused as-is (survived the Access retirement):** the same-origin `assets` binding +
`run_worker_first ["/v0/*"]` + the placeholder SPA shell; the `IdentityVerifier` chain slot;
`user_identities`; the dormant-when-unconfigured pattern; the `authenticate`-inside-the-try
relocation. The Views / Serving / Testing sections of rev 2 below still apply (they were never
Access-specific); only the Auth model is replaced by the above.

**Sequencing:** local `ui` command → SPA slices (board → detail → admin → graph, byte-identical
across auth choices) → GitHub device-flow hosted login (own unit) → worker-deploy-kit skill +
`aslite deploy` (own unit). Each of the last two is human-gated at deploy as always.

## Rev 3.2 — the `agentstate-lite ui` binding design (REVIEWED, 18 findings folded 2026-07-06)

Rev 3 set the direction; this pins the local-`ui` specifics. Adversarially reviewed by a
3-lens pass (packaging/seam, security, wire-contract/testing); every mandatory finding is
folded below. Rev 2's Views / CAS-UX / polling / no-router decisions still apply EXCEPT as
amended here (notably: admin has no `set-email` — that route retired with Access).

- **Command:** `ui [--dir <path> | --remote <url>] [--port <n>] [--open]` — source resolution
  follows the house ambient rules (explicit flags win; `AGENTSTATE_LITE_REMOTE` else cwd
  bundle). `--port` defaults to 0 (OS-assigned — `serve`'s pattern); the receipt is a TOON
  block carrying the resolved tokenized URL (E2E readiness reads it); `--open` launches the
  browser. No `--host` in v1 (a network-exposed key proxy is a different feature with its own
  review).
- **One server, two modes, same origin either way** (the SPA never knows which):
  - `--dir`: mount the EXISTING reference router in-process over `FilesystemBackend` — ONE
    router. Review finding folded: `serve()`'s node:http adapter is module-private with no
    non-`/v0` fallback hook, so the server package gains a SMALL ADDITIVE surface (export the
    adapter or a fallback-handler option) — the CLI must NOT fork the adapter.
  - `--remote`: reverse-proxy `/v0/*` to the origin. Bearer injection is **conditional on a
    stored key existing for that origin** (a loopback `serve` target has none — the zero-cloud
    E2E depends on this); when present, `Authorization` is **overwritten, never appended**; the
    proxy's error path builds a FRESH envelope and never echoes outbound request headers;
    strip hop-by-hop headers; the key never appears in logs or any response.
- **Session token — v1, not an upgrade path (review corrected the residual):** on a multi-user
  host a bare loopback proxy WIDENS the trust boundary beyond the 0600 key file (any local
  user could drive the key). Jupyter pattern: the server mints a random per-run token; the
  printed URL carries `?token=…`; the first GET exchanges it for an HttpOnly
  `SameSite=Strict` session cookie; any request with neither valid cookie nor token → 403.
  The `SameSite=Strict` cookie ALSO closes the drive-by hole the review found (`POST
  /docs:read-many` is a CORS "simple request" — a malicious page could otherwise fire blind
  key-injected reads through the proxy); belt-and-braces: mutations additionally require an
  `X-Requested-With` header the client always sends.
- **Host check (exact algorithm, review-pinned):** parse Host, strip the port
  (bracket-aware for IPv6), then EXACT-match against {`localhost`, `127.0.0.1`, `::1`} —
  never substring (a substring check reopens DNS rebinding). Bind `127.0.0.1` only. No CORS
  headers, ever.
- **CSP (review catch — same-origin XSS here is key-equivalent):** every asset response
  carries a strict `Content-Security-Policy` (`default-src 'self'` shape, no inline script —
  the Vite build must comply); doc-detail markdown stays no-raw-HTML with hardened links.
- **Asset shipping — the single-file gate holds:** the Vite dist embeds into the CLI esbuild
  bundle as gzip bytes, **deterministically** (review: the skill-bundle byte-compare drift
  gate breaks otherwise): `zlib.gzipSync` with mtime 0, no name field, stable file ordering —
  same inputs ⇒ same bundle bytes, covered by the existing `check:bundle` gate. Serve with
  `Content-Encoding: gzip` only when `Accept-Encoding` admits it; gunzip per response
  otherwise (rare non-browser clients). Budget ≤ 400 KB gzipped total, enforced by a
  build-time gate that FAILS over budget; the graph renderer is the known heavy tail (chips
  fallback remains the recorded escape hatch). No CDN, ever.
- **Build ordering (review):** the CLI build FAILS FAST when `packages/ui/dist` is missing or
  stale (the cli build script builds/verifies ui first) — covering the root build,
  `npm run build -w agentstate-lite`, and `prepublishOnly` identically.
- **Admin discovery (replaces the capabilities mechanism the review killed as fiction —
  `/v0/capabilities` carries no auth discriminator):** the SPA probes `GET /v0/me` once —
  200 with role `admin` ⇒ admin nav shown; 200 non-admin ⇒ hidden; 404 (reference server has
  no identity surface) ⇒ hidden. Admin surface (amended): invites create/list/revoke, members
  list/set-role/remove, keys list/revoke; mint stays CLI-only; NO set-email.
- **Interceptor re-scope:** `--dir` has no 401s. `--remote`: a 401 STOPS all polling and
  renders the "re-login via CLI" screen (copyable command); 429 `RATE_LIMITED` is likewise
  terminal for polling (review: a revoked key that keeps polling escalates into the per-IP
  rate limiter — never poll-loop into 429s).
- **Graph slice notes (review):** `POST /docs:read-many` is all-or-nothing on missing ids —
  the graph loader must refetch-and-retry minus deleted ids (bounded) on a 404. And the
  ONE-resolver rule's precondition never landed: `core/src/links.ts` still imports
  `node:path`, so the browser-clean change (posix-pure string ops, engine tests unchanged)
  is IN SCOPE for the graph slice.
- **E2E:** Playwright against the REAL `ui` command server in BOTH modes — `--dir` over a
  temp bundle, and `--remote` proxying a local reference `serve` instance (keyless — proving
  conditional injection; zero cloud). Readiness/teardown ride the port-0 receipt. The rev-2
  `wrangler dev` harness moves wholesale to the hosted-login unit.
- **Workspace wiring:** `packages/ui` = React 19 + Vite + TS + TanStack Query + vitest +
  Playwright (private; only its BUILT assets embed). `npm run check` grows ui build +
  typecheck + unit tests; Playwright stays out of the fast gate.
- **Build order within the unit:** B1 `ui` command + server seam + embed pipeline +
  token/Host/CSP → B2 typed client + query layer + Board + CAS-conflict UX + interceptor +
  Playwright harness (the vertical slice) → C detail / admin / graph (parallel, sized
  honestly) → D integration review + e2e green + unit close.

---

## Rev 2 (SUPERSEDED — Cloudflare Access; kept for history, do not build)

**Status: rev 2 — adversarially reviewed (SHIP-WITH-FIXES), all mandatory revisions folded
(2026-07-05). The review's headline catch: rev 1's Access app on the whole hostname would
have edge-walled every existing CLI/agent API-key call the moment the setup script ran — a
production outage prevented on paper. See "Review outcome" at the end.** Inputs: `docs/UI-CONTRACT.md` (the
endpoint surface, production-verified), `research/ui-spike.md` (serving/CAS/CORS facts),
`research/canonical-takeaways.md` (borrow/avoid; the auth architecture). Human decisions
locked 2026-07-05: **scope = read-heavy + light writes; stack = React + Vite + TanStack
Query, no router/state libs; serving = the production worker origin as-is.**

## What v1 is

A same-origin web UI served by the existing Worker: the task board, doc detail, and the
link graph, with writes limited to task STATUS transitions (CAS, conflict-as-recoverable-
UX) and invite/member administration. NOT a document editor — authoring stays with the
CLI and agents. Single-bundle (`default`), matching the deployment's honest posture;
information architecture stays workspace-ready (a bundle switcher slot that renders only
when >1 bundle exists — which is never, in v1).

## Auth model (the load-bearing design)

- **Edge login: Cloudflare Access with the One-Time PIN IdP** — no external IdP console,
  fully scripted: `scripts/setup-access.sh` (idempotent `curl` against the CF API:
  ensure ZT org → ensure OTP IdP → ensure **TWO Access apps, bypass-first**: (1) an app
  on `<host>/v0` with a Bypass-everyone policy — agents/CLI traffic never touches Access;
  the Worker's key gate stays their sole auth — created FIRST so `/v0` never has a
  covered window; then (2) an app on the host root with the OTP allow-policy from an
  email list). The script's LAST step is an automated live smoke: `list --remote` with an
  API key must still succeed — the review's blocker (rev 1's single whole-host app would
  have edge-walled every existing API-key call) is now structurally prevented AND
  verified at setup time. One-time caveat: a brand-new account may need one dashboard
  visit to accept the free ZT plan.
- **The real gate stays in the Worker**: a new `AccessJwtVerifier` on the EXISTING
  `IdentityVerifier` chain (ordered, first-non-null-wins — verified to compose without
  touching the fail-closed `configured` check). Token source: the **`CF_Authorization`
  cookie (primary)** — with `/v0` bypassed at the edge, Access injects no
  `Cf-Access-Jwt-Assertion` header on API XHRs, but the browser sends the session cookie
  same-origin; the header is ALSO accepted when present. Validation: RS256 against the
  team JWKS (`/cdn-cgi/access/certs`, cached with expiry + rotation tolerance), `aud` =
  the root app's AUD, `iss` = the team domain; email claim → lite user via
  `user_identities` (`provider='email'` — NO migration needed, verified against 0002;
  this unit has zero migrate-vs-deploy hazard). Config via `ACCESS_TEAM_DOMAIN` /
  `ACCESS_AUD` / `ACCESS_JWKS_URL` (the test seam): **env unset → verifier simply not
  registered** (deploy-before-script is therefore safe); JWKS unreachable → verifier
  returns null (→ ordinary 401), never a throw.
- **Unknown-email channel (designed, not implied):** `authenticate()` moves INSIDE the
  gate's envelope-mapping try (also fixing a latent 500-escape the review found for any
  throwing verifier); a valid JWT whose email has no `user_identities` row throws a typed
  `UNMAPPED_EMAIL` mapped to a structured **403** whose copy owns the real two-step
  onboarding ("get an invite → `join` via CLI → `member set-email`"), **excluded from the
  auth-failure rate limiter** (an unmapped user's polling tab must not burn the per-IP
  budget into 429s). The UI renders it as an onboarding screen, not an error.
- **Email binding rule (the B2-impersonation class, settled):** `member set-email` is
  **SELF-BIND ONLY** — a caller may attach an email to their OWN user, never another's
  (an admin binding an email they control to another user = browser-login-as-them, the
  exact impersonation the auth review structurally killed once already). Normalization:
  lowercase exact match; NO plus-stripping (distinct mailboxes). Every bind writes an
  `auth_events` row and admin `member list` surfaces emails. Recorded residual for the
  current team size: an unverified self-bind of someone ELSE's address can capture that
  person's future first login (visible in whoami/display + auth_events); the upgrade
  path is verified-bind (pending until first OTP login for that address) — deferred.
- **The browser never PERSISTS a credential** (canonical's lesson, precisely scoped): no
  localStorage tokens, no key prompt. The Access cookie is the session; the Worker
  derives identity per request. The one transient exception: `invite create`'s returned
  token (shown once by design) — that mutation runs with cache and retry disabled and is
  excluded from any raw-JSON view.

## Serving

- `wrangler.jsonc` gains an **assets binding** (`packages/ui/dist`) with the SPA shell at
  the ASSETS ROOT and `not_found_handling: "single-page-application"`, plus
  **`run_worker_first: ["/v0/*"]`** so `/v0` ALWAYS hits the gated fetch handler
  regardless of fetch mode (review finding: SPA fallback cannot be scoped to a sub-path,
  and a navigation request to `/v0/*` would otherwise serve the shell — the rev-1 `/ui`
  prefix design was wrong as written and is dropped). Same origin ⇒ CORS never exists.
- Deploys remain human-gated; **ordering re-derived from "Access enforcement is the
  breaking change"**: (1) deploy the verifier-carrying worker FIRST — the verifier is
  dormant without `ACCESS_*` env, API keys unaffected; (2) set `ACCESS_*` vars; (3) run
  `setup-access.sh` (bypass app before root app, automated CLI smoke as its last step).
  A JWT arriving before step 2 just falls through to today's 401 — harmless; API-key
  traffic is never edge-covered at any point.

## Package layout

- `packages/ui` — PRIVATE workspace package (like `worker`, never in the CLI bundle):
  React 19 + Vite + TypeScript + TanStack Query + Playwright. No router (URL-search-param
  routing, `history.replaceState`, deep links must work), no state library.
- A small hand-written typed API client (`packages/ui/src/api/`), importing shared types
  type-only from `@agentstate-lite/core` (`auth-wire.ts`, `HeadResult`, envelope shapes).
  Contract-first codegen is recorded as future work, not built now.

## Views (build slices)

1. **Board** — `GET /docs?fields=frontmatter&type=Task` (the push-down path), FOLLOWING
   `next_cursor` (the route pages at 50 by default); columns by status; CAS toggle per
   card (read → mutate → `PUT If-Match`); a 412 renders as a recoverable state
   (REFRESH / RETRY) mapped from the error envelope, never a raw error. The query layer
   carries ONE global interceptor: a 401 or non-JSON response (an expired Access session
   turning XHRs into login-HTML) triggers a full-page reload to re-enter the edge OTP
   flow.
2. **Doc detail** — full doc render (markdown, NO raw HTML, hardened links; text-node
   syntax highlighting), frontmatter table, attributed version history
   (`/docs/{id}/versions`), and secret-redacting raw-JSON view (`token`-shaped fields).
3. **Graph** — client-derived from full docs pulled in ONE round trip
   (`POST /docs:read-many` — the canonical N+1 lesson), links parsed by importing **core's
   ONE resolver** into the browser bundle: `core/src/links.ts`'s only Node dependency is
   `node:path`, which Foundations makes browser-clean (posix-pure string ops) — the
   review's resolution of the one-resolver gate question (a UI reimplementation would be
   a third parser; a server-side links endpoint costs a wire addition for less). Bundled
   renderer (no CDN — the viewer's CDN habit is not inherited). Chips-style dependency
   navigation on the board is the cheap fallback if the graph slice slips; the graph is
   v1-committed but LAST in sequence.
4. **Admin** — invites (create/list/revoke), members (list/set-role/remove/set-email),
   keys (list/revoke; mint stays CLI-only in v1 to keep secrets out of the browser).

## Realtime

Polling via TanStack `refetchInterval` (visible-tab only). The `events:wait` long-poll
change feed (canonical's proven HTTP shape, inclusive cursor + server-side filters) is
the recorded v1.1 backend unit — NOT built now; the UI's data layer is shaped so swapping
poll → feed touches only the query layer.

## Testing

- Unit: vitest for components/logic (conflict-state mapping, URL-param routing, client).
- E2E: Playwright against a REAL local worker instance via **`wrangler dev` /
  `unstable_startWorker`** — the review corrected rev 1 here: `getPlatformProxy`
  provides bindings only (no listener, no `main`, no assets routing), and the assets/SPA
  fallback semantics of finding 3 are exactly what E2E must exercise. Auth in tests:
  `ACCESS_JWKS_URL` pointed at a local fake JWKS + self-minted RS256 JWTs — Cloudflare
  never in the test loop. One smoke spec per view slice, deep-link routing, the
  unmapped-email 403 screen, and the CAS conflict path (two clients racing a toggle →
  one 412 → recovery).
- `npm run check` grows the ui workspace (build + typecheck + unit; e2e as its own
  script, not in check — Playwright's browser download stays out of the fast gate).

## Sequencing (the workflow phases)

1. **Plan review** (this doc, adversarially) → rev until SHIP.
2. **Foundations**: `setup-access.sh` + `AccessJwtVerifier` (+ `member set-email` +
   `user_identities` email mapping) + assets binding scaffold + empty SPA shell behind
   it. Ends: local-sim verified; deploy waits for the human gate.
3. **Client + Board** (the vertical slice that proves everything: query layer, CAS
   toggle, conflict UX, Playwright harness).
4. **Doc detail**, then **Admin**, then **Graph** (parallelizable once 3 lands; isolated
   worktrees if run concurrently).
5. **Integration review** (the 8-angle pass over the whole diff) + e2e suite green.
6. **Human-gated**: run the Access script on the account, `wrangler deploy`, live
   acceptance (login via OTP, board renders, one CAS toggle on a real task, admin list).

## Non-goals (recorded)

Document editing; multi-bundle; WebSockets; custom domain; key minting in the browser;
auto-provisioning users from Access logins; the change feed (v1.1); replacing the static
viewer (it survives until the UI proves it obsolete, then gets its own retirement unit).

## Remaining risks (post-review)

- JWKS fetch/cache inside the Worker (cold-start latency, rotation, clock skew) — the
  fail-closed rules above bound the blast radius to a 401.
- The Access login redirect flow depends on the ROOT app's edge coverage actually
  engaging on workers.dev navigations — acceptance must verify the full OTP → cookie →
  XHR round-trip live before calling the unit done.
- Bundle-size discipline for the SPA (React + TanStack + a graph lib is the heavy end).
- The self-bind email residual recorded above (verified-bind is the upgrade path).

## Review outcome (rev 1 → rev 2)

Independent adversarial review: **SHIP-WITH-FIXES**; verified the seam/schema/wire
assumptions hold (verifier chain composes without touching fail-closed; `user_identities`
takes `provider='email'` with no migration; board/versions/read-many routes as assumed).
Mandatory fixes, all folded above: (1) BLOCKER — whole-host Access app would have
edge-walled all API-key traffic; → two-app bypass-first design + cookie-primary verifier
+ re-derived deploy-then-script ordering + automated post-script CLI smoke. (2) `member
set-email` admin-bind = the B2 impersonation class; → self-bind only + normalization +
audit rows + recorded residual. (3) `/ui`-prefix SPA fallback isn't how wrangler assets
work; → root SPA + `run_worker_first: ["/v0/*"]`. (4) unknown-email had no channel
through the seam and would burn the rate limiter (plus a latent verifier-throw
500-escape); → `authenticate()` inside the envelope try, typed `UNMAPPED_EMAIL` → 403,
limiter-exempt. (5) `getPlatformProxy` can't host E2E; → `wrangler dev`/
`unstable_startWorker` + the `ACCESS_*` env seam with fail-closed rules. Plus: one
resolver imported browser-clean (6), invite-token cache/retry scoping (7), session-expiry
interceptor (8), no-migration note + env-before-script ordering (9), cursor-following
board (10).
