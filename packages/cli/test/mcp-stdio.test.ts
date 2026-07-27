import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { initBundle, writeDoc } from "@agentstate-lite/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const CLI = fileURLToPath(new URL("../dist/agentstate-lite.mjs", import.meta.url));

async function runCli(
  args: string[],
  cwd: string,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const child = spawn(process.execPath, [CLI, ...args], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });
  const code = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", resolve);
  });
  return { code, stdout, stderr };
}

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
    args: [CLI, "mcp", "--dir", root, "--actor", "mike/test"],
    stderr: "pipe",
  });
  const client = new Client({ name: "stdio-proof", version: "test" }, { capabilities: {} });
  t.after(async () => {
    await client.close();
    await rm(root, { recursive: true, force: true });
  });

  await client.connect(transport);
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), [
    "show_view",
    "authorize_durable_view",
    "durable_view_bridge",
    "poll_durable_view",
    "close_durable_view",
    "prepare_view_action",
    "finish_view_action",
  ]);
  assert.deepEqual(
    tools.tools
      .filter((tool) => tool.name !== "show_view")
      .map((tool) => tool._meta?.ui?.visibility),
    Array.from({ length: 6 }, () => ["app"]),
    "only show_view is visible to the model; lifecycle and bridge tools belong to the trusted App",
  );

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

test("built npm CLI keeps MCP stdout byte-empty for usage and bundle startup failures", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "aslite-mcp-errors-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const rows = [
    {
      name: "usage",
      args: ["mcp", "--nope"],
      code: 2,
      envelopeCode: "USAGE",
    },
    {
      name: "bundle resolution",
      args: ["mcp", "--dir", root],
      code: 6,
      envelopeCode: "NOT_FOUND",
    },
  ];

  for (const row of rows) {
    const result = await runCli(row.args, root);
    assert.equal(result.code, row.code, row.name);
    assert.equal(result.stdout, "", `${row.name}: JSON-RPC stdout must remain pristine`);
    assert.match(result.stderr, /^error:\n/, `${row.name}: stderr envelope`);
    assert.match(result.stderr, new RegExp(`code: ${row.envelopeCode}`), row.name);
  }
});
