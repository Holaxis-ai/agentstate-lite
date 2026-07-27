import assert from "node:assert/strict";
import { test } from "node:test";

import { FrameLoadGuard } from "../dist/frame-load-guard.js";

test("only the programmed mount load is accepted; later iframe navigation is rejected", () => {
  const guard = new FrameLoadGuard();

  guard.expectNext();
  assert.equal(guard.accept(), true, "the shell-authored blob mount consumes the one expected load");
  assert.equal(guard.accept(), false, "a self-navigation in the same iframe is not trusted");

  guard.expectNext();
  guard.reset();
  assert.equal(guard.accept(), false, "retiring a payload also retires its pending load");
});
