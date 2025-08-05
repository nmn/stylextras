import { transformSync } from '@babel/core'
import { generate } from '@babel/generator'
import styleXIncludeBabelPlugin from '../src/babel-plugin'
import { describe, it, expect } from 'vitest'
import { expectToContainCodeSnippet } from './utils'

describe('styleXIncludeBabelPlugin', () => {
  const transform = (code: string, options = {}) => {
    const result = transformSync(code, {
      plugins: [styleXIncludeBabelPlugin(options)],
      filename: 'test.js',
      presets: [['@babel/preset-env', { modules: false }]], // Preserve ES6 modules
      ast: true, // Return the AST
    })
    
    if (!result) throw new Error('Failed to transform code')
    return result
  }

  const codeToString = (result: any) => {
    if (!result.ast) {
      throw new Error('Transform failed - AST is null')
    }
    return generate(result.ast, {
      jsescOption: {
        quotes: 'single',
      }
    }).code
  }

  describe('basic functionality', () => {
    it('should transform stylex.include calls', () => {
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

      expectToContainCodeSnippet(code, `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          width: 100,
          height: 50
        }
      `)
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
          }
        })
      `

      const result = transform(input) 
      const code = codeToString(result)

      expectToContainCodeSnippet(code, `
        button: {
          fontWeight: 'bold',
          fontSize: '18px',
          color: 'black',
          width: 100
        }
      `)
    })
  })

  describe('plugin options', () => {
    it('should use default options', () => {
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
          }
        })
      `

      const result = transform(input)
      const code = codeToString(result)

      expectToContainCodeSnippet(code, `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          width: 100
        }
      `)
    })

    it('should respect onlyAtBeginning option', () => {
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
            ...stylex.include(typography.textStrong), // Should cause error with onlyAtBeginning: true
            height: 50,
          }
        })
      `

      expect(() => {
        transform(input, { onlyAtBeginning: true })
      }).toThrow("All 'stylex.include' usages must be at the beginning of styles when 'onlyAtBeginning' is set to 'true'")
    })

    it('should allow mixed includes when onlyAtBeginning is false', () => {
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
            ...stylex.include(typography.textStrong),
            height: 50,
          }
        })
      `

      expect(() => {
        transform(input, { onlyAtBeginning: false })
      }).not.toThrow()
    })

    it('should work with custom import sources', () => {
      const input = `
        import { create, include } from 'custom-stylex'

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
          }
        })
      `

      const result = transform(input, { 
        importSources: ['custom-stylex'],
        onlyAtBeginning: false 
      })
      const code = codeToString(result)

      expectToContainCodeSnippet(code, `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          width: 100
        }
      `)
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

  describe('plugin metadata', () => {
    it('should have correct plugin name', () => {
      const plugin = styleXIncludeBabelPlugin()
      expect(plugin.name).toBe('@stylextras/stylex-include')
    })

    it('should have visitor with ObjectExpression', () => {
      const plugin = styleXIncludeBabelPlugin()
      expect(plugin.visitor).toBeDefined()
      expect(plugin.visitor.ObjectExpression).toBeDefined()
      expect(typeof plugin.visitor.ObjectExpression).toBe('function')
    })
  })
}) 