import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithoutRef<'nav'>

export type PaginationProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  currentPage?: number
  totalPages?: number
}

/**
 * Renders a simplified pagination navigation wrapper.
 *
 * Search aliases: pagination, pager, page nav, page controls.
 *
 * A11y notes:
 * - Provides structure only.
 * - Current page state, disabled state, and labels must be supplied by the caller.
 */
export function Pagination({ currentPage = 2, sx, totalPages = 5, ...props }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  return (
    <nav {...props} aria-label="Pagination" {...stylex.props(navStyles.base, sx)}>
      {pages.map((page) => (
        <a
          key={page}
          href="#"
          aria-current={page === currentPage ? 'page' : undefined}
          {...stylex.props(
            linkStyles.base,
            page === currentPage ? linkStateStyles.active : linkStateStyles.inactive,
          )}
        >
          {page}
        </a>
      ))}
    </nav>
  )
}

const navStyles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: 'center',
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
})
const linkStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.xs,
    textDecoration: 'none',
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
    minHeight: spacing.xxl,
    minWidth: spacing.xxl,
  },
})
const linkStateStyles = stylex.create({
  active: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  inactive: {
    borderColor: colors.border,
    backgroundColor: colors.control,
    color: colors.fg,
  },
})
