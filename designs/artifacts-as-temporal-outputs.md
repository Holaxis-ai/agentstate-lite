---
type: Design
title: 'Artifacts are temporal outputs, not Views'
actor: openai/codex
timestamp: '2026-07-22T01:58:33.864Z'
---
# Artifacts are temporal outputs, not Views

**Status:** Recommended design, 2026-07-21. This separates a product concept that the current
home surface intentionally collapsed during the first UI pass. It does not authorize an
implementation yet.

## Decision

Reserve **View** for a durable, reusable human interface over a bundle. Introduce **Artifact** as
the record of a produced output intended for a human to inspect, review, compare, or retain as
provenance.

The distinction is semantic and lifecycle-based, not file-format-based:

| Concept | Authority | Typical lifetime | Examples |
| --- | --- | --- | --- |
| Document | Durable knowledge | Long-lived and revised | design, decision, task, note |
| View | Reusable interface or lens | Installed until deliberately removed | board, roadmap, review queue |
| Artifact | Output of a particular act of work | Recent, then superseded or archived | proposal rendering, analysis report, diagram, prototype |

A View may be self-contained and have no bundle-data access. An Artifact may be HTML. Neither fact
changes its product role. `bridge` remains only a security capability; it must never again stand in
for lifecycle semantics.

## Why this correction is needed

The current model overloads “artifact” in four incompatible ways:

1. The home surface maps every `bridge: none` View to an `artifact` badge. That treats a security
   capability as an information-architecture category. A durable About or explainer View is then
   labeled temporal even when it is part of an installed operating model.
2. The earlier [home-surface design](home-surface.md) explicitly called self-contained HTML
   “artifacts” and placed it beside live Views as one flat grid. That was a useful simplification
   before the universal doc reader existed, but it made HTML carry both “content format” and
   “produced output” semantics.
3. The generic Review Request View calls every linked evidence document an artifact, even when the
   target is a Design, Task, Roadmap Item, or View. “Artifact” there means evidence, not a type.
4. Core and CLI documentation use artifact as a generic synonym for blob, package result, test
   report, or generated file. Those are implementation usages, not a user-facing domain model.

The [document reader](doc-reader.md) changes the premise. Plain narrative no longer needs to be
wrapped in HTML and registered as a View merely to become human-readable. Views can now become
sharply about reusable interaction, leaving Artifact available for the temporal output concept the
word naturally suggests.

## Product model

### View

A View is a durable entry in the bundle's launcher and usually travels with an operating model or
recipe. It answers a recurring question or supports a recurring activity. Its `bridge` value
describes what the sandbox may ask the trusted shell to do:

- `none` — self-contained content with no bundle-data access;
- `bundle-read` — a live lens over bundle state;
- `bundle-propose` — a live lens that may propose a governed change for human confirmation.

These should be labeled `content`, `live data`, and `can edit` (or comparably accurate language),
not `artifact`, `interactive`, and `app`. Capability is displayed but does not organize lifecycle.

### Artifact

An Artifact represents one produced output. It is an OKF concept document with typed metadata and
ordinary links, optionally backed by byte-exact content in the blob store. The concept record makes
the output queryable, attributable, linkable, and visible to agents without forcing its bytes into
model context.

Recommended v1 convention:

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

Example instance:

```yaml
type: Artifact
title: Architecture proposal — visual walkthrough
status: active
entry: artifacts/architecture-proposal.html
entry_version: sha256:...
actor: agent/builder
timestamp: 2026-07-21T20:00:00Z
```

The associated `.md` record lives at `artifacts/architecture-proposal.md`; its byte payload may
live beside it as the blob key `artifacts/architecture-proposal.html`. The filesystem and wire
backends already support this without a new storage tier.

### Snapshot integrity

An Artifact is a produced snapshot, not a mutable mini-website. `entry_version` pins the exact blob
version returned by `promote`. The shell must re-read the blob and compare that version before
rendering. A mismatch fails closed with an integrity message; it never silently shows different
bytes under the same reviewed identity.

A meaningful revision creates a new Artifact and links `supersedes` to the prior one. The prior
record moves to `superseded`; it is not overwritten or deleted. This gives review evidence a stable
identity while preserving a simple lineage. `archived` removes an output from active surfaces
without erasing provenance.

The convention can communicate this rule immediately, but conventions cannot enforce the
cross-object `entry`/`entry_version` invariant alone. Runtime rendering and `status` diagnostics
must eventually own it. Until then, bundle-only dogfood is advisory and should not claim immutable
review evidence.

## Human experience

### Home

The home surface should present three distinct projections:

1. **Views** — durable launcher entries; no temporal grouping.
2. **Recent outputs** — the newest `Artifact` records with `status: active`, capped (for example six)
   with a count and a “view all” route.
3. **Activity** — the event-like stream of all recent document changes, including Artifact
   creation and lifecycle changes.

An Artifact card shows title, description, actor, creation time, and the work/review relationships
that give it context. Recency is the organizing principle. Superseded and archived Artifacts remain
searchable/readable but disappear from the default home shelf.

No automatic retention or TTL is proposed. Temporal means recency-oriented, supersedable, and
archivable—not disposable. Deletion remains explicit.

### Opening an Artifact

`?view=artifact&id=artifacts/...` opens trusted shell chrome around the exact pinned payload. HTML
renders in the existing opaque-origin sandbox with the existing nonce, CSP, and `connect-src
'none'` posture. The Artifact receives **no bridge capability at all**: it is not a View, has no
`bridge` field, cannot query bundle data, and cannot propose mutations.

This must reuse one lower-level sandboxed-byte-frame implementation shared with View rendering;
it must not create a second human runtime. The admission predicates remain intentionally distinct:

- a View is admitted by a valid `View` registry document and safe `views/` entry;
- an Artifact is admitted by a valid `Artifact` record, safe `artifacts/` entry, and exact
  `entry_version` match.

The shared frame owns nonce/CSP/session delivery. The domain-specific predicate owns what may be
framed. Pulled HTML opened directly remains trusted content; the sandbox is a property of the UI
runtime, as recorded in the [Page/View model](page-model-and-viewer-deprecation.md).

The first runtime slice should support self-contained HTML only. Images, PDF, notebooks, and other
content types can later use the same Artifact record and content-type-derived renderer; they should
not be speculative fields in the v1 Kind.

## Human review

Artifact and Review Request have separate authority:

- **Artifact** says what output exists and which snapshot it is.
- **Review Request** says who must judge what question, what evidence is in scope, and what decision
  was made.

The Review Request convention should gain one typed relationship:

```yaml
links:
  reviews artifact: Artifact
```

The generic review View then presents linked Artifacts using the Artifact route, while continuing
to present Designs, Tasks, and Roadmap Items as ordinary evidence. It must stop calling every
evidence target an artifact.

Approval state stays exclusively on Review Request. An Artifact must not grow `approved`,
`changes_requested`, reviewer, or decision fields; that would duplicate the existing workflow
authority. When changes are requested, an agent produces a successor Artifact and the requester
updates the Review Request's evidence link before resubmission.

## Agent experience

The first dogfood path should use existing generic primitives:

1. `promote` a uniquely named HTML file under `artifacts/` and capture its returned version.
2. `new "Artifact" ... --status active --entry ... --entry_version ...`.
3. Create ordinary typed links to its context and, when applicable, from a Review Request via
   `reviews artifact`.

Do not add an `artifact create` command before this sequence is used. If agents repeatedly fumble
unique naming, version capture, or the two-object creation sequence, that is evidence for a small
command or shared service that owns it. The semantic model should precede convenience machinery.

An agent deciding where output belongs uses this test:

- Will humans use this interface repeatedly as bundle state changes? **View.**
- Is this the output of this particular act of work, presented for inspection or review?
  **Artifact.**
- Is the value primarily the durable claim or reasoning itself? **Document.**

### Promotion to a View

Sometimes an Artifact proves reusable. Promotion is explicit and additive: copy/adopt its bytes
under `views/`, create a new View registry document, and retain the Artifact as provenance. Do not
flip the Artifact's type or point a View directly at the `artifacts/` key; the separate prefixes
keep the lifecycle and security predicates honest. A future `promoted to` relationship may record
the transition if dogfood needs it.

## Recipes and portability

Artifacts are instance data. Definitions-only recipes must never export or install Artifact
instances. They may carry the Artifact Convention when the operating model needs it, just as the
review-workflow recipe carries Review Request and View definitions without requests.

Do not make Artifact a default built-in recipe yet. First dogfood the convention on this board and
one private bundle. If the model survives real agent creation, human review, supersession, and
archive, package the convention with the review workflow or as a small composable recipe. The
[recipe-export design](recipe-export.md) should classify Artifact instances as data to strip.

## Terminology cleanup

Reserve capitalized **Artifact** for this domain concept in user-facing product language.

- Storage bytes are **blobs**, not artifacts.
- A recipe contains **definitions/resources/items**, not artifacts.
- CI and packaging may still use qualified phrases such as “build artifact” or “workflow
  artifact”; those are established technical terms and are not bundle concepts.
- A Review Request links **evidence**; only a target whose type is Artifact is called an Artifact.
- `bridge: none` is a **content View** or **no-data-access View**, never automatically an Artifact.

This cleanup should be scoped to user-facing truth. It is not a mandate to rename every local
variable named `artifact` where the technical meaning is already qualified and unambiguous.

## Delivery sequence

### Unit 0 — bundle-only dogfood, no product code

- Add the Artifact Convention to this project's bundle.
- Add `reviews artifact: Artifact` to the Review Request Convention.
- Create two real Artifacts through generic CLI primitives, supersede one, and use the other in a
  Review Request.
- Record creation friction and whether `active/superseded/archived` is the right lifecycle.

### Unit 1 — semantic UI correction

- Rename the `bridge: none` View badge from `artifact` to `content` (exact wording can be user
  tested).
- Stop calling all review evidence artifacts.
- Update the home/doc/View authoring descriptions that currently repeat the conflation.

This unit is valuable even if the Artifact runtime is never built.

### Unit 2 — first-class Artifact reading

- Add one core-owned Artifact registration/integrity predicate using the existing safe path and
  content-addressed version primitives.
- Extract/reuse the sandboxed byte-frame mechanics; do not fork nonce/CSP/session behavior.
- Add Artifact route, recent-output query, capped home shelf, exact-version refusal, and integrity
  diagnostics (dangling entry, version mismatch, orphan `artifacts/` blob).
- Review at the high-risk tier because executable bundle bytes gain a new shell admission path,
  even though the sandbox mechanism is reused.

### Unit 3 — review integration and packaging

- Teach the generic Review Request View to open typed Artifacts.
- Decide from dogfood whether the convention belongs in review-workflow, a standalone recipe, or
  both through future recipe composition.
- Consider authoring sugar only from observed friction.

## Non-goals

- No new storage backend, database table, event backbone, or retention service.
- No auto-deletion, garbage collector, or hidden local-only blob tier.
- No Artifact write bridge or direct bundle-data access.
- No attempt to turn every output file, test report, or generated byte into an Artifact concept.
- No migration of existing content Views by inference.
- No approval workflow inside Artifact; Review Request remains the authority.
- No new renderer per file type in the first slice.

## Migration posture

Nothing migrates automatically. Existing `View`/legacy `Page` records remain valid:

- durable About, architecture, and explainer interfaces stay Views;
- one-off HTML produced for a particular review may be manually re-authored as Artifact after the
  runtime exists;
- legacy Page compatibility remains untouched;
- the View registry and `views/` prefix do not broaden to accept Artifact records or
  `artifacts/` entries.

The separation is forward-only. It sharpens new authoring without turning a semantic cleanup into
a risky content migration.

## Success criteria

The model is working when:

1. A new user can explain “Views are tools; Artifacts are outputs” without learning `bridge`.
2. An agent places three representative outputs correctly without founder clarification.
3. The home surface does not accumulate one-off deliverables in its permanent View grid.
4. A Review Request can point at an exact Artifact snapshot and the shell refuses changed bytes.
5. Superseded outputs leave the default home shelf but remain linked and readable.
6. A reusable output can become a View without erasing its origin.

## Related decisions

- [Home surface](home-surface.md) — the current flat View grid and artifact badge this design
  refines.
- [Document reader](doc-reader.md) — removes the need to use HTML/View registration for ordinary
  narrative reading.
- [Page/View model](page-model-and-viewer-deprecation.md) — retains the one sandbox runtime and
  the enforced capability boundary.
- [Trusted View actions](trusted-page-actions-and-shared-mutation-boundary.md) — remains exclusive
  to registered Views; Artifacts never inherit it.
- [Review Request workflow](../tasks/review-request-workflow.md) — the durable decision authority
  that consumes Artifact evidence.
- [Recipe export](recipe-export.md) — must strip Artifact instances as data.
