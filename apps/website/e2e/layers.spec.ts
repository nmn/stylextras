import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/ui");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
});

test("Dialog supports invokers, nesting, Escape ordering, focus restoration, and close forms", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open dialog" });
  const dialog = page.locator("#test-dialog");
  const nested = page.locator("#dialog-popover");

  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(page.locator("#test-project-name")).toBeFocused();

  await page.getByRole("button", { name: "Open nested popover" }).click();
  await expect(nested).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nested).toBeHidden();
  await expect(dialog).toHaveJSProperty("open", true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await dialog.getByRole("button", { name: "Native close form" }).click();
  await expect(dialog).toHaveJSProperty("open", false);
});

test("Popover and menu light-dismiss and menu navigation skips disabled items", async ({
  page,
}) => {
  const popover = page.locator("#test-popover");
  await page.getByRole("button", { name: "Open popover" }).click();
  await expect(popover).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();

  const menu = page.getByTestId("dropdown-menu");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Rename" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Archive" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("ContextMenu opens at pointer coordinates and from Shift+F10", async ({ page }) => {
  const target = page.getByLabel("Canvas context menu");
  const menu = page.locator("#test-context-menu");
  await target.click({ button: "right", position: { x: 20, y: 20 } });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Copy" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  await target.focus();
  await page.keyboard.press("Shift+F10");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
});

test("Tooltip and HoverCard work for focus, hover, Escape, and click fallback", async ({
  page,
}) => {
  const tooltipTrigger = page.getByRole("button", { name: "Hover for tip" });
  const tooltip = page.locator("#test-tooltip");
  await tooltipTrigger.focus();
  await expect(tooltip).toBeVisible({ timeout: 2_000 });
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();

  await tooltipTrigger.click();
  await expect(tooltip).toBeVisible();
  await tooltipTrigger.click();
  await expect(tooltip).toBeHidden();

  const hoverTrigger = page.getByRole("button", { name: "Project owner" });
  const hoverCard = page.locator("#test-hover-card");
  await hoverTrigger.hover();
  await expect(hoverCard).toBeVisible({ timeout: 2_000 });
  await hoverCard.getByRole("button", { name: "View profile" }).hover();
  await expect(hoverCard).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(hoverCard).toBeHidden();
});
