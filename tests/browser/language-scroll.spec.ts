import { test, expect } from "@playwright/test";

for (const entry of ["/", "/ca/", "/es/"]) {
  test(`language switch stays at the top from ${entry}`, async ({ page }) => {
    await page.goto(entry);
    const languages = entry === "/es/" ? ["CA", "ES"] : ["ES", "CA"];

    for (const language of languages) {
      await page.getByRole("link", { name: language, exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        language.toLowerCase(),
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        language === "ES"
          ? "Un parque, muchas historias."
          : "Un parc, moltes històries.",
      );
      // Allow any smooth navigation scroll to finish before checking position.
      await page.waitForTimeout(700);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    }
  });
}
