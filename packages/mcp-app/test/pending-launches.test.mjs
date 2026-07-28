import assert from "node:assert/strict";
import { test } from "node:test";

import { PendingLaunchRegistry } from "../src/pending-launches.js";

test("exact key match wins over recency, and consumption is one-shot", () => {
  const registry = new PendingLaunchRegistry();
  registry.record("1", "launch-a", "generated");
  registry.record("2", "launch-b", "durable");

  const byKey = registry.consume("1");
  assert.equal(byKey?.launchId, "launch-a");
  assert.equal(byKey?.kind, "generated");

  // The consumed entry is gone; only launch-b remains.
  const again = registry.consume("1");
  assert.equal(again?.launchId, "launch-b");
  assert.equal(registry.consume(), null);
});

test("an unknown key falls back to the most recent unconsumed entry (Desktop's toolu_* id)", () => {
  const registry = new PendingLaunchRegistry();
  registry.record("1", "launch-a", "generated");
  registry.record("2", "launch-b", "generated");

  const entry = registry.consume("toolu_01NotTheWireId");
  assert.equal(entry?.launchId, "launch-b");
  const next = registry.consume(null);
  assert.equal(next?.launchId, "launch-a");
});

test("the registry is bounded (oldest evicted) and entries expire by TTL", () => {
  let now = 0;
  const registry = new PendingLaunchRegistry(2, 1000, () => now);
  registry.record("1", "launch-a", "generated");
  registry.record("2", "launch-b", "generated");
  registry.record("3", "launch-c", "generated");
  // Bound of 2: launch-a was evicted, so exact key "1" cannot match — falls back to most recent.
  const fallback = registry.consume("1");
  assert.equal(fallback?.launchId, "launch-c");
  assert.equal(registry.size, 1);

  now = 5000;
  assert.equal(registry.consume(), null, "TTL expiry empties the registry");
});
