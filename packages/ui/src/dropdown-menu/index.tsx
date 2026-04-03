import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type DropdownMenuPlacement = "bottom" | "top" | "right" | "left";
export type DropdownMenuBehavior = "auto" | "manual";

export type DropdownMenuProps = Omit<BaseProps, "className" | "style" | "popover"> & {
  behavior?: DropdownMenuBehavior;
  label?: ReactNode;
  menuSx?: StyleXStyles;
  placement?: DropdownMenuPlacement;
  sx?: StyleXStyles;
  triggerSx?: StyleXStyles;
};

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a trigger and menu surface using native popover and anchor positioning.
 *
 * Search aliases: dropdown menu, menu button, popup menu, action menu.
 *
 * A11y notes:
 * - Provides a surfaced menu but not a full ARIA menu-button interaction system.
 * - Focus movement, typeahead, and composite keyboard navigation are limited.
 */
export function DropdownMenu({
  behavior = "auto",
  children,
  label = "Menu",
  menuSx,
  placement = "bottom",
  sx,
  triggerSx,
  ...props
}: DropdownMenuProps) {
  const popoverId = useId();

  return (
    <div {...props} {...stylex.props(rootStyles.base, sx)}>
      <button popoverTarget={popoverId} type="button" {...stylex.props(triggerStyles.base, triggerSx)}>
        {label}
      </button>
      <div
        id={popoverId}
        popover={behavior}
        role="menu"
        {...stylex.props(
          menuStyles.base,
          placementStyles[placement],
          fallbackStyles[placement],
          menuSx,
        )}
      >
        {children ?? (
          <>
            <button role="menuitem" type="button" {...stylex.props(itemStyles.base)}>
              Item one
            </button>
            <button role="menuitem" type="button" {...stylex.props(itemStyles.base)}>
              Item two
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const rootStyles = stylex.create({
  base: {
    display: "inline-grid",
  },
});

const triggerStyles = stylex.create({
  base: {
    cursor: "pointer",
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
});

const menuStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    display: "grid",
    gap: spacing["3xs"],
    minWidth: spacing["4xl"],
    padding: spacing.sm,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
  },
});

const placementStyles = stylex.create({
  bottom: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "bottom",
  },
  top: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "top",
  },
  right: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "right",
  },
  left: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "left",
  },
});

const fallbackStyles = stylex.create({
  bottom: { positionTryFallbacks: bottomFallback },
  top: { positionTryFallbacks: topFallback },
  right: { positionTryFallbacks: rightFallback },
  left: { positionTryFallbacks: leftFallback },
});

const itemStyles = stylex.create({
  base: {
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderWidth: 0,
    borderRadius: radius.sm,
    backgroundColor: "transparent",
    color: colors.fg,
    textAlign: "left",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
});
