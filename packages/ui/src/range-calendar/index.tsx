import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";
import { DateField } from "../date-field";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type RangeCalendarProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a simplified range-calendar primitive.
 *
 * Search aliases: range calendar, date range calendar, range grid, calendar range.
 *
 * A11y notes:
 * - This is not a full keyboard-complete accessible date-range grid.
 * - Range narration and advanced selection semantics are limited.
 */
export function RangeCalendar({ sx, ...props }: RangeCalendarProps) {
  return (
    <div {...props} {...stylex.props(styles.base, sx)}>
      <DateField aria-label="Start date" />
      <DateField aria-label="End date" />
    </div>
  );
}

const styles = stylex.create({ base: { display: "grid", gap: spacing.sm } });
