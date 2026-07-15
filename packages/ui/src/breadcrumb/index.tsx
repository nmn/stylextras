import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type BreadcrumbProps = Omit<ComponentPropsWithRef<'nav'>, 'className' | 'style'> & SxProp
export type BreadcrumbListProps = Omit<ComponentPropsWithRef<'ol'>, 'className' | 'style'> &
  SxProp
export type BreadcrumbItemProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'style'> &
  SxProp
export type BreadcrumbLinkProps = Omit<ComponentPropsWithRef<'a'>, 'className' | 'style'> &
  SxProp
export type BreadcrumbPageProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'> &
  SxProp
export type BreadcrumbSeparatorProps = Omit<
  ComponentPropsWithRef<'li'>,
  'aria-hidden' | 'className' | 'style'
> &
  SxProp

export function Breadcrumb({ 'aria-label': ariaLabel = 'Breadcrumb', ref, sx, ...props }: BreadcrumbProps) {
  return <nav ref={ref} aria-label={ariaLabel} {...props} {...stylex.props(styles.nav, sx)} />
}

export function BreadcrumbList({ ref, sx, ...props }: BreadcrumbListProps) {
  return <ol ref={ref} {...props} {...stylex.props(styles.list, sx)} />
}

export function BreadcrumbItem({ ref, sx, ...props }: BreadcrumbItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.item, sx)} />
}

export function BreadcrumbLink({ ref, sx, ...props }: BreadcrumbLinkProps) {
  return <a ref={ref} {...props} {...stylex.props(styles.link, sx)} />
}

export function BreadcrumbPage({ ref, sx, ...props }: BreadcrumbPageProps) {
  return <span ref={ref} aria-current="page" {...props} {...stylex.props(styles.page, sx)} />
}

export function BreadcrumbSeparator({ children = '/', ref, sx, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li ref={ref} aria-hidden="true" {...props} {...stylex.props(styles.separator, sx)}>
      {children}
    </li>
  )
}

const styles = stylex.create({
  nav: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
  list: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  link: {
    color: colors.fgMuted,
    textDecoration: { default: 'none', ':hover': 'underline' },
    textUnderlineOffset: 4,
  },
  page: { color: colors.fg, fontWeight: typography.weightMedium },
  separator: { color: colors.fgDisabled, userSelect: 'none' },
})
