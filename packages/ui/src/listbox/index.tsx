import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"select">;

export type ListboxOption = string | { label: string; value: string };

export type ListboxProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  options?: ListboxOption[];
};

const defaultOptions = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

/**
 * Renders a simplified listbox-style container.
 *
 * Search aliases: listbox, list box, option list, selection list.
 *
 * A11y notes:
 * - This is not a fully managed ARIA listbox implementation.
 * - Keyboard selection, active option management, and typeahead are limited.
 */
export function Listbox({
  children,
  options = defaultOptions,
  ref,
  sx,
  ...props
}: ListboxProps) {
  const uniqueOptions = dedupeOptions(options);

  return (
    <select ref={ref} multiple {...props} {...stylex.props(styles.base, sx)}>
      {children ??
        uniqueOptions.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? { label: option, value: option }
              : option;

          return (
            <option key={normalizedOption.value} value={normalizedOption.value}>
              {normalizedOption.label}
            </option>
          );
        })}
    </select>
  );
}

const warnedDuplicateOptionSets = new Set<string>();

function dedupeOptions(options: ListboxOption[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const unique = options.filter((option) => {
    const value = typeof option === "string" ? option : option.value;
    if (seen.has(value)) {
      duplicates.add(value);
      return false;
    }
    seen.add(value);
    return true;
  });

  if (process.env.NODE_ENV !== "production" && duplicates.size > 0) {
    const key = [...duplicates].sort().join("|");
    if (!warnedDuplicateOptionSets.has(key)) {
      warnedDuplicateOptionSets.add(key);
      console.warn(
        `[stylextras] Listbox ignored duplicate option values: ${[
          ...duplicates,
        ].join(", ")}`,
      );
    }
  }

  return unique;
}

const styles = stylex.create({
  base: {
    padding: spacing.sm,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxxl,
    width: "100%",
  },
});
