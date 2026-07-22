import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type FileDropZoneProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> & {
  label: ReactNode
  sx?: StyleXStyles
}

/** A labeled native file input that keeps browse, keyboard, and drag-to-input behavior. */
export function FileDropZone({ id, label, ref, sx, ...props }: FileDropZoneProps) {
  const generatedId = `stylextras-file-${useId().replaceAll(':', '')}`
  const inputId = id ?? generatedId
  return (
    <label htmlFor={inputId} {...stylex.props(styles.zone, sx)}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <input ref={ref} id={inputId} type="file" {...props} {...stylex.props(styles.input)} />
    </label>
  )
}

const styles = stylex.create({
  zone: {
    padding: spacing.lg,
    borderColor: {
      default: colors.borderStrong,
      ':has(input:focus-visible)': colors.focusRing,
      ':has(input:user-invalid)': colors.danger,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: stroke.thin,
    gap: spacing.sm,
    placeItems: 'center',
    backgroundColor: {
      default: colors.bgSubtle,
      ':has(input:disabled)': colors.control,
    },
    color: colors.fgSoft,
    cursor: { default: 'pointer', ':has(input:disabled)': 'not-allowed' },
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    opacity: { default: 1, ':has(input:disabled)': 0.5 },
    outlineColor: {
      default: 'transparent',
      ':has(input:focus-visible)': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':has(input:focus-visible)': stroke.focusRing,
    },
    overflowWrap: 'anywhere',
    textAlign: 'center',
    minHeight: spacing.xxxxl,
    minWidth: 0,
  },
  label: {
    fontWeight: typography.weightMedium,
  },
  input: {
    outline: 'none',
    cursor: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    maxWidth: '100%',
    minHeight: spacing.targetMin,
    width: '100%',
  },
})
