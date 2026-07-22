"use client";

import * as stylex from "@stylexjs/stylex";
import { useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Button, type AccessibleButtonPropsWithout } from "../button/index";
import { showPopoverWithSource } from "../platform-polyfills/popover-source";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";
export type CopyToClipboardButtonProps = AccessibleButtonPropsWithout<
  "aria-label" | "aria-labelledby" | "children"
> & {
  copiedText?: ReactNode;
  icon?: ReactNode;
  label?: string;
  onCopy?: (value: string) => void;
  resetAfterMs?: number;
  value: string;
};
/**
 * Renders an icon button that copies text and briefly shows a popover confirmation.
 *
 * Search aliases: copy button, clipboard button, copy to clipboard, copy action.
 *
 * A11y notes:
 * - Uses native button semantics and a transient popover for visible feedback.
 * - The confirmation message is not a live region, so assistive-tech announcement may vary by browser.
 */
export function CopyToClipboardButton({
  copiedText = "Copied!",
  icon = "⧉",
  label = "Copy to clipboard",
  onClick,
  onCopy,
  ref,
  resetAfterMs = 1500,
  size = "icon",
  sx,
  type = "button",
  value,
  ...props
}: CopyToClipboardButtonProps) {
  const timeoutRef = useRef<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverId = `stylextras-copy-${useId().replaceAll(":", "")}`;
  function setPopoverRef(node: HTMLDivElement | null) {
    popoverRef.current = node;
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }
  function showCopiedPopover() {
    const element = popoverRef.current;
    if (!element) {
      return;
    }
    if (!element.matches(":popover-open")) {
      const source = triggerRef.current;
      showPopoverWithSource(element, source ?? undefined);
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (element.matches(":popover-open")) {
        element.hidePopover();
      }
    }, resetAfterMs);
  }
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    ) {
      return;
    }
    void navigator.clipboard.writeText(value).then(() => {
      onCopy?.(value);
      showCopiedPopover();
    });
  }
  return (
    <span {...stylex.props(rootStyles.base)}>
      <Button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        {...props}
        aria-label={label}
        onClick={handleClick}
        size={size}
        sx={[triggerStyles.base, sx]}
        type={type}
      >
        {icon}
      </Button>
      <div
        id={popoverId}
        ref={setPopoverRef}
        popover="manual"
        role="status"
        {...stylex.props(popoverStyles.base)}
      >
        {copiedText}
      </div>
    </span>
  );
}
const rootStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    anchorScope: "--copy-button-trigger",
    display: "inline-grid",
  },
});
const triggerStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    anchorName: "--copy-button-trigger",
  },
});
const popoverStyles = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: "--copy-button-trigger",
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: "top",
    positionTryFallbacks: stylex.positionTry({ positionArea: "bottom" }),
    margin: 0,
    borderRadius: radius.sm,
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    alignItems: {
      default: null,
      ":popover-open": "center",
    },
    backgroundColor: colors.fg,
    color: colors.bg,
    display: {
      default: null,
      ":popover-open": "inline-flex",
    },
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    justifyContent: {
      default: null,
      ":popover-open": "center",
    },
    lineHeight: typography.lineHeightSnug,
    position: "fixed",
  },
});
