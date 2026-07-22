---
type: Design
title: Shareable HTML artifacts — a first-class output kind with a one-command create
actor: mike/claude
timestamp: '2026-07-22T03:06:58.335Z'
---
# Shareable HTML artifacts — a first-class output kind with a one-command create

**Status:** Design, 2026-07-22. Design-reviewed (fable, code-grounded — verdict SOUND TO BUILD);
this revision folds the review in. SCOPES the buildable v1 of
[artifacts-as-temporal-outputs](artifacts-as-temporal-outputs.md) (the concept doc) down to the
driving need — *an agent produces HTML, a human views and keeps it* — and leads with the agent
experience. Reviews and strict snapshot-integrity are deferred (see Non-goals). Views are untouched.

## The need

An agent produces an output — a report, a diagram, a visual walkthrough, a prototype — and needs a
human to see it. Today the ONLY way to render HTML in the shell is to register it as a `type: View`.
That has two costs:

1. **Co-location.** One-off outputs land in the launcher's flat grid beside durable interactive
   tools (board, roadmap, review queue). The launcher — meant to be a stable set of *tools* —
   accumulates one-off *deliverables*. Tools and outputs are different verbs (operate vs inspect)
   and want opposite organizing principles (stable vs recency); one grid cannot serve both.
2. **Wrong model.** A produced output is forced through the View admission path and its `bridge`
   capability model, when what it actually is is a self-contained snapshot that should reach
   nothing.

These outputs are **not throwaway**: they must be findable, attributable, and lifecycle-managed
later (in Browse, in `list`, linkable, "who made this and when", supersedable). So this is a
first-class concept, not a pastebin link.

## Decision

Introduce **Artifact** as its own kind — a produced output — rendered through the *existing* sandbox
runtime (reused, never forked), reached from its own **"Outputs"** surface, never a launcher tool
tile. An agent creates one with a **single command**.

**Artifact is broad in CONTENT, precise in ROLE.** The role is tight — *a produced output a human
inspects and keeps: a deliverable, not a tool (View), not durable knowledge (Document)*. What varies
is the payload's content-type. **HTML is not a subtype — it is the first content-type v1 renders.**
The renderer dispatches on the `entry` blob's content-type (v1: `text/html` → the sandbox frame);
PDF, image, notebook, etc. are *future renderers on the SAME kind*, not new kinds and not speculative
fields on the v1 convention.

**Artifact is a PRODUCT kind, like View — with an OPT-IN convention.** To be *rendered*, the
admission predicate must recognize `type: Artifact` in **core** (exactly how `PAGE_TYPE_NAMES`
hard-codes View/Page in `core/src/page.ts`). So the admission predicate is product-level and
convention-independent — an Artifact renders whether or not a bundle declares an Artifact
Convention. The Convention doc is **opt-in sugar** for `list`/Browse field validation and freshness,
not a prerequisite for creating or viewing. `artifact create` therefore works on any bundle.

**Explicitly deferred (not rejected):**

- Review-Request integration (`reviews artifact`, review-of-record).
- The `record.entry_version` ⇄ blob-version binding *at mint* (see Snapshot integrity). NOTE the
  existing frame ALREADY fail-closes on blob drift between mint and serve (`launchIsCurrent`); what
  v1 defers is only the record↔blob equality check at mint, softened to a non-blocking notice.
- The recency-ordered "Recent outputs" home-shelf polish.
- **Remote (`--remote`) artifact viewing** — v1 is `--dir` mode; remote-mode admission is a
  follow-on (the mint/serve remote-compat path assumes View/Page today).
- **Non-HTML content-types** — one HTML renderer in v1; other renderers are additive later.

**Views are UNTOUCHED** — forward-only; nothing migrates, the View registry and `views/` prefix do
not broaden, legacy `Page` stays valid.

## The kind

Admission is product-level (core knows `type: Artifact`). A bundle MAY additionally declare the
opt-in Convention for `list`/Browse validation:

```yaml
type: Convention
title: Artifact
governs: Artifact
path: artifacts/
fields:
  required: [title, status, entry, entry_version]
  optional: [description]
  values:
    status: [active, superseded, archived]
  terminal:
    status: [superseded, archived]
links:
  supersedes: Artifact
```

An Artifact instance is a normal concept doc under `artifacts/`, so it flows through every generic
surface for free: `list`, Browse (it can even declare `browse_collapsed`), typed links, attribution,
the doc reader. `entry` is the blob key (e.g. `artifacts/q3-analysis.html`); `entry_version` pins the
promoted blob's content-addressed version. The `.md` record and its blob coexist under `artifacts/`
(the bundle walk partitions on `.md` both ways); no new storage tier.

## Agent experience — the bar is "very straightforward"

ONE command owns the whole sequence:

```
aslite artifact create ./report.html --title "Q3 analysis"
→ created artifacts/q3-analysis · open: ?view=artifact&id=artifacts/q3-analysis
```

Order (the create is: **derive id → promote → write record**, not the reverse — the blob key needs
the id first):

1. Derive a collision-safe id from the title (e.g. `artifacts/q3-analysis`).
2. `promote` the bytes to `artifacts/q3-analysis.html`; `writeBlob` returns the version token
   in-process — the hash never surfaces to the agent.
3. Write the Artifact record via the create-only mutation path (actor, expect-absent CAS, the
   board-attribution hook), with `entry` + `entry_version` (the captured token) + `status: active`.
4. Print the record id and the viewable route.

**Partial-failure semantics** (two — with `--supersedes`, three — expect-absent CAS writes): follow
the `new --link` precedent — no silent rollback; the receipt NAMES what completed and what didn't, so
a re-run is idempotent (a promoted-but-unrecorded blob is re-adopted, not re-promoted to a colliding
key). Supersede is the same command with a flag:

```
aslite artifact create ./v2.html --title "Q3 analysis" --supersedes artifacts/q3-analysis
→ artifacts/q3-analysis-2 active · artifacts/q3-analysis → superseded (+ supersedes link)
```

This DELIBERATELY overrides the concept doc's "do not add an `artifact create` command before the
raw sequence is used." That guard is against a command that is a thin *alias* for the generic path
(why the `note` command was deleted — gate 3). `artifact create` is not that: it OWNS a fumble-prone
multi-step sequence (promote → capture `sha256:…` → two-object write), eliminating a real,
predictable fumble. It is sugar over the generic path, which still exists underneath.

## Rendering — reuse the ONE runtime, one core predicate

The sandbox byte-frame already exists: a nonce-gated `/__page/<nonce>` route serving bytes to an
opaque-origin `sandbox="allow-scripts"` (no `allow-same-origin`), `referrerPolicy="no-referrer"`
iframe under the shell CSP (`connect-src 'none'`). An artifact frames its HTML through THAT — no
second human runtime (gate 4). What is new is only the **admission**, and it must be ONE predicate in
`core/src/page.ts`, consumed identically at mint AND both re-validation paths — never re-derived by
prefix-sniffing (that is exactly the "rejected-by-launcher-but-served-by-nonce" divergence the View
predicate's own doc warns of).

- **Server:** extend the ONE admission predicate to also admit a `type: Artifact` record → its
  `artifacts/` blob, capability **hardwired to `none`** (an artifact never gets a bridge; it
  structurally cannot reach `/v0/*`). The launch carries an explicit **admission discriminant**
  (View | Artifact) so `servePageBytes`' re-validation branches on the discriminant, not the prefix.
  A record that *declares* a `bridge` field is **refused**, not silently downgraded (fail-closed
  against a misleading record). Path-escape/`.md`-segment/confinement defenses are the *reused*
  `assertSafeBlobKey`/`isEntryKeyUnder` — an artifact entry must be under `artifacts/` and be the
  record's own declared entry.
- **SPA:** a `?view=artifact&id=…` route; an **`ArtifactFrame`** = `PageFrame` MINUS the entire
  bridge — no postMessage broker, no `bundle-read`/`bundle-propose`, no trusted-action confirmation
  dialog, no capability ref (always `none`). ~100 lines vs `PageFrame`'s 450. Content-type dispatch:
  v1 frames `text/html`; a non-HTML entry shows an honest "no renderer for `<content-type>` yet".
  **Lifecycle (snapshot posture):** it does NOT hot-reload on a blob change; on record **deletion**
  it goes to a terminal "this output was removed" state (mirroring PageFrame's revoke); on SSE
  **resync** it does NOT reload (a reload would fetch *new* bytes and break the snapshot). The
  sandboxed-iframe leaf (`sandbox`/`referrerPolicy`) is extracted ONCE and shared with PageFrame (or
  pinned by an agreement test) so the two surfaces cannot drift on the sandbox attributes.
- **Reached from:** an "Open output" affordance on the Artifact's **doc-reader** page, its row in
  **Browse**, and the launcher **"Outputs"** section — never a Views tile (structural: `listPages`
  filters to View/Page registrations).

## Human experience

The launcher gains an **"Outputs"** section listing `status: active` Artifacts, distinct from
"Views". Clicking opens the sandboxed HTML. Superseded/archived Artifacts drop off the Outputs shelf
but stay in Browse and the reader (findable, never erased; deletion stays explicit). The
recency-ordered shelf polish is deferred — a plain list is fine for v1.

**Fold the concept doc's badge fix in here:** `Launcher.tsx` currently labels `bridge: none` Views
with the badge word **"artifact"**. An "Outputs" section of real Artifacts beside View tiles badged
"artifact" is a one-screen contradiction, so Unit 2 renames that badge to **"content"** (the design's
own Unit-1 relabel).

## Snapshot integrity (precise)

The frame ALREADY fail-closes on blob drift *within a launch*: `launchIsCurrent` compares the served
blob's version to the minted one and revokes on mismatch. So v1 is NOT "no integrity". What v1 defers
is the `record.entry_version` ⇄ `blob.version` equality *at mint* — a one-line `sha256:` token
compare (`handleMint` already holds both). Enforcing full refusal would brick opening after an
in-place re-promote (hostile for dogfood, where an agent iterates), so v1 instead surfaces a
**non-blocking visible notice** on a record/blob mismatch and still frames the current bytes; hard
refuse-changed-bytes lands when review-of-record needs it. Adversarial QA should attack THIS boundary
(the mint-time binding), not a nonexistent "no integrity".

## Security — high-risk tier

A **new shell admission path for executable HTML bytes** → Builder → independent review →
**adversarial QA**. Invariants to attack:

- An Artifact frame is granted capability `none`; its nonce authorizes ONLY its one blob key and
  opens no `/v0/*` route. (The trusted-action service independently requires `bundle-propose`, so
  even a misrouted artifact cannot escalate — but the predicate refuses a bridge-declaring record
  anyway.)
- Confinement: an Artifact's `entry` resolves under `artifacts/` (safe-key predicate) AND is the
  declared `entry` of a valid `type: Artifact` record — never an arbitrary blob, a `views/` entry,
  the record `.md` itself, or a path escape.
- Opaque origin / `no-referrer` / CSP / `connect-src 'none'` reused unchanged.
- ONE core predicate, consumed at mint and both re-validation sites via the launch discriminant —
  the single biggest build risk is scattering this across sites instead.

## Delivery

- **Unit 1 — the kind + the create command (low risk).** The core admission-predicate hook for
  `type: Artifact` (data-only; no render path yet), the opt-in Artifact Convention, and
  `aslite artifact create` (derive-id → promote → record; `--supersedes`; receipt-names-failures).
  Dogfood by creating real artifacts on this board — they appear in `list`/Browse immediately.
  Validates the create ergonomics and the shape cheaply, before the security-sensitive runtime.
- **Unit 2 — the viewer (high risk).** The server admission branch (discriminant + `none` +
  refuse-bridge), the `ArtifactFrame` + `?view=artifact` route + content-type dispatch + snapshot
  lifecycle, the launcher "Outputs" section, the reader "Open output" affordance, the "artifact"→
  "content" badge rename, and the non-blocking integrity notice. Built under the adversarial posture
  above. `--dir` mode only; remote-mode viewing is a follow-on.

## Non-goals (v1)

- No review workflow, no `reviews artifact` link, no approval state.
- No hard `entry_version` refuse-changed-bytes gate (non-blocking notice only; the frame does not
  hot-reload).
- No non-HTML renderers (same kind, additive later — no speculative content-type fields now).
- No remote-mode artifact viewing (dir-first).
- No new storage backend, TTL, auto-delete, or hidden blob tier.
- No touching Views, no migration by inference, no broadening the View registry / `views/` prefix.
- No second human runtime — the sandbox frame is reused.
- No default built-in recipe — dogfood on this board (and one private bundle) before packaging.

## Related

- [artifacts-as-temporal-outputs](artifacts-as-temporal-outputs.md) — the concept this scopes to a
  buildable v1 (reviews + strict integrity deferred; agent-experience-first; one-command create;
  content-type dispatch).
- [doc reader](doc-reader.md) — the reader page an Artifact record renders in (the "Open output"
  affordance).
- [home surface](home-surface.md) — the launcher the "Outputs" section joins; the badge relabel.
- [document discovery](document-discovery.md) — Browse, where Artifacts appear as their own kind.
