import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const websiteDirectory = fileURLToPath(new URL('..', import.meta.url))
const docsDirectory = path.join(websiteDirectory, 'content', 'docs')
const cacheDirectory = path.join(websiteDirectory, '.cache')
const sections = ['components', 'experimental']

/**
 * Documentation convention: the TSX fence immediately following the unique
 * `### Example code` heading is a complete, exported example and is type-checked.
 * Other TSX fences are deliberately excluded because Import and Anatomy sections
 * are API fragments rather than standalone modules. Component-relative imports
 * are rewritten to package export paths; package-private StyleX token imports
 * remain source-bound because they style the package-owned demo rather than form
 * part of the component's public API.
 */
function extractExample(source, file) {
  const heading = /^### Example code\s*$/gm
  const headings = [...source.matchAll(heading)]
  if (headings.length !== 1) {
    throw new Error(`${file}: expected exactly one \`### Example code\` heading`)
  }

  const headingMatch = headings[0]
  const headingEnd = (headingMatch.index ?? 0) + headingMatch[0].length
  const remainder = source.slice(headingEnd)
  const fence = /^\s*```tsx[^\n]*\n([\s\S]*?)^```\s*$/m.exec(remainder)
  if (!fence || fence.index !== 0) {
    throw new Error(`${file}: expected a TSX fence immediately after \`### Example code\``)
  }

  const code = fence[1]
  if (!code.includes('export default function Example')) {
    throw new Error(`${file}: Example code must export \`function Example\` as default`)
  }

  const codeOffset = headingEnd + fence[0].indexOf(code)
  const line = source.slice(0, codeOffset).split('\n').length
  return { code, line }
}

function publicModule(section, slug, localModule) {
  const base = `@stylextras/ui/${section === 'experimental' ? 'experimental/' : ''}${slug}`
  return localModule === 'index' ? base : `${base}/${localModule}`
}

function replaceLocalImports(code, section, slug) {
  return code.replace(
    /from\s+(['"])(\.\.?\/[^'"]+)\1/g,
    (_match, quote, relativeModule) => {
      if (relativeModule.startsWith('../tokens/')) {
        return `from ${quote}@stylextras/ui-internal/${relativeModule.slice(3)}${quote}`
      }
      if (relativeModule.startsWith('../')) {
        return `from ${quote}@stylextras/ui/${relativeModule.slice(3)}${quote}`
      }
      return `from ${quote}${publicModule(section, slug, relativeModule.slice(2))}${quote}`
    },
  )
}

async function getMdxFiles(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(directory, entry.name))
    .sort()
}

async function main() {
  await mkdir(cacheDirectory, { recursive: true })
  const generatedDirectory = await mkdtemp(path.join(cacheDirectory, 'doc-example-typecheck-'))

  const generatedFiles = []
  const sourceLocations = new Map()

  try {
    for (const section of sections) {
      const sectionDirectory = path.join(docsDirectory, section)
      for (const mdxFile of await getMdxFiles(sectionDirectory)) {
        const slug = path.basename(mdxFile, '.mdx')
        const source = await readFile(mdxFile, 'utf8')
        const example = extractExample(source, path.relative(websiteDirectory, mdxFile))
        const generatedFile = path.join(generatedDirectory, `${section}--${slug}.tsx`)
        const generatedSource = replaceLocalImports(example.code, section, slug)

        await writeFile(generatedFile, generatedSource)
        generatedFiles.push(generatedFile)
        sourceLocations.set(path.resolve(generatedFile), {
          file: path.relative(websiteDirectory, mdxFile),
          line: example.line,
        })
      }
    }

    const configFile = ts.readConfigFile(
      path.join(websiteDirectory, 'tsconfig.json'),
      ts.sys.readFile,
    )
    if (configFile.error) {
      throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
    }

    const config = ts.parseJsonConfigFileContent(
      {
        ...configFile.config,
        compilerOptions: {
          ...configFile.config.compilerOptions,
          incremental: false,
          noEmit: true,
          paths: {
            ...configFile.config.compilerOptions.paths,
            '@stylextras/ui-internal/*': ['../../packages/ui/src/*'],
          },
          types: [...(configFile.config.compilerOptions.types ?? []), 'node'],
        },
        files: generatedFiles,
      },
      ts.sys,
      websiteDirectory,
      undefined,
      path.join(websiteDirectory, 'tsconfig.json'),
    )
    const program = ts.createProgram(config.fileNames, config.options)
    const diagnostics = ts.getPreEmitDiagnostics(program)

    if (diagnostics.length > 0) {
      for (const diagnostic of diagnostics) {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        if (!diagnostic.file || diagnostic.start === undefined) {
          console.error(`TS${diagnostic.code}: ${message}`)
          continue
        }

        const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        const sourceLocation = sourceLocations.get(path.resolve(diagnostic.file.fileName))
        const file = sourceLocation?.file ?? path.relative(websiteDirectory, diagnostic.file.fileName)
        const line = (sourceLocation?.line ?? 1) + position.line
        console.error(`${file}:${line}:${position.character + 1} TS${diagnostic.code}: ${message}`)
      }
      process.exitCode = 1
      return
    }

    console.log(`Type-checked ${generatedFiles.length} documented TSX examples.`)
  } finally {
    await rm(generatedDirectory, { force: true, recursive: true })
  }
}

await main()
