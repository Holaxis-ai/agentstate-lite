/**
 * Board smoke spec, run against BOTH modes (rev 3.2: "`--dir` over a temp bundle; `--remote` ->
 * a local reference `serve` instance, keyless"). Each `test.describe` block boots its own
 * process per test (simpler and more robust than sharing across tests — a hung/killed process
 * in one test can't leak into the next).
 */
import { test, expect } from "@playwright/test";
import { bootUiOverDirBundle, bootUiOverRemote } from "./harness.js";

const SEED = [
  { id: "tasks/alpha", frontmatter: { type: "Task", title: "Ship the thing", status: "todo" }, body: "Do the thing." },
  { id: "tasks/beta", frontmatter: { type: "Task", title: "Review the PR", status: "in_progress" }, body: "Review it." },
  { id: "tasks/gamma", frontmatter: { type: "Task", title: "Already shipped", status: "done" }, body: "Done." },
];

for (const [label, boot] of [
  ["--dir", bootUiOverDirBundle],
  ["--remote", bootUiOverRemote],
] as const) {
  test.describe(`board (${label})`, () => {
    test("renders seeded tasks in their status columns and shows a total count", async ({ page }) => {
      const instance = await boot(SEED);
      try {
        await page.goto(instance.url);
        await expect(page.locator('.board-card:has-text("Ship the thing")')).toBeVisible();
        await expect(page.locator('.board-column[aria-label="Todo"]').locator(".board-card")).toHaveCount(1);
        await expect(page.locator('.board-column[aria-label="In progress"]').locator(".board-card")).toHaveCount(1);
        await expect(page.locator('.board-column[aria-label="Done"]').locator(".board-card")).toHaveCount(1);
      } finally {
        await instance.cleanup();
      }
    });

    test("a status change persists across reload", async ({ page }) => {
      const instance = await boot(SEED);
      try {
        await page.goto(instance.url);
        const card = page.locator('.board-card[data-doc-id="tasks/alpha"]');
        await card.locator("select").selectOption("done");
        await expect(page.locator('.board-column[aria-label="Done"]').locator('.board-card[data-doc-id="tasks/alpha"]')).toBeVisible();

        await page.reload();
        await expect(page.locator('.board-column[aria-label="Done"]').locator('.board-card[data-doc-id="tasks/alpha"]')).toBeVisible();
        await expect(page.locator('.board-column[aria-label="Todo"]').locator(".board-card")).toHaveCount(0);
      } finally {
        await instance.cleanup();
      }
    });
  });
}
