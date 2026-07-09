---
type: Task
title: doc update/write --body silently drops a doc's outbound links (data loss)
status: in_progress
priority: '1'
description: >-
  HIGH — silent loss of the link graph (signature feature). Found by an agent
  using agentstate-lite in a consuming project. MECHANISM: cross-links are
  markdown links in the doc body (link add appends [text](../to.md) then
  rewrites); a --body full-replace drops them. REPRO: new '<Kind>' X --link
  '<t>=<Y>' -> outbound 1; doc update X --body '…' -> outbound 0. SCOPE:
  body-specific; field-only updates preserve. Spans doc update --body AND doc
  write --body. SHORT-TERM FIX (this task): a GUARD — refuse a --body write that
  would DROP outbound links unless --replace-links, firing ONLY on real loss
  (existing links absent from the new body), never on a read-modify-write.
  Coherent without link-remove (removal still works via --replace-links). PROPER
  FIX (preserve-by-default + managed block + link remove) =
  roadmap-items/link-model-body-safe, which supersedes this. Sonnet build +
  Fable review + PR.
actor: mike/claude
timestamp: '2026-07-09T23:29:18.498Z'
---
[proper fix](../roadmap-items/link-model-body-safe.md)
