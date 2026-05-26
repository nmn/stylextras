import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type TagGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a group of tag-like items.
 *
 * Search aliases: tag group, chips, tags, pill group.
 *
 * A11y notes:
 * - Provides grouping layout only.
 * - Selection, removal, and keyboard handling are limited unless composed by the caller.
 */
export function TagGroup({ sx, ...props }: TagGroupProps) {
  return <div {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
});
