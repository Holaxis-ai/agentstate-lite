---
type: Task
title: >-
  CLI version string cannot distinguish channel or vintage (npm frozen behind
  the skill channel)
status: todo
priority: '2'
description: >-
  All three installed channels report 0.1.0-pre.1 while carrying different code;
  npm has been frozen at the 2026-07-21 publish while the plugin channel tracks
  main. Support has no discriminator and the npm quickstart installs pre-MCP
  code.
actor: mike/claude
timestamp: '2026-07-27T01:01:22.921Z'
---
# Problem

The CLI version string does not distinguish distribution channels or vintages. On 2026-07-26 all
three installed channels on a founder machine reported `0.1.0-pre.1` while carrying substantially
different code:

| Channel | Built | Bundle bytes | MCP host present |
|---|---|---|---|
| Skill/plugin (marketplace v1.0.124) | 2026-07-26 20:56 | 3,017,625 | yes |
| Local dev dist | 2026-07-26 18:40 | 3,017,385 | yes |
| npm `@holaxis/aslite@0.1.0-pre.1` | 2026-07-21 23:37 | 1,025,371 | no (`show_view`: 0 hits) |

The npm package was published once (`created`, the version entry, and `modified` share one
timestamp) and has not been republished. The plugin channel regenerates from main's tip on every
merge, so it accumulates every merged change while the npm coordinate stays frozen — and the
package version, which both report, moves for neither.

# Why it matters

1. Support has no discriminator. Asking a test user "what version are you on?" returns
   `0.1.0-pre.1` regardless of which channel they installed or how old it is. Only the plugin
   manifest version (1.0.124) tracks reality, and npm users have no equivalent.
2. It lands directly on `tasks/npm-quickstart-onboarding`. The quickstart's install path is npm,
   so a new user following it receives 2026-07-21 code while the documentation describes main.
   Anything merged since — the shared Markdown renderer, `view-runtime`, the experimental MCP
   View host, governed actions, bounded query selection, the Home landing rethink — is absent
   from what they install.
3. It weakens the npm-as-primary-channel claim that `tasks/npm-cli-skill-prerelease` is closing.

# Scope

Decide and implement how a running CLI reports enough identity to locate its own build. Options to
weigh, not a chosen design:

- Bump and republish the npm prerelease as part of the release push, so the coordinate is not
  frozen behind the plugin channel.
- Embed build provenance in the bundle (source commit and/or build timestamp) and surface it from
  the version surface, so identity does not depend on a hand-moved package version.
- Extend the existing bot-owned version automation to cover the npm channel, or state explicitly
  that npm publishes are manual and cadence-gated.

# Out of scope

Release automation and the publish cadence decision itself, which
`tasks/npm-cli-skill-prerelease` and the founders own.

# Evidence

Observed 2026-07-26/27 on a founder machine. `npm view @holaxis/aslite time` returns a single
publish timestamp; bundle sizes and the `show_view` probe are as tabulated above.
