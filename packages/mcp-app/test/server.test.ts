import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  MemoryBackend,
  deleteDoc,
  readDocVersioned,
  writeBlob,
  writeDoc,
  type Bundle,
} from "@agentstate-lite/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import {
  AUTHORIZE_DURABLE_VIEW_TOOL_NAME,
  CLOSE_DURABLE_VIEW_TOOL_NAME,
  DURABLE_VIEW_BRIDGE_TOOL_NAME,
  FINISH_VIEW_ACTION_TOOL_NAME,
  MCP_VIEW_RESOURCE_URI,
  POLL_DURABLE_VIEW_TOOL_NAME,
  PREPARE_VIEW_ACTION_TOOL_NAME,
  RESOLVE_LAUNCH_TOOL_NAME,
  SHOW_VIEW_TOOL_NAME,
  createMcpAppServer,
  resolveDurableViewLaunch,
  resolveViewLaunch,
} from "../src/index.js";
import { SessionViewAuthorizationStore } from "@agentstate-lite/view-runtime";

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
        terminal: { status: ["done"] },
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
    id: "tasks/beta",
    frontmatter: { type: "Task", title: "Beta", status: "done", timestamp: T },
    body: "# Goal\n\nCompleted task.",
  });
  await writeDoc(bundle, {
    id: "tasks/gamma",
    frontmatter: { type: "Task", title: "Gamma", status: "todo", timestamp: T },
    body: "# Goal\n\nAnother task.",
  });
  await writeDoc(bundle, {
    id: "roadmap-items/views",
    frontmatter: { type: "Roadmap Item", title: "Conversational Views", status: "active", timestamp: T },
    body: "# Outcome\n\nUseful views in chat.",
  });
  await writeDoc(bundle, {
    id: "views-registry/roadmap",
    frontmatter: {
      type: "View",
      title: "Roadmap",
      entry: "views/roadmap.html",
      access: "bundle-read",
      timestamp: T,
    },
    body: "Existing durable Roadmap View.",
  });
  await writeBlob(
    bundle,
    "views/roadmap.html",
    new Uint8Array(
      await readFile(new URL("../../../examples/views/roadmap.html", import.meta.url)),
    ),
    "text/html; charset=utf-8",
  );
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
  assert.deepEqual(payload.selection, {
    objectIds: ["roadmap-items/views", "tasks/alpha"],
  });
  assert.deepEqual(payload.objects.map((object) => object.id), ["roadmap-items/views", "tasks/alpha"]);
  assert.equal(payload.objects[1]?.version, alpha.version);
  assert.equal(payload.objects[1]?.body, "# Goal\n\nFirst task.");
  assert.equal(payload.presentation.css, "");
  assert.equal(payload.launch.actions.length, 0);
  assert.match(payload.presentation.contentHash, /^sha256:[a-f0-9]{64}$/);
});

test("resolveViewLaunch applies the shared View query semantics once and freezes an honest bounded selection", async () => {
  const bundle = memoryBundle();
  await seed(bundle);

  const payload = await resolveViewLaunch(bundle, {
    title: "Open tasks",
    html: "<main></main>",
    query: {
      type: "Task",
      field: "status=todo,done",
      open: true,
      limit: 1,
    },
  });

  assert.deepEqual(payload.selection, {
    objectIds: ["tasks/alpha"],
    query: {
      type: "Task",
      field: "status=todo,done",
      open: true,
      limit: 1,
    },
    matchedCount: 2,
  });
  assert.deepEqual(payload.objects.map((object) => object.id), ["tasks/alpha"]);
});

test("query selection rejects ambiguous, empty, invalid, and no-match envelopes", async () => {
  const bundle = memoryBundle();
  await seed(bundle);
  const base = { title: "Invalid", html: "<main></main>" };

  await assert.rejects(
    () => resolveViewLaunch(bundle, base),
    /exactly one selection mode/,
  );
  await assert.rejects(
    () =>
      resolveViewLaunch(bundle, {
        ...base,
        objectIds: ["tasks/alpha"],
        query: { type: "Task" },
      }),
    /exactly one selection mode/,
  );
  await assert.rejects(
    () => resolveViewLaunch(bundle, { ...base, query: {} }),
    /at least one of type, prefix, field, or open:true/,
  );
  await assert.rejects(
    () => resolveViewLaunch(bundle, { ...base, query: { type: "Task", limit: 21 } }),
    /between 1 and 20/,
  );
  await assert.rejects(
    () => resolveViewLaunch(bundle, { ...base, query: { field: "status=todo,,done" } }),
    /no empty members/,
  );
  await assert.rejects(
    () => resolveViewLaunch(bundle, { ...base, query: { type: "Missing" } }),
    /matched no AgentState documents/,
  );
});

test("direct and MCP show_view entry paths share one strict input parser", async (t) => {
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

  const cases: Array<{
    name: string;
    input: Record<string, unknown>;
    expected: RegExp;
  }> = [
    {
      name: "wrong query member type",
      input: {
        title: "Invalid",
        html: "<main></main>",
        query: { type: "Task", open: "true" },
      },
      expected: /expected boolean, received string/i,
    },
    {
      name: "unknown query member",
      input: {
        title: "Invalid",
        html: "<main></main>",
        query: { type: "Task", unexpected: true },
      },
      expected: /unrecognized key.*unexpected/i,
    },
    {
      name: "unknown top-level member",
      input: {
        title: "Invalid",
        html: "<main></main>",
        objectIds: ["tasks/alpha"],
        unexpected: true,
      },
      expected: /unrecognized key.*unexpected/i,
    },
  ];

  for (const entry of cases) {
    await assert.rejects(
      () => resolveViewLaunch(bundle, entry.input as never),
      entry.expected,
      `${entry.name}: direct resolver`,
    );
    const result = await client.callTool({
      name: SHOW_VIEW_TOOL_NAME,
      arguments: entry.input,
    });
    assert.equal(result.isError, true, `${entry.name}: MCP tool`);
    assert.match(
      result.content[0]?.type === "text" ? result.content[0].text : "",
      entry.expected,
      `${entry.name}: MCP tool`,
    );
  }
});

test("query selection defaults to twenty id-sorted snapshots and reports the full match count", async () => {
  const bundle = memoryBundle();
  for (let index = 24; index >= 0; index -= 1) {
    const suffix = String(index).padStart(2, "0");
    await writeDoc(bundle, {
      id: `bulk/${suffix}`,
      frontmatter: { type: "Bulk", title: suffix, timestamp: T },
      body: "",
    });
  }

  const payload = await resolveViewLaunch(bundle, {
    title: "Bounded",
    html: "<main></main>",
    query: { type: "Bulk" },
  });

  assert.equal(payload.selection.matchedCount, 25);
  assert.equal(payload.selection.objectIds.length, 20);
  assert.deepEqual(payload.selection.objectIds, [
    "bulk/00",
    "bulk/01",
    "bulk/02",
    "bulk/03",
    "bulk/04",
    "bulk/05",
    "bulk/06",
    "bulk/07",
    "bulk/08",
    "bulk/09",
    "bulk/10",
    "bulk/11",
    "bulk/12",
    "bulk/13",
    "bulk/14",
    "bulk/15",
    "bulk/16",
    "bulk/17",
    "bulk/18",
    "bulk/19",
  ]);
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
    AUTHORIZE_DURABLE_VIEW_TOOL_NAME,
    DURABLE_VIEW_BRIDGE_TOOL_NAME,
    POLL_DURABLE_VIEW_TOOL_NAME,
    CLOSE_DURABLE_VIEW_TOOL_NAME,
    PREPARE_VIEW_ACTION_TOOL_NAME,
    FINISH_VIEW_ACTION_TOOL_NAME,
    RESOLVE_LAUNCH_TOOL_NAME,
  ]);
  const showTool = tools.tools.find((tool) => tool.name === SHOW_VIEW_TOOL_NAME);
  const authorizeTool = tools.tools.find(
    (tool) => tool.name === AUTHORIZE_DURABLE_VIEW_TOOL_NAME,
  );
  const bridgeTool = tools.tools.find(
    (tool) => tool.name === DURABLE_VIEW_BRIDGE_TOOL_NAME,
  );
  const pollTool = tools.tools.find(
    (tool) => tool.name === POLL_DURABLE_VIEW_TOOL_NAME,
  );
  const closeTool = tools.tools.find(
    (tool) => tool.name === CLOSE_DURABLE_VIEW_TOOL_NAME,
  );
  const prepareTool = tools.tools.find((tool) => tool.name === PREPARE_VIEW_ACTION_TOOL_NAME);
  const finishTool = tools.tools.find((tool) => tool.name === FINISH_VIEW_ACTION_TOOL_NAME);
  assert.equal(showTool?._meta?.ui?.resourceUri, MCP_VIEW_RESOURCE_URI);
  assert.equal(showTool?.annotations?.readOnlyHint, true);
  assert.deepEqual(authorizeTool?._meta?.ui?.visibility, ["app"]);
  assert.deepEqual(bridgeTool?._meta?.ui?.visibility, ["app"]);
  assert.deepEqual(pollTool?._meta?.ui?.visibility, ["app"]);
  assert.deepEqual(closeTool?._meta?.ui?.visibility, ["app"]);
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
  assert.match(content.text, /id="authorization-backdrop"/);
  assert.match(content.text, /Trust this View with bundle data\?/);
  assert.match(
    content.text,
    /http-equiv="Content-Security-Policy"[\s\S]*connect-src 'none'[\s\S]*frame-src blob:/,
  );
  assert.match(content.text, /authorize_durable_view/);
  assert.match(content.text, /durable_view_bridge/);
  assert.match(content.text, /poll_durable_view/);
  assert.match(content.text, /close_durable_view/);
  assert.match(content.text, /prepare_view_action/);
  assert.match(content.text, /finish_view_action/);
  assert.match(content.text, /navigated away from its approved document/);
  assert.match(content.text, /script-src 'nonce-/);
  assert.match(content.text, /agentstate\.frame-size\.v1/);
  assert.match(content.text, /style-src 'unsafe-inline'/);
  const scriptStart = content.text.indexOf("<script>") + "<script>".length;
  const scriptEnd = content.text.lastIndexOf("</script>");
  assert.ok(scriptStart >= "<script>".length && scriptEnd > scriptStart);
  assert.doesNotThrow(() => new Function(content.text.slice(scriptStart, scriptEnd)));
  assert.deepEqual(content._meta?.ui?.csp?.frameDomains, ["blob:"]);
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

  const queried = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Open tasks",
      html: "<h1>Open tasks</h1>",
      query: { type: "Task", open: true, limit: 2 },
    },
  });
  assert.equal(queried.isError, undefined);
  assert.deepEqual(
    (queried.structuredContent as {
      selection: { objectIds: string[]; matchedCount: number };
    }).selection,
    {
      objectIds: ["tasks/gamma"],
      query: { type: "Task", open: true, limit: 2 },
      matchedCount: 1,
    },
  );
});

test("durable View execution preserves a UTF-8 BOM included in the approved bytes", async () => {
  const bundle = memoryBundle();
  await seed(bundle);
  const bytes = new Uint8Array([
    0xef,
    0xbb,
    0xbf,
    ...new TextEncoder().encode("<!doctype html><title>BOM View</title>"),
  ]);
  await writeBlob(bundle, "views/roadmap.html", bytes, "text/html; charset=utf-8");

  const payload = await resolveDurableViewLaunch(bundle, {
    viewId: "views-registry/roadmap",
  });

  assert.equal(payload.source.html.codePointAt(0), 0xfeff);
  assert.deepEqual(new TextEncoder().encode(payload.source.html), bytes);
});

test("registered Roadmap View runs from unchanged source through the authorized read-only bridge", async (t) => {
  const bundle = memoryBundle();
  await seed(bundle);
  const authorization = new SessionViewAuthorizationStore();
  const expectedSource = await readFile(
    new URL("../../../examples/views/roadmap.html", import.meta.url),
    "utf8",
  );
  const direct = await resolveDurableViewLaunch(
    bundle,
    { viewId: "views-registry/roadmap" },
    undefined,
    authorization,
  );
  assert.equal(direct.source.html, expectedSource);
  assert.equal(direct.source.entry, "views/roadmap.html");
  assert.equal(direct.launch.authorization.authorized, false);

  const server = createMcpAppServer({
    bundle,
    version: "test",
    bundleName: "Proof bundle",
    viewAuthorization: authorization,
  });
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
    arguments: { viewId: "views-registry/roadmap" },
  });
  assert.equal(shown.isError, undefined);
  const view = shown.structuredContent as {
    source: { html: string; contentVersion: string };
    launch: {
      launchId: string;
      authorization: { required: boolean; authorized: boolean };
    };
  };
  assert.equal(view.source.html, expectedSource);
  assert.equal(view.launch.authorization.required, true);
  assert.equal(view.launch.authorization.authorized, false);

  const beforeApproval = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: { bridge: "v0", type: "hello", id: "hello-before" },
    },
  });
  assert.deepEqual(
    (beforeApproval.structuredContent as {
      outcome: { reply: { error: { code: string } } };
    }).outcome.reply.error.code,
    "FORBIDDEN",
  );

  const approved = await client.callTool({
    name: AUTHORIZE_DURABLE_VIEW_TOOL_NAME,
    arguments: { launchId: view.launch.launchId },
  });
  assert.equal(approved.isError, undefined);
  const approvedView = (approved.structuredContent as {
    view: {
      source: { html: string; contentVersion: string };
      launch: { authorization: { authorized: boolean } };
    };
  }).view;
  assert.equal(approvedView.source.html, expectedSource);
  assert.equal(approvedView.source.contentVersion, view.source.contentVersion);
  assert.equal(approvedView.launch.authorization.authorized, true);

  const hello = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: { bridge: "v0", type: "hello", id: "hello" },
    },
  });
  assert.deepEqual(
    (hello.structuredContent as {
      outcome: {
        reply: {
          result: {
            bundle: { root: null; name: string };
            mode: string;
            grant: string;
          };
        };
      };
    }).outcome.reply.result,
    {
      bundle: { root: null, name: "Proof bundle" },
      mode: "local-mcp",
      protocol: "v0",
      grant: "read",
    },
  );

  const query = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: {
        bridge: "v0",
        type: "query",
        id: "tasks",
        params: { type: "Task", open: true, limit: 10 },
      },
    },
  });
  assert.deepEqual(
    (
      query.structuredContent as {
        outcome: { reply: { result: { rows: Array<{ id: string }> } } };
      }
    ).outcome.reply.result.rows.map((row) => row.id),
    ["tasks/alpha", "tasks/gamma"],
  );

  const read = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: { bridge: "v0", type: "read", id: "read", docId: "tasks/alpha" },
    },
  });
  assert.equal(
    (
      read.structuredContent as {
        outcome: { reply: { result: { body: string } } };
      }
    ).outcome.reply.result.body,
    "# Goal\n\nFirst task.",
  );

  const actionProtocol = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: {
        bridge: "v1",
        type: "read-versioned",
        id: "versioned",
        docId: "tasks/alpha",
      },
    },
  });
  assert.equal(
    (
      actionProtocol.structuredContent as {
        outcome: { reply: { error: { code: string } } };
      }
    ).outcome.reply.error.code,
    "FORBIDDEN",
  );

  const subscribed = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: { bridge: "v0", type: "subscribe", id: "subscribe" },
    },
  });
  assert.equal(
    (
      subscribed.structuredContent as {
        outcome: { subscribed: boolean };
      }
    ).outcome.subscribed,
    true,
  );
  const unchanged = await client.callTool({
    name: POLL_DURABLE_VIEW_TOOL_NAME,
    arguments: { launchId: view.launch.launchId },
  });
  assert.equal(
    (unchanged.structuredContent as { poll: { status: string } }).poll.status,
    "unchanged",
  );

  await writeDoc(bundle, {
    id: "tasks/alpha",
    frontmatter: { type: "Task", title: "Alpha", status: "done", timestamp: T },
    body: "# Goal\n\nCompleted during the proof.",
  });
  const changed = await client.callTool({
    name: POLL_DURABLE_VIEW_TOOL_NAME,
    arguments: { launchId: view.launch.launchId },
  });
  const change = (changed.structuredContent as {
    poll: {
      status: string;
      generation: string;
      message: { event: { changes: Array<{ id: string }> } };
    };
  }).poll;
  assert.equal(change.status, "change");
  assert.deepEqual(change.message.event.changes.map((entry) => entry.id), ["tasks/alpha"]);

  const replayed = await client.callTool({
    name: POLL_DURABLE_VIEW_TOOL_NAME,
    arguments: { launchId: view.launch.launchId },
  });
  assert.deepEqual(
    (replayed.structuredContent as { poll: unknown }).poll,
    change,
    "a change remains pending until the host acknowledges its generation",
  );
  const acknowledged = await client.callTool({
    name: POLL_DURABLE_VIEW_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      acknowledgeGeneration: change.generation,
    },
  });
  assert.equal(
    (acknowledged.structuredContent as { poll: { status: string } }).poll.status,
    "unchanged",
  );

  await writeBlob(
    bundle,
    "views/roadmap.html",
    new TextEncoder().encode("<!doctype html><p>changed source</p>"),
    "text/html; charset=utf-8",
  );
  const revoked = await client.callTool({
    name: DURABLE_VIEW_BRIDGE_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      request: { bridge: "v0", type: "hello", id: "stale" },
    },
  });
  assert.equal(
    (
      revoked.structuredContent as {
        outcome: { reply: { error: { code: string } } };
      }
    ).outcome.reply.error.code,
    "FORBIDDEN",
  );

  const closed = await client.callTool({
    name: CLOSE_DURABLE_VIEW_TOOL_NAME,
    arguments: { launchId: view.launch.launchId },
  });
  assert.deepEqual(closed.structuredContent, { closed: true });
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

test("a query-selected action refreshes the frozen selection instead of re-running the query", async (t) => {
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
      title: "First open task",
      html: "<p data-aslite-text='objects.0.frontmatter.status'></p>",
      query: { type: "Task", field: "status=todo", open: true, limit: 1 },
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
  const launch = shown.structuredContent as {
    selection: { objectIds: string[]; matchedCount: number };
    launch: { launchId: string; actions: Array<{ actionId: string }> };
  };
  assert.deepEqual(launch.selection.objectIds, ["tasks/alpha"]);
  assert.equal(launch.selection.matchedCount, 2);

  const prepared = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: launch.launch.launchId,
      actionId: launch.launch.actions[0]!.actionId,
    },
  });
  const approvalToken = (
    prepared.structuredContent as { result: { approvalToken?: string } }
  ).result.approvalToken;
  assert.ok(approvalToken);

  const finished = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: launch.launch.launchId,
      approvalToken,
      decision: "commit",
    },
  });
  const terminal = finished.structuredContent as {
    result: { status: string };
    view: {
      selection: { objectIds: string[]; matchedCount: number };
      objects: Array<{ id: string; frontmatter: Record<string, unknown> }>;
    };
  };
  assert.equal(terminal.result.status, "committed");
  assert.deepEqual(terminal.view.selection.objectIds, ["tasks/alpha"]);
  assert.equal(terminal.view.selection.matchedCount, 2);
  assert.equal(terminal.view.objects[0]?.id, "tasks/alpha");
  assert.equal(terminal.view.objects[0]?.frontmatter.status, "done");
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

test("a committed action keeps its receipt and retires the launch when a selected sibling vanished", async (t) => {
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
      title: "Task and roadmap",
      html: "<p>Selected objects</p>",
      objectIds: ["tasks/alpha", "roadmap-items/views"],
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
  const approvalToken = (
    prepared.structuredContent as { result: { status: string; approvalToken?: string } }
  ).result.approvalToken;
  assert.ok(approvalToken);
  await deleteDoc(bundle, "roadmap-items/views");

  const finished = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      approvalToken,
      decision: "commit",
    },
  });
  const terminal = finished.structuredContent as {
    result: { status: string; version?: string };
    view: unknown;
  };
  const persisted = await readDocVersioned(bundle, "tasks/alpha");
  assert.equal(finished.isError, undefined);
  assert.equal(terminal.result.status, "committed");
  assert.equal(terminal.result.version, persisted.version);
  assert.equal(persisted.doc.frontmatter.status, "done");
  assert.equal(persisted.doc.frontmatter.actor, "mike/test");
  assert.equal(terminal.view, null);

  const retired = await client.callTool({
    name: PREPARE_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      actionId: view.launch.actions[0]!.actionId,
    },
  });
  assert.equal(
    (retired.structuredContent as { result: { status: string } }).result.status,
    "rejected",
  );
});

test("a CAS conflict keeps its receipt and retires the launch when a selected sibling vanished", async (t) => {
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
      title: "Stale task and roadmap",
      html: "<p>Selected objects</p>",
      objectIds: ["tasks/alpha", "roadmap-items/views"],
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
  const approvalToken = (
    prepared.structuredContent as { result: { status: string; approvalToken?: string } }
  ).result.approvalToken;
  assert.ok(approvalToken);
  await writeDoc(bundle, {
    id: "tasks/alpha",
    frontmatter: { type: "Task", title: "Alpha", status: "todo", timestamp: T },
    body: "# Goal\n\nChanged elsewhere.",
  });
  await deleteDoc(bundle, "roadmap-items/views");

  const finished = await client.callTool({
    name: FINISH_VIEW_ACTION_TOOL_NAME,
    arguments: {
      launchId: view.launch.launchId,
      approvalToken,
      decision: "commit",
    },
  });
  const terminal = finished.structuredContent as {
    result: { status: string; version?: string };
    view: unknown;
  };
  assert.equal(finished.isError, undefined);
  assert.equal(terminal.result.status, "conflict");
  assert.equal(terminal.view, null);
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
      query: { type: "Task", field: "status=todo", limit: 1 },
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
    /outside this View's frozen object selection/,
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

test("resolve_launch redeems the one-shot claim ticket for an undelivered generated launch", async (t) => {
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

  // The tool exists and is app-only — never model-visible.
  const tools = await client.listTools();
  const resolveTool = tools.tools.find((tool) => tool.name === RESOLVE_LAUNCH_TOOL_NAME);
  assert.ok(resolveTool, "resolve_launch must be registered");
  assert.deepEqual(resolveTool._meta?.ui?.visibility, ["app"]);

  const shown = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: {
      title: "Recovery proof",
      html: "<p data-aslite-text=\"objects.0.id\"></p>",
      objectIds: ["tasks/alpha"],
    },
  });
  const shownPayload = shown.structuredContent;
  assert.ok(shownPayload && typeof shownPayload.launch?.launchId === "string");

  // A host-mangled toolCallId (Desktop's toolu_*) still redeems via most-recent fallback…
  const resolved = await client.callTool({
    name: RESOLVE_LAUNCH_TOOL_NAME,
    arguments: { toolCallId: "toolu_01DoesNotMatchTheWireId" },
  });
  assert.notEqual(resolved.isError, true);
  assert.equal(
    resolved.structuredContent?.launch?.launchId,
    shownPayload.launch.launchId,
    "resolve_launch must return the ALREADY-MINTED launch, not a new one",
  );

  // …and the ticket is one-shot.
  const second = await client.callTool({
    name: RESOLVE_LAUNCH_TOOL_NAME,
    arguments: {},
  });
  assert.equal(second.isError, true);
});

test("resolve_launch redeems a durable launch with its current authorization state", async (t) => {
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

  const shown = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: { viewId: "views-registry/roadmap" },
  });
  const shownPayload = shown.structuredContent;
  assert.equal(shownPayload?.schemaVersion, "agentstate.durable-view-launch.v1");

  const resolved = await client.callTool({ name: RESOLVE_LAUNCH_TOOL_NAME, arguments: {} });
  assert.notEqual(resolved.isError, true);
  const payload = resolved.structuredContent;
  assert.equal(payload?.schemaVersion, "agentstate.durable-view-launch.v1");
  assert.equal(payload?.launch?.launchId, shownPayload.launch.launchId);
  assert.equal(payload?.launch?.authorization?.authorized, false);
  assert.equal(payload?.source?.viewId, "views-registry/roadmap");
});

test("a failed show_view records no claim ticket", async (t) => {
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

  const failed = await client.callTool({
    name: SHOW_VIEW_TOOL_NAME,
    arguments: { viewId: "views-registry/does-not-exist" },
  });
  assert.equal(failed.isError, true);

  const resolved = await client.callTool({ name: RESOLVE_LAUNCH_TOOL_NAME, arguments: {} });
  assert.equal(resolved.isError, true, "no pending launch may be minted by a failed show_view");
});
