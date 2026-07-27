import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"input">;

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
  id: idProp,
  label = "Choose file",
  ref,
  sx,
  ...props
}: FileTriggerProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div {...stylex.props(styles.root, sx)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        {...props}
        type="file"
        {...stylex.props(styles.input)}
      />
    </div>
  );
}

const styles = stylex.create({
  root: {
    gap: spacing.xs,
    display: "grid",
    minWidth: 0,
  },
  label: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
  },
  input: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    alignItems: "center",
    backgroundColor: colors.secondary,
    boxSizing: "border-box",
    color: colors.fg,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    justifyContent: "center",
    minWidth: 0,
    minHeight: spacing.xxxl,
    maxWidth: "100%",
    width: "100%",
    "::file-selector-button": {
      borderColor: colors.border,
      borderRadius: radius.sm,
      borderStyle: "solid",
      borderWidth: stroke.thin,
      marginInlineEnd: spacing.sm,
      paddingBlock: spacing.xs,
      paddingInline: spacing.sm,
      backgroundColor: colors.bgRaised,
      color: colors.fg,
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: typography.weightMedium,
    },
  },
});
