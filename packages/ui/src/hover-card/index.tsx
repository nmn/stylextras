import { Suspense, useId, useRef, useState } from "react";
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  CSSProperties,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
} from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
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
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type DivProps = ComponentPropsWithoutRef<"div">;
type DialogProps = ComponentPropsWithoutRef<"dialog">;
type LinkProps = ComponentPropsWithRef<"a">;
type ContentEventHandler<Event> = (event: Event) => void;
type SurfacePosition = {
  left: number;
  top: number;
};

export type HoverCardPlacement = "bottom" | "top" | "right" | "left";
export type HoverCardMode = "tooltip" | "dialog";

type HoverCardOwnProps = {
  anchor?: string;
  helperText?: ReactNode;
  mode?: HoverCardMode;
  placement?: HoverCardPlacement;
  position?: SurfacePosition | null;
  ref?: Ref<HTMLDivElement | HTMLDialogElement>;
  showHelperText?: boolean;
  showSurfaceFocusRing?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
  sx?: StyleXStyles;
};

export type HoverCardProps = Omit<
  DivProps & DialogProps,
  "className" | "style" | "popover" | "ref"
> &
  HoverCardOwnProps;

export type HoverCardContentProps = HoverCardProps;

type HoverCardTriggerOwnProps = {
  content: LazyComponentLoader<HoverCardContentProps>;
  contentProps?: Omit<HoverCardContentProps, "mode" | "ref">;
  fallback?: ReactNode;
  helperText?: ReactNode;
};

export type HoverCardTriggerButtonProps = HoverCardTriggerOwnProps &
  Omit<ButtonProps, "className" | "content" | "style"> & {
    as?: "button";
  };

export type HoverCardTriggerLinkProps = HoverCardTriggerOwnProps &
  Omit<LinkProps, "className" | "content" | "style"> & {
    as: "a";
    sx?: StyleXStyles;
  };

export type HoverCardTriggerProps =
  | HoverCardTriggerButtonProps
  | HoverCardTriggerLinkProps;

export type HoverCardComponent = ReactComponent<HoverCardContentProps>;

type HoverCardOpenMode = "closed" | HoverCardMode;

const defaultHelperText = "Press the down arrow to see more.";
const tooltipCloseDelay = 220;
const tooltipOpenDelay = 180;
const bottomFallback = stylex.positionTry({ positionArea: "top" });
const topFallback = stylex.positionTry({ positionArea: "bottom" });
const rightFallback = stylex.positionTry({ positionArea: "left" });
const leftFallback = stylex.positionTry({ positionArea: "right" });

/**
 * Renders hover-card content as either a tooltip preview or a modal dialog.
 *
 * Search aliases: hover card, preview card, hover popover, info card.
 *
 * A11y notes:
 * - Tooltip mode hides rich preview content from assistive tech and announces a keyboard affordance.
 * - Dialog mode uses native <dialog> and exposes the full card content.
 */
export function HoverCardContent({
  anchor,
  children,
  helperText = defaultHelperText,
  mode = "dialog",
  placement = "bottom",
  position,
  ref,
  showHelperText = true,
  showSurfaceFocusRing = false,
  surfaceRef,
  sx,
  ...props
}: HoverCardContentProps) {
  const {
    onMouseOut,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    ...dialogProps
  } = props as DialogProps;
  const anchorProps = anchor ? ({ anchor } as Record<string, string>) : null;
  const positionStyle = position
    ? ({
        "--hover-card-left": `${position.left}px`,
        "--hover-card-top": `${position.top}px`,
      } as CSSProperties)
    : undefined;

  if (mode === "tooltip") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        {...(props as DivProps)}
        {...anchorProps}
        popover="manual"
        role="tooltip"
        {...stylex.props(
          baseStyles.base,
          placementStyles[placement],
          fallbackStyles[placement],
          sx,
        )}
      >
        <div
          aria-hidden="true"
          {...({ inert: true } as { inert: boolean })}
          {...stylex.props(contentStyles.preview)}
        >
          {children}
        </div>
        <p
          {...stylex.props(
            helperStyles.base,
            !showHelperText && helperStyles.visuallyHidden,
          )}
        >
          {helperText}
        </p>
      </div>
    );
  }

  return (
    <dialog
      ref={ref as Ref<HTMLDialogElement>}
      {...dialogProps}
      {...anchorProps}
      aria-modal="true"
      style={positionStyle}
      tabIndex={-1}
      {...stylex.props(dialogStyles.shell)}
    >
      <div
        ref={surfaceRef}
        {...anchorProps}
        onMouseOut={onMouseOut as DivProps["onMouseOut"]}
        onPointerEnter={onPointerEnter as DivProps["onPointerEnter"]}
        onPointerLeave={onPointerLeave as DivProps["onPointerLeave"]}
        onPointerMove={onPointerMove as DivProps["onPointerMove"]}
        tabIndex={-1}
        {...stylex.props(
          baseStyles.base,
          placementStyles[placement],
          fallbackStyles[placement],
          showSurfaceFocusRing && focusStyles.surface,
          sx,
        )}
      >
        <div {...stylex.props(contentStyles.preview)}>{children}</div>
      </div>
    </dialog>
  );
}

export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const {
    as = "button",
    children,
    content,
    contentProps,
    fallback = null,
    helperText = defaultHelperText,
    id,
    onBlur,
    onFocus,
    onKeyDown,
    onMouseOut,
    onPointerEnter,
    onPointerLeave,
    ref,
    sx,
    ...triggerProps
  } = props as HoverCardTriggerProps & {
    onBlur?: NonNullable<ButtonProps["onBlur"]>;
    onFocus?: NonNullable<ButtonProps["onFocus"]>;
    onKeyDown?: NonNullable<ButtonProps["onKeyDown"]>;
    onMouseOut?: NonNullable<ButtonProps["onMouseOut"]>;
    onPointerEnter?: NonNullable<ButtonProps["onPointerEnter"]>;
    onPointerLeave?: NonNullable<ButtonProps["onPointerLeave"]>;
    ref?: Ref<HTMLElement>;
    sx?: StyleXStyles;
  };
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const tooltipId = `${triggerId}-hovercard-tooltip`;
  const [mode, setMode] = useState<HoverCardOpenMode>("closed");
  const [dialogPosition, setDialogPositionState] =
    useState<SurfacePosition | null>(null);
  const [showDialogFocusRing, setShowDialogFocusRing] = useState(false);
  const [showHelperText, setShowHelperText] = useState(false);
  const modeRef = useRef<HoverCardOpenMode>("closed");
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dialogSurfaceRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogPositionRef = useRef<SurfacePosition | null>(null);
  const focusOpenSuppressedRef = useRef(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeDialogPointerTrackingRef = useRef<(() => void) | null>(null);
  const shouldOpenTooltipRef = useRef(false);
  const shouldOpenDialogRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  const describedBy =
    mode === "tooltip"
      ? [
          (triggerProps as { "aria-describedby"?: string })["aria-describedby"],
          tooltipId,
        ]
          .filter(Boolean)
          .join(" ")
      : (triggerProps as { "aria-describedby"?: string })["aria-describedby"];

  function setModeState(nextMode: HoverCardOpenMode) {
    modeRef.current = nextMode;
    setMode(nextMode);
  }

  function updateHelperTextVisibility() {
    setShowHelperText(triggerRef.current?.matches(":focus-visible") === true);
  }

  function assignRef<T>(targetRef: Ref<T> | undefined, node: T | null) {
    if (typeof targetRef === "function") {
      targetRef(node);
      return;
    }

    if (targetRef) {
      targetRef.current = node;
    }
  }

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function clearOpenTimer() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }

  function clearDialogPointerTracking() {
    removeDialogPointerTrackingRef.current?.();
    removeDialogPointerTrackingRef.current = null;
  }

  function isMouseOutWithinCurrentTarget(event: ReactMouseEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;
    return (
      nextTarget instanceof Node && event.currentTarget.contains(nextTarget)
    );
  }

  function startDialogPointerTracking(node: HTMLElement) {
    clearDialogPointerTracking();

    function handlePointerMove(event: globalThis.PointerEvent) {
      if (modeRef.current !== "dialog") {
        return;
      }

      const rect = node.getBoundingClientRect();
      const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (isOutside) {
        closeHoverCard({ restoreFocus: true });
      }
    }

    window.addEventListener("pointermove", handlePointerMove, true);
    removeDialogPointerTrackingRef.current = () => {
      window.removeEventListener("pointermove", handlePointerMove, true);
    };
  }

  function getFallbackDialogPosition(node: HTMLElement): SurfacePosition {
    const trigger = triggerRef.current;
    const triggerRect = trigger?.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const gutter = 8;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const width = nodeRect.width;
    const height = nodeRect.height;

    if (!triggerRect) {
      return {
        left: gutter,
        top: gutter,
      };
    }

    const placement = contentProps?.placement ?? "bottom";
    let left = triggerRect.left + triggerRect.width / 2 - width / 2;
    let top = triggerRect.bottom + gutter;

    if (placement === "top") {
      top = triggerRect.top - height - gutter;
    }

    if (placement === "right") {
      left = triggerRect.right + gutter;
      top = triggerRect.top + triggerRect.height / 2 - height / 2;
    }

    if (placement === "left") {
      left = triggerRect.left - width - gutter;
      top = triggerRect.top + triggerRect.height / 2 - height / 2;
    }

    return {
      left: Math.min(Math.max(left, gutter), viewportWidth - width - gutter),
      top: Math.min(Math.max(top, gutter), viewportHeight - height - gutter),
    };
  }

  function setDialogPosition(node: HTMLElement) {
    const position =
      dialogPositionRef.current ?? getFallbackDialogPosition(node);
    dialogRef.current?.style.setProperty(
      "--hover-card-left",
      `${position.left}px`,
    );
    dialogRef.current?.style.setProperty(
      "--hover-card-top",
      `${position.top}px`,
    );
  }

  function showTooltip(node: HTMLDivElement | null) {
    if (!node || isPopoverOpen(node)) {
      return;
    }

    showPopoverWithSource(node, triggerRef.current);
    shouldOpenTooltipRef.current = false;
  }

  function showDialog(node: HTMLDialogElement | null) {
    if (!node) {
      return;
    }

    if (!node.open) {
      node.showModal();
    }

    if (dialogSurfaceRef.current) {
      setDialogPosition(dialogSurfaceRef.current);
      startDialogPointerTracking(dialogSurfaceRef.current);
    }

    (dialogSurfaceRef.current ?? node).focus({ preventScroll: true });
    shouldOpenDialogRef.current = false;
  }

  function closeHoverCard({ restoreFocus = false } = {}) {
    clearOpenTimer();
    clearCloseTimer();
    shouldOpenTooltipRef.current = false;
    shouldOpenDialogRef.current = false;
    focusOpenSuppressedRef.current =
      restoreFocus || document.activeElement === triggerRef.current;

    const tooltip = tooltipRef.current;
    if (tooltip && isPopoverOpen(tooltip)) {
      hidePopoverElement(tooltip);
    }

    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
      dialog.style.removeProperty("--hover-card-left");
      dialog.style.removeProperty("--hover-card-top");
    }

    clearDialogPointerTracking();
    dialogPositionRef.current = null;
    setDialogPositionState(null);
    setShowDialogFocusRing(false);
    setModeState("closed");

    if (restoreFocus) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }

  function openTooltip({ respectFocusSuppression = true } = {}) {
    if (
      modeRef.current === "dialog" ||
      (respectFocusSuppression && focusOpenSuppressedRef.current)
    ) {
      return;
    }

    clearCloseTimer();
    updateHelperTextVisibility();
    shouldOpenTooltipRef.current = true;
    setModeState("tooltip");
    showTooltip(tooltipRef.current);
  }

  function scheduleTooltipOpen({ respectFocusSuppression = true } = {}) {
    if (
      modeRef.current === "dialog" ||
      (respectFocusSuppression && focusOpenSuppressedRef.current)
    ) {
      return;
    }

    clearOpenTimer();
    clearCloseTimer();
    updateHelperTextVisibility();
    shouldOpenTooltipRef.current = true;
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      if (shouldOpenTooltipRef.current) {
        openTooltip({ respectFocusSuppression });
      }
    }, tooltipOpenDelay);
  }

  function openDialog({ showFocusRing = false } = {}) {
    clearOpenTimer();
    clearCloseTimer();
    shouldOpenTooltipRef.current = false;
    setShowDialogFocusRing(showFocusRing);

    const tooltip = tooltipRef.current;
    if (tooltip && isPopoverOpen(tooltip)) {
      const rect = tooltip.getBoundingClientRect();
      const position = {
        left: rect.left,
        top: rect.top,
      };
      dialogPositionRef.current = position;
      setDialogPositionState(position);
      hidePopoverElement(tooltip);
    }

    shouldOpenDialogRef.current = true;
    setModeState("dialog");
    showDialog(dialogRef.current);
  }

  function scheduleTooltipClose() {
    if (modeRef.current !== "tooltip") {
      shouldOpenTooltipRef.current = false;
      clearOpenTimer();
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (modeRef.current === "tooltip") {
        closeHoverCard();
      }
    }, tooltipCloseDelay);
  }

  function setTriggerRef(node: HTMLElement | null) {
    triggerRef.current = node;
    assignRef(ref, node);
  }

  function setTooltipRef(node: HTMLDivElement | null) {
    tooltipRef.current = node;
    attachPopoverPolyfills(node);

    if (node && shouldOpenTooltipRef.current) {
      showTooltip(node);
    }

    return () => {
      clearOpenTimer();
      if (tooltipRef.current === node) {
        tooltipRef.current = null;
      }
    };
  }

  function setDialogRef(node: HTMLDialogElement | null) {
    dialogRef.current = node;

    if (node && shouldOpenDialogRef.current) {
      showDialog(node);
    }

    return () => {
      if (dialogRef.current === node) {
        dialogRef.current = null;
      }
      clearDialogPointerTracking();
    };
  }

  function setDialogSurfaceRef(node: HTMLDivElement | null) {
    dialogSurfaceRef.current = node;

    if (node && modeRef.current === "dialog") {
      setDialogPosition(node);
      startDialogPointerTracking(node);
      if (dialogRef.current?.open) {
        node.focus({ preventScroll: true });
      }
    }

    return () => {
      if (dialogSurfaceRef.current === node) {
        dialogSurfaceRef.current = null;
      }
      clearDialogPointerTracking();
    };
  }

  function handleTooltipPointerEnter(event: PointerEvent<HTMLElement>) {
    const handler = contentProps?.onPointerEnter as
      | ContentEventHandler<PointerEvent<HTMLElement>>
      | undefined;
    handler?.(event);
    if (!event.defaultPrevented) {
      clearCloseTimer();
    }
  }

  function handleTooltipPointerMove(event: PointerEvent<HTMLElement>) {
    const handler = contentProps?.onPointerMove as
      | ContentEventHandler<PointerEvent<HTMLElement>>
      | undefined;
    handler?.(event);
    if (!event.defaultPrevented) {
      openDialog({ showFocusRing: false });
    }
  }

  function handleTooltipMouseOut(event: ReactMouseEvent<HTMLElement>) {
    const handler = contentProps?.onMouseOut as
      | ContentEventHandler<ReactMouseEvent<HTMLElement>>
      | undefined;
    handler?.(event);
    if (!event.defaultPrevented && !isMouseOutWithinCurrentTarget(event)) {
      scheduleTooltipClose();
    }
  }

  function handleDialogMouseOut(event: ReactMouseEvent<HTMLElement>) {
    const handler = contentProps?.onMouseOut as
      | ContentEventHandler<ReactMouseEvent<HTMLElement>>
      | undefined;
    handler?.(event);
    if (!event.defaultPrevented && !isMouseOutWithinCurrentTarget(event)) {
      closeHoverCard({ restoreFocus: true });
    }
  }

  function handleDialogPointerLeave(event: PointerEvent<HTMLElement>) {
    const handler = contentProps?.onPointerLeave as
      | ContentEventHandler<PointerEvent<HTMLElement>>
      | undefined;
    handler?.(event);
    if (!event.defaultPrevented) {
      closeHoverCard({ restoreFocus: true });
    }
  }

  const commonTriggerProps = {
    ...triggerProps,
    "aria-describedby": describedBy || undefined,
    "aria-haspopup": "dialog",
    id: triggerId,
    onBlur: (event: Parameters<NonNullable<ButtonProps["onBlur"]>>[0]) => {
      onBlur?.(event);
      focusOpenSuppressedRef.current = false;
      if (!event.defaultPrevented && modeRef.current === "tooltip") {
        closeHoverCard();
      }
    },
    onFocus: (event: Parameters<NonNullable<ButtonProps["onFocus"]>>[0]) => {
      onFocus?.(event);
      if (!event.defaultPrevented) {
        void preload();
        scheduleTooltipOpen();
      }
    },
    onKeyDown: (
      event: Parameters<NonNullable<ButtonProps["onKeyDown"]>>[0],
    ) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (modeRef.current === "tooltip" && event.key === "ArrowDown") {
        event.preventDefault();
        openDialog({
          showFocusRing: event.currentTarget.matches(":focus-visible"),
        });
      }

      if (modeRef.current === "tooltip" && event.key === "Escape") {
        event.preventDefault();
        closeHoverCard();
      }
    },
    onMouseOut: (
      event: Parameters<NonNullable<ButtonProps["onMouseOut"]>>[0],
    ) => {
      onMouseOut?.(event);
      if (!event.defaultPrevented && !isMouseOutWithinCurrentTarget(event)) {
        scheduleTooltipClose();
      }
    },
    onPointerEnter: (
      event: Parameters<NonNullable<ButtonProps["onPointerEnter"]>>[0],
    ) => {
      onPointerEnter?.(event);
      if (!event.defaultPrevented) {
        void preload();
        scheduleTooltipOpen({ respectFocusSuppression: false });
      }
    },
    onPointerLeave: (
      event: Parameters<NonNullable<ButtonProps["onPointerLeave"]>>[0],
    ) => {
      onPointerLeave?.(event);
      if (!event.defaultPrevented) {
        scheduleTooltipClose();
      }
    },
  };

  return (
    <>
      {as === "a" ? (
        <a
          {...(commonTriggerProps as unknown as LinkProps)}
          ref={setTriggerRef as Ref<HTMLAnchorElement>}
          {...stylex.props(linkTriggerStyles.base, sx)}
        >
          {children}
        </a>
      ) : (
        <Button
          {...(commonTriggerProps as ButtonProps)}
          ref={setTriggerRef as Ref<HTMLButtonElement>}
          sx={sx}
          type={(triggerProps as ButtonProps).type ?? "button"}
        >
          {children}
        </Button>
      )}
      {mode !== "closed" ? (
        <Suspense fallback={fallback}>
          {mode === "tooltip" ? (
            <LazyContent
              {...contentProps}
              anchor={triggerId}
              helperText={helperText}
              id={tooltipId}
              mode="tooltip"
              showHelperText={showHelperText}
              onMouseOut={handleTooltipMouseOut}
              onPointerEnter={handleTooltipPointerEnter}
              onPointerLeave={(event) => {
                const handler = contentProps?.onPointerLeave as
                  | ContentEventHandler<PointerEvent<HTMLElement>>
                  | undefined;
                handler?.(event);
                if (!event.defaultPrevented) {
                  scheduleTooltipClose();
                }
              }}
              onPointerMove={handleTooltipPointerMove}
              ref={setTooltipRef}
            />
          ) : (
            <LazyContent
              {...contentProps}
              anchor={triggerId}
              mode="dialog"
              onCancel={(event) => {
                contentProps?.onCancel?.(event);
                if (!event.defaultPrevented) {
                  event.preventDefault();
                  closeHoverCard({ restoreFocus: true });
                }
              }}
              onClose={(event) => {
                contentProps?.onClose?.(event);
                closeHoverCard({ restoreFocus: true });
              }}
              onKeyDown={(event) => {
                const handler = contentProps?.onKeyDown as
                  | ContentEventHandler<KeyboardEvent<HTMLElement>>
                  | undefined;
                handler?.(event);
                if (!event.defaultPrevented && event.key === "Escape") {
                  event.preventDefault();
                  closeHoverCard({ restoreFocus: true });
                }
              }}
              onMouseOut={handleDialogMouseOut}
              onPointerLeave={handleDialogPointerLeave}
              position={dialogPosition}
              ref={setDialogRef}
              showSurfaceFocusRing={showDialogFocusRing}
              surfaceRef={setDialogSurfaceRef}
            />
          )}
        </Suspense>
      ) : null}
    </>
  );
}

export const HoverCard = HoverCardContent;

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
    outline: "none",
    backgroundColor: colors.bgRaised,
    boxShadow: elevation.md,
    color: colors.fg,
    pointerEvents: "auto",
    position: "fixed",
    left: "var(--hover-card-left, auto)",
    maxWidth: "min(320px, calc(100vw - 32px))",
    top: "var(--hover-card-top, auto)",
  },
});

const dialogStyles = stylex.create({
  shell: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
    outline: "none",
    overflow: "visible",
    backgroundColor: "transparent",
    color: "inherit",
    pointerEvents: "none",
    position: "fixed",
    height: "100vh",
    left: 0,
    maxHeight: "none",
    maxWidth: "none",
    top: 0,
    width: "100vw",
  },
});

const contentStyles = stylex.create({
  preview: {
    gap: spacing.xs,
    display: "grid",
  },
});

const focusStyles = stylex.create({
  surface: {
    boxShadow: `${elevation.md}, 0 0 0 ${stroke.thick} ${colors.focusRing}`,
  },
});

const helperStyles = stylex.create({
  base: {
    marginBlock: spacing.sm,
    marginInline: 0,
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
  visuallyHidden: {
    margin: -1,
    padding: 0,
    borderWidth: 0,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    position: "absolute",
    whiteSpace: "nowrap",
    height: 1,
    width: 1,
  },
});

const linkTriggerStyles = stylex.create({
  base: {
    borderRadius: radius.round,
    outline: "none",
    textDecoration: "underline",
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    color: colors.brand,
    display: "inline-flex",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
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
