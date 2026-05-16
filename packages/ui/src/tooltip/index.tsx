import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as React from "react";
import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonProps } from "../button";
import {
  type LazyComponentLoader,
  type ReactComponent,
  showPopoverWithSource,
  useLazyComponent,
} from "../lazy-component";
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
  fallback?: React.ReactNode;
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
  return (
    <div
      ref={ref}
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
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);
  const shouldOpenRef = React.useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);

  const openTooltip = React.useCallback(() => {
    shouldOpenRef.current = true;
    setMounted(true);

    const tooltip = tooltipRef.current;
    if (tooltip && !tooltip.matches(":popover-open")) {
      showPopoverWithSource(tooltip, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }, []);

  const hideTooltip = React.useCallback(() => {
    const tooltip = tooltipRef.current;
    if (tooltip?.matches(":popover-open")) {
      tooltip.hidePopover();
    }
  }, []);

  const setTooltipRef = React.useCallback((node: HTMLDivElement | null) => {
    tooltipRef.current = node;

    if (node && shouldOpenRef.current && !node.matches(":popover-open")) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }

    return () => {
      if (tooltipRef.current === node) {
        tooltipRef.current = null;
      }
    };
  }, []);

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
        <React.Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setTooltipRef} />
        </React.Suspense>
      ) : null}
    </>
  );
}

export const Tooltip = TooltipContent;

const baseStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    alignItems: "center",
    paddingInline: spacing.xs,
    paddingBlock: spacing["3xs"],
    borderRadius: radius.sm,
    backgroundColor: colors.fg,
    color: colors.bg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    display: {
      default: null,
      ":popover-open": "inline-flex",
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
