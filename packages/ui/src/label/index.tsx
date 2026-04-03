import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"label">;

export type LabelProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-styled label element.
 *
 * Search aliases: label, field label, input label, form label.
 *
 * A11y notes:
 * - Uses native label semantics when associated correctly.
 * - The caller must connect it to an input with nesting or htmlFor.
 */
export function Label({ sx, ...props }: LabelProps) {
  return <label {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
});
