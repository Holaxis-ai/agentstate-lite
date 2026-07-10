---
type: Context Note
title: Codex marketplace install path for agentstate-lite
actor: openai/codex
timestamp: '2026-07-09T22:56:51.921Z'
---
# Summary

Agentstate-lite is packaged as a Codex plugin in this repo, not currently in holaxis-plugins. The Codex marketplace manifest is .agents/plugins/marketplace.json with marketplace name agentstate-lite and plugin name agentstate-lite; the plugin root is plugins/agentstate-lite and contains .codex-plugin/plugin.json plus skills/agentstate-lite/SKILL.md. A consumer can register the marketplace with codex plugin marketplace add Holaxis-ai/agentstate-lite, or for local/dev testing codex plugin marketplace add /path/to/agentstate-lite, then install with codex plugin add agentstate-lite@agentstate-lite. Start a fresh Codex session after installing; resumed sessions will not load newly installed skills.
