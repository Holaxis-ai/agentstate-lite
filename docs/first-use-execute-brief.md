---
type: Doc
title: 'Execute brief: the five first-use friction themes (plain language)'
actor: brian-claude
timestamp: '2026-08-06T16:49:43.337Z'
---
# Execute brief: the five things a first-time user tripped over

**Source:** one anonymized first-use session on 2026-08-06, recorded as
[the first-use feedback note](../context-notes/first-use-feedback-2026-08-06.md). Someone installed
the tool for the first time and we watched where they got stuck. Five distinct problems came out of
it. Three now have their own work item, one got folded into work we already had, and one is still a
question rather than a job.

**Framing:** these are descriptions of what went wrong for a real person. They are not a promise to
build the fix that person suggested. Two of them are still open on *how*, not just *when*.

This brief is a plain-language restatement of existing records for people who have not been living
in the board. Where it and the linked task docs disagree, the task docs win.

## Before anything else: one piece of work gates two of the five

There is a safety guard called "create-only init" — the rule that when the tool creates a new
workspace for someone, it refuses to touch a folder that already has something in it, rather than
writing over it. Both onboarding items below need it, because both involve the tool creating a
workspace on a stranger's machine on their first command.

That guard is finished and sitting on a pushed branch (`feat/init-create-only`, SHA `81b3c39`). It
passed five rounds of independent review — every round through round four found a genuine defect —
plus adversarial QA that beat on interruptions, races, and hostile filesystems, plus the full repo
gate clean. Three unrelated pre-existing bugs it uncovered were filed separately. Details on
[the guard task](../tasks/init-target-safety-guard.md).

It is waiting on Brian to open the PR and merge it. Nothing else here should start pretending it can
materialize a workspace until that lands. That is the single highest-leverage action in this
document, and it costs a few minutes.

## 1. The install command rejected a word that meant exactly what the user thought it meant

Tracked by [the user-scope install task](../tasks/user-scope-install-vocabulary.md).

**What happened.** A newcomer typed `--scope user` when installing the agent skill. The tool only
accepted `project` or `global`, so it errored. But "global" here never meant machine-wide — it only
ever wrote into that one user's own config directories. The word was lying about the blast radius,
and the honest word was the one we rejected.

**What to do.** Make `user` the real, documented spelling everywhere: install, status, uninstall, for
both the skill and the session hook. Keep `global` working forever as a quiet synonym pointing at the
identical locations — nobody's existing script breaks. Update the help text, the generated skill
docs, and the README so they teach only `project | user`, with one short note that `global` still
works. The receipts the command prints should say "user."

**Critical constraint.** This is a rename, not a new mode. There must be exactly one behavior with
two spellings. If someone later reads the code and finds two code paths, we did it wrong.

**Done means.** Both words resolve to identical targets, all the docs teach the new one, and the
installed-package tests pass.

**Where it stands.** Already built. PR #211, SHA `742af48`, 132 focused tests green and the full repo
check green. Waiting on independent review at that exact SHA plus CI. Highest priority of the three,
and it is nearly out the door.

## 2. Web addresses in the reader were unreadable and un-shareable

Tracked by [the stable document routes task](../tasks/document-route-breadcrumb-navigation.md).

**What happened.** When you open a document in the local web UI, which document you are looking at is
carried in the query string — the `?...=` junk after the address. Two consequences: the URL is hard
to read and awkward to paste to someone else, and the breadcrumb trail at the top of the page is
decorative. You can see the parent folder in the trail, but clicking it does nothing.

**What to do.** Give each document a URL whose *path* tells you what it is, while keeping the
document's true internal identity exactly as it is — the identity model does not change, only how it
is expressed in the address bar. Then make the parent segments of the breadcrumb actually clickable,
landing on a sensible listing of everything under that namespace.

**The hard parts, and they are the reason this is scoped as "evaluate" rather than "implement".**

- Document IDs can contain slashes, punctuation, and non-English characters. Every one of those has
  to survive the round trip into a URL and back with no ambiguity, and with no way to craft an ID
  that escapes its own namespace and reaches somewhere it should not.
- A clickable breadcrumb must never become an oracle. If someone clicks a parent path for something
  that does not exist, or that they are not allowed to see, the response must not quietly confirm
  that it exists.
- Back and forward buttons, deep links, session authorization, and the existing routing for Views all
  have to keep working.
- Every link anyone has already saved uses the old query-string form. Those either keep working or we
  make a deliberate, written decision to break them. Not an accident either way.

**Done means.** A document opens from a clean stable URL, exotic IDs round-trip safely, breadcrumbs
leak nothing, old links have a decided fate, and the routing is tested through the actual built UI
and the actually-installed CLI rather than in a unit-test approximation.

**Status.** Not started. Second-tier priority. Unassigned.

## 3. Users have to re-announce who they are in every new terminal

Tracked by [the persistent local actor task](../tasks/persistent-local-actor-identity.md).

**What happened.** The tool can stamp your name on the things you write, so a teammate reading the
board later knows who did what. You set it with an environment variable. Environment variables
evaporate when you close the terminal, so a person has to set it again in every new shell, forever.
An earlier piece of work deliberately stopped short of picking a permanent home for that setting, and
left it here.

**What to do.** Pick exactly one explicit, local, git-ignored place a person can write their name once
per machine and have it stick.

**The constraints matter more than the mechanism here.**

- Whatever you pass on the command line still wins. Setting nothing is still perfectly valid —
  anonymous is a supported state, not a broken one.
- This name is a courtesy label, not a login. It proves nothing and authorizes nothing, and the docs
  must not let anyone believe otherwise. The underlying storage still records its own real principal
  separately.
- Do not start silently reading arbitrary `.env` files sitting in people's projects, and do not
  accidentally birth a second general-purpose configuration system. If we are going to have one of
  those, that is a decision made on purpose, not a side effect of this task.
- The name must never end up written into the shared board or committed to the code branch by
  default. It is personal, it stays local.

**Done means.** Configure once, get consistent attribution in later shells. File permissions, where
the tool looks and in what order, what a blank value does, and what the command prints back are all
documented and tested. Existing usage of the flag and the environment variable is untouched.

**Status.** Not started. Second-tier priority. Unassigned. Builds directly on the already-shipped
environment-variable default.

## 4. Install worked, the UI worked, and the user still did not know how to put anything in

**What happened.** This is the most interesting finding and the least concrete. The person got
everything running. They saw a working interface with live data. And they still had no reliable idea
how new content was supposed to get in there. Nothing failed. The mental model just never arrived.

**Why it is shaped differently.** We did not open a new task for it. We took the two onboarding tasks
that already existed and gave each of them an explicit obligation to prove this handoff. It is an
acceptance criterion added to existing work rather than a fresh work item.

The core idea both must convey: you do not hand-author this stuff. You bring your material or your
intent to your agent in whatever tool you already use, and the agent does the organizing, typing,
linking, and updating through the CLI. The individual commands are the plumbing underneath, not a
manual data-entry workflow the user is expected to perform.

### 4a. The quickstart — the fast path

Tracked by [the npm quickstart task](../tasks/npm-quickstart-onboarding.md). Top priority,
unassigned.

Proves one continuous journey with no teaching detour: install the real published package → get
oriented with no workspace yet and see what starting shapes are available → create a genuinely fresh
task-tracking workspace → create one properly attributed task → see live state that is actually
useful → and understand that from here on, the agent does the writing.

Explicitly not its job: release staging, upgrading from old versions, version identity, update
selection, retiring the old distribution channel, or any tutorial curriculum. It needs the
create-only guard from the top of this document before it can adopt that flag.

### 4b. The guide — the teaching path

Tracked by [the guidance bundle task](../tasks/guidance-bundle-onboarding.md). Second priority,
assigned to `brian-claude`.

A small, ordered, permanently reopenable learning workspace, reached by one offline command with zero
choices to make: `aslite guide`. First run quietly creates it in a per-user location; later runs just
reopen the same one. There is an advanced override for where it lives, but the normal path asks you
nothing.

Design decisions already locked in that are worth understanding:

- **Ordered but stateless.** Numbered lessons with previous/next/graduation links give you sequence.
  The tool remembers nothing about your progress — no completion tracking, no "seen" flags, no
  acknowledgements. It is recommended only when someone says they are new or asks how to start.
  Because it never nags, there is nothing to suppress, which is why no per-person marker is needed.
  That is what keeps this from dragging in the whole "who is this person, durably" problem.
- **The first lesson uses the real mechanics.** The learner types an actual attributed command. The
  read-only live view visibly updates when their document lands — and crucially, they should come
  away understanding that the view watched the write happen, it did not perform it. That distinction
  is the whole point of the exercise.
- **Packaging.** The lessons are authored as ordinary files and compiled into the shipped package at
  build time. No reading files off disk at runtime, no giant hand-maintained strings in the source,
  no dependency on having the repo checked out or a plugin installed.
- **It never touches your real work.** The guide will not inject itself into an existing project, and
  an occupied or ambiguous destination fails safely rather than being overwritten. The learning
  workspace is explicitly not meant to become anyone's actual project.

Twelve acceptance criteria, all proven from a genuinely isolated environment against the real
installed artifact. The two that carry the most weight: a fresh person completes the curriculum with
no source-code reading and no founder explaining anything over their shoulder, and at least one fresh
walkthrough treats the lesson order as a hypothesis to be tested, with observed friction written down
before anyone calls it done.

## 5. Sharing plans with people who do not use the tool — a real need, not yet a job

Tracked by [the external-sharing research](../research/external-plan-sharing.md).

**What happened.** The user wanted to point occasional collaborators at a project plan and let them
ask questions about it. They suggested syncing selected content into a collaboration tool they
already use. We recorded the need. We did not commit to that shape or that tool.

**Why it is research and not a task.** Four genuinely different problems are hiding in this one
sentence, each with its own trust and architecture consequences: publishing something read-only,
selectively exporting or syncing, letting bundles refer to each other, and letting multiple humans
comment. Treating them as one feature is how you build the wrong thing.

**Rules for whoever picks this up.**

- Define what "selected" means, and how someone is prevented from accidentally publishing more than
  they meant to, before evaluating any transport mechanism. Get the disclosure boundary right first;
  the pipe is the easy part.
- Exhaust what we already have — artifacts, views, the workspace catalog, bundle relationships —
  before proposing a hosted service or a third-party integration.
- The frozen hosted/auth/admin scope stays frozen unless someone explicitly decides to reopen it.

**Deliverable.** A short decision record naming the actual user journey, the information boundary,
the local-first options that work, the options we rejected and why, and a verdict on whether any
buildable task should follow. The output might legitimately be "no task yet."

## Suggested order

1. Open and merge the create-only guard PR (`feat/init-create-only`, `81b3c39`). Everything
   onboarding-related is queued behind it, and it is done.
2. Land the `--scope user` rename (PR #211). Needs a review at the exact SHA and CI. Small, done,
   removes a first-thirty-seconds papercut.
3. The quickstart journey. Top priority, unassigned, unblocked the moment step 1 merges. This is the
   one that proves a stranger can get to useful in one sitting.
4. The guide, in parallel if there is capacity — prototyping is already authorized, publishing waits
   on step 1.
5. The URL/breadcrumb work and the persistent name, both second-tier, both needing a design decision
   before code. The name one is the smaller of the two and has the sharper constraints; it is a good
   candidate for a focused unit.
6. The external-sharing research, whenever an answer is wanted. It is a thinking job, not a building
   job.

## What needs a human decision

- **The PR merge** in step 1. Two priority items are parked behind a branch that already passed every
  gate.
- **The compatibility call on old document URLs** in item 2 — keep them working forever, or break
  them on a stated date. The task explicitly requires this be a decision rather than a default.
- **Whether a durable local config file is a thing this product has.** Item 3 needs one, and the task
  deliberately refuses to introduce a general configuration system as a side effect. That is a
  product-shape call, not an implementation detail.
