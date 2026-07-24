import uiPackageManifest from '@stylextras/ui/package.json'
import websitePackageManifest from '../../../package.json'
import {
  files as compiledUiFiles,
  generatedCSS as compiledUiCSS,
} from 'virtual:playground-ui-package'

type RawModules = Record<string, string>
type SandpackFiles = Record<string, { code: string }>

const inputModules = import.meta.glob('./files/input/**/*.{ts,tsx,js,jsx}', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as RawModules

const bundlerModules = import.meta.glob('./files/bundler/**/*', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as RawModules

const uiModules = import.meta.glob('@playground-ui-source/**/*.{ts,tsx,js,jsx}', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as RawModules

const stylexPackageModules = import.meta.glob(
  '@playground-stylex-package/**/*.{js,mjs,d.ts,json}',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as RawModules

const atomsPackageModules = import.meta.glob(
  '@playground-atoms-package/**/*.{js,mjs,cjs,d.ts,json}',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as RawModules

const reactTypeModules = import.meta.glob('@playground-react-types/*.d.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as RawModules

function relativeModulePath(moduleId: string, roots: readonly string[]) {
  const normalizedId = moduleId.replaceAll('\\', '/')

  for (const root of roots) {
    const index = normalizedId.indexOf(root)
    if (index !== -1) {
      return normalizedId.slice(index + root.length)
    }
  }

  throw new Error(`Unable to resolve raw playground module: ${moduleId}`)
}

function toRelativeSources(modules: RawModules, roots: readonly string[]): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).map(([moduleId, source]) => [
      relativeModulePath(moduleId, roots),
      source,
    ]),
  )
}

function sortInitialFiles([filenameA]: [string, string], [filenameB]: [string, string]) {
  if (filenameA === 'App.tsx') return -1
  if (filenameB === 'App.tsx') return 1
  return filenameA.localeCompare(filenameB)
}

const inputSources = toRelativeSources(inputModules, ['./files/input/'])
const bundlerSources = toRelativeSources(bundlerModules, ['./files/bundler/'])
const uiSources = toRelativeSources(uiModules, ['@playground-ui-source/', '/packages/ui/src/'])
const stylexPackageSources = toRelativeSources(stylexPackageModules, [
  '@playground-stylex-package/',
  '/node_modules/@stylexjs/stylex/',
])
const atomsPackageSources = toRelativeSources(atomsPackageModules, [
  '@playground-atoms-package/',
  '/node_modules/@stylexjs/atoms/',
])
// The published atom type uses a broad index signature that Monaco cannot
// reconcile with stylex.props yet. Keep the runtime package untouched and
// widen only the editor-facing declaration until the upstream types converge.
const atomsTypeSources = Object.fromEntries(
  Object.entries(atomsPackageSources).map(([filename, source]) => [
    filename,
    filename.endsWith('src/index.d.ts')
      ? source.replace('StyleXStyles<{ readonly [$$Key$$: string]: unknown }>', 'StyleXStyles')
      : source,
  ]),
)
const reactTypeSources = toRelativeSources(reactTypeModules, [
  '@playground-react-types/',
  '/node_modules/@types/react/',
])

const stylexPackageManifest = JSON.parse(stylexPackageSources['package.json'] ?? '{}') as {
  name: string
  version: string
  main: string
  exports: { '.': { types: string } }
}

const atomsPackageManifest = JSON.parse(atomsPackageSources['package.json'] ?? '{}') as {
  name: string
  version: string
  main: string
  types: string
}

export const INITIAL_INPUT_FILES: Record<string, string> = Object.fromEntries(
  Object.entries(inputSources).sort(sortInitialFiles),
)

export const UI_SOURCE_FILES: Record<string, string> = Object.fromEntries(
  Object.entries(uiSources).map(([filename, source]) => [
    `/node_modules/@stylextras/ui/${filename}`,
    source,
  ]),
)

export const COMPILED_UI_PACKAGE = {
  files: Object.fromEntries(
    Object.entries(compiledUiFiles).map(([filename, code]) => [filename, { code }]),
  ),
  generatedCSS: compiledUiCSS,
}

function toRuntimeExport(target: unknown): unknown {
  if (typeof target === 'string') {
    return target.replace(/^\.\/src\//, './').replace(/\.(?:ts|tsx|js|jsx)$/, '.js')
  }
  if (target != null && typeof target === 'object') {
    return Object.fromEntries(
      Object.entries(target).map(([condition, value]) => [condition, toRuntimeExport(value)]),
    )
  }
  return target
}

export const UI_PACKAGE_IMPORTS: Record<string, string> = Object.fromEntries(
  Object.entries(uiPackageManifest.exports).flatMap(([subpath, target]) => {
    if (typeof target !== 'string' || !/^\.\/src\//.test(target)) {
      return []
    }
    const importPath =
      subpath === '.' ? uiPackageManifest.name : `${uiPackageManifest.name}${subpath.slice(1)}`
    const sourcePath = target.replace(/^\.\/src\//, '')
    return [[importPath, `/node_modules/@stylextras/ui/${sourcePath}`]]
  }),
)

const uiPackageSourcePrefix = `/node_modules/${uiPackageManifest.name}/`

export function getCanonicalSourceFilePath(filePath: string) {
  if (filePath.startsWith(uiPackageSourcePrefix)) {
    return `${uiPackageManifest.name}:src/${filePath.slice(uiPackageSourcePrefix.length)}`
  }
  return filePath
}

const uiRuntimePackageManifest = {
  name: uiPackageManifest.name,
  version: uiPackageManifest.version,
  type: uiPackageManifest.type,
  sideEffects: uiPackageManifest.sideEffects,
  dependencies: uiPackageManifest.dependencies,
  peerDependencies: uiPackageManifest.peerDependencies,
  exports: Object.fromEntries(
    Object.entries(uiPackageManifest.exports).map(([subpath, target]) => [
      subpath,
      toRuntimeExport(target),
    ]),
  ),
}

function typeLibrary(
  sources: Record<string, string>,
  packagePath: string,
  include: (filename: string) => boolean,
) {
  return Object.fromEntries(
    Object.entries(sources)
      .filter(([filename]) => include(filename))
      .map(([filename, source]) => [`file:///node_modules/${packagePath}/${filename}`, source]),
  )
}

export const PLAYGROUND_TYPE_LIBS: Record<string, string> = {
  ...typeLibrary(stylexPackageSources, '@stylexjs/stylex', (filename) =>
    filename.endsWith('.d.ts'),
  ),
  ...typeLibrary(atomsTypeSources, '@stylexjs/atoms', (filename) => filename.endsWith('.d.ts')),
  ...typeLibrary(reactTypeSources, '@types/react', (filename) => filename.endsWith('.d.ts')),
  ...Object.fromEntries(
    Object.entries(UI_SOURCE_FILES).map(([filename, source]) => [`file://${filename}`, source]),
  ),
}

export const PLAYGROUND_TYPE_PATHS: Record<string, string[]> = {
  '@stylexjs/stylex': [
    `file:///node_modules/@stylexjs/stylex/${stylexPackageManifest.exports['.'].types.replace(/^\.\//, '')}`,
  ],
  '@stylexjs/atoms': [
    `file:///node_modules/@stylexjs/atoms/${atomsPackageManifest.types.replace(/^\.\//, '')}`,
  ],
}

function sourceFiles(sources: Record<string, string>): SandpackFiles {
  return Object.fromEntries(
    Object.entries(sources).map(([filename, source]) => [`/${filename}`, { code: source }]),
  )
}

const stylexRuntimeSource = stylexPackageSources[stylexPackageManifest.main.replace(/^\.\//, '')]

if (stylexRuntimeSource == null) {
  throw new Error('Unable to load the StyleX playground runtime')
}

const atomsRuntimeFiles: SandpackFiles = Object.fromEntries(
  Object.entries(atomsPackageSources)
    .filter(([filename]) => /\.(?:js|mjs|cjs)$/.test(filename))
    .map(([filename, source]) => [`/node_modules/@stylexjs/atoms/${filename}`, { code: source }]),
)

export const INITIAL_BUNDLER_FILES: SandpackFiles = {
  ...sourceFiles(
    Object.fromEntries(
      Object.entries(bundlerSources).filter(([filename]) => filename !== 'styles.css'),
    ),
  ),
  '/package.json': {
    code: JSON.stringify(
      {
        main: '/index.js',
        dependencies: {
          react: websitePackageManifest.dependencies.react,
          'react-dom': websitePackageManifest.dependencies['react-dom'],
          ...uiPackageManifest.dependencies,
        },
      },
      null,
      2,
    ),
  },
  '/node_modules/@stylexjs/stylex/package.json': {
    code: JSON.stringify(
      {
        name: stylexPackageManifest.name,
        version: stylexPackageManifest.version,
        main: './index.js',
      },
      null,
      2,
    ),
  },
  '/node_modules/@stylexjs/stylex/index.js': {
    code: stylexRuntimeSource,
  },
  '/node_modules/@stylexjs/atoms/package.json': {
    code: JSON.stringify(atomsPackageManifest, null, 2),
  },
  ...atomsRuntimeFiles,
  '/node_modules/@stylextras/ui/package.json': {
    code: JSON.stringify(uiRuntimePackageManifest, null, 2),
  },
}

export const CSS_PRELUDE = bundlerSources['styles.css'] ?? ''
