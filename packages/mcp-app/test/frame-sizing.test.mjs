import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { JSDOM } from "jsdom";

import {
  DEFAULT_MAX_FRAME_HEIGHT,
  FRAME_SIZE_MESSAGE_TYPE,
  appendFrameSizingScript,
  clampFrameHeight,
  createFrameSizingSession,
  measureShellChromeHeight,
  readFrameSizeEvent,
  readFrameSizeMessage,
} from "../src/frame-sizing.js";

const session = createFrameSizingSession(
  "launch-current",
  7,
  "0123456789abcdef0123456789abcdef",
);

test("the injected observer reports initial and live intrinsic height with mount identity", () => {
  const source = `<!doctype html><html><body>
    <main>content</main>
    <script>
      window.__height = 42.2;
      document.documentElement.getBoundingClientRect = () => ({ height: window.__height });
      window.requestAnimationFrame = (callback) => { callback(); return 1; };
      window.__messages = [];
      window.parent.postMessage = (message) => window.__messages.push(message);
      window.ResizeObserver = class {
        constructor(callback) { window.__resize = callback; }
        observe() {}
      };
    </script>
  </body></html>`;
  const instrumented = appendFrameSizingScript(source, session);
  const browser = new JSDOM(instrumented, { runScripts: "dangerously" });

  assert.deepEqual(JSON.parse(JSON.stringify(browser.window.__messages)), [
    {
      type: FRAME_SIZE_MESSAGE_TYPE,
      launchId: session.launchId,
      epoch: session.epoch,
      nonce: session.nonce,
      height: 43,
    },
  ]);

  browser.window.__height = 88.1;
  browser.window.__resize();
  assert.equal(browser.window.__messages.at(-1).height, 89);

  browser.window.__height = 144.4;
  browser.window.dispatchEvent(new browser.window.Event("resize"));
  assert.equal(
    browser.window.__messages.at(-1).height,
    145,
    "viewport-driven reflow is measured through the window resize path",
  );

  browser.window.__height = 51.1;
  browser.window.__resize();
  assert.equal(
    browser.window.__messages.at(-1).height,
    52,
    "content shrink is reported as well as growth",
  );

  browser.window.__resize();
  assert.equal(
    browser.window.__messages.length,
    4,
    "unchanged measurements are not re-posted",
  );
});

test("size messages are accepted only for the exact launch, epoch, and nonce", () => {
  const accepted = {
    type: FRAME_SIZE_MESSAGE_TYPE,
    launchId: session.launchId,
    epoch: session.epoch,
    nonce: session.nonce,
    height: 200.1,
  };
  assert.deepEqual(readFrameSizeMessage(accepted, session), {
    kind: "accepted",
    height: 201,
  });
  assert.deepEqual(readFrameSizeMessage({ type: "bridge", height: 200 }, session), {
    kind: "other",
  });

  for (const message of [
    { ...accepted, launchId: "launch-stale" },
    { ...accepted, epoch: session.epoch - 1 },
    { ...accepted, nonce: "fedcba9876543210fedcba9876543210" },
    { ...accepted, height: 0 },
    { ...accepted, height: -1 },
    { ...accepted, height: Number.NaN },
    { ...accepted, height: Number.POSITIVE_INFINITY },
    { ...accepted, height: "200" },
  ]) {
    assert.deepEqual(readFrameSizeMessage(message, session), { kind: "invalid" });
  }
});

test("size events must come from the currently mounted child window", () => {
  const expectedSource = {};
  const accepted = {
    type: FRAME_SIZE_MESSAGE_TYPE,
    launchId: session.launchId,
    epoch: session.epoch,
    nonce: session.nonce,
    height: 200,
  };

  assert.deepEqual(
    readFrameSizeEvent(
      accepted,
      expectedSource,
      expectedSource,
      session,
      session.epoch,
    ),
    { kind: "accepted", height: 200 },
  );
  assert.deepEqual(
    readFrameSizeEvent(accepted, {}, expectedSource, session, session.epoch),
    { kind: "invalid" },
  );
  assert.deepEqual(
    readFrameSizeEvent(
      accepted,
      expectedSource,
      expectedSource,
      session,
      session.epoch + 1,
    ),
    { kind: "invalid" },
    "retiring the mount epoch invalidates its otherwise matching size session",
  );
  assert.deepEqual(
    readFrameSizeEvent(
      { type: "bridge", height: 200 },
      {},
      expectedSource,
      session,
      session.epoch,
    ),
    { kind: "other" },
  );
});

test("shell chrome uses intrinsic shell geometry, never the fixed host viewport floor", () => {
  const fixedHostViewport = 600;
  const frameHeight = 288;
  const shellHeight = 341;

  assert.equal(fixedHostViewport - frameHeight, 312);
  assert.equal(
    measureShellChromeHeight(shellHeight, frameHeight),
    53,
    "unused fixed-host viewport space is not charged as shell chrome",
  );
  assert.equal(
    clampFrameHeight(500, {
      hostHeightLimit: fixedHostViewport,
      shellChromeHeight: measureShellChromeHeight(shellHeight, frameHeight),
    }),
    500,
    "the old 18rem frame can grow when the fixed host has room",
  );
  assert.equal(measureShellChromeHeight(Number.NaN, frameHeight), 0);
});

test("generated size reports are handled before the hidden-document bridge gate", async () => {
  const source = await readFile(
    new URL("../src/view.ts", import.meta.url),
    "utf8",
  );
  const handlerStart = source.indexOf('window.addEventListener("message"');
  const handlerEnd = source.indexOf(
    'document.addEventListener("visibilitychange"',
    handlerStart,
  );
  const handler = source.slice(handlerStart, handlerEnd);

  assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
  assert.ok(
    handler.indexOf("if (frameSizingSession)") <
      handler.indexOf('document.visibilityState === "hidden"'),
    "layout-only reports must update generated Views while hidden; only the durable bridge is gated",
  );
  assert.match(
    source.slice(handlerEnd),
    /frameEpoch\+\+;\s+resetFrameSizing\(\);\s+stopPolling\(\);/,
    "suspended durable mounts invalidate their sizing session with their bridge epoch",
  );
});

test("height is capped by both the host and the product ceiling after shell chrome", () => {
  assert.equal(clampFrameHeight(120.1), 121);
  assert.equal(clampFrameHeight(100_000), DEFAULT_MAX_FRAME_HEIGHT);
  assert.equal(
    clampFrameHeight(2_000, {
      hostHeightLimit: 800,
      shellChromeHeight: 125.2,
    }),
    674,
  );
  assert.equal(
    clampFrameHeight(200, {
      hostHeightLimit: 100,
      shellChromeHeight: 500,
    }),
    1,
  );
  assert.equal(
    clampFrameHeight(200, {
      hostHeightLimit: Number.NaN,
      shellChromeHeight: Number.NaN,
    }),
    200,
  );
});

test("the product observer is inserted inside a valid body without rewriting source bytes", () => {
  const source = "<!doctype html><html><body><p>exact</p></body></html>";
  const instrumented = appendFrameSizingScript(source, session);

  assert.ok(instrumented.startsWith("<!doctype html><html><body><p>exact</p>"));
  assert.ok(instrumented.endsWith("</body></html>"));
  assert.match(instrumented, new RegExp(FRAME_SIZE_MESSAGE_TYPE));
  assert.ok(
    instrumented.indexOf("<script") > instrumented.indexOf("<p>exact</p>"),
  );
  assert.ok(instrumented.indexOf("<script") < instrumented.indexOf("</body>"));
});
