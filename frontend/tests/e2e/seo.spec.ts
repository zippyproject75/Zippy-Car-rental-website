import { expect, test } from "@playwright/test";

test("robots and sitemap", async ({ request }) => {
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  const sm = await request.get("/sitemap.xml");
  expect(sm.ok()).toBe(true);
  expect(await sm.text()).toContain("<urlset");
});

test("home has title and description", async ({ page }) => {
  await page.goto("/en");
  expect(await page.title()).not.toBe("");
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
});
