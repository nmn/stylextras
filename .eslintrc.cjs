module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@stylexjs'],
  rules: {
    '@stylexjs/enforce-extension': [
      'error',
      {
        legacyAllowMixedExports: true,
        validImports: ['@stylexjs/stylex'],
      },
    ],
    '@stylexjs/no-legacy-contextual-styles': [
      'error',
      {
        validImports: ['@stylexjs/stylex'],
      },
    ],
    '@stylexjs/no-unused': [
      'error',
      {
        validImports: ['@stylexjs/stylex'],
      },
    ],
    '@stylexjs/sort-keys': [
      'warn',
      {
        validImports: ['@stylexjs/stylex'],
      },
    ],
    '@stylexjs/valid-shorthands': [
      'error',
      {
        validImports: ['@stylexjs/stylex'],
      },
    ],
    '@stylexjs/valid-styles': [
      'error',
      {
        validImports: ['@stylexjs/stylex'],
      },
    ],
  },
}
