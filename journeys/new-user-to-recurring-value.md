---
type: Journey
title: New user to recurring value
status: active
target_user: A person collaborating with agents across one or more projects
product_promise: >-
  Install once, shape a durable workspace around the user's needs, and
  collaborate through useful live Views.
entry_condition: >-
  A new user has Node.js and enters through an empty terminal, installed Agent
  Skill, or existing project/host, but has no established AgentState mental
  model.
success_condition: >-
  The user has a useful bundle and custom portable View they can reopen and
  maintain across sessions and upgrades.
description: >-
  The primary supported onboarding and recurring-use journey for AgentState
  Lite.
actor: codex-onboarding-scope
timestamp: '2026-08-03T23:56:06.910Z'
---
# Product promise

A new user can install AgentState Lite, give a supported agent a durable local workspace, shape that workspace around their needs, and collaborate through useful live Views without learning the product's internal architecture first.

# Entry condition

The user has Node.js, no established AgentState mental model, and reaches the product through one of three supported entry conditions:

- an empty terminal where bare `aslite` can orient without creating files;
- an agent with the optional Agent Skill/hook installed, where the user identifies as new or asks how to begin; or
- an existing project or connected host where the user wants a separate learning workspace.

Desktop host connection is a parallel lane, not a hard predecessor of the shared terminal/local-web learning and first-bundle path.

# Successful outcome

The user has a useful real bundle with structured content and at least one custom durable View. They can return to it in a later session and update AgentState Lite without losing data or configuration. The separate `agentstate-guide` remains available as a reference rather than becoming the user's project.

# Supported surfaces

- Bundle-free orientation: bare CLI, README/npm front door, and optional Agent Skill.
- Shared learning path: explicit guide Recipe creation plus the local web launcher.
- Primary conversational hosts: Claude Desktop and the ChatGPT desktop app, reached through their parallel connection lanes.
- MCP Apps, including expanded/full-page presentation, remain “where configured”; they do not block guide-v1 validation.
- Terminal path: CLI for writes and local web for the human-facing View.
- One portable View model across every container.

[has journey stage](../journey-stages/01-install.md)

[has journey stage](../journey-stages/02-connect-claude-desktop.md)

[has journey stage](../journey-stages/03-connect-chatgpt-app.md)

[has journey stage](../journey-stages/04-learn-through-guidance-bundle.md)

[has journey stage](../journey-stages/05-create-first-bundle.md)

[has journey stage](../journey-stages/06-install-or-model-operating-system.md)

[has journey stage](../journey-stages/07-create-useful-content.md)

[has journey stage](../journey-stages/08-author-portable-view.md)

[has journey stage](../journey-stages/09-show-view-in-conversation.md)

[has journey stage](../journey-stages/10-expand-and-interact.md)

[has journey stage](../journey-stages/11-use-local-web-fallback.md)

[has journey stage](../journey-stages/12-return-and-rediscover.md)

[has journey stage](../journey-stages/13-update-without-disruption.md)

[has journey stage](../journey-stages/14-share-an-operating-model.md)

[onboarding scope](../plans/onboarding-surfaces.md)

[guide-deferral decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md)
