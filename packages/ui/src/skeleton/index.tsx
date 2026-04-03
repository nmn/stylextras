import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type SkeletonProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a placeholder block for loading states.
 *
 * Search aliases: skeleton, loading placeholder, shimmer block, loading stub.
 *
 * A11y notes:
 * - Primarily visual.
 * - It does not announce loading state or busy status automatically.
 */
export function Skeleton({ sx, ...props }: SkeletonProps) { return <div {...props} aria-hidden="true" {...stylex.props(styles.base, sx)} />; }

const styles = stylex.create({ base: { width: "100%", minHeight: spacing.lg, borderRadius: radius.md, backgroundColor: colors.bgInset } });
