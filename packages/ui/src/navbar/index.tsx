import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"nav">;

export type NavbarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a token-driven top navigation container.
 *
 * Search aliases: navbar, nav bar, top nav, site nav.
 *
 * A11y notes:
 * - Uses native nav semantics.
 * - Landmark labeling and responsive disclosure behavior are left to the caller.
 */
export function Navbar({ sx, ...props }: NavbarProps) {
  return <nav {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
    paddingBlock: spacing.md,
    paddingInline: spacing.lg,
    borderBottomStyle: "solid",
    borderBottomWidth: stroke.thin,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
});
