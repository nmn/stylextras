import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const metadataFileUrl = new URL('../dist/server/__waku_build_metadata.js', import.meta.url)
const metadataFile = fileURLToPath(metadataFileUrl)
const publicDirectory = fileURLToPath(new URL('../dist/public', import.meta.url))
const cachedElementsKey = 'defineRouter:cachedElements'

const source = await readFile(metadataFile, 'utf8')
const { buildMetadata } = await import(`${metadataFileUrl.href}?prune=${Date.now()}`)

if (!(buildMetadata instanceof Map)) {
  throw new TypeError('Waku build metadata did not export a Map.')
}

const cachedElementsSource = buildMetadata.get(cachedElementsKey)
if (typeof cachedElementsSource !== 'string') {
  throw new TypeError(`Waku build metadata is missing ${cachedElementsKey}.`)
}

const cachedElements = JSON.parse(cachedElementsSource)
let removedEntries = 0

for (const cacheId of Object.keys(cachedElements)) {
  if (!cacheId.startsWith('page:')) continue

  const routePath = cacheId.slice('page:'.length)
  if (!routePath.startsWith('/')) continue

  const rscRelativePath = routePath === '/' ? 'RSC/R/_root.txt' : `RSC/R/${routePath.slice(1)}.txt`
  const rscFile = path.resolve(publicDirectory, rscRelativePath)

  // Only remove cached pages that Waku emitted as static RSC assets. Shared
  // root/layout entries and pages without a static asset stay available to
  // the Worker runtime.
  if (!rscFile.startsWith(`${publicDirectory}${path.sep}`)) continue
  try {
    await access(rscFile)
  } catch {
    continue
  }

  delete cachedElements[cacheId]
  removedEntries += 1
}

if (removedEntries === 0) {
  console.log('No duplicated static page entries found in Waku build metadata.')
} else {
  buildMetadata.set(cachedElementsKey, JSON.stringify(cachedElements))
  const output = `export const buildMetadata = new Map(${JSON.stringify(Array.from(buildMetadata))});\n`
  await writeFile(metadataFile, output)

  const reduction = 1 - Buffer.byteLength(output) / Buffer.byteLength(source)
  console.log(
    `Pruned ${removedEntries} duplicated static pages from Waku build metadata (${(reduction * 100).toFixed(1)}% smaller).`,
  )
}
