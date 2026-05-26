import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { focusgroupProps } from "../focusgroup";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type MenubarProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a horizontal menubar container.
 *
 * Search aliases: menubar, menu bar, app menu, top menu.
 *
 * A11y notes:
 * - Uses menubar semantics.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function Menubar({ onMouseOver, sx, ...props }: MenubarProps) {
  return (
    <div
      {...props}
      onMouseOver={(event) => {
        onMouseOver?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const trigger = target.closest<HTMLButtonElement>(
          'button[aria-haspopup="menu"]',
        );
        if (!trigger || !event.currentTarget.contains(trigger)) {
          return;
        }

        const openMenu = event.currentTarget.querySelector(
          "[popover]:popover-open",
        );
        if (!openMenu || trigger.nextElementSibling === openMenu) {
          return;
        }

        trigger.click();
      }}
      role="menubar"
      {...focusgroupProps<HTMLDivElement>("menubar")}
      {...stylex.props(styles.base, sx)}
    />
  );
}

const styles = stylex.create({
  base: {
    padding: spacing.xxs,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.xxs,
    alignItems: "center",
    backgroundColor: colors.bgSubtle,
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "100%",
    width: "fit-content",
  },
});
