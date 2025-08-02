import { parseSync } from '@babel/core'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import { StyleXIncludeTransformer } from '../src/transformer'
import { type StyleXIncludeOptions } from '../src/types'
import * as fs from 'fs'
import * as path from 'path'
import { describe, it, expect } from 'vitest'

describe('StyleXIncludeTransformer', () => {
  const createTransformer = (options: Omit<StyleXIncludeOptions, 'allowedStyleImports'> = {}) => {
    const transformer = new StyleXIncludeTransformer(
      {
        importSources: ['@stylexjs/stylex'],
        onlyAtBeginning: false,
        ...options,
      },
      (importPath, exportName) => {
        // Mock resolver for cross-file imports
        const fixtureMap: Record<string, string> = {
          './typography.js': 'typography',
          './colors.js': 'colors',
        }
        
        const expectedExport = fixtureMap[importPath]
        if (expectedExport && exportName === expectedExport) {
          const fixturePath = path.join(__dirname, '__fixtures__', path.basename(importPath))
          const code = fs.readFileSync(fixturePath, 'utf8')
          const ast = parseSync(code, {
            filename: fixturePath,
            presets: ['@babel/preset-env'],
          })
          
          if (!ast) return null
          
          const exportedStyles: Record<string, t.ObjectExpression> = transformer.extractExportedStyles(ast)
          return exportedStyles[expectedExport] ?? null
        }

        return null
      }
    )
    return transformer
  }

  const transform = (code: string, options: StyleXIncludeOptions = {}) => {
    const transformer = createTransformer(options)
    const ast = parseSync(code, {
      filename: 'test.js',
      presets: ['@babel/preset-env'],
    })

    if (!ast) throw new Error('Failed to parse code')

    transformer.transformFile(ast)
    return ast
  }

  const codeToString = (ast: any) => {
    return generate(ast, {
      jsescOption: {
        quotes: 'single',
      }
    }).code
  }

  describe('basic functionality', () => {
    it('should transform basic stylex.include calls', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px'
          }
        })

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("fontSize: '16px'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
      expect(code).not.toContain('stylex.include')
    })

    it('should handle recursive includes', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const baseStyles = stylex.create({
          base: {
            padding: '8px',
            margin: '4px'
          }
        })

        const typography = stylex.create({
          textStrong: {
            ...stylex.include(baseStyles.base),
            fontWeight: 'bold',
            fontSize: '16px'
          }
        })

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expect(code).toContain("padding: '8px'")
      expect(code).toContain("margin: '4px'")
      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("fontSize: '16px'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
    })

    it('should handle property overrides', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'black'
          }
        })

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            fontSize: '18px', // This should override the included fontSize
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      // The fontSize should be overridden to 18px
      expect(code).toContain("fontSize: '18px'")
      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("color: 'black'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
    })
  })

  describe('onlyAtBeginning option', () => {
    it('should allow includes at the beginning', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px'
          }
        })

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong), // This should be allowed
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input, { onlyAtBeginning: true })
      const code = codeToString(result)

      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("fontSize: '16px'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
    })

    it('should throw error when include is not at beginning', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px'
          }
        })

        const styles = stylex.create({
          button: {
            width: 100,
            ...stylex.include(typography.textStrong), // This should cause an error
            height: 50,
          }
        })
      `

      expect(() => {
        transform(input, { onlyAtBeginning: true })
      }).toThrow('All `stylex.include` usages must be at the beginning')
    })

    it('should not throw error when onlyAtBeginning is false', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px'
          }
        })

        const styles = stylex.create({
          button: {
            width: 100,
            ...stylex.include(typography.textStrong), // This should cause an error
            height: 50,
          }
        })
      `

      expect(() => {
        transform(input, { onlyAtBeginning: false })
      }).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle missing arguments gracefully', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          button: {
            ...stylex.include()
          }
        })
      `

      expect(() => {
        transform(input)
      }).toThrow('Unexpected argument for `stylex.include`')
    })

    it('should handle unresolved style objects gracefully', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          button: {
            ...stylex.include(nonexistent.style)
          }
        })
      `

      expect(() => {
        transform(input)
      }).toThrow('Could not resolve included styles')
    })
  })

  describe('cross-file imports', () => {
    it('should handle cross-file imports when resolver returns styles', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { typography } from './typography.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("fontSize: '16px'")
      expect(code).toContain("color: 'black'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
      expect(code).not.toContain('stylex.include')
    })

    it('should reject cross-file imports when resolver returns null', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { unknown } from './unknown.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(unknown.someStyle),
            width: 100,
          }
        })
      `

      expect(() => {
        transform(input)
      }).toThrow('Could not resolve included styles')
    })

    it('should handle multiple cross-file includes', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { typography } from './typography.js'
        import { colors } from './colors.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            ...stylex.include(colors.primary),
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("fontSize: '16px'")
      expect(code).toContain("backgroundColor: 'blue'")
      expect(code).toContain("color: 'white'")
      expect(code).toContain('width: 100')
      expect(code).toContain('height: 50')
    })

    it('should handle property overrides from cross-file imports', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { typography } from './typography.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            fontSize: '18px', // Should override the imported fontSize
            width: 100,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expect(code).toContain("fontSize: '18px'")
      expect(code).toContain("fontWeight: 'bold'")
      expect(code).toContain("color: 'black'")
      expect(code).toContain('width: 100')
    })
  })

  describe('transformer options', () => {
    describe('importSources', () => {
      it('should work with default stylex import', () => {
        const input = `
          import * as stylex from '@stylexjs/stylex'

          const typography = stylex.create({
            textStrong: {
              fontWeight: 'bold',
              fontSize: '16px'
            }
          })

          const styles = stylex.create({
            button: {
              ...stylex.include(typography.textStrong),
              width: 100,
              height: 50,
            }
          })
        `
        const result = transform(input, {
          importSources: ['@stylexjs/stylex'],
        })
        const code = codeToString(result)

        expect(code).toContain("fontWeight: 'bold'")
        expect(code).not.toContain('stylex.include')
      })

      it('should work with custom import source', () => {
        const input = `
          import { create, include } from '@acme/styles'

          const typography = create({
            textStrong: {
              fontWeight: 'bold',
              fontSize: '16px'
            }
          })

          const styles = create({
            button: {
              ...include(typography.textStrong),
              width: 100,
              height: 50,
            }
          })
        `
        const result = transform(input, {
          importSources: ['@acme/styles'],
        })
        const code = codeToString(result)

        expect(code).toContain("fontWeight: 'bold'")
        expect(code).toContain('width: 100')
        expect(code).not.toContain('include(')
      })

      it('should work with multiple import sources', () => {
        const input = `
          import * as stylex from '@stylexjs/stylex'

          import { create, include } from 'custom-stylex'

          const typography = create({
            textStrong: { fontWeight: 'bold' }
          })

          const styles = create({
            button: {
              ...include(typography.textStrong),
              width: 100,
            }
          })
        `
        const result = transform(input, {
          importSources: ['@stylexjs/stylex', 'custom-stylex'],
        })
        const code = codeToString(result)

        expect(code).toContain("fontWeight: 'bold'")
        expect(code).toContain('width: 100')
      })
    })

    describe('onlyAtBeginning', () => {
      it('should allow multiple includes at beginning when enabled', () => {
        const input = `
          import * as stylex from '@stylexjs/stylex'

          import { typography } from './typography.js'
          import { colors } from './colors.js'

          const styles = stylex.create({
            button: {
              ...stylex.include(typography.textStrong),
              ...stylex.include(colors.primary),
              width: 100,
              height: 50,
            }
          })
        `
        const result = transform(input, {
          onlyAtBeginning: true,
        })
        const code = codeToString(result)

        expect(code).toContain("fontWeight: 'bold'")
        expect(code).toContain("backgroundColor: 'blue'")
        expect(code).toContain('width: 100')
      })

      it('should throw error for mixed includes when onlyAtBeginning is true', () => {
        const input = `
          import * as stylex from '@stylexjs/stylex'

          import { typography } from './typography.js'
          import { colors } from './colors.js'

          const styles = stylex.create({
            button: {
              ...stylex.include(typography.textStrong),
              width: 100,
              ...stylex.include(colors.primary),
              height: 50,
            }
          })
        `
        expect(() => {
          transform(input, {
            onlyAtBeginning: true,
          })
        }).toThrow('All `stylex.include` usages must be at the beginning')
      })

      it('should allow mixed includes when onlyAtBeginning is false', () => {
        const input = `
          import * as stylex from '@stylexjs/stylex'

          import { typography } from './typography.js'
          import { colors } from './colors.js'

          const styles = stylex.create({
            button: {
              ...stylex.include(typography.textStrong),
              width: 100,
              ...stylex.include(colors.primary),
              height: 50,
            }
          })
        `
        expect(() => {
          transform(input, {
            onlyAtBeginning: false,
          })
        }).not.toThrow()
      })
    })
  })

  describe('extractExportedStyles', () => {
    it('should extract exported style objects', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { typography } from './typography.js'

        export const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100,
            height: 50,
          }
        })
      `

      const transformer = createTransformer()
      const ast = parseSync(input, {
        filename: 'test.js',
        presets: ['@babel/preset-env'],
      })

      if (!ast) throw new Error('Failed to parse code')

      const exportedStyles = transformer.extractExportedStyles(ast)

      expect(exportedStyles).toHaveProperty('styles')
      expect(exportedStyles.styles).toBeDefined()
    })

    it('should not transform the AST when extracting styles', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        import { typography } from './typography.js'

        export const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100,
          }
        })
      `

      const transformer = createTransformer()
      const ast = parseSync(input, {
        filename: 'test.js',
        presets: ['@babel/preset-env'],
      })

      if (!ast) throw new Error('Failed to parse code')

      const originalCode = codeToString(ast)
      transformer.extractExportedStyles(ast)
      const afterCode = codeToString(ast)

      // The AST should remain unchanged
      expect(afterCode).toBe(originalCode)
    })
  })

  describe('error handling', () => {
    it('should handle unexpected arguments for stylex.include', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong, 'extra-arg')
          }
        })
      `

      expect(() => {
        transform(input, {
          importSources: ['@stylexjs/stylex'],
        })
      }).toThrow('Unexpected argument for `stylex.include`')
    })

    it('should handle missing import declarations gracefully', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          button: {
            ...stylex.include(importedStyles.someStyle)
          }
        })
      `

      expect(() => {
        transform(input, {
          importSources: ['@stylexjs/stylex'],
        })
      }).toThrow('Could not resolve included styles')
    })
  })
})
