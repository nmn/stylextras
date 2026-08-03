import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const websiteDirectory = fileURLToPath(new URL('..', import.meta.url))
const repositoryDirectory = path.resolve(websiteDirectory, '../..')
const docsDirectory = path.join(websiteDirectory, 'content', 'docs')
const packageDirectory = path.join(repositoryDirectory, 'packages', 'ui')
const packageJson = JSON.parse(await readFile(path.join(packageDirectory, 'package.json'), 'utf8'))

async function mdxFiles(section) {
  const directory = path.join(docsDirectory, section)
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(directory, entry.name))
    .sort()
}

const exampleFiles = []
for (const section of ['components', 'experimental']) {
  for (const mdxFile of await mdxFiles(section)) {
    const source = await readFile(mdxFile, 'utf8')
    const relative = path.relative(websiteDirectory, mdxFile)
    const liveImport = /import Example from ["'](@stylextras\/ui\/[^"']+\/example)["'];/.exec(
      source,
    )
    const rawImport =
      /import exampleCode from ["'](@stylextras\/ui\/[^"']+\/example)\?raw["'];/.exec(source)
    if (!liveImport || !rawImport || liveImport[1] !== rawImport[1]) {
      throw new Error(`${relative}: live and raw example imports must reference the same module`)
    }
    if (!/<ComponentPreview\s+code=\{exampleCode\}\s+name=/.test(source)) {
      throw new Error(`${relative}: ComponentPreview must render its imported exampleCode`)
    }
    if (/^### Example code\s*$/m.test(source)) {
      throw new Error(`${relative}: duplicated Example code fence is not allowed`)
    }

    const exportKey = `.${liveImport[1].slice('@stylextras/ui'.length)}`
    const exportedFile = packageJson.exports[exportKey]
    if (typeof exportedFile !== 'string') {
      throw new Error(`${relative}: ${liveImport[1]} is not a public package export`)
    }
    exampleFiles.push(path.resolve(packageDirectory, exportedFile))
  }
}

const configFile = ts.readConfigFile(
  path.join(packageDirectory, 'tsconfig.test.json'),
  ts.sys.readFile,
)
if (configFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
}
const config = ts.parseJsonConfigFileContent(
  { ...configFile.config, files: exampleFiles, include: [] },
  ts.sys,
  packageDirectory,
  undefined,
  path.join(packageDirectory, 'tsconfig.test.json'),
)
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram(config.fileNames, config.options))
if (diagnostics.length > 0) {
  for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    if (!diagnostic.file || diagnostic.start === undefined) {
      console.error(`TS${diagnostic.code}: ${message}`)
      continue
    }
    const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    console.error(
      `${path.relative(repositoryDirectory, diagnostic.file.fileName)}:${position.line + 1}:${position.character + 1} TS${diagnostic.code}: ${message}`,
    )
  }
  process.exitCode = 1
} else {
  console.log(`Verified and type-checked ${exampleFiles.length} live documented examples.`)
}
