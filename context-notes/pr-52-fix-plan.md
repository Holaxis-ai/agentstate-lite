---
type: Context Note
title: 'PR #52 corrected implementation plan'
actor: codex-main
timestamp: '2026-07-13T18:10:52.947Z'
---
# Summary

Planning gate complete for the four PR #52 fixes plus the independent-review addendum. A read-only planner produced the file-level plan and an independent skeptic required three revisions before approval: add a true built-CLI subprocess proof, state that the private kinds.ts isPlainObject helper is tightened globally, and make malformed-map preservation fixtures explicit.

Approved implementation: make valueDescriptions optional while parser output remains normalized; treat YAML maps as Object/null-prototype records; own-check required/enum/terminal reads; derive new dynamic fields from validated parseArgs tokens because Node drops __proto__ from result.values; use own-data-property writes; make kind field add/remove own-key safe; remove/prune only valid value-description maps and preserve malformed outer or target-inner raw values; add core, source-command, built-binary, field-mutation, and external-package regressions.

Addendum decisions: board/task/architecture staleness was valid and corrected; description metadata keeps the existing canonical outer-trim contract; generated plugin bundle/skill-target artifacts remain merge-bot-owned.

Hard dependency remains Build -> fresh independent Review -> fresh QA. No commit or push is authorized in this unit.
