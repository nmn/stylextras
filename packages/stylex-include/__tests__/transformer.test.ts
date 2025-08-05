import { parseSync } from '@babel/core'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import { StyleXIncludeTransformer } from '../src/transformer'
import { type StyleXIncludeOptions } from '../src/types'
import * as fs from 'fs'
import * as path from 'path'
import { describe, it, expect } from 'vitest'
import { expectToContainCodeSnippet } from './utils'

describe('StyleXIncludeTransformer', () => {
  const parseCode = (code: string) => {
    const ast = parseSync(code, {
      filename: 'test.js',
      presets: ['@babel/preset-env'],
    })

    if (!ast) throw new Error('Failed to parse code')

    return ast
  }

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
          const ast = parseCode(code)

          const exportedStyles: Record<string, t.ObjectExpression> =
            transformer.extractExportedStyles(ast)
          return exportedStyles[expectedExport] ?? null
        }

        return null
      },
    )
    return transformer
  }

  const transform = (code: string, options: StyleXIncludeOptions = {}) => {
    const transformer = createTransformer(options)
    const ast = parseCode(code)
    transformer.transformFile(ast)
    return ast
  }

  const extractExportedStyles = (code: string, options: StyleXIncludeOptions = {}) => {
    const transformer = createTransformer(options)
    const ast = parseCode(code)
    return transformer.extractExportedStyles(ast)
  }

  const extractImportedStyles = (code: string, options: StyleXIncludeOptions = {}) => {
    const transformer = createTransformer(options)
    const ast = parseCode(code)
    return transformer.extractImportedStyles(ast)
  }

  const codeToString = (ast: any) => {
    return generate(ast, {
      jsescOption: {
        quotes: 'single',
      },
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

      expectToContainCodeSnippet(
        code,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          width: 100,
          height: 50
        }
      `,
      )
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

      expectToContainCodeSnippet(
        code,
        `
        textStrong: {
          padding: '8px',
          margin: '4px',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      `,
      )

      expectToContainCodeSnippet(
        code,
        `
        button: {
          padding: '8px',
          margin: '4px',
          fontWeight: 'bold',
          fontSize: '16px',
          width: 100,
          height: 50
        }
      `,
      )
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
            fontSize: '18px',
            width: 100,
            height: 50,
          }
        })
      `
      const result = transform(input)
      const code = codeToString(result)

      expectToContainCodeSnippet(
        code,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '18px',
          color: 'black',
          width: 100,
          height: 50
        }
      `,
      )
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
      }).toThrow(
        "All 'stylex.include' usages must be at the beginning of styles when 'onlyAtBeginning' is set to 'true'",
      )
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
      }).toThrow("Unexpected argument for 'stylex.include'")
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
      }).toThrow("Could not resolve 'stylex.include(nonexistent.style)'")
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

      expectToContainCodeSnippet(
        code,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          color: 'black',
          width: 100,
          height: 50
        }
      `,
      )
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
      }).toThrow("Could not resolve 'stylex.include(unknown.someStyle)'")
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

      expectToContainCodeSnippet(
        code,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          color: 'white',
          backgroundColor: 'blue',
          width: 100,
          height: 50
        }
      `,
      )
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

        expectToContainCodeSnippet(
          code,
          `
          button: {
            fontWeight: 'bold',
            fontSize: '16px',
            width: 100,
            height: 50
          }
        `,
        )
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

        expectToContainCodeSnippet(
          code,
          `
          button: {
            fontWeight: 'bold',
            fontSize: '16px',
            width: 100,
            height: 50
          }
        `,
        )
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

        expectToContainCodeSnippet(
          code,
          `
          button: {
            fontWeight: 'bold',
            width: 100
          }
        `,
        )
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

        expectToContainCodeSnippet(
          code,
          `
          button: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'white',
            backgroundColor: 'blue',
            width: 100,
            height: 50
          }
        `,
        )
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
        }).toThrow(
          "All 'stylex.include' usages must be at the beginning of styles when 'onlyAtBeginning' is set to 'true'",
        )
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

      const exportedStyles = extractExportedStyles(input)

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
      const ast = parseCode(input)

      const originalCode = codeToString(ast)
      transformer.extractExportedStyles(ast)
      const afterCode = codeToString(ast)

      // The AST should remain unchanged
      expect(afterCode).toBe(originalCode)
    })

    it('should handle multiple exported style objects', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        export const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold',
            fontSize: '16px'
          },
          textWeak: {
            fontWeight: 'normal',
            fontSize: '14px'
          }
        })

        export const colors = stylex.create({
          primary: {
            color: 'blue'
          }
        })
      `

      const exportedStyles = extractExportedStyles(input)

      expect(exportedStyles).toHaveProperty('typography')
      expect(exportedStyles).toHaveProperty('colors')
      expect(exportedStyles.typography).toBeDefined()
      expect(exportedStyles.colors).toBeDefined()
    })

    it('should handle non-style exports', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        export const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold'
          }
        })

        export const regularVar = 'not a style'
        export function regularFunction() {}
      `

      const exportedStyles = extractExportedStyles(input)

      expect(exportedStyles).toHaveProperty('typography')
      expect(exportedStyles).not.toHaveProperty('regularVar')
      expect(exportedStyles).not.toHaveProperty('regularFunction')
    })

    it('should handle empty files', () => {
      const input = `
        // Empty file with no exports
      `

      const exportedStyles = extractExportedStyles(input)

      expect(exportedStyles).toEqual({})
    })
  })

  describe('extractImportedStyles', () => {
    it('should extract imported style references', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'
        import { typography } from './typography.js'
        import { colors } from './colors.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            ...stylex.include(colors.primary),
            width: 100
          },
          link: {
            ...stylex.include(typography.textWeak)
          }
        })
      `

      const importedStyles = extractImportedStyles(input)

      expect(Object.keys(importedStyles)).toEqual(['./typography.js', './colors.js'])
      expect(importedStyles['./typography.js']).toContain('typography')
      expect(importedStyles['./colors.js']).toContain('colors')
    })

    it('should handle local style includes', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'

        const typography = stylex.create({
          textStrong: {
            fontWeight: 'bold'
          }
        })

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100
          }
        })
      `

      const importedStyles = extractImportedStyles(input)

      // Local includes should not be included in imported styles
      expect(importedStyles).toEqual({})
    })

    it('should handle multiple imports from same module', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'
        import { typography, colors } from './styles.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            ...stylex.include(colors.primary)
          }
        })
      `

      const importedStyles = extractImportedStyles(input)

      expect(Object.keys(importedStyles)).toEqual(['./styles.js'])
      expect(importedStyles['./styles.js']).toContain('typography')
      expect(importedStyles['./styles.js']).toContain('colors')
    })

    it('should handle empty files', () => {
      const input = `
        // Empty file with no includes
      `

      const importedStyles = extractImportedStyles(input)

      expect(importedStyles).toEqual({})
    })

    it('should handle files with non-include spread elements', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'
        import { typography } from './typography.js'

        const baseStyles = {
          margin: 0,
          padding: 0
        }

        const styles = stylex.create({
          button: {
            ...baseStyles,
            ...stylex.include(typography.textStrong),
            width: 100
          }
        })
      `

      const importedStyles = extractImportedStyles(input)

      expect(Object.keys(importedStyles)).toEqual(['./typography.js'])
      expect(importedStyles['./typography.js']).toContain('typography')
    })

    it('should deduplicate import references', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'
        import { typography } from './typography.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100
          },
          link: {
            ...stylex.include(typography.textStrong), // Same import used twice
            color: 'blue'
          }
        })
      `

      const importedStyles = extractImportedStyles(input)

      expect(Object.keys(importedStyles)).toEqual(['./typography.js'])
      expect(importedStyles['./typography.js']).toEqual(['typography'])
    })

    it('should not transform the AST when extracting imported styles', () => {
      const input = `
        import * as stylex from '@stylexjs/stylex'
        import { typography } from './typography.js'

        const styles = stylex.create({
          button: {
            ...stylex.include(typography.textStrong),
            width: 100
          }
        })
      `

      const transformer = createTransformer()
      const ast = parseCode(input)

      const originalCode = codeToString(ast)
      transformer.extractImportedStyles(ast)
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
      }).toThrow("Unexpected argument for 'stylex.include'")
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
      }).toThrow("Could not resolve 'stylex.include(importedStyles.someStyle)'")
    })
  })
})
