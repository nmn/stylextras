"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import type { IconButtonProps } from "../icon-button";
import { hidePopoverElement, isPopoverOpen } from "../platform-polyfills";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type DivProps = ComponentPropsWithoutRef<"div">;
type ButtonProps = ComponentPropsWithoutRef<"button">;

export type MenuContentProps = Omit<DivProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type MenuSectionProps = Omit<DivProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type MenuSectionTitleProps = Omit<DivProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type MenuButtonProps = Omit<ButtonProps, "className" | "style"> & {
  endIcon?: ReactNode;
  icon?: ReactNode;
  sx?: StyleXStyles;
};

export type MenuIconButtonGroupProps = Omit<DivProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type MenuIconButtonProps = IconButtonProps;

export type MenuItemListProps = Omit<DivProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type MenuItemProps = Omit<ButtonProps, "className" | "style"> & {
  description?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  sx?: StyleXStyles;
};

/**
 * Renders a stacked visual content layout for menu surfaces.
 *
 * Search aliases: menu content, menu panel, menu body, menu layout.
 *
 * A11y notes:
 * - Visual container only.
 * - Does not add menu roles, item roving focus, or keyboard navigation by itself.
 */
export function MenuContent({ onClick, sx, ...props }: MenuContentProps) {
  return (
    <div
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const control = target.closest("button,a,[role='menuitem']");
        if (!control || control.closest("[data-menu-keep-open='true']")) {
          return;
        }

        let popover = event.currentTarget.closest("[popover]");
        while (popover instanceof HTMLElement) {
          const nextPopover =
            popover.parentElement?.closest("[popover]") ?? null;
          if (isPopoverOpen(popover)) {
            hidePopoverElement(popover);
          }
          popover = nextPopover;
        }
      }}
      {...stylex.props(contentStyles.base, sx)}
    />
  );
}

/**
 * Renders a grouped visual section inside a menu.
 *
 * Search aliases: menu section, grouped menu, menu block, menu group.
 *
 * A11y notes:
 * - Visual grouping only.
 * - If semantic grouping is needed, the caller should provide appropriate labeling and roles.
 */
export function MenuSection({ sx, ...props }: MenuSectionProps) {
  return <div {...props} {...stylex.props(sectionStyles.base, sx)} />;
}

/**
 * Renders a small section title for grouped menu content.
 *
 * Search aliases: menu section title, menu heading, menu label, section header.
 *
 * A11y notes:
 * - Visual text only.
 * - Does not automatically label a group for assistive technology.
 */
export function MenuSectionTitle({ sx, ...props }: MenuSectionTitleProps) {
  return <div {...props} {...stylex.props(sectionTitleStyles.base, sx)} />;
}

/**
 * Renders a prominent menu action row with optional leading and trailing icons.
 *
 * Search aliases: menu button, menu action, menu row button, action row.
 *
 * A11y notes:
 * - Uses native button semantics.
 * - The caller must provide a meaningful text label or accessible name.
 */
export function MenuButton({
  children,
  endIcon,
  icon,
  sx,
  type = "button",
  ...props
}: MenuButtonProps) {
  return (
    <Button
      role="menuitem"
      {...props}
      size="sm"
      type={type}
      variant="ghost"
      sx={[buttonStyles.base, sx]}
    >
      {icon ? <span {...stylex.props(slotStyles.leading)}>{icon}</span> : null}
      <span {...stylex.props(buttonStyles.label)}>{children}</span>
      {endIcon ? (
        <span {...stylex.props(slotStyles.trailing)}>{endIcon}</span>
      ) : null}
    </Button>
  );
}

/**
 * Renders a compact row for grouping icon-only controls inside a menu.
 *
 * Search aliases: menu icon group, icon actions, icon button row, quick actions.
 *
 * A11y notes:
 * - Visual layout only.
 * - Each child icon button still needs its own accessible name.
 */
export function MenuIconButtonGroup({
  sx,
  ...props
}: MenuIconButtonGroupProps) {
  return <div {...props} {...stylex.props(iconGroupStyles.base, sx)} />;
}

export function MenuIconButton({ sx, ...props }: MenuIconButtonProps) {
  return <IconButton {...props} sx={[iconButtonStyles.base, sx]} />;
}

/**
 * Renders a stacked list container for menu items.
 *
 * Search aliases: menu item list, item stack, menu list, menu rows.
 *
 * A11y notes:
 * - Visual list container only.
 * - Does not supply list semantics unless the caller adds them.
 */
export function MenuItemList({ sx, ...props }: MenuItemListProps) {
  return <div {...props} {...stylex.props(itemListStyles.base, sx)} />;
}

/**
 * Renders a text-forward menu item with optional icon, description, and trailing affordance.
 *
 * Search aliases: menu item, menu row, text item, action item.
 *
 * A11y notes:
 * - Uses native button semantics.
 * - Does not implement menuitem keyboard conventions beyond standard button behavior.
 */
export function MenuItem({
  children,
  description,
  endIcon,
  icon,
  sx,
  type = "button",
  ...props
}: MenuItemProps) {
  return (
    <Button
      role="menuitem"
      {...props}
      size="sm"
      type={type}
      variant="ghost"
      sx={[itemStyles.base, sx]}
    >
      {icon ? <span {...stylex.props(slotStyles.leading)}>{icon}</span> : null}
      <span {...stylex.props(itemStyles.copy)}>
        <span {...stylex.props(itemStyles.label)}>{children}</span>
        {description ? (
          <span {...stylex.props(itemStyles.description)}>{description}</span>
        ) : null}
      </span>
      {endIcon ? (
        <span {...stylex.props(slotStyles.trailing)}>{endIcon}</span>
      ) : null}
    </Button>
  );
}

const contentStyles = stylex.create({
  base: {
    padding: spacing.xxs,
    gap: spacing.xxs,
    display: "grid",
    minWidth: spacing.xxxxl,
  },
});

const sectionStyles = stylex.create({
  base: {
    gap: spacing.xxxs,
    display: "grid",
  },
});

const sectionTitleStyles = stylex.create({
  base: {
    paddingInline: spacing.xs,
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    textTransform: "uppercase",
  },
});

const buttonStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    gap: spacing.xs,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    justifyContent: "stretch",
    textAlign: "left",
    minHeight: spacing.xxxl,
    width: "100%",
  },
  label: {
    minWidth: 0,
  },
});

const iconGroupStyles = stylex.create({
  base: {
    gap: spacing.sm,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.xs,
    display: "flex",
    flexWrap: "wrap",
  },
});

const iconButtonStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.round,
    backgroundColor: {
      default: colors.bg,
      ":hover": colors.bgRaised,
      ":active": colors.bgInset,
    },
    boxShadow: `0 1px 2px ${colors.overlay}`,
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    height: spacing.xxxl,
    width: spacing.xxxl,
  },
});

const itemListStyles = stylex.create({
  base: {
    gap: spacing.xxxs,
    display: "grid",
  },
});

const itemStyles = stylex.create({
  base: {
    borderRadius: radius.sm,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    alignItems: "center",
    columnGap: spacing.sm,
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    justifyContent: "stretch",
    textAlign: "left",
    minHeight: spacing.xxxl,
    width: "100%",
  },
  copy: {
    gap: spacing.xxxs,
    display: "grid",
    minWidth: 0,
  },
  label: {
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
  description: {
    color: colors.fgMuted,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
});

const slotStyles = stylex.create({
  leading: {
    borderColor: colors.border,
    borderRadius: radius.round,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    alignItems: "center",
    backgroundColor: colors.bg,
    color: colors.fgSoft,
    display: "inline-flex",
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    justifyContent: "center",
    lineHeight: 1,
    height: spacing.xxl,
    width: spacing.xxl,
  },
  trailing: {
    alignItems: "center",
    color: colors.fgMuted,
    display: "inline-flex",
    fontSize: typography.stepMinus1,
    justifyContent: "center",
    lineHeight: 1,
    minWidth: spacing.xxl,
  },
});

export { IconButton };
