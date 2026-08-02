import test from "node:test";
import assert from "node:assert/strict";
import {
  BridgeService,
  PageBridgeLaunchAuthority,
  PageLaunchRegistry,
  parseBridgeRequest,
  mintTransientViewLaunch,
  pageLaunchAuthorizationSubject,
  SessionViewAuthorizationStore,
} from "../dist/index.js";
import {
  MemoryBackend,
  writeDoc,
} from "@agentstate-lite/core";

test("bridge parser admits only exact bounded requests", () => {
  assert.deepEqual(
    parseBridgeRequest({
      bridge: "v0",
      type: "query",
      id: "q1",
      params: { type: "Task", open: true, limit: 25 },
    }),
    {
      bridge: "v0",
      type: "query",
      id: "q1",
      params: { type: "Task", open: true, limit: 25 },
    },
  );
  assert.equal(
    parseBridgeRequest({
      bridge: "v0",
      type: "query",
      id: "q1",
      params: {},
      unexpected: true,
    }),
    null,
  );
  assert.equal(
    parseBridgeRequest({
      bridge: "v0",
      type: "query",
      id: "q1",
      params: { limit: 501 },
    }),
    null,
  );
  assert.equal(
    parseBridgeRequest({
      bridge: "v1",
      type: "read-versioned",
      id: "r1",
      docId: "../outside",
    })?.docId,
    "../outside",
    "concept-id safety remains the backend's single authority; the bridge only bounds transport",
  );
  assert.deepEqual(
    parseBridgeRequest({
      bridge: "v0",
      type: "render-document",
      id: "render-1",
      docId: "docs/one",
    }),
    {
      bridge: "v0",
      type: "render-document",
      id: "render-1",
      docId: "docs/one",
    },
  );
  assert.equal(
    parseBridgeRequest({
      bridge: "v0",
      type: "render-document",
      id: "render-1",
      docId: "docs/one",
      html: "<p>caller supplied</p>",
    }),
    null,
    "callers cannot inject presentation bytes into a document render",
  );
});

test("session authorization keys approval to the complete active-View subject", async () => {
  const store = new SessionViewAuthorizationStore();
  const subject = {
    sourceKind: "registered",
    registryId: "views-registry/a",
    contentVersion: "sha256:a",
    contentType: "text/html; charset=utf-8",
    capability: "bundle-read",
    execution: "active",
    policyVersion: "active-view-v1",
  };
  assert.equal(await store.isAuthorized(subject), false);
  await store.authorize(subject);
  assert.equal(await store.isAuthorized(subject), true);
  assert.equal(
    await store.isAuthorized({ ...subject, capability: "bundle-propose" }),
    false,
  );
});

test("transient active Views have exact-byte identity and process-local authorization", async () => {
  const bundle = { root: "mem://transient-view", backend: new MemoryBackend() };
  const launches = new PageLaunchRegistry();
  const authorizations = new SessionViewAuthorizationStore();
  const launch = mintTransientViewLaunch(bundle, launches, {
    title: "Transient proof",
    html: "<!doctype html><script>parent.postMessage({bridge:'v0',type:'hello',id:'h'}, '*')</script>",
  });
  assert.equal(launch.sourceKind, "transient");
  assert.equal(launch.bundleIdentity, bundle.root);
  assert.match(launch.contentVersion, /^sha256:/);
  assert.equal("registryId" in launch, false, "transient identity never fabricates a registry id");

  const authority = new PageBridgeLaunchAuthority(
    bundle,
    launches,
    new SessionViewAuthorizationStore(),
    authorizations,
  );
  assert.equal(await authority.resolve(launch.launchId, true), null);
  await authorizations.authorize(pageLaunchAuthorizationSubject(launch));
  assert.deepEqual(await authority.resolve(launch.launchId, true), {
    launchId: launch.launchId,
    capability: "bundle-read",
  });

  const differentBundle = {
    root: "mem://different-bundle",
    backend: new MemoryBackend(),
  };
  const wrongAuthority = new PageBridgeLaunchAuthority(
    differentBundle,
    launches,
    new SessionViewAuthorizationStore(),
    authorizations,
  );
  assert.equal(await wrongAuthority.resolve(launch.launchId, true), null);
});

test("bridge polling retains a bounded change until acknowledgement and stays read-only when configured", async () => {
  const bundle = { root: "mem://bridge-poll", backend: new MemoryBackend() };
  await writeDoc(bundle, {
    id: "tasks/one",
    frontmatter: {
      type: "Task",
      title: "One",
      status: "todo",
      timestamp: "2026-07-26T12:00:00.000Z",
    },
    body: "",
  });
  let current = true;
  const launches = {
    async resolve(launchId, requireAuthorization) {
      return launchId === "launch" && current && requireAuthorization
        ? { launchId, capability: "bundle-read" }
        : null;
    },
    revoke() {
      current = false;
    },
  };
  const bridge = new BridgeService({
    bundle,
    launches,
    config: async () => ({ root: null, name: "Test", mode: "test" }),
    renderDocument: ({ body }) => ({ html: body, bounded: false }),
    allowActionProtocol: false,
    enablePolling: true,
  });

  const rejectedActionRead = await bridge.handle("launch", {
    bridge: "v1",
    type: "read-versioned",
    id: "action",
    docId: "tasks/one",
  });
  assert.equal(rejectedActionRead.reply.error.code, "FORBIDDEN");

  const subscribed = await bridge.handle("launch", {
    bridge: "v0",
    type: "subscribe",
    id: "subscribe",
  });
  assert.equal(subscribed.subscribed, true);
  assert.deepEqual(await bridge.poll("launch"), { status: "unchanged" });

  await writeDoc(bundle, {
    id: "tasks/one",
    frontmatter: {
      type: "Task",
      title: "One",
      status: "done",
      timestamp: "2026-07-26T12:01:00.000Z",
    },
    body: "",
  });
  const changed = await bridge.poll("launch");
  assert.equal(changed.status, "change");
  assert.deepEqual(changed.message.event.changes.map((entry) => entry.id), ["tasks/one"]);
  assert.deepEqual(
    await bridge.poll("launch"),
    changed,
    "delivery failure cannot silently advance the server-owned baseline",
  );
  assert.deepEqual(
    await bridge.poll("launch", changed.generation),
    { status: "unchanged" },
  );
  assert.deepEqual(await bridge.poll("launch", changed.generation), {
    status: "reload-required",
    message: "the View poll acknowledgement did not match the pending generation",
  });
  assert.equal(current, false);
});

test("render-document reads one canonical version, bounds it, and revalidates the launch", async () => {
  const bundle = { root: "mem://bridge-render", backend: new MemoryBackend() };
  await writeDoc(bundle, {
    id: "docs/one",
    frontmatter: { type: "Doc", title: "One", timestamp: "2026-08-02T00:00:00.000Z" },
    body: "# One\n\nBody",
  });
  let current = true;
  let revokeDuringRender = false;
  const calls = [];
  const bridge = new BridgeService({
    bundle,
    launches: {
      async resolve(launchId) {
        return launchId === "launch" && current
          ? { launchId, capability: "bundle-read" }
          : null;
      },
      revoke() {
        current = false;
      },
    },
    config: async () => ({ root: null, name: "Test", mode: "test" }),
    renderDocument(document) {
      calls.push(document);
      if (revokeDuringRender) current = false;
      return { html: `<article>${document.body}</article>`, bounded: false };
    },
  });

  const rendered = await bridge.handle("launch", {
    bridge: "v0",
    type: "render-document",
    id: "render",
    docId: "docs/one",
  });
  assert.deepEqual(calls, [{ id: "docs/one", body: "# One\n\nBody" }]);
  assert.deepEqual(rendered.reply.result.document.id, "docs/one");
  assert.match(rendered.reply.result.document.version, /^sha256:/);
  assert.equal(rendered.reply.result.html, "<article># One\n\nBody</article>");
  assert.equal(rendered.reply.result.bounded, false);

  const missing = await bridge.handle("launch", {
    bridge: "v0",
    type: "render-document",
    id: "missing",
    docId: "docs/missing",
  });
  assert.equal(missing.reply.error.code, "NOT_FOUND");
  assert.doesNotMatch(JSON.stringify(missing.reply), /ENOENT|mem:\/\//);

  revokeDuringRender = true;
  const revoked = await bridge.handle("launch", {
    bridge: "v0",
    type: "render-document",
    id: "revoked",
    docId: "docs/one",
  });
  assert.equal(revoked.reply.error.code, "REVOKED");
  assert.doesNotMatch(JSON.stringify(revoked.reply), /<article>/);
});
