import type { Compiler, ResolveOptions, Resolver } from 'webpack'
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

  apply(compiler: Compiler) {
    const resolver = compiler.resolverFactory.get('normal', compiler.options.resolve)

    compiler.hooks.normalModuleFactory.tap(StyleXIncludePlugin.pluginName, (factory) => {
      factory.hooks.afterResolve.tapAsync(StyleXIncludePlugin.pluginName, async (resolveData, callback) => {
        const filePath = resolveData.createData?.resource || resolveData.request

        if (!filePath) {
          return callback()
        }

        const isTypeScriptFile = filePath.endsWith('.ts') || filePath.endsWith('.tsx')

        if (!isTypeScriptFile || filePath.endsWith('.js')) {
          return callback()
        }

        try {
          const code = fs.readFileSync(filePath, 'utf8')
          
          const ast = parseSync(code, {
            filename: filePath,
            presets: ['@babel/preset-env', ...(isTypeScriptFile ? ['@babel/preset-typescript'] : [])],
          })

          if (!ast || !t.isFile(ast)) {
            return callback()
          }

          const transformer = new StyleXIncludeTransformer(this.options, (importPath, exportName) => {
            const resolvedPath = resolver.resolveSync({}, filePath, importPath)

            if (!resolvedPath) {
              return null
            }

            if (this.resolvedStyleObjects[resolvedPath]?.[exportName]) {
              return this.resolvedStyleObjects[resolvedPath][exportName]
            }

            return null
          })
          transformer.transformFile(ast)

          // Generate the transformed code
          const { generate } = require('@babel/generator')
          const result = generate(ast, { filename: filePath })

          // Write the transformed code back to the file
          fs.writeFileSync(filePath, result.code)

          callback()
        } catch (error) {
          console.warn(`StyleXIncludePlugin ran into an error while processing ${filePath}:`, error)
          callback()
        }
      })
    })
  }
} 
