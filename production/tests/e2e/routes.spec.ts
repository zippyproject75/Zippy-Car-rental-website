import { expect, test } from "@playwright/test";

const paths = ["", "/cars", "/cars/fronx", "/book", "/contact", "/faq", "/about"];

for (const locale of ["en", "hi", "mr"]) {
  for (const p of paths) {
    test(`${locale}${p || "/"} renders`, async ({ page }) => {
      const res = await page.goto(`/${locale}${p}`);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", new RegExp(`^${locale}`));
    });
  }
}
