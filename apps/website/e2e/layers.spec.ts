import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/ui");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
});

test("Dialog supports invokers, nesting, Escape ordering, focus restoration, and close forms", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open dialog", exact: true });
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

  await page.getByRole("button", { name: "Mount default-open dialog" }).click();
  const defaultOpenDialog = page.locator("#test-default-open-dialog");
  await expect(defaultOpenDialog).toHaveJSProperty("open", true);
  await page.keyboard.press("Escape");
  await expect(defaultOpenDialog).toHaveJSProperty("open", false);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(defaultOpenDialog).toHaveJSProperty("open", false);
});

test("DialogClient lazily bridges invoker commands when native support is absent", async ({
  page,
}) => {
  const requestedUrls: string[] = [];
  page.on("request", (request) => requestedUrls.push(request.url()));
  await page.addInitScript(() => {
    Object.defineProperties(HTMLButtonElement.prototype, {
      command: { configurable: true, value: undefined },
      commandForElement: { configurable: true, value: undefined },
    });
  });
  await page.reload();
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await expect
    .poll(() => requestedUrls.some((url) => url.includes("invoker-command-fallback")))
    .toBe(true);

  const trigger = page.getByRole("button", { name: "Open dialog", exact: true });
  const dialog = page.locator("#test-dialog");
  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toHaveJSProperty("open", false);
  await expect(trigger).toBeFocused();
});

test("LazyDialog preloads on intent without rendering and mounts on activation", async ({
  page,
}) => {
  const requestedUrls: string[] = [];
  page.on("request", (request) => requestedUrls.push(request.url()));
  const trigger = page.getByRole("button", { name: "Open lazy dialog" });
  const dialog = page.locator("#test-lazy-dialog");
  const status = page.locator("#test-lazy-dialog-status");

  await expect(dialog).toHaveCount(0);
  await expect(status).toBeAttached();
  await expect(status).not.toHaveAttribute("hidden");
  await expect(status).toHaveText("");
  expect(requestedUrls.some((url) => url.includes("LazyDialogFixture"))).toBe(false);

  await trigger.hover();
  await expect
    .poll(() => requestedUrls.some((url) => url.includes("LazyDialogFixture")))
    .toBe(true);
  await expect(dialog).toHaveCount(0);

  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(page.getByRole("heading", { name: "Deferred settings" })).toBeVisible();
  await page.getByRole("button", { name: "Close deferred settings" }).click();
  await expect(dialog).toHaveJSProperty("open", false);
  await expect(trigger).toBeFocused();
});

test("Lazy menus preload on intent and preserve menu keyboard/context gestures", async ({
  page,
}) => {
  const menuTrigger = page.getByRole("button", { name: "Open lazy menu" });
  const menu = page.getByTestId("lazy-dropdown-menu");
  const status = page.locator("#test-lazy-menu-status");
  await expect(menu).toHaveCount(0);
  await expect(status).toBeAttached();
  await expect(status).not.toHaveAttribute("hidden");
  await menuTrigger.focus();
  await expect(menu).toHaveCount(0);
  await menuTrigger.click();
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Deferred rename" })).toBeFocused();
  await menuTrigger.click();
  await expect(menu).toBeHidden();
  await expect(menuTrigger).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Deferred rename" })).toBeFocused();
  await menuTrigger.focus();
  await expect(menu).toBeVisible();
  await page.keyboard.press("ArrowUp");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Deferred archive" })).toBeFocused();
  await page.keyboard.press("d");
  await expect(menu.getByRole("menuitem", { name: "Deferred unavailable" })).toBeFocused();
  await page.keyboard.press("d");
  await expect(menu.getByRole("menuitem", { name: "Deferred rename" })).toBeFocused();
  await page.keyboard.press("d");
  await expect(menu.getByRole("menuitem", { name: "Deferred archive" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(menuTrigger).toBeFocused();

  const contextTarget = page.getByLabel("Deferred canvas context region");
  const contextMenu = page.getByTestId("lazy-context-menu");
  await expect(contextMenu).toHaveCount(0);
  await expect(contextTarget).toHaveAttribute("aria-expanded", "false");
  await contextTarget.click({ button: "right", position: { x: 12, y: 12 } });
  await expect(contextMenu).toBeVisible();
  await expect(contextTarget).toHaveAttribute("aria-expanded", "true");
  await expect(contextMenu.getByRole("menuitem", { name: "Deferred copy" })).toBeFocused();
  await page.keyboard.press("d");
  await expect(contextMenu.getByRole("menuitem", { name: "Deferred paste" })).toBeFocused();
  await page.keyboard.press("d");
  await expect(contextMenu.getByRole("menuitem", { name: "Deferred copy" })).toBeFocused();
  await contextTarget.dispatchEvent("contextmenu", { clientX: 48, clientY: 48 });
  await expect(contextMenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(contextMenu).toBeHidden();
  await expect(contextTarget).toHaveAttribute("aria-expanded", "false");
  await expect(contextTarget).toBeFocused();

  const contextButton = page.getByRole("button", { name: "Open lazy canvas actions" });
  await contextButton.click();
  await expect(contextMenu).toBeVisible();
  await expect(contextButton).toHaveAttribute("aria-expanded", "true");
  await contextButton.click();
  await expect(contextMenu).toBeHidden();
  await expect(contextButton).toHaveAttribute("aria-expanded", "false");
  await expect(contextButton).toBeFocused();
});

test("Lazy boundaries announce invalid content, clear state, and retry", async ({ page }) => {
  const dialogTrigger = page.getByRole("button", { name: "Open retry lazy dialog" });
  const dialog = page.locator("#test-retry-lazy-dialog");
  const dialogStatus = page.locator("#test-retry-lazy-dialog-status");
  await expect(dialogStatus).toBeAttached();
  await expect(dialogStatus).not.toHaveAttribute("hidden");

  await dialogTrigger.click();
  await expect(dialogStatus).toHaveText("Retry deferred dialog failed");
  await expect(dialog).toHaveCount(0);
  await expect(dialogTrigger).not.toHaveAttribute("aria-busy");
  await expect(dialogTrigger).not.toHaveAttribute("aria-controls");

  await dialogTrigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await dialog.getByRole("button", { name: "Close deferred settings" }).click();
  await expect(dialog).toHaveJSProperty("open", false);

  const menuTrigger = page.getByRole("button", { name: "Open retry lazy menu" });
  const menu = page.locator("#test-retry-lazy-menu");
  const menuStatus = page.locator("#test-retry-lazy-menu-status");
  await expect(menuStatus).toBeAttached();
  await expect(menuStatus).not.toHaveAttribute("hidden");

  await menuTrigger.click();
  await expect(menuStatus).toHaveText("Retry deferred menu failed");
  await expect(menu).toHaveCount(0);
  await expect(menuTrigger).not.toHaveAttribute("aria-busy");
  await expect(menuTrigger).not.toHaveAttribute("aria-controls");

  await menuTrigger.click();
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Deferred rename" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("Canceled lazy activations stay silent when their loaders reject later", async ({ page }) => {
  const errorCount = page.getByTestId("canceled-lazy-error-count");
  const dialogTrigger = page.getByRole("button", { name: "Open cancelable lazy dialog" });
  const dialogStatus = page.locator("#test-cancel-lazy-dialog-status");

  await expect(errorCount).toHaveText("0");
  await dialogTrigger.click();
  await expect(dialogTrigger).toHaveAttribute("aria-busy", "true");
  await expect(dialogStatus).toHaveText("Loading cancelable dialog");
  await page.keyboard.press("Escape");
  await expect(dialogTrigger).not.toHaveAttribute("aria-busy");
  await expect(dialogStatus).toHaveText("");
  await page.waitForTimeout(300);
  await expect(dialogStatus).toHaveText("");
  await expect(errorCount).toHaveText("0");

  const menuTrigger = page.getByRole("button", { name: "Open cancelable lazy menu" });
  const menuStatus = page.locator("#test-cancel-lazy-menu-status");
  await menuTrigger.click();
  await expect(menuTrigger).toHaveAttribute("aria-busy", "true");
  await expect(menuStatus).toHaveText("Loading cancelable menu");
  await page.keyboard.press("Escape");
  await expect(menuTrigger).not.toHaveAttribute("aria-busy");
  await expect(menuStatus).toHaveText("");
  await page.waitForTimeout(300);
  await expect(menuStatus).toHaveText("");
  await expect(errorCount).toHaveText("0");
});

test("Command excludes caller-hidden items from keyboard and empty-state models", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Open command palette" }).click();

  const command = page.locator("#test-command");
  const input = page.getByTestId("command-input");
  const visibleItem = command.getByRole("option", { name: "Visible command" });
  const hiddenItem = command.getByText("Hidden command");
  const empty = page.getByTestId("command-empty");

  await expect(command).toHaveJSProperty("open", true);
  await expect(hiddenItem).toBeHidden();
  await expect(empty).toBeHidden();

  await input.focus();
  await page.keyboard.press("ArrowDown");
  const visibleItemId = await visibleItem.getAttribute("id");
  expect(visibleItemId).not.toBeNull();
  await expect(input).toHaveAttribute("aria-activedescendant", visibleItemId as string);

  await input.fill("hidden");
  await expect(hiddenItem).toBeHidden();
  await expect(visibleItem).toBeHidden();
  await expect(empty).toBeVisible();
  await expect(input).not.toHaveAttribute("aria-activedescendant");
});

test("Popover and menu light-dismiss while disabled menu items stay discoverable", async ({
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
  await expect(menu.getByRole("menuitem", { name: "Unavailable" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Archive" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(menu).toBeVisible();
  await trigger.click();
  await expect(menu).toBeHidden();
});

test("ContextMenu tracks expanded state and opens from button, pointer, Ctrl-click, and keyboard", async ({
  page,
}) => {
  const button = page.getByRole("button", { name: "Open canvas actions" });
  const target = page.getByLabel("Canvas context menu");
  const menu = page.locator("#test-context-menu");

  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(target).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(target).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("menuitem", { name: "Copy" })).toBeFocused();
  await button.click();
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(target).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();

  // A canonical pointer contextmenu event must not depend on a later auxclick.
  await target.dispatchEvent("contextmenu", {
    button: 2,
    buttons: 2,
    clientX: 20,
    clientY: 20,
  });
  await expect(menu).toBeVisible();
  await expect(target).toHaveAttribute("aria-expanded", "true");
  await menu.getByRole("menuitem", { name: "Copy" }).click();
  await expect(menu).toBeHidden();
  await expect(target).toHaveAttribute("aria-expanded", "false");
  await expect(target).toBeFocused();

  // macOS Ctrl+click and engines that omit auxclick still emit contextmenu.
  await target.dispatchEvent("contextmenu", {
    button: 0,
    buttons: 1,
    clientX: 24,
    clientY: 24,
    ctrlKey: true,
  });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  await target.focus();
  await page.keyboard.press("Shift+F10");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
});

test("Interest invoker fallback preserves a submit button's default action", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Submit with fallback hint" });
  const tooltip = page.locator("#test-fallback-submit-tooltip");

  // The fixture installs the fallback directly; installation removes the native
  // popover target so exactly one click bridge owns popover activation.
  await expect(trigger).not.toHaveAttribute("popovertarget");
  await trigger.click();
  await expect(page.getByTestId("fallback-submit-result")).toHaveText("1");
  await expect(tooltip).toBeVisible();
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
