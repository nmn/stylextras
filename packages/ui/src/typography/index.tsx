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

/**
 * Renders token-driven type styles across body, title, label, and display scales.
 *
 * Search aliases: typography, type, text styles, heading text.
 *
 * A11y notes:
 * - Inherits semantics from the chosen underlying element.
 * - The caller must choose an appropriate element for headings, paragraphs, and document structure.
 */
export function Typography({
  as: Component = "p",
  mono = false,
  scale = "body",
  sx,
  tone = "default",
  ...props
}: TypographyProps) {
  return (
    <Component
      {...props}
      {...stylex.props(
        baseStyles.base,
        scaleStyles[scale],
        toneStyles[tone],
        mono && fontStyles.mono,
        sx,
      )}
    />
  );
}

const baseStyles = stylex.create({
  base: {
    margin: 0,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightRegular,
    lineHeight: typography.lineHeightBody,
    letterSpacing: typography.trackingNormal,
  },
});

const fontStyles = stylex.create({
  mono: {
    fontFamily: typography.fontMono,
  },
});

const toneStyles = stylex.create({
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
});

const scaleStyles = stylex.create({
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
