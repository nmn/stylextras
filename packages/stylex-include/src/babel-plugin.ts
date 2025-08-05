import type { PluginObj } from '@babel/core'

import { StyleXIncludeTransformer } from './transformer'
import type { StyleXIncludeOptions } from './types'

export default function styleXIncludeBabelPlugin(options: StyleXIncludeOptions = {}): PluginObj {
  const { importSources = ['@stylexjs/stylex'], onlyAtBeginning = true } = options

  const transformer = new StyleXIncludeTransformer({
    importSources,
    onlyAtBeginning,
  })

  return {
    name: '@stylextras/stylex-include',
    visitor: {
      ObjectExpression: transformer.transformObjectExpression,
    },
  }
}
