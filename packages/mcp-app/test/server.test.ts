import assert from "node:assert/strict";
import { test } from "node:test";

import { MemoryBackend, readDocVersioned, writeDoc, type Bundle } from "@agentstate-lite/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import {
  MCP_VIEW_RESOURCE_URI,
  SHOW_VIEW_TOOL_NAME,
  createMcpAppServer,
  resolveViewLaunch,
} from "../src/index.js";

const T = "2026-07-26T12:00:00.000Z";

function memoryBundle(): Bundle {
  return { root: "mem://mcp-app-test", backend: new MemoryBackend() };
}

async function seed(bundle: Bundle): Promise<void> {
  await writeDoc(bundle, {
    id: "tasks/alpha",
    frontmatter: { type: "Task", title: "Alpha", status: "todo", timestamp: T },
    body: "# Goal\n\nFirst task.",
  });
  await writeDoc(bundle, {
    id: "roadmap-items/views",
    frontmatter: { type: "Roadmap Item", title: "Conversational Views", status: "active", timestamp: T },
    body: "# Outcome\n\nUseful views in chat.",
  });
}

test("resolveViewLaunch returns current versioned snapshots in the caller's explicit order", async () => {
  const bundle = memoryBundle();
  await seed(bundle);

  const payload = await resolveViewLaunch(bundle, {
    title: "Today",
    html: "<main id='today'></main>",
    objectIds: ["roadmap-items/views", "tasks/alpha"],
  });
  const alpha = await readDocVersioned(bundle, "tasks/alpha");

  assert.equal(payload.schemaVersion, "agentstate.view-launch.v0");
  assert.deepEqual(payload.selection.objectIds, ["roadmap-items/views", "tasks/alpha"]);
  assert.deepEqual(payload.objects.map((object) => object.id), ["roadmap-items/views", "tasks/alpha"]);
  assert.equal(payload.objects[1]?.version, alpha.version);
  assert.equal(payload.objects[1]?.body, "# Goal\n\nFirst task.");
  assert.equal(payload.presentation.css, "");
  assert.match(payload.presentation.contentHash, /^sha256:[a-f0-9]{64}$/);
});

test("MCP contract exposes one fixed App resource and invocation-specific tool results", async (t) => {
  const bundle = memoryBundle();
  await seed(bundle);
  const server = createMcpAppServer({ bundle, version: "test" });
  const client = new Client({ name: "test-client", version: "test" }, { capabilities: {} });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => {
    await client.close();
    await server.close();
  });

  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), [SHOW_VIEW_TOOL_NAME]);
  assert.equal(tools.tools[0]?._meta?.ui?.resourceUri, MCP_VIEW_RESOURCE_URI);
  assert.equal(tools.tools[0]?.annotations?.readOnlyHint, true);

  const resource = await client.readResource({ uri: MCP_VIEW_RESOURCE_URI });
  const content = resource.contents[0];
  assert.ok(content && "text" in content);
  assert.match(content.text, /id="generated-view"[\s\S]*\bsandbox\b/);
  assert.doesNotMatch(content.text, /sandbox="allow-scripts"/);
  assert.match(content.text, /data-aslite-text/);
  assert.match(content.text, /script-src 'none'/);
  assert.match(content.text, /style-src 'unsafe-inline'/);
  const scriptStart = content.text.indexOf("<script>") + "<script>".length;
  const scriptEnd = content.text.lastIndexOf("</script>");
  assert.ok(scriptStart >= "<script>".length && scriptEnd > scriptStart);
  assert.doesNotThrow(() => new Function(content.text.slice(scriptStart, scriptEnd)));
  assert.equal(content._meta?.ui?.csp?.frameDomains, undefined);
  assert.deepEqual(content._meta?.ui?.csp?.connectDomains, []);

  const first = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "One task",
      html: "<h1>One</h1>",
      css: "h1 { color: green; }",
      objectIds: ["tasks/alpha"],
    },
  });
  assert.equal(first.isError, undefined);
  assert.match(first.content[0]?.type === "text" ? first.content[0].text : "", /One task/);
  assert.deepEqual(
    (first.structuredContent as { selection: { objectIds: string[] } }).selection.objectIds,
    ["tasks/alpha"],
  );

  await writeDoc(bundle, {
    id: "tasks/alpha",
    frontmatter: { type: "Task", title: "Alpha", status: "done", timestamp: T },
    body: "# Goal\n\nCompleted.",
  });
  const second = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Two objects",
      html: "<h1>Two</h1>",
      objectIds: ["tasks/alpha", "roadmap-items/views"],
    },
  });
  const secondPayload = second.structuredContent as {
    title: string;
    presentation: { html: string; css: string };
    objects: Array<{ id: string; body: string }>;
  };
  assert.equal(secondPayload.title, "Two objects");
  assert.equal(secondPayload.presentation.html, "<h1>Two</h1>");
  assert.equal(secondPayload.presentation.css, "");
  assert.deepEqual(secondPayload.objects.map((object) => object.id), [
    "tasks/alpha",
    "roadmap-items/views",
  ]);
  assert.equal(secondPayload.objects[0]?.body, "# Goal\n\nCompleted.");
});

test("show_view fails closed for an unknown document ID", async (t) => {
  const server = createMcpAppServer({ bundle: memoryBundle() });
  const client = new Client({ name: "test-client", version: "test" }, { capabilities: {} });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => {
    await client.close();
    await server.close();
  });

  const result = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Missing",
      html: "<p>Missing</p>",
      objectIds: ["tasks/missing"],
    },
  });
  assert.equal(result.isError, true);
  assert.match(result.content[0]?.type === "text" ? result.content[0].text : "", /tasks\/missing/);
});
