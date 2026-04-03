import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type DisclosureGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a wrapper for grouped disclosures.
 *
 * Search aliases: disclosure group, accordion group, details group, expandable list.
 *
 * A11y notes:
 * - Provides grouping only.
 * - Does not implement roving focus or single-open accordion behavior automatically.
 */
export function DisclosureGroup({ sx, ...props }: DisclosureGroupProps) {
  return <div {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { display: "grid", gap: spacing.sm, width: "100%" } });
