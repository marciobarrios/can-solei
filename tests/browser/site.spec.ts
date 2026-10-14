import { test, expect } from "@playwright/test";
test("equivalent languages, headings, images and no console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/ca/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ca");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Un parc, moltes històries.",
  );
  const headings = await page.locator("main h2").count();
  await page.getByRole("link", { name: "ES", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Un parque, muchas historias.",
  );
  await expect(page.locator("main h2")).toHaveCount(headings);
  await page.locator("#arxiu").scrollIntoViewIfNeeded();
  await page.locator(".media-preview img").first().waitFor();
  for (const img of await page.locator(".media-preview img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate((node) => {
          const image = node as HTMLImageElement;
          return (
            image.complete &&
            Math.max(image.naturalWidth, image.naturalHeight) >= 1200 &&
            Math.min(image.naturalWidth, image.naturalHeight) >= 800
          );
        }),
      )
      .toBe(true);
  }
  await expect
    .poll(() =>
      page
        .locator(".media-preview img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
test("map categories, search, empty state, zoom and keyboard selection", async ({
  page,
}) => {
  await page.goto("/es/");
  const map = page.locator("#mapa");
  await map.getByRole("button", { name: "Escuelas", exact: true }).click();
  await expect(map.locator(".place-list button")).toHaveCount(2);
  await map.getByRole("button", { name: "Todos", exact: true }).click();
  await map.getByRole("textbox", { name: "Buscar lugar" }).fill("Reloj");
  await expect(map.locator(".place-list button")).toHaveCount(1);
  const item = map.locator(".place-list button");
  await item.focus();
  await page.keyboard.press("Enter");
  await expect(map.locator(".place-detail h3")).toHaveText("Torre del Reloj");
  await expect(map.locator(".place-detail")).toContainText("1883");
  await map.getByRole("button", { name: "Ampliar", exact: true }).click();
  await expect(map.locator(".map-canvas")).toHaveClass(/zoomed/);
  await map.getByRole("textbox").fill("zzzz");
  await expect(map).toContainText("No hay coincidencias");
  await map.getByRole("textbox").fill("");
  await map.getByRole("button", { name: "Naturaleza", exact: true }).click();
  await expect(map.locator(".place-list button")).toHaveCount(27);
});
test("agenda dynamically separates past, upcoming and cancellations", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  await page.goto("/es/");
  const agenda = page.locator("#agenda");
  await expect(agenda.locator(".event")).toHaveCount(7);
  await agenda.getByRole("button", { name: "Archivo", exact: true }).click();
  await expect(agenda.locator(".event")).toHaveCount(1);
  await expect(agenda).toContainText("Conozcamos las plantas");
  await agenda.getByRole("button", { name: "Canceladas", exact: true }).click();
  await expect(agenda.locator(".event")).toHaveCount(0);
  await expect(agenda).toContainText("No hay actividades");
  await page.clock.setFixedTime(new Date("2026-12-15T12:00:00Z"));
  await page.reload();
  await expect(agenda.locator(".event")).toHaveCount(0);
  await expect(agenda).toContainText("más de dos semanas");
});
test("historical gallery and maps support filtering and accessible lightbox", async ({
  page,
}) => {
  await page.goto("/es/");
  const gallery = page.locator("#arxiu");
  const trigger = gallery.getByRole("button", {
    name: "Abrir Preparativos en el camino de entrada",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute(
    "src",
    "/media/museu-50537405721.webp",
  );
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(
          () => !!document.activeElement?.closest('[role="dialog"]'),
        ),
      )
      .toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await gallery
    .getByRole("button", { name: "Históricas", exact: true })
    .click();
  await expect(gallery.locator(".media")).toHaveCount(8);
  await gallery
    .getByRole("button", {
      name: "Abrir El lago, septiembre de 1936",
      exact: true,
    })
    .click();
  await expect(dialog.locator("img")).toHaveAttribute(
    "src",
    "/media/museu-50536680768.webp",
  );
  await expect(dialog).toContainText("uso no comercial");
  await page.keyboard.press("Escape");
  await gallery.getByRole("button", { name: "Mapas", exact: true }).click();
  await expect(gallery.locator(".media")).toHaveCount(3);
  await gallery.getByRole("button", { name: "Todo", exact: true }).click();
  await expect(gallery.locator(".media")).toHaveCount(11);
  await expect(
    gallery.getByRole("button", { name: "Vídeos", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('a[href*="acyXWw4_ZZQ"]')).toHaveCount(0);
});
test("responsive page has no document overflow and navigation works", async ({
  page,
}, info) => {
  await page.goto("/ca/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  if (info.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Menú principal" });
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Escoles", exact: true })
      .click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  }
  await page.locator("#arxiu").scrollIntoViewIfNeeded();
  const columns = await page
    .locator(".gallery-grid")
    .evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    );
  expect(columns).toBe(info.project.name === "mobile" ? 1 : 2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `research/evidence/${info.project.name}-gallery.png`,
  });
});
test("skip link and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("#main");
  expect(
    await page
      .locator("html")
      .evaluate((e) => getComputedStyle(e).scrollBehavior),
  ).toBe("auto");
});
