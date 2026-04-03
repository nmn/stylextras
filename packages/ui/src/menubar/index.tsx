import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type MenubarProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a horizontal menubar container.
 *
 * Search aliases: menubar, menu bar, app menu, top menu.
 *
 * A11y notes:
 * - Provides visual layout only.
 * - It does not yet implement full menubar roving focus or submenu keyboard behavior.
 */
export function Menubar({ sx, ...props }: MenubarProps) { return <div {...props} role="menubar" {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { display: "flex", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" } });
