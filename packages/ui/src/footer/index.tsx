import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"footer">;

export type FooterProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-driven page footer container.
 *
 * Search aliases: footer, page footer, bottom bar, site footer.
 *
 * A11y notes:
 * - Uses native footer semantics.
 * - Link grouping and landmark naming remain the caller’s responsibility.
 */
export function Footer({ sx, ...props }: FooterProps) {
  return <footer {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    gap: spacing.md,
    paddingBlock: spacing.lg,
    paddingInline: spacing.lg,
    alignItems: "center",
    backgroundColor: colors.bgSubtle,
    display: "flex",
    justifyContent: "space-between",
    borderTopColor: colors.border,
    borderTopStyle: "solid",
    borderTopWidth: stroke.thin,
  },
});
