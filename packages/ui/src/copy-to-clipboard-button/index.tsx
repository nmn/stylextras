"use client";

import * as stylex from "@stylexjs/stylex";
import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { IconButton, type IconButtonProps } from "../icon-button/index";
import { showPopoverWithSource } from "../lazy-component";
import {
  attachPopoverPolyfills,
  hidePopoverElement,
  isPopoverOpen,
} from "../platform-polyfills";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";
export type CopyToClipboardButtonProps = Omit<
  IconButtonProps,
  "children" | "label"
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
  resetAfterMs = 1500,
  size = "md",
  sx,
  type = "button",
  value,
  ...props
}: CopyToClipboardButtonProps) {
  const timeoutRef = useRef<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  function setPopoverRef(node: HTMLDivElement | null) {
    popoverRef.current = node;
    attachPopoverPolyfills(node);
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
    if (!isPopoverOpen(element)) {
      showPopoverWithSource(element, null);
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (isPopoverOpen(element)) {
        hidePopoverElement(element);
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
      <IconButton
        {...props}
        label={label}
        onClick={handleClick}
        size={size}
        sx={[triggerStyles.base, sx]}
        type={type}
      >
        {icon}
      </IconButton>
      <div
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
