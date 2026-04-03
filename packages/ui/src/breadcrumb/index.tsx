import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"nav">;

type BreadcrumbItem = { label: ReactNode; href?: string };

export type BreadcrumbProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  items?: BreadcrumbItem[];
};

const defaultItems = [
  { label: "Docs", href: "#" },
  { label: "Components", href: "#" },
  { label: "Button" },
];

/**
 * Renders a breadcrumb navigation container.
 *
 * Search aliases: breadcrumb, breadcrumbs, path nav, trail navigation.
 *
 * A11y notes:
 * - Does not generate item markup automatically.
 * - Callers must provide meaningful link text and current-page indication.
 */
export function Breadcrumb({ items = defaultItems, sx, ...props }: BreadcrumbProps) {
  return (
    <nav {...props} aria-label="Breadcrumb" {...stylex.props(navStyles.base, sx)}>
      <ol {...stylex.props(listStyles.base)}>
        {items.map((item, index) => (
          <li key={index} {...stylex.props(itemStyles.base)}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
            {index < items.length - 1 ? <span {...stylex.props(separatorStyles.base)}>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const navStyles = stylex.create({ base: { color: colors.fgSoft, fontFamily: typography.fontSans, fontSize: typography.stepMinus1 } });
const listStyles = stylex.create({ base: { display: "flex", alignItems: "center", gap: spacing.xs, listStyle: "none", padding: 0, margin: 0, flexWrap: "wrap" } });
const itemStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", gap: spacing.xs } });
const separatorStyles = stylex.create({ base: { color: colors.fgMuted } });
