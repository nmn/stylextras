"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import { Button, type ButtonProps } from "../button/index";

export type CopyToClipboardButtonProps = Omit<ButtonProps, "children"> & {
  children?: ReactNode;
  copiedChildren?: ReactNode;
  onCopy?: (value: string) => void;
  resetAfterMs?: number;
  value: string;
};

/**
 * Renders a button that copies a fixed string to the clipboard.
 *
 * Search aliases: copy button, clipboard button, copy to clipboard, copy action.
 *
 * A11y notes:
 * - Clipboard success is reflected only by the rendered content change.
 * - It does not announce copy success through a live region automatically.
 */
export function CopyToClipboardButton({
  children = "Copy",
  copiedChildren = "Copied",
  onClick,
  onCopy,
  resetAfterMs = 1500,
  value,
  ...props
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      onCopy?.(value);
      window.setTimeout(() => setCopied(false), resetAfterMs);
    });
  }

  return (
    <Button {...props} onClick={handleClick}>
      {copied ? copiedChildren : children}
    </Button>
  );
}
