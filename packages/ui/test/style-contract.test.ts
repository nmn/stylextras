import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(packageRoot, 'src')

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(entryPath)
    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : []
  })
}

describe('component StyleX contract', () => {
  it('keeps component state and labels out of data attributes', () => {
    for (const file of sourceFiles(sourceRoot)) {
      const source = readFileSync(file, 'utf8')
      expect(source, path.relative(sourceRoot, file)).not.toMatch(/\bdata-[\w-]+\s*=/)
      expect(source, path.relative(sourceRoot, file)).not.toMatch(/\bdataset\./)
      expect(source, path.relative(sourceRoot, file)).not.toMatch(/\[data-[\w-]+/)
    }
  })

  it('keeps stylex.create maps private to their defining file', () => {
    for (const file of sourceFiles(sourceRoot)) {
      const source = readFileSync(file, 'utf8')
      expect(source, path.relative(sourceRoot, file)).not.toMatch(
        /export\s+(?:const|let|var)\s+\w+\s*=\s*stylex\.create\s*\(/,
      )
      expect(source, path.relative(sourceRoot, file)).not.toMatch(
        /export\s*\{[^}]*\bstyles?\b[^}]*\}/s,
      )
    }
  })

  it('does not synthesize Carousel controls through pseudo-elements', () => {
    const source = readFileSync(path.join(sourceRoot, 'carousel/index.tsx'), 'utf8')
    expect(source).not.toContain('::scroll-marker')
    expect(source).not.toContain('::scroll-button')
  })

  it('exports source and leaves compilation to consumers', () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
    ) as {
      exports: Record<string, unknown>
      files: string[]
      scripts?: Record<string, string>
      sideEffects: boolean
    }
    expect(packageJson.files).toContain('src')
    expect(packageJson.scripts).toBeUndefined()
    expect(packageJson.sideEffects).toBe(false)
    for (const [exportPath, target] of Object.entries(packageJson.exports)) {
      if (exportPath === './package.json') continue
      expect(target, exportPath).toMatch(/^\.\/src\/.*\.(?:ts|tsx)$/)
    }
  })
})
