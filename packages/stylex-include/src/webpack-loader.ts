import type { LoaderContext, NormalModule } from 'webpack'
import * as t from '@babel/types'
import { parseSync } from '@babel/core'
import { generate } from '@babel/generator'

import { StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeOptions } from './types'

export default function styleXIncludeLoader(
  this: LoaderContext<StyleXIncludeOptions>,
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
        [importPath: string]: { [exportName: string]: t.ObjectExpression }
      } = {}

      for (const importPath in importedStyles) {
        if (!allowedStyleImports.includes(importPath)) {
          throw new Error(
            `Import from '${importPath}' in file '${this.resourcePath}' is not allowed`,
          )
        }

        resolvedImportedStyleObjects[importPath] = {}

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

        resolvedImportedStyleObjects[importPath] =
          dependencyTransformer.extractExportedStyles(importedModuleAst)

        for (const importName of importedStyles[importPath]!) {
          if (!resolvedImportedStyleObjects[importPath][importName]) {
            throw new Error(`File '${filename}' does not export '${importName}'`)
          }
        }
      }

      const transformer = new StyleXIncludeTransformer(
        {
          importSources,
          onlyAtBeginning,
        },
        (importPath, exportName) => {
          return resolvedImportedStyleObjects[importPath]?.[exportName] ?? null
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
