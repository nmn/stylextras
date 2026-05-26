import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { focusgroupProps } from "../focusgroup";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type ToggleGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a group of toggle controls.
 *
 * Search aliases: toggle group, toggle buttons, pressed group, option toggles.
 *
 * A11y notes:
 * - Uses group semantics.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function ToggleGroup({ sx, ...props }: ToggleGroupProps) {
  return (
    <div
      {...props}
      role="group"
      {...focusgroupProps<HTMLDivElement>("toolbar wrap")}
      {...stylex.props(styles.base, sx)}
    />
  );
}

const styles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: "center",
    display: "inline-flex",
    flexWrap: "wrap",
  },
});
