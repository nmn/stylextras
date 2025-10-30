import type { LoaderContext, NormalModule } from 'webpack'
import * as t from '@babel/types'
import { parseSync } from '@babel/core'
import { generate } from '@babel/generator'

import { StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeWebpackLoaderOptions } from './types'
import { injectImport, generateNonConflictingName, renameIdentifierInObject } from './utils'

/**
 * A Webpack loader that uses {@link StyleXIncludeTransformer} to transform files containing
 * `stylex.include` usages. Cross-file `stylex.include` usages are resolved recursively using the
 * [`loadModule`](https://webpack.js.org/api/loaders/#thisloadmodule) method of the loader context.
 */
export default function styleXIncludeLoader(
  this: LoaderContext<StyleXIncludeWebpackLoaderOptions>,
  source: string,
  sourceMap?: string,
) {
  const callback = this.async()
  const options = this.getOptions()

  const {
    importSources = ['@stylexjs/stylex'],
    allowedStyleImports = [],
    onlyAtBeginning = true,
  } = options

  const parseCode = (code: string, filename: string) => {
    const isTypeScriptFile = filename.endsWith('.ts') || filename.endsWith('.tsx')
    const isReactFile = filename.endsWith('.jsx') || filename.endsWith('.tsx')

    const ast = parseSync(code, {
      filename,
      presets: [
        '@babel/preset-env',
        ...(isTypeScriptFile ? ['@babel/preset-typescript'] : []),
        ...(isReactFile ? ['@babel/preset-react'] : []),
      ],
    })

    if (!ast || !t.isFile(ast)) {
      return null
    }

    return ast
  }

  const processModule = async () => {
    try {
      const ast = parseCode(source, this.resourcePath)

      if (!ast) {
        return {
          source,
          sourceMap,
        }
      }

      const dependencyTransformer = new StyleXIncludeTransformer({
        importSources,
        onlyAtBeginning,
      })

      const importedStyles = dependencyTransformer.extractImportedStyles(ast)
      const resolvedImportedStyleObjects: {
        [importPath: string]: {
          filename: string
          styles: {
            [exportName: string]: {
              object: t.ObjectExpression
              dependencies: {
                id: t.Identifier
                importDeclaration: t.ImportDeclaration
              }[]
            }
          }
        }
      } = {}

      for (const importPath in importedStyles) {
        if (!allowedStyleImports.includes(importPath)) {
          throw new Error(
            `Import from '${importPath}' in file '${this.resourcePath}' is not allowed`,
          )
        }

        const [source, filename] = await new Promise<[source: string, path: string]>(
          (resolve, reject) => {
            this.loadModule(importPath, (err, source, _, module) => {
              if (err) {
                reject(err)
              } else if (!source) {
                reject(new Error(`Imported module '${importPath}' is empty`))
              } else if (typeof source !== 'string') {
                reject(new Error(`Imported module '${importPath}' is binary`))
              } else if (!(module as NormalModule).resource) {
                reject(new Error(`Imported module '${importPath}' is not a normal module`))
              } else {
                resolve([source, (module as NormalModule).resource])
              }
            })
          },
        )

        const importedModuleAst = parseCode(source, filename)

        if (!importedModuleAst) {
          throw new Error(`Could not parse '${filename}'`)
        }

        resolvedImportedStyleObjects[importPath] = {
          filename,
          styles: dependencyTransformer.extractExportedStyles(importedModuleAst),
        }

        for (const importName of importedStyles[importPath]!) {
          if (!resolvedImportedStyleObjects[importPath].styles[importName]) {
            throw new Error(`File '${filename}' does not export '${importName}'`)
          }
        }
      }

      // Inject external dependencies, if any
      for (const importPath in resolvedImportedStyleObjects) {
        const { filename, styles } = resolvedImportedStyleObjects[importPath]!
        for (const exportName in styles) {
          const styleEntry = styles[exportName]!
          const dependencies = styleEntry.dependencies ?? []

          for (const { id, importDeclaration } of dependencies) {
            // Detect if the identifier conflicts with any existing identifier in the file
            const finalName = generateNonConflictingName(ast, id.name)

            // If the name was changed, rename all occurrences in the object expression
            if (finalName !== id.name) {
              renameIdentifierInObject(styleEntry.object, id.name, finalName)
            }

            // Inject the import with the potentially aliased name
            injectImport(ast, id, importDeclaration, this.resourcePath, filename, finalName)
          }
        }
      }

      const transformer = new StyleXIncludeTransformer(
        {
          importSources,
          onlyAtBeginning,
        },
        (importPath, exportName) => {
          return resolvedImportedStyleObjects[importPath]?.styles[exportName]?.object ?? null
        },
      )

      transformer.transformFile(ast)
      const result = generate(ast, { filename: this.resourcePath, sourceMaps: true })

      return {
        source: result.code,
        sourceMap: result.map?.file,
      }
    } catch (error) {
      if (error instanceof Error) {
        this.emitError(error)
      } else {
        this.emitError(new Error(`Error while processing '${this.resourcePath}': ${error}`))
      }
      return {
        source,
        sourceMap,
      }
    }
  }

  processModule()
    .then(({ source, sourceMap }) => {
      callback(null, source, sourceMap)
    })
    .catch((error) => {
      callback(error)
    })
}
