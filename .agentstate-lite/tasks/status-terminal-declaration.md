---
type: Task
title: 'Declare terminal statuses on kind conventions: THREE consumers now waiting'
status: todo
priority: '2'
description: >-
  The evidence-gated refinement from the expects_inbound design has its trigger
  — three independent demand signals: (1) missing_expected_links reports
  historical done/canceled tasks as noise (the original gate, 2026-07-07); (2) a
  foreign-harness agent needed OPEN = non-terminal and could not express it
  (2026-07-08); (3) the status sweep sort hardcodes the string done. Design: the
  kind convention status enum gains a terminal marker (shape TBD at build: e.g.
  fields.values.status plus terminal: [done, canceled] — mirror the
  links/expects_inbound lenient-parse pattern). Consumers: the lint
  skips-or-groups terminal instances; list gains an open semantic (with
  tasks/list-field-sets); the sweep sort reads the declaration. One small
  declaration, three existing consumers — consumer-pull satisfied for real.
actor: claude
timestamp: '2026-07-08T20:25:58.710Z'
---

