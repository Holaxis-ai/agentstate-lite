import assert from "node:assert/strict";
import { test } from "node:test";

import {
  RecoveryGuard,
  extractViewPayload,
  firstResultText,
} from "../src/result-recovery.js";

const generatedPayload = {
  schemaVersion: "agentstate.view-launch.v1",
  title: "Generated",
  presentation: { html: "<p>x</p>", css: "", contentHash: "h" },
  selection: { objectIds: ["tasks/a"] },
  objects: [],
  launch: { launchId: "launch-1", actions: [] },
};

const durablePayload = {
  schemaVersion: "agentstate.durable-view-launch.v1",
  title: "Board",
  source: {
    viewId: "pages-registry/board",
    entry: "pages/board.html",
    html: "<!doctype html>",
    contentType: "text/html",
    contentVersion: "v1",
  },
  launch: { launchId: "launch-2", authorization: { required: true, authorized: true } },
};

test("extractViewPayload finds both schemas, direct or nested under .view", () => {
  assert.equal(extractViewPayload({ structuredContent: generatedPayload }), generatedPayload);
  assert.equal(extractViewPayload({ structuredContent: durablePayload }), durablePayload);
  assert.equal(
    extractViewPayload({ structuredContent: { view: durablePayload } }),
    durablePayload,
  );
});

test("extractViewPayload yields nothing for junk, absent structuredContent, or partial payloads", () => {
  assert.equal(extractViewPayload(undefined), null);
  assert.equal(extractViewPayload({ content: [] }), null);
  assert.equal(extractViewPayload({ structuredContent: { schemaVersion: "other" } }), null);
  const { source, ...durableWithoutSource } = durablePayload;
  assert.equal(extractViewPayload({ structuredContent: durableWithoutSource }), null);
});

test("error results NEVER yield a payload — recovery must not fire for them", () => {
  assert.equal(
    extractViewPayload({ isError: true, structuredContent: generatedPayload }),
    null,
  );
});

test("firstResultText surfaces the server's prose, skipping non-text parts", () => {
  assert.equal(
    firstResultText({
      content: [{ type: "image" }, { type: "text", text: "" }, { type: "text", text: "why" }],
    }),
    "why",
  );
  assert.equal(firstResultText({ content: [] }), null);
  assert.equal(firstResultText(null), null);
});

test("RecoveryGuard enforces a hard per-instance attempt cap", () => {
  const guard = new RecoveryGuard(2);
  assert.equal(guard.tryAcquire(), true);
  assert.equal(guard.tryAcquire(), true);
  assert.equal(guard.tryAcquire(), false);
  assert.equal(guard.tryAcquire(), false, "the cap never re-arms");
});
