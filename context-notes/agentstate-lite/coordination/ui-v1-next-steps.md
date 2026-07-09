---
type: Context Note
title: ui-v1-next-steps
description: >-
  PIVOT RECORD (2026-07-06): Access RETIRED (item 44); the old 'mint a CF API
  token' step is DEAD. Two-tier direction (OSS local+git / hosted live); next
  builds: local ui command, git-sharing, positioning doc, skill-distribution —
  all on the board as tasks.
tags:
  - coordination
  - agentstate-lite
  - ui-v1
timestamp: '2026-07-06T13:59:09.596Z'
---
# Summary

DIRECTION PIVOT (2026-07-06, STATUS item 44, commit `c67190f`): **Cloudflare Access is
RETIRED** — `AccessJwtVerifier` + `setup-access.sh` deleted from the tree, production
cleaned (`e846ad63`: Access apps deleted, orphan identity rows swept). Retired on merits,
not just friction: it broke gate-5 offline, added a second identity system needing mapping
back into the one the worker already owns, and bought nothing a device-flow login doesn't.
KEPT: the same-origin assets scaffold (`run_worker_first: ["/v0/*"]`) and `member set-email`
self-bind. **The previous revision of this note told the next agent to mint a Cloudflare API
token for the Access setup — that step is DEAD; do not do it.**

New shape (two tiers; decision record = [tasks/positioning](../../../tasks/positioning.md)):
OSS tier = local-first substrate + multi-agent via the served loopback head + git-based
sharing; hosted tier = the live substrate (board, live CAS, granular access, artifact
serving) as ONE operated deployment.

# Next steps

1. [tasks/ui-v1](../../../tasks/ui-v1.md) — the LOCAL `agentstate-lite ui` command: SPA
   board over the local served head, byte-identical SPA for the hosted tier later. The
   next build; no auth on its critical path.
2. [tasks/git-sharing](../../../tasks/git-sharing.md) — git tier 0+1 (claim the reserved
   `sync` verb, `init --git`, `log.md merge=union`).
3. [tasks/positioning](../../../tasks/positioning.md) — the two-tier positioning doc next
   to NORTH-STAR + `plans/ui-v1.md` rev 3.
4. [tasks/skill-distribution](../../../tasks/skill-distribution.md) — internal Holaxis
   marketplace packaging + worker deploy kit (public channel deliberately later).

GitHub device-flow hosted login is the hosted-tier follow-on — deliberately NOT now.
