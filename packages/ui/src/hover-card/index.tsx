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
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithRef<"div">;

export type HoverCardPlacement = "bottom" | "top" | "right" | "left";

export type HoverCardProps = Omit<
  BaseProps,
  "className" | "style" | "popover"
> & {
  placement?: HoverCardPlacement;
  sx?: StyleXStyles;
};

export type HoverCardContentProps = HoverCardProps;

export type HoverCardTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<HoverCardContentProps>;
  contentProps?: Omit<HoverCardContentProps, "ref">;
  fallback?: React.ReactNode;
};

export type HoverCardComponent = ReactComponent<HoverCardContentProps>;

const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders a lightweight popover surface for hover-style disclosure.
 *
 * Search aliases: hover card, preview card, hover popover, info card.
 *
 * A11y notes:
 * - Rendered with native popover positioning, but trigger wiring is left to the caller.
 * - Hover-only disclosure patterns should always be paired with keyboard and touch-accessible triggers.
 */
export function HoverCardContent({
  placement = "bottom",
  ref,
  sx,
  ...props
}: HoverCardContentProps) {
  return (
    <div
      ref={ref}
      {...props}
      popover="auto"
      role="dialog"
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sx,
      )}
    />
  );
}

export function HoverCardTrigger({
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
}: HoverCardTriggerProps) {
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shouldOpenRef = React.useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openCard = React.useCallback(() => {
    clearCloseTimer();
    shouldOpenRef.current = true;
    setMounted(true);

    const card = cardRef.current;
    if (card && !card.matches(":popover-open")) {
      showPopoverWithSource(card, triggerRef.current);
      shouldOpenRef.current = false;
    }
  }, [clearCloseTimer]);

  const hideCard = React.useCallback(
    (delay = 0) => {
      clearCloseTimer();

      const close = () => {
        const card = cardRef.current;
        if (card?.matches(":popover-open")) {
          card.hidePopover();
        }
      };

      if (delay > 0) {
        closeTimerRef.current = setTimeout(close, delay);
        return;
      }

      close();
    },
    [clearCloseTimer],
  );

  const setCardRef = React.useCallback((node: HTMLDivElement | null) => {
    cardRef.current = node;

    if (node && shouldOpenRef.current && !node.matches(":popover-open")) {
      showPopoverWithSource(node, triggerRef.current);
      shouldOpenRef.current = false;
    }

    return () => {
      clearCloseTimer();
      if (cardRef.current === node) {
        cardRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Button
        {...props}
        onBlur={(event) => {
          onBlur?.(event);
          hideCard();
        }}
        onClick={(event) => {
          onClick?.(event);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented) {
            void preload();
            openCard();
          }
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented) {
            void preload();
            openCard();
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          hideCard(120);
        }}
        ref={triggerRef}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <React.Suspense fallback={fallback}>
          <LazyContent
            {...contentProps}
            onPointerEnter={(event) => {
              contentProps?.onPointerEnter?.(event);
              clearCloseTimer();
            }}
            onPointerLeave={(event) => {
              contentProps?.onPointerLeave?.(event);
              hideCard(120);
            }}
            ref={setCardRef}
          />
        </React.Suspense>
      ) : null}
    </>
  );
}

export const HoverCard = HoverCardContent;

const baseStyles = stylex.create({
  base: {
    position: "fixed",
    margin: 0,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.md,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "auto",
    display: {
      default: null,
      ":popover-open": "block",
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
