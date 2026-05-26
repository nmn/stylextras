import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"form">;

export type FormProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a semantic form container.
 *
 * Search aliases: form, form wrapper, input form, form layout.
 *
 * A11y notes:
 * - Uses native form semantics.
 * - Validation, field associations, and submission messaging must be composed by the caller.
 */
export function Form({ sx, ...props }: FormProps) {
  return <form {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: { gap: spacing.md, display: "grid", width: "100%" },
});
