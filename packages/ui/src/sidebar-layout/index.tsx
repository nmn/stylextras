import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type SidebarLayoutProps = Omit<BaseProps, "className" | "style"> & {
  mainSx?: StyleXStyles;
  sidebar: ReactNode;
  sidebarSx?: StyleXStyles;
  sx?: StyleXStyles;
};

/**
 * Renders a responsive sidebar-and-main layout composition.
 *
 * Search aliases: sidebar layout, two column layout, rail layout, docs layout.
 *
 * A11y notes:
 * - Provides structural layout only.
 * - Landmark naming and skip-link behavior remain the caller’s responsibility.
 */
export function SidebarLayout({
  children,
  mainSx,
  sidebar,
  sidebarSx,
  sx,
  ...props
}: SidebarLayoutProps) {
  return (
    <div {...props} {...stylex.props(rootStyles.base, sx)}>
      <aside {...stylex.props(sidebarStyles.base, sidebarSx)}>{sidebar}</aside>
      <main {...stylex.props(mainStyles.base, mainSx)}>{children}</main>
    </div>
  );
}

const rootStyles = stylex.create({
  base: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 960px)": "minmax(220px, 280px) minmax(0, 1fr)",
    },
    minHeight: "100%",
  },
});

const sidebarStyles = stylex.create({
  base: {
    minWidth: 0,
  },
});

const mainStyles = stylex.create({
  base: {
    minWidth: 0,
    padding: spacing.lg,
  },
});
