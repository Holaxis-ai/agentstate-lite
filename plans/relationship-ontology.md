---
type: Plan
title: >-
  Proposal: relationship classes as a demand-enabling affordance (kernel + cheap
  extension)
actor: brian-claude
timestamp: '2026-07-14T22:15:50.159Z'
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

## Governance: a ratification gate, not role assignments (resolves the demand question)

The one rigid thing is narrow: the shared label->class map is shared state that
changes system behavior on every clone, so changes to it get RATIFIED — the same
reason code merges get review. Everything around that gate is open, and mostly
already works bottom-up:

- Agents freely coin labels today (the undeclared free-text tier is the sandbox), and
  those coinages are DEMAND SIGNALS, not noise: three agents independently writing
  "informs" is the system asking for a soft-dependency relation. The legend panel's
  unmapped-label list makes this pipeline visible — free text is variation, the drift
  list is observation, promotion into the map is selection.
- Anyone may PROPOSE a mapping — agents included, typically via the near-miss hint's
  ready-to-run `relationship derive` command, surfaced to their human or filed as a
  suggestion.
- Ratification sits with humans today; the gate can loosen deliberately over time
  (description-only mappings are reversible and low-risk — a future policy could let
  agents ratify those autonomously, reserving human sign-off for behavior-bearing
  changes).
- Once ratified, every agent thereafter uses the mapping correctly because the system
  teaches it at the moment of linking — the teaching surfaces, not the registry, are
  what make the decision real.

On demand for the class consumers themselves: we don't wait to observe it and we
don't bet blindly — we make expressing it cheap, and where a consumer embodies the
product's own pitch (evidence-backed claims, visible blocked work), we seed it as a
demonstration.

## What we build (three horizons)

NOW — the teaching surfaces (each small, none require new machinery):
1. Fix the skill's canonical link example to teach labeling honestly (our corpus
   shows ~80 of 284 edges carry junk id-default labels traced to this ONE example —
   behavior follows scaffolding). Value: a label is the hook all future meaning hangs
   on — labeled edges can be class-mapped retroactively in one line; id-default edges
   are permanently opaque. Teach BOTH forms: a meaningful --text when the relationship
   has one, and the explicit aside form when it genuinely doesn't — do not teach
   agents to invent fake semantics for see-also links.
2. Annotate class names onto the existing point-of-use link hints (new/link
   receipts). Value: this is how the class vocabulary gets into agents' heads AT ALL —
   classes are currently surfaced nowhere an agent looks, and agents demonstrably
   learn from what's in front of them mid-work, not from registries. A few added
   words per existing hint ("depends on — a DEPENDENCY link: feeds the blocked-work
   view") and every agent absorbs the categories as a side effect of normal work.
3. A status VOCABULARY line: labels total / class-mapped / free text / id-default —
   the drift self-audit. Value: the four-number gauge for the whole effort. Junk
   count climbing = the teaching fix isn't working; free-text piling up = the
   demand-signal queue of coinages awaiting promotion (the governance loop's
   observation step); mapped share growing = adoption is real. Turns "is the
   vocabulary converging or drifting?" from a research project (our audit took an
   agent an afternoon) into a glance — and keeps this proposal honest: if we ship
   everything and these numbers don't move, the proposal was wrong and the numbers
   will say so.
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
