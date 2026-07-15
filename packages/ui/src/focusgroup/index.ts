import type { Ref } from "react";

export type FocusgroupValue =
  | "menu"
  | "menubar"
  | "radiogroup"
  | "tablist"
  | "toolbar"
  | "tree"
  | `${"menu" | "menubar" | "radiogroup" | "tablist" | "toolbar" | "tree"} ${string}`;

type FocusgroupPolyfillModule =
  typeof import("@microsoft/focusgroup-polyfill/shadowless");

let polyfillPromise: Promise<FocusgroupPolyfillModule> | null = null;
const nodePolyfillPromises = new WeakMap<HTMLElement, Promise<void>>();

type FocusgroupAttributes = {
  focusgroup: string;
};

export function focusgroupAttributes(
  value: FocusgroupValue,
): FocusgroupAttributes {
  return {
    focusgroup: value,
  };
}

export function focusgroupProps<T extends HTMLElement = HTMLElement>(
  value: FocusgroupValue,
) {
  return {
    focusgroup: value,
    ref: attachFocusgroupPolyfill,
  } as {
    focusgroup: string;
    ref: Ref<T>;
  };
}

export function focusgroupStartProps(isStart: boolean) {
  return isStart ? ({ focusgroupstart: "" } as Record<string, string>) : {};
}

export function focusgroupRef<T extends HTMLElement>(ref: Ref<T> | undefined) {
  return function setFocusgroupRef(node: T | null) {
    assignRef(ref, node);
    const detachPolyfill = attachFocusgroupPolyfill(node);

    return () => {
      detachPolyfill?.();
      assignRef(ref, null);
    };
  };
}

export function attachFocusgroupPolyfill(
  node: HTMLElement | null,
): (() => void) | undefined {
  if (!node || supportsFocusgroup()) {
    return;
  }

  const apply = () => {
    void ensureFocusgroupPolyfill(node);
  };

  if (
    "showPopover" in HTMLElement.prototype &&
    node.hasAttribute("popover") &&
    !node.matches(":popover-open")
  ) {
    const handleToggle = () => {
      if (!node.matches(":popover-open")) return;
      node.removeEventListener("toggle", handleToggle);
      apply();
    };
    node.addEventListener("toggle", handleToggle);
    return () => node.removeEventListener("toggle", handleToggle);
  }

  apply();
  return undefined;
}

/** Resolves when the fallback has been applied; native focusgroup needs no wait. */
export function ensureFocusgroupPolyfill(
  node: HTMLElement,
): Promise<void> | undefined {
  if (supportsFocusgroup()) return undefined;

  const existingPromise = nodePolyfillPromises.get(node);
  if (existingPromise) return existingPromise;

  polyfillPromise ??= import("@microsoft/focusgroup-polyfill/shadowless");
  const nodePromise = polyfillPromise.then(({ polyfill }) => {
    if (node.isConnected) polyfill(node);
  });
  nodePolyfillPromises.set(node, nodePromise);
  return nodePromise;
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    ref.current = node;
  }
}

function supportsFocusgroup() {
  return (
    typeof HTMLElement !== "undefined" &&
    ("focusgroup" in HTMLElement.prototype ||
      "focusGroup" in HTMLElement.prototype)
  );
}
