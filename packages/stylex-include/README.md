# @stylextras/stylex-include

A plugin to retroactively support the legacy `stylex.include` API that was removed in StyleX `0.11.0`. 

This package provides multiple plugin interfaces:
- **Babel plugin**: For local includes only
- **Webpack plugin**: For local and cross-file includes
- **Direct transformer**: For custom build tools

Run the appropriate plugin before `@stylexjs/babel-plugin` to inline source styles referenced by `stylex.include` into target style objects.

## Installation

```bash
npm install @stylextras/stylex-include
```

## Quick Start

### Babel Plugin (Local Includes Only)
```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['@stylextras/stylex-include', { onlyAtBeginning: true }]
  ]
}
```

### Webpack Plugin (Local + Cross-file Includes)
```javascript
// webpack.config.js
const { StyleXIncludeWebpackPlugin } = require('@stylextras/stylex-include')

module.exports = {
  plugins: [
    new StyleXIncludeWebpackPlugin({
      allowedStyleImports: ['./src/styles/typography.js'],
      onlyAtBeginning: true
    })
  ]
}
```

## Usage Examples

### Babel Plugin with Custom Import Sources
```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['@stylextras/stylex-include', {
      importSources: ['@stylexjs/stylex', 'custom-stylex'],
      onlyAtBeginning: true
    }]
  ]
}
```

### Webpack Plugin with Custom Module Resolution
```javascript
// webpack.config.js
const { StyleXIncludeWebpackPlugin } = require('@stylextras/stylex-include')

module.exports = {
  plugins: [
    new StyleXIncludeWebpackPlugin({
      allowedStyleImports: ['@acme/styles'],
      onlyAtBeginning: true,
      resolveModule: (importPath, context) => {
        if (importPath.startsWith('@acme/')) {
          return require.resolve(importPath, { paths: [context] })
        }
        return null
      }
    })
  ]
}
```

### Direct Transformer Usage
For advanced use cases, you can use the transformer directly:

```javascript
const { StyleXIncludeTransformer } = require('@stylextras/stylex-include')
const { parseSync } = require('@babel/core')

const transformer = new StyleXIncludeTransformer(
  {
    importSources: ['@stylexjs/stylex'],
    allowedStyleImports: [],
    onlyAtBeginning: true
  },
  (importPath, exportName) => {
    // Custom resolution logic here
    return null
  }
)

const code = `
  const styles = stylex.create({
    button: {
      ...stylex.include(typography.textStrong),
      width: 100
    }
  })
`

const ast = parseSync(code)
transformer.transform(ast)
const exportedStyles = transformer.extractExportedStyles(ast)
```

## Options

### `allowedStyleImports` (optional)

If provided, cross-file `stylex.include` calls are only allowed from these sources. This helps keep legacy API usage contained within your codebase.

```javascript
{
  allowedStyleImports: ['@acme/styles/typography', '@acme/styles/colors']
}
```

### `onlyAtBeginning` (optional)

When set to `true`, `stylex.include` calls are only allowed at the beginning of style objects. This enables easy mechanical migration away from `stylex.include` by replacing style references with arrays of included styles and the style itself. Recommended if your existing `stylex.include` usage already satisfies or is close to satisfying this constraint.

```javascript
{
  onlyAtBeginning: true
}
```

With this option enabled, this is valid:

```javascript
const styles = stylex.create({
  button: {
    ...stylex.include(typography.textStrong), // ✅ At beginning
    width: 100,
    height: 50,
  }
})
```

But this throws an error:

```javascript
const styles = stylex.create({
  button: {
    width: 100,
    ...stylex.include(typography.textStrong), // ❌ Not at beginning
    height: 50,
  }
})
```

## Mechanical Migration Example

When `onlyAtBeginning` is enabled, you can mechanically convert `stylex.include` usage to separate style arrays. For example:

**Before (with stylex.include):**
```javascript
const styles = stylex.create({
  button: {
    ...stylex.include(typography.textStrong),
    width: 100,
    height: 50,
  }
})

// Usage
<div {...stylex.props(styles.button, styles.foo)} />
```

**After (mechanical conversion):**
```javascript
const styles = stylex.create({
  button: {
    width: 100,
    height: 50,
  }
})

// Usage - replace single style with array of included and local styles
<div {...stylex.props([typography.textStrong, styles.button], styles.foo)} />
```

This pattern enables gradual migration away from `stylex.include` while preserving the same visual output.

## Migration Strategy

1. **Start with Babel plugin** for local includes only
2. **Upgrade to Webpack plugin** when you need cross-file includes
3. **Use `onlyAtBeginning: true`** to enable easy mechanical migration later
4. **Gradually replace includes** with separate style arrays when ready to migrate away

## License

MIT 