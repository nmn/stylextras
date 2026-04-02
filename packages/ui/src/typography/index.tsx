import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { colors } from "../tokens/color.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"p">;

export type TypographyTone =
  | "default"
  | "soft"
  | "muted"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type TypographyScale = "label" | "body" | "title" | "display";

export type TypographyProps = Omit<BaseProps, "className" | "style"> & {
  as?: ElementType;
  sx?: StyleXStyles;
  tone?: TypographyTone;
  scale?: TypographyScale;
  mono?: boolean;
};

export const Typography = ({
  as: Component = "p",
  mono = false,
  scale = "body",
  sx,
  tone = "default",
  ...props
}: TypographyProps) => (
  <Component
    {...props}
    {...stylex.props(
      styles.base,
      styles[scale],
      styles[tone],
      mono && styles.mono,
      sx,
    )}
  />
);

const styles = stylex.create({
  base: {
    margin: 0,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightRegular,
    lineHeight: typography.lineHeightBody,
    letterSpacing: typography.trackingNormal,
  },
  mono: {
    fontFamily: typography.fontMono,
  },
  default: {
    color: colors.fg,
  },
  soft: {
    color: colors.fgSoft,
  },
  muted: {
    color: colors.fgMuted,
  },
  brand: {
    color: colors.brand,
  },
  info: {
    color: colors.info,
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warning,
  },
  danger: {
    color: colors.danger,
  },
  label: {
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    letterSpacing: typography.trackingWide,
  },
  body: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightRegular,
    lineHeight: typography.lineHeightBody,
    letterSpacing: typography.trackingNormal,
  },
  title: {
    fontFamily: typography.fontSans,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    letterSpacing: typography.trackingNormal,
  },
  display: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.step4,
    fontWeight: typography.weightBold,
    lineHeight: typography.lineHeightTight,
    letterSpacing: typography.trackingTight,
  },
});
