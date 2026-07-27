import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type { AccessibleAriaNameProps } from "../accessibility";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithRef<"div">;
type LayoutSlotProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style"> & {
  ref?: Ref<HTMLElement>;
};

export type SidebarLayoutProps = Omit<BaseProps, "className" | "style"> & {
  mainSx?: StyleXStyles;
  mainAs?: "div" | "main";
  mainProps?: LayoutSlotProps;
  sidebar: ReactNode;
  sidebarAs?: "aside" | "div";
  sidebarProps?: LayoutSlotProps;
  sidebarSx?: StyleXStyles;
  sx?: StyleXStyles;
};

export type SidebarNavigationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "aria-label" | "aria-labelledby" | "className" | "style"
> &
  AccessibleAriaNameProps & {
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
  mainAs = "div",
  mainProps,
  mainSx,
  ref,
  sidebar,
  sidebarAs = "div",
  sidebarProps,
  sidebarSx,
  sx,
  ...props
}: SidebarLayoutProps) {
  return (
    <div ref={ref} {...props} {...stylex.props(rootStyles.base, sx)}>
      {sidebarAs === "aside" ? (
        <aside {...sidebarProps} {...stylex.props(sidebarStyles.base, sidebarSx)}>
          {sidebar}
        </aside>
      ) : (
        <div
          {...sidebarProps}
          ref={sidebarProps?.ref as Ref<HTMLDivElement>}
          {...stylex.props(sidebarStyles.base, sidebarSx)}
        >
          {sidebar}
        </div>
      )}
      {mainAs === "main" ? (
        <main {...mainProps} {...stylex.props(mainStyles.base, mainSx)}>
          {children}
        </main>
      ) : (
        <div
          {...mainProps}
          ref={mainProps?.ref as Ref<HTMLDivElement>}
          {...stylex.props(mainStyles.base, mainSx)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** A named navigation landmark for links placed in a sidebar slot. */
export function SidebarNavigation({ ref, sx, ...props }: SidebarNavigationProps) {
  return <nav ref={ref} {...props} {...stylex.props(sidebarStyles.navigation, sx)} />;
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
  navigation: {
    display: "grid",
    gap: spacing.xs,
    minWidth: 0,
  },
});

const mainStyles = stylex.create({
  base: {
    padding: spacing.lg,
    minWidth: 0,
  },
});
