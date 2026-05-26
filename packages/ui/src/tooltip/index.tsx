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
import {
  attachPopoverPolyfills,
  hidePopoverElement,
  isPopoverOpen,
} from "../platform-polyfills";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";
type BaseProps = ComponentPropsWithRef<"div">;
export type TooltipPlacement = "bottom" | "top" | "right" | "left";
export type TooltipProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  placement?: TooltipPlacement;
  sx?: StyleXStyles;
};
export type TooltipContentProps = TooltipProps;
export type TooltipTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<TooltipContentProps>;
  contentProps?: Omit<TooltipContentProps, "ref">;
  fallback?: ReactNode;
};
export type TooltipComponent = ReactComponent<TooltipContentProps>;
const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });
/**
 * Renders a tooltip surface using native popover and anchor positioning.
 *
 * Search aliases: tooltip, hint, hover tip, floating label.
 *
 * A11y notes:
 * - This component renders the surfaced tooltip only.
 * - Trigger wiring, keyboard access, and open/close timing must be handled by the caller.
 */
export function TooltipContent({
  placement = "top",
  ref,
  sx,
  ...props
}: TooltipContentProps) {
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
      popover="manual"
      role="tooltip"
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sx,
      )}
    />
  );
}
export function TooltipTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onBlur,
  onClick,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  type = "button",
  ...props
}: TooltipTriggerProps) {
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  function openTooltip() {
    shouldOpenRef.current = true;
    setMounted(true);
    const tooltip = tooltipRef.current;
    if (tooltip && !isPopoverOpen(tooltip)) {
      showPopoverWithSource(tooltip, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }
  function hideTooltip() {
    const tooltip = tooltipRef.current;
    if (tooltip && isPopoverOpen(tooltip)) {
      hidePopoverElement(tooltip);
    }
  }
  function setTooltipRef(node: HTMLDivElement | null) {
    tooltipRef.current = node;
    attachPopoverPolyfills(node);

    if (node && shouldOpenRef.current && !isPopoverOpen(node)) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }
    return () => {
      if (tooltipRef.current === node) {
        tooltipRef.current = null;
      }
    };
  }
  return (
    <>
      <Button
        {...props}
        onBlur={(event) => {
          onBlur?.(event);
          hideTooltip();
        }}
        onClick={(event) => {
          onClick?.(event);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented) {
            void preload();
            openTooltip();
          }
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented) {
            void preload();
            openTooltip();
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          hideTooltip();
        }}
        ref={triggerRef}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setTooltipRef} />
        </Suspense>
      ) : null}
    </>
  );
}
export const Tooltip = TooltipContent;
const baseStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    margin: 0,
    borderRadius: radius.sm,
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    alignItems: "center",
    backgroundColor: colors.fg,
    color: colors.bg,
    display: {
      default: null,
      ":popover-open": "inline-flex",
    },
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
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
  bottom: { positionTryFallbacks: bottomFallback },
  top: { positionTryFallbacks: topFallback },
  right: { positionTryFallbacks: rightFallback },
  left: { positionTryFallbacks: leftFallback },
});
