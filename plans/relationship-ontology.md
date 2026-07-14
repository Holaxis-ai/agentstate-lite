---
type: Plan
title: >-
  Proposal: relationship classes as a demand-enabling affordance (kernel + cheap
  extension)
actor: brian
timestamp: '2026-07-14T21:51:07.861Z'
---
## The product thesis this rests on

We don't know our users' domains or workflows. We provide flexible infrastructure for
them and their agents to define and leverage their own. That places us deliberately
between two ends of a continuum: a thoroughly specified system (rigid, someone else's
workflow) and a blank canvas (infinitely flexible, no affordances at all). We aim for
the middle: JUST ENOUGH affordances that a person and their agents can quickly bend
the system to how they work.

Applied to relationships, that means: we are not shipping an ontology. We are shipping
a small kernel plus a cheap way to extend it — and the extension experience IS the
product surface.

## The proposal in one paragraph

Adopt a small kernel of relationship CLASSES (semantic groupings with stated system
behavior). Labels stay free: agents use a class name directly as a link label, or
humans coin clearer labels ("evidence") and map them to a class — a deliberate
curation act, made one-command cheap. Behavior keys on the class; a small set of
built-in class consumers ships as worked examples (the way our built-in recipes do),
because an affordance without a demonstration is invisible. Everything speculative —
extension machinery, validators, kind-level inheritance — is sequenced behind explicit
triggers, not built now.

## The kernel (five classes, one line each)

- hierarchy — "X is part of Y" (whole->part). Drives rollup progress + orphan checks.
  Today: contains.
- dependency — "X can't proceed until Y" (dependent->prerequisite). Drives
  blocked/runnable views. Today: depends on (currently INERT — see build list).
- succession — "X replaces Y" (newer->older). Drives head-collapse (only the current
  version shows). Today: supersedes.
- grounding — "X is warranted or specified by Y" (claim->evidence, task->design/
  decision). Drives staleness + unsupported-claim sweeps. Today: ~25 edges of untyped
  free text (evidence, design, plan, implements...) — our biggest unrealized family,
  on a product whose pitch is claims-backed-by-evidence.
- aside — "X merely references Y". Always legal, drives nothing, honest home for
  everything else.

(Open naming question for the session: split grounding vs specification as two NAMES
sharing one consumer initially — "implements" doesn't cue "grounding" for anyone.)

Each class declaration also states four properties consumers otherwise silently
assume: inverse label (supersedes/superseded-by are one relation, two viewpoints),
transitivity, acyclicity, and cardinality (can two roadmap items contain one task?).

## Division of labor (resolves the demand question)

Humans DECIDE ontology extensions — rare, deliberate. Agents IMPLEMENT and USE them —
frequent, cheap. We agree with our own review panel that agents won't independently
coin sound relationship semantics; that was never the requirement. The requirement is
that when WE decide "evidence should behave as grounding," an agent executes that
decision in one command and every agent thereafter uses it correctly because the
system teaches it at the moment of linking. Demand for class behavior is not
something we wait to observe; it is something we enable and, where it embodies the
product's pitch, seed with demonstrations.

## What we build (three horizons)

NOW — the teaching surfaces (each small, none require new machinery):
1. Fix the skill's canonical link example to carry a real --text label (our corpus
   shows ~80 of 284 edges have junk id-default labels traced to this ONE example —
   behavior follows scaffolding).
2. Annotate class names onto the existing point-of-use link hints (new/link receipts).
3. A status VOCABULARY line: labels total / class-mapped / free text / id-default —
   the drift self-audit.
4. A relationship legend on a bundle page: each class, its one-liner, its labels, and
   the unmapped-label list.

FIRST MACHINE — when ratified (this is the affordance itself):
5. A central label->class map living ON THE SHARED BOARD (it must sync with the edges
   it governs — a per-recipe declaration can make the same edge behave on my clone
   and do nothing on yours). Ships with its resolver, cycle guard, and dangling-base
   warning in one reviewed unit.
6. `relationship derive <label> --from <class>` as a one-liner, suggested by a
   near-miss hint when an agent's free-text label resembles a class. This is what
   makes "human decides, agent implements" real.
7. TWO demonstration consumers, shipped like built-in recipes: blocked/runnable from
   dependency (fixes depends-on's inertness — it is currently declared but does
   NOTHING, our own audit's most surprising finding) and an evidence-staleness /
   unsupported-claim sweep from grounding.

DEFERRED — explicit triggers, not now:
- Derivation-with-extension (narrowing target kinds, adding behavior): only when a
  validator can enforce that extensions never subtract from the base; until then,
  derived labels may add a description only. ("may supersede" is our standing test
  case: it may NOT derive from succession, because hiding a live doc is subtraction.)
- The labels-become-docs migration this eventually implies: decide that fork before
  any derivation build; it is the gate.
- Kind-level inheritance ("Bug extends Task"): SEVERED from this proposal. It is a
  different mechanism that merely rhymes (and per our mechanic's review, the cheaper
  one — registry-load-time merge, zero consumer changes). It belongs to the
  kinds/recipes track as its own decision.

## What we are deliberately NOT doing

No blessed "relates to" class (free text IS the escape hatch). No OWL-style reasoner
or axiom language. No attributes on edges (qualification lives in doc fields — our
review-request docs already prove the pattern: the verdict lives as status on the doc,
the edge just points). No doc-level "is a kind of" (is-a holds between concepts, not
artifacts; only convention docs are one-doc-one-concept, so derivation lives there and
nowhere else).

## What I'm asking you to ratify

1. The product framing above (demand-enabling; kernel + cheap extension as the
   product surface).
2. The five class names + their one-liner behaviors (and the grounding/specification
   naming question).
3. The four declared properties per class.
4. The three-horizon build list (items 1-4 now; 5-7 as the first machine; the
   deferrals as stated).
5. Severing kind-inheritance to the kinds track.
6. Resolving depends-on's inertness via demonstration consumer (item 7) rather than
   relabeling it documentation.

Full evidence trail: tasks/joint-ontology-session (six questions, five reviewer
reports, Decision Zero) and docs/relationships (the audited label index). This
proposal is the distillation; the session adjudicates it.

[evidence](../tasks/joint-ontology-session.md)

[evidence](../docs/relationships.md)
