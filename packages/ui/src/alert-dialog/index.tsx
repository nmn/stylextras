import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithRef<"dialog">;

export type AlertDialogProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders an alert-focused modal surface using the native dialog element.
 *
 * Search aliases: alert dialog, confirm dialog, destructive dialog, modal alert.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for focus and modality.
 * - Does not add a custom focus trap, trigger restore, or stacked dialog management layer.
 */
export function AlertDialog({ ref, sx, ...props }: AlertDialogProps) {
  return <dialog ref={ref} role="alertdialog" {...props} {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { margin: "auto", padding: spacing.lg, borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.danger, borderRadius: radius.xl, backgroundColor: colors.bgRaised, color: colors.fg, boxShadow: elevation.lg } });
