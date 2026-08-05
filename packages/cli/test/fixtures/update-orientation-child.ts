import { EventEmitter } from "node:events";
import { readSync } from "node:fs";

import {
  claimUpdateLease,
  runPassiveUpdateOrientation,
} from "../../src/update-orientation.js";

const home = process.env.ASLITE_TEST_HOME!;
const mode = process.env.ASLITE_TEST_MODE!;
const now = new Date(process.env.ASLITE_TEST_NOW!);
const token = process.env.ASLITE_TEST_TOKEN!;

function send(message: unknown): void {
  process.send?.(message);
}

function finish(message: unknown): void {
  process.send?.(message, () => process.disconnect?.());
}

function barrier(label: string): void {
  send({ type: label });
  const byte = Buffer.alloc(1);
  readSync(4, byte, 0, 1, null);
}

class SilentChild extends EventEmitter {
  unref(): void {}
}

process.once("message", (message) => {
  if (message !== "go") return;
  if (mode === "claim") {
    const result = claimUpdateLease({ home, now, token });
    finish({ type: "result", state: result.state });
  } else if (mode === "stale") {
    const result = claimUpdateLease({
      home,
      now,
      token,
      beforeStaleReplace: () => barrier("before-stale-replace"),
    });
    finish({ type: "result", state: result.state });
  } else if (mode === "paused-parent") {
    let spawns = 0;
    const notice = runPassiveUpdateOrientation({
      home,
      runningVersion: "0.1.0-pre.3",
      now: () => now,
      token: () => token,
      executablePath: () => "/opt/aslite/dist/agentstate-lite.mjs",
      afterInitialCacheRead: () => barrier("after-initial-cache-read"),
      spawn: () => {
        spawns += 1;
        return new SilentChild();
      },
    });
    finish({ type: "result", state: "done", spawns, notice });
  }
});
