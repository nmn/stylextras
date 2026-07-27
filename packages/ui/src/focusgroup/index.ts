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

type FocusgroupAttributes = {
  focusgroup: string;
};

type FocusgroupController = {
  destroy: () => void;
  refresh: () => void;
};

const focusgroupControllers = new WeakMap<HTMLElement, FocusgroupController>();
const itemSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "summary",
  "textarea",
  '[contenteditable="true"]',
  "[tabindex]",
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="tab"]',
  '[role="treeitem"]',
].join(", ");

export function focusgroupAttributes(value: FocusgroupValue): FocusgroupAttributes {
  return {
    focusgroup: value,
  };
}

export function focusgroupProps<T extends HTMLElement = HTMLElement>(value: FocusgroupValue) {
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
    const detachFallback = attachFocusgroupPolyfill(node);

    return () => {
      detachFallback?.();
      cleanupRef?.();
    };
  };
}

export function attachFocusgroupPolyfill(
  node: HTMLElement | null,
): (() => void) | undefined {
  if (!node || supportsFocusgroup()) return;

  const existing = focusgroupControllers.get(node);
  const controller = existing ?? createFocusgroupController(node);
  if (!existing) focusgroupControllers.set(node, controller);
  controller.refresh();

  return () => {
    if (focusgroupControllers.get(node) !== controller) return;
    controller.destroy();
    focusgroupControllers.delete(node);
  };
}

/** Resolves when the fallback has installed its roving-tabindex behavior. */
export function ensureFocusgroupPolyfill(node: HTMLElement): Promise<void> | undefined {
  if (supportsFocusgroup()) return undefined;
  let controller = focusgroupControllers.get(node);
  if (!controller) {
    controller = createFocusgroupController(node);
    focusgroupControllers.set(node, controller);
  }
  controller.refresh();
  return Promise.resolve();
}

function createFocusgroupController(group: HTMLElement): FocusgroupController {
  const originalTabIndexes = new Map<HTMLElement, string | null>();
  const managedItems = new Set<HTMLElement>();
  let activeItem: HTMLElement | null = null;

  const restoreItem = (item: HTMLElement) => {
    const original = originalTabIndexes.get(item);
    if (original === undefined) return;
    if (original === null) item.removeAttribute("tabindex");
    else item.setAttribute("tabindex", original);
    originalTabIndexes.delete(item);
    managedItems.delete(item);
  };

  const getItems = () =>
    Array.from(group.querySelectorAll<HTMLElement>(itemSelector)).filter(
      (item) => item.closest("[focusgroup]") === group && isAvailableItem(item),
    );

  const setActiveItem = (next: HTMLElement, items: HTMLElement[]) => {
    activeItem = next;
    for (const item of items) {
      if (!originalTabIndexes.has(item)) {
        originalTabIndexes.set(item, item.getAttribute("tabindex"));
      }
      managedItems.add(item);
      item.tabIndex = item === next ? 0 : -1;
    }
  };

  const refresh = () => {
    const items = getItems();
    for (const item of managedItems) {
      if (!items.includes(item)) restoreItem(item);
    }
    if (items.length === 0) {
      activeItem = null;
      return;
    }

    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusedItem = focused ? closestManagedItem(focused, group, items) : null;
    const startItem = items.find((item) => item.hasAttribute("focusgroupstart"));
    const authorTabStop = items.find(
      (item) => !managedItems.has(item) && item.getAttribute("tabindex") === "0",
    );
    const next =
      focusedItem ??
      (activeItem && items.includes(activeItem) ? activeItem : null) ??
      startItem ??
      authorTabStop ??
      items[0];
    if (next) setActiveItem(next, items);
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) return;
    const items = getItems();
    const item = closestManagedItem(event.target, group, items);
    if (item) setActiveItem(item, items);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !(event.target instanceof HTMLElement)
    ) {
      return;
    }
    if (!group.contains(event.target) || event.target.closest("[focusgroup]") !== group) return;

    const items = getItems();
    if (items.length === 0) return;
    const current = closestManagedItem(event.target, group, items) ?? activeItem ?? items[0];
    if (!current || shouldPreserveInputKey(current, event.key)) return;
    const currentIndex = items.indexOf(current);
    if (currentIndex < 0) return;

    const behavior = getFocusgroupBehavior(group);
    let nextIndex: number | undefined;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (behavior.inline && event.key === "ArrowRight") {
      nextIndex = currentIndex + (behavior.rtl ? -1 : 1);
    } else if (behavior.inline && event.key === "ArrowLeft") {
      nextIndex = currentIndex + (behavior.rtl ? 1 : -1);
    } else if (behavior.block && event.key === "ArrowDown") nextIndex = currentIndex + 1;
    else if (behavior.block && event.key === "ArrowUp") nextIndex = currentIndex - 1;
    else return;

    if (behavior.wrap) nextIndex = (nextIndex + items.length) % items.length;
    else nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));
    const next = items[nextIndex];
    if (!next || next === current) return;
    event.preventDefault();
    setActiveItem(next, items);
    next.focus();
  };

  const observer = new MutationObserver(refresh);
  observer.observe(group, {
    attributeFilter: ["aria-hidden", "disabled", "hidden", "inert"],
    attributes: true,
    childList: true,
    subtree: true,
  });
  group.addEventListener("focusin", handleFocusIn);
  group.ownerDocument.addEventListener("keydown", handleKeyDown);

  return {
    refresh,
    destroy() {
      observer.disconnect();
      group.removeEventListener("focusin", handleFocusIn);
      group.ownerDocument.removeEventListener("keydown", handleKeyDown);
      for (const item of [...managedItems]) restoreItem(item);
      activeItem = null;
    },
  };
}

function closestManagedItem(target: HTMLElement, group: HTMLElement, items: HTMLElement[]) {
  const item = target.closest<HTMLElement>(itemSelector);
  return item && item.closest("[focusgroup]") === group && items.includes(item) ? item : null;
}

function isAvailableItem(item: HTMLElement) {
  return (
    !item.matches(":disabled") &&
    !item.closest('[hidden], [inert], [aria-hidden="true"]')
  );
}

function shouldPreserveInputKey(item: HTMLElement, key: string) {
  if (!key.startsWith("Arrow")) return false;
  return item.matches(
    'input, select, textarea, [contenteditable="true"], [role="slider"], [role="spinbutton"]',
  );
}

function getFocusgroupBehavior(group: HTMLElement) {
  const tokens = new Set((group.getAttribute("focusgroup") ?? "").split(/\s+/).filter(Boolean));
  const role = tokens.values().next().value as string | undefined;
  const orientation = group.getAttribute("aria-orientation");
  const explicitlyInline = tokens.has("inline") || orientation === "horizontal";
  const explicitlyBlock = tokens.has("block") || orientation === "vertical";
  const inline =
    explicitlyInline ||
    (!explicitlyBlock && (role === "menubar" || role === "radiogroup" || role === "tablist"));
  const block = explicitlyBlock || (!inline && role !== "menubar");
  return {
    block,
    inline,
    rtl: group.matches(":dir(rtl)"),
    wrap: tokens.has("wrap") || role === "menu" || role === "menubar",
  };
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  return assignReactRef(ref, node);
}

function supportsFocusgroup() {
  return (
    typeof HTMLElement !== "undefined" &&
    ("focusgroup" in HTMLElement.prototype || "focusGroup" in HTMLElement.prototype)
  );
}
