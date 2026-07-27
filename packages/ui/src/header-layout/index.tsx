import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithRef<"div">;
type LayoutSlotProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style"> & {
  ref?: Ref<HTMLElement>;
};

export type HeaderLayoutProps = Omit<BaseProps, "className" | "style"> & {
  header: ReactNode;
  headerAs?: "div" | "header";
  headerProps?: LayoutSlotProps;
  headerSx?: StyleXStyles;
  mainAs?: "div" | "main";
  mainProps?: LayoutSlotProps;
  mainSx?: StyleXStyles;
  sticky?: boolean;
  sx?: StyleXStyles;
};

/**
 * Renders a page layout with a header slot and main content region.
 *
 * Search aliases: header layout, app shell, topbar layout, header page.
 *
 * A11y notes:
 * - Provides structural layout only.
 * - Appropriate landmark labeling must be supplied by the content provided to each slot.
 */
export function HeaderLayout({
  children,
  header,
  headerAs = "div",
  headerProps,
  headerSx,
  mainAs = "div",
  mainProps,
  mainSx,
  ref,
  sticky = false,
  sx,
  ...props
}: HeaderLayoutProps) {
  return (
    <div ref={ref} {...props} {...stylex.props(rootStyles.base, sx)}>
      {headerAs === "header" ? (
        <header
          {...headerProps}
          {...stylex.props(headerStyles.base, sticky && headerStyles.sticky, headerSx)}
        >
          {header}
        </header>
      ) : (
        <div
          {...headerProps}
          ref={headerProps?.ref as Ref<HTMLDivElement>}
          {...stylex.props(headerStyles.base, sticky && headerStyles.sticky, headerSx)}
        >
          {header}
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

const rootStyles = stylex.create({
  base: {
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    minHeight: "100%",
  },
});

const headerStyles = stylex.create({
  base: {
    zIndex: 1,
  },
  sticky: {
    position: "sticky",
    top: 0,
  },
});

const mainStyles = stylex.create({
  base: {
    padding: spacing.lg,
    gap: spacing.lg,
    alignContent: "start",
    display: "grid",
    minWidth: 0,
  },
});
