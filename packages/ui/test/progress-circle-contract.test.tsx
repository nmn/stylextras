import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'
import { ProgressCircle } from '../src/progress-circle'

vi.mock('@stylexjs/stylex', () => ({
  create: <T,>(styles: T) => styles,
  defineConsts: <T,>(constants: T) => constants,
  defineVars: <T extends Record<string, unknown>>(variables: T) =>
    Object.fromEntries(Object.keys(variables).map((key) => [key, `var(--${key})`])) as T,
  props: () => ({}),
}))

describe('ProgressCircle value semantics', () => {
  test('preserves a finite fractional value', () => {
    const markup = renderToStaticMarkup(
      <ProgressCircle aria-label="Upload progress" max={50} value={12.5} />,
    )

    expect(markup).toContain('aria-valuemax="50"')
    expect(markup).toContain('aria-valuenow="12.5"')
    expect(markup).toContain('25%')
  })

  test.each([
    { max: Number.NaN, value: Number.NaN },
    { max: Number.POSITIVE_INFINITY, value: Number.NEGATIVE_INFINITY },
    { max: 0, value: 10 },
  ])('normalizes non-finite or non-positive inputs: %o', ({ max, value }) => {
    const markup = renderToStaticMarkup(
      <ProgressCircle aria-label="Upload progress" max={max} value={value} />,
    )

    expect(markup).toContain('aria-valuemax="100"')
    expect(markup).toMatch(/aria-valuenow="(?:0|10)"/)
    expect(markup).not.toMatch(/(?:Infinity|NaN)/)
  })
})
