---
type: Plan
title: 'Plan: npm prerelease — aslite coordinate + carried skill + explicit installer'
actor: anthropic/claude
timestamp: '2026-07-21T02:33:52.058Z'
---
# Goal

Deliver `tasks/npm-cli-skill-prerelease`: one npm artifact (`aslite`) carrying the authoritative
CLI plus an optional, explicitly installable Agent Skill, proven from the exact packed tarball.
Publishing itself stays a human act; this unit ends with everything pack-proven and a paste-ready
PR. Ultimate goal served: npm-first distribution (`designs/npm-bundle-bootstrap`,
`roadmap-items/distribution-neutral-resources`).

# Shape: ONE PR, three commits

The task's one behavioral claim: "one npm installation provides the CLI plus an explicitly
installable skill that invokes the CLI on PATH." The coordinate rename is a precondition applied
inside the same unit (decision: `decisions/npm-interim-package-name`).

## Commit 1 — apply the `aslite` coordinate

- `packages/cli/package.json`: `name: "aslite"`. Keep BOTH bins (`aslite`, `agentstate-lite`),
  same dist entry — one executable implementation, two names.
- `src/invocation.ts`: `PACKAGE_NAME = "aslite"`; reorder `BIN_NAMES = ["aslite",
  "agentstate-lite"]` (aslite preferred for hints and `hookCommand()`).
- `src/skill-render.ts`: `PKG = "aslite"`.
- `scripts/verify-npm-package.mjs` (+ its test): expected manifest name, installed-root path.
- Regenerate `packages/cli/SKILL.md` (check:skill gate); update every test pinning the old
  npx/package strings; re-read README for truthfulness (it may not use the npx form at all).
- DO NOT touch: repo name, marketplace plugin, `plugins/` committed bundle or manifests
  (bot-owned), the `@agentstate-lite/*` internal workspace package names (private, unpublished —
  renaming them is out of scope).

## Commit 2 — the tarball carries the skill

- `src/distribution-resources.ts`: add npm `targets` for the resources the npm skill's prose
  requires (at minimum what `SKILL_CAPABILITY_PATTERNS` demands: view-authoring reference +
  the two recipe packages; mirror the skill projection unless size argues otherwise). npm dest
  root: `packages/cli/references/`.
- `scripts/gen-skill.mjs`: npm target now also syncs `references/` (same convergent
  copy+prune discipline as the skill target); `--check` covers both.
- `src/skill-render.ts` `renderNpm()`: examples use BARE `aslite` (not `npx -y`); frontmatter
  name `aslite`; add a short "if `aslite` is not on PATH" section with actionable guidance
  (`npm install -g aslite`, or `npx -y aslite` as the no-install fallback) — NO marketplace
  cache discovery in this target; reference pointers are paths relative to the installed skill
  folder.
- `packages/cli/package.json` `files`: `["dist", "SKILL.md", "references"]`.
- `verify-npm-package.mjs`: assert the exact new tarball file set and EXACTLY ONE `.mjs`
  executable (dist bundle); assert SKILL.md + references present and byte-identical to the
  repo-generated ones.

## Commit 3 — `aslite skill install|status|uninstall`

- New `src/commands/skill.ts`, registered in the Session group of `reference.ts` (usage:
  `skill install|status|uninstall [--scope project|global]`).
- Asset source: the running distribution's package root (`dirname(executable)/..` →
  `SKILL.md` + `references/`). v0 supports the npm/dev layout ONLY; when the running executable
  is the plugin-cache bundle (`isSkillBundlePath`), error with guidance ("this channel installs
  via the marketplace") rather than half-supporting a second layout.
- Targets: Claude Code + Codex via the ONE `HOST_CONFIG_ROOTS` authority. `--scope project`
  (default): `<cwd>/.claude/skills/aslite/`, `<cwd>/.codex/skills/aslite/`; `--scope global`:
  `resolveHostConfigRoot(...)/skills/aslite/`. OpenCode deliberately excluded (it has no skill
  surface; its integration is the hook plugin) — documented in help text.
- Reversibility & safety (destructive-write boundary): installer writes an install manifest
  (e.g. `.aslite-skill-manifest.json`: file list + package version) inside the target folder;
  `uninstall` removes exactly the manifested files (+ folder if then empty) and REFUSES an
  unmanifested folder; `status` reports per host: absent | installed | stale (byte-compare vs
  the running distribution's assets). Reinstall is idempotent/convergent. No npm lifecycle
  scripts anywhere.
- Hook stability proof (scope item 5): a test that `hookCommand()` prefers `aslite` when both
  bins resolve on PATH to the running executable, and an installed-tarball assertion (below)
  that `hook install` writes `aslite session-start`.
- Extend `verify-npm-package.mjs` end-to-end proof, all inside the isolated prefix/HOME:
  `aslite skill install` (global scope vs isolated HOME + CLAUDE_CONFIG_DIR/CODEX_HOME
  variants) → status reports installed → reinstall no-op → uninstall removes cleanly;
  `aslite hook install --scope project` writes settings whose command is `aslite
  session-start`; then uninstall. Also: skill files render bare `aslite` (grep the installed
  SKILL.md for `npx -y` absence / cache-resolver absence).

# Consequences accepted

- `reference.ts` gains a command → the bot regenerates the plugin-channel SKILL.md on merge
  (normal; PR does not hand-rebuild it).
- The plugin/marketplace channel stays fully intact until the founder proof passes (design's
  transition step 6 is explicitly NOT this unit).
- `npx -y agentstate-lite` stops being a truthful invocation only in GENERATED prose we
  regenerate; the runtime `npx` fallback string follows `PACKAGE_NAME`. Existing installed
  hooks keep working (bin `agentstate-lite` remains).

# Risk tier & stages

Skill install/uninstall + hook writes = destructive-write boundary on user config → Builder →
independent Review (exact SHA, isolated worktree, `npm ci` first) → adversarial QA (interrupted
install, pre-existing non-managed folder, stale manifest, env-var host relocation, idempotency
under repeat, PATH-absent guidance). Gates before ship: `npm run build`, `npm run typecheck`,
`npm test`, `npm run check` — unpiped, exit-code-verified, from the repo root.

# Out of scope

Publishing to npm; marketplace/plugin retirement; repo rename; `@agentstate-lite/*` library
publication; any `plugins/` or manifest edit; `aslite setup` composition convenience.

[implements](../tasks/npm-cli-skill-prerelease.md)

[grounded in](../designs/npm-bundle-bootstrap.md)

[applies](../decisions/npm-interim-package-name.md)

# Review amendments (adopted 2026-07-20, plan review by independent agent)

1. **SHAPE CHANGE: two PRs, not one.** PR1 = the `aslite` coordinate applied everywhere + the
   managed-hook marker fix it forces (see 2). PR2 = skill carry + `skill install|status|uninstall`
   + proof extensions (the task's own behavioral claim; high-risk tier with adversarial QA).
   PR2 branches from PR1's tip locally and is rebased onto main once PR1 merges — the
   branch-from-main rule's intent (fresh generated prose) is honored by regenerating at rebase.
2. **Marker fix co-locates with the BIN_NAMES reorder (PR1).** `HOOK_MARKER = "agentstate-lite"`
   substring-matching (hook.ts:62, and axi-sdk-js's append-if-no-match) does NOT match
   `aslite session-start` → reinstall would append duplicates, status/uninstall would miss it.
   Managed-hook recognition must accept BOTH command forms (legacy `agentstate-lite`-marked and
   new `aslite`), with upgrade-path tests (legacy hook present → install rewrites, no duplicate;
   uninstall removes either form) in the same commit.
3. **Split `PKG` per channel in skill-render.ts.** npm target renders `aslite`; the skill target
   KEEPS the `agentstate-lite` identity and resolver paths (renaming it is a plugin-channel
   behavior change this unit forbids). renderSkill's prose mentions of the npm channel
   (`npx -y agentstate-lite`, lines ~757/848) become `npx -y aslite` (source edit; bot regenerates
   the artifact on merge).
4. **Rename surfaces added to PR1:** root package.json's six `-w agentstate-lite` selectors;
   `.github/workflows/mutation-tests.yml` workspace pin (silent breakage — not PR CI);
   `packages/cli/README.md` (ships in the tarball; uses `npx -y agentstate-lite` today).
5. **Must-NOT-change list confirmed** and extended: `dist/agentstate-lite.mjs` filename,
   `isSkillBundlePath` match, `SKILL_HOST_ROOTS`/resolver `skills/agentstate-lite` paths,
   `scripts/ci-version-bundle.*`, `@agentstate-lite/*` workspace names, plugins/ + manifests.
6. PR2 details: export `isSkillBundlePath`; add the `skill` command's `SKILL_COMMAND_RESOURCES`
   row (exhaustiveness-gated); extend the phantom/orphan agreement test to the npm projection;
   e2e must assert POST-uninstall state explicitly; verify Codex project-scope skill discovery
   against the real host before claiming "installed" there.
7. Founder-proof items that stay HUMAN post-publish validation (not automated here): fresh-agent
   session on an unfamiliar bundle, attributed mutation, View open — mapped in the task record at
   close.
