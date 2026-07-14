---
type: Task
title: Founders' joint ontology session (gates typed-relationships rung c)
status: todo
priority: '2'
description: >-
  The gate itself, as a board object (filed 2026-07-14 after Brian flagged that
  an undocumented blocker is untrackable). WHAT: Brian + Mike work session to
  align the shared link-type ontology — which relationship vocabulary the kinds
  declare, what rung-c write-time validation should enforce, and where
  convention beats enforcement. UNBLOCKS: roadmap-items/typed-relationships
  (validation rung c — currently queued on exactly this), and settles the parked
  rung-c enforcement wake condition. DONE WHEN: the session happens and its
  decisions land as a decisions/ doc; rung c then either becomes buildable tasks
  or is explicitly retired. Assignees: both founders (scheduling is the work).
actor: brian
timestamp: '2026-07-14T21:51:07.979Z'
---
## The decision agenda — plain-language edition (v2, 2026-07-14, after Brian's review)

Where we are today, in one paragraph: docs can be linked, and each link carries a text
label ("contains", "depends on", "supersedes"). Some doc types declare which labels
they use — that declaration is how the Roadmap page knows an item's tasks, and how the
Memory page follows claim-supersession chains. Anyone can also type ANY label on any
link, and nothing checks it. The `status` health report lists links whose labels don't
match a declaration, but only if someone runs it.

Each decision below has: what it means in plain terms, why it's worth answering now
(what's blocked or hurting), and the tradeoffs. Items 1 and 5 got the hardest look —
one is reframed as a prerequisite, the other marked deferrable.

### 1. Agree the starter set of relationship types (PREREQUISITE for 2, 3, and 6)

PLAIN: we currently use four relationship labels, each invented when a feature needed
it. Nobody ever looked at the list together and said "yes, these, with these meanings."

WHY NOW: on its own, nothing is blocked — the reframe is that this is the PREREQUISITE
step for the three enforcement questions below: you cannot check labels (2, 3) or
require belonging (6) until you've agreed what the legal labels ARE. It also has one
live pain point: we recently needed to say "this task GATES that roadmap item" and had
no label for it, so we used "contains" — which made a blocked item render as a progress
bar and directly caused the confusion that spawned this whole thread. Keep this step
LIGHT: ratify the four, define each one's direction in a sentence, add "gates/blocks"
if wanted, and agree how future labels get added. Thirty minutes, not a philosophy
seminar.

WHAT INCLUSION ACTUALLY ENTAILS (added 2026-07-14; see docs/relationships for the
tier model): "in the set" is a per-relationship choice of tier, and ratification only
grants tier 1 automatically. Concretely, including a relationship means:

- TIER 1 (automatic): write it into the declaring kinds' links maps with a description
  stating meaning and direction — one convention-doc edit, no product code. Buys
  discovery (kinds), teaching (new --link), and lint (target-kind + case variants).
- TIER INTENT (the decision's real content): label each relation either
  "documentation relation" (tier 1 by design — meaningful to readers, inert to the
  system; fine for e.g. reviews-*) or "mechanism relation" (tier 3 — something must
  CONSUME it), so nobody repeats the depends-on surprise (declared, assumed to
  schedule work, actually inert).
- CONSUMER TASKS: for every relation labeled mechanism, name the consumer — shipped
  page/code, or a filed task (e.g. depends-on -> blocked/runnable derivation).
- AMENDMENT RULE: agree how future labels join the set (edit a convention freely? a
  decisions/ doc first?) — this is the governance half.

TERMINOLOGY (Brian's discipline, 2026-07-14 — one word per register, so the three
never blur): SEMANTICS = the meaning itself, system-independent ("X cannot proceed
until Y"). CLASS = the system object that realizes that meaning (the declared
`class: dependency` that generic consumers key on) — classes are judged by whether
their behavior faithfully realizes their stated semantics. CATEGORY = the plain-
language word for the same grouping, reserved for explanations to humans. Bridge rule:
wherever a plain-language section meets a technical one, say explicitly that the
categories being described ARE the classes in the convention docs.

BRIAN'S PROPOSED FRAME (2026-07-14, pre-session position for Mike to react to): the
primitives are relationship SEMANTIC CLASSES, not labels. A minimal kernel — hierarchy
(contains-like: rollups, orphan checks), dependency (gates/depends-on-like:
blocked/runnable), succession (supersedes-like: head-collapse), annotation
(documentation-only, always legal) — plus one extension rule: a new label declares
{target kind, direction, class}, and system behavior keys on the CLASS via generic
consumers, never on the label. Labels stay free and expressive; behavior stays
predictable and rule-governed.

Precedent: this is the shipped fields pattern extended to links — `terminal` is a
declared property consumed by one generic mechanism (list --open, sweeps), and
`expects_inbound` already works exactly this way for links. Same architecture rule as
the repo's own engineering discipline (one owning primitive).

Honest caveat: classes amortize tier-3 work, they don't erase it — one generic
consumer must be built PER CLASS (the dependency-class consumer is the missing one
today, which is why depends-on is inert). The win is convergence: build
blocked/runnable once, every future dependency-class label gets it free.

If adopted, this frame mostly answers decision 4 too (class definitions are naturally
central; label declarations stay per-kind and recipe-friendly) and gives 2/3 a cleaner
enforcement target (key on class).

PANEL FINDINGS ON THE FRAME (2026-07-14 — researcher + adversarial skeptic, both
grounded in the live corpus: 284 edges, ~20 agent-invented free-text labels):

WHERE THEY CONVERGE (treat as settled input):
- The four categories are genuinely clarifying AS VOCABULARY — the skeptic could not
  break them as a way to talk and teach. Adopt the map.
- Do NOT build class-generic dispatch machinery now. The precedent claim was FALSE
  (checked in code: expects_inbound keys on the literal label string, not any class —
  no class-dispatch exists anywhere in the codebase), and the break-even math fails
  (~1.5 behavioral labels per class vs ~3 needed). Rule adopted from the skeptic:
  build a class's generic consumer LAZILY, when it earns its second behavioral label
  with proven-identical semantics (dependency = depends-on + gates is the candidate).
- A bare {class} tag is under-specified against links agents ALREADY wrote: "informs"
  is a SOFT dependency (blocked/runnable on it = wrong); "may supersede" is hedged
  succession (head-collapse on it hides a live doc). Declarations need more axes.
- Agents pattern-match nearby examples, not convention registries ("superseded by" and
  "may supersede" were coined right next to the active "supersedes"). Whatever is
  decided, the TEACHING CHANNEL (point-of-use hints, examples in docs) outweighs the
  declaration itself.

THE RESEARCHER'S TWO SUBSTANTIVE AMENDMENTS (the session's real new content):
1. SPLIT ANNOTATION. It is silently absorbing two families that should drive behavior:
   GROUNDING ("X is warranted by Y" — the evidence edges; arguably the product's
   defining relation, and today untyped free text) and SPEC/GOVERNANCE ("X is
   specified/decided by Y" — the corpus's biggest undeclared family: design, plan,
   decision, realizes, implements, ~22 edges). Proposed: five categories — hierarchy,
   dependency, succession, grounding (evidence+spec), and a truly-inert ASIDE.
   Grounding is also what decision 6 needs: without it, "a Decision should be
   reachable from what it decided" has nothing typed to enforce against.
2. DECLARE THE FOUR PROPERTIES. Bigger gap than any class: each relation should
   declare (a) inverse label (the corpus carries "supersedes" AND "superseded by" as
   unrelated strings a consumer would miss), (b) transitivity (rollups and
   head-collapse already silently assume it), (c) acyclicity (one generic cycle check
   instead of three hand-rolled), (d) cardinality (can a Task be contained by TWO
   items? whose progress bar owns it? — plus the recorded CLI bug that parallel
   distinct-label edges to one target can't be created).

VALIDATED BOUNDARY (both reports): stateful relationships belong in DOC FIELDS, not
edge classes — the reviews-* family reduces (verdict lives as status on the
Review-Request doc; the edge is mere grounding). And the declared NON-GOALS: no
blessed "relates to" class (free text IS that escape hatch), no OWL reasoner, no edge
attributes, no mention-derived relations.

STANDALONE ITEM SURFACED (does not wait for the session): depends-on's inertness —
give it a consumer or relabel it documentation; both reports flag it independently.

DECISION ZERO — DEMAND-FOLLOWERS OR DEMAND-SETTERS? (Brian's challenge to the panel,
2026-07-14, recorded above all six questions): the skeptics' timing arguments split in
two. The INVARIANT findings stand regardless of vision (a derivation unresolved
anywhere is inert on arrival; sync skew; narrow breaks authoring; the labels-aren't-
docs fork comes first) — these price and sequence the vision, they do not forbid it.
But the DEMAND findings ("no consumers exist", corpus break-even, ceremony pricing)
measure a corpus authored under the CURRENT scaffolding — and the panel's own
id-default root cause (one unlabeled skill example -> ~80 unlabeled edges) proves
behavior follows scaffolding. Demand measured under the old regime undercounts demand
under the new one. As founders of a category-defining system, demand is partly a
CHOICE: committing to grounding sweeps and blocked/runnable as product bets flips the
break-even math, because its key input was an absence the founders have authority to
end. BRIAN'S RESOLUTION (2026-07-14, for Mike to ratify — a third answer that dissolves
the dichotomy): the product is DEMAND-ENABLING. Product statement: "We don't know your
domain or workflow; we provide flexible infrastructure for you and your agents to
define and leverage them" — deliberately between a thoroughly-specified system (rigid)
and a blank canvas (no affordances): JUST ENOUGH affordances to let people and agents
quickly bend and extend the system to how they work.

Division of labor: HUMANS DECIDE ontology extensions (rare, deliberate — the panel's
"curation act", agreed: agents won't independently coin relationship semantics);
AGENTS IMPLEMENT them (frequent, cheap — which promotes the derive one-liner, the
near-miss hints, and the teaching surfaces from nice-to-haves to THE core product
surface; the panel was really reviewing whether the extension affordance is cheap
enough, and found it isn't yet).

Consequences: (a) the kernel classes are affordances, not features — small by design,
per the continuum; (b) built-in class consumers (blocked/runnable, evidence-staleness)
ship as REFERENCE DEMONSTRATIONS the way work-tracking/context-notes recipes do — an
affordance without a worked example is invisible, and examples are the one channel
agents demonstrably learn from; (c) the lazy rule survives but re-scoped: it governs
speculative machinery (extension validators, label-doc migration), not the affordance
surface itself; (d) precedent: this entire week's pages sprint IS the model working —
human decided board/roadmap/memory/drawer, agents implemented same-day within existing
affordances, zero product changes. The relationship system should feel like that.

FRAME v2 REVIEW PANEL — SYNTHESIS (2026-07-14; skeptic round 2 + mechanism reviewer +
agent-experience reviewer, all read-only, all empirical against the corpus and code.
This is the FINAL pre-read layer; the session adjudicates what follows.)

UNANIMOUS VERDICT: adopt-with-modifications. The vocabulary, the constitutive-home for
is-a, and the Liskov guardrail-as-discipline all survive again. The machinery as
framed does not. Three findings force the reshape:

1. DERIVATION IS CURATION, NOT AUTHORING (skeptic + devx, independently). At link time
   an agent has two zero-cost options (class-name-as-label, free text); authoring a
   convention doc first is a 3-4-decision tax nobody pays mid-task. Derivation is
   real but it is a RECIPE-DESIGN/curator act. If an ad-hoc derive path is wanted, a
   `relationship derive X --from Y` ONE-LINER is required, suggested by a near-miss
   hint — else describe the path honestly as curation-only.
2. THE RESOLVER IS THE UNAVOIDABLE MACHINE, AND LABELS AREN'T DOCS (skeptic +
   mechanic). Any synonym behaving requires label->class resolution everywhere, day
   one — else a derivation is inert-on-declaration (the depends-on bug one level up),
   and under sync/recipe skew it is inert-on-ONE-CLONE (worse: intermittent). Fixes:
   anything governing shared edges lives ON THE SHARED BOARD (this flips part of
   decision 4 toward central); resolver ships WITH cycle guard + dangling-base
   warning in one reviewed unit. AND the mechanic's load-bearing find: labels today
   are strings in a kind's links map, not docs — "derivation between convention docs"
   forces either a label-doc migration or a second declaration channel (a gate-3
   registry fork). That fork must be decided BEFORE any derivation build; it is the
   gate, not a detail.
3. THE TEACHING CHANNEL IS THE WHOLE BALLGAME (devx, with the corpus as user study).
   ~80 of 284 edges carry the ID-DEFAULT label because the agent passed no --text —
   root-caused to SKILL.md's canonical example being label-free. ONE example edit
   addresses more real authoring behavior than the entire class mechanism. Classes
   are surfaced NOWHERE today; the only surfacing that survives the
   copy-not-registries finding is (a) a near-miss hint on link add naming the nearest
   class + example labels + the exact derive command, and (b) the success receipt
   echoing the written label's class. Best-case capture even with everything built:
   ~half of coined labels; the rest legitimately stay free text.

SEVERANCE (skeptic + mechanic, emphatic): kind-inheritance (Bug extends Task) and
label-derivation are TWO mechanisms that rhyme, not one — and the polarity is the
REVERSE of assumed: kind-extends merged at registry-load time needs ZERO consumer
changes (every shipped reader sees merged fields free) — M-sized, pays immediately,
natural first machine, decided on the kinds/recipes track. Label-derivation is
L-sized, mostly speculative, gated behind the first class-keyed consumer, and its
biggest consumer migration (the three exact-text board pages) collides with gate 4.
Do not co-decide them.

EXTENSION DEMOTED: "narrow" breaks authoring (a narrowed evidence rejects base-valid
grounding links -> agents flee to free text); nothing can mechanically validate
additivity (behaviors live in imperative consumer code). Until a validator exists:
derived labels may add DESCRIPTION only. The may-supersede refusal stays as a
teaching example — it is human judgment, not machine enforcement, and should be
stated as such.

THE CHEAP-NOW LIST (buildable without any resolver, banks ~80% of the teaching value;
each S-sized): fix SKILL.md's link example to carry a labeled --text; annotate class
names onto new.ts's existing point-of-use link hints; a status VOCABULARY line (N
labels / M class-mapped / K free-text / id-default count); a relationship LEGEND panel
on a bundle page with per-class one-liners (devx drafted the exact strings, in their
report) + the unmapped-label drift list. Plus the comprehension flag: consider naming
grounding and SPECIFICATION as two class names (initially sharing one consumer) so
"implements" has an obvious home.

RESULTING DECISION SHAPE FOR THE SESSION (v3, pre-negotiated): (a) ratify 5-6 class
NAMES + per-class one-liner behavior strings + the four properties axes; (b) adopt
the cheap-now list as immediate tasks; (c) central shared-board label->class map as
the FIRST machine, whenever the first synonym must behave, resolver+guards in one
unit; (d) derivation-with-extension deferred under the lazy rule, label-doc fork
decided first if ever pursued, description-only extension until a validator; (e)
kind-extends severed to the kinds/recipes track as its own (cheaper, sooner) decision;
(f) depends-on inertness resolved standalone.

BRIAN'S UNIFIED FRAME v2 (2026-07-14, supersedes the candidate-6 framing below —
INHERITANCE IS THE META-MECHANISM, NOT A CATEGORY): the structure we want is —
(1) a small visible kernel of semantic classes, each stating the behaviors its
semantics entail, surfaced WHERE AGENTS AUTHOR (link-creation hints, kinds output —
per the panel: agents copy examples, not registries);
(2) two low-ceremony authoring paths — use the class name itself as the label
(zero declaration), or coin a clearer label and declare ONE derivation: e.g. a
convention stating "evidence" is-a "grounding", after which the system treats every
evidence edge exactly as grounding (same sweeps, lints, freshness logic).
Relationship labels derive from relationship classes; doc kinds derive from doc kinds
(Bug extends Task) — one derivation principle, two registries.

WHY THIS IS COHERENT WHERE DOC-LEVEL IS-A WASN'T: derivation edges live between
CONVENTION docs, the one corner of the bundle that is one-doc-one-concept by
construction (the "evidence" convention constitutes the definition of "evidence") —
Brian's own constitutive/aboutness principle makes the convention layer the legal home
for is-a.

THE GUARDRAIL (defuses the skeptic's misfire attack), refined per Brian: derivation
INHERITS base behavior wholesale and MAY EXTEND — the derived convention can indicate
how it extends the base: NARROW (evidence restricts legal target kinds), ADD behavior
(an extra evidence-staleness sweep the base doesn't run), and carry its own
description/display. It may NEVER subtract or alter base behavior: every "evidence"
edge must remain a fully valid "grounding" edge to every base consumer
(substitutability). Test case from the corpus: "may supersede" still CANNOT derive
from succession — suppressing head-collapse is subtraction, not extension — the rule
forces that honesty at declaration time instead of as a later view bug.

CONSEQUENCE FOR DECISION 4: classes live centrally (small ontology doc, few,
product-adjacent); derivations live per-convention (recipe-friendly). The derivation
edge ties the layers. The skeptic's lazy-machine rule still governs WHEN class-keyed
consumers get built; this frame governs the SHAPE they key on when they do.

CANDIDATE CATEGORY 6 — INHERITANCE ("X is a kind of Y"; Brian, 2026-07-14): distinct
from hierarchy (part-of vs is-a — the classic taxonomy/partonomy split; naming both
protects each from absorbing the other). Two flavors with different realizations:
(a) BETWEEN DOCS — REFINED BY BRIAN (2026-07-14): is-a holds between CONCEPTS, not
artifacts, and docs do not map 1:1 to the concepts they contain — so doc-level is-a is
only COHERENT under a one-doc-one-concept convention (a Concept kind, wiki/Zettelkasten
discipline), and is a category error on aboutness-style docs (research, notes). The
thin corpus evidence is STRUCTURAL, not lack of demand. This also names the general
principle: the existing categories work because they operate on kinds where the doc
CONSTITUTES the entity (a task doc IS the task; a claim doc IS the claim) — link
classes should declare which side of that line their endpoints live on. Verdict for
the session: no doc-level is-a on this board; legitimate only inside a future Concept
kind/vault recipe (connects to decision 5's territory).
(b) BETWEEN KINDS — schema subtyping ("Bug extends Task": inherits fields, terminal
set, link vocabulary, AND consumers — Bugs would appear on the Board page and in
--open automatically). NOT a link class: realized in the kinds registry (an extends:
declaration), a product feature with classic hazards (override rules, diamonds). Its
strongest demand signal is recipe-plugins (a shared recipe SPECIALIZING an existing
kind instead of shipping a parallel one). Route this flavor to the kinds/domain-model
design track rather than the link ontology; the session should decide only whether to
name it and where it lives, not design it.

### 2. Should the tool ever push back on a link label it doesn't recognize?

PLAIN: today, if an agent typos "depend on" instead of "depends on", the link is
accepted silently — and every query, page rollup, and progress bar that searches for
"depends on" will simply never see it. The data isn't lost, but it's invisible to
everything that matters. The question: keep total freedom (any label, anywhere,
forever), or have the tool react when a label isn't one the doc type declared?

WHY NOW: every dashboard we build (Board, Roadmap, Memory) queries by EXACT label, so
each silent mismatch is a quiet hole in a view someone trusts. The more views we build
on links, the more each typo costs.

TRADEOFFS: freedom means exploratory linking stays cheap and new relationship ideas
can emerge without ceremony — this is what makes the bundle feel like a knowledge
notebook. Checking means the graph the dashboards render is trustworthy — which is
what makes it feel like a reliable task system. A middle path exists: labels are
checked ONLY on doc types that declare a vocabulary; plain docs keep total freedom.

### 3. If the tool does push back — how hard? (or: retire "rung c")

PLAIN: "rung c" is our internal codename for write-time link checking; nothing more.
Three possible strengths — (a) REJECT: the mistyped link write fails with an error
naming the legal labels, fix it on the spot; (b) WARN: the write succeeds but prints a
notice; (c) STATUS-ONLY (today): writes are always silent, and mismatches appear only
in the `status` health report if someone runs it.

WHY NOW: agents do not habitually run `status` — for most writes, write-time feedback
is the ONLY feedback that will ever be seen. Mike's recorded lean is that the status
report plus the help text already carry the value (i.e. formally retire the idea of
rejecting/warning at write). The session confirms or overturns that lean — either
answer closes the last open piece of the typed-relationships roadmap item honestly.

TRADEOFFS: reject = clean data but real friction (bulk imports, older bundles, and
experiments all hit walls); warn = feedback without breakage, but warnings scroll past
agents unread; status-only = zero friction, but mismatch noise accumulates until a
human reads a health report.

### 4. Where should the relationship rules be written down?

PLAIN: today each doc type's convention file carries its own little rulebook (Task's
file says tasks depend on tasks; Roadmap Item's file says items contain tasks). The
alternative is one bundle-level "ontology" page listing every relationship with its
meaning, which the doc types reference.

WHY NOW: Mike's active self-describing-domain-models work is adding more machinery to
the per-kind files RIGHT NOW (#42/#51/#52 descriptions). If we ever want the central
page, every week of per-kind investment makes the move costlier. Deciding now is
cheap; deciding later means migrating.

TRADEOFFS: per-kind files are self-contained — a recipe installs its doc type WITH its
link rules, nothing central to edit, no merge conflicts between recipes; but the full
picture is scattered (you read six files or run `kinds` to see the whole graph), and
two kinds could define the same label inconsistently. One central page gives agents
and humans a single thing to read and keeps definitions consistent; but every recipe
install now has to merge into a shared page (a conflict surface that per-kind
declarations deliberately avoid), and the page can drift from what the kinds actually
declare.

### 5. The lite <-> Holaxis vocabulary alignment (DEFERRABLE — nothing in lite blocks on it)

PLAIN: Brian's wider ecosystem (holaxis vault, tsk, canonical AgentState) has its own
concept vocabulary. Should lite's doc types and relationship labels line up with it,
or stay independent?

WHY (and why it can wait): nothing in lite is blocked by this. It starts to matter
when things CROSS systems — agents that work in both worlds, and especially the
recipe-plugins direction (sharing installable domain models between founders/teams):
shared recipes are much more valuable if the vocabulary they carry means the same
thing everywhere. HONEST RECOMMENDATION: treat as an optional closing topic for this
session, or a separate founders' conversation — do not let it crowd out 1-4, which are
what actually unblock the roadmap item.

### 6. Which doc types must BELONG to something?

PLAIN: some docs are supposed to have a parent. A task floating outside any roadmap
item is probably a mistake — that rule already exists for Tasks, and it's what the
Memory page's "Wiring" panel renders (open tasks nobody contains). The question is
simply: which OTHER doc types get a belonging rule? Should a Decision have to be
linked from the thing it decided? Research from the question that prompted it? And
should violations show up only in the health report, or in the dashboards too?

WHY NOW: this is the board's self-audit mechanism — it's exactly how the "invisible
gate" problem Brian caught gets caught by the SYSTEM next time instead of by a founder
squinting at a page. Each belonging rule is one line in a convention file; the work is
deciding which kinds deserve one.

TRADEOFFS: more belonging rules = more dangling-doc problems surface themselves; too
many = noise, because some kinds are LEGITIMATELY free-floating (a context note needs
no parent), and a wrongly-ruled kind nags forever.

## DONE WHEN

Decisions 1-4 and 6 are each either decided (a decisions/ doc, linked from
roadmap-items/typed-relationships) or explicitly deferred with a wake condition;
decision 5 is scheduled, deferred, or folded in at the founders' discretion; and rung c
consequently becomes buildable tasks or is retired with the reasoning recorded on the
roadmap item.

[evidence](../docs/relationships.md)

[plan for](../plans/relationship-ontology.md)
