/**
 * Agreement contract for the two consumers of Claude/Codex config roots: global hook targeting
 * and the generated skill's shell discovery. OpenCode is hook-only and intentionally absent.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";

import { globalHookTargets, type HookTargets } from "../src/commands/hook.js";
import { SKILL_HOST_HOMES } from "../src/skill-render.js";

interface HostRow {
  name: string;
  env: "CLAUDE_CONFIG_DIR" | "CODEX_HOME";
  fallbackDirectory: ".claude" | ".codex";
  skillHome: string;
  hookTarget: keyof Pick<HookTargets, "claudeSettings" | "codexHooks">;
}

const HOSTS: HostRow[] = [
  {
    name: "Claude Code",
    env: "CLAUDE_CONFIG_DIR",
    fallbackDirectory: ".claude",
    skillHome: SKILL_HOST_HOMES[0]!,
    hookTarget: "claudeSettings",
  },
  {
    name: "Codex",
    env: "CODEX_HOME",
    fallbackDirectory: ".codex",
    skillHome: SKILL_HOST_HOMES[1]!,
    hookTarget: "codexHooks",
  },
];

const CASES = [
  { name: "default", override: undefined },
  { name: "empty override falls back", override: "" },
  { name: "relocated", override: "relocated" },
] as const;

function shellRoot(expression: string, env: NodeJS.ProcessEnv): string {
  const result = spawnSync("bash", ["-c", `printf '%s' ${expression}`], {
    env: { PATH: "/usr/bin:/bin", ...env },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test("global hook targets and generated skill discovery share the host-root matrix", async (t) => {
  const home = "/tmp/aslite-host-root-home";
  for (const host of HOSTS) {
    for (const scenario of CASES) {
      await t.test(`${host.name}: ${scenario.name}`, () => {
        const relocated = `/tmp/${host.name.toLowerCase().replaceAll(" ", "-")}-config`;
        const override = scenario.override === "relocated" ? relocated : scenario.override;
        const env: NodeJS.ProcessEnv = { HOME: home };
        if (override !== undefined) env[host.env] = override;
        const expected = override ? relocated : join(home, host.fallbackDirectory);

        assert.equal(dirname(globalHookTargets(home, env)[host.hookTarget]), expected);
        assert.equal(shellRoot(host.skillHome, env), expected);
      });
    }
  }
});
