---
type: Doc
title: agentstate-lite — Design Vision
timestamp: '2026-07-06T19:18:15.610Z'
---
# agentstate-lite — Design Vision

**An OKF-native, CLI-first, portable agent knowledge store.**
Context notes + cross-links + a shareable static HTML view — as a plain folder of
markdown files. No server required. Remote sync is an *optional, later* adapter,
not the foundation.

> **Status: v0.1 — core + viewer + cli implemented.** This document is the design
> intent; core, viewer, and the `axi` CLI are now built and working. See
> [§7 Current state](#7-current-state) for what exists today versus what is
> deferred (remote sync, auth, skill packaging). `status` (§5's v1.1 item) is now
> implemented too.

---

## 1. The problem

Agents accumulate durable state — handoff notes between sessions, decisions,
open questions, pointers to prior work. In `holaxis-agentstate` that state lives
behind an MCP server, a D1 database, an OAuth flow, and a worker. That is the
right shape for a hosted, multi-tenant meta-observer, but it is heavy for the
common case: *one developer or agent, on one machine, who wants their knowledge
to be a file they can read, diff, grep, commit, and hand to someone else.*

`agentstate-lite` targets that case. The goals:

- **Portable** — a knowledge store is a directory of markdown. It survives the
  tool. It opens in any editor, renders in GitHub, and diffs in git.
- **CLI-first** — the primary interface is a small agent-facing CLI (AXI), not a
  network protocol. Everything works offline.
- **Standards-native** — rather than invent a bespoke schema, conform to an
  existing open format so the artifacts interoperate with other tools.
- **Shareable** — one command bakes the whole store into a single self-contained
  HTML file you can send to anyone.

The standard we build on is the **Open Knowledge Format (OKF) v0.1 (Draft)**.

---

## 2. OKF alignment

We adopt OKF as the on-disk format so agentstate-lite bundles are *also* valid
OKF Knowledge Bundles — readable by Google's reference agent, its visualizer, and
any future OKF tooling. This section carefully separates **what the spec
requires** from **what we chose**.

**Spec citations** — OKF v0.1 (Draft), published by Google Cloud in
[`GoogleCloudPlatform/knowledge-catalog`](https://github.com/GoogleCloudPlatform/knowledge-catalog)
under `okf/`:

- `okf/SPEC.md` — §3 bundle structure, §3.1 reserved filenames, §4/§4.1 concept
  docs + frontmatter, §5 cross-linking, §6 index files, §7 log files, §8
  citations, §9 conformance, §11 versioning.
- `okf/src/reference_agent/bundle/document.py` — the reference *producer*
  (stricter than the spec; see below).
- `okf/src/reference_agent/viewer/` — `generator.py` + `templates/viz.html` +
  `static/viz.js` + `static/viz.css`, the reference static-HTML *consumer*.
- `okf/bundles/{ga4,stackoverflow,crypto_bitcoin}/` — real sample bundles.

### 2.1 What OKF *requires* (not our invention)

- A **Knowledge Bundle** is a directory tree of UTF-8 markdown files (§3). It is
  the unit of distribution (git repo, tarball, or subdir).
- Every non-reserved `.md` file is a **Concept**; its **Concept ID** is the path
  minus `.md` (e.g. `concepts/link-graph.md` → `concepts/link-graph`) (§4).
- The **only required frontmatter field is `type`** — a free-form, non-registered
  string, non-empty (§4.1, §9.2). `title`, `description`, `resource`, `tags`,
  `timestamp` are recommended/optional. Producers MAY add arbitrary keys;
  consumers MUST preserve unknown keys and MUST NOT reject a bundle over missing
  optional fields, unknown types, extra keys, or broken links (§9,
  permissive-consumption).
- **`index.md`** and **`log.md`** are **reserved at any directory level** (§3.1).
  They are *not* concept documents, carry no frontmatter, and are exempt from the
  `type` rule — with one exception: the bundle-**root** `index.md` MAY carry
  frontmatter *solely* to declare `okf_version: "0.1"` (§11).
- **Cross-links are standard markdown links** `[text](target)` — **not**
  `[[wikilinks]]` (§5). Two forms: absolute bundle-relative `/a/b.md`
  (spec-recommended, move-stable) and relative `./x.md` / `../y.md`. A link is an
  **untyped directed edge**; the relationship *kind* lives in prose (§5.3). Links
  to nonexistent targets are valid (not-yet-written knowledge). **Backlinks are
  derived**, never stored — the reference `viz.js` reverses the resolved edge set
  to render "Cited by".
- **Freshness** is the optional ISO-8601 `timestamp` field ("last meaningful
  change"). OKF has **no** staleness flag, TTL, or dependency tracking —
  *staleness is entirely a consumer-derived judgment.*
- **Conformance (§9)** is intentionally permissive: parseable frontmatter on
  every non-reserved file, a non-empty `type` on each, and `index.md`/`log.md`
  following §6/§7 when present.

### 2.2 What we *chose* (design decisions, not spec)

| Decision | Choice | Why | Alternative we rejected |
| --- | --- | --- | --- |
| **Cross-link form** | Emit **relative** links (`../references/okf-spec.md`) | The reference `generator.py` `_extract_links` builds graph edges from **relative** links only (it `continue`s past absolute `/…md` and `://`). Relative links keep the graph + backlinks populated in Google's *unmodified* viewer, matching the `ga4` sample. | Absolute `/…md` is spec-recommended and is what the reference `viz.js` body-nav clicks resolve — but it yields **empty** edges/backlinks in the reference graph. |
| **Our viewer resolves both** | Our own visualizer resolves **relative *and* absolute** `.md` links for **both** edges and in-body navigation | Fixes the reference tooling's internal inconsistency (edges←relative, nav←absolute) so a producer isn't forced to choose. | Copying the reference split (one form for edges, another for nav). |
| **Frontmatter strictness** | Populate `type` + `title` + `description` + `timestamp` on every concept | Matches the reference *producer* (`document.py` `REQUIRED_FRONTMATTER_KEYS`), the de-facto interop bar with Google's reference agent — even though §9 requires only `type`. | Spec-minimal (`type` only) — interoperable but rejected by the reference producer. |
| **`type` vocabulary** | `Context Note`, `Concept`, `Reference` (extensible) | Free-form per spec; drives visualizer coloring. The reference palette only knows 3 BigQuery types and paints the rest gray — our types render gray there, colored in our viewer. | A central registry (OKF has none). |
| **Relationship kind** | Expressed in **prose** next to the link (e.g. "supersedes", "continues") | OKF has no typed-edge slot; stashing it in a frontmatter key would be invisible to the graph. | Typed edges (unsupported by the format). |
| **fresh / stale / empty** | Layered in *our* tooling on top of the raw `timestamp` (age vs. now, and vs. upstream dependency timestamps) | The format deliberately omits staleness — it is ours to define. | Encoding a `stale` flag in frontmatter (fights the format). |
| **Organizational layering** | Model workspaces / initiatives / groupings via **folders + `type` + links + `index.md`** — not first-class hierarchy entities | OKF is domain-agnostic and minimal; one uniform model (typed concept docs in directories, related by links) is the whole point. A layer that needs its own status/policy becomes a `type: Initiative` (etc.) index doc; "workspace-as-access-boundary" is a Stage-1 backend-namespace concern, not in-bundle modeling. The link graph carries cross-cutting structure a folder tree can't. | First-class workspace/initiative primitives — needed by a task engine like canonical AgentState, unnecessary for a knowledge store. |

### 2.3 Alignment mapping table

How each agentstate concept maps onto an OKF primitive (grounded in OKF §a–§d of
the format's own mapping guidance):

| agentstate concept | OKF representation | Where it lives | Notes |
| --- | --- | --- | --- |
| **Context note** | A concept document with `type: Context Note` | `context-notes/<id>.md` (the `context-notes` recipe's declared `path` prefix) | Authored via the `context-notes` recipe convention + GENERIC tooling — `new "Context Note" <id>` scaffolds it, `doc read`/`doc update`/`doc write` read/edit it. No bespoke command or codec; core has zero knowledge of the type. Metadata (`title`/`description`/`timestamp`/`tags`) in frontmatter; a `# Summary` body section is the one the recipe declares/scaffolds. `resource` omitted (abstract concept). |
| **Link / pointer between notes** | A standard **relative** markdown link in the body | A bullet list of links in the body | Untyped directed edge; kind stated in prose. |
| **Backlink ("cited by")** | **Derived**, not stored | Computed at view time by reversing the edge graph | No `cited_by` field exists. |
| **Freshness / staleness** | The `timestamp` frontmatter field | written on every `doc write`/`doc update` | `fresh`/`stale`/`empty` is *our* derived judgment on top. |
| **HTML share** | A single self-contained static HTML visualizer | `viz.html` (one file, embedded JSON blob) | Mirrors `okf/…/viewer`: Cytoscape graph colored by `type`, marked.js body panel, derived "Cited by". |

A conformant worked example ships in
[`examples/sample-bundle/`](../examples/sample-bundle) (4 concepts, relative
links, a context note, a mirrored reference, and `index.md`/`log.md`).

---

## 3. Architecture

Three layers; the third is optional and deferred.

```
┌─────────────────────────────────────────────────────────────┐
│  agentstate-lite bundle  =  an OKF Knowledge Bundle (a folder)│
│                                                               │
│   index.md          (root; declares okf_version)              │
│   log.md            (chronological history, §7)               │
│   context-notes/…   (type: Context Note)                      │
│   concepts/…        (type: Concept)                           │
│   references/…       (type: Reference; mirrors external src)  │
└─────────────────────────────────────────────────────────────┘
        ▲ producer/consumer                    │ render
        │                                       ▼
┌──────────────────────────┐        ┌───────────────────────────┐
│  @agentstate-lite/cli     │        │  @agentstate-lite/viewer   │
│  (AXI, agent-facing)      │        │  bundle dir → one viz.html │
│  init·write·read·list·    │        │  (inline CSS/JS + JSON;    │
│  status·note              │        │   Cytoscape + marked)      │
└──────────────────────────┘        └───────────────────────────┘
        │
        │  (LATER, optional)
        ▼
┌──────────────────────────┐
│  remote sync adapter      │  push/pull a bundle to a hosted store
│  (HTTP + auth)  — v2+      │  reusing holaxis-agentstate's worker
└──────────────────────────┘
```

- **`@agentstate-lite/core`** — the store engine: bundle I/O, frontmatter
  parse/serialize, link extraction, derived backlinks, freshness judgments, and
  the context-note mapping. Storage is routed through a pluggable
  `StorageBackend` (default: `FilesystemBackend`). *(Implemented — see §7.)*
- **`@agentstate-lite/cli`** — the agent-facing CLI (`axi`): TOON output by
  default, a capped exit-code taxonomy, and a zero-arg offline "home" view. Pure
  filesystem; no network in v1. *(Implemented — see §7.)*
- **`@agentstate-lite/viewer`** — takes a bundle directory and emits **one**
  self-contained static HTML file. Backend-free; data never leaves the page.
  *(Implemented — see §7.)*
- **Remote sync (LATER)** — an optional adapter that pushes/pulls a bundle to a
  hosted docstore, reusing the ported HTTP/OAuth machinery from
  `holaxis-agentstate`. **Explicitly out of scope for v1**; the filesystem is the
  source of truth.

**Key stance:** the filesystem bundle is primary and self-sufficient. Remote is a
sync *target*, never a dependency. Everything must work with the network off.

---

## 4. Port map — build plan from `holaxis-agentstate`

`agentstate-lite` is seeded by porting the CLI + schema layers from
`holaxis-agentstate` and dropping everything HTTP/OAuth/D1. Actions:
**copy** (verbatim/near-verbatim), **adapt** (rework for filesystem/OKF),
**drop** (remote-only, not needed in v1), **new** (net-new for OKF).

### 4.1 Copy — universal, no remote dependency

| Source | Purpose |
| --- | --- |
| `packages/cli/src/errors.ts` | Exit-code taxonomy (0/1/2/4/5/6) + `CliError` + `ErrorEnvelope`. |
| `packages/cli/src/output.ts` | TOON rendering + `OutputMode` (format-agnostic; renders frontmatter naturally). |
| `packages/cli/src/args.ts` | `parseOrUsage` over `node:util` `parseArgs`; maps parse errors to a USAGE `CliError`. |
| `packages/cli/src/invocation.ts` | `import.meta.url` self-reference resolution (works offline). |
| `packages/cli/src/index.ts` | Entry point; delegates to `cli.ts main()`. |
| `packages/schemas/src/content-type.ts` | Extension→MIME table; reusable for a frontmatter `content_type`. |
| `packages/schemas/src/validation.ts` | WARN-FIRST zod validation layer; reused for the OKF frontmatter schema. |

### 4.2 Adapt — rework for filesystem + OKF

| Source | Adaptation |
| --- | --- |
| `packages/cli/src/credentials.ts` | Keep the atomic-write + `0600/0700` secret-file discipline for `~/.agentstate/okf-config.json`; drop `refresh_token` mechanics. |
| `packages/cli/src/config.ts` | Simplify SERVER resolution to an optional bundle path + defaults (no remote in v1). |
| `packages/cli/src/reference.ts` | `COMMAND_GROUPS` single source of truth → `[Bundle, Documents, Links]` + `init/list/read/write/status`. |
| `packages/cli/src/cli.ts` | Keep the `axi-sdk-js` dispatcher + pre-routed offline `home`; drop the Claude-Code SessionStart hook; register OKF commands. |
| `packages/cli/src/commands/home.ts` | Repurpose the zero-arg offline view to show **bundle status** (doc count, last modified, command reference). |
| `packages/cli/src/commands/promote.ts` | File upload → **local file → markdown+frontmatter write** (keep URL-builder logic, drop `authedFetch`). |
| `packages/cli/src/commands/pull.ts` | Docstore GET → **local markdown+frontmatter → file read** (keep sha256 integrity verify + `--out -` stdout). |
| `worker/src/routes/docs.ts` · `docs_promote.ts` | **Reference-only.** Extract `mergeDescriptorOverrides` / taint logic into `okf/descriptor.ts`; the HTTP handlers themselves drop. |

### 4.3 Drop — remote-only, restore later behind the sync adapter

`http.ts`, `oauth.ts`, `pkce.ts`, `loopback.ts`, `browser.ts`,
`commands/login.ts`, `commands/whoami.ts`, `commands/hook.ts`,
`worker/src/routes/cas_write_head.ts`, `worker/src/routes/read_list_head.ts`, and
the D1 migrations (`0001…`, `0002…`). Rationale: OAuth/HTTP/D1 and the
CAS-conflict loop exist only for the hosted backend; filesystem writes are atomic
via temp+rename, so there is no conflict retry, no auth gate, and no database in
v1. The later HTTP sync adapter can restore these.

### 4.4 New — net-new for OKF

| Module | Responsibility |
| --- | --- |
| `okf/bundle.ts` | Initialize + validate bundle structure (root `index.md`, tree). |
| `okf/frontmatter.ts` | Parse/serialize markdown + YAML frontmatter (reuses `validation.ts`). |
| `okf/read.ts` / `okf/write.ts` | Load with integrity verify / atomic write with frontmatter merge. |
| `okf/link.ts` | Cross-link extraction + derived-backlink graph. |
| `okf/visualizer.ts` | Static HTML explorer (**shipped as `@agentstate-lite/viewer`**). |
| `commands/init·read·list·write·status` | The OKF command surface. |

*Rough size:* ~1,450 ported LOC + the net-new OKF modules.

---

## 5. Roadmap

- **v0 (now)** — scaffold: typed `core` contract, a conformant example bundle,
  and a working viewer generator. *(See §7.)*
- **v1 — filesystem store** — implement `core` against the contract; port the CLI
  per §4 (`init`, `write`, `read`, `list`, `status`); TOON output;
  offline `home`. Ship `axi` as an installable skill.
- **v1.1 — freshness + status — DONE.** `fresh`/`stale`/`empty` derive from `timestamp`
  (age + dependency comparison); `status` reports orphaned docs and unresolved links (a
  deliberate rename from "broken" — OKF §5 permits links to not-yet-written knowledge) plus
  a kind-conformance lint and a freshness sweep. Duplicate-ID detection was dropped as
  redundant: an id IS its storage path, structurally unique per backend.
- **v1.2 — richer viewer** — type-palette config, tag view, offline mode
  (inline Cytoscape + marked so the file is self-contained for *code*, not just
  data).
- **v2 — optional remote sync** — an HTTP adapter that push/pulls a bundle to a
  hosted store, restoring the dropped auth/HTTP modules *behind* the filesystem,
  never in front of it.

**Open format-churn question:** OKF v0.1 is explicitly Draft ("minor bumps add
optional fields; major bumps may rename required fields / change reserved
filenames"). We keep `okf_version` configurable and follow §9's mandate to
attempt best-effort consumption even for an unrecognized version, rather than
hard-coding v0.1 assumptions.

---

## 6. Conformance self-check

The shipped example bundle validates against the OKF brief:

- §9.1 parseable frontmatter on every non-reserved file — **pass**
- §9.2 non-empty `type` on every concept — **pass** (`Concept`, `Context Note`,
  `Reference`)
- §3.1 root `index.md` declares only `okf_version: "0.1"`; subdir `index.md`
  files carry no frontmatter — **pass**
- §6 `index.md` = `# Heading` + `* [title](rel-url) - desc` bullets — **pass**
- §7 `log.md` = `## YYYY-MM-DD` date headings — **pass**
- §5 relative cross-links all resolve (0 broken); graph = 4 nodes / 7 edges;
  backlinks derive correctly — **pass**
- reference-producer bar (`type`+`title`+`description`+`timestamp`) satisfied on
  all concepts — **pass**

---

## 7. Current state

Honest inventory of what exists **today** in this repo. Full wired/partial/
deferred detail lives in [`STATUS.md`](../STATUS.md); this is the summary.

| Area | State |
| --- | --- |
| `packages/core` | **Implemented and hardened.** The full OKF store engine: one frontmatter parser (gray-matter/js-yaml), one bundle walk, one link resolver, derived backlinks, `timestamp` freshness, reserved `index.md`/`log.md` handling, and the kind-conventions registry (`kinds.ts` — see NORTH-STAR §9). Fully convention-agnostic — no bespoke type gets privileged code (context notes are a bundle-declared convention, authored via generic tooling). Storage is routed through a pluggable `StorageBackend` carrying content-addressed versions, compare-and-swap writes, actor attribution, history, and batched reads — proven over THREE adapters: `FilesystemBackend` (default; same-process writes serialized per doc), `MemoryBackend` (enforced CAS), and `RemoteBackend` (the wire-protocol client). 93 unit tests pass. |
| `packages/cli` (`agentstate-lite` / `aslite`) | **Implemented.** `init` (applies the built-in context-notes recipe), `doc write/read` (kind-aware warnings + `--strict`), `new` (create a governed instance, e.g. `new "Context Note" <id>`)/`kinds`/`recipes`/`recipe add`, `status` (whole-bundle health report), `list`/`query`, `link add/show`, `view`, `serve` (boots the reference wire server), `--remote <url>` on every bundle command, `login`/`whoami`, `hook`, plus a stubbed `sync`. TOON output, exit-code taxonomy (0/1/2/4/5/6). |
| `packages/viewer` | **Implemented, as a pure consumer of `core`.** `generateVisualization(bundleDir)` builds the node/edge graph via `core`'s `query` + link resolver (relative *and* absolute `.md` links) and emits one self-contained `viz.html` (inline CSS/JS, embedded JSON, Cytoscape + marked from CDN, derived "Cited by"). Verified end-to-end on the example bundle (4 nodes, 7 edges). |
| `examples/sample-bundle/` | **Complete and OKF-conformant** (see §6). Externally-shaped (unquoted timestamps, relative links, wrapped bullets) — the interop case, and it now round-trips correctly. |
| Remote (wire protocol) / auth | **Partially built.** The `StorageBackend` seam over HTTP is specified (`docs/WIRE-PROTOCOL.md`) and implemented by reference: `packages/server` (Web-standard fetch router + `node:http` bootstrap, loopback-only default) and core's `RemoteBackend`, with tri-backend contract parity. `serve` + `--remote` run the full remote loop on one machine. **Still deferred:** a hosted deployment (CF Worker + D1/R2 front-runner — NORTH-STAR §8) and all auth (Stage 2; the `Authorization` slot is reserved on the wire). `sync` remains a loud `NOT_IMPLEMENTED` stub. |
| `status` command | **Implemented.** A read-only, whole-bundle health report: kind-conformance lint (reusing `validateAgainstKind`), an "unresolved links" scan (OKF §5 permits links to not-yet-written knowledge — this is informational, not "broken"), an orphan scan (concept docs with zero inbound links, derived by reversing the same edge set the unresolved-link scan builds), and a freshness sweep over kinds with a declared horizon. Pure composition — no new core logic. Duplicate-id detection (the old v1.1 wishlist item) was dropped: an id IS its storage path, structurally unique. Exit is always 0 once the analysis runs; findings are reports, not errors. See STATUS.md. |
| npm packaging | **Done.** `packages/cli` is the publishable npm package `agentstate-lite` (bins `agentstate-lite`/`aslite`): an esbuild single-file ESM bundle with zero runtime deps, verified standalone via `npm pack` + temp-dir run. `hook install` writes a real multi-runtime SessionStart hook, and every emitted `help:` hint resolves to the real invocation — the former phantom `dist/axi` is resolved. The `npm publish` itself remains human-gated and has not been run. |

**Known caveats.**

- The viewer loads Cytoscape.js + marked from CDN, so it is self-contained for
  *data* but not for *code* — matching the reference viewer. A truly offline
  single file (inlined libs) is a deferred item.
- The viewer's client-side `viz.js` contains its own small in-browser link
  resolver for click-navigation. That is runtime JS emitted into the HTML, not a
  second build-time parser — the graph itself is resolved once, server-side, by
  `core`'s single resolver.
- Storage ships with three adapters behind the `StorageBackend` seam: the
  filesystem (default), an in-memory adapter (enforced CAS — the hard-case
  proof), and `RemoteBackend` over the wire protocol. What does *not* exist yet
  is a hosted deployment to point `--remote` at — Stage 1's remaining unit
  (NORTH-STAR §7/§8).
