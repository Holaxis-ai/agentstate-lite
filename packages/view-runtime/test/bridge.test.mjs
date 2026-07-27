import test from "node:test";
import assert from "node:assert/strict";
import {
  BridgeService,
  parseBridgeRequest,
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
});

test("session authorization keys approval to the complete active-View subject", async () => {
  const store = new SessionViewAuthorizationStore();
  const subject = {
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
