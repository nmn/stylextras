import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ToastProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a token-styled toast surface.
 *
 * Search aliases: toast, toast message, notification, snackbar.
 *
 * A11y notes:
 * - This component renders the surface only.
 * - It does not provide live-region management, queueing, timing, or announcement orchestration.
 */
export function Toast({ sx, ...props }: ToastProps) {
  return <div {...props} role="status" {...stylex.props(styles.base, sx)} />;
}

const styles = stylex.create({ base: { padding: spacing.md, borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.bgRaised, color: colors.fg, boxShadow: elevation.md } });
