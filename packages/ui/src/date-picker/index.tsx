import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

export type DatePickerProps = Omit<BaseProps, "className" | "style" | "type"> & { sx?: StyleXStyles };

/**
 * Renders a token-styled date picker control.
 *
 * Search aliases: date picker, date chooser, calendar picker, date select.
 *
 * A11y notes:
 * - This is a simplified implementation.
 * - It does not provide a fully custom accessible calendar-popup interaction model.
 */
export function DatePicker({ sx, ...props }: DatePickerProps) { return <input {...props} type="date" {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { minHeight: spacing["3xl"], paddingInline: spacing.md, paddingBlock: spacing.sm, borderStyle: "solid", borderWidth: stroke.thin, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.bgRaised, color: colors.fg, fontFamily: typography.fontSans, fontSize: typography.step0 } });
