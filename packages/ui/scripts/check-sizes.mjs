import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { componentCatalog } from '../src/catalog.ts'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(packageRoot, 'dist')
const baselinePath = path.join(packageRoot, 'reports/size-baseline.json')
const updateBaseline = process.argv.includes('--update-baseline')
const compositeBudget = new Set(['calendar', 'combobox', 'command', 'date-picker', 'toast'])
const external = [
  'react',
  'react/*',
  '@stylexjs/stylex',
  '@microsoft/focusgroup-polyfill/*',
]

async function minifiedGzip(entrypoint, extraExternal = external) {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    external: extraExternal,
    format: 'esm',
    minify: true,
    target: 'browser',
  })
  if (!result.success) {
    throw new Error(`Could not measure ${entrypoint}: ${result.logs.join('\n')}`)
  }
  const output = result.outputs.find((item) => item.kind === 'entry-point')
  if (!output) throw new Error(`No JavaScript output produced for ${entrypoint}`)
  return gzipSync(Buffer.from(await output.arrayBuffer())).byteLength
}

const components = {}
const failures = []

for (const entry of componentCatalog) {
  if (entry.status !== 'stable') continue
  const entrypoint = path.join(outputRoot, entry.export, 'index.js')
  const gzipBytes = await minifiedGzip(entrypoint)
  const budgetBytes = (compositeBudget.has(entry.export) ? 12 : 8) * 1024
  const source = await readFile(path.join(packageRoot, 'src', entry.export, 'index.tsx'), 'utf8')
  const behaviorBytes = entry.mode === 'native' ? 0 : null

  if (gzipBytes > budgetBytes) {
    failures.push(
      `${entry.export}: ${gzipBytes} bytes gzip exceeds ${budgetBytes} byte entry budget`,
    )
  }
  if (entry.mode === 'native' && /^['"]use client['"]/m.test(source)) {
    failures.push(`${entry.export}: native-only entry entered the client-reference graph`)
  }

  components[entry.export] = {
    behaviorBytes,
    budgetBytes,
    gzipBytes,
    mode: entry.mode,
  }
}

const bridges = {
  interestInvoker: {
    budgetBytes: 2 * 1024,
    gzipBytes: await minifiedGzip(
      path.join(packageRoot, 'src/platform-polyfills/interest-invoker.ts'),
    ),
  },
  focusgroupFallback: {
    budgetBytes: 5 * 1024,
    gzipBytes: await minifiedGzip(
      path.join(
        packageRoot,
        '../../node_modules/@microsoft/focusgroup-polyfill/build/index-shadowless.min.mjs',
      ),
      [],
    ),
  },
}

for (const [name, measurement] of Object.entries(bridges)) {
  if (measurement.gzipBytes > measurement.budgetBytes) {
    failures.push(
      `${name}: ${measurement.gzipBytes} bytes gzip exceeds ${measurement.budgetBytes} byte fallback budget`,
    )
  }
}

const measurements = {
  bridges,
  components,
}

let baseline
try {
  baseline = JSON.parse(await readFile(baselinePath, 'utf8'))
} catch (error) {
  if (!updateBaseline) {
    throw new Error(`Missing size baseline at ${baselinePath}`, { cause: error })
  }
}

if (baseline && !updateBaseline) {
  for (const [entry, measurement] of Object.entries(components)) {
    const previous = baseline.components?.[entry]?.gzipBytes
    if (typeof previous === 'number' && measurement.gzipBytes > previous * 1.1) {
      failures.push(
        `${entry}: ${measurement.gzipBytes} bytes gzip is more than 10% above baseline ${previous}`,
      )
    }
  }
  for (const [name, measurement] of Object.entries(bridges)) {
    const previous = baseline.bridges?.[name]?.gzipBytes
    if (typeof previous === 'number' && measurement.gzipBytes > previous * 1.1) {
      failures.push(
        `${name}: ${measurement.gzipBytes} bytes gzip is more than 10% above baseline ${previous}`,
      )
    }
  }
}

await writeFile(
  path.join(outputRoot, 'size-report.json'),
  `${JSON.stringify(measurements, null, 2)}\n`,
)
if (updateBaseline) {
  await writeFile(baselinePath, `${JSON.stringify(measurements, null, 2)}\n`)
}

if (failures.length > 0) {
  throw new Error(`Bundle size checks failed:\n- ${failures.join('\n- ')}`)
}

const largest = Object.entries(components).sort(
  ([, left], [, right]) => right.gzipBytes - left.gzipBytes,
)[0]
console.log(
  `Size budgets passed for ${Object.keys(components).length} stable entries. ` +
    `Largest: ${largest?.[0]} (${largest?.[1].gzipBytes} bytes gzip).`,
)
