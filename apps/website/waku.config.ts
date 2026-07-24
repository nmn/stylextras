/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'waku/config'
import mdx from 'fumadocs-mdx/vite'
import * as MdxConfig from './source.config.js'
import tsconfigPaths from 'vite-tsconfig-paths'
import stylex from '@stylexjs/unplugin'
// @ts-ignore - CJS module
import { transform } from '@babel/standalone'
// @ts-ignore - CJS module
import * as stylexBabelPluginModule from '@stylexjs/babel-plugin'
import type { Plugin } from 'vite'
// import lightningcss from 'lightningcss';
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const workspaceRoot = path.resolve(__dirname, '../..')
const uiSourceDir = path.join(workspaceRoot, 'packages/ui/src')
const stylexPackageDir = path.dirname(require.resolve('@stylexjs/stylex/package.json'))
const atomsPackageDir = path.resolve(path.dirname(require.resolve('@stylexjs/atoms')), '..')
const reactTypesDir = path.dirname(require.resolve('@types/react/package.json'))
const stylexBabelPlugin: typeof import('@stylexjs/babel-plugin').default =
  // @ts-ignore - handle CJS default export
  stylexBabelPluginModule.default ?? stylexBabelPluginModule

const fumadocs = async (): Promise<Plugin> => {
  const plugin = await mdx(MdxConfig)
  const transform = plugin.transform
  return {
    ...plugin,
    async transform(code, id, options) {
      if (id.includes('virtual:vite-rsc/')) return null
      if (typeof transform !== 'function') return null
      return transform.call(this, code, id, options)
    },
  }
}

const playgroundUiPackage = (): Plugin => {
  const publicId = 'virtual:playground-ui-package'
  const resolvedId = `\0${publicId}`
  let compiledModule: string | undefined

  return {
    name: 'playground-ui-package',
    enforce: 'pre',
    resolveId(id) {
      return id === publicId ? resolvedId : null
    },
    load(id) {
      if (id !== resolvedId) return null
      if (compiledModule != null) return compiledModule

      const stylexRules = []
      const files: Record<string, string> = {}
      const filenames = fs
        .readdirSync(uiSourceDir, { recursive: true })
        .map(String)
        .filter((filename) => /\.(?:ts|tsx|js|jsx)$/.test(filename))

      for (const filename of filenames) {
        const absolutePath = path.join(uiSourceDir, filename)
        const source = fs.readFileSync(absolutePath, 'utf8')
        const isTSX = filename.endsWith('.tsx')
        const isTS = isTSX || filename.endsWith('.ts')
        const result = transform(source, {
          filename: absolutePath,
          plugins: [
            isTS && ['transform-typescript', { isTSX }],
            'syntax-jsx',
            [
              stylexBabelPlugin,
              {
                dev: false,
                enableMediaQueryOrder: false,
                unstable_moduleResolution: {
                  type: 'commonJS',
                  rootDir: workspaceRoot,
                },
              },
            ],
          ].filter(Boolean),
        })
        const finalized = transform(result.code, {
          filename: absolutePath,
          plugins: [['transform-react-jsx', { runtime: 'automatic' }]],
        })
        const outputPath = filename.replace(/\.(?:ts|tsx|js|jsx)$/, '.js')
        files[`/node_modules/@stylextras/ui/${outputPath}`] = finalized.code
        if (result.metadata.stylex) {
          stylexRules.push(...result.metadata.stylex)
        }
      }

      const generatedCSS = stylexBabelPlugin.processStylexRules(stylexRules, {
        useLayers: true,
      })
      compiledModule = `export const files = ${JSON.stringify(files)};\nexport const generatedCSS = ${JSON.stringify(generatedCSS)};`
      return compiledModule
    },
  }
}

export default defineConfig({
  unstable_adapter: 'waku/adapters/cloudflare',
  vite: {
    resolve: {
      alias: {
        '@playground-ui-source': uiSourceDir,
        '@playground-stylex-package': stylexPackageDir,
        '@playground-atoms-package': atomsPackageDir,
        '@playground-react-types': reactTypesDir,
      },
      dedupe: ['react', 'react-dom', 'react-server-dom-webpack'],
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
    },
    optimizeDeps: {
      include: [
        '@stylexjs/babel-plugin',
        '@babel/standalone',
        'use-query-params',
        'serialize-query-params',
        'path-browserify',
        'lz-string',
      ],
    },
    ssr: {
      // Force these CJS modules to be bundled during SSR so they work properly
      noExternal: ['use-query-params', 'serialize-query-params'],
      optimizeDeps: {
        include: ['use-query-params', 'serialize-query-params'],
      },
    },
    plugins: [
      playgroundUiPackage(),
      // @ts-ignore
      stylex.vite({
        debug: process.env.NODE_ENV === 'development',
        dev: process.env.NODE_ENV === 'development',
        treeshakeCompensation: true,
        useCSSLayers: true,
        devMode: 'css-only',
        devPersistToDisk: true,
        // Preserve modern media features used by the component package.
        enableMediaQueryOrder: false,
        runtimeInjection: false,
        aliases: {
          '@/*': [path.join(__dirname, 'src/*')],
        },
        lightningcssOptions: {
          minify: process.env.NODE_ENV !== 'development',
          targets: browserslistToTargets(browserslist('>= 5%')),
        },
      }),
      // @ts-ignore
      fumadocs(),
      // @ts-ignore
      tsconfigPaths(),
    ],
  },
})
