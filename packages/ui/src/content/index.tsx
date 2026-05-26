import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"article">;

export type ContentElement = "article" | "div" | "main" | "section";

export type ContentProps = Omit<BaseProps, "className" | "style"> & {
  as?: ContentElement;
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
export function Content({ as = "article", sx, ...props }: ContentProps) {
  if (as === "div") {
    return <div {...props} {...stylex.props(styles.base, sx)} />;
  }

  if (as === "main") {
    return <main {...props} {...stylex.props(styles.base, sx)} />;
  }

  if (as === "section") {
    return <section {...props} {...stylex.props(styles.base, sx)} />;
  }

  return <article {...props} {...stylex.props(styles.base, sx)} />;
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
