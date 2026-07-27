import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { DateField, type DateFieldProps } from '../date-field'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

export type RangeCalendarFieldProps = Omit<
  DateFieldProps,
  'defaultValue' | 'form' | 'id' | 'inputId' | 'max' | 'min' | 'name' | 'value'
>

export type RangeCalendarProps = Omit<ComponentPropsWithRef<'fieldset'>, 'className' | 'style'> & {
  endDefaultValue?: string
  endId?: string
  endLabel?: ReactNode
  endName?: string
  endProps?: RangeCalendarFieldProps
  legend: ReactNode
  max?: string
  min?: string
  startDefaultValue?: string
  startId?: string
  startLabel?: ReactNode
  startName?: string
  startProps?: RangeCalendarFieldProps
  sx?: StyleXStyles
}

/** A zero-JavaScript date-range fallback composed from two labeled native date inputs. */
export function RangeCalendar({
  children,
  endDefaultValue,
  endId,
  endLabel = 'End date',
  endName,
  endProps,
  form,
  legend,
  max,
  min,
  ref,
  startDefaultValue,
  startId,
  startLabel = 'Start date',
  startName,
  startProps,
  sx,
  ...props
}: RangeCalendarProps) {
  const generatedId = useId().replaceAll(':', '')
  const resolvedStartId = startId ?? `stylextras-range-start-${generatedId}`
  const resolvedEndId = endId ?? `stylextras-range-end-${generatedId}`
  return (
    <fieldset ref={ref} form={form} {...props} {...stylex.props(styles.group, sx)}>
      <legend {...stylex.props(styles.legend)}>{legend}</legend>
      <label htmlFor={resolvedStartId} {...stylex.props(styles.field)}>
        <span>{startLabel}</span>
        <DateField
          {...startProps}
          id={resolvedStartId}
          defaultValue={startDefaultValue}
          form={form}
          max={max}
          min={min}
          name={startName}
        />
      </label>
      <label htmlFor={resolvedEndId} {...stylex.props(styles.field)}>
        <span>{endLabel}</span>
        <DateField
          {...endProps}
          id={resolvedEndId}
          defaultValue={endDefaultValue}
          form={form}
          max={max}
          min={min}
          name={endName}
        />
      </label>
      {children}
    </fieldset>
  )
}

const styles = stylex.create({
  group: {
    margin: 0,
    padding: 0,
    borderStyle: 'none',
    borderWidth: 0,
    gap: spacing.sm,
    display: 'grid',
    minWidth: 0,
  },
  legend: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    marginBlockEnd: spacing.xs,
  },
  field: {
    gap: spacing.xs,
    color: colors.fg,
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
})
