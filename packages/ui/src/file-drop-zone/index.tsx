import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type FileDropZoneProps = Omit<
  BaseProps,
  "className" | "style" | "type"
> & {
  sx?: StyleXStyles;
  label?: ReactNode;
};

/**
 * Renders a stylable drop target shell for file selection.
 *
 * Search aliases: file drop zone, dropzone, upload area, drop target.
 *
 * A11y notes:
 * - Does not fully implement drag-and-drop keyboard alternatives.
 * - Callers should pair it with a standard file input or trigger.
 */
export function FileDropZone({
  label = "Drop files here or choose files",
  sx,
  ...props
}: FileDropZoneProps) {
  return (
    <label {...stylex.props(styles.zone, sx)}>
      <span>{label}</span>
      <input {...props} type="file" {...stylex.props(styles.input)} />
    </label>
  );
}

const styles = stylex.create({
  zone: {
    padding: spacing.lg,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderStyle: "dashed",
    borderWidth: stroke.thin,
    gap: spacing.xs,
    placeItems: "center",
    backgroundColor: colors.bgSubtle,
    color: colors.fgSoft,
    display: "grid",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    textAlign: "center",
    minHeight: spacing.xxxxl,
  },
  input: { width: "100%" },
});
