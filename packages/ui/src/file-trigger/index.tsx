import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type FileTriggerProps = Omit<
  BaseProps,
  "className" | "style" | "type"
> & {
  sx?: StyleXStyles;
  label?: ReactNode;
};

/**
 * Renders a simplified file-selection trigger.
 *
 * Search aliases: file trigger, upload button, file picker trigger, file chooser.
 *
 * A11y notes:
 * - Relies on the native file input for actual selection.
 * - Custom trigger labeling and status messaging remain the caller’s responsibility.
 */
export function FileTrigger({
  label = "Choose file",
  sx,
  ...props
}: FileTriggerProps) {
  return (
    <label {...stylex.props(styles.button, sx)}>
      <span>{label}</span>
      <input {...props} type="file" {...stylex.props(styles.input)} />
    </label>
  );
}

const styles = stylex.create({
  button: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    alignItems: "center",
    backgroundColor: colors.secondary,
    color: colors.fg,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    justifyContent: "center",
    minHeight: spacing.xxxl,
  },
  input: { display: "none" },
});
