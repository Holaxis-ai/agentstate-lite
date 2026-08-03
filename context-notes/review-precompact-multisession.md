---
type: Context Note
title: 'Skeptic review: multi-session pre-compaction design'
actor: claude-precompact-skeptic
timestamp: '2026-08-03T15:27:05.843Z'
---
# Summary

SKEPTIC review of `designs/pre-compact-multi-session` (task `tasks/pre-compact-multi-session`).
Verdict: **FAIL — needs a revision pass before Brian's sign-off.** The narrative is careful and
the discovery-QUERY design (read side) is sound and empirically verified, but the design ships on
a WRITE mechanism that does not exist in today's CLI, and its headline "does not bet on UUID
stability" claim breaks in the exact concurrency case the task targets. These are correctness
defects, not polish. All findings below labeled [E]=empirical (reproduced against the built CLI
this session) or [R]=reasoned.

Empirical harness: `examples/sample-bundle` copy + a fresh `init` bundle, built CLI at
`packages/cli/dist/agentstate-lite.mjs`.

## HIGH

### H1 [E] The documented write path does not work — the whole convention is inoperable as written
The design (decision e + the CLAUDE.md diff) tells agents to stamp custom frontmatter fields
(`session_id`, `role`, `machine`, `expires`, `consumed`) via "a plain type: Context Note written
through the generic path - NO special command." That path CANNOT set those fields:

- Ungoverned Context Note (any conventions-free bundle): `doc update <id> --role orchestrator
  --machine host1` -> exit 2: "no kind governs type 'Context Note', so kind field(s) --role,
  --machine cannot be patched here — only the standard fields (--title/--description/--tag/--type/
  --body/--body-file) are patchable on an ungoverned doc."
- Governed Context Note (the built-in `context-notes` recipe): `doc update context-notes/x --role
  orchestrator` -> exit 2: "unknown field(s) for kind 'Context Note': role (declared: title,
  timestamp, description, tags ...)". The built-in kind declares only title/timestamp/description/
  tags.
- `doc write` has no arbitrary-frontmatter flag at all (only --type/--title/--body/--body-file/
  --actor).

Consequence, reproduced: notes written through the documented path carry NONE of the discovery
fields, so the design's own read query returns `count: 0`:
`list --type "Context Note" --prefix context-notes/pre-compact- --field actor=me --field
machine=host1 ...` -> `count: 0` against CLI-written notes. The documented write->read loop yields
zero results.

The design says the discovery was "verified against the built CLI this session." That verification
covered only the READ side (`--field` AND-filtering + `--fields` projection), which DOES work — I
reproduced it against HAND-AUTHORED frontmatter (`count: 2`, then `count: 1` with an added
role filter). The NOVEL requirement — writing those fields through the generic path — was never
verified and does not work. The designer verified the half that works and asserted the whole.

The ONLY convention-only write path that actually works is `promote` of a hand-authored full .md
file: I wrote a file with the custom frontmatter, `promote --doc-key context-notes/pre-compact-
ffff6666.md`, and the engine PRESERVED every custom field; the query then found it. But that is a
multi-step ritual (hand-write correct YAML + correct id8 + compute the expires date + promote with
the exact --doc-key) — precisely the "rely on instinct" failure mode Brian's working style (which
the design itself invokes) is meant to eliminate. The other option, `kind field "Context Note" add
role --values ... ` etc., is a per-bundle kind-schema change the design never mentions and which
FAILS in conventions-free bundles that have no Context Note kind at all — yet this convention is
GLOBAL and must run in any project.

Fix: pick and TEST an actual write mechanism end to end (write -> read -> consume). This flips
decision (e): "convention-only, tool deferred" is untenable as written. Either build the thin
`aslite handoff` tool now (it can write the frontmatter directly and compute id8/expires), or
rewrite the convention around the verified `promote` path with exact copy-paste commands and prove
the full loop. Do not ship the current `doc write`/`doc update` recipe — it hard-errors exit 2.

### H2 [R] "The design does not bet on UUID stability" is false under concurrency — the task's whole reason
The design's central pivot (its own words: attack this hardest) is that the fallback query is "the
correctness guarantee ... Either way the handoff is found." It is not, in the concurrent
same-machine same-actor case the task exists for.

When the UUID is NOT stable across resume — the ONLY case the fallback exists to cover — two
concurrent sessions with the same `(actor, machine, role)` are indistinguishable to the fallback.
It filters actor+machine (+role) and picks the NEWEST `timestamp`. Recency identifies who WROTE
last, not who is RESUMING. Concrete break: Session A (orchestrator) writes its handoff at T1;
concurrent Session B (also orchestrator, same actor+machine) writes at T2>T1; A resumes with a
changed/lost UUID; the fallback returns B's note (newest, unconsumed) and A silently restores the
WRONG session's context. The resuming session cannot match on `session_id` because, having lost its
UUID, it does not know its own OLD session_id. So `(actor, machine, role, recency)` genuinely
cannot disambiguate. This is the SAME collision the task set out to kill, reappearing at the
discovery layer exactly when the fast path (stable UUID) is unavailable. Plain `role: main`
sessions (multiple concurrent interactive sessions — very common) are even worse: the diff's
main-session query has no role discriminator, so newest-wins across all the person's concurrent
mains.

So correctness under concurrency DEPENDS on UUID stability (only the fast path's direct id read
disambiguates). The design bets on the assumption for the concurrent case while claiming it does
not. Fixes: (i) actually VERIFY scratchpad-UUID stability across compaction AND across
`--resume`/`--continue` in a fresh process — the Scout left this [U] and the designer skipped it on
the strength of a fallback that does not cover the case; (ii) re-frame the fallback honestly as
best-effort recovery of the single-session-per-(actor,machine,role) case, not a guarantee; (iii)
add a mandatory guard: the resuming agent must confirm the restored note describes ITS OWN work
before trusting it, since the fallback can mis-pick. A cheap human/agent-in-the-loop check closes
the silent-wrong-restore hole.

### H3 [E] The `consumed` self-cleaning mechanism is inoperable as documented
Decision (c) and the diff say the resumed session marks its note `doc update <id> --consumed
<ISO>`. Same root cause as H1: `--consumed` is an unknown field -> exit 2. Notes can never be
marked consumed via the documented command, so consumed-filtering and "never re-nag / never win
the pick again" never engage. Fix together with H1's write mechanism.

## MEDIUM

### M1 [E] CLAUDE.md diff REPLACE target will not match the live file
The diff quotes the sentence to replace with an ASCII hyphen ("(sub-agents) - if one exists"), but
the live global CLAUDE.md uses an em-dash ("(sub-agents) — if one exists ..."). A literal
find-replace fails to locate the target. For a deliverable the design itself insists is
copy-paste-exact, quote the exact bytes (em-dash) as the SEARCH string (the ASCII replacement body
is fine and matches Brian's plain-ASCII convention).

### M2 [R] "Collapse three patterns into one" (decision f) is incomplete — other instruction sources keep the old scheme alive
The design updates only the global CLAUDE.md memory instruction. The retired `pre-compact-{agent_id}`
/ `pre-compact-main` scheme is also plausibly referenced by the `holaxis-orchestrator` skill (which
global CLAUDE.md points at for sub-agent dispatch and phase-boundary context notes) and possibly
other dispatch instructions. If those are not updated in lockstep, a fourth/fifth source keeps the
old pattern live and the "one shape" claim is false. Fix: enumerate every instruction source that
names the old ids (at minimum holaxis-orchestrator) and either update them in the same change or
explicitly scope-flag them for Brian.

### M3 [R] Cross-machine "THE orchestrator" query is ambiguous
The decision-(d) query `--field role=orchestrator` (no machine filter) runs over the SHARED board,
so it returns orchestrator notes from ALL hosts. Brian running sessions on a laptop and a desktop
gets two "orchestrators." The "which is THE orchestrator" answer is per-machine, not global. Add
machine scoping to the query or state the answer is host-scoped.

### M4 [R/E] Codex/OpenCode host-locality is asserted as fact but is unverified
Non-goals state "a handoff is host-local (the transcript resumes on the machine that wrote it)" as
settled and use it to justify machine-scoping. For Claude Code this is reasonable (resume reads
local transcript files). But the Scout left BOTH "stable per-session id" and resume-locality [U]
for Codex/OpenCode. If any runtime syncs transcripts across machines, machine-scoping would HIDE
the legitimately-needed note. Carry the Scout's [U] caveat into the non-goals; scope the
host-local guarantee to Claude Code rather than asserting it universally.

## LOW

### L1 [E] The design ignores the governed Context Note kind's real shape
The built-in Context Note kind REQUIRES a `# Summary` heading and has a 24h freshness horizon.
Handoff notes that omit `# Summary` trip the kind's section lint; a 7d-`expires` handoff is flagged
stale by `status` after 24h (freshness noise). Minor, but the design treats "reuse the existing
kind" without reconciling the kind's actual required_headings/horizon.

### L2 [R] Expiry horizon (7d vs 48h) is orthogonal to the real risk — do not lean on it for safety
Attack 2 result: expiry is GC only (the design says so) and does NOT mitigate the concurrency
mis-pick — an abandoned-but-NEWER note still within its horizon can win the newest-pick over a live
note (this is just H2 again). 48h is not materially safer for the failure that matters; it only
trades away the weekend/PTO survival the design correctly wants. Keep 7d; just stop implying expiry
adds safety against mis-selection.

## Decision-point coverage (all 6 addressed; several share one root defect)
(a) identity id8 — OK, math checks (~1e-6 at 100 concurrent). (b) discovery — read side verified;
correctness overclaimed (H2). (c) cleanup — consumed mechanism broken (H3). (d) orchestrator query
— depends on writable fields (H1) + cross-machine ambiguity (M3). (e) convention-only — untenable
as written (H1). (f) reconcile sub-agent scheme — narratively OK, completeness gap (M2). The design
is internally CONSISTENT in narrative, but H1's single defect (custom frontmatter is not writable
through the generic path) cascades through (c), (d), and (e).

## Bottom line
NOT ready for Brian's sign-off. Needs a revision pass that: (1) specifies and TESTS a real write
mechanism end to end (promote-a-file recipe, kind-field declaration, or build the `handoff` tool
now — decision e must be reopened); (2) verifies scratchpad-UUID stability and re-frames the
fallback as best-effort + adds a mis-pick guard (H2); (3) fixes the consumed command (H3), the diff
em-dash match target (M1), and the cross-source (M2) / cross-machine (M3) / cross-runtime (M4)
completeness gaps. The good news: the read-side discovery design is verified working, and a verified
convention-only write path exists (hand-author + `promote`), so the revision is bounded, not a
redesign.

Confidence: HIGH on the empirical items (reproduced against the built CLI); HIGH on the H2
concurrency reasoning.

## Related
[design under review](../designs/pre-compact-multi-session.md)
[scout research](research-precompact-multisession.md)
[task](../tasks/pre-compact-multi-session.md)

[designs/pre-compact-multi-session](../designs/pre-compact-multi-session.md)

[tasks/pre-compact-multi-session](../tasks/pre-compact-multi-session.md)
