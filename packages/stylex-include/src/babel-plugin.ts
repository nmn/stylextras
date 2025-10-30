import type { PluginObj } from '@babel/core'

import { STYLE_OBJECT_WITH_EMPTY_STYLES, StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeBabelPluginOptions } from './types'

/**
 * A Babel plugin that is a thin wrapper around {@link StyleXIncludeTransformer} that provides a 
 * convenient interface for using the transformer in a Babel plugin.
 */
export default function styleXIncludeBabelPlugin(options: StyleXIncludeBabelPluginOptions = {}): PluginObj {
  const { importSources = ['@stylexjs/stylex'], onlyAtBeginning = true, ignoreImportedStyles = false } = options

  const transformer = new StyleXIncludeTransformer({
    importSources,
    onlyAtBeginning,
  }, ignoreImportedStyles ? () => STYLE_OBJECT_WITH_EMPTY_STYLES : undefined)

  return {
    name: '@stylextras/stylex-include',
    visitor: {
      ObjectExpression: transformer.transformObjectExpression as any,
    },
  }
}
