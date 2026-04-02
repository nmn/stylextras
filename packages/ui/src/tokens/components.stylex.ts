import * as stylex from '@stylexjs/stylex';
import { blur } from './blur.stylex';
import { colors } from './color.stylex';
import { elevation } from './elevation.stylex';
import { motion } from './motion.stylex';
import { radius } from './radius.stylex';
import { spacing } from './spacing.stylex';
import { stroke } from './stroke.stylex';
import { typography } from './typography.stylex';

export const componentTokens = stylex.defineConsts({
  controlHeightSm: `calc(${spacing.base} * 8)`,
  controlHeightMd: `calc(${spacing.base} * 10)`,
  controlHeightLg: `calc(${spacing.base} * 12)`,
  controlPaddingInlineSm: spacing.sm,
  controlPaddingInlineMd: spacing.md,
  controlPaddingInlineLg: spacing.lg,
  controlBorderWidth: stroke.thin,
  controlRadius: radius.md,
  controlBorder: colors.border,
  controlBorderHover: colors.borderStrong,
  controlSurface: colors.bg,
  controlSurfaceHover: colors.bgRaised,
  controlText: colors.fg,
  controlPlaceholder: colors.fgMuted,
  buttonGap: spacing.xs,
  buttonPrimaryBg: colors.primary,
  buttonPrimaryBgHover: colors.primaryHover,
  buttonPrimaryBgActive: colors.primaryActive,
  buttonPrimaryFg: colors.primaryForeground,
  buttonSecondaryBg: colors.secondary,
  buttonSecondaryBgHover: colors.secondaryHover,
  buttonSecondaryFg: colors.secondaryForeground,
  panelSurface: colors.bgRaised,
  panelBorder: colors.border,
  panelBorderWidth: stroke.thin,
  panelRadius: radius.lg,
  panelShadow: elevation.md,
  panelBlur: blur.xs,
  overlayBackdrop: colors.overlay,
  overlaySurface: colors.bgOverlay,
  overlayRadius: radius.xl,
  overlayShadow: elevation.lg,
  overlayBlur: blur.lg,
  navItemRadius: radius.sm,
  navItemGap: spacing.xs,
  navItemBorderWidth: stroke.hairline,
  navItemHoverBg: colors.secondary,
  navItemActiveBg: colors.accent,
  navItemText: colors.fgSoft,
  navItemTextActive: colors.fg,
  focusRing: colors.focusRing,
  focusRingWidth: stroke.thick,
  focusRingDuration: motion.durationFast,
  focusRingEasing: motion.easeStandard,
  textBodyFamily: typography.fontSans,
  textDisplayFamily: typography.fontDisplay,
  textBody: typography.step0,
  textLabel: typography.stepMinus1,
  textTitle: typography.step1,
  textDisplay: typography.step4,
});
