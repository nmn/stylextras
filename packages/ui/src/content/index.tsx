import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ElementType } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

export type ContentElement = "article" | "div" | "main" | "section";

export type ContentProps<T extends ContentElement = "div"> = Omit<
  ComponentPropsWithRef<T>,
  "className" | "style"
> & {
  as?: T;
  sx?: StyleXStyles;
};

/**
 * Renders a readable content wrapper for long-form sections.
 *
 * Search aliases: content, article body, prose container, reading column.
 *
 * A11y notes:
 * - Provides layout only.
 * - The caller must choose the appropriate landmark or sectioning element.
 */
export function Content<T extends ContentElement = "div">({
  as,
  sx,
  ...props
}: ContentProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return <Component {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    gap: spacing.md,
    color: colors.fg,
    display: "grid",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    maxWidth: "72ch",
    width: "100%",
  },
});
