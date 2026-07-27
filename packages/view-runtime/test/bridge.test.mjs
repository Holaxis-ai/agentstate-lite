import test from "node:test";
import assert from "node:assert/strict";
import {
  parseBridgeRequest,
  SessionViewAuthorizationStore,
} from "../dist/index.js";

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
