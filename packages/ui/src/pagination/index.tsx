import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"nav">;

export type PaginationProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  currentPage?: number;
  totalPages?: number;
};

/**
 * Renders a simplified pagination navigation wrapper.
 *
 * Search aliases: pagination, pager, page nav, page controls.
 *
 * A11y notes:
 * - Provides structure only.
 * - Current page state, disabled state, and labels must be supplied by the caller.
 */
export function Pagination({ currentPage = 2, sx, totalPages = 5, ...props }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav {...props} aria-label="Pagination" {...stylex.props(navStyles.base, sx)}>
      {pages.map((page) => (
        <a
          key={page}
          href="#"
          aria-current={page === currentPage ? "page" : undefined}
          {...stylex.props(linkStyles.base, page === currentPage ? linkStateStyles.active : linkStateStyles.inactive)}
        >
          {page}
        </a>
      ))}
    </nav>
  );
}

const navStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" } });
const linkStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: spacing["2xl"], minHeight: spacing["2xl"], paddingInline: spacing.xs, borderStyle: "solid", borderWidth: stroke.thin, borderRadius: radius.md, textDecoration: "none" } });
const linkStateStyles = stylex.create({ active: { color: colors.primaryForeground, backgroundColor: colors.primary, borderColor: colors.primary }, inactive: { color: colors.fg, backgroundColor: colors.bg, borderColor: colors.border } });
