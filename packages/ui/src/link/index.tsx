import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"a">;

export type LinkProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-styled anchor element.
 *
 * Search aliases: link, anchor, text link, navigation link.
 *
 * A11y notes:
 * - Uses native anchor semantics.
 * - The caller must provide meaningful link text and destination behavior.
 */
export function Link({ sx, ...props }: LinkProps) {
  return <a {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    textDecoration: "underline",
    color: colors.brand,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
});
