import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { ColorField } from "../color-field";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ColorWheelProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a simplified color wheel control.
 *
 * Search aliases: color wheel, hue wheel, wheel picker, color dial.
 *
 * A11y notes:
 * - Not a full assistive-technology-complete color wheel.
 * - Keyboard manipulation and spoken feedback are limited.
 */
export function ColorWheel({ sx, ...props }: ColorWheelProps) { return <div {...props} {...stylex.props(styles.base, sx)}><ColorField /></div>; }

const styles = stylex.create({ base: { display: "inline-flex" } });
