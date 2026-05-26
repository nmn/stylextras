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
    attachFocusgroupPolyfill(node);

    return () => {
      assignRef(ref, null);
    };
  };
}

export function attachFocusgroupPolyfill(node: HTMLElement | null) {
  if (!node || supportsFocusgroup()) {
    return;
  }

  polyfillPromise ??= import("@microsoft/focusgroup-polyfill/shadowless");
  void polyfillPromise.then(({ polyfill }) => {
    queueMicrotask(() => {
      if (node.isConnected) {
        polyfill(node);
      }
    });
  });
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
