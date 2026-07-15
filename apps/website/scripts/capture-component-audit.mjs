import { mkdir, rm, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import { componentCatalog } from '@stylextras/ui/catalog'

const output = '/tmp/stylextras-component-audit'
const viewport = {
  height: Number(process.env.AUDIT_HEIGHT ?? 900),
  width: Number(process.env.AUDIT_WIDTH ?? 1100),
}
await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport })
const findings = []

for (const entry of componentCatalog) {
  const slug = entry.export.replace('experimental/', '')
  const section = entry.status === 'experimental' ? 'experimental' : 'components'
  await page.goto(`http://127.0.0.1:3000/docs/${section}/${slug}`, {
    waitUntil: 'networkidle',
  })
  await page.waitForFunction((name) => document.title === `${name} | StyleX`, entry.name)
  const preview = page.locator(`[data-component-demo="${entry.name}"]`)
  await preview.waitFor({ state: 'visible' })
  await page.waitForFunction(
    (name) =>
      document
        .querySelector(`[data-component-demo="${name}"]`)
        ?.getAttribute('data-preview-ready') === 'true',
    entry.name,
  )
  await preview.locator('[data-component-demo-canvas] > *').first().waitFor({ state: 'visible' })

  const metrics = await preview.evaluate((node) => {
    const canvas = node.querySelector('[data-component-demo-canvas]')
    const descendants = canvas ? Array.from(canvas.querySelectorAll('*')) : []
    const overflow = descendants
      .filter((element) => {
        const style = getComputedStyle(element)
        if (['auto', 'scroll'].includes(style.overflowX)) return false
        return element.scrollWidth > element.clientWidth + 1
      })
      .map((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        tag: element.tagName.toLowerCase(),
      }))
      .slice(0, 5)
    return {
      canvasWidth: canvas?.clientWidth ?? 0,
      documentOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      overflow,
    }
  })

  if (metrics.documentOverflow || metrics.overflow.length > 0) {
    findings.push({ entry: entry.export, ...metrics })
  }

  const prefix = entry.status === 'experimental' ? 'experimental' : 'stable'
  await preview.locator('[data-component-demo-canvas]').screenshot({
    animations: 'disabled',
    path: `${output}/${prefix}-${slug}.png`,
  })

  await preview.getByLabel('Style preset').selectOption('rhea')
  await preview.getByLabel('Color theme').selectOption('violet')
  await preview.getByLabel('Appearance').selectOption('dark')
  await preview.getByLabel('Style preset').selectOption('vega')
  await preview.getByLabel('Appearance').selectOption('light')
}

await writeFile(`${output}/findings.json`, `${JSON.stringify(findings, null, 2)}\n`)
await browser.close()
console.log(
  JSON.stringify({
    findings: findings.length,
    output,
    total: componentCatalog.length,
    viewport,
  }),
)
