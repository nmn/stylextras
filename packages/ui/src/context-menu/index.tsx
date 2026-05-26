import { Suspense, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonProps } from "../button";
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
type BaseProps = ComponentPropsWithRef<"div">;
export type ContextMenuPlacement = "bottom" | "top" | "right" | "left";
export type ContextMenuBehavior = "auto" | "manual";
export type ContextMenuProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  behavior?: ContextMenuBehavior;
  placement?: ContextMenuPlacement;
  sx?: StyleXStyles;
};
export type ContextMenuContentProps = ContextMenuProps;
export type ContextMenuTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<ContextMenuContentProps>;
  contentProps?: Omit<ContextMenuContentProps, "ref">;
  fallback?: ReactNode;
};
export type ContextMenuComponent = ReactComponent<ContextMenuContentProps>;
const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });
/**
 * Renders a menu surface using the native popover attribute and anchor positioning.
 *
 * Search aliases: context menu, right click menu, menu surface, popover menu.
 *
 * A11y notes:
 * - Uses menu semantics on the surfaced content.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function ContextMenuContent({
  behavior = "manual",
  placement = "bottom",
  ref,
  sx,
  ...props
}: ContextMenuContentProps) {
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
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sx,
      )}
    />
  );
}
export function ContextMenuTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = "button",
  ...props
}: ContextMenuTriggerProps) {
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  function openMenu() {
    shouldOpenRef.current = true;
    setMounted(true);
    const menu = menuRef.current;
    if (menu && !isPopoverOpen(menu)) {
      showPopoverWithSource(menu, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }
  function setMenuRef(node: HTMLDivElement | null) {
    menuRef.current = node;
    attachFocusgroupPolyfill(node);
    attachPopoverPolyfills(node);

    if (node && shouldOpenRef.current && !isPopoverOpen(node)) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }
    return () => {
      if (menuRef.current === node) {
        menuRef.current = null;
      }
    };
  }
  return (
    <>
      <Button
        {...props}
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
        <Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setMenuRef} />
        </Suspense>
      ) : null}
    </>
  );
}
export const ContextMenu = ContextMenuContent;
const baseStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    margin: 0,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.xxxs,
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
