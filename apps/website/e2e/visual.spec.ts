import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ browserName, page }) => {
  test.skip(browserName !== "chromium", "Visual baselines are recorded in Chromium.");
  await page.setViewportSize({ height: 1400, width: 1280 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("reference gallery Neutral and Zinc light/dark", async ({ page }) => {
  await page.goto("/docs");
  const gallery = page.getByTestId("reference-gallery");
  const color = gallery.getByLabel("Color theme");
  const appearance = gallery.getByLabel("Appearance");
  await expect(gallery).toBeVisible();
  await expect(gallery).toHaveAttribute("data-preview-ready", "true");
  await page.locator("#nd-nav").evaluate((element) => {
    element.style.setProperty("display", "none", "important");
  });

  await expect(gallery).toHaveScreenshot("reference-neutral-light.png");
  await appearance.selectOption("dark");
  await expect(gallery).toHaveAttribute("data-preview-appearance", "dark");
  await expect(gallery).toHaveScreenshot("reference-neutral-dark.png");
  await color.selectOption("zinc");
  await expect(gallery).toHaveAttribute("data-preview-color", "zinc");
  await appearance.selectOption("light");
  await expect(gallery).toHaveAttribute("data-preview-appearance", "light");
  await expect(gallery).toHaveScreenshot("reference-zinc-light.png");
  await appearance.selectOption("dark");
  await expect(gallery).toHaveAttribute("data-preview-appearance", "dark");
  await expect(gallery).toHaveScreenshot("reference-zinc-dark.png");
});

test("all style presets and color theme objects render", async ({ page }) => {
  await page.goto("/docs/themes");
  const gallery = page.getByTestId("theme-gallery");
  await expect(gallery).toBeVisible();
  await expect(page.getByTestId("style-gallery").locator(":scope > section")).toHaveCount(8);
  await page.locator("#nd-nav").evaluate((element) => {
    element.style.setProperty("display", "none", "important");
  });
  await expect(gallery).toHaveScreenshot("all-color-themes.png");
});

test("individual component demos render with shared preview presets", async ({
  page,
}) => {
  await page.goto("/docs/components/button");
  const demo = page.locator('[data-component-demo="Button"]');
  await expect(demo).toBeVisible();
  await expect(demo).toHaveAttribute("data-preview-ready", "true");
  await page.locator("#nd-nav").evaluate((element) => {
    element.style.setProperty("display", "none", "important");
  });

  await expect(demo).toHaveScreenshot("component-demo-neutral-light.png");
  await demo.getByLabel("Color theme").selectOption("zinc");
  await demo.getByLabel("Appearance").selectOption("dark");
  await expect(demo).toHaveAttribute("data-preview-color", "zinc");
  await expect(demo).toHaveAttribute("data-preview-appearance", "dark");
  await expect(demo).toHaveScreenshot("component-demo-zinc-dark.png");
});
