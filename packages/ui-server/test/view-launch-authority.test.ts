import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("web and MCP registered Views delegate minting to the shared runtime authority", async () => {
  const webSource = await readFile(new URL("../src/server.ts", import.meta.url), "utf8");
  const mcpSource = await readFile(new URL("../../mcp-app/src/server.ts", import.meta.url), "utf8");

  assert.match(webSource, /mintActiveViewLaunch\(options\.bundle, runtime\.launches, registryId\)/);
  assert.match(mcpSource, /mintActiveViewLaunch\(bundle, launches, parsed\.viewId\)/);
  assert.doesNotMatch(webSource, /sourceKind:\s*["']registered["']/);
  assert.doesNotMatch(webSource, /remoteRegistryHeads|readPageBlob|viewLaunchIsCurrent|REMOTE_BUNDLE/);
});
