import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const websiteDirectory = fileURLToPath(new URL('..', import.meta.url))
const repositoryDirectory = path.resolve(websiteDirectory, '../..')
const docsDirectory = path.join(websiteDirectory, 'content', 'docs')
const packageDirectory = path.join(repositoryDirectory, 'packages', 'ui')
const packageSourceDirectory = path.join(packageDirectory, 'src')
const packageJson = JSON.parse(await readFile(path.join(packageDirectory, 'package.json'), 'utf8'))

const configFile = ts.readConfigFile(path.join(packageDirectory, 'tsconfig.json'), ts.sys.readFile)
if (configFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
}
const config = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  packageDirectory,
  undefined,
  path.join(packageDirectory, 'tsconfig.json'),
)
const program = ts.createProgram(config.fileNames, config.options)
const checker = program.getTypeChecker()

const propertyName = (node) => {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node))
    return node.text
  return undefined
}

function exported(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

function componentNames(sourceFile) {
  const names = new Set()
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && exported(statement) && statement.name) {
      if (/^[A-Z]/.test(statement.name.text)) names.add(statement.name.text)
    }
    if (ts.isVariableStatement(statement) && exported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && /^[A-Z]/.test(declaration.name.text)) {
          names.add(declaration.name.text)
        }
      }
    }
  }
  return names
}

function packageProps(typeNode) {
  const props = new Set()
  for (const property of checker.getPropertiesOfType(checker.getTypeAtLocation(typeNode))) {
    if (property.getName().startsWith('aria-')) continue
    const isDeclaredByPackage = property.declarations?.some((declaration) => {
      const fileName = declaration.getSourceFile().fileName
      return (
        fileName === packageSourceDirectory ||
        fileName.startsWith(`${packageSourceDirectory}${path.sep}`)
      )
    })
    if (isDeclaredByPackage) {
      props.add(property.getName())
    }
  }
  return props
}

function defaultedProps(sourceFile, component) {
  const props = new Set()
  for (const statement of sourceFile.statements) {
    if (!ts.isFunctionDeclaration(statement) || statement.name?.text !== component) continue
    const parameter = statement.parameters[0]
    if (!parameter || !ts.isObjectBindingPattern(parameter.name)) continue
    for (const element of parameter.name.elements) {
      if (!element.initializer) continue
      const name = propertyName(element.propertyName ?? element.name)
      if (name) props.add(name)
    }
  }
  return props
}

function semanticDescription(description) {
  return description
    .replace(/`[^`]*`/g, ' ')
    .replace(/Default:\s*(?:`[^`]*`|[^.;]+)[.;]?/g, ' ')
    .replace(/\b(?:Required|Optional|No default)\.?/g, ' ')
    .replace(/\([^)]*\)\s*=>\s*\w+/g, ' ')
    .replace(/[\s.,;:'"|/()[\]{}<>-]+/g, ' ')
    .trim()
}

async function mdxFiles(section) {
  const directory = path.join(docsDirectory, section)
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(directory, entry.name))
}

const failures = []
let documentedComponents = 0
let documentedProps = 0
const requiredSections = [
  '## Examples',
  '## Usage',
  '## Import',
  '## Anatomy',
  '## Accessibility and browser behavior',
  '## API reference',
]
for (const section of ['components', 'experimental']) {
  for (const mdxFile of await mdxFiles(section)) {
    const docs = await readFile(mdxFile, 'utf8')
    const relativeDocs = path.relative(websiteDirectory, mdxFile)
    for (const heading of requiredSections) {
      if (!docs.includes(heading)) failures.push(`${relativeDocs}: missing ${heading} section`)
    }
    const exampleImport = /import Example from ["'](@stylextras\/ui\/[^"']+)\/example["'];/.exec(
      docs,
    )
    if (!exampleImport) {
      failures.push(`${relativeDocs}: missing public Example import`)
      continue
    }
    const exportKey = `.${exampleImport[1].slice('@stylextras/ui'.length)}`
    const sourceExport = packageJson.exports[exportKey]
    if (typeof sourceExport !== 'string') {
      failures.push(`${relativeDocs}: ${exampleImport[1]} is not a component export`)
      continue
    }
    const sourceFilePath = path.resolve(packageDirectory, sourceExport)
    const source = await readFile(sourceFilePath, 'utf8')
    const sourceFile = program.getSourceFile(sourceFilePath)
    if (!sourceFile) {
      failures.push(`${relativeDocs}: ${sourceFilePath} is missing from the UI TypeScript program`)
      continue
    }
    const components = componentNames(sourceFile)
    const propsTypes = new Map()
    for (const statement of sourceFile.statements) {
      if (
        (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) &&
        exported(statement) &&
        statement.name.text.endsWith('Props')
      ) {
        propsTypes.set(statement.name.text, statement)
      }
    }

    for (const component of components) {
      const propsType = propsTypes.get(`${component}Props`)
      if (!propsType) continue
      documentedComponents += 1
      const heading = `### ${component}`
      const apiReference = docs.indexOf('## API reference')
      const start = docs.indexOf(heading, apiReference)
      if (start === -1) {
        failures.push(`${relativeDocs}: missing ${heading} API section`)
        continue
      }
      const next = docs.indexOf('\n### ', start + heading.length)
      const api = docs.slice(start, next === -1 ? undefined : next)
      const requiredProps = packageProps(propsType)
      for (const name of defaultedProps(sourceFile, component)) requiredProps.add(name)
      if (source.includes('SxProp') || source.includes('sx?:')) requiredProps.add('sx')
      documentedProps += requiredProps.size
      for (const prop of requiredProps) {
        const prefix = `- \`${prop}\` — `
        const bullet = api.split('\n').find((line) => line.startsWith(prefix))
        if (!bullet) {
          failures.push(`${relativeDocs}: ${component}.${prop} needs a descriptive API bullet`)
          continue
        }
        if (semanticDescription(bullet.slice(prefix.length)).length < 14) {
          failures.push(`${relativeDocs}: ${component}.${prop} needs a behavioral description`)
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `Verified ${documentedProps} package-defined API props across ${documentedComponents} components.`,
  )
}
