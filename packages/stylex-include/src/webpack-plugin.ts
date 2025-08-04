import type { Compiler } from 'webpack'
import * as t from '@babel/types'
import { parseSync } from '@babel/core'
import * as fs from 'fs'

import { StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeOptions } from './types'

export default class StyleXIncludePlugin {
  static readonly pluginName = 'StyleXIncludePlugin'

  private options: Required<StyleXIncludeOptions>
  private resolvedStyleObjects: { [filePath: string]: { [exportName: string]: t.ObjectExpression } } = {}

  constructor(options: StyleXIncludeOptions = {}) {
    const {
      importSources = ['@stylexjs/stylex'],
      allowedStyleExports = [],
      onlyAtBeginning = true,
    } = options

    this.options = {
      importSources,
      allowedStyleExports,
      onlyAtBeginning,
    }
  }

  private parseFile(filePath: string) {
    const isTypeScriptFile = filePath.endsWith('.ts') || filePath.endsWith('.tsx')

    const code = fs.readFileSync(filePath, 'utf8')

    const ast = parseSync(code, {
      filename: filePath,
      presets: ['@babel/preset-env', ...(isTypeScriptFile ? ['@babel/preset-typescript'] : [])],
    })

    if (!ast || !t.isFile(ast)) {
      return null
    }

    return ast
  }

  apply(compiler: Compiler) {
    const resolver = compiler.resolverFactory.get('normal', compiler.options.resolve)
    const dependencyTransformer = new StyleXIncludeTransformer(this.options)

    compiler.hooks.normalModuleFactory.tap(StyleXIncludePlugin.pluginName, (factory) => {
      factory.hooks.afterResolve.tapPromise(StyleXIncludePlugin.pluginName, async (resolveData) => {
        const moduleFilePath = resolveData.createData?.resource || resolveData.request

        if (!moduleFilePath) {
          return
        }

        try {
          const ast = this.parseFile(moduleFilePath)

          if (!ast) {
            return
          }

          const importedStyles = dependencyTransformer.extractImportedStyles(ast)
          const resolvedImports: { [importPath: string]: { [exportName: string]: t.ObjectExpression } } = {}

          // Load all imported styles that haven't been loaded yet
          for (const importPath in importedStyles) {
            resolvedImports[importPath] = {}
            
            const resolvedPath = await new Promise<string | null>((resolve, reject) => {
              resolver.resolve({}, moduleFilePath, importPath, {}, (err, result) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(result || null)
                }
              })
            })

            if (!resolvedPath) {
              throw new Error(`Could not resolve import from \`${importPath}\` in file \`${moduleFilePath}\``)
            }

            if (!this.options.allowedStyleExports.includes(resolvedPath)) {
              throw new Error(`Import from \`${importPath}\` in file \`${moduleFilePath}\` is not allowed`)
            }

            if (!this.resolvedStyleObjects[resolvedPath]) {
              const sourceAst = this.parseFile(resolvedPath)
              if (!sourceAst) {
                throw new Error(`Could not parse import source \`${resolvedPath}\``)
              }

              this.resolvedStyleObjects[resolvedPath] = dependencyTransformer.extractExportedStyles(sourceAst)
            }

            // Validate that we have all the exports we need
            for (const importName of importedStyles[importPath]!) {
              if (!this.resolvedStyleObjects[resolvedPath][importName]) {
                throw new Error(`Import from \`${importPath}\` in file \`${moduleFilePath}\` is missing export \`${importName}\``)
              }
              resolvedImports[importPath][importName] = this.resolvedStyleObjects[resolvedPath]![importName]!
            }
          }

          const transformer = new StyleXIncludeTransformer(this.options, (importPath, exportName) => {
            return resolvedImports[importPath]?.[exportName] ?? null
          })
          transformer.transformFile(ast)

          const { generate } = require('@babel/generator')
          const result = generate(ast, { filename: moduleFilePath })

          fs.writeFileSync(moduleFilePath, result.code)
        } catch (error) {
          console.warn(`StyleXIncludePlugin ran into an error while processing ${moduleFilePath}:`, error)
        }
      })
    })
  }
} 
