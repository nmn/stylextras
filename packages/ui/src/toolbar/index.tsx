"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import type { AccessibleAriaNameProps } from "../accessibility";
import { focusgroupAttributes, focusgroupRef } from "../focusgroup";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentPropsWithRef<"div">;

export type ToolbarProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "aria-orientation" | "className" | "role" | "style"
> &
  AccessibleAriaNameProps & {
    orientation?: "horizontal" | "vertical";
    sx?: StyleXStyles;
  };

/**
 * Renders a token-driven toolbar container.
 *
 * Search aliases: toolbar, action bar, control bar, button row.
 *
 * A11y notes:
 * - Uses toolbar semantics.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function Toolbar({ orientation = "horizontal", ref, sx, ...props }: ToolbarProps) {
  return (
    <div
      ref={focusgroupRef(ref)}
      {...props}
      role="toolbar"
      aria-orientation={orientation}
      {...focusgroupAttributes(
        orientation === "vertical" ? "toolbar block wrap" : "toolbar inline wrap",
      )}
      {...stylex.props(styles.base, orientation === "vertical" && styles.vertical, sx)}
    />
  );
}

const styles = stylex.create({
  base: {
    gap: spacing.sm,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
  vertical: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});
