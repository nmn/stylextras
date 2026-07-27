import type { Ref } from "react";
import { assignRef as assignReactRef } from "../internal/refs";

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
const nodePolyfillPromises = new WeakMap<
  HTMLElement,
  { generation: number; promise: Promise<void> }
>();
const polyfilledNodes = new WeakSet<HTMLElement>();
const nodeGenerations = new WeakMap<HTMLElement, number>();
const lifecycleNodes = new Set<HTMLElement>();
const reinsertToggleListeners = new WeakMap<HTMLElement, () => void>();
let lifecycleObserver: MutationObserver | null = null;

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
    const cleanupRef = assignRef(ref, node);
    const detachPolyfill = attachFocusgroupPolyfill(node);

    return () => {
      detachPolyfill?.();
      cleanupRef?.();
    };
  };
}

export function attachFocusgroupPolyfill(
  node: HTMLElement | null,
): (() => void) | undefined {
  if (!node || supportsFocusgroup()) {
    return;
  }

  const generation = (nodeGenerations.get(node) ?? 0) + 1;
  nodeGenerations.set(node, generation);
  polyfilledNodes.delete(node);
  const previousRequest = nodePolyfillPromises.get(node);
  if (previousRequest && previousRequest.generation !== generation) {
    nodePolyfillPromises.delete(node);
  }

  let removeToggleListener: (() => void) | undefined;
  const stopTrackingLifecycle = trackFocusgroupLifecycle(node);

  const apply = () => {
    void ensureFocusgroupPolyfillForGeneration(node, generation)?.catch(() => {
      // The native tab order remains usable if the optional bridge cannot load.
    });
  };

  if (
    "showPopover" in HTMLElement.prototype &&
    node.hasAttribute("popover") &&
    !node.matches(":popover-open")
  ) {
    const handleToggle = () => {
      if (!node.matches(":popover-open")) return;
      node.removeEventListener("toggle", handleToggle);
      removeToggleListener = undefined;
      apply();
    };
    node.addEventListener("toggle", handleToggle);
    removeToggleListener = () => node.removeEventListener("toggle", handleToggle);
  } else {
    apply();
  }

  return () => {
    stopTrackingLifecycle();
    removeToggleListener?.();
    if (nodeGenerations.get(node) !== generation) return;
    nodeGenerations.set(node, generation + 1);
    polyfilledNodes.delete(node);
    const request = nodePolyfillPromises.get(node);
    if (request?.generation === generation) nodePolyfillPromises.delete(node);
  };
}

function trackFocusgroupLifecycle(node: HTMLElement) {
  lifecycleNodes.add(node);
  if (
    !lifecycleObserver &&
    typeof MutationObserver !== "undefined" &&
    typeof document !== "undefined" &&
    document.body
  ) {
    lifecycleObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const removedNode of record.removedNodes) {
          for (const focusgroup of lifecycleNodes) {
            if (removedNode !== focusgroup && !removedNode.contains(focusgroup)) continue;
            nodeGenerations.set(
              focusgroup,
              (nodeGenerations.get(focusgroup) ?? 0) + 1,
            );
            polyfilledNodes.delete(focusgroup);
            nodePolyfillPromises.delete(focusgroup);
          }
        }
        for (const addedNode of record.addedNodes) {
          for (const focusgroup of lifecycleNodes) {
            if (
              (addedNode !== focusgroup && !addedNode.contains(focusgroup)) ||
              !focusgroup.isConnected
            ) {
              continue;
            }
            queueMicrotask(() => {
              if (!focusgroup.isConnected) return;
              resetFocusgroupDecorations(focusgroup);
              applyReinsertedFocusgroup(focusgroup);
            });
          }
        }
      }
    });
    lifecycleObserver.observe(document.body, { childList: true, subtree: true });
  }

  return () => {
    lifecycleNodes.delete(node);
    reinsertToggleListeners.get(node)?.();
    reinsertToggleListeners.delete(node);
    if (lifecycleNodes.size !== 0) return;
    lifecycleObserver?.disconnect();
    lifecycleObserver = null;
  };
}

function applyReinsertedFocusgroup(focusgroup: HTMLElement) {
  const apply = () => {
    void ensureFocusgroupPolyfill(focusgroup)?.catch(() => {
      // Reinserted groups retain their native tab order if loading fails.
    });
  };

  if (
    "showPopover" in HTMLElement.prototype &&
    focusgroup.hasAttribute("popover") &&
    !focusgroup.matches(":popover-open")
  ) {
    reinsertToggleListeners.get(focusgroup)?.();
    const handleToggle = () => {
      if (!focusgroup.matches(":popover-open")) return;
      focusgroup.removeEventListener("toggle", handleToggle);
      reinsertToggleListeners.delete(focusgroup);
      apply();
    };
    focusgroup.addEventListener("toggle", handleToggle);
    reinsertToggleListeners.set(focusgroup, () =>
      focusgroup.removeEventListener("toggle", handleToggle),
    );
    return;
  }

  apply();
}

function resetFocusgroupDecorations(focusgroup: HTMLElement) {
  const decoratedNodes = [
    focusgroup,
    ...focusgroup.querySelectorAll<HTMLElement>(
      "[data-fg-ati], [data-fg-ir], [data-fg-item], [data-fg-seg], [data-fg-segs]",
    ),
  ];
  for (const item of decoratedNodes) {
    const authorTabIndex = item.getAttribute("data-fg-ati");
    if (authorTabIndex === "none") item.removeAttribute("tabindex");
    else if (authorTabIndex !== null) item.setAttribute("tabindex", authorTabIndex);
    if (item.hasAttribute("data-fg-ir")) item.removeAttribute("role");
    item.removeAttribute("data-fg-ati");
    item.removeAttribute("data-fg-ir");
    item.removeAttribute("data-fg-item");
    item.removeAttribute("data-fg-seg");
    item.removeAttribute("data-fg-segs");
  }
}

/** Resolves when the fallback has been applied; native focusgroup needs no wait. */
export function ensureFocusgroupPolyfill(
  node: HTMLElement,
): Promise<void> | undefined {
  return ensureFocusgroupPolyfillForGeneration(
    node,
    nodeGenerations.get(node) ?? 0,
  );
}

function ensureFocusgroupPolyfillForGeneration(
  node: HTMLElement,
  generation: number,
): Promise<void> | undefined {
  if (supportsFocusgroup()) return undefined;
  if (polyfilledNodes.has(node)) return Promise.resolve();

  const existingRequest = nodePolyfillPromises.get(node);
  if (existingRequest?.generation === generation) return existingRequest.promise;

  polyfillPromise ??= import("@microsoft/focusgroup-polyfill/shadowless");
  const nodePromise = polyfillPromise.then(
    async ({ polyfill }) => {
      if (!isCurrentConnectedNode(node, generation)) return;
      polyfill(node);
      // The polyfill discovers and decorates a newly requested focusgroup in
      // requestAnimationFrame. Resolve only after that callback has installed
      // its keyboard handlers so callers can safely move focus immediately.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (!isCurrentConnectedNode(node, generation)) return;
      polyfilledNodes.add(node);
    },
    (error: unknown) => Promise.reject(error),
  );
  nodePolyfillPromises.set(node, { generation, promise: nodePromise });
  const clearRequest = () => {
    const request = nodePolyfillPromises.get(node);
    if (request?.generation === generation) nodePolyfillPromises.delete(node);
  };
  void nodePromise.then(clearRequest, clearRequest);
  return nodePromise;
}

function isCurrentConnectedNode(node: HTMLElement, generation: number) {
  return node.isConnected && (nodeGenerations.get(node) ?? 0) === generation;
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  return assignReactRef(ref, node);
}

function supportsFocusgroup() {
  return (
    typeof HTMLElement !== "undefined" &&
    ("focusgroup" in HTMLElement.prototype ||
      "focusGroup" in HTMLElement.prototype)
  );
}
