import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { publicEntries } from './public-entries.mjs'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packagePath = path.join(packageRoot, 'package.json')

export async function generatePackageExports() {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
  packageJson.exports = Object.fromEntries([
    ...Object.entries(publicEntries).map(([exportPath, sourcePath]) => [
      exportPath,
      {
        types: `./dist/${sourcePath}.d.ts`,
        import: `./dist/${sourcePath}.js`,
      },
    ]),
    ['./styles.css', './dist/styles.css'],
    ['./package.json', './package.json'],
  ])
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

if (import.meta.main) await generatePackageExports()
