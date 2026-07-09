---
type: Research
title: 'sync verb v2 — DevX/UX design review: 7 essential proposals + the message pack'
timestamp: '2026-07-07T21:09:30.405Z'
---
# sync verb v2 — DevX/UX design review (proposals + message pack)

DevX designer pass over [plans/sync-verb](../plans/sync-verb.md) v2 (2026-07-07). Overall
read: architecture and verb surface right — a founder never needs "board branch" or
"worktree" to use it — but v2 was fully specified at the git layer and under-specified at
the two layers where trust forms: human legibility of what a sync did, and first-contact
(fresh clone / migration morning). Biggest gap (P1): on a fresh clone the first command is
usually offline `home`/`list`, which finds no bundle and says "run init" — creating a
divergent second bundle. Silent wrong-model creation.

## Proposals (E = essential, P = polish)

- **P1 (E) First-contact provisioning.** The SessionStart `sync --pull-only` step is the
  designated provisioner and runs BEFORE home renders; home's no-bundle fallback becomes
  board-aware ("board not yet provisioned — run `aslite sync`") — NEVER "run init" when a
  `board` branch exists on origin.
- **P2 (E) Conflict viewer.** "Resolve via doc update" dead-ends without a no-raw-git way
  to SEE the incoming version. Adopted: `sync --show-incoming <id>` prints the upstream
  version's canonical markdown (doc-read semantics: truncate + `--out` hatch). Conflict
  rows carry {id, kind, title, yours, theirs}.
- **P3 (E) Awareness render, two faces.** Agent face: envelope rows
  {verb, kind, id, title, actor}. Human face: `mike · updated Task "sync verb v2 — …"`.
- **P4 (E) Split the empty states.** No git repo → `sync: nothing to sync`; clean+current
  → `sync: already up to date`. The receipt is the cheapest antidote to
  "invisible when it works".
- **P5 (E) Migration comms.** After U5, founder B's `git pull` visibly DELETES
  `.agentstate-lite/` from main before the next aslite command re-provisions it — unwarned
  this reads as data loss. One-time heads-up ships in the rollout note and the first
  post-migration render.
- **P6 (E) Push-fail honesty, safety first.** `committed: N, pushed: 0` + warning that
  LEADS with "your work is saved", then the failure and the retry path. Exit 4/1 by class.
- **P11 (E) Skill teaching.** Typical flow ends with `sync` ("recording it isn't done
  until it's shared"); Workspaces says "shared with teammates via aslite sync", teaches NO
  branch/worktree mechanics; unit-close trigger added; `board` branch gets ONE
  "you may notice" aside at the end.
- **P7 (P) The one sentence:** "`aslite sync` shares your board — commits your changes,
  pulls your teammate's, pushes yours, touching nothing but the board." Plus the honest
  leak prepared: "you'll see a `board` branch in GitHub — that's the board; never merge it
  into main."
- **P8 (P) Commit grammar.** Keep the stable `board:` prefix; single-doc subject
  `board: mike — updated tasks/sync-verb`; multi `board: mike — 3 docs`; never "1 docs";
  full verb-kind-id list in the commit BODY so `git log board` carries the feed.
- **P9 (P, deferred) `sync --dry-run`** — named, not built; SessionStart already previews.
- **P10 (P-guard) `sync --migrate`** requires `--yes`, refuses to run twice
  ("already migrated"), never reachable from the everyday path.

## Message pack (the UX contract for implementation — exact strings)

(a) clean sync: `sync: {committed: 2, pushed: 2, pulled: 3, actor: brian, incoming: {shown, total, rows: [{verb, kind, id, title, actor}…]}}`
(b) empty states: `sync: nothing to sync` (no repo) vs `sync: already up to date` (current)
(c) conflict (exit 5) — AMENDED per Phase B vet (see plans/sync-verb-implementation A/D):
    U3a interim message "doc X changed on both sides — nothing was changed on either side;
    conflict resolution ships in the next update". U3b converge per-doc string "teammate's
    version kept; yours saved at <path> — reconcile with doc update" (the phrase "nothing
    was overwritten" is DROPPED). rows {id, kind, title, yours, theirs}; help chain:
    `sync --show-incoming <id>` → `doc update <id> --body-file <file>` → `sync`
(d) push failed after commit — AMENDED per Phase B vet (see plans/sync-verb-implementation
    D): warning "committed to the board locally — your work is saved. The push failed
    (offline or auth); re-run sync when you're back online or your access is restored."
    (exit 4 auth / 1 network, same message)
(e) SessionStart: `board: since_last_session: "3 board changes from mike"` + per-doc
    human lines + `unpushed: "2 local board commits not yet pushed — run sync when
    online"`; clean → `board: up to date`; offline → note "board sync offline — showing
    last known state"
(f) git missing → RUNTIME(1) "sync needs git, which isn't installed on this machine";
    no upstream → RUNTIME(1) "the board branch isn't linked to a remote yet — sync can't
    share it" + migrate/teammate help.

Settled constraints untouched: the architecture, the panel's five fixes, -M-off, the exit
taxonomy, no-raw-git-on-stdout, home's offline guarantee.
