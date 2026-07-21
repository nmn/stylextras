import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type NativeSelectProps = ComponentPropsWithRef<'select'>
type NativeOptionProps = ComponentPropsWithRef<'option'>

export type SelectProps = Omit<NativeSelectProps, 'className' | 'style'> & {
  sx?: StyleXStyles
}
export type OptionProps = Omit<NativeOptionProps, 'className' | 'style'> & {
  sx?: StyleXStyles
}

/**
 * A styled native select. It retains native form and mobile-picker behavior, and
 * progressively adopts customizable-select presentation where supported.
 */
export function Select({ ref, sx, ...props }: SelectProps) {
  return <select ref={ref} {...props} {...stylex.props(styles.base, styles.customizable, sx)} />
}

/** A styled native option for use inside Select. */
export function Option({ ref, sx, ...props }: OptionProps) {
  return <option ref={ref} {...props} {...stylex.props(styles.option, sx)} />
}

/* eslint-disable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
const styles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: {
      default: 'none',
      '@supports (appearance: base-select)': 'base-select',
      '@media (pointer: coarse)': 'auto',
    },
    backgroundColor: colors.control,
    backgroundImage: {
      default: `linear-gradient(45deg, transparent 50%, ${colors.fgMuted} 50%), linear-gradient(135deg, ${colors.fgMuted} 50%, transparent 50%)`,
      '@supports (appearance: base-select)': 'none',
      '@media (pointer: coarse)': 'none',
    },
    backgroundPosition: `calc(100% - ${spacing.md}) calc(50% - 1px), calc(100% - ${spacing.sm}) calc(50% - 1px)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '5px 5px, 5px 5px',
    borderColor: {
      default: colors.border,
      ':hover': colors.borderStrong,
      ':focus-visible': colors.focusRing,
      ':user-invalid': colors.danger,
      '[aria-invalid="true"]': colors.danger,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    boxSizing: 'border-box',
    color: colors.fg,
    display: {
      default: 'block',
      '@supports (appearance: base-select)': 'flex',
    },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    minHeight: spacing.controlMd,
    minWidth: 0,
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    outline: 'none',
    paddingInline: {
      default: `${spacing.md} ${spacing.xxl}`,
      '@supports (appearance: base-select)': spacing.md,
      '@media (pointer: coarse)': spacing.md,
    },
    textAlign: 'start',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
  // These selectors are ignored by conventional native selects. Supporting
  // engines expose the picker and selected content as styleable pseudo-elements.
  customizable: {
    // eslint-disable-next-line @stylexjs/valid-styles
    '::picker(select)': {
      appearance: 'base-select',
      backgroundColor: colors.controlHover,
      borderColor: colors.border,
      borderRadius: radius.sm,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      boxShadow: elevation.md,
      color: colors.popoverForeground,
      marginBlock: spacing.xs,
      minWidth: 'anchor-size(width)',
      opacity: 0,
      padding: spacing.xxs,
      transitionBehavior: 'allow-discrete',
      transitionDuration: {
        default: motion.durationFast,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: motion.easeEmphasized,
      transform: {
        default: 'translateY(-4px) scale(0.98)',
        '@media (prefers-reduced-motion: reduce)': 'none',
      },
    },
    // eslint-disable-next-line @stylexjs/valid-styles
    '::picker-icon': {
      alignSelf: 'center',
      color: colors.fgMuted,
      flexShrink: 0,
      marginInlineStart: 'auto',
      transitionDuration: {
        default: motion.durationFast,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'rotate',
    },
    // eslint-disable-next-line @stylexjs/valid-styles
    ':open::picker-icon': {
      rotate: '180deg',
    },
    // eslint-disable-next-line @stylexjs/valid-styles
    ':open::picker(select)': {
      opacity: 1,
      transform: {
        default: 'translateY(0) scale(1)',
        '@media (prefers-reduced-motion: reduce)': 'none',
      },
    },
  },
  option: {
    backgroundColor: {
      default: 'transparent',
      ':checked': colors.selection,
      ':focus': colors.accent,
      ':hover': colors.accent,
    },
    borderRadius: radius.xs,
    color: {
      default: colors.popoverForeground,
      ':checked': colors.primary,
      ':focus': colors.accentForeground,
      ':hover': colors.accentForeground,
      ':disabled': colors.fgDisabled,
    },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.controlSm,
    outline: 'none',
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
