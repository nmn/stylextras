import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"button">;

export type ToggleProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  pressed?: boolean;
};

/**
 * Renders a pressed-state button primitive.
 *
 * Search aliases: toggle, toggle button, pressed button, stateful button.
 *
 * A11y notes:
 * - Uses simplified pressed-state behavior.
 * - The caller must provide correct pressed state and accessible naming.
 */
export function Toggle({ pressed = false, sx, type = "button", ...props }: ToggleProps) {
  return (
    <button
      {...props}
      aria-pressed={pressed}
      type={type}
      {...stylex.props(baseStyles.base, pressed ? stateStyles.on : stateStyles.off, sx)}
    />
  );
}

const baseStyles = stylex.create({ base: { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: spacing["3xl"], paddingInline: spacing.md, paddingBlock: spacing.sm, borderStyle: "solid", borderWidth: stroke.thin, borderRadius: radius.md, fontFamily: typography.fontSans, fontSize: typography.step0, fontWeight: typography.weightMedium } });
const stateStyles = stylex.create({
  on: { color: colors.primaryForeground, backgroundColor: colors.primary, borderColor: colors.primary },
  off: { color: colors.fg, backgroundColor: colors.bg, borderColor: colors.border },
});
