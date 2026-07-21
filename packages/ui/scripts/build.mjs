import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformAsync } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'
import stylexPlugin from '@stylexjs/babel-plugin'
import ts from 'typescript'
import { generatePackageExports } from './generate-exports.mjs'
import { publicEntries } from './public-entries.mjs'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(packageRoot, 'src')
const buildRoot = path.join(packageRoot, '.build')
const outputRoot = path.join(packageRoot, 'dist')

function resolveStylexSource(importPath, sourceFilePath) {
  if (!importPath.startsWith('.')) return undefined
  const absolutePath = path.resolve(path.dirname(sourceFilePath), importPath)
  const candidates = [
    `${absolutePath}.ts`,
    `${absolutePath}.tsx`,
    path.join(absolutePath, 'index.ts'),
    path.join(absolutePath, 'index.tsx'),
  ]
  return candidates.find((candidate) => existsSync(candidate))
}

function publishedStylexPath(filePath) {
  const relativePath = path
    .relative(sourceRoot, filePath)
    .replace(/\.(ts|tsx)$/, '.js')
    .split(path.sep)
    .join('/')
  return `@stylextras/ui:dist/${relativePath}`
}

async function resolveSource(modulePath) {
  const withoutJsExtension = modulePath.replace(/\.js$/, '')
  const candidates = [
    `${withoutJsExtension}.ts`,
    `${withoutJsExtension}.tsx`,
    path.join(withoutJsExtension, 'index.ts'),
    path.join(withoutJsExtension, 'index.tsx'),
  ]

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate
    } catch {
      // Try the next supported TypeScript source shape.
    }
  }
  throw new Error(`Could not resolve source module ${modulePath}`)
}

async function reachableSourceFiles() {
  const queue = await Promise.all(
    Object.values(publicEntries).map((entry) => resolveSource(path.join(sourceRoot, entry))),
  )
  const visited = new Set()

  while (queue.length > 0) {
    const file = queue.pop()
    if (!file || visited.has(file)) continue
    visited.add(file)

    const source = await readFile(file, 'utf8')
    const imports = ts.preProcessFile(source, true, true).importedFiles
    for (const imported of imports) {
      if (!imported.fileName.startsWith('.')) continue
      if (/\.(css|json)$/.test(imported.fileName)) continue
      const dependency = await resolveSource(path.resolve(path.dirname(file), imported.fileName))
      if (!visited.has(dependency)) queue.push(dependency)
    }
  }

  return [...visited].sort()
}

await rm(buildRoot, { force: true, recursive: true })
await rm(outputRoot, { force: true, recursive: true })
await mkdir(buildRoot, { recursive: true })
await mkdir(outputRoot, { recursive: true })

const styleRules = []
const files = await reachableSourceFiles()

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const result = await transformAsync(source, {
    filename: file,
    plugins: [
      [
        stylexPlugin,
        {
          dev: false,
          runtimeInjection: false,
          unstable_moduleResolution: {
            type: 'custom',
            filePathResolver: resolveStylexSource,
            getCanonicalFilePath: publishedStylexPath,
          },
        },
      ],
    ],
    presets: [
      [presetTypescript, { allExtensions: true, isTSX: true }],
      [presetReact, { runtime: 'automatic' }],
    ],
    sourceType: 'module',
  })
  if (!result?.code) throw new Error(`Babel did not emit ${file}`)
  const relative = path.relative(sourceRoot, file).replace(/\.(ts|tsx)$/, '.js')
  const output = path.join(buildRoot, relative)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${result.code}\n`)
  if (Array.isArray(result.metadata.stylex)) styleRules.push(...result.metadata.stylex)
}

const entrypoints = Object.values(publicEntries).map((source) =>
  path.join(buildRoot, `${source}.js`),
)
const build = await Bun.build({
  entrypoints,
  external: [
    'react',
    'react/*',
    'react-dom',
    'react-dom/*',
    '@stylexjs/stylex',
    '@microsoft/focusgroup-polyfill/*',
  ],
  format: 'esm',
  minify: false,
  naming: {
    asset: 'assets/[name]-[hash].[ext]',
    chunk: 'chunks/[name]-[hash].[ext]',
    entry: '[dir]/[name].[ext]',
  },
  outdir: outputRoot,
  packages: 'external',
  root: buildRoot,
  splitting: false,
  target: 'browser',
})

if (!build.success) {
  for (const log of build.logs) console.error(log)
  throw new Error('Bun failed to build @stylextras/ui')
}

for (const sourcePath of Object.values(publicEntries)) {
  const sourceFile = await resolveSource(path.join(sourceRoot, sourcePath))
  const source = await readFile(sourceFile, 'utf8')
  const isClientEntrypoint =
    sourcePath.endsWith('/example') || /^['"]use client['"];?/m.test(source)
  if (!isClientEntrypoint) continue

  const outputFile = path.join(outputRoot, `${sourcePath}.js`)
  const compiled = await readFile(outputFile, 'utf8')
  if (!/^['"]use client['"];?/.test(compiled)) {
    await writeFile(outputFile, `'use client';\n${compiled}`)
  }
}

const generatedCss = stylexPlugin.processStylexRules(styleRules, { useLayers: true })
await writeFile(path.join(outputRoot, 'styles.css'), `${generatedCss}\n`)

const declarationConfig = path.join(buildRoot, 'tsconfig.declarations.json')
await writeFile(
  declarationConfig,
  `${JSON.stringify(
    {
      extends: path.join(packageRoot, 'tsconfig.build.json'),
      files,
      include: [],
    },
    null,
    2,
  )}\n`,
)
const declarationBuild = Bun.spawnSync(['bunx', 'tsc', '-p', declarationConfig], {
  cwd: packageRoot,
  stderr: 'inherit',
  stdout: 'inherit',
})
if (declarationBuild.exitCode !== 0) throw new Error('TypeScript declaration build failed')

await generatePackageExports()
await rm(buildRoot, { force: true, recursive: true })
