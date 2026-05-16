import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type MenubarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a horizontal menubar container.
 *
 * Search aliases: menubar, menu bar, app menu, top menu.
 *
 * A11y notes:
 * - Provides visual layout only.
 * - It does not yet implement full menubar roving focus or submenu keyboard behavior.
 */
export function Menubar({ sx, ...props }: MenubarProps) {
  return <div {...props} role="menubar" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    gap: spacing["2xs"],
    flexWrap: "wrap",
    width: "fit-content",
    maxWidth: "100%",
    padding: spacing["2xs"],
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
  },
});
