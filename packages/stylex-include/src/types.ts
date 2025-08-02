export interface StyleXIncludeOptions {
  /**
   * Same as `importSources` in `@stylexjs/babel-plugin`. Default: ['@stylexjs/stylex']
   */
  importSources?: (string | { from: string; as: string })[]

  /**
   * Allow cross-file `stylex.include` calls **only** from these sources. This helps keep this
   * plugin performant and prevents usages of `stylex.include` from expanding. Default: []
   */
  allowedStyleImports?: string[]

  /**
   * When set to `true`, `stylex.include` calls are only allowed at the beginning of style objects.
   * This enables easy mechanical migration away from `stylex.include` by replacing style references
   * with arrays of included styles and the style itself. Default: true
   */
  onlyAtBeginning?: boolean
}
