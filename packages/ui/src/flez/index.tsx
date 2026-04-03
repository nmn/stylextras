import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type FlezDirection = "row" | "column";

export type FlezProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  direction?: FlezDirection;
};

/**
 * Renders the legacy flex-like layout primitive kept for compatibility.
 *
 * Search aliases: flez, flex alias, legacy flex, layout row.
 *
 * A11y notes:
 * - Provides layout only.
 * - This export exists mainly for compatibility and should not be preferred over Flex.
 */
export function Flez({ direction = "row", sx, ...props }: FlezProps) {
  return <div {...props} {...stylex.props(baseStyles.base, directionStyles[direction], sx)} />;
}

const baseStyles = stylex.create({ base: { display: "flex", gap: spacing.sm } });
const directionStyles = stylex.create({ row: { flexDirection: "row", alignItems: "center" }, column: { flexDirection: "column" } });
