---
type: Design
title: Shareable HTML artifacts — a first-class output kind with a one-command create
actor: mike/claude
timestamp: '2026-07-22T02:49:05.644Z'
---
# Shareable HTML artifacts — a first-class output kind with a one-command create

**Status:** Design, 2026-07-22. Up for review; not yet build-committed. This SCOPES the buildable v1
of [artifacts-as-temporal-outputs](artifacts-as-temporal-outputs.md) (codex's concept doc) down to
the driving need — *an agent produces HTML, a human views and keeps it* — and it leads with the
agent experience. Reviews and strict snapshot-integrity are deferred (see Non-goals). Views are
untouched.

## The need

An agent produces an HTML output — a report, a diagram, a visual walkthrough, a prototype — and
needs a human to see it. Today the ONLY way to render HTML in the shell is to register it as a
`type: View`. That has two costs:

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

Introduce **Artifact** as its own kind — a produced HTML output — rendered through the *existing*
sandbox runtime (reused, never forked), reached from its own **"Outputs"** surface, never a
launcher tool tile. An agent creates one with a **single command**.

**Explicitly deferred (not rejected):**

- Review-Request integration (`reviews artifact`, review-of-record).
- Strict `entry_version` fail-closed integrity (refuse-changed-bytes). v1's frame simply does not
  hot-reload — an output is a snapshot within a session — but does not yet *enforce* a version
  match; that hardening lands when review-of-record needs it.
- The recency-ordered "Recent outputs" home shelf polish.

**Views are UNTOUCHED** — forward-only; nothing migrates, the View registry and `views/` prefix do
not broaden, legacy `Page` stays valid.

## The kind

A plain OKF convention, no new engine code:

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

An Artifact instance is therefore a normal concept doc under `artifacts/` — it flows through every
generic surface for free: `list`, Browse (it can even declare `browse_collapsed` if a bundle wants
outputs tucked), typed links, attribution, the doc reader. `entry` is the blob key (e.g.
`artifacts/q3-analysis.html`); `entry_version` pins the promoted blob's content-addressed version.
The `.md` record and the `.html` blob live side by side under `artifacts/`; the filesystem and wire
backends already support this with no new storage tier.

## Agent experience — the bar is "very straightforward"

ONE command owns the whole sequence:

```
aslite artifact create ./report.html --title "Q3 analysis"
→ created artifacts/q3-analysis · open: ?view=artifact&id=artifacts/q3-analysis
```

It promotes the bytes under `artifacts/`, captures the returned version, derives a collision-safe id
from the title, writes the Artifact record (`entry` + `entry_version` + `status: active` + actor +
timestamp), and prints the viewable route. The agent **never** touches `promote`, **never** handles
a version hash, **never** manages two objects.

Supersede is the same command with a flag:

```
aslite artifact create ./v2.html --title "Q3 analysis" --supersedes artifacts/q3-analysis
→ artifacts/q3-analysis-2 active · artifacts/q3-analysis → superseded
```

This DELIBERATELY overrides the concept doc's "do not add an `artifact create` command before the
raw sequence is used." The raw sequence — `promote` → capture `sha256:…` → `new "Artifact" … --entry
… --entry_version …` — is fumble-prone *by inspection* (a hash copied between two commands' output
and input); the friction is predictable, not speculative, so the command is justified now. The raw
generic path still exists underneath; the command is sugar over it, not a parallel mechanism.

## Rendering — reuse the ONE runtime

The sandbox byte-frame already exists: a nonce-gated `/__page/<nonce>` route serving bytes to an
opaque-origin `sandbox="allow-scripts"` (no `allow-same-origin`), `referrerPolicy="no-referrer"`
iframe under the shell's CSP (`connect-src 'none'`). An artifact frames its HTML through THAT — no
second human runtime (gate 4). What is new is only the **admission path**:

- **Server:** generalize the mint/serve admission — today `parseRegistration` accepts only
  `type: View`/`Page` with a `views/` entry — to ALSO admit a `type: Artifact` record → its
  `artifacts/` blob, with capability **hardwired to `none`**. An artifact never gets a bridge, so it
  structurally cannot reach `/v0/*`. The `views/` confinement gains an `artifacts/` sibling.
  `servePageBytes`' re-validation branches the same way (re-read the Artifact record, confirm the
  entry is its declared entry).
- **SPA:** a `?view=artifact&id=…` route; an **`ArtifactFrame`** = `PageFrame` MINUS the entire
  bridge — no postMessage broker, no `bundle-read`/`bundle-propose`, no trusted-action confirmation
  dialog, no capability ref (it is always `none`). ~100 lines against `PageFrame`'s 450. It loads
  the entry blob and does NOT hot-reload on a blob change (an output is a snapshot).
- **Reached from:** an "Open output" affordance on the Artifact's **doc-reader** page, its row in
  **Browse**, and the launcher **"Outputs"** section — never a Views tile.

## Human experience

The launcher gains an **"Outputs"** section listing `status: active` Artifacts, distinct from
"Views". Clicking opens the sandboxed HTML through the route above. Superseded/archived Artifacts
drop off the Outputs shelf but remain in Browse and the reader (findable, never erased; deletion
stays explicit). The recency-ordered shelf polish (cap + "view all") is deferred — a plain list is
fine for v1.

## Security — high-risk tier

This opens a **new shell admission path for executable HTML bytes**, so it is built and reviewed at
the high-risk tier: Builder → independent review → **adversarial QA**. Invariants the QA must
attack:

- An Artifact frame is granted capability `none`; the nonce it holds authorizes ONLY its one blob
  key and opens no `/v0/*` data route.
- **Confinement:** an Artifact's `entry` must resolve under `artifacts/` (the safe-key predicate)
  AND be the declared `entry` of a valid `type: Artifact` record — never an arbitrary blob, never a
  `views/` entry, never a path escape.
- Opaque origin / `no-referrer` / CSP / `connect-src 'none'` are reused unchanged, not
  re-implemented (the frame is the same one Views use).
- The admission predicate for Views and Artifacts stays DISTINCT (a View is admitted by a `View`
  registry doc + `views/` entry; an Artifact by an `Artifact` record + `artifacts/` entry) — the
  shared frame owns nonce/CSP/session; the domain predicate owns what may be framed.

## Delivery

- **Unit 1 — the kind + the create command (low risk).** Add the Artifact convention; add
  `aslite artifact create` (promote + record + version-capture + id-derivation; `--supersedes`).
  Dogfood by creating real artifacts on this board — they appear in `list`/Browse immediately
  (viewing the HTML in-shell waits for Unit 2; until then `pull`/open works out-of-band). Validates
  the create ergonomics and the convention shape cheaply, before any security-sensitive runtime.
- **Unit 2 — the viewer (high risk).** The server admission generalization + `ArtifactFrame` +
  `?view=artifact` route + the launcher "Outputs" section + the reader "Open output" affordance.
  Built under the adversarial posture above. Delivers the full "produce HTML → human views it,
  separated from tools" value.

## Non-goals (v1)

- No review workflow, no `reviews artifact` link, no approval state (deferred).
- No strict `entry_version` fail-closed integrity gate — the frame just does not hot-reload;
  refuse-changed-bytes is a follow-on for when review-of-record needs it.
- No new storage backend, TTL, auto-delete, or hidden blob tier.
- No touching Views, no migration by inference, no broadening the View registry / `views/` prefix.
- No second human runtime — the sandbox frame is reused.
- No default built-in recipe — dogfood the convention on this board (and one private bundle) before
  packaging it with anything.

## Related

- [artifacts-as-temporal-outputs](artifacts-as-temporal-outputs.md) — the concept this scopes to a
  buildable v1 (reviews + strict integrity deferred; agent-experience-first; one-command create).
- [doc reader](doc-reader.md) — the reader page an Artifact record renders in (with the "Open
  output" affordance).
- [home surface](home-surface.md) — the launcher the "Outputs" section joins.
- [document discovery](document-discovery.md) — Browse, where Artifacts appear as their own kind.
