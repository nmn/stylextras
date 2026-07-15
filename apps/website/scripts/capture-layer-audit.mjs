import { mkdir, rm, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "/tmp/stylextras-layer-audit";
await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });

const cases = [
  ["alert-dialog", async (page) => page.getByRole("button", { name: "Delete draft" }).click()],
  ["dialog", async (page) => page.getByRole("button", { name: "Open dialog" }).click()],
  ["drawer", async (page) => page.getByRole("button", { name: "Open drawer" }).click()],
  ["sheet", async (page) => page.getByRole("button", { name: "Open settings" }).click()],
  ["popover", async (page) => page.getByRole("button", { name: "Open popover" }).click()],
  ["dropdown-menu", async (page) => page.getByRole("button", { name: "Actions" }).click()],
  [
    "context-menu",
    async (page) =>
      page
        .getByText("Open the context menu anywhere in this area", { exact: true })
        .click({ button: "right" }),
  ],
  [
    "menubar",
    async (page) =>
      page.locator("[data-component-demo-canvas] [role=menubar] button").first().click(),
  ],
  [
    "navigation-menu",
    async (page) => page.getByRole("button", { name: "Components" }).click(),
  ],
  ["command", async (page) => page.getByRole("button", { name: "Open command menu" }).click()],
  [
    "combobox",
    async (page) => page.locator("[data-component-demo-canvas] input").first().click(),
  ],
  [
    "date-picker",
    async (page) => page.locator("[data-component-demo-canvas] input").first().click(),
  ],
  ["tooltip", async (page) => page.getByRole("button", { name: "Archive" }).hover()],
  [
    "hover-card",
    async (page) => page.getByRole("button", { name: "New browser APIs" }).hover(),
  ],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
const findings = [];

for (const [slug, open] of cases) {
  await page.goto(`http://127.0.0.1:3000/docs/components/${slug}`, {
    waitUntil: "networkidle",
  });
  const preview = page.locator("[data-component-demo]");
  await preview.waitFor({ state: "visible" });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-component-demo]")
        ?.getAttribute("data-preview-ready") === "true",
  );
  await preview.scrollIntoViewIfNeeded();
  try {
    await open(page);
    await page.waitForTimeout(500);
    await page.screenshot({
      animations: "disabled",
      path: `${output}/${slug}.png`,
    });
  } catch (error) {
    findings.push({ message: String(error), slug });
  }
  await page.keyboard.press("Escape");
}

await writeFile(
  `${output}/findings.json`,
  `${JSON.stringify(findings, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify({ findings: findings.length, output, total: cases.length }));
