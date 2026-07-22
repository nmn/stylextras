import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SharedProps = { sx?: StyleXStyles }

export type EditableTextProps =
  | (Omit<ComponentPropsWithRef<'input'>, 'className' | 'style' | 'type'> &
      SharedProps & { multiline?: false })
  | (Omit<ComponentPropsWithRef<'textarea'>, 'className' | 'style'> &
      SharedProps & { multiline: true })

/** A native text input or textarea styled for inline editing. */
export function EditableText(props: EditableTextProps) {
  if (props.multiline) {
    const { multiline: _multiline, ref, sx, ...textareaProps } = props
    return (
      <textarea
        ref={ref}
        {...textareaProps}
        {...stylex.props(styles.control, styles.multiline, sx)}
      />
    )
  }

  const { multiline: _multiline, ref, sx, ...inputProps } = props
  return (
    <input
      ref={ref}
      type="text"
      {...inputProps}
      {...stylex.props(styles.control, styles.inline, sx)}
    />
  )
}

const styles = stylex.create({
  control: {
    borderColor: {
      '[aria-invalid="true"]': colors.danger,
      default: colors.border,
      ':focus-visible': colors.focusRing,
      ':user-invalid': colors.danger,
      ':hover': colors.borderStrong,
    },
    borderRadius: radius.sm,
    borderStyle: 'dashed',
    borderWidth: stroke.thin,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.xs,
    boxSizing: 'border-box',
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: 0,
  },
  inline: {
    display: 'inline-block',
    width: 'auto',
  },
  multiline: {
    display: 'block',
    resize: 'vertical',
    minHeight: '6rem',
    width: '100%',
  },
})
