import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"details">;

export type DisclosureSize = "md" | "lg";

export type DisclosureProps = Omit<BaseProps, "className" | "style"> & {
  summary: ReactNode;
  sx?: StyleXStyles;
  summarySx?: StyleXStyles;
  contentSx?: StyleXStyles;
  size?: DisclosureSize;
};

export const Disclosure = ({
  children,
  contentSx,
  size = "md",
  summary,
  summarySx,
  sx,
  ...props
}: DisclosureProps) => (
  <details {...props} {...stylex.props(styles.base, sx)}>
    <summary {...stylex.props(styles.summary, styles[size], summarySx)}>
      {summary}
    </summary>
    <div {...stylex.props(styles.content, contentSx)}>{children}</div>
  </details>
);

const styles = stylex.create({
  base: {
    width: "100%",
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
  },
  summary: {
    cursor: "pointer",
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightSemibold,
    listStyle: "revert",
  },
  md: {
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
  lg: {
    fontSize: typography.step1,
    lineHeight: typography.lineHeightTight,
  },
  content: {
    paddingTop: spacing.md,
    color: colors.fgSoft,
  },
});
