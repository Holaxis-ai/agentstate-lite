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
timestamp: '2026-07-14T19:08:53.072Z'
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

CANDIDATE CATEGORY 6 — INHERITANCE ("X is a kind of Y"; Brian, 2026-07-14): distinct
from hierarchy (part-of vs is-a — the classic taxonomy/partonomy split; naming both
protects each from absorbing the other). Two flavors with different realizations:
(a) BETWEEN DOCS — a taxonomy edge in the knowledge graph. Transitive, acyclic,
directional; corpus evidence today is thin (the coined "extends"/"realizes" labels are
spec-family, not is-a) — so per the lazy rule: ratify the category name, build no
consumer until real edges demand one.
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
