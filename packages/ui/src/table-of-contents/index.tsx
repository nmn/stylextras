import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"nav">;

export type TableOfContentsItem = {
  href: string;
  label: string;
};

export type TableOfContentsProps = Omit<BaseProps, "className" | "style"> & {
  items: TableOfContentsItem[];
  sx?: StyleXStyles;
  title?: string;
};

/**
 * Renders an anchored list of in-page links.
 *
 * Search aliases: table of contents, toc, page outline, section nav.
 *
 * A11y notes:
 * - Uses native nav and list semantics.
 * - The caller must ensure targets exist and link text matches the visible headings.
 */
export function TableOfContents({
  items,
  sx,
  title = "On this page",
  ...props
}: TableOfContentsProps) {
  return (
    <nav {...props} aria-label={title} {...stylex.props(rootStyles.base, sx)}>
      <div {...stylex.props(textStyles.title)}>{title}</div>
      <ol {...stylex.props(listStyles.base)}>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} {...stylex.props(textStyles.link)}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const rootStyles = stylex.create({
  base: {
    gap: spacing.sm,
    display: "grid",
  },
});

const listStyles = stylex.create({
  base: {
    margin: 0,
    gap: spacing.xs,
    display: "grid",
    paddingLeft: spacing.md,
  },
});

const textStyles = stylex.create({
  title: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
  },
  link: {
    textDecoration: "none",
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
});
