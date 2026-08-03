---
type: Context Note
title: 'Skeptic review (rev2 re-verified): multi-session pre-compaction design'
actor: claude-precompact-skeptic
timestamp: '2026-08-03T15:43:10.568Z'
---
# Summary

SKEPTIC review of `designs/pre-compact-multi-session`. **Rev 1 verdict: FAIL. Rev 2 (re-verified
this session): PASS-WITH-CAVEATS — ready to bring to Brian for sign-off with the caveats below.**
The Designer's rev-2 fixes are real: I re-ran every empirical claim I distrusted against the built
CLI and they hold. Two residual issues remain, both in the newly-added HOOK diff (the load-bearing
delivery rail), and both are bounded corrections Brian must apply to the proposed sketch before it
goes live — not a redesign. Labels: [E]=empirical (reproduced this session), [R]=reasoned.

## Revision 2 re-verification (2026-08-03)

Harness: `examples/sample-bundle` copy + `recipe add context-notes` (governed Context Note kind),
built CLI `packages/cli/dist/agentstate-lite.mjs`.

### Prior findings — each re-checked

- **H1 (write path) — FIXED [E].** Rev 2 drops the broken `doc write`/`doc update` recipe and moves
  to `promote` of a hand-authored .md. I ran the design's EXACT hook-injected block (mktemp heredoc
  with id8/expires/hostname + `promote --doc-key context-notes/pre-compact-<id8>.md`): wrote clean,
  and `doc read` showed ALL custom frontmatter (`session_id/role/machine/actor/expires`) preserved
  through the engine write. I also re-confirmed the failure it replaces: `doc update ... --role
  orchestrator --machine host1` -> exit 2 on the governed kind. RESOLVED.
- **H2 (concurrency mis-pick) — ADDRESSED, with a residual [R].** Rev 2 makes the exact-id read
  primary (no recency guess) and reframes the frontmatter query as explicitly BEST-EFFORT with a
  MANDATORY self-description guard ("does this `# Summary` describe MY work?") and a >1-candidate ->
  escalate-to-human rule (no auto-pick-newest). This genuinely converts the silent-wrong-restore
  hole into either a safe restore or a safe, detectable failure. It does NOT fully close concurrency
  when no session id is reachable — see NEW-2. Net: materially better, honestly framed.
- **H3 (consume) — FIXED [E].** Consume is now `doc delete <id>`. Verified idempotent:
  `deleted:true` then `deleted:false`, both exit 0. The broken `--consumed` step is gone. RESOLVED.
- **M1 (em-dash SEARCH bytes) — RESOLVED [E].** The live global CLAUDE.md sentence is
  "...(sub-agents) — if one exists..." with a real em-dash (U+2014); the rev-2 SEARCH string uses
  that em-dash and its leading context "Specifically, check for a note at `context-notes/
  pre-compact-main`" matches the live file (grep count 1). A literal find/replace will now hit.
- **M2 (collapse all old-id sources) — RESOLVED [E].** Independently grepped: the
  `holaxis-orchestrator` SKILL.md
  (`~/.claude/plugins/.../holaxis-orchestrator/skills/holaxis-orchestrator/SKILL.md`) has NO
  `pre-compact`/`agent_id` reference — the rev-1 suspicion was unfounded, now confirmed clean. The
  only LIVE sources naming the old ids are the global CLAUDE.md and the two `~/.claude/hooks/*.sh`
  files; rev 2 correctly targets all of them.
- **M3 (machine-scoped orchestrator query) — RESOLVED [E].** `list --field role=orchestrator
  --field machine=<host>` AND-filters correctly (count 1, correct row). Design now scopes the
  "THE orchestrator" query per-machine.
- **M4 (host-locality scoped to Claude Code) — RESOLVED [R].** Non-goals now scope host-locality to
  Claude Code and carry the Scout's [U] for Codex/OpenCode transcript locality rather than asserting
  it universally.
- **L1 (# Summary required) — RESOLVED [E].** A note without `# Summary` raises `status`
  `kind_warnings: 1` (`KIND_SECTION_MISSING`); a conforming note does not. Note: `status` also flags
  the note `stale: 1` after the kind's 24h horizon while `expires` is 7d — the design acknowledges
  this as accepted advisory noise. Correct.
- **L2 (expiry not load-bearing) — RESOLVED [R].** Design states expiry is GC-only and that the H2
  guard, not expiry, prevents a wrong restore. Consistent.
- **Mark-consumed-via-`promote --expected-version` (design's audit alternative) — [E] verified**
  works with CAS (write succeeded against the read's head_version). Design correctly prefers delete
  as simpler; the alternative is real.

### New / residual findings (all in the hook diff, the now-load-bearing mechanism)

- **NEW-1 [MEDIUM] The proposed pre-compact.sh jq reintroduces a fixed-id COLLISION in exactly the
  unverified case [E].** Proposed:
  `((.agent_id // .session_id // "") | .[0:8]) as $h | "pre-compact-\($h)"`. I ran it:
  - neither field present -> `pre-compact-` (EMPTY id8).
  - `agent_id: ""` (empty string) -> `pre-compact-` too, because jq `//` only substitutes on
    null/false/absent, NOT on an empty string; the CURRENT hook guards this with
    `if (.agent_id // "") != ""` and the rewrite DROPS that guard.

  So IF the main `PreCompact` payload lacks `session_id` (the design's own honest gap, point 6),
  the hook writes to the single shared id `pre-compact-` — the exact collision the task exists to
  kill, resurrected. The design PROSE says "falls back to a hostname/actor slug only if both are
  absent," but the CODE sketch does not implement it (produces an empty id), and the primary hook
  path is where the design says the guard is NOT applied ("exact read, H2 cannot arise here"). Fix
  before Brian applies: the jq must (a) keep the empty-string guard, and (b) emit the real
  degenerate slot `pre-compact-{actor}-{hostname-slug}` when no session id is present — never an
  empty id. Until then the "primary path is exact and collision-free" claim has a hole precisely in
  the case the design flags as unverifiable.

- **NEW-2 [LOW-MEDIUM] Even a correctly-implemented slug fallback is not session-granular [R].** Two
  concurrent main sessions, same actor+machine, no reachable session_id, both resolve to
  `pre-compact-{actor}-{hostname}` -> collision -> sync convergence keeps one, exports/loses the
  other. The H2 guard then prevents a WRONG restore, but cannot prevent handoff LOSS for the
  clobbered session (its note is gone; nothing to compare against). Honest degradation is therefore
  "no silent wrong-restore; handoff may still be LOST under concurrency-without-session_id" —
  strictly better than the status quo (silent loss) but not a full solve. The design should state
  this precisely rather than implying the guard fully closes concurrency.

- **NEW-3 [LOW] The hook cannot infer `role: orchestrator` [R].** A main session and THE
  orchestrator both have no `agent_id` and no role in the payload, so the hook can only default
  `role: main` (or `sub-agent` when agent_id is present). The orchestrator distinction — decision
  (d)'s whole motivation, the exact thing Brian hit — still needs a MANUAL role set by the
  agent/human. Not a regression; worth one line so the automation's reach is not overstated.

### Point 6 — the honest gap (session_id in PreCompact main payload; survival across --resume)

The design is genuinely honest that it cannot verify these from inside one session. Is the
degradation safe if the assumption fails? With the jq AS SKETCHED: NO — NEW-1 reintroduces a
fixed-id collision. With the jq CORRECTED (real slug fallback) and the guard applied: safe against
WRONG-restore, but handoff-loss under concurrency-without-session_id remains (NEW-2). Because the
guard converts the worst case from silent corruption to a detectable/safe failure, and the design
explicitly flags "verify on a live compaction," this gap is ACCEPTABLE to bring to Brian AS A
DESIGN — it is NOT a hard blocker requiring another full cycle. The only must-fix before the hook
goes live is NEW-1 (the collision-reintroducing jq), which Brian applies himself ("do NOT let an
agent edit these").

## Bottom line (rev 2)

PASS-WITH-CAVEATS. The core mechanism is verified working end to end (write via `promote` -> query
discovers -> `doc delete` consumes), the H2 overclaim is fixed with a real guard, and every M/L
finding is resolved (M1/M2/M3/L1 independently re-verified empirical). Bring it to Brian for
sign-off WITH these caveats attached:
1. (NEW-1, must-fix in the pre-compact.sh diff before applying) keep the empty-string guard and
   emit `pre-compact-{actor}-{hostname}` — never an empty `pre-compact-` id — when no session id is
   present; otherwise the hook re-creates the original collision in the unverified case.
2. (NEW-2) state honestly that the guard prevents wrong-restore, not handoff-loss, when session_id
   is unreachable under concurrency.
3. (NEW-3) note the hook cannot infer the orchestrator role; it stays a manual set.
4. Keep the "verify on a live compaction whether session_id rides the PreCompact main payload and
   survives --resume" step front-and-center — it gates reliance on the FAST path.

Confidence: HIGH on the empirical re-verification (reproduced against the built CLI); HIGH on the
NEW-1 jq defect (reproduced) and the NEW-2 reasoning.

---

## Appendix — Rev 1 review (FAIL), retained for provenance

Rev 1 shipped a write path (`doc write`/`doc update` of custom frontmatter) that HARD-ERRORS exit 2
(confirmed: ungoverned -> "no kind governs..."; governed built-in Context Note -> "unknown
field(s)... role"); `doc write` has no arbitrary-frontmatter flag. The documented write->read loop
therefore returned `count: 0`. Rev 1 also claimed the discovery fallback "does not bet on UUID
stability" when under concurrent same-(actor,machine,role) sessions with a lost UUID it silently
mis-picks by recency. Rev 1 further had a broken `--consumed` step (exit 2), an ASCII-hyphen SEARCH
target that would not match the live em-dash, an incomplete "collapse to one pattern" (other
instruction sources unchecked), a machine-unscoped orchestrator query, and an over-asserted
Codex/OpenCode host-locality. All of the above are addressed in rev 2 as re-verified above.

## Related
[design under review](../designs/pre-compact-multi-session.md)
[scout research](research-precompact-multisession.md)
[task](../tasks/pre-compact-multi-session.md)
