import * as stylex from '@stylexjs/stylex'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { ButtonProps } from '../src/button'
import type { SelectProps } from '../src/select'
import { blurThemes } from '../dist/blur-themes/index.js'
import { colorThemes } from '../dist/color-themes/index.js'
import { elevationThemes } from '../dist/elevation-themes/index.js'
import { motionThemes } from '../dist/motion-themes/index.js'
import { radiusThemes } from '../dist/radius-themes/index.js'
import { spacingThemes } from '../dist/spacing-themes/index.js'
import { strokeThemes } from '../dist/stroke-themes/index.js'
import { typographyThemes } from '../dist/typography-themes/index.js'

describe('plain StyleX themes', () => {
  it('exports neutral bases and a broad accent range', () => {
    expect(Object.keys(colorThemes)).toEqual([
      'neutral',
      'stone',
      'zinc',
      'mauve',
      'olive',
      'mist',
      'taupe',
      'amber',
      'blue',
      'cyan',
      'emerald',
      'fuchsia',
      'green',
      'indigo',
      'lime',
      'orange',
      'pink',
      'purple',
      'red',
      'rose',
      'sky',
      'teal',
      'violet',
      'yellow',
    ])
  })

  it('composes theme objects directly on any element', () => {
    const result = stylex.props(
      colorThemes.zinc,
      spacingThemes.compact,
      radiusThemes.rounded,
      elevationThemes.soft,
      strokeThemes.base,
      typographyThemes.ui,
      blurThemes.subtle,
      motionThemes.snappy,
    )
    expect(result.className).toBeTypeOf('string')
    expect(result.className?.split(' ').length).toBeGreaterThanOrEqual(4)
    expect(result.style).toBeUndefined()
  })

  it('exposes a plain theme map for every variable group', () => {
    expect(Object.keys(blurThemes)).toEqual(['base', 'crisp', 'subtle', 'soft', 'hazy'])
    expect(Object.keys(elevationThemes)).toEqual([
      'base',
      'flat',
      'soft',
      'float',
      'hard',
      'poster',
    ])
    expect(Object.keys(motionThemes)).toEqual([
      'standard',
      'snappy',
      'gentle',
      'expressive',
      'instant',
    ])
    expect(Object.keys(radiusThemes)).toEqual([
      'base',
      'sharp',
      'subtle',
      'rounded',
      'soft',
      'pill',
    ])
    expect(Object.keys(spacingThemes)).toEqual([
      'base',
      'tight',
      'compact',
      'cozy',
      'roomy',
      'poster',
    ])
    expect(Object.keys(strokeThemes)).toEqual([
      'base',
      'hairline',
      'bold',
      'poster',
      'brutal',
    ])
    expect(Object.keys(typographyThemes)).toEqual([
      'ui',
      'editorial',
      'mono',
      'industrial',
    ])
  })

  it('exposes native props while omitting competing styling channels', () => {
    expectTypeOf<ButtonProps>().toHaveProperty('onClick')
    expectTypeOf<ButtonProps>().toHaveProperty('ref')
    expectTypeOf<ButtonProps>().toHaveProperty('sx')
    expectTypeOf<ButtonProps>().not.toHaveProperty('className')
    expectTypeOf<ButtonProps>().not.toHaveProperty('style')

    expectTypeOf<SelectProps>().toHaveProperty('name')
    expectTypeOf<SelectProps>().toHaveProperty('required')
    expectTypeOf<SelectProps>().toHaveProperty('ref')
    expectTypeOf<SelectProps>().not.toHaveProperty('className')
    expectTypeOf<SelectProps>().not.toHaveProperty('style')
  })
})
