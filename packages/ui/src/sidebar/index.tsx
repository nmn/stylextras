import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"aside">;

export type SidebarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-driven sidebar container.
 *
 * Search aliases: sidebar, side nav, side panel, navigation rail.
 *
 * A11y notes:
 * - Provides container semantics only.
 * - Navigation structure and labeling must be supplied by the caller.
 */
export function Sidebar({ sx, ...props }: SidebarProps) {
  return <aside {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "grid", gap: spacing.md, padding: spacing.lg, borderRightStyle: "solid", borderRightWidth: stroke.thin, borderRightColor: colors.border, backgroundColor: colors.bgSubtle } });
