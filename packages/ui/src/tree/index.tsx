import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"ul">;

export type TreeProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a simplified hierarchical tree container.
 *
 * Search aliases: tree, tree view, outline, hierarchy.
 *
 * A11y notes:
 * - This is not a full ARIA tree implementation.
 * - Keyboard navigation, expansion state management, and item activedescendant behavior are limited.
 */
export function Tree({ sx, ...props }: TreeProps) { return <ul {...props} role="tree" {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { display: "grid", gap: spacing.xs, paddingLeft: spacing.md, margin: 0 } });
