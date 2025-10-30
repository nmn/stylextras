import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest'
import webpack from 'webpack'
import fs from 'node:fs'
import * as path from 'path'

import type { StyleXIncludeWebpackLoaderOptions } from '../src'
import { expectToContainCodeSnippet } from './utils'

const rootPath = path.resolve(__dirname, '../')
const tmpPath = path.resolve(rootPath, './__tests__/tmp')

function resolveTmpPath(filePath: string) {
  return path.resolve(tmpPath, filePath)
}

class WebpackLoaderTester {
  constructor() {
    fs.writeFileSync(
      resolveTmpPath('./stylex-mock.js'),
      `
      export function create(stylesObject) {
        return stylesObject
      }
      export function include(styles) {
        return styles
      }
    `,
    )
  }

  async compile(options: StyleXIncludeWebpackLoaderOptions, sourceFiles: Record<string, string>) {
    Object.entries(sourceFiles).forEach(([filePath, content]) => {
      const fullPath = resolveTmpPath(`.${filePath}`)
      const dir = path.dirname(fullPath)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(fullPath, content)
    })

    const compiler = webpack({
      entry: resolveTmpPath('./src/entry.js'),
      context: resolveTmpPath('./src'),
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            use: [
              {
                loader: resolveTmpPath('./webpack-loader.cjs'),
                options: options,
              },
            ],
          },
          {
            test: /\.(jsx|tsx)$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react'],
                },
              },
            ],
          },
        ],
      },
      output: {
        path: resolveTmpPath('./dist'),
        filename: 'bundle.js',
      },
      mode: 'development',
      infrastructureLogging: { level: 'verbose' },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias:
          options.importSources && options.importSources.length > 0
            ? Object.fromEntries(
                options.importSources.map((source) => [source, resolveTmpPath('./stylex-mock.js')]),
              )
            : { '@stylexjs/stylex': resolveTmpPath('./stylex-mock.js') },
      },
      devtool: 'source-map',
    })

    return new Promise<{ stats: webpack.Stats }>((resolve, reject) => {
      if (compiler) {
        compiler.run((err, stats) => {
          if (err) {
            console.error('Webpack compilation error:', err)
            reject(err)
          } else if (!stats) {
            reject(new Error('No stats returned from webpack'))
          } else {
            // Log compilation info for debugging
            console.log('Webpack compilation completed')
            console.log('Stats:', {
              hasErrors: stats.hasErrors(),
              hasWarnings: stats.hasWarnings(),
              errors: stats.compilation.errors,
              warnings: stats.compilation.warnings,
            })
            resolve({ stats })
          }
        })
      } else {
        reject(new Error('Failed to create webpack compiler'))
      }
    })
  }

  reset() {
    fs.rmSync(resolveTmpPath('./src'), { recursive: true })
    fs.rmSync(resolveTmpPath('./dist'), { recursive: true })
  }

  cleanup() {
    fs.rmSync(tmpPath, { recursive: true })
  }
}

describe('StyleXIncludeLoader Integration', () => {
  let tester: WebpackLoaderTester

  beforeAll(() => {
    tester = new WebpackLoaderTester()
  })

  afterEach(() => {
    tester.reset()
  })

  afterAll(() => {
    tester.cleanup()
  })

  describe('cross-file imports', () => {
    it('should transform cross-file imports in real webpack build', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.js'],
        },
        {
          '/src/typography.js': `
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
          `,
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './typography.js'
            
            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                width: 100,
                height: 50
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
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

    it('should handle multiple imports from the same file', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./styles.js'],
        },
        {
          '/src/styles.js': `
            import * as stylex from '@stylexjs/stylex'
            
            export const typography = stylex.create({
              textStrong: {
                fontWeight: 'bold',
                fontSize: '16px'
              }
            })
            
            export const colors = stylex.create({
              primary: {
                color: 'blue'
              }
            })
          `,
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography, colors } from './styles.js'
            
            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                ...stylex.include(colors.primary),
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          color: 'blue',
          width: 100
        }
      `,
      )
    })

    it('should handle property overrides in cross-file imports', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.js'],
        },
        {
          '/src/typography.js': `
            import * as stylex from '@stylexjs/stylex'
            
            export const typography = stylex.create({
              textStrong: {
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black'
              }
            })
          `,
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './typography.js'
            
            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                fontSize: '18px',
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '18px',
          color: 'black',
          width: 100
        }
      `,
      )
    })

    it('should handle multiple files using the same imported styles', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.js'],
        },
        {
          '/src/typography.js': `
            import * as stylex from '@stylexjs/stylex'
            
            export const typography = stylex.create({
              textStrong: {
                fontWeight: 'bold'
              }
            })
          `,
          '/src/component1.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './typography.js'
            
            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                width: 100
              }
            })
          `,
          '/src/component2.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './typography.js'
            
            const styles = stylex.create({
              link: {
                ...stylex.include(typography.textStrong),
                color: 'blue'
              }
            })
          `,
          '/src/entry.js': `
            import './component1.js'
            import './component2.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          width: 100
        }
      `,
      )
      expectToContainCodeSnippet(
        bundleContent,
        `
        link: {
          fontWeight: 'bold',
          color: 'blue'
        }
      `,
      )
    })

    it('should handle multi-layered cross-file imports', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./base.js', './typography.js'],
        },
        {
          '/src/base.js': `
            import * as stylex from '@stylexjs/stylex'

            export const base = stylex.create({
              base: {
                fontFamily: 'Arial'
              }
            })
          `,
          '/src/typography.js': `
            import * as stylex from '@stylexjs/stylex'
            import { base } from './base.js'

            export const typography = stylex.create({
              textStrong: {
                ...stylex.include(base.base),
                fontWeight: 'bold'
              }
            })
          `,
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './typography.js'

            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontFamily: 'Arial',
          fontWeight: 'bold',
          width: 100
        }
      `,
      )
    })

    it('should handle multi-layered cross-file imports with variable depedencies', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./shared/base.js', './typography.js'],
        },
        {
          '/src/shared/tokens.stylex.js': `
            import * as stylex from '@stylexjs/stylex'

            export const colors = stylex.defineVars({
              text: 'blue',
              bg: 'red',
            })
          `,
          '/src/shared/base.js': `
            import * as stylex from '@stylexjs/stylex'

            import { colors } from './tokens.stylex.js'

            export const base = stylex.create({
              base: {
                fontFamily: 'Arial',
                color: colors.text,
              }
            })
          `,
          '/src/typography.js': `
            import * as stylex from '@stylexjs/stylex'

            import { base } from './shared/base.js'
            import { colors } from './shared/tokens.stylex.js'

            export const typography = stylex.create({
              textStrong: {
                ...stylex.include(base.base),
                fontWeight: 'bold',
                backgroundColor: colors.bg,
              }
            })
          `,
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'

            import { typography } from './typography.js'

            export const colors = 'Overlapping local variable'

            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `var _shared_tokens_stylex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/tokens.stylex.js */ "./shared/tokens.stylex.js")`,
      )
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontFamily: 'Arial',
          color: _shared_tokens_stylex_js__WEBPACK_IMPORTED_MODULE_2__.colors.text,
          fontWeight: 'bold',
          backgroundColor: _shared_tokens_stylex_js__WEBPACK_IMPORTED_MODULE_2__.colors.bg,
          width: 100
        }
      `,
      )
    })
  })

  describe('error handling', () => {
    it('should handle unresolvable imports gracefully', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./nonexistent.js'],
        },
        {
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            import { typography } from './nonexistent.js'
            
            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(stats.hasErrors()).toBe(true)
      expect(stats.compilation.errors.length).toBeGreaterThan(0)
    })

    it('should handle disallowed imports', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: [], // No allowed exports
        },
        {
          '/src/typography.js': `
              import * as stylex from '@stylexjs/stylex'
              
              export const typography = stylex.create({
                textStrong: {
                  fontWeight: 'bold'
                }
              })
            `,
          '/src/component.js': `
              import * as stylex from '@stylexjs/stylex'
              import { typography } from './typography.js'
              
              const styles = stylex.create({
                button: {
                  ...stylex.include(typography.textStrong),
                  width: 100
                }
              })
            `,
          '/src/entry.js': `
              import './component.js'
            `,
        },
      )

      expect(stats.hasErrors()).toBe(true)
      expect(stats.compilation.errors.length).toEqual(1)
      expect(stats.compilation.errors[0]!.message).toContain(
        "Import from './typography.js' in file",
      )
      expect(stats.compilation.errors[0]!.message).toContain('is not allowed')
    })

    it('should handle missing exports', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.js'],
        },
        {
          '/src/typography.js': `
              import * as stylex from '@stylexjs/stylex'
              
              export const colors = stylex.create({
                primary: {
                  color: 'blue'
                }
              })
            `,
          '/src/component.js': `
              import * as stylex from '@stylexjs/stylex'
              import { typography } from './typography.js'
              
              const styles = stylex.create({
                button: {
                  ...stylex.include(typography.textStrong),
                  width: 100
                }
              })
            `,
          '/src/entry.js': `
              import './component.js'
            `,
        },
      )

      expect(stats.hasErrors()).toBe(true)
      expect(stats.compilation.errors.length).toEqual(2)
      expect(stats.compilation.errors[1]!.message).toContain('File')
      expect(stats.compilation.errors[1]!.message).toContain("does not export 'typography'")
    })
  })

  describe('loader options', () => {
    it('should respect onlyAtBeginning option', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.js'],
          onlyAtBeginning: true,
        },
        {
          '/src/typography.js': `
              import * as stylex from '@stylexjs/stylex'
              
              export const typography = stylex.create({
                textStrong: {
                  fontWeight: 'bold'
                }
              })
            `,
          '/src/component.js': `
              import * as stylex from '@stylexjs/stylex'
              import { typography } from './typography.js'
              
              const styles = stylex.create({
                button: {
                  width: 100,
                  ...stylex.include(typography.textStrong), // Should cause error
                  height: 50
                }
              })
            `,
          '/src/entry.js': `
              import './component.js'
            `,
        },
      )

      expect(stats.hasErrors()).toBe(true)
      expect(stats.compilation.errors.length).toEqual(1)
      expect(stats.compilation.errors[0]!.message).toContain(
        "All 'stylex.include' usages must be at the beginning of styles when 'onlyAtBeginning' is set to 'true'",
      )
    })

    it('should work with custom import sources', async () => {
      const { stats } = await tester.compile(
        {
          importSources: ['custom-stylex'],
          allowedStyleImports: ['./typography.js'],
        },
        {
          '/src/typography.js': `
            import { create, include } from 'custom-stylex'
            
            export const typography = create({
              textStrong: {
                fontWeight: 'bold'
              }
            })
          `,
          '/src/component.js': `
            import { create, include } from 'custom-stylex'
            import { typography } from './typography.js'
            
            const styles = create({
              button: {
                ...include(typography.textStrong),
                width: 100
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          width: 100
        }
      `,
      )
    })
  })

  describe('file processing', () => {
    it('should handle files without imports', async () => {
      const { stats } = await tester.compile(
        {},
        {
          '/src/component.js': `
            import * as stylex from '@stylexjs/stylex'
            
            const styles = stylex.create({
              button: {
                width: 100,
                height: 50
              }
            })
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          width: 100,
          height: 50
        }
      `,
      )
    })

    it('should handle files with local includes only', async () => {
      const { stats } = await tester.compile(
        {},
        {
          '/src/component.js': `
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
          `,
          '/src/entry.js': `
            import './component.js'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          width: 100
        }
      `,
      )
    })

    it('should skip non-JavaScript/TypeScript files', async () => {
      const { stats } = await tester.compile(
        {},
        {
          '/src/component.css': `
            .button {
              width: 100px;
              height: 50px;
            }
          `,
          '/src/entry.js': `
            import './component.css'
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const cssContent = fs.readFileSync(resolveTmpPath('./src/component.css'), 'utf8')
      expectToContainCodeSnippet(
        cssContent,
        `
        .button {
          width: 100px;
          height: 50px;
        }
      `,
      )
    })

    it('should handle TypeScript files', async () => {
      const { stats } = await tester.compile(
        {
          allowedStyleImports: ['./typography.ts', './colors.js'],
        },
        {
          '/src/entry.js': `
            import Component from './component.tsx'
          `,
          '/src/typography.ts': `
            import * as stylex from '@stylexjs/stylex'

            export const typography = stylex.create({
              textStrong: {
                fontWeight: 'bold',
                fontSize: '16px'
              }
            })
          `,
          '/src/colors.js': `
            import * as stylex from '@stylexjs/stylex'

            export const colors = stylex.create({
              primary: {
                color: 'blue'
              }
            })
          `,
          '/src/component.tsx': `
            import * as stylex from '@stylexjs/stylex'

            import { typography } from './typography.ts'
            import { colors } from './colors.js'

            const styles = stylex.create({
              button: {
                ...stylex.include(typography.textStrong),
                ...stylex.include(colors.primary),
                width: 100,
                height: 50
              }
            })

            export default function Component() {
              return <div className={styles.button}>Button</div>
            }
          `,
        },
      )

      expect(Object.keys(stats.compilation.assets)).toContain('bundle.js')

      const bundleContent = fs.readFileSync(resolveTmpPath('./dist/bundle.js'), 'utf8')
      expectToContainCodeSnippet(
        bundleContent,
        `
        button: {
          fontWeight: 'bold',
          fontSize: '16px',
          color: 'blue',
          width: 100,
          height: 50
        }
      `,
      )
    })
  })
})
