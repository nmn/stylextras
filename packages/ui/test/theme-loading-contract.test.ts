import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(packageRoot, 'src')
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as {
  exports: Record<string, string>
}

describe('theme and fallback loading boundaries', () => {
  it('declares selected surfaces as a derived canonical color token', () => {
    const tokens = readFileSync(path.join(sourceRoot, 'tokens/color.stylex.ts'), 'utf8')
    const neutral = readFileSync(path.join(sourceRoot, 'color-themes/neutral.ts'), 'utf8')

    expect(tokens).toMatch(
      /surfaceSelected:\s*\(\) =>\s*lightDark\(colors\.bg, mix\(colors\.bg, colors\.tone, 88\)\)/,
    )
    expect(neutral).toContain(
      'surfaceSelected: lightDark(colors.bg, mix(colors.bg, colors.tone, 88))',
    )
  })

  it('publishes every theme and preset through a file-level subpath', () => {
    const families = [
      'blur-themes',
      'color-themes',
      'elevation-themes',
      'motion-themes',
      'radius-themes',
      'spacing-themes',
      'stroke-themes',
      'style-presets',
      'typography-themes',
    ]
    for (const family of families) {
      const files = readdirSync(path.join(sourceRoot, family))
        .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && file !== 'types.ts')
        .map((file) => file.slice(0, -3))
      for (const name of files) {
        expect(packageJson.exports[`./${family}/${name}`], `${family}/${name}`).toBe(
          `./src/${family}/${name}.ts`,
        )
      }
    }

    for (const [exportPath, target] of Object.entries(packageJson.exports)) {
      if (!/^\.\/(?:\w+-themes|style-presets)\//.test(exportPath)) continue
      expect(target, exportPath).toMatch(/^\.\/src\/[^/]+\/[^/]+\.ts$/)
      const source = readFileSync(path.resolve(packageRoot, target), 'utf8')
      expect(source, exportPath).not.toMatch(/from ['"]\.\/index['"]/)
      if (exportPath.startsWith('./style-presets/')) {
        expect(source, exportPath).toContain("from '../color-themes/neutral'")
        expect(source, exportPath).toMatch(/PresetThemes = \[\s*colorBaseTheme,\s*colorTheme,/)
      }
    }
  })

  it('keeps substantial compatibility implementations behind dynamic imports', () => {
    const focusgroup = readFileSync(path.join(sourceRoot, 'focusgroup/index.ts'), 'utf8')
    const dialog = readFileSync(path.join(sourceRoot, 'dialog/client.tsx'), 'utf8')
    const dialogCommandBridge = readFileSync(
      path.join(sourceRoot, 'dialog/use-command-bridge.ts'),
      'utf8',
    )
    const anchoredDialog = readFileSync(path.join(sourceRoot, 'anchored-dialog/client.tsx'), 'utf8')
    const interest = readFileSync(
      path.join(sourceRoot, 'platform-polyfills/interest-invoker.ts'),
      'utf8',
    )
    expect(focusgroup).toContain("import('@stylextras/ui/platform-polyfills/focusgroup-fallback')")
    expect(dialogCommandBridge).toContain(
      "import('@stylextras/ui/platform-polyfills/invoker-command-fallback')",
    )
    expect(dialog).toContain("import('@stylextras/ui/platform-polyfills/dialog-closedby-fallback')")
    expect(anchoredDialog).toContain(
      "import('@stylextras/ui/platform-polyfills/dialog-closedby-fallback')",
    )
    expect(interest).toContain(
      "import('@stylextras/ui/platform-polyfills/interest-invoker-fallback')",
    )
  })
})
