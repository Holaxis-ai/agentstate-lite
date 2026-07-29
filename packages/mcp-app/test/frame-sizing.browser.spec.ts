import { readFile } from "node:fs/promises";

import { expect, test, type Frame, type Page } from "@playwright/test";

import {
  FRAME_SIZE_MESSAGE_TYPE,
  appendFrameSizingScript,
  createFrameSizingSession,
} from "../src/frame-sizing.ts";

interface AppliedHeightReport {
  height: number;
  iframeHeight: number;
}

async function generatedFrame(page: Page): Promise<Frame> {
  await expect
    .poll(() => page.frames().filter((frame) => frame !== page.mainFrame()).length)
    .toBe(1);
  const frame = page
    .frames()
    .find((candidate) => candidate !== page.mainFrame());
  if (!frame) throw new Error("Expected one generated View frame.");
  return frame;
}

test("a flexible parent can apply growth and still receive intrinsic shrink", async ({
  page,
}) => {
  const session = createFrameSizingSession(
    "browser-feedback-loop",
    1,
    "0123456789abcdef0123456789abcdef",
  );
  const source = appendFrameSizingScript(
    `<!doctype html><html><head><style>
      html, body { margin: 0; padding: 0; }
      #content { height: 150px; }
    </style></head><body><main id="content"></main></body></html>`,
    session,
  );

  await page.setContent(`<!doctype html><html><body>
    <iframe id="generated-view" style="display:block;width:400px;height:150px;border:0"></iframe>
  </body></html>`);
  await page.evaluate(
    ({ html, messageType }) => {
      const frame = document.querySelector<HTMLIFrameElement>("#generated-view");
      if (!frame) throw new Error("Missing generated View frame.");
      window.__appliedHeightReports = [];
      window.addEventListener("message", (event) => {
        if (event.source !== frame.contentWindow || event.data?.type !== messageType) {
          return;
        }
        frame.style.height = `${event.data.height}px`;
        window.__appliedHeightReports.push({
          height: event.data.height,
          iframeHeight: frame.getBoundingClientRect().height,
        });
      });
      frame.srcdoc = html;
    },
    { html: source, messageType: FRAME_SIZE_MESSAGE_TYPE },
  );

  const child = await generatedFrame(page);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window.__appliedHeightReports as AppliedHeightReport[] | undefined
          )?.at(-1)?.height,
      ),
    )
    .toBe(150);

  await child.locator("#content").evaluate((element) => {
    element.style.height = "900px";
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window.__appliedHeightReports as AppliedHeightReport[] | undefined
          )?.at(-1)?.height,
      ),
    )
    .toBe(900);

  await child.locator("#content").evaluate((element) => {
    element.style.height = "180px";
  });
  await page.waitForTimeout(200);
  expect(
    await page.evaluate(() => {
      const frame =
        document.querySelector<HTMLIFrameElement>("#generated-view");
      const documentElement = frame?.contentDocument?.documentElement;
      const body = frame?.contentDocument?.body;
      const content =
        frame?.contentDocument?.querySelector<HTMLElement>("#content");
      return {
        reports: window.__appliedHeightReports,
        iframeHeight: frame?.getBoundingClientRect().height,
        htmlScrollHeight: documentElement?.scrollHeight,
        bodyScrollHeight: body?.scrollHeight,
        htmlBounds: documentElement?.getBoundingClientRect().height,
        bodyBounds: body?.getBoundingClientRect().height,
        contentBounds: content?.getBoundingClientRect().height,
      };
    }),
  ).toEqual({
      reports: [
        { height: 150, iframeHeight: 150 },
        { height: 900, iframeHeight: 900 },
        { height: 180, iframeHeight: 180 },
      ],
      iframeHeight: 180,
      htmlScrollHeight: 180,
      bodyScrollHeight: 180,
      htmlBounds: 180,
      bodyBounds: 180,
      contentBounds: 180,
  });
});

test("a hidden first mount and a visible remount size without interaction", async ({
  page,
}) => {
  const instrument = (launchId: string, epoch: number) =>
    appendFrameSizingScript(
      `<!doctype html><html><head><style>
        html, body { margin: 0; padding: 0; }
        main { height: 220px; }
      </style></head><body><main></main></body></html>`,
      createFrameSizingSession(
        launchId,
        epoch,
        `${String(epoch).padStart(32, "0")}`,
      ),
    );
  const firstSource = instrument("hidden-first-mount", 1);
  const remountSource = instrument("visible-remount", 2);

  await page.setContent(`<!doctype html><html><body>
    <section id="slot" hidden></section>
    <script>
      window.__mountReports = [];
      window.addEventListener("message", (event) => {
        if (event.data?.type !== ${JSON.stringify(FRAME_SIZE_MESSAGE_TYPE)}) return;
        const frame = document.querySelector("#generated-view");
        if (event.source !== frame?.contentWindow) return;
        frame.style.height = event.data.height + "px";
        window.__mountReports.push({
          launchId: event.data.launchId,
          height: event.data.height
        });
      });
    </script>
  </body></html>`);

  await page.evaluate((html) => {
    const slot = document.querySelector<HTMLElement>("#slot");
    if (!slot) throw new Error("Missing mount slot.");
    const frame = document.createElement("iframe");
    frame.id = "generated-view";
    frame.style.cssText = "display:block;width:400px;height:1px;border:0";
    frame.srcdoc = html;
    slot.append(frame);
  }, firstSource);
  await page.locator("#slot").evaluate((slot) => {
    slot.hidden = false;
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window.__mountReports as
              | Array<{ launchId: string; height: number }>
              | undefined
          )?.at(-1),
      ),
    )
    .toEqual({ launchId: "hidden-first-mount", height: 220 });

  await page.evaluate((html) => {
    const previous =
      document.querySelector<HTMLIFrameElement>("#generated-view");
    previous?.remove();
    const frame = document.createElement("iframe");
    frame.id = "generated-view";
    frame.style.cssText = "display:block;width:400px;height:1px;border:0";
    frame.srcdoc = html;
    document.querySelector("#slot")?.append(frame);
  }, remountSource);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window.__mountReports as
              | Array<{ launchId: string; height: number }>
              | undefined
          )?.at(-1),
      ),
    )
    .toEqual({ launchId: "visible-remount", height: 220 });
});

test("a 288px fixed host has no outer scroll and keeps child scrolling", async ({
  browser,
}) => {
  const page = await browser.newPage({
    viewport: { width: 640, height: 288 },
  });
  const viewHtml = await readFile(
    new URL("../src/view.html", import.meta.url),
    "utf8",
  );
  await page.setContent(
    viewHtml.replace("<!-- ASLITE_MCP_APP_SCRIPT -->", ""),
  );
  await page.evaluate(() => {
    document.documentElement.dataset.fixedHeight = "true";
    const frame =
      document.querySelector<HTMLIFrameElement>("#generated-view");
    if (!frame) throw new Error("Missing generated View frame.");
    frame.srcdoc = `<!doctype html><html><head><style>
      html, body { margin: 0; }
      main { height: 1200px; }
    </style></head><body><main>long content</main></body></html>`;
  });
  const child = await generatedFrame(page);

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollHeight))
    .toBe(288);
  const fixedLayout = await page.evaluate(() => ({
    outerClientHeight: document.documentElement.clientHeight,
    outerScrollHeight: document.documentElement.scrollHeight,
    shellHeight:
      document.querySelector(".shell")?.getBoundingClientRect().height,
    frameHeight:
      document.querySelector("#generated-view")?.getBoundingClientRect().height,
  }));
  expect(fixedLayout.outerClientHeight).toBe(288);
  expect(fixedLayout.outerScrollHeight).toBe(288);
  expect(fixedLayout.shellHeight).toBe(288);
  expect(fixedLayout.frameHeight).toBeCloseTo(235.89, 1);
  await expect
    .poll(() =>
      child.evaluate(() => ({
        clientHeight: document.documentElement.clientHeight,
        scrollHeight: document.documentElement.scrollHeight,
      })),
    )
    .toEqual({ clientHeight: 236, scrollHeight: 1200 });

  await child.evaluate(() => window.scrollTo(0, 400));
  await expect
    .poll(() => child.evaluate(() => document.documentElement.scrollTop))
    .toBe(400);
  expect(await page.evaluate(() => document.documentElement.scrollTop)).toBe(0);
  await page.close();
});

declare global {
  interface Window {
    __appliedHeightReports?: AppliedHeightReport[];
    __mountReports?: Array<{ launchId: string; height: number }>;
  }
}
