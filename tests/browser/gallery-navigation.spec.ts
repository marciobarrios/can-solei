import { test, expect } from "@playwright/test";
import corpus from "../../content/corpus.json" with { type: "json" };

for (const lang of ["ca", "es"] as const) {
  test(`gallery navigation follows filters and preserves focus (${lang})`, async ({
    page,
  }, info) => {
    await page.goto(`/${lang}/`);
    const gallery = page.locator("#arxiu");
    const dialog = page.getByRole("dialog");
    const filters =
      lang === "es"
        ? ["Todo", "Históricas", "Mapas"]
        : ["Tot", "Històriques", "Mapes"];

    for (const [filterIndex, label] of filters.entries()) {
      await gallery.getByRole("button", { name: label, exact: true }).click();
      const images = corpus.media.filter(
        (item) =>
          item.image &&
          (filterIndex === 0 ||
            (filterIndex === 1
              ? item.period === "historical"
              : item.kind === "document")),
      );
      await expect(gallery.locator(".media-preview")).toHaveCount(
        images.length,
      );
      const opener = gallery.locator(".media-preview").first();
      await opener.click();
      const next = dialog.getByRole("button", {
        name: lang === "es" ? "Foto siguiente" : "Foto següent",
      });
      const previous = dialog.getByRole("button", { name: "Foto anterior" });
      const assertImage = async (index: number) => {
        const image = images[index];
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("heading")).toHaveText(image.title[lang]);
        await expect(dialog.locator("img")).toHaveAttribute(
          "src",
          image.image!,
        );
        await expect(dialog.locator("img")).toHaveAttribute(
          "alt",
          image.title[lang],
        );
        await expect(
          dialog.locator('[data-slot="dialog-description"]'),
        ).toHaveText(image.description[lang]);
        await expect(dialog.locator(".credit")).toContainText(image.credit);
        await expect(dialog.locator(".credit")).toContainText(
          image.license[lang],
        );
        await expect(
          dialog.getByRole("link", { name: "Consultar original" }),
        ).toHaveAttribute("href", image.url);
        await expect(dialog.getByRole("status")).toContainText(
          `${index + 1} / ${images.length}`,
        );
      };
      await assertImage(0);
      await previous.click();
      await assertImage(images.length - 1);
      await expect(previous).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await assertImage(0);
      await page.keyboard.press("ArrowLeft");
      await assertImage(images.length - 1);
      await next.click();
      for (let index = 0; index < images.length; index++) {
        await assertImage(index);
        await next.click();
        await expect(next).toBeFocused();
      }
      await assertImage(0);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();

      const second = gallery.locator(".media-preview").nth(1);
      await second.click();
      await assertImage(1);
      if (filterIndex === 0) {
        await expect
          .poll(() =>
            dialog
              .locator("img")
              .evaluate((node) => (node as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
        await page.screenshot({
          path: info.outputPath(`gallery-navigation-${lang}.png`),
        });
        for (const button of [next, previous]) {
          const bounds = await button.boundingBox();
          expect(bounds?.width).toBeGreaterThanOrEqual(44);
          expect(bounds?.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
      await previous.click();
      await assertImage(0);
      await dialog
        .getByRole("button", {
          name: lang === "es" ? "Cerrar" : "Tancar",
          exact: true,
        })
        .click();
      await expect(dialog).not.toBeVisible();
      await expect(second).toBeFocused();
    }
  });
}
