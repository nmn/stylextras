import { Suspense, useId, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button } from "../button";
import type { ButtonProps } from "../button";
import {
  attachFocusgroupPolyfill,
  focusgroupAttributes,
  focusgroupRef,
} from "../focusgroup";
import {
  type LazyComponentLoader,
  type ReactComponent,
  showPopoverWithSource,
  useLazyComponent,
} from "../lazy-component";
import { attachPopoverPolyfills, isPopoverOpen } from "../platform-polyfills";
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
  fallback?: ReactNode;
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
 * - Uses menu semantics on the surfaced content.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
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

  function setMenuRef(node: HTMLDivElement | null) {
    attachFocusgroupPolyfill(node);
    attachPopoverPolyfills(node);
  }

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
        ref={setMenuRef}
        role="menu"
        {...focusgroupAttributes("menu")}
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
  function setContentRef(node: HTMLDivElement | null) {
    focusgroupRef(ref)(node);
    attachPopoverPolyfills(node);
  }

  return (
    <div
      ref={setContentRef}
      {...props}
      popover={behavior}
      role="menu"
      {...focusgroupAttributes("menu")}
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
  onKeyDown,
  onMouseEnter,
  onPointerEnter,
  type = "button",
  ...props
}: DropdownMenuTriggerProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pendingFocusRef = useRef<"first" | "last" | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);

  function focusMenuItem(menu: HTMLElement, position: "first" | "last") {
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [role="menuitem"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((item) => item.offsetParent !== null);
    const item = position === "first" ? items[0] : items.at(-1);
    item?.focus();
  }

  function openMenu(focusItem?: "first" | "last") {
    shouldOpenRef.current = true;
    pendingFocusRef.current = focusItem ?? null;
    setMounted(true);

    const menu = menuRef.current;
    if (menu && !isPopoverOpen(menu)) {
      showPopoverWithSource(menu, triggerRef.current);
      shouldOpenRef.current = false;
      setIsOpen(true);
      if (focusItem) {
        queueMicrotask(() => focusMenuItem(menu, focusItem));
      }
    }
  }

  function openPeerMenubarMenu() {
    const trigger = triggerRef.current;
    const menubar = trigger?.closest('[role="menubar"]');

    if (!menubar) {
      return;
    }

    const hasOpenMenu = Array.from(
      menubar.querySelectorAll<HTMLElement>("[popover]"),
    ).some(isPopoverOpen);
    if (hasOpenMenu) {
      openMenu();
    }
  }

  function setMenuRef(node: HTMLDivElement | null) {
    menuRef.current = node;
    attachFocusgroupPolyfill(node);
    attachPopoverPolyfills(node);

    function handleToggle(event: Event) {
      const state = (event as Event & { newState?: string }).newState;
      setIsOpen(state ? state === "open" : node ? isPopoverOpen(node) : false);
    }

    if (node && shouldOpenRef.current && !isPopoverOpen(node)) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
      setIsOpen(true);
      if (pendingFocusRef.current) {
        const focusItem = pendingFocusRef.current;
        pendingFocusRef.current = null;
        queueMicrotask(() => focusMenuItem(node, focusItem));
      }
    }

    if (node) {
      node.addEventListener("toggle", handleToggle);
    }

    return () => {
      node?.removeEventListener("toggle", handleToggle);
      if (menuRef.current === node) {
        menuRef.current = null;
      }
    };
  }

  return (
    <>
      <Button
        {...props}
        aria-expanded={isOpen}
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
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          const opensFirst =
            event.key === "ArrowDown" ||
            (event.key === "ArrowRight" &&
              !!triggerRef.current?.closest('[role="menu"]'));
          const opensLast = event.key === "ArrowUp";

          if (opensFirst || opensLast) {
            event.preventDefault();
            openMenu(opensLast ? "last" : "first");
          }
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          void preload();
          if (!event.defaultPrevented) {
            openPeerMenubarMenu();
          }
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          void preload();
          if (!event.defaultPrevented) {
            openPeerMenubarMenu();
          }
        }}
        ref={triggerRef}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setMenuRef} />
        </Suspense>
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
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    margin: 0,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    display: {
      default: null,
      ":popover-open": "grid",
    },
    position: "fixed",
    minWidth: spacing.xxxxl,
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
    borderRadius: radius.sm,
    borderWidth: 0,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    backgroundColor: "transparent",
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    textAlign: "left",
  },
});
