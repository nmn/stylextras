import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type ColorFieldProps = Omit<
  BaseProps,
  "className" | "style" | "type"
> & { sx?: StyleXStyles };

/**
 * Renders a token-styled color field wrapper.
 *
 * Search aliases: color field, hex field, color input, color text field.
 *
 * A11y notes:
 * - Relies on native input behavior where present.
 * - Does not normalize localized color formats or expose advanced parsing help.
 */
export function ColorField({ sx, ...props }: ColorFieldProps) {
  return <input {...props} type="color" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: { padding: 0, height: spacing.xxxl, width: spacing.xxxxl },
});
