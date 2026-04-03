import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type EmptyProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a token-styled empty-state surface.
 *
 * Search aliases: empty, empty state, placeholder state, no data.
 *
 * A11y notes:
 * - Provides presentation only.
 * - The caller should ensure the empty state message is meaningful in context.
 */
export function Empty({ sx, ...props }: EmptyProps) { return <div {...props} {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { display: "grid", placeItems: "center", gap: spacing.sm, minHeight: spacing["4xl"], color: colors.fgMuted, fontFamily: typography.fontSans, fontSize: typography.step0, textAlign: "center" } });
