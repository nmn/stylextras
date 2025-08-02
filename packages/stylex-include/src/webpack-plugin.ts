import type { Compiler, NormalModuleFactory } from 'webpack'
import * as t from '@babel/types'
import { parseSync } from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'

import { StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeOptions } from './types'

export interface StyleXIncludeWebpackPluginOptions extends StyleXIncludeOptions {
  /**
   * Optional function to customize how imported files are resolved
   * Defaults to using Webpack's module resolution
   */
  resolveModule?: (importPath: string, context: string) => string | null
}

export class StyleXIncludeWebpackPlugin {
  private transformer: StyleXIncludeTransformer
  private options: Required<StyleXIncludeWebpackPluginOptions>
  private styleCache = new Map<string, { [exportName: string]: t.ObjectExpression }>()

  constructor(options: StyleXIncludeWebpackPluginOptions = {}) {
    const {
      importSources = ['@stylexjs/stylex'],
      allowedStyleImports = [],
      onlyAtBeginning = true,
      resolveModule,
    } = options

    this.options = {
      importSources,
      allowedStyleImports,
      onlyAtBeginning,
      resolveModule: resolveModule || this.defaultResolveModule.bind(this),
    }

    this.transformer = new StyleXIncludeTransformer(
      {
        importSources,
        allowedStyleImports,
        onlyAtBeginning,
      },
      this.resolveImportedStyleObject.bind(this)
    )
  }

  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap('StyleXIncludeWebpackPlugin', (factory: NormalModuleFactory) => {
      factory.hooks.afterResolve.tapAsync('StyleXIncludeWebpackPlugin', (resolveData, callback) => {
        // Only process JavaScript files
        if (!resolveData.resource.endsWith('.js') && !resolveData.resource.endsWith('.ts') && !resolveData.resource.endsWith('.tsx')) {
          return callback()
        }

        try {
          const filePath = resolveData.resource
          const code = fs.readFileSync(filePath, 'utf8')
          
          // Parse the file
          const ast = parseSync(code, {
            filename: filePath,
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          })

          if (!ast || !t.isFile(ast)) {
            return callback()
          }

          // Transform the file
          this.transformer.transform(ast)

          // Generate the transformed code
          const { generate } = require('@babel/generator')
          const result = generate(ast, { filename: filePath })

          // Write the transformed code back to the file
          fs.writeFileSync(filePath, result.code)

          callback()
        } catch (error) {
          // Log error but don't fail the build
          console.warn(`StyleXIncludeWebpackPlugin error processing ${resolveData.resource}:`, error)
          callback()
        }
      })
    })
  }

  /**
   * Resolves imported style objects for cross-file includes
   */
  private resolveImportedStyleObject(importPath: string, exportName: string): t.ObjectExpression | null {
    try {
      // Check if this import is allowed
      if (this.options.allowedStyleImports.length > 0 && !this.options.allowedStyleImports.includes(importPath)) {
        throw new Error(`Imported style object from \`${importPath}\` is not allowed`)
      }

      // Resolve the actual file path
      const resolvedPath = this.options.resolveModule(importPath, process.cwd())
      if (!resolvedPath) {
        return null
      }

      // Check cache first
      const cacheKey = `${resolvedPath}:${exportName}`
      if (this.styleCache.has(cacheKey)) {
        return this.styleCache.get(cacheKey)![exportName] || null
      }

      // Read and parse the imported file
      const code = fs.readFileSync(resolvedPath, 'utf8')
      const ast = parseSync(code, {
        filename: resolvedPath,
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      })

      if (!ast || !t.isFile(ast)) {
        return null
      }

      // Extract exported styles
      const exportedStyles = this.transformer.extractExportedStyles(ast)
      
      // Cache the results
      this.styleCache.set(cacheKey, exportedStyles)

      return exportedStyles[exportName] || null
    } catch (error) {
      console.warn(`Failed to resolve imported style object from ${importPath}:`, error)
      return null
    }
  }

  /**
   * Default module resolution using Node.js require.resolve
   */
  private defaultResolveModule(importPath: string, context: string): string | null {
    try {
      // Handle relative imports
      if (importPath.startsWith('.')) {
        return require.resolve(path.resolve(context, importPath))
      }
      
      // Handle absolute imports
      if (importPath.startsWith('/')) {
        return importPath
      }

      // Handle package imports (limited support)
      return require.resolve(importPath, { paths: [context] })
    } catch {
      return null
    }
  }
} 