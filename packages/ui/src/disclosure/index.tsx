import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"details">;

export type DisclosureSize = "md" | "lg";

export type DisclosureProps = Omit<BaseProps, "className" | "style"> & {
  summary: ReactNode;
  sx?: StyleXStyles;
  summarySx?: StyleXStyles;
  contentSx?: StyleXStyles;
  size?: DisclosureSize;
};

/**
 * Renders a disclosure using native details and summary elements.
 *
 * Search aliases: disclosure, accordion item, expandable section, details.
 *
 * A11y notes:
 * - Uses native <details>/<summary> semantics.
 * - Does not add single-open accordion constraints unless composed externally.
 */
export function Disclosure({
  children,
  contentSx,
  size = "md",
  summary,
  summarySx,
  sx,
  ...props
}: DisclosureProps) {
  return (
    <details {...props} {...stylex.props(baseStyles.base, sx)}>
      <summary
        {...stylex.props(summaryStyles.base, sizeStyles[size], summarySx)}
      >
        {summary}
      </summary>
      <div {...stylex.props(contentStyles.base, contentSx)}>{children}</div>
    </details>
  );
}

const baseStyles = stylex.create({
  base: {
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    width: "100%",
  },
});

const summaryStyles = stylex.create({
  base: {
    listStyle: "revert",
    color: colors.fg,
    cursor: "pointer",
    fontFamily: typography.fontSans,
    fontWeight: typography.weightSemibold,
  },
});

const sizeStyles = stylex.create({
  md: {
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
  lg: {
    fontSize: typography.step1,
    lineHeight: typography.lineHeightTight,
  },
});

const contentStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    paddingTop: spacing.md,
  },
});
