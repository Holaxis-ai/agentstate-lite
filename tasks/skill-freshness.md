---
type: Task
title: >-
  Eliminate skill staleness friction: detect when the installed Agent Skill is
  behind the CLI, recommend + offer a refresh
status: todo
priority: '2'
actor: anthropic/claude
timestamp: '2026-08-02T16:14:42.515Z'
---
# Problem

After an npm update of `@holaxis/aslite`, the installed Agent Skill goes stale silently. The npm
package SHIPS the current skill (`files: ["dist", "SKILL.md", "references"]`), so the updated skill
is on disk at the package location — but the package has NO postinstall/prepare hook (verified), by
design ("no silent postinstall mutation of host config"), so nothing copies it into the host skill
folders (`~/.claude/skills/aslite`, `~/.codex/skills/aslite`). Refreshing them requires an explicit
`aslite skill install`. Result: the binary advances while the installed skill an agent READS can
lag behind, with no proactive signal. This is real, recurring friction (it caused live confusion on
2026-08-01; the same stale-copy class is noted in `tasks/version-string-channel-identity`).

# What already exists (build on, don't rebuild)

- `aslite skill status` already BYTE-COMPARES the installed folder against the running binary's
  assets and reports `installed` / `stale` / `absent` — truthful, not version-string-based
  (two vintages both report `0.1.0-pre.2`, so byte comparison is the only honest check).
- `aslite skill install` is idempotent/convergent (`changed:false` when already matching) and
  manifest-tracked — the safe refresh primitive.
- `aslite version` reports `compatibility_contracts` (skill/hook/mcp) and a `drift` block.

# Desired outcome

After an npm update, the user is PROACTIVELY told, without having to ask, when the installed
skill (and hook) is behind the CLI, given one exact command to fix it — and the agent can OFFER to
run that refresh on the user's confirmation. The manual "remember to re-run skill install" step is
eliminated for the common path.

# Solution shape (options to decide, not prescribe)

1. **Proactive surfacing (the core gap).** Emit a stale-skill hint from the CLI's own output so an
   agent sees it automatically: at session-start/home and in `status`, when
   `skill status == stale`, one line -> `aslite skill install --scope global`. (Reuses the
   capability-awareness-hints runtime-hint mechanism; extends it from "absent capability" to
   "stale installed skill". NO_HINTS-silenceable.)
2. **Skill self-check instruction.** The generated SKILL.md instructs the agent, during orient, to
   run `aslite skill status` and — if stale — tell the user and OFFER `aslite skill install`. Makes
   the skill "self-aware" of its own staleness via the agent as actor.
3. **Offered, human-confirmed refresh — never silent.** "Update itself" = the agent runs
   `aslite skill install` after the user confirms. No silent overwrite of host config; no npm
   lifecycle script. (Hard design constraint.)
4. **Reduce the fix to one action.** Consider whether `aslite skill install --scope global` should
   be folded into a single upgrade path — e.g. an `aslite update` verb (decision #5 of
   `version-string-channel-identity`) that refreshes binary + skill + hook together, or a
   `skill install --if-stale` convenience. The dev-side analog: add `aslite skill install` to the
   local `aslite-reinstall` dogfooding script so a rebuild never leaves the skill behind.
5. **Hook rides along.** The hook has the same staleness class (`hook status` /
   `tasks/hook-compatibility-ownership`); the surfacing + offer mechanism should be shared, not
   forked, so skill and hook freshness are one UX.

# Design constraints / non-goals

- NO silent host-config mutation and NO npm lifecycle scripts (both standing principles).
- NOT a background auto-updater; detection + offer + human-confirm only.
- Does not redefine the version/identity or compatibility CONTRACT — that is owned by
  `version-string-channel-identity` #6; this task is the freshness-UX slice that CONSUMES it.

# Relationship to existing work (bounded to avoid duplication)

- `version-string-channel-identity` #6 owns the identity + skill/hook compatibility contract and
  the upgrade-verb decision; this task consumes that contract to eliminate the friction.
- `hook-compatibility-ownership` is the hook-mechanics sibling; share the surfacing/offer path.
- `capability-awareness-hints` owns the proactive runtime-hint + skill-guidance mechanism this
  extends (from absent-capability to stale-installed-skill).

[depends on](version-string-channel-identity.md)

[relates to](hook-compatibility-ownership.md)

[extends](capability-awareness-hints.md)
