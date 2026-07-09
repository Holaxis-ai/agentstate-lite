---
type: Doc
title: agentstate-lite — North Star
timestamp: '2026-07-06T19:18:14.195Z'
---
# agentstate-lite — North Star

> **A multi-human, multi-agent collaboration substrate built on an open, portable knowledge format.**

This is the future-state vision. It is deliberately larger than what we build first. `docs/VISION.md` describes the **near-term architecture** (the pluggable local core we are building now); this document describes the **destination** that architecture is designed to reach, and why each near-term decision is a step toward it.

Status: **draft / directional.** Written to be reacted to, not treated as settled.

---

## 1. The one-liner

A shared, open **knowledge substrate** — [OKF](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf) bundles of markdown + a link graph — where **multiple humans and multiple agents co-create**. Humans get visibility and mediation through a UI; agents plug in as first-class participants; the knowledge itself stays portable, human-readable, and vendor-neutral (it's just markdown files).

## 2. Why

Knowledge that humans and agents build together should not be locked inside a proprietary platform. OKF gives us a **portable format** ("format, not platform"). agentstate-lite adds the **collaboration substrate around it** — remote sharing, identity, agent orchestration, and a human UI — while keeping the core pluggable and the format open. If someone wants to walk away, they leave with a directory of markdown they can read in any editor, host in any git repo, or open in the self-contained HTML viewer.

This is the open, OKF-native distillation of the same idea behind canonical AgentState (shared state, context notes, artifacts, multi-agent coordination) — minus the heavy surface.

## 3. The participants

**Humans** — read, organize, and curate knowledge; view rendered markdown and generated HTML; *mediate* agent work (trigger, review, approve, iterate); are managed via auth + an admin surface (invite, roles, per-bundle access).

**Agents** (local *and* remote — e.g. Claude managed agents) — first-class participants, not just callers. An agent can read a doc, **traverse the OKF link graph to assemble relevant context**, and **produce artifacts** (new notes, concept docs, or a generated HTML file) that surface back to humans.

## 4. The signature workflow

The concrete thing this is all for:

1. A human, in the **UI**, points a **remote agent** at a markdown document.
2. The agent **reads it, and follows the OKF cross-links** to pull in any linked documents that are relevant — the link graph *is* the context-assembly / retrieval structure.
3. The agent **codes up an HTML file** (or another artifact) from that assembled context.
4. The result is **surfaced back to the human in the UI, user-mediated** — reviewed, iterated on, accepted.

Humans and agents reading, writing, and linking the same knowledge, with provenance (`log.md` history, context notes, `timestamp` freshness) making the collaboration legible.

## 5. Architecture — everything rides on the pluggable core

```
Interfaces      CLI (agents/programmatic)   Web UI (humans)   [MCP adapter?]
                        \                        |                 /
Agent layer        agent orchestration: dispatch local/remote agents as
                   OKF producers/consumers; context assembly via link graph;
                   artifact generation (HTML, docs) — user-mediated
                        |
Access layer       auth + admin: identity (multi-human), invite/roles/
                   permissions, per-namespace/bundle scoping
                        |
Storage adapters   filesystem (built, default)  ->  remote (HTTP / Cloudflare
                   D1+R2) for shared bundles  — a PLUG-IN, not a rewrite
                        |
Core (built)       OKF engine: bundles, frontmatter, link graph + backlinks,
                   freshness, static HTML viewer  —  behind a StorageBackend seam
```

- **Core (built):** one OKF engine — one frontmatter parser, one bundle-walk, one link resolver, one viewer. Storage lives behind a `StorageBackend` interface.
- **Storage adapters (pluggable):** filesystem is the default; a remote backend (HTTP over Cloudflare D1+R2, or a container) makes bundles **shared**. The seam is the whole reason "remote" is additive.
- **Access layer (roadmap):** auth + admin — the multi-human layer. Self-hostable (e.g. Better Auth: organizations/invites/roles + API keys for agents), so the OSS/"no proprietary account" ethos holds.
- **Agent layer (roadmap):** dispatch and mediate local/remote agents against a bundle; the signature workflow lives here.
- **Human UI (roadmap):** the collaboration surface — browse/organize the bundle, render markdown + generated HTML, see the graph, mediate agent runs, manage users. This is the "portal" — visibility **and** mediation.
- **Interfaces:** multiple frontends over one core — the CLI for agents/programmatic use (built), the Web UI for humans (roadmap), and possibly an MCP adapter later. Same substrate, different doors.

## 6. Principles

- **Format, not platform** — OKF; portable, human-readable, no lock-in. Walk away with markdown.
- **Pluggable core** — one engine; storage behind a seam; remote/auth/agents are adapters and layers, never baked into core.
- **Human-in-the-loop** — agents are mediated by humans in the UI by default, not autonomous.
- **Local-first default, remote-optional** — works on one machine with zero setup; goes shared when you deploy a remote backend.
- **Multi-human, multi-agent** — identity and collaboration are first-class, not afterthoughts.
- **Open source.**

## 7. Staging — near-term to north star

| Stage | What | State |
|---|---|---|
| 0 | Pluggable local core + AXI CLI + static HTML viewer | **done** (2026-07-02) — hardened past the original bar: version/CAS/actor/history seam proven over three adapters, kind conventions (§9), security passes (traversal, viewer XSS), lossless same-process multi-writer, publishable npm package (the publish itself is still human-gated) |
| 1 | Remote storage adapter — shared bundles over the seam | **in progress** — wire protocol v0 implemented by reference (`packages/server` + core `RemoteBackend`, tri-backend parity); CLI `serve`/`--remote` complete the local remote loop. Remaining: a hosted deployment (CF Worker + D1/R2 front-runner, §8) — until then "shared" means one machine, loopback-only, no auth |
| 2 | Auth + admin (multi-human) + Web UI (visibility + mediation) | roadmap (`Authorization` slot reserved on the wire; viewer sanitization already shipped as groundwork for untrusted shared bundles) |
| 3 | Remote-agent orchestration — the §4 signature workflow | roadmap |

Each stage is unlocked by the one before it, and all of them plug into the core built in Stage 0. Nothing here requires re-architecting the core — that is the point of getting the core *good and pluggable* first.

## 8. Open decision (deferred to Stage 1): the remote substrate

We are deliberately **not** choosing the remote/shared backend now. The `StorageBackend` seam exists so this is decided later against real requirements, not in the abstract. Recorded here so we stop re-litigating it each session.

**Candidates:**
- **Document-centric object store (Cloudflare R2 + D1 head index).** Per-doc identity, per-doc CAS, easy blob/HTML serving via a Worker. But Workers are stateless (no disk), so the OKF directory is always a *materialized* view (see the boundary below), and it carries CF's non-POSIX sharp edges (no atomic rename, `list` pagination, the D1 bound-parameter cap).
- **Container / VPS + SQLite (or a real filesystem / git repo on a volume).** Can stay natively OKF-shaped (a real directory or git bundle on disk) with a document-centric API in front; simpler POSIX semantics, no R2 quirks; costs an always-on container.
- **Git.** Free content-addressed versioning + provenance + diffs + remote, maximally OKF-native for distribution — but repo-coarse for granular sharing and awkward for serving artifacts, so best as an **export/interop** path, not the flagship live store.
- **FUSE-mounted R2 (s3fs / tigrisfs) or JuiceFS in a Container.** Presents R2 as a filesystem. s3fs/tigrisfs: convenient but not POSIX, not fast, and **no multi-writer safety** → fine for read-only / bootstrap / materialize, wrong for the concurrent write path. JuiceFS: real POSIX (metadata in a separate transactional DB, data in R2), but a full distributed-filesystem deployment to operate.

**Deciding factors (evaluate at Stage 1):** multi-writer concurrency model, granular (per-doc / per-namespace) access control, artifact (HTML) serving, operational weight, how natively OKF-shaped (filesystem / tarball / git interop) it is, and the **query / backlink payload posture**. On this last point: today `query` and `backlinks` pull the *whole bundle* — full frontmatter **and** body for every concept — in one `readMany`, which is cheap over a local filesystem and fine at bundle scale. A remote, multi-tenant backend inverts that cost: shipping every body across the network to derive a backlink set (which needs only ids + links) is wasteful, so the substrate wants a **frontmatter-only `list()`** projection and/or **filter push-down** (type/tag/prefix — and ideally the link-graph traversal itself — evaluated server-side) so a query returns a thin candidate set, not the corpus. Whether a candidate backend can express those projections/predicates natively is a real selection criterion, not a later optimization — it shapes what the seam's read surface must eventually offer.

**The principle that makes this low-stakes — the *materialization boundary*:** the OKF directory bundle is our **interchange** format, not necessarily the live storage format. *Any* non-filesystem backend (R2, D1, SQLite, git-object) stores docs structurally and **materializes** a conformant OKF directory on demand (for tarball / git / editor / reference-viewer interop). The seam's `list()` + `read()` already make a backend-agnostic exporter, so no backend needs bespoke export code. Only the plain-filesystem adapter is zero-tax — its store *is* the bundle.

**Update (2026-07-01) — strategic input recorded; the decision itself stays Stage-1-gated.** Lite stands on its own engine rather than wrapping the private predecessor store. That reframes this section:

- An **adapter-over-the-predecessor** stepping stone is off the table — lite invests in its own engine end to end.
- **CF-native (Worker + D1 head-index + R2 blobs) becomes the front-runner**: no longer duplication of canonical but a **port of its production-proven store** — the CAS write routes and OAuth machinery `docs/VISION.md` §4.3 already marks restorable.
- **Own-account Cloudflare deploy is itself a first-class self-host path** (free tier, deploy-button, no server to operate) — arguably lower-friction than a VPS. The "format, not platform" promise is carried by the *materialization boundary + open code*, not by the host. The **container/SQLite deployment remains a committed later target** for docker / air-gapped / data-sovereignty users.
- The **binding contract is the wire protocol** — the `StorageBackend` seam over HTTP, drafted in [`WIRE-PROTOCOL.md`](WIRE-PROTOCOL.md). CF and container are two deployments of the same engine behind that one protocol, so this choice is a deployment matrix, not a fork.
- **Replacement-parity scope:** canonical's **task system is explicitly deferred** (human, 2026-07-01 — future item, not Stage 1). An **MCP adapter surface** becomes a real requirement if/when the replacement is confirmed. Context notes already exceed parity (versioned files vs canonical's single-slot notes).

## 9. Kind conventions — the extension mechanism

Bundles may declare document *kinds* — plain OKF convention docs (`type: Convention`, living under
`conventions/`) that name a governed `type`'s required/optional fields, allowed enum values,
expected body sections, and a freshness horizon. This is HOW agentstate-lite grows domain
vocabulary (a project's own "Roadmap Item", a team's own note types, …) without a schema fork: a
convention doc is just an OKF doc with a well-known `type`, read by ONE core registry
(`core/src/kinds.ts`) that every consumer — the CLI today, the viewer/server/a future MCP surface
later — shares (see `CLAUDE.md` gate 3). Usage is opt-in per bundle; a conventions-free bundle
(every external OKF bundle today) is byte-for-byte unaffected. The mechanism was dogfooded first:
`agentstate-lite init` applies the built-in `context-notes` recipe (recipe zero) by default, and the CLI surface
(`kinds` to enumerate, `new "<Kind>" <id> …` to create an instance) was shaped by a 9-agent
empirical experiment on what agents actually discover, not designed in the abstract.

**Open question surfaced by dogfooding this (not resolved here, recorded so it isn't silently
re-decided later):** a kind convention declares a `path` prefix (e.g. `context-notes/`) for where
its instances live — but a concept's *identity* (`ConceptId`, §5 above) is ALREADY its
bundle-relative path (id = path minus `.md`). Having both "the id IS a path" and "a kind declares
A path" invites confusion about which is authoritative when they would disagree — concretely, `new
"Context Note" foo` under the applied context-notes recipe's convention silently PREPENDS `context-notes/` onto `foo`
rather than treating `foo` as an already-placed id. Whether the field should be renamed to
something that reads as a placement CONVENTION rather than a second identity concept (e.g.
`default_path` / `instance_prefix`) is an open naming/semantics question, not a behavior change.
