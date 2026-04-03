import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type WindowSplitterOrientation = "horizontal" | "vertical";

export type WindowSplitterProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  orientation?: WindowSplitterOrientation;
};

/**
 * Renders a visual splitter between regions.
 *
 * Search aliases: window splitter, splitter, resizer, pane divider.
 *
 * A11y notes:
 * - This is primarily a visual separator.
 * - It does not yet implement a full keyboard-resizable separator interaction model.
 */
export function WindowSplitter({ orientation = "vertical", sx, ...props }: WindowSplitterProps) {
  return <div {...props} role="separator" aria-orientation={orientation} {...stylex.props(baseStyles.base, orientationStyles[orientation], sx)} />;
}

const baseStyles = stylex.create({ base: { flexShrink: 0, backgroundColor: colors.borderStrong } });
const orientationStyles = stylex.create({ horizontal: { width: "100%", height: stroke.thin, marginBlock: spacing.md }, vertical: { width: stroke.thin, height: "100%", minHeight: spacing["3xl"], marginInline: spacing.md } });
