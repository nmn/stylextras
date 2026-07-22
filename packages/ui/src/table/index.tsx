import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
export type TableProps = Omit<ComponentPropsWithRef<'table'>, 'className' | 'style'> & SxProp
export type TableHeaderProps = Omit<ComponentPropsWithRef<'thead'>, 'className' | 'style'> & SxProp
export type TableBodyProps = Omit<ComponentPropsWithRef<'tbody'>, 'className' | 'style'> & SxProp
export type TableFooterProps = Omit<ComponentPropsWithRef<'tfoot'>, 'className' | 'style'> & SxProp
export type TableRowProps = Omit<ComponentPropsWithRef<'tr'>, 'className' | 'style'> & SxProp
export type TableHeadProps = Omit<ComponentPropsWithRef<'th'>, 'className' | 'style'> & SxProp
export type TableCellProps = Omit<ComponentPropsWithRef<'td'>, 'className' | 'style'> & SxProp
export type TableCaptionProps = Omit<ComponentPropsWithRef<'caption'>, 'className' | 'style'> & SxProp
export type TableScrollAreaProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style' | 'tabIndex'
> &
  SxProp &
  AccessibleAriaNameProps

export function TableScrollArea({ ref, sx, ...props }: TableScrollAreaProps) {
  return (
    <div ref={ref} tabIndex={0} {...props} {...stylex.props(styles.scrollArea, sx)} />
  )
}

export function Table({ ref, sx, ...props }: TableProps) {
  return <table ref={ref} {...props} {...stylex.props(styles.table, sx)} />
}
export function TableHeader({ ref, sx, ...props }: TableHeaderProps) {
  return <thead ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}
export function TableBody({ ref, sx, ...props }: TableBodyProps) {
  return <tbody ref={ref} {...props} {...stylex.props(styles.body, sx)} />
}
export function TableFooter({ ref, sx, ...props }: TableFooterProps) {
  return <tfoot ref={ref} {...props} {...stylex.props(styles.footer, sx)} />
}
export function TableRow({ ref, sx, ...props }: TableRowProps) {
  return <tr ref={ref} {...props} {...stylex.props(styles.row, sx)} />
}
export function TableHead({ ref, scope = 'col', sx, ...props }: TableHeadProps) {
  return <th ref={ref} scope={scope} {...props} {...stylex.props(styles.head, sx)} />
}
export function TableCell({ ref, sx, ...props }: TableCellProps) {
  return <td ref={ref} {...props} {...stylex.props(styles.cell, sx)} />
}
export function TableCaption({ ref, sx, ...props }: TableCaptionProps) {
  return <caption ref={ref} {...props} {...stylex.props(styles.caption, sx)} />
}

const styles = stylex.create({
  scrollArea: {
    maxWidth: '100%',
    overflow: 'auto',
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    overscrollBehavior: 'contain',
    scrollbarGutter: 'stable',
  },
  table: {
    borderCollapse: 'collapse',
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    width: '100%',
  },
  header: {
    borderBlockEndColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.thin,
  },
  body: {},
  footer: { backgroundColor: colors.bgSubtle, fontWeight: typography.weightMedium },
  row: {
    borderBlockEndColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.thin,
  },
  head: { color: colors.fgMuted, fontWeight: typography.weightMedium, overflowWrap: 'anywhere', padding: spacing.md, textAlign: 'start' },
  cell: { overflowWrap: 'anywhere', padding: spacing.md, verticalAlign: 'middle' },
  caption: { captionSide: 'bottom', color: colors.fgMuted, paddingBlock: spacing.md, textAlign: 'start' },
})
