import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"input">;

type ComboboxOption = string | { label: string; value: string };

export type ComboboxProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type"
> &
  AccessibleNameProps & {
    sx?: StyleXStyles;
    inputSx?: StyleXStyles;
    labelSx?: StyleXStyles;
    listId?: string;
    options?: ComboboxOption[];
  };

const defaultOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
];

/**
 * Renders a simplified combobox built on native input and datalist behavior.
 *
 * Search aliases: combobox, combo box, autocomplete, suggest field.
 *
 * A11y notes:
 * - Relies on native datalist behavior which varies across browsers and assistive technology.
 * - Does not provide a fully managed ARIA combobox popup model.
 */
export function Combobox({
  label,
  labelSx,
  inputSx,
  listId = "stylextras-combobox-options",
  options = defaultOptions,
  sx,
  ...props
}: ComboboxProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? (
        <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span>
      ) : null}
      <>
        <input
          {...props}
          list={listId}
          type="text"
          {...stylex.props(inputStyles.base, inputSx)}
        />
        <datalist id={listId}>
          {options.map((option) => {
            const normalizedOption =
              typeof option === "string"
                ? { label: option, value: option }
                : option;

            return (
              <option
                key={normalizedOption.value}
                value={normalizedOption.value}
              >
                {normalizedOption.label}
              </option>
            );
          })}
        </datalist>
      </>
    </label>
  );
}

const rootStyles = stylex.create({
  base: { gap: spacing.xs, display: "grid", width: "100%" },
});
const labelStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});
const inputStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
    width: "100%",
  },
});
