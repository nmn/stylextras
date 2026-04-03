import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type SearchFieldProps = Omit<BaseProps, "className" | "style" | "type"> & {
  sx?: StyleXStyles;
  inputSx?: StyleXStyles;
  labelSx?: StyleXStyles;
  label?: ReactNode;
};

/**
 * Renders a token-styled native search input.
 *
 * Search aliases: search field, search input, search box, query field.
 *
 * A11y notes:
 * - Uses native search input semantics.
 * - Search result announcements and live region updates are not handled automatically.
 */
export function SearchField({ label, labelSx, inputSx, sx, ...props }: SearchFieldProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span> : null}
      <input
        {...props}
        type="search"
        {...stylex.props(inputStyles.base, inputSx)}
      />
    </label>
  );
}

const rootStyles = stylex.create({ base: { display: "grid", gap: spacing.xs, width: "100%" } });
const labelStyles = stylex.create({ base: { color: colors.fgSoft, fontFamily: typography.fontSans, fontSize: typography.stepMinus1, fontWeight: typography.weightMedium } });
const inputStyles = stylex.create({ base: { width: "100%", minHeight: spacing["3xl"], paddingInline: spacing.md, paddingBlock: spacing.sm, borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.bgRaised, color: colors.fg, fontFamily: typography.fontSans, fontSize: typography.step0 } });
