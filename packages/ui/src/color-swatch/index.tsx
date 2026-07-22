import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'

type ColorSwatchAccessibilityProps =
  | (AccessibleAriaNameProps & { 'aria-hidden'?: false })
  | {
      'aria-hidden'?: true
      'aria-label'?: never
      'aria-labelledby'?: never
    }
export type ColorSwatchProps = Omit<
  ComponentPropsWithRef<'span'>,
  'aria-hidden' | 'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  ColorSwatchAccessibilityProps & {
    color?: string
    sx?: StyleXStyles
  }

/** A decorative swatch by default; give it a name to expose it as an image. */
export function ColorSwatch({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-hidden': ariaHidden,
  color = '#7c3aed',
  ref,
  sx,
  ...props
}: ColorSwatchProps) {
  const meaningful = ariaLabel !== undefined || ariaLabelledby !== undefined
  return (
    <span
      ref={ref}
      aria-hidden={meaningful ? ariaHidden : true}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      role={meaningful ? 'img' : undefined}
      {...props}
      {...stylex.props(styles.swatch, dynamicStyles.color(color), sx)}
    />
  )
}

const styles = stylex.create({
  swatch: {
    borderRadius: radius.md,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    height: spacing.xxl,
    width: spacing.xxl,
  },
})

const dynamicStyles = stylex.create({
  color: (value: string) => ({ backgroundColor: value }),
})
