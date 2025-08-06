# @stylextras/stylex-include

A set of utilities to support usages of `stylex.include`, a legacy API that was removed in StyleX `0.11.0`.

Exported components:
- **Babel plugin**: Inlines same-file usages of `stylex.include`
- **Webpack loader**: Inlines same-file and cross-file usages of `stylex.include`
- **Transformer**: Babel-based shared lower-level logic for more advanced use-cases

## Options

### `importSources` (shared)

Same as `importSources` in `@stylexjs/babel-plugin`. 

Default: `['@stylexjs/stylex']`.

```javascript
{
  importSources: ['@acme/styles']
}
```

### `allowedStyleImports` (Webpack loader only)

If provided, cross-file `stylex.include` calls are allowed *only from listed sources*. This helps keep legacy API usage contained within your codebase. 

Default: `[]`

```javascript
{
  allowedStyleImports: ['@acme/styles/typography']
}
```

### `onlyAtBeginning`

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

## License

MIT 