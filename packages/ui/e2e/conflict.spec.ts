/**
 * The CAS-conflict path (plans/ui-v1.md rev 2 Views §1 / rev 3.2's B2 scope): two clients
 * racing a status change on the SAME task -> one write wins, the loser gets a 412 and must
 * show the recoverable Refresh/Retry UI, never a crash or a silently-lost update.
 *
 * The race is made DETERMINISTIC (not a hope-it-flakes-the-right-way timing bet): page A's
 * read of the doc (the mutation's read-mutate-write "read" half) is held in-flight via route
 * interception until page B's own full cycle has completed and moved the version forward, so
 * A's `PUT If-Match` is guaranteed stale.
 */
import { test, expect } from "@playwright/test";
import { bootUiOverDirBundle } from "./harness.js";

const SEED = [{ id: "tasks/alpha", frontmatter: { type: "Task", title: "Ship the thing", status: "todo" }, body: "Do the thing." }];

test("two racing status changes: the loser gets a 412 and recovers via Refresh", async ({ browser }) => {
  const instance = await bootUiOverDirBundle(SEED);
  try {
    const [contextA, contextB] = await Promise.all([browser.newContext(), browser.newContext()]);
    const [pageA, pageB] = await Promise.all([contextA.newPage(), contextB.newPage()]);
    await Promise.all([pageA.goto(instance.url), pageB.goto(instance.url)]);

    const docGetUrl = "**/v0/bundles/default/docs/tasks/alpha";
    await pageA.route(docGetUrl, async (route) => {
      if (route.request().method() !== "GET") return route.continue();
      const response = await route.fetch(); // the real request/response, at the real moment in time
      await new Promise((resolve) => setTimeout(resolve, 400)); // hold delivery so B's write lands first
      await route.fulfill({ response });
    });

    const selectA = pageA.locator('.board-card[data-doc-id="tasks/alpha"] select');
    const selectB = pageB.locator('.board-card[data-doc-id="tasks/alpha"] select');

    const aRequestSent = pageA.waitForRequest((req) => req.url().includes("/docs/tasks/alpha") && req.method() === "GET");
    await selectA.selectOption("in_progress"); // A's read starts, then stalls in the route handler above
    await aRequestSent;
    await selectB.selectOption("done"); // B's full cycle runs unimpeded and wins

    await expect(pageA.locator('.board-card[data-doc-id="tasks/alpha"] [data-testid="conflict-banner"]')).toBeVisible();
    await expect(pageB.locator('.board-column[aria-label="Done"]').locator('.board-card[data-doc-id="tasks/alpha"]')).toBeVisible();

    await pageA.locator('.board-card[data-doc-id="tasks/alpha"] [data-testid="conflict-banner"] button:has-text("Refresh")').click();
    await expect(pageA.locator('.board-card[data-doc-id="tasks/alpha"] [data-testid="conflict-banner"]')).toHaveCount(0);
    await expect(pageA.locator('.board-column[aria-label="Done"]').locator('.board-card[data-doc-id="tasks/alpha"]')).toBeVisible();
  } finally {
    await instance.cleanup();
  }
});
