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

  it('orders Carousel scroll-marker state after the pseudo-element', () => {
    const source = readFileSync(path.join(sourceRoot, 'carousel/index.tsx'), 'utf8')
    expect(source).toContain("'::scroll-marker:target-current'")
    expect(source).not.toContain("':target-current::scroll-marker'")
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
