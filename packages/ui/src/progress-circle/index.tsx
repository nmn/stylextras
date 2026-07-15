import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleAriaNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ProgressCircleSize = "sm" | "md" | "lg";

export type ProgressCircleProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style"
> &
  AccessibleAriaNameProps & {
    max?: number;
    showValue?: boolean;
    size?: ProgressCircleSize;
    sx?: StyleXStyles;
    value?: number;
  };

const sizeMap = {
  sm: { box: 36, stroke: 4 },
  md: { box: 52, stroke: 6 },
  lg: { box: 72, stroke: 8 },
} as const;

/**
 * Renders a circular progress indicator using SVG.
 *
 * Search aliases: progress circle, circular progress, progress ring, loading ring.
 *
 * A11y notes:
 * - Exposes progressbar semantics on the wrapper.
 * - It does not announce label text automatically unless provided by the caller.
 */
export function ProgressCircle({
  max = 100,
  showValue = true,
  size = "md",
  sx,
  value = 0,
  ...props
}: ProgressCircleProps) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = clamped / safeMax;
  const metrics = sizeMap[size];
  const radius = (metrics.box - metrics.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);

  return (
    <div
      {...props}
      role="progressbar"
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={Math.round(clamped)}
      {...stylex.props(baseStyles.base, sizeStyles[size], sx)}
    >
      <svg
        viewBox={"0 0 " + metrics.box + " " + metrics.box}
        width={metrics.box}
        height={metrics.box}
      >
        <circle
          cx={metrics.box / 2}
          cy={metrics.box / 2}
          r={radius}
          fill="transparent"
          stroke={colors.border}
          strokeWidth={metrics.stroke}
        />
        <circle
          cx={metrics.box / 2}
          cy={metrics.box / 2}
          r={radius}
          fill="transparent"
          stroke={colors.primary}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={metrics.stroke}
          transform={
            "rotate(-90 " + metrics.box / 2 + " " + metrics.box / 2 + ")"
          }
        />
      </svg>
      {showValue ? (
        <span {...stylex.props(labelStyles.base, labelStyles[size])}>
          {Math.round(percent * 100)}%
        </span>
      ) : null}
    </div>
  );
}

const baseStyles = stylex.create({
  base: {
    placeItems: "center",
    display: "inline-grid",
    position: "relative",
  },
});

const sizeStyles = stylex.create({
  sm: { height: "36px", width: "36px" },
  md: { height: "52px", width: "52px" },
  lg: { height: "72px", width: "72px" },
});

const labelStyles = stylex.create({
  base: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    position: "absolute",
  },
  sm: { fontSize: typography.stepMinus2 },
  md: { fontSize: typography.stepMinus2 },
  lg: { fontSize: typography.stepMinus1 },
});
