import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"span">;

export type ColorSwatchProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  color?: string;
};

/**
 * Renders a visual color swatch.
 *
 * Search aliases: color swatch, swatch, color chip, color sample.
 *
 * A11y notes:
 * - Visual only unless labelled by the caller.
 * - Color meaning should not be conveyed by color alone.
 */
export function ColorSwatch({ color = "#7c3aed", sx, ...props }: ColorSwatchProps) {
  return <span {...props} style={{ backgroundColor: color } as CSSProperties} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "inline-flex", width: spacing["2xl"], height: spacing["2xl"], borderRadius: radius.md } });
