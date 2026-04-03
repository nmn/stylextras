import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type ColorSliderProps = Omit<BaseProps, "className" | "style" | "type"> & { sx?: StyleXStyles };

/**
 * Renders a simplified slider for color channel adjustment.
 *
 * Search aliases: color slider, hue slider, channel slider, color range.
 *
 * A11y notes:
 * - Relies on native range input semantics when applicable.
 * - Channel naming and spoken value details may need additional labeling from the caller.
 */
export function ColorSlider({ max = 360, min = 0, sx, ...props }: ColorSliderProps) { return <input {...props} max={max} min={min} type="range" {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { width: "100%", accentColor: colors.primary } });
