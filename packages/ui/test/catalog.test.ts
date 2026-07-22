import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { componentCatalog, experimentalCatalog, stableCatalog } from '../src/catalog'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(
  readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
) as {
  dependencies?: Record<string, string>
  exports: Record<string, unknown>
}

function resolveLocalSource(importPath: string, importer: string) {
  const absolute = path.resolve(path.dirname(importer), importPath)
  return [
    `${absolute}.ts`,
    `${absolute}.tsx`,
    path.join(absolute, 'index.ts'),
    path.join(absolute, 'index.tsx'),
  ].find((candidate) => existsSync(candidate))
}

function entersClientGraph(file: string, visited = new Set<string>()): boolean {
  if (visited.has(file)) return false
  visited.add(file)
  const source = readFileSync(file, 'utf8')
  if (/^['"]use client['"];?/m.test(source)) return true
  return ts.preProcessFile(source, true, true).importedFiles.some((imported) => {
    if (!imported.fileName.startsWith('.')) return false
    const dependency = resolveLocalSource(imported.fileName, file)
    return dependency ? entersClientGraph(dependency, visited) : false
  })
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
      const sourcePath = `./src/${entry.export}/index.tsx`
      expect(packageJson.exports[`./${entry.export}`], entry.export).toBe(sourcePath)
      expect(existsSync(path.join(packageRoot, sourcePath)), entry.export).toBe(true)
    }
  })

  it('publishes trigger-first lazy layer entries', () => {
    for (const exportPath of [
      './alert-dialog/lazy',
      './command/lazy',
      './context-menu/lazy',
      './dialog/lazy',
      './drawer/lazy',
      './dropdown-menu/lazy',
      './navigation-menu/lazy',
      './popover/lazy',
      './sheet/lazy',
      './sidebar/lazy',
    ]) {
      expect(packageJson.exports[exportPath], exportPath).toBeDefined()
    }
  })

  it('classifies native form entries accurately', () => {
    for (const name of [
      'ColorArea',
      'ColorPicker',
      'ColorSwatchPicker',
      'ColorWheel',
      'DatePicker',
      'InputOTP',
      'RangeCalendar',
      'Slider',
      'Tree',
    ]) {
      expect(componentCatalog.find((entry) => entry.name === name)?.mode).toBe('native')
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
    for (const entry of componentCatalog.filter((item) => item.mode === 'native')) {
      const sourceEntry = path.join(packageRoot, 'src', entry.export, 'index.tsx')
      expect(entersClientGraph(sourceEntry), entry.export).toBe(false)
    }
  })

  it('has no primitive-library runtime dependency', () => {
    const dependencies = Object.keys(packageJson.dependencies ?? {})
    expect(dependencies.some((name) => /radix|base-ui|react-aria/.test(name))).toBe(
      false,
    )
  })
})
