import type { AriaAttributes } from 'react'

export function isAriaInvalid(value: AriaAttributes['aria-invalid']) {
  return value === true || value === 'true' || value === 'grammar' || value === 'spelling'
}

export function mergeIdRefs(...values: Array<string | undefined>) {
  const tokens = values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? [])
  return tokens.length > 0 ? [...new Set(tokens)].join(' ') : undefined
}
