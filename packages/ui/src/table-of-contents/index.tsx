import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type TableOfContentsProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp
export type TableOfContentsTitleElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TableOfContentsTitleProps<
  T extends TableOfContentsTitleElement = 'h2',
> = Omit<ComponentPropsWithRef<T>, 'className' | 'style'> &
  SxProp & { as?: T }
export type TableOfContentsListProps = Omit<
  ComponentPropsWithRef<'ol'>,
  'className' | 'role' | 'style'
> &
  SxProp
export type TableOfContentsItemProps = Omit<
  ComponentPropsWithRef<'li'>,
  'className' | 'style'
> &
  SxProp
export type TableOfContentsLinkProps = Omit<
  ComponentPropsWithRef<'a'>,
  'aria-current' | 'className' | 'href' | 'style'
> &
  SxProp & {
    /** Marks the current in-page location. */
    active?: boolean
    'aria-current'?: ComponentPropsWithRef<'a'>['aria-current']
    href: string
  }

/** A native navigation landmark for an in-page outline. */
export function TableOfContents({ ref, sx, ...props }: TableOfContentsProps) {
  return <nav ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

/** The visible heading for a TableOfContents. */
export function TableOfContentsTitle<
  T extends TableOfContentsTitleElement = 'h2',
>({ as, sx, ...props }: TableOfContentsTitleProps<T>) {
  const Component = as ?? 'h2'
  return <Component {...props} {...stylex.props(styles.title, sx)} />
}

/** The ordered list containing TableOfContentsItem parts. */
export function TableOfContentsList({ ref, sx, ...props }: TableOfContentsListProps) {
  return <ol ref={ref} {...props} role="list" {...stylex.props(styles.list, sx)} />
}

/** A table-of-contents row. Nest another list to represent heading depth. */
export function TableOfContentsItem({ ref, sx, ...props }: TableOfContentsItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.item, sx)} />
}

/** A native hash link that can identify the currently active heading. */
export function TableOfContentsLink({
  active = false,
  'aria-current': ariaCurrent,
  ref,
  sx,
  ...props
}: TableOfContentsLinkProps) {
  return (
    <a
      ref={ref}
      {...props}
      aria-current={active ? 'location' : ariaCurrent}
      {...stylex.props(styles.link, active && styles.activeLink, sx)}
    />
  )
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: spacing.sm,
    minWidth: 0,
  },
  title: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
  },
  list: {
    display: 'grid',
    gap: spacing.xs,
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInlineStart: spacing.md,
  },
  item: {
    listStyle: 'none',
    minWidth: 0,
  },
  link: {
    color: {
      default: colors.fg,
      ':hover': colors.brand,
    },
    display: 'block',
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightRegular,
    lineHeight: typography.lineHeightBody,
    overflowWrap: 'anywhere',
    textDecoration: 'none',
  },
  activeLink: {
    color: colors.brand,
    fontWeight: typography.weightMedium,
  },
})
