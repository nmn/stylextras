import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { ColorField } from "../color-field";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ColorAreaProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a simplified color-area control surface.
 *
 * Search aliases: color area, color plane, saturation area, color canvas.
 *
 * A11y notes:
 * - This is not a full assistive-technology-complete color area implementation.
 * - Keyboard color manipulation and spoken value feedback are limited.
 */
export function ColorArea({ sx, ...props }: ColorAreaProps) { return <div {...props} {...stylex.props(styles.base, sx)}><ColorField /></div>; }

const styles = stylex.create({ base: { display: "inline-flex" } });
