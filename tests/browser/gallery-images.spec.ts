import { test, expect } from "@playwright/test";
import corpus from "../../content/corpus.json" with { type: "json" };

for (const lang of ["ca", "es"]) {
  test(`gallery downloads static previews and loads original only on opening (${lang})`, async ({
    page,
  }) => {
    const requested: string[] = [];
    page.on("request", (request) =>
      requested.push(new URL(request.url()).pathname),
    );
    await page.goto(`/${lang}/`);
    const previews = page.locator(".media-preview img");
    for (const img of await previews.all()) {
      await expect(img).toHaveCSS("object-fit", "contain");
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate((node) => {
            const image = node as HTMLImageElement;
            return (
              image.complete &&
              image.naturalWidth > 0 &&
              image.currentSrc.includes("/media/previews/")
            );
          }),
        )
        .toBe(true);
    }
    // The interactive botanical map intentionally shares its full-size original.
    const originals = corpus.media.filter(
      (item) => item.image && item.image !== "/media/amb-botanical-map.webp",
    );
    for (const item of originals) expect(requested).not.toContain(item.image);
    expect(requested.some((url) => url.startsWith("/_next/image"))).toBe(false);
    expect(
      requested.filter((url) => url.startsWith("/media/previews/")),
    ).toHaveLength(14);
    expect(
      requested
        .filter((url) => url.startsWith("/media/previews/"))
        .every((url) => url.endsWith(".avif")),
    ).toBe(true);

    await page.locator(".media-preview").first().click();
    const image = page.getByRole("dialog").locator("img");
    const original = corpus.media.find((item) => item.image)!;
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBe(original.width);
    expect(requested).toContain(original.image);
    await expect(image).toHaveAttribute("src", original.image!);
  });
}
