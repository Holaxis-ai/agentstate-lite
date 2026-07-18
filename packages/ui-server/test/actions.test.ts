import test from "node:test";
import assert from "node:assert/strict";

import {
  MemoryBackend,
  readBlob,
  readDocVersioned,
  writeBlob,
  writeDoc,
  writeDocVersioned,
  type Bundle,
} from "@agentstate-lite/core";
import { PageLaunchRegistry, TrustedActionService } from "../src/actions.js";

const T = "2026-07-18T12:00:00.000Z";
const HTML = new TextEncoder().encode("<!doctype html><button>done</button>");

async function fixture(actor: string | undefined = "mike/test") {
  const bundle: Bundle = { root: "mem://trusted-actions", backend: new MemoryBackend() };
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
    body: "",
  });
  await writeDoc(bundle, {
    id: "views-registry/actions",
    frontmatter: { type: "View", title: "Actions", entry: "views/actions.html", bridge: "bundle-propose", timestamp: T },
    body: "",
  });
  await writeBlob(bundle, "views/actions.html", HTML, "text/html; charset=utf-8");

  const registry = await readDocVersioned(bundle, "views-registry/actions");
  const blob = (await readBlob(bundle, "views/actions.html"))!;
  const launches = new PageLaunchRegistry();
  const launch = launches.mint({
    registryId: registry.doc.id,
    registryType: "View",
    registryVersion: registry.version,
    registryTitle: "Actions",
    entryKey: "views/actions.html",
    contentType: blob.contentType,
    contentVersion: blob.version,
    bytes: blob.bytes,
    capability: "bundle-propose",
  });
  return { bundle, launches, launch, service: new TrustedActionService(bundle, launches, actor) };
}

test("trusted action: human-confirmed scalar update uses hard CAS and returns the final receipt", async () => {
  const { bundle, launch, service } = await fixture();
  const before = await readDocVersioned(bundle, "tasks/alpha");
  const prepared = await service.prepare(launch.launchId, {
    kind: "document.set-field",
    docId: "tasks/alpha",
    field: "status",
    value: "done",
    expectedVersion: before.version,
  });
  assert.equal(prepared.status, "prepared");
  if (prepared.status !== "prepared") return;
  assert.deepEqual(
    { before: prepared.confirmation.before, after: prepared.confirmation.after, actor: prepared.confirmation.actor },
    { before: "todo", after: "done", actor: "mike/test" },
  );

  const committed = await service.commit(prepared.approvalToken);
  assert.equal(committed.status, "committed");
  const after = await readDocVersioned(bundle, "tasks/alpha");
  assert.equal(after.doc.frontmatter.status, "done");
  assert.equal(after.doc.frontmatter.actor, "mike/test");
  assert.equal(committed.version, after.version, "the receipt is the final persisted version");
  assert.equal((await service.commit(prepared.approvalToken)).status, "expired", "approval tokens are one-shot");
});

test("trusted action: target races conflict and changed View bytes revoke without retrying", async () => {
  const raced = await fixture();
  const target = await readDocVersioned(raced.bundle, "tasks/alpha");
  const prepared = await raced.service.prepare(raced.launch.launchId, {
    kind: "document.set-field",
    docId: "tasks/alpha",
    field: "status",
    value: "done",
    expectedVersion: target.version,
  });
  assert.equal(prepared.status, "prepared");
  if (prepared.status !== "prepared") return;
  await writeDocVersioned(
    raced.bundle,
    { ...target.doc, frontmatter: { ...target.doc.frontmatter, title: "Concurrent edit" } },
    { expectedVersion: target.version },
  );
  assert.equal((await raced.service.commit(prepared.approvalToken)).status, "conflict");

  const changedView = await fixture();
  const current = await readDocVersioned(changedView.bundle, "tasks/alpha");
  const viewPrepared = await changedView.service.prepare(changedView.launch.launchId, {
    kind: "document.set-field",
    docId: "tasks/alpha",
    field: "status",
    value: "done",
    expectedVersion: current.version,
  });
  assert.equal(viewPrepared.status, "prepared");
  if (viewPrepared.status !== "prepared") return;
  await writeBlob(changedView.bundle, "views/actions.html", new TextEncoder().encode("changed"), "text/html; charset=utf-8");
  assert.equal((await changedView.service.commit(viewPrepared.approvalToken)).status, "revoked");
  assert.equal((await readDocVersioned(changedView.bundle, "tasks/alpha")).doc.frontmatter.status, "todo");
});

test("trusted action: rejects absent actor, undeclared fields, and semantic no-ops", async () => {
  const noActor = await fixture("");
  const target = await readDocVersioned(noActor.bundle, "tasks/alpha");
  const action = { kind: "document.set-field", docId: "tasks/alpha", field: "status", value: "done", expectedVersion: target.version };
  assert.equal((await noActor.service.prepare(noActor.launch.launchId, action)).status, "rejected");

  const governed = await fixture();
  const governedTarget = await readDocVersioned(governed.bundle, "tasks/alpha");
  assert.equal(
    (await governed.service.prepare(governed.launch.launchId, { ...action, field: "surprise", expectedVersion: governedTarget.version })).status,
    "rejected",
  );
  const unchanged = await governed.service.prepare(governed.launch.launchId, {
    ...action,
    value: "todo",
    expectedVersion: governedTarget.version,
  });
  assert.equal(unchanged.status, "unchanged");
  assert.equal(governed.service.size(), 0);
});
