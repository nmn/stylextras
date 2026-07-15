import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type HeaderLayoutProps = Omit<BaseProps, "className" | "style"> & {
  header: ReactNode;
  headerSx?: StyleXStyles;
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
  headerSx,
  mainSx,
  sticky = false,
  sx,
  ...props
}: HeaderLayoutProps) {
  return (
    <div {...props} {...stylex.props(rootStyles.base, sx)}>
      <div
        {...stylex.props(
          headerStyles.base,
          sticky && headerStyles.sticky,
          headerSx,
        )}
      >
        {header}
      </div>
      <main {...stylex.props(mainStyles.base, mainSx)}>{children}</main>
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
