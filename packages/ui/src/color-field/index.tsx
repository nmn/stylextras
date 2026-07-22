import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type ColorFieldProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> & { sx?: StyleXStyles }

/** A native color input. Give it a visible label or an accessible name. */
export function ColorField({ ref, sx, ...props }: ColorFieldProps) {
  return <input ref={ref} type="color" {...props} {...stylex.props(styles.input, sx)} />
}

const styles = stylex.create({
  input: {
    padding: 0,
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    height: spacing.xxxl,
    width: spacing.xxxxl,
  },
})
