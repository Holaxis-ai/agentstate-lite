import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { initBundle, writeDoc } from "@agentstate-lite/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const CLI = fileURLToPath(new URL("../dist/agentstate-lite.mjs", import.meta.url));

test("built npm CLI serves the fixed MCP App contract over clean stdio", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "aslite-mcp-stdio-"));
  const bundle = await initBundle(root);
  await writeDoc(bundle, {
    id: "tasks/stdio",
    frontmatter: {
      type: "Task",
      title: "STDIO proof",
      status: "todo",
      timestamp: "2026-07-26T12:00:00.000Z",
    },
    body: "# Goal\n\nProve the installed command's transport.",
  });

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [CLI, "mcp", "--dir", root],
    stderr: "pipe",
  });
  const client = new Client({ name: "stdio-proof", version: "test" }, { capabilities: {} });
  t.after(async () => {
    await client.close();
    await rm(root, { recursive: true, force: true });
  });

  await client.connect(transport);
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), ["show_view"]);

  const result = await client.callTool({
    name: "show_view",
    arguments: {
      title: "Transport proof",
      html: "<h1>STDIO works</h1>",
      objectIds: ["tasks/stdio"],
    },
  });
  assert.equal(result.isError, undefined);
  assert.deepEqual(
    (result.structuredContent as { selection: { objectIds: string[] } }).selection.objectIds,
    ["tasks/stdio"],
  );
});
