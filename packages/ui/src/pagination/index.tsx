'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  createContext,
  type ComponentPropsWithRef,
  type RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { composeRefs } from '../internal/refs'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type SxProp = { sx?: StyleXStyles }

export type PaginationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & {
    /** The exact destination of the page represented by the current result set. */
    currentHref: string
  }
export type PaginationListProps = Omit<
  ComponentPropsWithRef<'ul'>,
  'className' | 'role' | 'style'
> &
  SxProp
export type PaginationItemProps = Omit<
  ComponentPropsWithRef<'li'>,
  'className' | 'style'
> &
  SxProp
export type PaginationLinkProps = Omit<
  ComponentPropsWithRef<'a'>,
  'aria-current' | 'className' | 'href' | 'style'
> &
  SxProp & {
    href: string
  }

const PaginationContext = createContext<string | null>(null)
const paginationWarnings = new WeakMap<HTMLElement, string>()

function useCurrentHref() {
  const currentHref = useContext(PaginationContext)
  if (currentHref === null) {
    throw new Error('PaginationLink must be rendered inside Pagination.')
  }
  return currentHref
}

function useDestinationInvariant(
  paginationRef: RefObject<HTMLElement | null>,
  currentHref: string,
) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    const pagination = paginationRef.current
    if (!pagination) return

    const validate = () => {
      const matchingLinks = Array.from(
        pagination.querySelectorAll<HTMLAnchorElement>(
          'a[data-stylextras-pagination-link]',
        ),
      ).filter(
        (link) =>
          link.closest('[data-stylextras-pagination-root]') === pagination &&
          link.getAttribute('href') === currentHref,
      )

      let warning = ''
      if (matchingLinks.length === 0) {
        warning = `Pagination currentHref "${currentHref}" does not match any PaginationLink destination.`
      } else if (matchingLinks.length > 1) {
        warning = `Pagination currentHref "${currentHref}" matches ${matchingLinks.length} PaginationLink destinations. Destinations must be unique.`
      }

      if (warning && warning !== paginationWarnings.get(pagination)) console.warn(warning)
      paginationWarnings.set(pagination, warning)
    }

    validate()
    const observer = new MutationObserver(validate)
    observer.observe(pagination, {
      attributeFilter: ['href'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [currentHref, paginationRef])
}

/**
 * A named pagination landmark. Compose a native list and real links inside it.
 *
 * Search aliases: pagination, pager, page nav, page controls.
 *
 * A11y notes:
 * - `currentHref` owns the current-page state. Exactly one composed link must
 *   have that destination.
 */
export function Pagination({ currentHref, ref, sx, ...props }: PaginationProps) {
  const paginationRef = useRef<HTMLElement>(null)
  const setRef = useMemo(() => composeRefs(paginationRef, ref), [ref])
  useDestinationInvariant(paginationRef, currentHref)

  return (
    <PaginationContext value={currentHref}>
      <nav
        ref={setRef}
        {...props}
        data-stylextras-pagination-root=""
        {...stylex.props(navStyles.base, sx)}
      />
    </PaginationContext>
  )
}

export function PaginationList({ ref, sx, ...props }: PaginationListProps) {
  return <ul ref={ref} {...props} role="list" {...stylex.props(listStyles.base, sx)} />
}

export function PaginationItem({ ref, sx, ...props }: PaginationItemProps) {
  return <li ref={ref} {...props} {...stylex.props(listStyles.item, sx)} />
}

export function PaginationLink({
  href,
  ref,
  sx,
  ...props
}: PaginationLinkProps) {
  const current = href === useCurrentHref()
  return (
    <a
      ref={ref}
      {...props}
      href={href}
      aria-current={current ? 'page' : undefined}
      data-stylextras-pagination-link=""
      {...stylex.props(
        linkStyles.base,
        current ? linkStateStyles.active : linkStateStyles.inactive,
        sx,
      )}
    />
  )
}

const navStyles = stylex.create({
  base: {
    display: 'block',
  },
})
const listStyles = stylex.create({
  base: {
    margin: 0,
    padding: 0,
    gap: spacing.xs,
    listStyle: 'none',
    alignItems: 'center',
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
  item: {
    display: 'inline-flex',
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
