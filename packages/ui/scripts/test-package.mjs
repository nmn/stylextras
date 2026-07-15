import { transformAsync } from '@babel/core'
import presetTypescript from '@babel/preset-typescript'
import stylexPlugin from '@stylexjs/babel-plugin'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'stylextras-ui-package-'))
const archive = path.join(temporaryRoot, 'stylextras-ui.tgz')
const consumer = path.join(temporaryRoot, 'consumer')

function run(command, args, cwd) {
  const result = Bun.spawnSync([command, ...args], {
    cwd,
    env: { ...process.env, CI: '1' },
    stderr: 'pipe',
    stdout: 'pipe',
  })
  const stdout = result.stdout.toString()
  const stderr = result.stderr.toString()
  if (result.exitCode !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${stdout}${stderr}`)
  }
  return stdout
}

try {
  run('bun', ['pm', 'pack', '--filename', archive, '--ignore-scripts', '--quiet'], packageRoot)

  const archiveEntries = run('tar', ['-tzf', archive], packageRoot).trim().split('\n')
  const requiredEntries = [
    'package/dist/button/index.js',
    'package/dist/button/index.d.ts',
    'package/dist/button/example.js',
    'package/dist/button/example.d.ts',
    'package/dist/select/index.js',
    'package/dist/combobox/index.js',
    'package/dist/styles.css',
    'package/README.md',
    'package/package.json',
  ]
  for (const entry of requiredEntries) {
    if (!archiveEntries.includes(entry)) throw new Error(`Packed artifact is missing ${entry}`)
  }
  const productionLeak = archiveEntries.find(
    (entry) => entry.includes('/src/') || /(?:example|demo)\.(?:ts|tsx)$/.test(entry),
  )
  if (productionLeak) throw new Error(`Packed artifact leaked source/demo file ${productionLeak}`)

  await mkdir(consumer)
  await writeFile(
    path.join(consumer, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies: {
          '@stylexjs/stylex': '0.18.3',
          '@stylextras/ui': `file:${archive}`,
          react: '19.2.3',
          'react-dom': '19.2.3',
        },
        devDependencies: {
          '@types/react': '19.2.7',
          '@types/react-dom': '19.2.3',
          typescript: '5.9.3',
        },
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    path.join(consumer, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          lib: ['ESNext', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          strict: true,
          target: 'ES2022',
        },
        include: ['index.tsx'],
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    path.join(consumer, 'index.tsx'),
    `import * as stylex from '@stylexjs/stylex'
import { Button } from '@stylextras/ui/button'
import ButtonExample from '@stylextras/ui/button/example'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from '@stylextras/ui/combobox'
import { Select } from '@stylextras/ui/select'
import { colorThemes } from '@stylextras/ui/color-themes'
import { spacingThemes } from '@stylextras/ui/spacing-themes'

export function PackedConsumer() {
  return (
    <section {...stylex.props(colorThemes.zinc, spacingThemes.compact)}>
      <Button>Continue</Button>
      <Select defaultValue="one" name="choice"><option value="one">One</option></Select>
      <Combobox defaultValue="one" name="framework">
        <ComboboxInput aria-label="Framework" />
        <ComboboxContent><ComboboxItem value="one">One</ComboboxItem></ComboboxContent>
      </Combobox>
    </section>
  )
}

export const PackedExample = ButtonExample
`,
  )
  await writeFile(
    path.join(consumer, 'check.mjs'),
    `import { Button } from '@stylextras/ui/button'
import ButtonExample from '@stylextras/ui/button/example'
import { colorThemes } from '@stylextras/ui/color-themes'

if (typeof Button !== 'function') throw new Error('Button export did not resolve')
if (typeof ButtonExample !== 'function') throw new Error('Example export did not resolve')
if (!colorThemes.zinc) throw new Error('Theme export did not resolve')
if (!import.meta.resolve('@stylextras/ui/styles.css')) throw new Error('CSS export did not resolve')
`,
  )

  run('bun', ['install', '--ignore-scripts'], consumer)
  const tokenProbePath = path.join(consumer, 'token-probe.stylex.ts')
  const tokenProbeSource = `import * as stylex from '@stylexjs/stylex'
import { colors } from '@stylextras/ui/tokens/color.stylex'
import { spacing } from '@stylextras/ui/tokens/spacing.stylex'

export const probe = stylex.create({
  root: {
    backgroundColor: colors.bg,
    color: colors.fg,
    padding: spacing.md,
  },
})
`
  await writeFile(tokenProbePath, tokenProbeSource)
  const tokenProbe = await transformAsync(tokenProbeSource, {
    filename: tokenProbePath,
    plugins: [
      [
        stylexPlugin,
        {
          dev: false,
          runtimeInjection: false,
          unstable_moduleResolution: { rootDir: consumer, type: 'commonJS' },
        },
      ],
    ],
    presets: [[presetTypescript, { allExtensions: true }]],
  })
  const packedColors = await import(
    pathToFileURL(
      path.join(consumer, 'node_modules/@stylextras/ui/dist/tokens/color.stylex.js'),
    ).href
  )
  const packedSpacing = await import(
    pathToFileURL(
      path.join(consumer, 'node_modules/@stylextras/ui/dist/tokens/spacing.stylex.js'),
    ).href
  )
  const emittedTokenRules = JSON.stringify(tokenProbe?.metadata?.stylex ?? [])
  for (const token of [packedColors.colors.bg, packedColors.colors.fg, packedSpacing.spacing.md]) {
    if (!emittedTokenRules.includes(token)) {
      throw new Error(`Consumer StyleX rule referenced a different variable identity than ${token}`)
    }
  }

  const compiledExample = await readFile(
    path.join(consumer, 'node_modules/@stylextras/ui/dist/button/example.js'),
    'utf8',
  )
  if (!/^['"]use client['"];?/.test(compiledExample)) {
    throw new Error('Compiled client example lost its use client directive')
  }
  run('bun', ['run', 'tsc'], consumer)
  run('bun', ['run', 'check.mjs'], consumer)
  run(
    'bun',
    [
      'build',
      'index.tsx',
      '--outdir',
      'out',
      '--external',
      'react',
      '--external',
      '@stylexjs/stylex',
    ],
    consumer,
  )

  const packedPackage = JSON.parse(
    await readFile(path.join(consumer, 'node_modules/@stylextras/ui/package.json'), 'utf8'),
  )
  if (packedPackage.version !== '0.2.0-beta.0') {
    throw new Error(`Unexpected packed version ${packedPackage.version}`)
  }

  console.log('Packed artifact passed clean-consumer imports, types, CSS, and bundle checks.')
} finally {
  await rm(temporaryRoot, { force: true, recursive: true })
}
