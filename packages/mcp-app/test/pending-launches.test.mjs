import assert from "node:assert/strict";
import { test } from "node:test";

import { PendingLaunchRegistry } from "../src/pending-launches.js";

test("redemption is exact-match one-shot; unknown claims fail closed, never fall back", () => {
  const registry = new PendingLaunchRegistry();
  registry.record("claim-a", "launch-a");
  registry.record("claim-b", "launch-b");

  assert.equal(
    registry.consume("claim-zz"),
    null,
    "an unknown claim must NEVER redeem another pending launch (PR #178 P1)",
  );

  const a = registry.consume("claim-a");
  assert.equal(a?.launchId, "launch-a");
  assert.equal(registry.consume("claim-a"), null, "a redeemed claim is void");

  const b = registry.consume("claim-b");
  assert.equal(b?.launchId, "launch-b");
  assert.equal(registry.size, 0);
});

test("the registry is bounded (oldest evicted) and entries expire by TTL", () => {
  let now = 0;
  const registry = new PendingLaunchRegistry(2, 1000, () => now);
  registry.record("claim-a", "launch-a");
  registry.record("claim-b", "launch-b");
  registry.record("claim-c", "launch-c");
  assert.equal(registry.consume("claim-a"), null, "evicted claims fail closed");
  assert.equal(registry.consume("claim-b")?.launchId, "launch-b");

  now = 5000;
  assert.equal(registry.consume("claim-c"), null, "expired claims fail closed");
  assert.equal(registry.size, 0);
});
