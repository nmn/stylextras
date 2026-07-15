'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { useId, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { AccessibleGroupNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'fieldset'>

export type SegmentOption =
  | string
  | {
      description?: ReactNode
      label: ReactNode
      value: string
    }

export type SegmentedControlProps = Omit<
  BaseProps,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleGroupNameProps & {
    name?: string
    onValueChange?: (value: string) => void
    options?: SegmentOption[]
    sx?: StyleXStyles
    value?: string
    defaultValue?: string
  }

const defaultOptions: SegmentOption[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

/**
 * Renders a radio-backed segmented control that reads like tabs or a switcher.
 *
 * Search aliases: segmented control, segments, radio tabs, segmented switch.
 *
 * A11y notes:
 * - Uses native fieldset and radio semantics.
 * - It behaves like a single-choice control, not a full tab widget with panel relationships.
 */
export function SegmentedControl({
  defaultValue,
  disabled,
  legend,
  name,
  onValueChange,
  options = defaultOptions,
  sx,
  value,
  ...props
}: SegmentedControlProps) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? normalizedOptions[0]?.value ?? '',
  )
  const currentValue = value ?? internalValue

  function handleChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  return (
    <fieldset {...props} disabled={disabled} {...stylex.props(rootStyles.base, sx)}>
      {legend ? <legend {...stylex.props(rootStyles.legend)}>{legend}</legend> : null}
      <div {...stylex.props(trackStyles.base)}>
        {normalizedOptions.map((option) => {
          const checked = currentValue === option.value

          return (
            <label
              key={option.value}
              {...stylex.props(segmentStyles.base, checked ? stateStyles.on : stateStyles.off)}
            >
              <input
                checked={checked}
                name={groupName}
                onChange={() => handleChange(option.value)}
                type="radio"
                value={option.value}
                {...stylex.props(inputStyles.base)}
              />
              <span {...stylex.props(copyStyles.base)}>
                <span {...stylex.props(copyStyles.label)}>{option.label}</span>
                {option.description ? (
                  <span {...stylex.props(copyStyles.description)}>{option.description}</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

const rootStyles = stylex.create({
  base: {
    margin: 0,
    padding: 0,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    gap: spacing.xs,
    display: 'grid',
    minWidth: 0,
  },
  legend: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
})

const trackStyles = stylex.create({
  base: {
    padding: spacing.xxxs,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.xxxs,
    alignItems: 'stretch',
    backgroundColor: colors.bgInset,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '100%',
    width: 'fit-content',
  },
})

const segmentStyles = stylex.create({
  base: {
    borderColor: 'transparent',
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingBlock: spacing.xs,
    paddingInline: spacing.md,
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':has(input:checked)': colors.bgOverlay,
      ':hover': colors.bgSubtle,
    },
    boxShadow: {
      default: null,
      ':has(input:checked)': `0 1px 2px ${colors.overlay}`,
      ':has(input:focus-visible)': `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    color: {
      default: colors.fgMuted,
      ':has(input:checked)': colors.fg,
      ':hover': colors.fgSoft,
    },
    cursor: 'pointer',
    display: 'inline-flex',
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color, box-shadow, color',
    transitionTimingFunction: 'ease-in-out',
    userSelect: 'none',
    minHeight: spacing.xxxl,
    minWidth: `calc(${spacing.xxxxl} + ${spacing.md})`,
  },
})

const inputStyles = stylex.create({
  base: {
    inset: 0,
    margin: 0,
    cursor: 'inherit',
    opacity: 0,
    position: 'absolute',
  },
})

const copyStyles = stylex.create({
  base: {
    gap: spacing.xxs,
    display: 'grid',
    pointerEvents: 'none',
    minWidth: 0,
  },
  label: {
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    whiteSpace: 'nowrap',
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    lineHeight: typography.lineHeightBody,
  },
})

const stateStyles = stylex.create({
  on: {
    borderColor: colors.borderStrong,
  },
  off: {
    borderColor: 'transparent',
  },
})
