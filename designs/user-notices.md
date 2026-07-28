---
type: Design
title: >-
  User notices: addressed, expiring, acknowledgeable messages surfaced on next
  interaction
actor: brian-claude
timestamp: '2026-07-28T22:35:46.261Z'
---
# User notices: addressed, expiring, acknowledgeable messages

**Status:** Design sketch, 2026-07-28 (founder thinking, Brian + fable). Not yet scoped to units.

## Need

Leave a message for a specific person (or for everyone) that reaches them the next time
they interact with the bundle — without knowing which surface they will use (Codex CLI,
possibly several sessions at once; Claude Desktop; Claude CLI; an HTML View).

## Reframe: address the person, not the surface

Local-first means there is no push channel — no server to ping a client. But every surface
already READS the bundle on interaction. So do not route to a client; leave a note keyed to
a recipient, and each surface independently filters "notices for me, still live" when it
reads. The shared bundle does the fan-out. This matches the driving phrase exactly: "next
time he interacts."

The delivery rail already exists: the session-start awareness block ("N changes from X since
this machine last synced"). A notice is that same feed row, but ADDRESSED and DISMISSABLE.

## The model

A notice is an ordinary typed doc (`type: Notice`) in the bundle, riding sync like everything
else (one system, no second store):

- `to`: a person, or everyone (broadcast)
- `from`: author
- body: the message
- `expires`: a required date
- optional severity; optional `about` link to the thing it concerns

Stop rule (whichever comes first):

- EXPIRY (mandatory) — the note ages out for everyone on its date.
- ACK (optional early-out) — a recipient can acknowledge to make it stop for THEM only.

A third option, passive "seen on render," was considered and REJECTED as too mushy: it marks
unread things read (a note that flashes past in a greeting), and it turns a cheap read into a
synced write.

## Why this combination is cheap

- Per-person state is SPARSE and OPT-IN: the only per-person "done" marks stored are actual
  early acknowledgements. Most notices, for most people, are never acked — they just expire.
  There is no mark-per-person-per-notice.
- Expiry does double duty: stop-condition AND garbage collection. Everything ages out, so the
  board never silts up. Therefore make expiry MANDATORY — a never-expiring notice is just a
  durable Document, which already exists.

## Broadcast (to everyone)

- Delivery needs no roster: "to everyone" simply does not filter; every human who reads sees it.
- Per-person ack is a list that GROWS on the notice as people check in; each reader asks "am I
  on it?" Still no pre-built roster.
- A roster is needed ONLY to answer "has everyone seen it?" (you need the denominator). Defer
  until a notice actually demands that view.
- Human vs agent: a broadcast "to humans" must distinguish people from tool-actors — an
  extension of the identity step below.

## Identity is the real prerequisite

Everything rests on recognizing a recipient as the SAME PERSON across all their devices —
otherwise a dismissal on one machine re-nags on the next.

How attribution works today (verified in code, 2026-07-28):

- The `actor` string, resolved once at the CLI boundary (`packages/cli/src/actor.ts`):
  `--actor` > `AGENTSTATE_LITE_ACTOR` env > absent (renders `unknown`). Stored per-doc in
  frontmatter. Advisory, unverified.
- The awareness block reads `actor` PER-DOC FROM FRONTMATTER, deliberately never from the git
  author or commit subject (`porcelain.ts`: "commit metadata is a human mirror rather than the
  attribution source").
- Git identity is used only in REVERSE: when the environment has no git user, board-git
  synthesizes `user.name = actor`, `user.email = <slug>@agentstate-lite.invalid` so a commit
  can be created. So the actor DONATES to git, not the other way round.

Git config as the default-actor seed (the answer to "can't we use git credentials?"):

- Reading `git config user.email` (stable, globally unique per person) as the key and
  `user.name` as the display label is a good way to establish a default identity with ZERO new
  setup — reuse config the user already has, instead of asking them to set
  `AGENTSTATE_LITE_ACTOR`.
- Caveats: it only unifies a person across devices if they use the SAME email everywhere
  (usual for developers, not guaranteed); it does not by itself separate a human from that
  human's agent (board actors like `mike/codex` are compound person/tool labels); and it is
  self-asserted, so this is identity-as-convenience, not identity-as-security — which is fine,
  because attribution here is advisory, not a security boundary.

## Delivery per surface

- Hooked CLIs (Claude Code / Codex / OpenCode): extend session-start / home to render "notices
  for you" — the same "for me, still-live" query. Surface-independent by construction.
- HTML View: a small notifications View queries live notices for the current actor; ack fits
  the existing `bundle-propose` path (one governed scalar change with human confirmation).
- MCP / Desktop: the same query at its own orientation entry point.

Graceful degradation: expiry works with zero per-person machinery, so ship expiry-only first,
then add the ack button surface-by-surface as progressive enhancement. Nothing is half-broken
in between; a surface without the button just lets notices expire.

## Non-goals

- No push channel (local-first: pull on interaction).
- No passive seen-tracking.
- No immortal notices (a permanent notice is a Document).
- No roster in v1 (only when a "who has not seen it" view is actually needed).
- No security identity — attribution stays advisory.

## Likely build order

1. Default actor from git config — the identity groundwork; independently useful (de-noises
   attribution, fixes `unknown` writes, and is the prerequisite for addressing anyone).
2. Notice kind + author command + expiry-only delivery in session-start / home.
3. Per-person ack (early-out) across the CLIs; notifications View with propose-based ack.
4. (Only if needed) roster + "who has not acknowledged" for must-ack notices; human/agent
   tagging.

## Related

- [home surface](home-surface.md) — the awareness block / launcher this rides
- [document discovery](document-discovery.md) — Browse, where notices are queryable

[informs](../roadmap-items/local-first-loop.md)
