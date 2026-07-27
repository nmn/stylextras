import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'nav'>

export type NavbarProps = Omit<
  BaseProps,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps & {
    sx?: StyleXStyles
  }

/**
 * Renders a token-driven top navigation container.
 *
 * Search aliases: navbar, nav bar, top nav, site nav.
 *
 * A11y notes:
 * - Uses native nav semantics.
 * - Requires a landmark name so multiple navigation regions remain distinguishable.
 */
export function Navbar({ ref, sx, ...props }: NavbarProps) {
  return <nav ref={ref} {...props} {...stylex.props(styles.base, sx)} />
}

const styles = stylex.create({
  base: {
    gap: spacing.md,
    paddingBlock: spacing.md,
    paddingInline: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
    display: 'flex',
    flexWrap: 'wrap',
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.thin,
    minWidth: 0,
  },
})
