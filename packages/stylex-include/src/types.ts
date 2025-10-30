export interface StyleXIncludeOptions {
  /**
   * Same as `importSources` in `@stylexjs/babel-plugin`.
   *
   * Default: `['@stylexjs/stylex']`
   */
  importSources?: (string | { from: string; as: string })[]

  /**
   * When set to `true`, `stylex.include` calls are only allowed at the beginning of style objects.
   * This enables easy mechanical migration away from `stylex.include` by replacing style references
   * with arrays of included styles and the style itself.
   *
   * Default: `true`
   */
  onlyAtBeginning?: boolean
}

export interface StyleXIncludeBabelPluginOptions extends StyleXIncludeOptions {
  /**
   * The Babel plugin cannot handle imported styles, and the default behavior is to throw an erorr.
   * 
   * If this option is set to `true`, the Babel plugin will ignore imported styles and treat them as
   * if they are empty.
   * 
   * Useful for unit tests where you don't care about the actual styles.
   * 
   * Default: `false`
   */
  ignoreImportedStyles?: boolean
}

export interface StyleXIncludeWebpackLoaderOptions extends StyleXIncludeOptions {
  /**
   * Allow cross-file `stylex.include` usages **only** from these sources. This helps keep things
   * performant and prevents usages of `stylex.include` from expanding.
   *
   * Default: `[]`
   */
  allowedStyleImports?: string[]
}
