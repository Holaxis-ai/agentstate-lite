---
type: Review Request
title: 'Architecture review: Kinds, relationships, and self-describing domain models'
status: changes_requested
reviewer: Brian Derfer
requested_by: Michael Collier
question: >-
  Does the implemented Kind architecture, shipped Kind/field descriptions (PR
  #42), and shipped relationship descriptions (PR #51) form a coherent
  domain-model foundation; does that shipped relationship implementation
  validate the extension path now being applied to enum-value descriptions in PR
  #52; and should section descriptions/examples remain evidence-gated?
actor: codex-main
decision_summary: >-
  The overall architecture is sound, but changes are requested because the
  generic link command cannot create two differently named relationships to the
  same target, even though the graph model treats them as distinct. The
  explainer's relationship and enum status labels must also be updated before
  approval.
timestamp: '2026-07-14T17:03:02.187Z'
---
# Context

AgentState now has an implemented architectural slice to review, not merely a proposal. Bundle-owned
Kind conventions define relatively stable domain vocabulary; documents, values, links, and blobs are
changing state; the generic CLI is the deterministic action boundary; and Pages are contextual,
read-only projections.

PR #42 shipped the first self-description layer through that existing path: the standard Convention
`description` communicates what a Kind represents, `fields.descriptions` communicates field meaning,
the one parser and `KindConvention` registry carry both, and ordinary CLI discovery and creation help
surface them. No second schema, parser, registry, endpoint, or domain-specific command was introduced.

This review asks whether that implemented slice validates the larger architecture and whether the
remaining roadmap extends it coherently. The linked explainer packages what exists, why the boundaries
matter, how semantic metadata flows to consumers, and what is deliberately still only planned or
hypothesized.

# Requested decision

Please judge each of the following explicitly:

1. Does the implemented architecture correctly treat Kind conventions and declared relationship
   vocabulary as the relatively stable domain model, while documents, field values, links, and blobs
   remain changing bundle state?
2. Is the authority path coherent: Convention Markdown → one parser → one `KindConvention` registry →
   generic CLI and UI discovery → agents and Pages?
3. Does the shipped Kind/field-description work demonstrate that semantic guidance can extend the
   model without creating a parallel schema, executable prose, or domain-specific command surface?
4. Are relationship descriptions the right next P1 extension and enum-value descriptions the right
   later P2 extension? Should section descriptions/examples remain evidence-gated?
5. Are Pages correctly bounded as projections and skills/plugins as procedural delivery, rather than
   competing semantic authorities?
6. Does this package explain the architecture honestly and usefully enough for another architect or
   team to evaluate it? What important boundary, failure mode, or conceptual layer is missing?

# Acceptance criteria

A complete review:

- records `approved` or `changes_requested` with a concise `decision_summary`;
- answers all six judgments, including conditions or counterexamples;
- identifies any incorrect Current, Next, Later, or Hypothesis label in the explainer;
- distinguishes a blocking architectural objection from an optional future enhancement;
- comments on whether the two diagrams communicate the authority and stable/volatile boundaries; and
- preserves this Context, Requested decision, and Acceptance criteria when filling the Reviewer response.

# Reviewer response

> **Final architecture review — status: `changes_requested`.** The implemented foundation is
> conceptually sound, but the blocking typed-link materialization mismatch and the explainer's stale
> implementation labels must be corrected before approval.

## Decision record

- **Final status:** `changes_requested`.
- **Decision summary:** The overall architecture is sound, but changes are requested because the
  generic link command cannot create two differently named relationships to the same target, even
  though the graph model treats them as distinct. The explainer's relationship and enum status labels
  must also be updated before approval.
- **Blocking architectural objection:** The generic mutation boundary cannot currently materialize
  two differently typed relationships from one source to the same target, although the graph model
  treats those links as distinct semantic edges.
- **Review-package corrections required:** Update stale roadmap labels and the explainer's current
  implementation inventory. These are accuracy defects, not independent architectural objections.

### In Plain Language

The overall design looks sound, but one real link-creation bug currently prevents a clean approval.
The explainer also describes the project as it stood before two recent pieces of work advanced, so
its status labels need updating. This review formally requests those changes before approval.

## Evidence reviewed

- Implementation on `main` at `c92497a`, including the Kind parser/registry, graph derivation,
  generic `new` and `link` commands, recipe path, UI Kind transport, and Page registry/bridge model.
- Linked self-describing-Kinds design, portable-cognitive-ecosystem design, roadmap item, four tasks,
  and the `architecture-kinds` explainer Page.
- Shipped evidence: PR #42 for Kind/field descriptions and PR #51 for relationship descriptions.
- In-flight evidence: the enum-value-description task records PR #52 as ready but unmerged from the
  reviewed `main` revision.
- Focused implementation tests previously run during this review: relevant core suites 143/143 and
  targeted CLI suites 138/138. The first CLI run was blocked only by loopback sandbox permissions;
  the permitted rerun passed.
- Diagram assessment below is based on the Page's rendered structure, labels, accessibility text,
  and responsive CSS. Pixel-level visual QA remains pending because the browser runtime was not
  available in this review environment.

### In Plain Language

These findings come from reading the working code, the project records, and the explainer. The
relevant automated tests passed. I could inspect what both diagrams say and how they are structured,
but I could not open a fully rendered browser view to judge visual polish such as spacing or clipping.

## Initial findings requiring disposition

### Candidate blocking objection — typed-link identity is inconsistent at the write boundary

`queryEdges` explicitly defines per-literal-link semantics: links from the same source to the same
target with different display text are distinct rows, and exact link text carries the declared
relationship type (`packages/core/src/bundle.ts`, around lines 431–465). In contrast, `link add`
declares an add idempotent whenever *any* existing link resolves to the target, without considering
its text (`packages/cli/src/commands/link.ts`, around lines 318–326).

Counterexample: if document A already contains a `citation` link to document B, asking the generic
CLI to add a `depends on` link to the same document returns `changed: false`; the requested
`depends on` assertion is not written.
That behavior was reproduced in a scratch bundle. The architecture therefore recognizes two semantic
edges that its generic action boundary cannot always create.

**Closure condition:** key add-link idempotency by `(resolved target, exact text)` and add a regression
test, or explicitly redefine and consistently enforce target-only edge identity. The latter would
conflict with the current typed-edge carrier and graph-query contract, so the former is preferred.

### In Plain Language

A document can have more than one meaningful connection to the same other document. For example,
one report might both “cite” and “depend on” another report. AgentState can read those as two different
connections, but its command for adding links currently refuses to add the second one because it sees
that the destination is already linked. The add command should consider both the destination and the
relationship name before deciding that a link already exists.

### Lower-risk coherence issue — one invocation can observe more than one registry snapshot

`new` loads a Kind registry once for parsing and validation (`packages/cli/src/commands/new.ts`, around
line 336), but each delegated `addLink` performs a fresh registry load during linting
(`packages/cli/src/commands/link.ts`, around line 137). With concurrent convention edits, links added
by one `new` invocation could be interpreted against different model snapshots.

**Recommended hardening:** pass the invocation's registry, or precomputed link declarations, through
the generic link operation. Treat this as a non-blocking implementation improvement unless the
documented consistency contract requires a single atomic model snapshot per invocation.

### In Plain Language

One command can reread the model while it is still running. Usually nothing changes during that short
time, but if someone edits a Kind at exactly the wrong moment, different parts of the same command
could follow different versions of the rules. Reusing the first reading would make behavior more
predictable. This is useful hardening, not presently the main reason to reject the architecture.

### Clarifications the package should state explicitly

- “Relatively stable” is a governance and semantic distinction, not a separate persistence tier.
  Convention documents are ordinary versioned bundle documents and can change.
- Declared relationship vocabulary is open-world guidance today. Undeclared or mismatched link types
  warn but are still written; descriptions must not be described as closed-world enforcement.
- Changing a convention can immediately reinterpret existing documents and links. There is no
  convention-version pin, instance migration, or historical schema snapshot in the current model.
- Semantic descriptions are optional and non-executable. The roadmap phrase “executable shared
  language” is misleading and should be replaced with “operationally usable shared language” or
  similarly bounded wording.

### In Plain Language

Kinds are important shared definitions, but they are still editable files in the bundle. Their
descriptions help people and agents understand the data; they do not run code or impose every rule.
Changing a Kind can change how existing records are understood, and AgentState does not yet provide a
database-style migration process for that change.

## Six required judgments

### 1. Stable domain model versus changing bundle state

**Provisional judgment: conceptually yes; operationally not yet unqualified.** Kind conventions and
declared relationship vocabulary are correctly modeled as the relatively stable language used to
interpret changing documents, values, links, and blobs. The separation is semantic: both model and
instances remain bundle-owned, versioned content. This is the right local-first boundary and avoids a
hidden application database.

Conditions and counterexamples:

- The package must not imply that conventions are immutable or physically outside bundle state.
- Model evolution currently reinterprets existing state without pinning or migration; that is
  acceptable only while historical interpretation and managed recipe upgrades remain non-goals.
- The target-only `link add` idempotency counterexample prevents an unqualified “implemented
  correctly” finding because some declared semantic relationships cannot be materialized.

### In Plain Language

The basic idea is right: definitions change slowly, while day-to-day records change often. Both still
belong to the user in the same bundle. The important exception is the link bug described above, which
means the software cannot always record the relationship the model allows.

### 2. Authority path coherence

**Provisional judgment: yes, with one snapshot-consistency caveat.** Convention Markdown flows through
`parseConventionDoc` into the shared `KindConvention` registry. Generic CLI discovery/help and the UI
Kinds transport consume that registry; agents receive meaning through generic discovery, and Pages can
project it through the read-only UI path. PRs #42 and #51 extend the same path rather than adding a
second schema, parser, registry, endpoint, or domain-specific command family.

Conditions and counterexamples:

- “One registry” must mean one authoritative interpretation, and preferably one snapshot per logical
  invocation; the `new` → `addLink` reload should be hardened as noted above.
- Agents and Pages are downstream consumers, not new parsing authorities. A generated Page that copies
  definitions permanently instead of querying current discovery metadata may become stale, but it does
  not supersede the Convention authority.

### In Plain Language

There is one official place where a Kind's meaning is declared. The command line, agents, and Pages
should read from that place instead of keeping their own competing definitions. The current flow
mostly does this. One command rereads the definitions partway through its work, which is a small
consistency risk.

### 3. Kind/field descriptions as proof of extensible semantic guidance

**Provisional judgment: yes.** The shipped slice demonstrates that optional semantic metadata can
extend the existing Convention document, parser, `KindConvention`, serializer/recipe path, CLI help,
and UI transport. Descriptions guide judgment but do not alter validation or execute instructions.
There is no domain-specific command surface.

Condition: keep descriptions declarative, optional, and non-executable. Embedded prompts, validation
expressions, transitions, triggers, computed fields, or UI layout would cross the boundary into a
parallel language. Also correct the roadmap's ambiguous “executable shared language” wording.

### In Plain Language

The shipped descriptions prove that AgentState can add helpful explanations without inventing a
second database design or a special command for every business area. They should remain explanations,
not hidden programs that run rules or control screens.

### 4. Relationship, enum-value, and evidence-gated sequencing

**Provisional judgment: yes on the architectural sequence; the explainer's status labels are stale.**
Relationship descriptions are the correct P1 extension because link labels are the semantic carrier
and direction is frequently ambiguous. That extension has already shipped through PR #51. Enum-value
descriptions remain the correct next P2 extension because labels such as lifecycle states can validate
syntactically while remaining semantically ambiguous; PR #52 is in progress but not in reviewed
`main`. Section descriptions and examples should remain evidence-gated because they add authoring and
display surface without yet demonstrating an unaddressed class of misuse.

Counterexample/wake condition: promote section descriptions or examples only when dogfooding shows a
recurring semantic error that Kind, field, relationship, and enum descriptions cannot prevent at the
point of use. Do not promote them merely for completeness.

### In Plain Language

Describing relationships was the right next step and is already finished. Explaining allowed choices,
such as what each status really means, is the right work now. More descriptions and examples should
only be added if real users keep making mistakes that the existing explanations do not solve.

### 5. Pages as projections; skills/plugins as procedural delivery

**Provisional judgment: yes.** The Page primitive is bundle-owned content in a sandbox with explicit
`none` or read-only `bundle-read` capability. It projects bundle state and does not own mutations or a
second domain model. Skills teach procedures and judgment; plugins deliver recipes, skills, Pages, and
assets. Explicit recipe adoption remains separate from plugin installation and bundle mutation.

Conditions and counterexamples:

- Page-authored labels or grouping are presentation choices, not semantic declarations. Reusable
  domain meaning should come from Kind discovery rather than being maintained only in Page code.
- A future Page mutation bridge would need scoped deterministic commands, authorization, attribution,
  and CAS—not direct ad hoc writes from generated JavaScript.
- Installing executable plugin helpers must remain visibly distinct from applying data-only recipes.

### In Plain Language

Pages are views of the shared information, like different dashboards over the same records. Skills
teach an agent how to work, and plugins deliver those materials. None of them should quietly become a
second place that defines what the data means. If Pages ever gain editing controls, those edits should
go through the same safe, recorded commands as every other change.

### 6. Honesty and usefulness of the architecture package

**Provisional judgment: useful and structurally clear, but not yet accurate enough for approval as-is.**
The package explains the central layering, non-goals, trust posture, and portable-ecosystem hypothesis
well enough for another architect to understand the intent. It needs the status corrections below and
should make four boundaries more prominent:

1. relationship vocabulary is advisory/open-world rather than hard enforcement;
2. convention evolution currently has no version pinning, migration, or historical interpretation;
3. literal link text is edge type and therefore part of edge identity at materialization time; and
4. relative stability is governance over ordinary bundle documents, not a separate store.

The broader portable-ecosystem design already discusses recipe collisions, trust tiers, unsafe local
upgrades, and ephemeral rather than replayable live events. The concise explainer should link or
summarize those failure modes so readers do not mistake an architectural north star for shipped
guarantees.

### In Plain Language

The package explains the big idea well, but it is not fully up to date and leaves out a few practical
warnings. A new team should be told plainly that link rules are guidance rather than hard enforcement,
that changing a Kind can change how old records are understood, and that the link-creation command has
the important mismatch described above.

## Current / Next / Later / Hypothesis label audit

- **Current: stable vocabulary over changing state — correct with qualification.** Say
  “relatively stable” or “governance-stable” because conventions are editable bundle documents.

- **Current: Kind and field descriptions shipped in PR #42 — correct.** No status change is needed.

- **“Relationship and enum meaning are the next proposed layers” — partly incorrect.** Relationship
  meaning is now shipped/current; enum meaning is next/in progress.

- **Next · Relationships — incorrect.** Change this to `Shipped · Relationships` / Current and cite
  PR #51.

- **Later · Enums — incorrect.** Change this to `Next · Enums` / in progress. Do not call it Current
  until PR #52 merges.

- **Evidence-gated: section descriptions and examples — correct.** Retain the evidence gate and its
  wake condition.

- **Hypothesis: portable cognitive ecosystem — correct.** Retain Hypothesis until founder-to-founder
  transfer evidence exists.

- **Not implemented now: relationship descriptions — incorrect.** Remove relationship descriptions
  from this list. Enum descriptions remain unimplemented on the reviewed `main` revision.

- **“Labels reflect the project board as of July 2026” — stale.** Refresh the Page from the current
  roadmap item or remove the date claim.

No Hypothesis label currently needs promotion. The explainer should distinguish “Current on reviewed
`main`” from “ready in an unmerged PR” so an in-flight task does not become a shipped claim.

### In Plain Language

The explainer is behind the project board. Relationship explanations are finished, enum-value
explanations are the next work but are not yet part of the reviewed main code, and the larger
“portable cognitive ecosystem” remains an idea to prove through real use.

## Diagram review

### Diagram 1 — stable vocabulary over changing state

**Communicates the main boundary well, with one important ambiguity.** The three-stage flow makes the
relationship among domain vocabulary, generic deterministic operations, and the living bundle easy to
scan. It correctly places documents, values, links, and blobs on the changing-state side.

The left-to-right presentation can imply that the domain model is physically outside the bundle or
immutable. Add a caption or nested boundary showing that Convention documents are themselves
versioned bundle state whose *rate and governance of change* make them the relatively stable model.
Update the first node because relationship descriptions are now shipped.

### In Plain Language

The first diagram successfully says, “definitions change slowly; working records change often.” It
should also show that the definitions are still editable files inside the same bundle, not permanent
rules stored somewhere else.

### Diagram 2 — one description, one path to every consumer

**Communicates authority clearly.** Its sequence—Convention Markdown → parser → `KindConvention`
registry → operational discovery surfaces → humans/agents/Pages—matches the intended authority path,
and the accessibility label states the same flow.

Clarify the final fan-out: agents consume generic CLI discovery/help, while Pages consume the existing
UI Kind transport. Avoid any back-arrow from Pages or skills to the semantic model. If “one registry”
is meant as an invocation consistency guarantee as well as a code-ownership guarantee, the implementation
should stop reloading it inside delegated link mutations.

### In Plain Language

The second diagram clearly shows one official definition flowing outward to all users. It should make
clear that agents learn through the command-line discovery tools, while Pages receive the same
information through the UI data path. Pages and skills should not send competing definitions back
upstream.

## Blocking objection versus optional enhancements

### Blocking architectural objection candidate

- **Typed-link materialization identity mismatch.** Resolve before an unqualified approval because it
  contradicts the declared relationship vocabulary's carrier and the core graph contract.

### Required package corrections, but not architectural blockers

- Refresh relationship and enum roadmap labels and the implemented/not-implemented inventory.
- State that relationship conformance is warn-only/open-world.
- State that relative model stability is semantic/governance-based.

### Optional future enhancements

- Reuse one registry snapshot across a multi-step CLI invocation.
- Add convention-version pinning, previewable migration, provenance, or rollback only when a real
  second recipe version or historical-reproducibility requirement creates the need.
- Add recipe namespaces/collision handling when multiple adopted recipes demonstrably conflict.
- Add section descriptions/examples only after the recorded dogfood wake condition fires.
- Consider a durable ordered event spine only if Pages and coordination require guarantees stronger
  than invalidation and refresh.

### In Plain Language

The link-creation mismatch is the issue that can justify withholding approval. The outdated labels and
missing explanations must also be corrected, but they do not invalidate the underlying design. The
other ideas—model migrations, recipe namespaces, richer examples, and stronger live-event history—are
possible future improvements that should wait until real use proves they are needed.

## Completion checklist

- [x] Record the typed-link identity problem as a blocking change request.
- [x] Record final `changes_requested` status.
- [x] Add concise `decision_summary` metadata.
- [x] Answer all six judgments with conditions and counterexamples.
- [x] Identify incorrect Current, Next, Later, and Hypothesis labels.
- [x] Separate a blocking architectural objection from optional enhancements.
- [x] Review both diagrams' communication of authority and stable/changing boundaries.
- [x] Preserve Context, Requested decision, and Acceptance criteria unchanged.

[reviews design](../designs/self-describing-kinds.md)

[reviews design](../designs/portable-cognitive-ecosystems.md)

[reviews roadmap item](../roadmap-items/self-describing-domain-models.md)

[reviews task](../tasks/kind-field-descriptions.md)

[reviews task](../tasks/kind-relationship-descriptions.md)

[reviews task](../tasks/kind-enum-value-descriptions.md)

[reviews task](../tasks/kind-section-descriptions-examples.md)

[explained by](../pages-registry/architecture-kinds.md)

[reviews task](../tasks/typed-link-materialization-identity.md)
