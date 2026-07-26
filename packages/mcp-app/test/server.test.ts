import assert from "node:assert/strict";
import { test } from "node:test";

import { MemoryBackend, readDocVersioned, writeDoc, type Bundle } from "@agentstate-lite/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import {
  FINISH_VIEW_ACTION_TOOL_NAME,
  MCP_VIEW_RESOURCE_URI,
  PREPARE_VIEW_ACTION_TOOL_NAME,
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
    id: "conventions/task",
    frontmatter: {
      type: "Convention",
      title: "Task",
      governs: "Task",
      path: "tasks/",
      fields: {
        required: ["title", "status"],
        optional: [],
        values: { status: ["todo", "done"] },
      },
      timestamp: T,
    },
    body: "",
  });
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

  assert.equal(payload.schemaVersion, "agentstate.view-launch.v1");
  assert.deepEqual(payload.selection.objectIds, ["roadmap-items/views", "tasks/alpha"]);
  assert.deepEqual(payload.objects.map((object) => object.id), ["roadmap-items/views", "tasks/alpha"]);
  assert.equal(payload.objects[1]?.version, alpha.version);
  assert.equal(payload.objects[1]?.body, "# Goal\n\nFirst task.");
  assert.equal(payload.presentation.css, "");
  assert.equal(payload.launch.actions.length, 0);
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
  assert.deepEqual(tools.tools.map((tool) => tool.name), [
    SHOW_VIEW_TOOL_NAME,
    PREPARE_VIEW_ACTION_TOOL_NAME,
    FINISH_VIEW_ACTION_TOOL_NAME,
  ]);
  const showTool = tools.tools.find((tool) => tool.name === SHOW_VIEW_TOOL_NAME);
  const prepareTool = tools.tools.find((tool) => tool.name === PREPARE_VIEW_ACTION_TOOL_NAME);
  const finishTool = tools.tools.find((tool) => tool.name === FINISH_VIEW_ACTION_TOOL_NAME);
  assert.equal(showTool?._meta?.ui?.resourceUri, MCP_VIEW_RESOURCE_URI);
  assert.equal(showTool?.annotations?.readOnlyHint, true);
  assert.deepEqual(prepareTool?._meta?.ui?.visibility, ["app"]);
  assert.deepEqual(finishTool?._meta?.ui?.visibility, ["app"]);
  assert.equal(finishTool?.annotations?.readOnlyHint, false);

  const resource = await client.readResource({ uri: MCP_VIEW_RESOURCE_URI });
  const content = resource.contents[0];
  assert.ok(content && "text" in content);
  assert.match(content.text, /id="generated-view"[\s\S]*\bsandbox\b/);
  assert.doesNotMatch(content.text, /sandbox="allow-scripts"/);
  assert.match(content.text, /data-aslite-text/);
  assert.match(content.text, /id="confirmation-backdrop"/);
  assert.match(content.text, /prepare_view_action/);
  assert.match(content.text, /finish_view_action/);
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

test("trusted MCP shell prepares, confirms, commits, and refreshes one selected Task action", async (t) => {
  const bundle = memoryBundle();
  await seed(bundle);
  const server = createMcpAppServer({ bundle, actor: "mike/test" });
  const client = new Client({ name: "test-client", version: "test" }, { capabilities: {} });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => {
    await client.close();
    await server.close();
  });

  const shown = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Task action",
      html: "<h1 data-aslite-text='objects.0.frontmatter.title'></h1>",
      objectIds: ["tasks/alpha"],
      actions: [
        {
          kind: "document.set-field",
          label: "Mark complete",
          objectId: "tasks/alpha",
          field: "status",
          value: "done",
        },
      ],
    },
  });
  assert.equal(shown.isError, undefined);
  const view = shown.structuredContent as {
    launch: { launchId: string; actions: Array<{ actionId: string; label: string }> };
  };
  assert.equal(view.launch.actions.length, 1);
  assert.equal(view.launch.actions[0]?.label, "Mark complete");

  const prepared = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      actionId: view.launch.actions[0]!.actionId,
    },
  });
  const prepareResult = (prepared.structuredContent as {
    result: {
      status: string;
      approvalToken?: string;
      confirmation?: { before: unknown; after: unknown; actor: string };
    };
  }).result;
  assert.equal(prepareResult.status, "prepared");
  assert.equal(prepareResult.confirmation?.before, "todo");
  assert.equal(prepareResult.confirmation?.after, "done");
  assert.equal(prepareResult.confirmation?.actor, "mike/test");
  assert.equal((await readDocVersioned(bundle, "tasks/alpha")).doc.frontmatter.status, "todo");

  const otherView = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Other launch",
      html: "<p>Other</p>",
      objectIds: ["tasks/alpha"],
    },
  });
  const otherLaunchId = (
    otherView.structuredContent as { launch: { launchId: string } }
  ).launch.launchId;
  const wrongLaunch = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: otherLaunchId,
      approvalToken: prepareResult.approvalToken,
      decision: "commit",
    },
  });
  assert.equal(
    (wrongLaunch.structuredContent as { result: { status: string } }).result.status,
    "expired",
    "a different launch cannot consume or commit the pending approval",
  );
  assert.equal((await readDocVersioned(bundle, "tasks/alpha")).doc.frontmatter.status, "todo");

  const cancelled = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      approvalToken: prepareResult.approvalToken,
      decision: "cancel",
    },
  });
  assert.equal(
    (cancelled.structuredContent as { result: { status: string } }).result.status,
    "cancelled",
  );
  assert.equal((await readDocVersioned(bundle, "tasks/alpha")).doc.frontmatter.status, "todo");

  const preparedAgain = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      actionId: view.launch.actions[0]!.actionId,
    },
  });
  const approvalToken = (
    preparedAgain.structuredContent as { result: { status: string; approvalToken?: string } }
  ).result.approvalToken;
  assert.ok(approvalToken);
  const finished = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      approvalToken,
      decision: "commit",
    },
  });
  const finishPayload = finished.structuredContent as {
    result: { status: string; version?: string };
    view: { objects: Array<{ id: string; version: string; frontmatter: Record<string, unknown> }> };
  };
  assert.equal(finishPayload.result.status, "committed");
  const persisted = await readDocVersioned(bundle, "tasks/alpha");
  assert.equal(persisted.doc.frontmatter.status, "done");
  assert.equal(persisted.doc.frontmatter.actor, "mike/test");
  assert.equal(finishPayload.result.version, persisted.version);
  assert.equal(finishPayload.view.objects[0]?.frontmatter.status, "done");
  assert.equal(finishPayload.view.objects[0]?.version, persisted.version);

  const replay = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      approvalToken,
      decision: "commit",
    },
  });
  assert.equal(
    (replay.structuredContent as { result: { status: string } }).result.status,
    "expired",
    "the shared approval authority is one-shot",
  );
});

test("trusted MCP shell requires an actor before preparing any write", async (t) => {
  const bundle = memoryBundle();
  await seed(bundle);
  const server = createMcpAppServer({ bundle });
  const client = new Client({ name: "test-client", version: "test" }, { capabilities: {} });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => {
    await client.close();
    await server.close();
  });

  const shown = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Task action",
      html: "<p>Task</p>",
      objectIds: ["tasks/alpha"],
      actions: [
        {
          kind: "document.set-field",
          label: "Mark complete",
          objectId: "tasks/alpha",
          field: "status",
          value: "done",
        },
      ],
    },
  });
  const view = shown.structuredContent as {
    launch: { launchId: string; actions: Array<{ actionId: string }> };
  };
  const prepared = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      actionId: view.launch.actions[0]!.actionId,
    },
  });
  assert.equal(
    (prepared.structuredContent as { result: { status: string; message?: string } }).result.status,
    "rejected",
  );
  assert.match(
    (prepared.structuredContent as { result: { message?: string } }).result.message ?? "",
    /action actor/,
  );
  assert.equal((await readDocVersioned(bundle, "tasks/alpha")).doc.frontmatter.status, "todo");
});

test("MCP actions fail closed outside the explicit envelope and on stale displayed versions", async (t) => {
  const bundle = memoryBundle();
  await seed(bundle);
  const server = createMcpAppServer({ bundle, actor: "mike/test" });
  const client = new Client({ name: "test-client", version: "test" }, { capabilities: {} });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => {
    await client.close();
    await server.close();
  });

  const outside = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Outside",
      html: "<p>Task only</p>",
      objectIds: ["tasks/alpha"],
      actions: [
        {
          kind: "document.set-field",
          label: "Change roadmap",
          objectId: "roadmap-items/views",
          field: "status",
          value: "done",
        },
      ],
    },
  });
  assert.equal(outside.isError, true);
  assert.match(
    outside.content[0]?.type === "text" ? outside.content[0].text : "",
    /outside this View's explicit object selection/,
  );

  const shown = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Stale task",
      html: "<p>Task</p>",
      objectIds: ["tasks/alpha"],
      actions: [
        {
          kind: "document.set-field",
          label: "Mark complete",
          objectId: "tasks/alpha",
          field: "status",
          value: "done",
        },
      ],
    },
  });
  const view = shown.structuredContent as {
    launch: { launchId: string; actions: Array<{ actionId: string }> };
  };
  await writeDoc(bundle, {
    id: "tasks/alpha",
    frontmatter: { type: "Task", title: "Alpha", status: "todo", priority: "1", timestamp: T },
    body: "# Goal\n\nChanged elsewhere.",
  });
  const prepared = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      actionId: view.launch.actions[0]!.actionId,
    },
  });
  assert.equal(
    (prepared.structuredContent as { result: { status: string } }).result.status,
    "conflict",
  );

  const unknown = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: { launchId: view.launch.launchId, actionId: "not-a-real-action" },
  });
  assert.equal(
    (unknown.structuredContent as { result: { status: string } }).result.status,
    "rejected",
  );
});
