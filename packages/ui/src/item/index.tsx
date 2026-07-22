import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ElementType } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
type DivProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp

export type ItemProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> &
  SxProp & { as?: T }
export type ItemMediaProps = DivProps
export type ItemContentProps = DivProps
export type ItemActionsProps = DivProps
export type ItemTitleProps<T extends ElementType = 'h3'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> &
  SxProp & { as?: T }
export type ItemDescriptionProps = Omit<
  ComponentPropsWithRef<'p'>,
  'className' | 'style'
> &
  SxProp

export function Item<T extends ElementType = 'div'>({ as, sx, ...props }: ItemProps<T>) {
  const Component = as ?? 'div'
  return <Component {...props} {...stylex.props(styles.item, sx)} />
}

export function ItemMedia({ ref, sx, ...props }: ItemMediaProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.media, sx)} />
}

export function ItemContent({ ref, sx, ...props }: ItemContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

export function ItemTitle<T extends ElementType = 'h3'>({ as, sx, ...props }: ItemTitleProps<T>) {
  const Component = as ?? 'h3'
  return <Component {...props} {...stylex.props(styles.title, sx)} />
}

export function ItemDescription({ ref, sx, ...props }: ItemDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function ItemActions({ ref, sx, ...props }: ItemActionsProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.actions, sx)} />
}

const styles = stylex.create({
  item: {
    alignItems: 'center',
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
    minWidth: 0,
    padding: spacing.md,
    overflowWrap: 'anywhere',
  },
  media: {
    alignItems: 'center',
    color: colors.fgMuted,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
  },
  content: {
    display: 'grid',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  title: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    margin: 0,
    overflowWrap: 'anywhere',
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
    margin: 0,
    overflowWrap: 'anywhere',
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginInlineStart: 'auto',
    maxWidth: '100%',
  },
})
