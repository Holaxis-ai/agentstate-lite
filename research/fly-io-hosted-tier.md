---
type: Research
title: 'Fly.io for the hosted tier: capabilities vs Cloudflare (Workers/D1/R2)'
description: >-
  Fly offers real full-runtime-compute and any-DB flexibility, but for this
  workload Cloudflare stays cheaper, lower-ops, and already shipped; the
  event-feed roadmap item fits Durable Objects well too, so recommendation is
  stay Cloudflare-only for now.
actor: mike/claude
timestamp: '2026-07-14T17:32:14.592Z'
---
# Summary

**Bottom line:** Cloudflare (Workers + D1 + R2) stays the right default for agentstate-lite's
hosted tier. Fly.io offers real, concrete capability beyond Cloudflare — full-runtime compute
(any language/DB, long-running processes, no CPU-time ceiling) and genuine any-database choice —
but for THIS workload (a light CRUD + fan-out document store, not a compute-heavy or
latency-critical-everywhere service), those capabilities are upside-for-later, not gaps the
product is blocked on today. Notably, the roadmap's real-time **ordered event/change-feed**
primitive ([[real-time-event-backbone]]) — the axis the research brief expected to be Fly's
strongest case — turns out to map cleanly onto Durable Objects + SQLite storage (one DO per
bundle = one single-threaded actor owning the ordered journal, which is close to the exact shape
already scoped). Fly would remove some billing/mental-model friction on that axis, not unlock
something structurally impossible on Cloudflare. Recommendation: stay Cloudflare-only now; treat
Fly as a future, additive `StorageBackend` adapter (cheap optionality thanks to the pluggable
seam) if a customer need for heavy arbitrary compute, Postgres-grade transactions, or
dedicated-VM isolation ever materializes.

Labels below: **[fact]** = verified current pricing/feature claim with a source, **[assessed]** =
a trade-off judgment reasoned from those facts applied to this codebase, **[hypothesis]** = an
untested guess flagged as such.

# What Fly.io is

Fly.io runs your app as **Fly Machines** — fast-booting Firecracker microVMs built from a
container image — placed in physical datacenters close to users, reachable through a global
Anycast network that routes each request to the nearest region running your app
[fact, [Fly regions docs](https://fly.io/docs/reference/regions/)]. Unlike Cloudflare Workers'
V8-isolate model, a Machine is a normal container: any language, any runtime, any listening
socket, a real filesystem, long-lived processes — the same mental model as a VPS, but
orchestrated (autostart/autostop, volumes, private networking) and deployable to 30-34 regions
[fact, same source; region count corroborated by
[N0tExisting/fly-regions](https://github.com/N0tExisting/fly-regions)]. Fly also ships adjacent
managed services relevant here: **LiteFS** (SQLite replication over FUSE), **Fly Managed
Postgres**, and **Tigris** (S3-compatible object storage, a Fly-native partner product).

# Axis-by-axis

## 1. Compute model

**[fact]** Cloudflare Workers execute short-lived, stateless V8 isolates per request/event, with
no persistent local process and CPU-time billing; Fly Machines are full Firecracker VMs that can
run any binary indefinitely
[13Labs comparison](https://www.13labs.au/compare/cloudflare-workers-vs-fly-io).

**[assessed]** This is Fly's most unambiguous edge: `packages/server` is a plain Node HTTP
server today (the wire-protocol reference server) that had to be **reimplemented** as
`D1R2Backend` inside Worker constraints to reach production on Cloudflare. On Fly, that exact
Node process — `packages/server` plus, say, a Postgres-backed `StorageBackend` — could run
**unmodified**, with room to add heavier work later (bundle-wide reindexing, embeddings for
search, non-JS tooling) that would not fit a Worker's CPU-time ceiling. Cloudflare's CPU-time
limits have loosened over the product's life but the architectural ceiling (no arbitrary
long-running compute) is structural, not a version number.

## 2. Storage

**[fact]** Fly's storage menu: LiteFS (replicated SQLite via FUSE, ~100 writes/sec ceiling,
50-200ms replication lag to read replicas, **LiteFS Cloud managed backups was shut down Oct
2024** and Fly has slowed active LiteFS investment though it still works and ships
[Fly LiteFS docs](https://fly.io/docs/litefs/), [byteiota](https://byteiota.com/sqlite-edge-production-2026-database-renaissance/)]),
**Fly Managed Postgres** (five tiers, $38-$1,922/mo compute + $0.28/GB/30d storage, HA + backups
+ pooling included [Fly MPG docs](https://fly.io/docs/mpg/)]), and **Tigris** object storage
(S3-compatible, globally distributed, **zero egress fees**, first 5GB + 10k Class-A/100k
Class-B requests free/mo, then $0.02/GB/mo storage + $0.005/1k PUT + $0.0005/1k GET, same price
in every region [Fly×Tigris](https://fly.io/hello/tigris/),
[Tigris pricing](https://www.tigrisdata.com/pricing/)]).

**[fact]** Cloudflare D1: ~150M rows read + 3M rows written + 5GB storage free/mo, jumping to 25B
reads / 50M writes on the $5/mo Workers Paid plan, $1/million writes overage, **no egress or
bandwidth charges**, and **built-in read replication at no extra usage cost**
[Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/). R2: free tier
storage+ops, then $4.50/million Class-A ops (write/delete/list), **also zero egress**
[Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/).

**[assessed]** Both R2 and Tigris are already egress-free, so that historic S3 pain point is a
wash. The real delta is **engine choice**: D1 is SQLite-only with single-primary-plus-replica
semantics; Fly gives you real Postgres if you want richer multi-statement ACID transactions
(e.g. doc-write + log-append + index-regenerate as one transaction) or SQL features D1's SQLite
dialect lacks. But `docs/core`'s "core-shape" and "engine-surface" passes already proved D1's
CAS/versioning/actor model sufficient for the current contract (`readDoc`/`writeDoc` with
`expectedVersion`, `docVersions`, reserved-file CAS) — so Postgres is upside for future
capability (full-text search extensions, complex graph queries over the OKF link graph), not a
fix for a present gap. LiteFS's ~100 writes/sec ceiling and its managed-backup product's
cancellation make it the **weaker** of Fly's two storage paths for this workload; plain Fly
Postgres is the credible one.

## 3. Real-time / streaming — the roadmap's actual test case

**[fact]** Cloudflare Durable Objects: SQLite-backed storage is now GA (moved from beta) with a
Point-in-Time-Recovery API restoring to any point in the last 30 days
[Cloudflare DO SQLite blog](https://blog.cloudflare.com/sqlite-in-durable-objects/). DOs speak
WebSockets natively — "connect thousands of clients per object... create millions of objects to
broadcast real time events" — and Cloudflare's own reference architecture for a collaborative
document editor is **one DO per document**, receiving edits, resolving order, broadcasting to
connected clients, persisting to its embedded SQLite
[Cloudflare DO overview](https://developers.cloudflare.com/durable-objects/). Billing has real
texture though: incoming WebSocket messages bill at a 20:1 ratio into DO request counts (1M
incoming messages ≈ 50k billed DO requests; outgoing messages and pings are free), and holding a
WebSocket open with `accept()` bills duration for the whole connection unless the Hibernation
API is used to suspend billing while idle
[Cloudflare DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/).

**[fact]** Fly Machines can hold WebSocket/SSE connections as a normal long-running server
process with no special hibernation API and no per-message billing ratio — you pay for the
VM-seconds it runs, period
[13Labs](https://www.13labs.au/compare/cloudflare-workers-vs-fly-io).

**[assessed] — correcting the brief's framing:** the research brief characterized this as "hard
on Workers (Durable Objects)... natural on a long-running Fly process." Having read Cloudflare's
own architecture guidance, that's not quite right for THIS design. The scoped primitive in
[[real-time-event-backbone]] — a **per-bundle ordered change journal**, one actor serializing a
monotonic cursor, atomic state+event commit, SSE with `id:`/`Last-Event-ID` replay-from-cursor —
is close to a textbook fit for **one Durable Object per bundle**: a DO is already a
single-threaded actor (so cursor assignment has no race by construction), its SQLite storage
*is* a natural home for the journal table, and DO-to-WebSocket-client broadcast is exactly
Cloudflare's documented collaborative-editor pattern. Fly's advantage here is real but narrower
than "unlocks it": no 20:1 message-billing bookkeeping, no Hibernation-API discipline to get
right, and a more familiar "just a server" programming model — friction/ops-simplicity, not a
capability Cloudflare structurally lacks. Given `packages/worker` is already live in production
on Cloudflare, building the event backbone as a DO is the lower-migration-cost path; Fly would
mean standing up a second production surface for one feature.

## 4. Stateful / per-tenant isolation

**[fact]** Fly's own autostop/autostart docs flag a scale limit directly relevant to multi-tenant
SaaS: "at scale, with thousands of Machines in a single app, the proxy can't stop them fast
enough to keep most idle Machines stopped... for per-user dev environments, use one app per user"
[Fly autostop/autostart docs](https://fly.io/docs/launch/autostop-autostart/). So strong
per-tenant isolation on Fly means **one Fly App per tenant** — genuinely stronger blast-radius
isolation than a shared Worker/DO fleet, but it is machinery the team must provision and operate
(N apps, N sets of machines/volumes to watch), not something the platform gives for free.

**[assessed]** Cloudflare's DO-per-tenant (or DO-per-bundle) model gets comparable *logical*
isolation — separate storage, separate execution context, no noisy-neighbor state — without
provisioning a second app per customer; the platform already fans out per-key. Fly wins if a
customer specifically needs **dedicated-VM** isolation (e.g. a compliance requirement, or a
tenant that legitimately needs heavy dedicated compute), which is a real but currently
hypothetical **[hypothesis]** need for this product.

## 5. Regions / latency / networking

**[fact]** Fly: 30-34 regions on a global Anycast network
[Fly regions docs](https://fly.io/docs/reference/regions/). Cloudflare: 300+ cities on its edge
network (well-established, not re-verified numerically here but an order of magnitude denser than
Fly's regional footprint).

**[assessed]** For a request/response CRUD-plus-occasional-push workload (not CDN-grade static
asset serving), the practical latency delta between "nearest of 30 regions" and "nearest of 300
cities" is real but modest for most users, and larger for underserved geographies. This is not a
deciding axis for agentstate-lite's current user base.

## 6. Ops complexity & scale-to-zero

**[fact]** Cloudflare: fully serverless, true pay-per-request/row/operation with essentially no
idle floor. Fly: `min_machines_running=0` plus autostart approximates scale-to-zero, but (a)
autostop/autostart only starts/stops *existing* Machines, never creates/destroys them
[Fly docs](https://fly.io/docs/launch/autostop-autostart/), (b) a stopped Machine with an
attached Volume still bills for that volume's storage, and (c) Firecracker cold-start, while fast
for a VM, is materially slower than a V8 isolate spinning up.

**[assessed]** For a low-traffic multi-tenant SaaS in its early days, Cloudflare's zero-idle-cost
model is a meaningfully lower ops-and-cost floor. Fly requires real operational attention:
volumes, Postgres HA (or paying $38+/mo for Fly Managed Postgres to outsource it), backup
verification — work `packages/worker`'s D1R2 setup does not currently require at all.

## 7. Cost model

**[fact]** Cloudflare Workers Paid: $5/mo base, includes 1M requests + 400K GB-seconds, plus the
generous D1/R2 allowances above
[Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/). Fly: a
minimal always-on shared-cpu-1x/256MB Machine runs ≈$1.94/mo; reserved-capacity blocks get a 40%
discount; Fly Managed Postgres starts at $38/mo (Basic tier) before any app compute
[Fly pricing docs](https://fly.io/docs/about/pricing/),
[Kuberns Fly pricing summary](https://kuberns.com/blogs/flyio-pricing/).

**[assessed] Low scale (a few tenants):** Cloudflare lands around $5-10/mo all-in given the
included allowances. Fly's compute alone is cheap (~$2-15/mo for a couple of small Machines), but
the moment you want a *managed* Postgres instead of self-run, the floor jumps to $38+/mo —
likely **$40-60/mo** realistic all-in for a comparable managed setup, several times Cloudflare's
floor. **Moderate scale:** Cloudflare's no-egress, per-operation billing scales smoothly and
stays cheap for a CRUD-and-fan-out workload; Fly's per-second VM billing (with reserved
discounts) can become competitive or cheaper specifically for **sustained CPU-bound** workloads,
which this product does not currently have. Net: Cloudflare is cheaper through the scale range
this product actually occupies today.

## 8. Migration fit

**[fact]** The seam this all plugs into (`packages/core/src/types.ts`'s `StorageBackend`
interface) is narrow: `read`/`readMany`/`write` (with CAS `expectedVersion` + `actor`)/`exists`/
`list`/`versions`/`readReserved`/`writeReserved`, plus blobs. `D1R2Backend` (`packages/worker`)
and `MemoryBackend` both implement it without the engine or CLI knowing which backend is live.

**[assessed]** A Fly-hosted backend — Postgres for doc/version/CAS rows (mirroring D1's role) +
Tigris for blob storage (mirroring R2's role), or a LiteFS/SQLite variant if the ~100 writes/sec
ceiling is acceptable — is a **new adapter implementing the existing interface**, the same shape
of work `D1R2Backend` already was. It is additive optionality, not a rewrite: the engine, CLI,
and wire protocol are untouched either way. This is a genuine strength of the pluggable-core
principle (gate 3) — the cost of "keep both options open" is low regardless of which platform
wins today.

# What Fly uniquely enables for this service (ranked)

1. **Full-runtime compute** — the strongest, most concrete case. `packages/server` could run on
   Fly with zero adaptation; future CPU-heavy features (bundle-wide reindexing, embeddings,
   non-JS tooling) have no Workers-style ceiling to hit.
2. **Any database** — real Postgres (richer transactions, full SQL) instead of D1's SQLite
   dialect, if a future feature needs it.
3. **The event backbone, with less billing/API friction** — but, correcting the brief's premise,
   not something Cloudflare *can't* do: DO+SQLite is a credible, arguably clean fit for the
   scoped per-bundle journal design.
4. **Dedicated-VM per-tenant isolation** — real, but requires Fly's one-app-per-tenant pattern,
   which is operational work Fly's own docs say doesn't scale for free either.

# What Cloudflare still wins on

Zero idle cost / true scale-to-zero; ~10x denser edge network; already-proven zero-egress
storage (R2, matching Tigris); dramatically lower ops burden (no VMs/volumes/Postgres-HA to run
or pay $38-1,922/mo to outsource); cheaper across the scale range this product actually occupies;
and — the largest practical factor — **it is already shipped**: `packages/worker` is live in
production, out of auth-bootstrap, serving the team's own board. Any move toward Fly is a second
production surface to build, secure, and operate, for capabilities this product does not yet
need.

# Recommendation

Stay Cloudflare-only for the hosted tier now. Build the real-time event backbone (when the
Mike/Brian decision in [[real-time-event-backbone]] lands) as a Durable Object per bundle — it
fits the scoped design well and avoids opening a second infrastructure front. Revisit Fly only if
a concrete, real need shows up: a customer requiring dedicated-VM isolation, a feature needing
sustained heavy compute Workers can't fit, or a workload wanting Postgres-grade transactions/SQL
D1 can't express. Because the `StorageBackend` seam already makes a Fly adapter additive rather
than a rewrite, "wait for the need" costs nothing today — there is no reason to hedge by building
toward Fly speculatively.
