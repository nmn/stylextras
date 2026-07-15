import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
export type RadioGroupProps = Omit<ComponentPropsWithRef<'fieldset'>, 'className' | 'style'> &
  SxProp
export type RadioGroupLegendProps = Omit<
  ComponentPropsWithRef<'legend'>,
  'className' | 'style'
> &
  SxProp
export type RadioGroupItemProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> &
  SxProp

export function RadioGroup({ ref, sx, ...props }: RadioGroupProps) {
  return <fieldset ref={ref} {...props} {...stylex.props(styles.group, sx)} />
}

export function RadioGroupLegend({ ref, sx, ...props }: RadioGroupLegendProps) {
  return <legend ref={ref} {...props} {...stylex.props(styles.legend, sx)} />
}

export function RadioGroupItem({ ref, sx, ...props }: RadioGroupItemProps) {
  return <input ref={ref} type="radio" {...props} {...stylex.props(styles.item, sx)} />
}

const styles = stylex.create({
  group: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    display: 'grid',
    gap: spacing.sm,
    margin: 0,
    padding: 0,
  },
  legend: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    marginBlockEnd: spacing.xs,
  },
  item: {
    accentColor: colors.primary,
    height: spacing.lg,
    margin: 0,
    outlineColor: colors.focusRing,
    width: spacing.lg,
    borderRadius: radius.round,
    borderWidth: stroke.thin,
  },
})
