import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const p of ["/en", "/en/cars", "/en/book", "/en/contact", "/en/faq"]) {
  test(`axe ${p}`, async ({ page }) => {
    await page.goto(p);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
