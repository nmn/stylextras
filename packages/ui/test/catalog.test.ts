import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { componentCatalog, experimentalCatalog, stableCatalog } from '../src/catalog'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(
  readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
) as {
  dependencies?: Record<string, string>
  exports: Record<string, unknown>
}

describe('public catalog manifest', () => {
  it('has unique canonical names and paths', () => {
    expect(new Set(componentCatalog.map((entry) => entry.name)).size).toBe(
      componentCatalog.length,
    )
    expect(new Set(componentCatalog.map((entry) => entry.export)).size).toBe(
      componentCatalog.length,
    )
    expect(stableCatalog).toHaveLength(54)
    expect(experimentalCatalog).toHaveLength(16)
  })

  it('drives every component package export', () => {
    for (const entry of componentCatalog) {
      expect(packageJson.exports[`./${entry.export}`], entry.export).toBeDefined()
      expect(
        existsSync(path.join(packageRoot, 'src', entry.export, 'index.tsx')),
        entry.export,
      ).toBe(true)
    }
  })

  it('does not publish legacy aliases or a package barrel', () => {
    const removed = [
      '.',
      './alert-callout',
      './breadcrumbs',
      './combo-box',
      './disclosure',
      './disclosure-group',
      './empty-state',
      './icon-button',
      './menu',
      './progress-bar',
      './text-area',
      './window-splitter',
    ]
    for (const exportPath of removed) {
      expect(packageJson.exports[exportPath], exportPath).toBeUndefined()
    }
  })

  it('keeps native entries out of the client-reference graph', () => {
    for (const entry of stableCatalog.filter((item) => item.mode === 'native')) {
      const source = readFileSync(
        path.join(packageRoot, 'src', entry.export, 'index.tsx'),
        'utf8',
      )
      expect(source, entry.export).not.toMatch(/^['"]use client['"]/m)
    }
  })

  it('has no primitive-library runtime dependency', () => {
    const dependencies = Object.keys(packageJson.dependencies ?? {})
    expect(dependencies.some((name) => /radix|base-ui|react-aria/.test(name))).toBe(
      false,
    )
  })
})
