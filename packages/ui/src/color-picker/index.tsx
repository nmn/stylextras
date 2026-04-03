import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";
import { ColorField } from "../color-field";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ColorPickerProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a token-styled native color picker input.
 *
 * Search aliases: color picker, color input, swatch input, color chooser.
 *
 * A11y notes:
 * - Uses browser-native color input behavior.
 * - The exact accessibility experience varies by browser and platform.
 */
export function ColorPicker({ sx, ...props }: ColorPickerProps) {
  return <div {...props} {...stylex.props(styles.base, sx)}><ColorField /></div>;
}

const styles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing.xs } });
