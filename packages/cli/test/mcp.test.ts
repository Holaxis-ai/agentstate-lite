import assert from "node:assert/strict";
import { test } from "node:test";

import type { Bundle } from "@agentstate-lite/core";
import { KNOWN_COMMANDS } from "../src/cli.js";
import { MCP_USAGE, mcp } from "../src/commands/mcp.js";
import { COMMAND_GROUPS } from "../src/reference.js";

const bundle = { root: "/tmp/board" } as Bundle;

test("mcp is registered in command discovery", () => {
  assert.ok(KNOWN_COMMANDS.includes("mcp"));
  assert.ok(COMMAND_GROUPS.flatMap((group) => group.commands).some((command) => command.usage.startsWith("mcp ")));
});

test("mcp help is offline and does not open a bundle", async () => {
  let output = "";
  let opened = false;
  await mcp(["--help"], {
    stdout: (text) => {
      output += text;
    },
    openBundle: async () => {
      opened = true;
      return bundle;
    },
  });
  assert.equal(output, MCP_USAGE);
  assert.equal(opened, false);
});

test("mcp opens the explicit local bundle and leaves stdout untouched for stdio protocol", async () => {
  let openedDir: string | undefined;
  let startedWith: Bundle | undefined;
  let output = "";
  await mcp(["--dir", "/tmp/board"], {
    stdout: (text) => {
      output += text;
    },
    openBundle: async (dir) => {
      openedDir = dir;
      return bundle;
    },
    startServer: async ({ bundle: startedBundle }) => {
      startedWith = startedBundle;
    },
  });
  assert.equal(openedDir, "/tmp/board");
  assert.equal(startedWith, bundle);
  assert.equal(output, "");
});
