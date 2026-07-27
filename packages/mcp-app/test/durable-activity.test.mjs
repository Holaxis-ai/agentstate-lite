import assert from "node:assert/strict";
import { test } from "node:test";

import { mayForwardDurableActivity } from "../src/durable-activity.js";

test("a delayed bridge response cannot forward after its View is hidden", () => {
  const operationEpoch = 4;

  assert.equal(
    mayForwardDurableActivity({
      operationEpoch,
      currentEpoch: 5,
      visibilityState: "hidden",
      suspendedLaunchId: "launch-1",
    }),
    false,
  );
});

test("a delayed poll cannot forward or restart while suspension awaits retirement", () => {
  const operationEpoch = 4;

  assert.equal(
    mayForwardDurableActivity({
      operationEpoch,
      currentEpoch: 5,
      visibilityState: "visible",
      suspendedLaunchId: "launch-1",
    }),
    false,
  );
  assert.equal(
    mayForwardDurableActivity({
      operationEpoch,
      currentEpoch: 5,
      visibilityState: "visible",
      suspendedLaunchId: null,
    }),
    false,
    "clearing suspension cannot revive work from the previous epoch",
  );
});

test("only current visible unsuspended durable activity may forward", () => {
  assert.equal(
    mayForwardDurableActivity({
      operationEpoch: 5,
      currentEpoch: 5,
      visibilityState: "visible",
      suspendedLaunchId: null,
    }),
    true,
  );
});
