import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentCatalog } from '@stylextras/ui/catalog'
import ts from 'typescript'

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = path.resolve(websiteRoot, '../..')
const packageSourceRoot = path.join(repositoryRoot, 'packages/ui/src')
const docsRoot = path.join(websiteRoot, 'content/docs')
const generatedRoot = path.join(websiteRoot, 'src/generated')

const normalize = (value) => value.replace(/\s+/g, ' ').trim()

function isExported(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
}

function nativeElementFrom(typeNode) {
  if (!ts.isTypeReferenceNode(typeNode)) return undefined
  const referenceName = typeNode.typeName.getText()
  if (
    referenceName !== 'ComponentProps' &&
    referenceName !== 'ComponentPropsWithRef' &&
    referenceName !== 'ComponentPropsWithoutRef'
  ) {
    return undefined
  }
  const argument = typeNode.typeArguments?.[0]
  return argument && ts.isLiteralTypeNode(argument) && ts.isStringLiteral(argument.literal)
    ? argument.literal.text
    : undefined
}

function resolveSymbol(checker, symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
}

function collectCapabilities(typeNode, checker, rootName, seen = new Set()) {
  const inherited = new Set()
  const native = new Set()

  const visit = (node) => {
    if (!node) return
    if (ts.isParenthesizedTypeNode(node) || ts.isTypeOperatorNode(node)) {
      visit(node.type)
      return
    }
    if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
      for (const type of node.types) visit(type)
      return
    }
    if (!ts.isTypeReferenceNode(node)) return

    const nativeElement = nativeElementFrom(node)
    if (nativeElement) native.add(nativeElement)

    const referenceName = node.typeName.getText()
    if (referenceName === 'Omit' || referenceName === 'Pick') {
      visit(node.typeArguments?.[0])
      return
    }

    const symbolAtNode = checker.getSymbolAtLocation(node.typeName)
    if (!symbolAtNode) return
    const symbol = resolveSymbol(checker, symbolAtNode)
    if (seen.has(symbol)) return
    seen.add(symbol)

    const declaration = symbol
      .getDeclarations()
      ?.find((candidate) => ts.isTypeAliasDeclaration(candidate))
    if (!declaration) return
    if (symbol.name !== rootName && symbol.name.endsWith('Props') && isExported(declaration)) {
      inherited.add(symbol.name)
    }
    visit(declaration.type)
  }

  visit(typeNode)
  return { inherited, native }
}

function componentDefaults(checker, moduleExports, componentName) {
  const exportSymbol = moduleExports.find((symbol) => symbol.name === componentName)
  if (!exportSymbol) return new Map()
  const symbol = resolveSymbol(checker, exportSymbol)
  const declaration = symbol
    .getDeclarations()
    ?.find((candidate) => ts.isFunctionDeclaration(candidate))
  const parameter = declaration?.parameters[0]
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return new Map()

  return new Map(
    parameter.name.elements
      .filter((element) => element.initializer && ts.isIdentifier(element.name))
      .map((element) => [element.name.text, normalize(element.initializer.getText())]),
  )
}

function extractComponentProps(program, filename) {
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(filename)
  if (!sourceFile) throw new Error(`TypeScript did not load ${filename}`)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`Could not inspect module exports for ${filename}`)
  const moduleExports = checker.getExportsOfModule(moduleSymbol)

  return moduleExports
    .filter((exportSymbol) => exportSymbol.name.endsWith('Props'))
    .map((exportSymbol) => {
      const symbol = resolveSymbol(checker, exportSymbol)
      const typeName = exportSymbol.name
      const componentName = typeName.replace(/Props$/, '')
      const declaration = symbol
        .getDeclarations()
        ?.find((candidate) => ts.isTypeAliasDeclaration(candidate))
      if (!declaration) return undefined

      const type = checker.getDeclaredTypeOfSymbol(symbol)
      const defaults = componentDefaults(checker, moduleExports, componentName)
      const capabilities = collectCapabilities(declaration.type, checker, typeName)
      const props = checker
        .getPropertiesOfType(type)
        .map((prop) => {
          const localDeclaration = prop
            .getDeclarations()
            ?.find((candidate) =>
              path.resolve(candidate.getSourceFile().fileName).startsWith(packageSourceRoot),
            )
          if (!localDeclaration || prop.name === 'className' || prop.name === 'style') {
            return undefined
          }
          const propType = checker.getTypeOfSymbolAtLocation(prop, localDeclaration)
          const description = ts.displayPartsToString(prop.getDocumentationComment(checker))
          return {
            default: defaults.get(prop.name),
            description: description ? normalize(description) : undefined,
            name: prop.name,
            required: !(prop.flags & ts.SymbolFlags.Optional),
            type: checker.typeToString(
              propType,
              localDeclaration,
              ts.TypeFormatFlags.NoTruncation |
                ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
            ),
          }
        })
        .filter(Boolean)
        .sort((left, right) => left.name.localeCompare(right.name))

      return {
        inherited: [...capabilities.inherited].sort(),
        name: componentName,
        native: [...capabilities.native].sort(),
        props,
        typeName,
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name))
}

async function generatePropData() {
  const configPath = path.join(repositoryRoot, 'packages/ui/tsconfig.json')
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  )
  const program = ts.createProgram({
    options: { ...parsedConfig.options, noEmit: true },
    rootNames: parsedConfig.fileNames,
  })
  const generated = {}
  for (const entry of componentCatalog) {
    const filename = path.join(packageSourceRoot, entry.export, 'index.tsx')
    const parts = extractComponentProps(program, filename)
    if (!parts.length) {
      throw new Error(`No public component prop types found for ${entry.export}`)
    }
    generated[entry.export] = {
      parts,
    }
  }

  await mkdir(generatedRoot, { recursive: true })
  await writeFile(
    path.join(generatedRoot, 'component-props.json'),
    `${JSON.stringify(generated, null, 2)}\n`,
  )
}

async function generateSizeData() {
  const candidates = [
    path.join(repositoryRoot, 'packages/ui/dist/size-report.json'),
    path.join(repositoryRoot, 'packages/ui/reports/size-baseline.json'),
  ]
  let report
  for (const candidate of candidates) {
    try {
      report = JSON.parse(await readFile(candidate, 'utf8'))
      break
    } catch {
      // A clean install can fall through to the checked-in baseline.
    }
  }
  const sizes = Object.fromEntries(
    Object.entries(report?.components ?? {}).map(([entry, measurement]) => [
      entry,
      {
        budgetBytes: measurement.budgetBytes,
        gzipBytes: measurement.gzipBytes,
      },
    ]),
  )
  await mkdir(generatedRoot, { recursive: true })
  await writeFile(
    path.join(generatedRoot, 'component-sizes.json'),
    `${JSON.stringify(sizes, null, 2)}\n`,
  )
}

const frontmatter = (title, description) => `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---
`

const exampleIdentifier = (entry) =>
  `${entry.export
    .split(/[/-]/)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('')}Example`

function componentPage(entry) {
  return `${frontmatter(entry.name, entry.description)}
## Examples

<ComponentPreview name=${JSON.stringify(entry.name)}>
  <CatalogExample exportPath=${JSON.stringify(entry.export)} />
</ComponentPreview>

<CatalogEntry exportPath=${JSON.stringify(entry.export)} />
`
}

const getStarted = `${frontmatter(
  'Get started',
  'Install the native-first Stylextras UI package and apply its StyleX themes.',
)}
Stylextras combines implementation and tokenized styling in each public component.
There is no unstyled primitive layer, provider, or theme root.

## Install

\`\`\`sh
bun add @stylextras/ui @stylexjs/stylex react
\`\`\`

Import the compiled component CSS once at your application root.

\`\`\`tsx
import "@stylextras/ui/styles.css";
\`\`\`

## Import components

Every stable component has a canonical subpath and there is no package barrel.

\`\`\`tsx
import { Button } from "@stylextras/ui/button";
import { Select } from "@stylextras/ui/select";

export function Example() {
  return (
    <form>
      <Select name="priority" defaultValue="normal">
        <option value="normal">Normal</option>
        <option value="urgent">Urgent</option>
      </Select>
      <Button type="submit">Save</Button>
    </form>
  );
}
\`\`\`

## Apply themes directly

Theme exports are ordinary StyleX style objects. Apply any combination to any
element; no provider, context, or client JavaScript is involved.

\`\`\`tsx
import * as stylex from "@stylexjs/stylex";
import { colorThemes } from "@stylextras/ui/color-themes";
import { radiusThemes } from "@stylextras/ui/radius-themes";
import { spacingThemes } from "@stylextras/ui/spacing-themes";

export function ThemeBoundary({ children }) {
  return (
    <section
      {...stylex.props(
        colorThemes.zinc,
        spacingThemes.compact,
        radiusThemes.rounded,
      )}
    >
      {children}
    </section>
  );
}
\`\`\`

The independent variable groups are colors, spacing, radius, stroke,
typography, elevation, blur, and motion. Each group keeps its themeable core and
same-set derived values together.
`

const themes = `${frontmatter(
  'Themes',
  'Seven color themes and compact companion theme families, all applied as plain StyleX styles.',
)}

<ThemeGallery />

## Composition

Color, spacing, radius, stroke, typography, elevation, blur, and motion remain
independent variable groups. A theme overrides core values in one group; its
same-set derived values recompute automatically.
`

const migration = `${frontmatter(
  'Migrating to 0.2',
  'Breaking changes for the native-first 0.2 prerelease.',
)}

Version 0.2 is intentionally breaking and ships no compatibility shims.

| Before | 0.2 canonical path |
| --- | --- |
| \`alert-callout\` | \`alert\` |
| \`breadcrumbs\` | \`breadcrumb\` |
| \`combo-box\` | \`combobox\` |
| \`empty-state\` | \`empty\` |
| \`text-area\` | \`textarea\` |
| \`disclosure\` | \`collapsible\` |
| \`disclosure-group\` | \`accordion\` |
| \`progress-bar\` | \`progress\` |
| \`window-splitter\` | \`resizable\` |
| \`menu\` | \`dropdown-menu\` |
| \`icon-button\` | icon-sized \`button\` variants |

## Behavioral changes

- \`Select\` always renders a native \`select\`; use \`Combobox\` for filtering
  and typeahead.
- Dialogs use \`commandfor\` and explicit target IDs. Popovers use
  \`popovertarget\`.
- Native uncontrolled behavior is the default. Controlled dialog and popover
  adapters are isolated under their \`/client\` entrypoints.
- Themes are plain \`stylex.createTheme()\` objects. There is no theme provider or
  wrapper component.
- Incomplete advanced controls moved under \`@stylextras/ui/experimental/*\`.
`

const recipes = `${frontmatter(
  'Recipes',
  'Integration guidance for feature engines that stay outside the component package.',
)}

Chart rendering, data-grid engines, and form-library adapters are recipes rather
than runtime dependencies. They compose stable Stylextras components while the
consumer retains ownership of data, validation, virtualization, and charting.

## Data tables

Use the semantic \`Table\` parts for rendering. Sorting, pagination, and
virtualization remain in the consumer's chosen data engine.

## Forms

Native controls expose ordinary form names, values, validity, reset behavior,
and refs. Form libraries can register them without a package-specific adapter.

## Charts

Use the color and typography variables from their public token entrypoints to
style the output of any chart engine. Stylextras does not bundle a renderer.
`

async function generateMdx() {
  await Promise.all(
    componentCatalog.map(async (entry) => {
      const demoSlug = entry.export.replace('experimental/', '')
      const demoFile = path.join(packageSourceRoot, demoSlug, 'example.tsx')
      try {
        await readFile(demoFile, 'utf8')
      } catch (error) {
        throw new Error(`Missing documentation demo for ${entry.export}: ${demoFile}`, {
          cause: error,
        })
      }
    }),
  )

  await rm(docsRoot, { force: true, recursive: true })
  const stableRoot = path.join(docsRoot, 'components')
  const experimentalRoot = path.join(docsRoot, 'experimental')
  await mkdir(stableRoot, { recursive: true })
  await mkdir(experimentalRoot, { recursive: true })

  await writeFile(
    path.join(generatedRoot, 'catalog-examples.ts'),
    `${componentCatalog
      .map((entry) => {
        return `import ${exampleIdentifier(entry)} from "@stylextras/ui/${entry.export}/example";`
      })
      .join('\n')}\n\nexport const catalogExamples = {\n${componentCatalog
      .map((entry) => `  ${JSON.stringify(entry.export)}: ${exampleIdentifier(entry)},`)
      .join('\n')}\n} as const;\n`,
  )

  const stable = componentCatalog.filter((entry) => entry.status === 'stable')
  const experimental = componentCatalog.filter((entry) => entry.status === 'experimental')

  await Promise.all(
    stable.map((entry) =>
      writeFile(path.join(stableRoot, `${entry.export}.mdx`), componentPage(entry)),
    ),
  )
  await Promise.all(
    experimental.map((entry) => {
      const slug = entry.export.replace('experimental/', '')
      return writeFile(path.join(experimentalRoot, `${slug}.mdx`), componentPage(entry))
    }),
  )

  await writeFile(path.join(docsRoot, 'get-started.mdx'), getStarted)
  await writeFile(path.join(docsRoot, 'themes.mdx'), themes)
  await writeFile(path.join(docsRoot, 'migration-0.2.mdx'), migration)
  await writeFile(path.join(docsRoot, 'recipes.mdx'), recipes)
  await writeFile(
    path.join(docsRoot, 'meta.json'),
    `${JSON.stringify(
      {
        pages: [
          './get-started.mdx',
          './themes.mdx',
          './migration-0.2.mdx',
          './components',
          './experimental',
          './recipes.mdx',
        ],
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    path.join(stableRoot, 'meta.json'),
    `${JSON.stringify(
      {
        title: 'Stable components',
        pages: stable.map((entry) => `./${entry.export}.mdx`),
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    path.join(experimentalRoot, 'meta.json'),
    `${JSON.stringify(
      {
        title: 'Experimental',
        pages: experimental.map((entry) => `./${entry.export.replace('experimental/', '')}.mdx`),
      },
      null,
      2,
    )}\n`,
  )
}

await Promise.all([generatePropData(), generateSizeData(), generateMdx()])
