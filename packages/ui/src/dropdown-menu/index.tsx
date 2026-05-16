import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as React from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { Button } from "../button";
import type { ButtonProps } from "../button";
import {
  type LazyComponentLoader,
  type ReactComponent,
  showPopoverWithSource,
  useLazyComponent,
} from "../lazy-component";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"div">;

export type DropdownMenuPlacement = "bottom" | "top" | "right" | "left";
export type DropdownMenuBehavior = "auto" | "manual";

export type DropdownMenuProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  behavior?: DropdownMenuBehavior;
  label?: ReactNode;
  menuSx?: StyleXStyles;
  placement?: DropdownMenuPlacement;
  sx?: StyleXStyles;
  triggerSx?: StyleXStyles;
};

export type DropdownMenuContentProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  behavior?: DropdownMenuBehavior;
  placement?: DropdownMenuPlacement;
  sx?: StyleXStyles;
};

export type DropdownMenuTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<DropdownMenuContentProps>;
  contentProps?: Omit<DropdownMenuContentProps, "ref">;
  fallback?: React.ReactNode;
};

export type DropdownMenuComponent = ReactComponent<DropdownMenuContentProps>;

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
      <Button
        popoverTarget={popoverId}
        size="sm"
        type="button"
        variant="outline"
        sx={triggerSx}
      >
        {label}
      </Button>
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
            <button
              role="menuitem"
              type="button"
              {...stylex.props(itemStyles.base)}
            >
              Item one
            </button>
            <button
              role="menuitem"
              type="button"
              {...stylex.props(itemStyles.base)}
            >
              Item two
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function DropdownMenuContent({
  behavior = "auto",
  children,
  placement = "bottom",
  ref,
  sx,
  ...props
}: DropdownMenuContentProps) {
  return (
    <div
      ref={ref}
      {...props}
      popover={behavior}
      role="menu"
      {...stylex.props(
        menuStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sx,
      )}
    >
      {children ?? (
        <>
          <button
            role="menuitem"
            type="button"
            {...stylex.props(itemStyles.base)}
          >
            Item one
          </button>
          <button
            role="menuitem"
            type="button"
            {...stylex.props(itemStyles.base)}
          >
            Item two
          </button>
        </>
      )}
    </div>
  );
}

export function DropdownMenuTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = "button",
  ...props
}: DropdownMenuTriggerProps) {
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const shouldOpenRef = React.useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);

  const openMenu = React.useCallback(() => {
    shouldOpenRef.current = true;
    setMounted(true);

    const menu = menuRef.current;
    if (menu && !menu.matches(":popover-open")) {
      showPopoverWithSource(menu, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }, []);

  const setMenuRef = React.useCallback((node: HTMLDivElement | null) => {
    menuRef.current = node;

    if (node && shouldOpenRef.current && !node.matches(":popover-open")) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }

    return () => {
      if (menuRef.current === node) {
        menuRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Button
        {...props}
        aria-haspopup="menu"
        data-menu-keep-open="true"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            openMenu();
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);
          void preload();
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          void preload();
        }}
        ref={triggerRef}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <React.Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setMenuRef} />
        </React.Suspense>
      ) : null}
    </>
  );
}

const rootStyles = stylex.create({
  base: {
    display: "inline-grid",
  },
});

const menuStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    minWidth: spacing["4xl"],
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    display: {
      default: null,
      ":popover-open": "grid",
    },
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
