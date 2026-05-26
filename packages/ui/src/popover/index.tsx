import { Suspense, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonProps } from "../button";
import {
  type LazyComponentLoader,
  type ReactComponent,
  showPopoverWithSource,
  useLazyComponent,
} from "../lazy-component";
import { attachPopoverPolyfills, isPopoverOpen } from "../platform-polyfills";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
type BaseProps = ComponentPropsWithRef<"div">;
export type PopoverSize = "sm" | "md" | "lg";
export type PopoverBehavior = "auto" | "manual";
export type PopoverPlacement = "bottom" | "top" | "right" | "left";
export type PopoverProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  behavior?: PopoverBehavior;
  placement?: PopoverPlacement;
  size?: PopoverSize;
  sx?: StyleXStyles;
};
export type PopoverContentProps = PopoverProps;
export type PopoverTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<PopoverContentProps>;
  contentProps?: Omit<PopoverContentProps, "ref">;
  fallback?: ReactNode;
};
export type PopoverComponent = ReactComponent<PopoverContentProps>;
const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });
/**
 * Renders a floating surface using the native popover attribute and CSS anchor positioning.
 *
 * Search aliases: popover, popup, floating panel, anchored content.
 *
 * A11y notes:
 * - Focus and trigger behavior are not fully managed by the component.
 * - The caller is responsible for opening, closing, and announcing the relationship to its trigger.
 */
export function PopoverContent({
  behavior = "auto",
  placement = "bottom",
  ref,
  size = "md",
  sx,
  ...props
}: PopoverContentProps) {
  function setContentRef(node: HTMLDivElement | null) {
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }

    attachPopoverPolyfills(node);

    return () => {
      if (typeof ref !== "function" && ref) {
        ref.current = null;
      }
    };
  }

  return (
    <div
      ref={setContentRef}
      {...props}
      popover={behavior}
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sizeStyles[size],
        sx,
      )}
    />
  );
}
export function PopoverTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = "button",
  ...props
}: PopoverTriggerProps) {
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  function openPopover() {
    shouldOpenRef.current = true;
    setMounted(true);
    const popover = popoverRef.current;
    if (popover && !isPopoverOpen(popover)) {
      showPopoverWithSource(popover, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }
  function setPopoverRef(node: HTMLDivElement | null) {
    popoverRef.current = node;
    attachPopoverPolyfills(node);

    if (node && shouldOpenRef.current && !isPopoverOpen(node)) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }
    return () => {
      if (popoverRef.current === node) {
        popoverRef.current = null;
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
            openPopover();
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
          <LazyContent {...contentProps} ref={setPopoverRef} />
        </Suspense>
      ) : null}
    </>
  );
}
export const Popover = PopoverContent;
const baseStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    margin: 0,
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    boxShadow: elevation.md,
    color: colors.fg,
    display: {
      default: null,
      ":popover-open": "block",
    },
    position: "fixed",
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
  bottom: {
    positionTryFallbacks: bottomFallback,
  },
  top: {
    positionTryFallbacks: topFallback,
  },
  right: {
    positionTryFallbacks: rightFallback,
  },
  left: {
    positionTryFallbacks: leftFallback,
  },
});
const sizeStyles = stylex.create({
  sm: {
    width: "min(240px, calc(100vw - 32px))",
  },
  md: {
    width: "min(320px, calc(100vw - 32px))",
  },
  lg: {
    width: "min(420px, calc(100vw - 32px))",
  },
});
