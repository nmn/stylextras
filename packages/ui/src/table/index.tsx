import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"table">;

export type TableProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a styled semantic table.
 *
 * Search aliases: table, data table, tabular data, grid table.
 *
 * A11y notes:
 * - Provides basic table semantics only.
 * - Sorting, selection, grid navigation, and sticky header semantics are not implemented.
 */
export function Table({ sx, ...props }: TableProps) { return <table {...props} {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { width: "100%", borderCollapse: "collapse", color: colors.fg, fontFamily: typography.fontSans, borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border } });
