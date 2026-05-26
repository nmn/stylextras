import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { spacing } from "../tokens/spacing.stylex";
import { DatePicker } from "../date-picker";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type RangeDatePickerProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a simplified range date picker primitive.
 *
 * Search aliases: range date picker, date range picker, date interval picker, range picker.
 *
 * A11y notes:
 * - This is a simplified implementation.
 * - It does not provide a fully custom accessible range-picker popup model.
 */
export function RangeDatePicker({ sx, ...props }: RangeDatePickerProps) {
  return (
    <div {...props} {...stylex.props(styles.base, sx)}>
      <DatePicker aria-label="Start date" />
      <DatePicker aria-label="End date" />
    </div>
  );
}

const styles = stylex.create({ base: { gap: spacing.sm, display: "grid" } });
